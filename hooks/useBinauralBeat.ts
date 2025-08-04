import { useState, useRef, useCallback, useEffect } from 'react';
import { Frequency, SoundGenerationMode } from '../types';

const MAX_GAIN = 0.25; // Master gain ceiling
const MAX_LAYER2_GAIN = 0.20;

type SourceNodes = {
  binaural?: { left: OscillatorNode, right: OscillatorNode, merger?: ChannelMergerNode };
  pure?: { oscillator: OscillatorNode, gain: GainNode };
  ambience?: { source: AudioNode, additionalNodes: AudioNode[] };
  isochronic?: { carrier: OscillatorNode, lfo: OscillatorNode, lfoGain: GainNode, dcOffset: ConstantSourceNode };
}

type AudioSource = {
  source: AudioNode;
  nodes: SourceNodes;
  mode: SoundGenerationMode;
}

// Re-engineered for a JavaScript-driven, mathematically perfect circular orbit
type PanningControl = {
    panner: PannerNode;
    animationFrameId: React.MutableRefObject<number | null>;
    settings: React.MutableRefObject<{ enabled: boolean; speed: number; depth: number; startTime: number }>;
};

type PanningSetup = {
    outputNode: AudioNode;
    panningControl: PanningControl;
};

const safeStop = (node: AudioNode) => {
    const stoppableNode = node as AudioScheduledSourceNode;
    try {
        if (typeof stoppableNode.stop === 'function') {
            stoppableNode.stop();
        }
    } catch (e) {}
};

