import { useState, useRef, useCallback, useEffect } from 'react';
import { Frequency, SoundGenerationMode } from '../types';

const MAX_GAIN = 0.25; // Master gain ceiling
const MAX_LAYER2_GAIN = 0.20;
const MAX_LAYER3_GAIN = 0.20;

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
    settings: React.MutableRefObject<{ enabled: boolean; speed: number; depth: number; audioStartTime: number }>;
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
  const [isLayer3Active, setIsLayer3Active] = useState(false);
  
  const [mainVolume, setMainVolumeState] = useState(50);
  const [layer2Volume, setLayer2VolumeState] = useState(40);
  const [layer3Volume, setLayer3VolumeState] = useState(40);

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
  
  const layer3SourceRef = useRef<AudioSource | null>(null);
  const layer3GainNodeRef = useRef<GainNode | null>(null);
  // Layer 3 will not have independent panning for now to simplify UI/UX

  const breathPannerStateRef = useRef<{ enabled: boolean; channel: 'main' | 'layer' | null; radius: number }>({ enabled: false, channel: null, radius: 5 });
  
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
    panner.distanceModel = 'inverse'; // This model works well with HRTF.
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    // Key change: Set rolloffFactor to 0 to disable distance-based volume reduction.
    // This maintains the spatialization effect of HRTF without the sound "disappearing".
    panner.rolloffFactor = 0;
    panner.positionY.setValueAtTime(0, context.currentTime);

    source.connect(panner);
    
    const panningControl: PanningControl = {
        panner,
        animationFrameId: { current: null },
        settings: { current: { enabled: false, speed: 0, depth: 0, audioStartTime: 0 } }
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
    if (layer3SourceRef.current) {
      layer3SourceRef.current.source.disconnect();
      stopOscillators(layer3SourceRef.current.nodes);
      layer3SourceRef.current = null;
    }

    if (gainNodeRef.current) gainNodeRef.current.disconnect();
    if (layer2GainNodeRef.current) layer2GainNodeRef.current.disconnect();
    if (layer3GainNodeRef.current) layer3GainNodeRef.current.disconnect();

    if (fullReset) {
      setIsLayer2Active(false);
      setIsLayer3Active(false);
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
        layer3GainNodeRef.current = null;
        mainPanningControlRef.current = null;
        layer2PanningControlRef.current = null;
      }
    }
  }, [stopOscillators]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    if (audioContextRef.current) {
        const now = audioContextRef.current.currentTime;
        [gainNodeRef.current, layer2GainNodeRef.current, layer3GainNodeRef.current].forEach(gainNode => {
            if (gainNode) {
                gainNode.gain.cancelScheduledValues(now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
            }
        });
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
      [gainNodeRef.current, layer2GainNodeRef.current, layer3GainNodeRef.current].forEach(gainNode => {
         if(gainNode) {
            gainNode.gain.cancelScheduledValues(now);
            gainNode.gain.setTargetAtTime(0, now, 0.1);
         }
      });
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
      const newGain = MAX_GAIN * (mainVolume / 100);
      gainNodeRef.current.gain.cancelScheduledValues(now);
      gainNodeRef.current.gain.setTargetAtTime(newGain, now, 0.1);
    }
    if (layer2GainNodeRef.current && isLayer2Active) {
      const newGain = MAX_LAYER2_GAIN * (layer2Volume / 100);
      layer2GainNodeRef.current.gain.cancelScheduledValues(now);
      layer2GainNodeRef.current.gain.setTargetAtTime(newGain, now, 0.1);
    }
    if (layer3GainNodeRef.current && isLayer3Active) {
      const newGain = MAX_LAYER3_GAIN * (layer3Volume / 100);
      layer3GainNodeRef.current.gain.cancelScheduledValues(now);
      layer3GainNodeRef.current.gain.setTargetAtTime(newGain, now, 0.1);
    }
    setIsPlaying(true);
  }, [isPlaying, mainVolume, layer2Volume, layer3Volume, isLayer2Active, isLayer3Active]);

  const set8dPanning = useCallback((channel: 'main' | 'layer', enabled: boolean, speed: number, depth: number) => {
    const controlRef = channel === 'main' ? mainPanningControlRef : layer2PanningControlRef;
    if (!controlRef.current || !audioContextRef.current || breathPannerStateRef.current.enabled) return;

    const control = controlRef.current;
    
    control.settings.current = { ...control.settings.current, enabled, speed, depth };
    
    const SMOOTHING_TIME_CONSTANT = 0.05;

    const loop = () => {
        const currentControl = controlRef.current;
        if (!audioContextRef.current || !currentControl || !currentControl.settings.current.enabled) {
            if (currentControl && audioContextRef.current) {
                const panner = currentControl.panner;
                const resetTime = audioContextRef.current.currentTime;
                panner.positionX.setTargetAtTime(0, resetTime, SMOOTHING_TIME_CONSTANT);
                panner.positionY.setTargetAtTime(0, resetTime, SMOOTHING_TIME_CONSTANT);
                panner.positionZ.setTargetAtTime(0, resetTime, SMOOTHING_TIME_CONSTANT);
                currentControl.animationFrameId.current = null;
            }
            return;
        }

        const { speed: currentSpeed, depth: currentDepth, audioStartTime } = currentControl.settings.current;
        const nowInSeconds = audioContextRef.current.currentTime;
        const speedHz = 0.05 + (currentSpeed / 100) * 0.25;
        const radius = Math.pow(currentDepth / 100, 2) * 8 + 2;
        const yRadius = radius * 0.5;
        
        const elapsedTime = nowInSeconds - audioStartTime;
        const angle = elapsedTime * 2 * Math.PI * speedHz;

        // New infinity loop path for a more complex and spatial feel.
        const x = radius * Math.cos(angle);
        const z = (radius * 0.8) * Math.sin(2 * angle); // Creates a figure-eight pattern.
        const y = yRadius * Math.sin(angle * 0.75);

        const panner = currentControl.panner;
        panner.positionX.setTargetAtTime(x, nowInSeconds, SMOOTHING_TIME_CONSTANT);
        panner.positionY.setTargetAtTime(y, nowInSeconds, SMOOTHING_TIME_CONSTANT);
        panner.positionZ.setTargetAtTime(z, nowInSeconds, SMOOTHING_TIME_CONSTANT);

        currentControl.animationFrameId.current = requestAnimationFrame(loop);
    };

    if (enabled && control.animationFrameId.current === null) {
        control.settings.current.audioStartTime = audioContextRef.current.currentTime;
        control.animationFrameId.current = requestAnimationFrame(loop);
    }
  }, []);
  
  const startPlayback = useCallback(async (
    mainFreq: Frequency,
    mainMode: SoundGenerationMode,
    layer2Freq: Frequency | null,
    layer2Mode: SoundGenerationMode,
    layer3Freq: Frequency | null,
    layer3Mode: SoundGenerationMode,
    panningConfig?: { isEnabled: boolean; speed: number; depth: number; }
  ) => {
    await teardown(false);

    let context = audioContextRef.current;
    let mainGain: GainNode, layer2Gain: GainNode, layer3Gain: GainNode;

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

        mainGain = context.createGain(); gainNodeRef.current = mainGain;
        layer2Gain = context.createGain(); layer2GainNodeRef.current = layer2Gain;
        layer3Gain = context.createGain(); layer3GainNodeRef.current = layer3Gain;
    } else {
        mainGain = gainNodeRef.current!;
        layer2Gain = layer2GainNodeRef.current!;
        layer3Gain = layer3GainNodeRef.current!;
    }
    
    mainGain.connect(limiterRef.current!);
    layer2Gain.connect(limiterRef.current!);
    layer3Gain.connect(limiterRef.current!);
    
    mainGain.gain.value = 0;
    layer2Gain.gain.value = 0;
    layer3Gain.gain.value = 0;

    if (context.state === 'suspended') {
      try { await context.resume(); } catch (e) { console.error("Failed to resume AudioContext:", e); return; }
    }
    
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

    if (layer2Freq) {
      const layer2Source = createAudioSource(context, layer2Freq, layer2Mode);
      if(layer2Source) {
        layer2SourceRef.current = layer2Source;
        const { outputNode, panningControl } = setupPanning(context, layer2Source.source);
        layer2PanningControlRef.current = panningControl;
        outputNode.connect(layer2Gain);
        if (panningConfig?.isEnabled) {
            set8dPanning('layer', true, panningConfig.speed, panningConfig.depth);
        }
        setIsLayer2Active(true);
      } else { setIsLayer2Active(false); }
    } else { setIsLayer2Active(false); }
    
    if (layer3Freq) {
      const layer3Source = createAudioSource(context, layer3Freq, layer3Mode);
      if(layer3Source) {
        layer3SourceRef.current = layer3Source;
        // Layer 3 is always mono for now (no panning)
        layer3Source.source.connect(layer3Gain);
        setIsLayer3Active(true);
      } else { setIsLayer3Active(false); }
    } else { setIsLayer3Active(false); }

    const numLayers = 1 + (layer2Freq ? 1 : 0) + (layer3Freq ? 1 : 0);
    const gainDivisor = Math.max(1, numLayers - 0.5); // Attenuate slightly as more layers are added.

    mainGain.gain.linearRampToValueAtTime((MAX_GAIN * (mainVolume / 100)) / gainDivisor, context.currentTime + 0.5);
    if (layer2Freq) {
        layer2Gain.gain.linearRampToValueAtTime((MAX_LAYER2_GAIN * (layer2Volume / 100)) / gainDivisor, context.currentTime + 0.5);
    }
    if (layer3Freq) {
        layer3Gain.gain.linearRampToValueAtTime((MAX_LAYER3_GAIN * (layer3Volume / 100)) / gainDivisor, context.currentTime + 0.5);
    }

    setIsPlaying(true);
  }, [teardown, createAudioSource, setupPanning, mainVolume, layer2Volume, layer3Volume, set8dPanning]);
  
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
      return;
    }

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
            const newLayerSource = createAudioSource(audioContextRef.current, freq, mode);
            if (newLayerSource) {
                layer2SourceRef.current = newLayerSource;
                const { outputNode, panningControl } = setupPanning(audioContextRef.current, newLayerSource.source);
                layer2PanningControlRef.current = panningControl;
                outputNode.connect(gainNode);
                
                // Only enable 8D on the new layer if 8D is active AND breath panning is NOT
                if (is8dAudioEnabled && !breathPannerStateRef.current.enabled && typeof panningSpeed === 'number' && typeof panningDepth === 'number') {
                    set8dPanning('layer', true, panningSpeed, panningDepth);
                }
                
                setIsLayer2Active(true);
                gainNode.gain.linearRampToValueAtTime(MAX_LAYER2_GAIN * (layer2Volume / 100), audioContextRef.current.currentTime + 0.3);
            }
        } else {
            setIsLayer2Active(false);
        }
    }, 350);
}, [createAudioSource, setupPanning, layer2Volume, set8dPanning, stopOscillators]);

  const setMainVolume = useCallback((value: number) => {
    setMainVolumeState(value);
    if (gainNodeRef.current && audioContextRef.current) {
      const newGain = MAX_GAIN * (value / 100);
      gainNodeRef.current.gain.setTargetAtTime(newGain, audioContextRef.current.currentTime, 0.01);
    }
  }, []);

  const setLayer2Volume = useCallback((value: number) => {
    setLayer2VolumeState(value);
    if (layer2GainNodeRef.current && audioContextRef.current) {
      const newGain = MAX_LAYER2_GAIN * (value / 100);
      layer2GainNodeRef.current.gain.setTargetAtTime(newGain, audioContextRef.current.currentTime, 0.01);
    }
  }, []);
  
  const setLayer3Volume = useCallback((value: number) => {
    setLayer3VolumeState(value);
    if (layer3GainNodeRef.current && audioContextRef.current) {
      const newGain = MAX_LAYER3_GAIN * (value / 100);
      layer3GainNodeRef.current.gain.setTargetAtTime(newGain, audioContextRef.current.currentTime, 0.01);
    }
  }, []);

  const enableBreathPanner = useCallback((channel: 'main' | 'layer', radius: number) => {
    const controlRef = channel === 'main' ? mainPanningControlRef : layer2PanningControlRef;
    breathPannerStateRef.current = { enabled: true, channel, radius };
    if (controlRef.current) {
        controlRef.current.settings.current.enabled = false;
        if(controlRef.current.animationFrameId.current) {
            cancelAnimationFrame(controlRef.current.animationFrameId.current);
            controlRef.current.animationFrameId.current = null;
        }
    }
  }, []);

  const disableBreathPanner = useCallback(() => {
    breathPannerStateRef.current = { enabled: false, channel: null, radius: 5 };
  }, []);

  const updateBreathPanner = useCallback((channel: 'main' | 'layer', progress: number) => {
    const state = breathPannerStateRef.current;
    if (!state.enabled || state.channel !== channel) return;
    
    const controlRef = channel === 'main' ? mainPanningControlRef : layer2PanningControlRef;
    if (!controlRef.current || !audioContextRef.current) return;

    const panner = controlRef.current.panner;
    const now = audioContextRef.current.currentTime;
    const radius = state.radius;
    const SMOOTHING_TIME_CONSTANT = 0.1;

    const angle = progress * Math.PI;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle) * 0.5;
    
    panner.positionX.setTargetAtTime(x, now, SMOOTHING_TIME_CONSTANT);
    panner.positionZ.setTargetAtTime(z, now, SMOOTHING_TIME_CONSTANT);
    panner.positionY.setTargetAtTime(0, now, SMOOTHING_TIME_CONSTANT);
  }, []);

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
    isLayer3Active, // Expose layer 3 state
    toggleLayer,
    mainVolume,
    setMainVolume,
    layer2Volume,
    setLayer2Volume,
    layer3Volume, // Expose layer 3 volume controls
    setLayer3Volume,
    set8dPanning,
    enableBreathPanner,
    disableBreathPanner,
    updateBreathPanner,
  };
};