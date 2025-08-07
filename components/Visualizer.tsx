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
  // Separate angles for each layer for asynchronous rotation
  const anglesRef = useRef({
    core: 0,
    midPetals: 0,
    outerPetals: 0,
    loops: 0,
  });

  const getAverage = (arraySlice: Uint8Array): number => {
    if (arraySlice.length === 0) return 0;
    const sum = arraySlice.reduce((a, b) => a + b, 0);
    return sum / arraySlice.length;
  };

  const drawBohoMandala = (
    context: CanvasRenderingContext2D,
    dataArray: Uint8Array,
    bufferLength: number,
    width: number,
    height: number
  ) => {
    context.save(); // Save the default state before any transformations

    const { primary, secondary, accent } = colors;
    const angles = anglesRef.current;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.1;

    const bassSlice = dataArray.subarray(0, Math.floor(bufferLength * 0.1));
    const midSlice = dataArray.subarray(Math.floor(bufferLength * 0.1), Math.floor(bufferLength * 0.4));
    const trebleSlice = dataArray.subarray(Math.floor(bufferLength * 0.4), bufferLength);

    const bassAvg = getAverage(bassSlice) / 255;
    const midAvg = getAverage(midSlice) / 255;
    const trebleAvg = getAverage(trebleSlice) / 255;

    context.translate(centerX, centerY);

    const drawLayer = (rotation: number, drawFunction: () => void) => {
      context.save();
      context.rotate(rotation);
      drawFunction();
      context.restore();
    };

    // Layer 4: Outer Loops (farthest back)
    drawLayer(angles.loops, () => {
      context.strokeStyle = secondary;
      context.lineWidth = 1 + trebleAvg * 2;
      context.globalAlpha = 0.5 + trebleAvg * 0.3;
      const numLoops = 8;
      for (let i = 0; i < numLoops; i++) {
        context.save();
        context.rotate((i / numLoops) * 2 * Math.PI);
        context.beginPath();
        context.arc(0, -baseRadius * 2.8, baseRadius * 1.2, 0.7 * Math.PI, 0.3 * Math.PI, true);
        context.stroke();
        context.restore();
      }
    });

    // Layer 3: Outer Pointed Petals
    drawLayer(angles.outerPetals, () => {
      context.strokeStyle = accent;
      context.lineWidth = 1.5 + midAvg * 2;
      context.globalAlpha = 0.7 + midAvg * 0.3;
      const numPetals = 8;
      for (let i = 0; i < numPetals; i++) {
        context.save();
        context.rotate((i / numPetals) * 2 * Math.PI);
        context.beginPath();
        context.moveTo(0, baseRadius * 1.5);
        const tipY = baseRadius * (3.5 + bassAvg * 0.5);
        const controlX = baseRadius * 1.2;
        context.quadraticCurveTo(controlX, baseRadius * 2.5, 0, tipY);
        context.quadraticCurveTo(-controlX, baseRadius * 2.5, 0, baseRadius * 1.5);
        context.stroke();
        context.restore();
      }
    });

    // Layer 2: Mid Flower Petals
    drawLayer(angles.midPetals, () => {
      context.strokeStyle = accent;
      context.lineWidth = 2 + midAvg * 3;
      context.globalAlpha = 0.9;
      const numPetals = 8;
      for (let i = 0; i < numPetals; i++) {
        context.save();
        context.rotate((i / numPetals) * 2 * Math.PI);
        context.beginPath();
        context.moveTo(0, baseRadius * 0.8);
        const tipY = baseRadius * (2.2 + midAvg * 0.5);
        const controlX1 = baseRadius * 1.5;
        const controlY1 = baseRadius * 1.5;
        context.bezierCurveTo(controlX1, controlY1, controlX1 * 0.8, tipY, 0, tipY);
        context.bezierCurveTo(-controlX1 * 0.8, tipY, -controlX1, controlY1, 0, baseRadius * 0.8);
        context.stroke();
        context.restore();
      }
    });

    // Layer 1: Core Flower
    drawLayer(angles.core, () => {
      // Inner small petals
      context.fillStyle = `${primary}99`;
      context.strokeStyle = secondary;
      context.lineWidth = 1 + trebleAvg;
      const numCorePetals = 8;
      for (let i = 0; i < numCorePetals; i++) {
        context.save();
        context.rotate((i / numCorePetals) * 2 * Math.PI);
        context.beginPath();
        const corePetalRadius = baseRadius * (0.8 + trebleAvg * 0.2);
        context.arc(0, corePetalRadius, corePetalRadius * 0.5, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.restore();
      }
      
      // Central circle
      context.fillStyle = accent;
      context.strokeStyle = primary;
      context.lineWidth = 3;
      context.beginPath();
      context.arc(0, 0, baseRadius * (0.6 + bassAvg * 0.2), 0, 2 * Math.PI);
      context.fill();
      context.stroke();
      context.beginPath();
      context.arc(0, 0, baseRadius * 0.3, 0, 2 * Math.PI);
      context.stroke();
    });

    context.restore(); // Restore to the default state, undoing the translate
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
    
    const renderFrame = () => {
      animationFrameId.current = requestAnimationFrame(renderFrame);
      const angles = anglesRef.current;
      // Update angles for asynchronous rotation
      angles.core += 0.0005;
      angles.midPetals -= 0.0008;
      angles.outerPetals += 0.0006;
      angles.loops -= 0.0004;

      if (isPlaying && analyser) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        const decay = 0.97;
        if (dataArray[0] > 1) {
            dataArray.forEach((value, i) => dataArray[i] = value * decay);
        } else {
            dataArray.fill(0);
        }
      }
      
      const canvasWidth = canvas.width / dpr;
      const canvasHeight = canvas.height / dpr;

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      drawBohoMandala(context, dataArray, bufferLength, canvasWidth, canvasHeight);
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