export const useBinauralBeat = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLayer2Active, setIsLayer2Active] = useState(false);
  
  const [mainVolume, setMainVolumeState] = useState(50);
  const [layer2Volume, setLayer2VolumeState] = useState(40);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const limiterRef = useRef<DynamicsCompressorNode | null>(null);
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const sourceNodeRef = useRef<AudioSource | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const mainPanningControlRef = useRef<PanningControl | null>(null);
  
  const layer2SourceRef = useRef<AudioSource | null>(null);
  const layer2GainNodeRef = useRef<GainNode | null>(null);
  const layer2PanningControlRef = useRef<PanningControl | null>(null);
  
  const stopOscillators = useCallback((nodes?: SourceNodes | null) => {
    if (!nodes) return;
    if (nodes.binaural) { safeStop(nodes.binaural.left); safeStop(nodes.binaural.right); }
    if (nodes.pure) { safeStop(nodes.pure.oscillator); }
    if (nodes.ambience) { 
        safeStop(nodes.ambience.source as AudioScheduledSourceNode | OscillatorNode);
        nodes.ambience.additionalNodes.forEach(safeStop);
    }
    if (nodes.isochronic) { safeStop(nodes.isochronic.carrier); safeStop(nodes.isochronic.lfo); safeStop(nodes.isochronic.dcOffset); }
  }, []);

  const createAudioSource = useCallback((
    context: AudioContext,
    freq: Frequency,
    mode: SoundGenerationMode
  ): AudioSource | null => {
      const safeGain = 0.5; // A fixed, safe gain level to prevent initial clipping.
      // If binauralFrequency is 0, it means PURE and BINAURAL would be identical.
      // Use a default beat to ensure modes are distinct for better UX.
      const beatFrequency = freq.binauralFrequency > 0 ? freq.binauralFrequency : 7.0;
      
      switch (mode) {
      case 'BINAURAL': {
        const leftOscillator = context.createOscillator();
        const rightOscillator = context.createOscillator();
        leftOscillator.type = 'sine';
        rightOscillator.type = 'sine';
        leftOscillator.frequency.setValueAtTime(freq.baseFrequency, context.currentTime);
        rightOscillator.frequency.setValueAtTime(freq.baseFrequency + beatFrequency, context.currentTime);
        
        const leftGain = context.createGain();
        leftGain.gain.value = safeGain;
        const rightGain = context.createGain();
        rightGain.gain.value = safeGain;
        leftOscillator.connect(leftGain);
        rightOscillator.connect(rightGain);

        const merger = context.createChannelMerger(2);
        leftGain.connect(merger, 0, 0);
        rightGain.connect(merger, 0, 1);
        
        leftOscillator.start();
        rightOscillator.start();
        return { source: merger, nodes: { binaural: { left: leftOscillator, right: rightOscillator, merger } }, mode };
      }
      case 'PURE': {
        const oscillator = context.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq.baseFrequency, context.currentTime);
        const gainNode = context.createGain();
        gainNode.gain.value = safeGain;
        oscillator.connect(gainNode);
        oscillator.start();
        return { source: gainNode, nodes: { pure: { oscillator, gain: gainNode } }, mode };
      }
      case 'ISOCHRONIC': {
        const carrierOsc = context.createOscillator();
        carrierOsc.type = 'sine';
        carrierOsc.frequency.setValueAtTime(freq.baseFrequency, context.currentTime);
        const boostGain = context.createGain();
        boostGain.gain.value = safeGain;

        const lfo = context.createOscillator();
        lfo.type = 'square'; // Use a square wave for a distinct on/off pulse.
        lfo.frequency.setValueAtTime(beatFrequency, context.currentTime);
        const lfoGain = context.createGain();
        lfoGain.gain.setValueAtTime(0.5, context.currentTime);
        const dcOffset = context.createConstantSource();
        dcOffset.offset.value = 0.5;
        dcOffset.start();
        lfo.connect(lfoGain);
        dcOffset.connect(lfoGain);
        const carrierGain = context.createGain();
        carrierGain.gain.setValueAtTime(0, context.currentTime);
        lfoGain.connect(carrierGain.gain);
        
        carrierOsc.connect(boostGain);
        boostGain.connect(carrierGain);

        carrierOsc.start();
        lfo.start();
        return { source: carrierGain, nodes: { isochronic: { carrier: carrierOsc, lfo, lfoGain, dcOffset } }, mode };
      }
      case 'AMBIENCE': {
        const bufferSize = context.sampleRate * 3; 
        const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        const id = freq.id;
        if (id === 'ambient-sea') {
            const noise = context.createBufferSource();
            // Use pink noise for a more natural, less harsh sound
            let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886*b0 + white*0.0555179; b1=0.99332*b1 + white*0.0750759;
                b2 = 0.96900*b2 + white*0.1538520; b3=0.86650*b3 + white*0.3104856;
                b4 = 0.55000*b4 + white*0.5329522; b5=-0.7616*b5 - white*0.0168980;
                output[i] = b0+b1+b2+b3+b4+b5+b6+white*0.5362; output[i]*=0.11; b6=white*0.115926;
            }
            noise.buffer = noiseBuffer;
            noise.loop = true;
            
            const bandpass = context.createBiquadFilter();
            bandpass.type = 'bandpass';
            bandpass.frequency.value = 600;
            bandpass.Q.value = 0.8;

            const lfo = context.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.15; // Slow wave frequency

            const lfoGain = context.createGain();
            lfoGain.gain.value = 250;
            
            lfo.connect(lfoGain);
            lfoGain.connect(bandpass.frequency);
            
            noise.connect(bandpass);
            noise.start();
            lfo.start();

            return { source: bandpass, nodes: { ambience: { source: noise, additionalNodes: [lfo, lfoGain] } }, mode };
        } else if (id === 'ambient-rain') {
            // Generate white noise
            for (let i = 0; i < bufferSize; i++) {
                output[i] = (Math.random() * 2 - 1);
            }
            const noise = context.createBufferSource();
            noise.buffer = noiseBuffer;
            noise.loop = true;

            // High-pass filter to create a 'hissing' rain sound
            const highpass = context.createBiquadFilter();
            highpass.type = 'highpass';
            highpass.frequency.setValueAtTime(1200, context.currentTime);
            highpass.Q.value = 0.7;

            // Add a gain node to control volume before returning
            const gainNode = context.createGain();
            gainNode.gain.value = 0.35; // Adjust gain for rain sound
            
            noise.connect(highpass);
            highpass.connect(gainNode);
            noise.start();

            return { source: gainNode, nodes: { ambience: { source: noise, additionalNodes: [highpass] } }, mode };
        } else {
            // General colored noise
            let lastOut = 0.0;
            let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                if(id === 'noise-white') {
                    output[i] = white * 0.5;
                } else if(id === 'noise-pink') {
                    b0 = 0.99886 * b0 + white * 0.0555179;
                    b1 = 0.99332 * b1 + white * 0.0750759;
                    b2 = 0.96900 * b2 + white * 0.1538520;
                    b3 = 0.86650 * b3 + white * 0.3104856;
                    b4 = 0.55000 * b4 + white * 0.5329522;
                    b5 = -0.7616 * b5 - white * 0.0168980;
                    output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                    output[i] *= 0.11; // Scale to prevent clipping
                    b6 = white * 0.115926;
                } else if(id === 'noise-brown') {
                    lastOut = (lastOut + (0.02 * white)) / 1.02;
                    output[i] = lastOut * 3.5;
                }
            }
        }
        
        const sourceNode = context.createBufferSource();
        sourceNode.buffer = noiseBuffer;
        sourceNode.loop = true;
        sourceNode.start();
        return { source: sourceNode, nodes: { ambience: { source: sourceNode, additionalNodes: [] } }, mode };
      }
      default:
        return null;
    }
  }, []);
  
  const setupPanning = useCallback((context: AudioContext, source: AudioNode): PanningSetup => {
    const panner = context.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'linear';
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 0.5;
    panner.positionY.setValueAtTime(0, context.currentTime);

    source.connect(panner);
    
    const panningControl: PanningControl = {
        panner,
        animationFrameId: { current: null },
        settings: { current: { enabled: false, speed: 0, depth: 0, startTime: performance.now() } }
    };
    
    return { outputNode: panner, panningControl };
  }, []);

  const teardown = useCallback(async (fullReset = false) => {
    if (mainPanningControlRef.current && mainPanningControlRef.current.animationFrameId.current) {
        cancelAnimationFrame(mainPanningControlRef.current.animationFrameId.current);
        mainPanningControlRef.current.animationFrameId.current = null;
    }
    if (layer2PanningControlRef.current && layer2PanningControlRef.current.animationFrameId.current) {
        cancelAnimationFrame(layer2PanningControlRef.current.animationFrameId.current);
        layer2PanningControlRef.current.animationFrameId.current = null;
    }

    if (sourceNodeRef.current) {
      sourceNodeRef.current.source.disconnect();
      stopOscillators(sourceNodeRef.current.nodes);
      sourceNodeRef.current = null;
    }
    if (layer2SourceRef.current) {
      layer2SourceRef.current.source.disconnect();
      stopOscillators(layer2SourceRef.current.nodes);
      layer2SourceRef.current = null;
    }

    if (gainNodeRef.current) gainNodeRef.current.disconnect();
    if (layer2GainNodeRef.current) layer2GainNodeRef.current.disconnect();

    if (fullReset) {
      setIsLayer2Active(false);
    }

    if (fullReset && audioContextRef.current && audioContextRef.current.state !== 'closed') {
      if (limiterRef.current) limiterRef.current.disconnect();
      if (analyserRef.current) analyserRef.current.disconnect();
      try {
        await audioContextRef.current.close();
      } catch (e) {
        console.error("Error closing audio context:", e);
      } finally {
        audioContextRef.current = null;
        limiterRef.current = null;
        analyserRef.current = null;
        gainNodeRef.current = null;
        layer2GainNodeRef.current = null;
        mainPanningControlRef.current = null;
        layer2PanningControlRef.current = null;
      }
    }
  }, [stopOscillators]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    if (gainNodeRef.current && layer2GainNodeRef.current && audioContextRef.current) {
        const now = audioContextRef.current.currentTime;
        gainNodeRef.current.gain.cancelScheduledValues(now);
        layer2GainNodeRef.current.gain.cancelScheduledValues(now);
        gainNodeRef.current.gain.linearRampToValueAtTime(0, now + 0.5);
        layer2GainNodeRef.current.gain.linearRampToValueAtTime(0, now + 0.5);
    }
    setTimeout(() => {
       teardown(true);
    }, 600);
    if(timerIdRef.current) {
        clearTimeout(timerIdRef.current);
        timerIdRef.current = null;
    }
  }, [teardown]);

  const pause = useCallback(() => {
    if (!isPlaying) return;
    setIsPlaying(false);
    if (audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.cancelScheduledValues(now);
        gainNodeRef.current.gain.setTargetAtTime(0, now, 0.1);
      }
      if (layer2GainNodeRef.current) {
        layer2GainNodeRef.current.gain.cancelScheduledValues(now);
        layer2GainNodeRef.current.gain.setTargetAtTime(0, now, 0.1);
      }
    }
    if(timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, [isPlaying]);

  const resume = useCallback(() => {
    if (isPlaying || !audioContextRef.current) return;
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    const now = audioContextRef.current.currentTime;
    
    if (gainNodeRef.current) {
      const newGain = MAX_GAIN * Math.pow(mainVolume / 100, 2);
      gainNodeRef.current.gain.cancelScheduledValues(now);
      gainNodeRef.current.gain.setTargetAtTime(newGain, now, 0.1);
    }
    if (layer2GainNodeRef.current && isLayer2Active) {
      const newGain = MAX_LAYER2_GAIN * Math.pow(layer2Volume / 100, 2);
      layer2GainNodeRef.current.gain.cancelScheduledValues(now);
      layer2GainNodeRef.current.gain.setTargetAtTime(newGain, now, 0.1);
    }
    setIsPlaying(true);
  }, [isPlaying, mainVolume, layer2Volume, isLayer2Active]);

  const set8dPanning = useCallback((channel: 'main' | 'layer', enabled: boolean, speed: number, depth: number) => {
    const controlRef = channel === 'main' ? mainPanningControlRef : layer2PanningControlRef;
    if (!controlRef.current || !audioContextRef.current) return;

    const control = controlRef.current;
    
    control.settings.current = { ...control.settings.current, enabled, speed, depth };
    
    // The time constant for smoothing position changes. A small value ensures responsiveness.
    const SMOOTHING_TIME_CONSTANT = 0.02;

    const loop = (now: number) => {
        const currentControl = controlRef.current;
        // Check if the loop should stop
        if (!audioContextRef.current || !currentControl || !currentControl.settings.current.enabled) {
            if (currentControl && audioContextRef.current) {
                const panner = currentControl.panner;
                const resetTime = audioContextRef.current.currentTime;
                // Smoothly return the panner to the center (0, 0, 0)
                panner.positionX.setTargetAtTime(0, resetTime, SMOOTHING_TIME_CONSTANT);
                panner.positionY.setTargetAtTime(0, resetTime, SMOOTHING_TIME_CONSTANT);
                panner.positionZ.setTargetAtTime(0, resetTime, SMOOTHING_TIME_CONSTANT);
                currentControl.animationFrameId.current = null;
            }
            return;
        }

        const { speed: currentSpeed, depth: currentDepth, startTime } = currentControl.settings.current;
        const nowInSeconds = audioContextRef.current.currentTime;
        
        // A more controlled speed curve. It starts at 0.1Hz and goes up to about 0.6Hz.
        const speedHz = 0.1 + (currentSpeed / 100) * 0.5;
        
        // A gentler, more predictable depth curve. pow(1.5) feels more natural than pow(2).
        // Capped at a max radius of 25 to avoid extreme panning.
        const radius = Math.pow(currentDepth / 100, 1.5) * 25;
        const yRadius = radius * 0.4; // Make vertical movement 40% of horizontal for a more natural feel
        
        const elapsedTime = (now - startTime) / 1000;
        const angle = elapsedTime * 2 * Math.PI * speedHz;

        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        // Use a slightly different frequency for Y-axis to create a more complex orbital path
        const y = yRadius * Math.sin(angle * 0.7);

        const panner = currentControl.panner;
        // Use setTargetAtTime for smooth, click-free position updates.
        // This delegates the interpolation to the high-priority audio thread.
        panner.positionX.setTargetAtTime(x, nowInSeconds, SMOOTHING_TIME_CONSTANT);
        panner.positionY.setTargetAtTime(y, nowInSeconds, SMOOTHING_TIME_CONSTANT);
        panner.positionZ.setTargetAtTime(z, nowInSeconds, SMOOTHING_TIME_CONSTANT);

        currentControl.animationFrameId.current = requestAnimationFrame(loop);
    };

    if (enabled && control.animationFrameId.current === null) {
        control.settings.current.startTime = performance.now();
        control.animationFrameId.current = requestAnimationFrame(loop);
    }
  }, []);
  
  const startPlayback = useCallback(async (
    mainFreq: Frequency,
    mainMode: SoundGenerationMode,
    layerFreq: Frequency | null,
    layerMode: SoundGenerationMode,
    panningConfig?: { isEnabled: boolean; speed: number; depth: number; }
  ) => {
    // Teardown previous sources; this is now safe for a persistent context
    await teardown(false);

    let context = audioContextRef.current;
    let mainGain: GainNode;
    let layer2Gain: GainNode;

    // --- Robust Graph Initialization ---
    if (!context || context.state === 'closed') {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) {
            console.error("Web Audio API is not supported in this browser.");
            alert("Your browser does not support the required Web Audio API for this application to function.");
            return;
        }
        context = new AudioContext();
        audioContextRef.current = context;

        const limiter = context.createDynamicsCompressor();
        limiter.threshold.setValueAtTime(-1.0, context.currentTime);
        limiter.knee.setValueAtTime(3.0, context.currentTime);
        limiter.ratio.setValueAtTime(12.0, context.currentTime);
        limiter.attack.setValueAtTime(0.003, context.currentTime);
        limiter.release.setValueAtTime(0.25, context.currentTime);
        
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        
        limiter.connect(analyser);
        analyser.connect(context.destination);
        
        limiterRef.current = limiter;
        analyserRef.current = analyser;

        // Create and store gain nodes for the first time
        mainGain = context.createGain();
        gainNodeRef.current = mainGain;
        layer2Gain = context.createGain();
        layer2GainNodeRef.current = layer2Gain;

    } else {
        // Reuse existing gain nodes from refs
        mainGain = gainNodeRef.current!;
        layer2Gain = layer2GainNodeRef.current!;
    }
    
    // Ensure gain nodes are connected to the limiter every time,
    // as teardown(false) disconnects them. This is the key fix.
    mainGain.connect(limiterRef.current!);
    layer2Gain.connect(limiterRef.current!);
    
    // Reset gain values before fading in
    mainGain.gain.value = 0;
    layer2Gain.gain.value = 0;

    if (context.state === 'suspended') {
      try { await context.resume(); } catch (e) { console.error("Failed to resume AudioContext:", e); return; }
    }
    
    // --- Source Creation and Connection ---
    const mainSource = createAudioSource(context, mainFreq, mainMode);
    if (mainSource) {
      sourceNodeRef.current = mainSource;
      const { outputNode, panningControl } = setupPanning(context, mainSource.source);
      mainPanningControlRef.current = panningControl;
      outputNode.connect(mainGain);
      if (panningConfig?.isEnabled) {
        set8dPanning('main', true, panningConfig.speed, panningConfig.depth);
      }
    }

    if (layerFreq) {
      const layer2Source = createAudioSource(context, layerFreq, layerMode);
      if(layer2Source) {
        layer2SourceRef.current = layer2Source;
        const { outputNode, panningControl } = setupPanning(context, layer2Source.source);
        layer2PanningControlRef.current = panningControl;
        outputNode.connect(layer2Gain);
        setIsLayer2Active(true);
        if (panningConfig?.isEnabled) {
          set8dPanning('layer', true, panningConfig.speed, panningConfig.depth);
        }
      } else {
        setIsLayer2Active(false);
      }
    } else {
      setIsLayer2Active(false);
    }
    
    // Fade in the volume
    mainGain.gain.linearRampToValueAtTime(MAX_GAIN * Math.pow(mainVolume / 100, 2), context.currentTime + 0.5);
    if (layerFreq && layer2Gain.gain) {
        layer2Gain.gain.linearRampToValueAtTime(MAX_LAYER2_GAIN * Math.pow(layer2Volume / 100, 2), context.currentTime + 0.5);
    }

    setIsPlaying(true);
  }, [teardown, createAudioSource, setupPanning, mainVolume, layer2Volume, set8dPanning]);
  
  const setTimer = useCallback((durationInSeconds: number) => {
    if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
    }
    if (durationInSeconds > 0) {
      timerIdRef.current = setTimeout(() => {
        stop();
      }, durationInSeconds * 1000);
    }
  }, [stop]);
  
    const toggleLayer = useCallback((
    freq: Frequency | null, 
    mode: SoundGenerationMode,
    is8dAudioEnabled?: boolean,
    panningSpeed?: number,
    panningDepth?: number
) => {
    const gainNode = layer2GainNodeRef.current;

    if (!audioContextRef.current || !gainNode) {
      console.warn("Audio context not ready for layer toggle.");
      return;
    }

    // Fade out and disconnect existing layer
    const now = audioContextRef.current.currentTime;
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.3);

    setTimeout(() => {
        if (layer2SourceRef.current) {
            layer2SourceRef.current.source.disconnect();
            stopOscillators(layer2SourceRef.current.nodes);
            layer2SourceRef.current = null;
        }

        if (freq && audioContextRef.current) {
            // Create and connect new layer
            const newLayerSource = createAudioSource(audioContextRef.current, freq, mode);
            if (newLayerSource) {
                layer2SourceRef.current = newLayerSource;
                const { outputNode, panningControl } = setupPanning(audioContextRef.current, newLayerSource.source);
                layer2PanningControlRef.current = panningControl;
                outputNode.connect(gainNode);
                setIsLayer2Active(true);
                
                // Set initial panning for the new layer if 8D is active
                if (is8dAudioEnabled && typeof panningSpeed === 'number' && typeof panningDepth === 'number') {
                    set8dPanning('layer', true, panningSpeed, panningDepth);
                }

                // Fade in
                gainNode.gain.linearRampToValueAtTime(MAX_LAYER2_GAIN * Math.pow(layer2Volume / 100, 2), audioContextRef.current.currentTime + 0.3);
            }
        } else {
            setIsLayer2Active(false);
        }
    }, 350);
}, [createAudioSource, setupPanning, layer2Volume, set8dPanning, stopOscillators]);

  const setMainVolume = useCallback((value: number) => {
    setMainVolumeState(value);
    if (gainNodeRef.current && audioContextRef.current) {
      const newGain = MAX_GAIN * Math.pow(value / 100, 2);
      gainNodeRef.current.gain.setTargetAtTime(newGain, audioContextRef.current.currentTime, 0.01);
    }
  }, []);

  const setLayer2Volume = useCallback((value: number) => {
    setLayer2VolumeState(value);
    if (layer2GainNodeRef.current && audioContextRef.current) {
      const newGain = MAX_LAYER2_GAIN * Math.pow(value / 100, 2);
      layer2GainNodeRef.current.gain.setTargetAtTime(newGain, audioContextRef.current.currentTime, 0.01);
    }
  }, []);
  
  // Handle browser tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume().catch(e => console.error("Failed to resume AudioContext:", e));
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => { teardown(true); };
  }, [teardown]);

  return {
    isPlaying,
    startPlayback,
    pause,
    resume,
    stop,
    setTimer,
    analyser: analyserRef.current,
    isLayer2Active,
    toggleLayer,
    mainVolume,
    setMainVolume,
    layer2Volume,
    setLayer2Volume,
    set8dPanning,
  };
};