import React, { useRef, useEffect } from 'react';
import { ColorTheme } from '../types';

interface VisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  colors: ColorTheme;
}

export const Visualizer: React.FC<VisualizerProps> = ({ analyser, isPlaying, colors }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);

  const getAverage = (arraySlice: Uint8Array): number => {
    if (arraySlice.length === 0) return 0;
    const sum = arraySlice.reduce((a, b) => a + b, 0);
    return sum / arraySlice.length;
  };
  
  const darkenColor = (hex: string, percent: number): string => {
    try {
        let [r, g, b] = (hex.match(/\w\w/g) || []).map(h => parseInt(h, 16));
        if (isNaN(r) || isNaN(g) || isNaN(b)) return '#000000';
        const amount = (100 - percent) / 100;
        r = Math.floor(r * amount);
        g = Math.floor(g * amount);
        b = Math.floor(b * amount);
        return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
    } catch (e) {
        return '#000000';
    }
  };

  const drawMandala = (
    context: CanvasRenderingContext2D,
    dataArray: Uint8Array,
    bufferLength: number,
    angle: number,
    width: number,
    height: number
  ) => {
    const { primary, secondary, accent } = colors;
    const darkerPrimary = darkenColor(primary, 20);
    const darkerSecondary = darkenColor(secondary, 25);

    const centerX = width / 2;
    const centerY = height / 2;
    
    const maxRadius = Math.min(width, height) * 0.85;
    
    // Add subtle ambient movement so something is always happening
    const ambientSin = 0.05 * (1 + Math.sin(angle * 5));
    const ambientCos = 0.05 * (1 + Math.cos(angle * 3));

    const bassSlice = dataArray.subarray(0, Math.floor(bufferLength * 0.1));
    const midSlice = dataArray.subarray(Math.floor(bufferLength * 0.1), Math.floor(bufferLength * 0.4));
    
    const rawBassAvg = getAverage(bassSlice) / 255;
    const rawMidAvg = getAverage(midSlice) / 255;
    const rawOverallAvg = getAverage(dataArray) / 255;

    const bassAvg = Math.min(1, rawBassAvg + ambientSin);
    const midAvg = Math.min(1, rawMidAvg + ambientCos);
    const overallAvg = Math.min(1, rawOverallAvg + ambientCos);
    
    context.save();
    context.translate(centerX, centerY);
    
    const coreRadius = maxRadius * 0.15 + overallAvg * (maxRadius * 0.1);
    
    // --- Layer 1: Core Orb ---
    context.save();
    context.rotate(angle * 0.5);
    const coreGradient = context.createRadialGradient(0, 0, 0, 0, 0, coreRadius);
    coreGradient.addColorStop(0, `${accent}ff`);
    coreGradient.addColorStop(0.7, `${secondary}80`);
    coreGradient.addColorStop(1, `${primary}00`);

    context.beginPath();
    context.arc(0, 0, coreRadius, 0, 2 * Math.PI, false);
    context.fillStyle = coreGradient;
    context.globalAlpha = 0.9 + overallAvg * 0.1;
    context.fill();
    context.restore();

    // --- Layer 2: Mid-range Petals ---
    context.save();
    context.rotate(-angle);
    const numPetals = 8;
    const petalBaseRadius = coreRadius + maxRadius * 0.05;
    const petalLength = maxRadius * 0.1 + midAvg * (maxRadius * 0.15);
    const petalWidth = maxRadius * 0.08 + midAvg * (maxRadius * 0.05);
    context.globalAlpha = 0.6 + midAvg * 0.4;
    context.strokeStyle = darkerSecondary;
    context.lineWidth = 1.5 + midAvg * 2.5;
    for (let i = 0; i < numPetals; i++) {
      const petalAngle = (i / numPetals) * 2 * Math.PI;
      context.save(); context.rotate(petalAngle);
      context.beginPath(); context.ellipse(petalBaseRadius, 0, petalLength, petalWidth, 0, Math.PI * 0.25, Math.PI * 1.75);
      context.stroke(); context.restore();
    }
    context.restore();

    // --- Layer 3: Bass Resonance Ring ---
    context.save();
    context.rotate(angle * 0.2);
    const bassRadius = petalBaseRadius + petalLength * 0.5 + maxRadius * 0.1 + bassAvg * (maxRadius * 0.12);
    context.beginPath(); context.arc(0, 0, bassRadius, 0, 2 * Math.PI, false);
    context.strokeStyle = darkerPrimary; context.lineWidth = 2 + bassAvg * 8;
    context.globalAlpha = 0.4 + bassAvg * 0.5; context.stroke();
    context.restore();

    context.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;
    
    const parent = canvas.parentElement;
    let dpr = window.devicePixelRatio || 1;
    
    const resizeCanvas = () => {
      if(parent) {
        dpr = window.devicePixelRatio || 1;
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        context.scale(dpr, dpr);
      }
    };
    resizeCanvas();
    
    let resizeObserver: ResizeObserver | null = null;
    if (parent && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(resizeCanvas);
      resizeObserver.observe(parent);
    }
    
    const dataArray = analyser ? new Uint8Array(analyser.frequencyBinCount) : new Uint8Array(128).fill(0);
    const bufferLength = analyser ? analyser.frequencyBinCount : 128;
    
    let angle = 0;

    const renderFrame = () => {
      animationFrameId.current = requestAnimationFrame(renderFrame);
      angle += 0.0005;

      if (isPlaying && analyser) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // If not playing, decay the audio data to smoothly animate out
        if (dataArray[0] > 0) {
            const decay = 0.95;
            dataArray.forEach((value, i) => dataArray[i] = value * decay);
        } else {
            dataArray.fill(0);
        }
      }
      
      const canvasWidth = canvas.width / dpr;
      const canvasHeight = canvas.height / dpr;

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      
      // Always draw the mandala. The internal logic of drawMandala handles the ambient animation
      // when audio is not active, creating a seamless experience.
      drawMandala(context, dataArray, bufferLength, angle, canvasWidth, canvasHeight);
    };
    
    renderFrame();

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      if(parent && resizeObserver) {
        resizeObserver.unobserve(parent);
      }
    };
  }, [analyser, isPlaying, colors]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};
