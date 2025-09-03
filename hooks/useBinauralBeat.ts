import { useState, useRef, useCallback, useEffect } from 'react';
import { Frequency, SoundGenerationMode } from '../types';

const MAX_GAIN = 0.30; // Master gain ceiling, slightly increased for more presence
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

// Re-engineered for a robust StereoPanner with a psychoacoustic gain model.
type PanningControl = {
    panner: StereoPannerNode;
    psychoacousticGain: GainNode; // for front/back volume simulation
    panningFrameId: React.MutableRefObject<ReturnType<typeof requestAnimationFrame> | null>;
    settings: React.MutableRefObject<{ enabled: boolean; speed: number; depth: number; }>;
    currentAngle: React.MutableRefObject<number>;
    lastFrameTime: React.MutableRefObject<number>;
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
      const safeGain = 0.5;
      const beatFrequency = freq.binauralFrequency > 0 ? freq.binauralFrequency : 7.0;
      
      switch (mode) {
      case 'SPLIT_BINAURAL': {
        if (typeof freq.leftFrequency === 'undefined' || typeof freq.rightFrequency === 'undefined') return null;
        const leftOscillator = context.createOscillator();
        const rightOscillator = context.createOscillator();
        leftOscillator.type = 'sine'; rightOscillator.type = 'sine';
        leftOscillator.frequency.setValueAtTime(freq.leftFrequency, context.currentTime);
        rightOscillator.frequency.setValueAtTime(freq.rightFrequency, context.currentTime);
        const leftGain = context.createGain(); const rightGain = context.createGain();
        leftGain.gain.setValueAtTime(0, context.currentTime);
        leftGain.gain.linearRampToValueAtTime(safeGain, context.currentTime + 0.01);
        rightGain.gain.setValueAtTime(0, context.currentTime);
        rightGain.gain.linearRampToValueAtTime(safeGain, context.currentTime + 0.01);
        leftOscillator.connect(leftGain); rightOscillator.connect(rightGain);
        const merger = context.createChannelMerger(2);
        leftGain.connect(merger, 0, 0); rightGain.connect(merger, 0, 1);
        leftOscillator.start(); rightOscillator.start();
        return { source: merger, nodes: { binaural: { left: leftOscillator, right: rightOscillator, merger } }, mode };
      }
      case 'BINAURAL': {
        const leftOscillator = context.createOscillator();
        const rightOscillator = context.createOscillator();
        leftOscillator.type = 'sine'; rightOscillator.type = 'sine';
        leftOscillator.frequency.setValueAtTime(freq.baseFrequency, context.currentTime);
        rightOscillator.frequency.setValueAtTime(freq.baseFrequency + beatFrequency, context.currentTime);
        const leftGain = context.createGain(); const rightGain = context.createGain();
        leftGain.gain.setValueAtTime(0, context.currentTime);
        leftGain.gain.linearRampToValueAtTime(safeGain, context.currentTime + 0.01);
        rightGain.gain.setValueAtTime(0, context.currentTime);
        rightGain.gain.linearRampToValueAtTime(safeGain, context.currentTime + 0.01);
        leftOscillator.connect(leftGain); rightOscillator.connect(rightGain);
        const merger = context.createChannelMerger(2);
        leftGain.connect(merger, 0, 0); rightGain.connect(merger, 0, 1);
        leftOscillator.start(); rightOscillator.start();
        return { source: merger, nodes: { binaural: { left: leftOscillator, right: rightOscillator, merger } }, mode };
      }
      case 'PURE': {
        const oscillator = context.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq.baseFrequency, context.currentTime);
        const gainNode = context.createGain();
        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(safeGain, context.currentTime + 0.01);
        oscillator.connect(gainNode);
        oscillator.start();
        return { source: gainNode, nodes: { pure: { oscillator, gain: gainNode } }, mode };
      }
      case 'ISOCHRONIC': {
        const carrierOsc = context.createOscillator();
        carrierOsc.type = 'sine';
        carrierOsc.frequency.setValueAtTime(freq.baseFrequency, context.currentTime);
        const boostGain = context.createGain();
        boostGain.gain.setValueAtTime(0, context.currentTime);
        boostGain.gain.linearRampToValueAtTime(safeGain, context.currentTime + 0.01);
        const lfo = context.createOscillator();
        lfo.type = 'square';
        lfo.frequency.setValueAtTime(beatFrequency, context.currentTime);
        const lfoGain = context.createGain();
        lfoGain.gain.setValueAtTime(0.5, context.currentTime);
        const dcOffset = context.createConstantSource();
        dcOffset.offset.value = 0.5;
        dcOffset.start();
        lfo.connect(lfoGain); dcOffset.connect(lfoGain);
        const carrierGain = context.createGain();
        carrierGain.gain.setValueAtTime(0, context.currentTime);
        lfoGain.connect(carrierGain.gain);
        carrierOsc.connect(boostGain);
        boostGain.connect(carrierGain);
        carrierOsc.start(); lfo.start();
        return { source: carrierGain, nodes: { isochronic: { carrier: carrierOsc, lfo, lfoGain, dcOffset } }, mode };
      }
      case 'AMBIENCE': {
        const bufferSize = context.sampleRate * 3; 
        const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        const id = freq.id;
        if (id === 'ambient-sea') {
            const noise = context.createBufferSource();
            let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886*b0 + white*0.0555179; b1=0.99332*b1 + white*0.0750759;
                b2 = 0.96900*b2 + white*0.1538520; b3=0.86650*b3 + white*0.3104856;
                b4 = 0.55000*b4 + white*0.5329522; b5=-0.7616*b5 - white*0.0168980;
                output[i] = b0+b1+b2+b3+b4+b5+b6+white*0.5362; output[i]*=0.11; b6=white*0.115926;
            }
            noise.buffer = noiseBuffer; noise.loop = true;
            const bandpass = context.createBiquadFilter();
            bandpass.type = 'bandpass'; bandpass.frequency.value = 600; bandpass.Q.value = 0.8;
            const lfo = context.createOscillator();
            lfo.type = 'sine'; lfo.frequency.value = 0.15;
            const lfoGain = context.createGain();
            lfoGain.gain.value = 250;
            lfo.connect(lfoGain); lfoGain.connect(bandpass.frequency);
            noise.connect(bandpass);
            noise.start(); lfo.start();
            return { source: bandpass, nodes: { ambience: { source: noise, additionalNodes: [lfo, lfoGain] } }, mode };
        } else if (id === 'ambient-rain') {
            for (let i = 0; i < bufferSize; i++) { output[i] = (Math.random() * 2 - 1); }
            const noise = context.createBufferSource();
            noise.buffer = noiseBuffer; noise.loop = true;
            const highpass = context.createBiquadFilter();
            highpass.type = 'highpass'; highpass.frequency.setValueAtTime(1200, context.currentTime); highpass.Q.value = 0.7;
            const gainNode = context.createGain(); gainNode.gain.value = 0.35;
            noise.connect(highpass); highpass.connect(gainNode);
            noise.start();
            return { source: gainNode, nodes: { ambience: { source: noise, additionalNodes: [highpass] } }, mode };
        } else {
            let lastOut = 0.0; let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                if(id === 'noise-white') { output[i] = white * 0.5; } 
                else if(id === 'noise-pink') {
                    b0=0.99886*b0+white*0.0555179;b1=0.99332*b1+white*0.0750759;b2=0.96900*b2+white*0.1538520;b3=0.86650*b3+white*0.3104856;
                    b4=0.55000*b4+white*0.5329522;b5=-0.7616*b5-white*0.0168980;output[i]=b0+b1+b2+b3+b4+b5+b6+white*0.5362;output[i]*=0.11;b6=white*0.115926;
                } else if(id === 'noise-brown') { lastOut = (lastOut + (0.02 * white)) / 1.02; output[i] = lastOut * 3.5; }
            }
        }
        const sourceNode = context.createBufferSource();
        sourceNode.buffer = noiseBuffer; sourceNode.loop = true; sourceNode.start();
        return { source: sourceNode, nodes: { ambience: { source: sourceNode, additionalNodes: [] } }, mode };
      }
      default: return null;
    }
  }, []);
  
  const setupPanning = useCallback((context: AudioContext, source: AudioNode): PanningSetup => {
    const panner = context.createStereoPanner();
    const psychoacousticGain = context.createGain();

    panner.pan.setValueAtTime(0, context.currentTime);
    psychoacousticGain.gain.setValueAtTime(1, context.currentTime);

    source.connect(psychoacousticGain);
    psychoacousticGain.connect(panner);
    
    const panningControl: PanningControl = {
        panner,
        psychoacousticGain,
        panningFrameId: { current: null },
        settings: { current: { enabled: false, speed: 0, depth: 0 } },
        currentAngle: { current: 0 },
        lastFrameTime: { current: 0 }
    };
    
    return { outputNode: panner, panningControl };
  }, []);

  const teardown = useCallback(async (fullReset = false) => {
    if (mainPanningControlRef.current?.panningFrameId.current) {
        cancelAnimationFrame(mainPanningControlRef.current.panningFrameId.current);
        mainPanningControlRef.current.panningFrameId.current = null;
    }
    if (layer2PanningControlRef.current?.panningFrameId.current) {
        cancelAnimationFrame(layer2PanningControlRef.current.panningFrameId.current);
        layer2PanningControlRef.current.panningFrameId.current = null;
    }

    if (sourceNodeRef.current) { sourceNodeRef.current.source.disconnect(); stopOscillators(sourceNodeRef.current.nodes); sourceNodeRef.current = null; }
    if (layer2SourceRef.current) { layer2SourceRef.current.source.disconnect(); stopOscillators(layer2SourceRef.current.nodes); layer2SourceRef.current = null; }
    if (layer3SourceRef.current) { layer3SourceRef.current.source.disconnect(); stopOscillators(layer3SourceRef.current.nodes); layer3SourceRef.current = null; }

    if (gainNodeRef.current) gainNodeRef.current.disconnect();
    if (layer2GainNodeRef.current) layer2GainNodeRef.current.disconnect();
    if (layer3GainNodeRef.current) layer3GainNodeRef.current.disconnect();

    if (fullReset) { setIsLayer2Active(false); setIsLayer3Active(false); }

    if (fullReset && audioContextRef.current && audioContextRef.current.state !== 'closed') {
      if (limiterRef.current) limiterRef.current.disconnect();
      if (analyserRef.current) analyserRef.current.disconnect();
      try {
        await audioContextRef.current.close();
      } catch (e) {
        console.error("Error closing audio context:", e);
      } finally {
        audioContextRef.current = null; limiterRef.current = null; analyserRef.current = null;
        gainNodeRef.current = null; layer2GainNodeRef.current = null; layer3GainNodeRef.current = null;
        mainPanningControlRef.current = null; layer2PanningControlRef.current = null;
      }
    }
  }, [stopOscillators]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    if (audioContextRef.current) {
        const now = audioContextRef.current.currentTime;
        [gainNodeRef.current, layer2GainNodeRef.current, layer3GainNodeRef.current].forEach(gainNode => {
            if (gainNode) { gainNode.gain.cancelScheduledValues(now); gainNode.gain.linearRampToValueAtTime(0, now + 0.5); }
        });
    }
    setTimeout(() => { teardown(true); }, 600);
    if(timerIdRef.current) { clearTimeout(timerIdRef.current); timerIdRef.current = null; }
  }, [teardown]);

  const pause = useCallback(() => {
    if (!isPlaying) return;
    setIsPlaying(false);
    if (audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      [gainNodeRef.current, layer2GainNodeRef.current, layer3GainNodeRef.current].forEach(gainNode => {
         if(gainNode) { gainNode.gain.cancelScheduledValues(now); gainNode.gain.setTargetAtTime(0, now, 0.1); }
      });
    }
    if(timerIdRef.current) { clearTimeout(timerIdRef.current); timerIdRef.current = null; }
  }, [isPlaying]);

  const resume = useCallback(() => {
    if (isPlaying || !audioContextRef.current) return;
    if (audioContextRef.current.state === 'suspended') { audioContextRef.current.resume(); }
    const now = audioContextRef.current.currentTime;
    if (gainNodeRef.current) { gainNodeRef.current.gain.cancelScheduledValues(now); gainNodeRef.current.gain.setTargetAtTime(MAX_GAIN * (mainVolume / 100), now, 0.1); }
    if (layer2GainNodeRef.current && isLayer2Active) { layer2GainNodeRef.current.gain.cancelScheduledValues(now); layer2GainNodeRef.current.gain.setTargetAtTime(MAX_LAYER2_GAIN * (layer2Volume / 100), now, 0.1); }
    if (layer3GainNodeRef.current && isLayer3Active) { layer3GainNodeRef.current.gain.cancelScheduledValues(now); layer3GainNodeRef.current.gain.setTargetAtTime(MAX_LAYER3_GAIN * (layer3Volume / 100), now, 0.1); }
    setIsPlaying(true);
  }, [isPlaying, mainVolume, layer2Volume, layer3Volume, isLayer2Active, isLayer3Active]);

  const set8dPanning = useCallback((channel: 'main' | 'layer', enabled: boolean, speed: number, depth: number) => {
    const controlRef = channel === 'main' ? mainPanningControlRef : layer2PanningControlRef;
    const sourceRef = channel === 'main' ? sourceNodeRef : layer2SourceRef;
    if (sourceRef.current?.mode === 'SPLIT_BINAURAL') { enabled = false; }
    if (!controlRef.current || !audioContextRef.current || breathPannerStateRef.current.enabled) return;

    const control = controlRef.current;
    const previousEnabledState = control.settings.current.enabled;
    control.settings.current = { ...control.settings.current, enabled, speed, depth };
    
    const SMOOTHING_TIME_CONSTANT = 0.05;

    if (enabled !== previousEnabledState) {
        if (control.panningFrameId.current) {
            cancelAnimationFrame(control.panningFrameId.current);
            control.panningFrameId.current = null;
        }

        if (enabled) {
            control.lastFrameTime.current = performance.now();
            const loop = (timestamp: number) => {
                const currentControl = controlRef.current;
                if (!audioContextRef.current || !currentControl || !currentControl.settings.current.enabled) {
                    currentControl!.panningFrameId.current = null; return;
                }
                const deltaTime = (timestamp - currentControl.lastFrameTime.current) / 1000;
                currentControl.lastFrameTime.current = timestamp;
                const { speed: currentSpeed, depth: currentDepth } = currentControl.settings.current;
                const speedHz = 0.1 + (currentSpeed / 100) * 0.2;
                currentControl.currentAngle.current += deltaTime * 2 * Math.PI * speedHz;
                const angle = currentControl.currentAngle.current;

                const panValue = Math.sin(angle) * (currentDepth / 100);
                const gainValue = 0.85 + 0.15 * Math.cos(angle);

                const panner = currentControl.panner;
                const psychoacousticGain = currentControl.psychoacousticGain;
                const nowInSeconds = audioContextRef.current.currentTime;
                panner.pan.setTargetAtTime(panValue, nowInSeconds, SMOOTHING_TIME_CONSTANT);
                psychoacousticGain.gain.setTargetAtTime(gainValue, nowInSeconds, SMOOTHING_TIME_CONSTANT);
                currentControl.panningFrameId.current = requestAnimationFrame(loop);
            };
            control.panningFrameId.current = requestAnimationFrame(loop);
        } else {
            const { panner, psychoacousticGain } = control;
            const resetTime = audioContextRef.current.currentTime;
            panner.pan.setTargetAtTime(0, resetTime, SMOOTHING_TIME_CONSTANT);
            psychoacousticGain.gain.setTargetAtTime(1, resetTime, SMOOTHING_TIME_CONSTANT);
        }
    }
  }, []);
  
  const startPlayback = useCallback(async (
    mainFreq: Frequency, mainMode: SoundGenerationMode, layer2Freq: Frequency | null, layer2Mode: SoundGenerationMode,
    layer3Freq: Frequency | null, layer3Mode: SoundGenerationMode, panningConfig?: { isEnabled: boolean; speed: number; depth: number; }
  ) => {
    await teardown(false);

    let context = audioContextRef.current;
    let mainGain: GainNode, layer2Gain: GainNode, layer3Gain: GainNode;

    if (!context || context.state === 'closed') {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) { console.error("Web Audio API is not supported."); alert("Your browser does not support Web Audio."); return; }
        context = new AudioContext(); audioContextRef.current = context;
        const limiter = context.createDynamicsCompressor();
        limiter.threshold.setValueAtTime(-3.0, context.currentTime); limiter.knee.setValueAtTime(5.0, context.currentTime);      
        limiter.ratio.setValueAtTime(10.0, context.currentTime); limiter.attack.setValueAtTime(0.005, context.currentTime);   
        limiter.release.setValueAtTime(0.25, context.currentTime);
        const analyser = context.createAnalyser(); analyser.fftSize = 256;
        limiter.connect(analyser); analyser.connect(context.destination);
        limiterRef.current = limiter; analyserRef.current = analyser;
        mainGain = context.createGain(); gainNodeRef.current = mainGain;
        layer2Gain = context.createGain(); layer2GainNodeRef.current = layer2Gain;
        layer3Gain = context.createGain(); layer3GainNodeRef.current = layer3Gain;
    } else {
        mainGain = gainNodeRef.current!; layer2Gain = layer2GainNodeRef.current!; layer3Gain = layer3GainNodeRef.current!;
    }
    
    mainGain.connect(limiterRef.current!); layer2Gain.connect(limiterRef.current!); layer3Gain.connect(limiterRef.current!);
    mainGain.gain.value = 0; layer2Gain.gain.value = 0; layer3Gain.gain.value = 0;
    if (context.state === 'suspended') { try { await context.resume(); } catch (e) { console.error("Failed to resume AudioContext:", e); return; } }
    
    const mainSource = createAudioSource(context, mainFreq, mainMode);
    if (mainSource) {
      sourceNodeRef.current = mainSource;
      const { outputNode, panningControl } = setupPanning(context, mainSource.source);
      mainPanningControlRef.current = panningControl;
      outputNode.connect(mainGain);
      if (panningConfig?.isEnabled) { set8dPanning('main', true, panningConfig.speed, panningConfig.depth); }
    }
    if (layer2Freq) {
      const layer2Source = createAudioSource(context, layer2Freq, layer2Mode);
      if(layer2Source) {
        layer2SourceRef.current = layer2Source;
        const { outputNode, panningControl } = setupPanning(context, layer2Source.source);
        layer2PanningControlRef.current = panningControl;
        outputNode.connect(layer2Gain);
        if (panningConfig?.isEnabled) { set8dPanning('layer', true, panningConfig.speed, panningConfig.depth); }
        setIsLayer2Active(true);
      } else { setIsLayer2Active(false); }
    } else { setIsLayer2Active(false); }
    if (layer3Freq) {
      const layer3Source = createAudioSource(context, layer3Freq, layer3Mode);
      if(layer3Source) {
        layer3SourceRef.current = layer3Source;
        layer3Source.source.connect(layer3Gain);
        setIsLayer3Active(true);
      } else { setIsLayer3Active(false); }
    } else { setIsLayer3Active(false); }

    const numLayers = 1 + (layer2Freq ? 1 : 0) + (layer3Freq ? 1 : 0);
    const gainDivisor = Math.max(1, numLayers - 0.5);

    mainGain.gain.linearRampToValueAtTime((MAX_GAIN * (mainVolume / 100)) / gainDivisor, context.currentTime + 0.5);
    if (layer2Freq) { layer2Gain.gain.linearRampToValueAtTime((MAX_LAYER2_GAIN * (layer2Volume / 100)) / gainDivisor, context.currentTime + 0.5); }
    if (layer3Freq) { layer3Gain.gain.linearRampToValueAtTime((MAX_LAYER3_GAIN * (layer3Volume / 100)) / gainDivisor, context.currentTime + 0.5); }
    setIsPlaying(true);
  }, [teardown, createAudioSource, setupPanning, mainVolume, layer2Volume, layer3Volume, set8dPanning]);
  
  const setTimer = useCallback((durationInSeconds: number) => {
    if (timerIdRef.current) { clearTimeout(timerIdRef.current); timerIdRef.current = null; }
    if (durationInSeconds > 0) { timerIdRef.current = setTimeout(() => { stop(); }, durationInSeconds * 1000); }
  }, [stop]);
  
    const toggleLayer2 = useCallback((
    freq: Frequency | null, mode: SoundGenerationMode, is8dAudioEnabled?: boolean,
    panningSpeed?: number, panningDepth?: number
) => {
    const gainNode = layer2GainNodeRef.current;
    if (!audioContextRef.current || !gainNode) { return; }
    const now = audioContextRef.current.currentTime;
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.3);

    setTimeout(() => {
        if (layer2SourceRef.current) {
            layer2SourceRef.current.source.disconnect(); stopOscillators(layer2SourceRef.current.nodes); layer2SourceRef.current = null;
        }
        if (freq && audioContextRef.current) {
            const newLayerSource = createAudioSource(audioContextRef.current, freq, mode);
            if (newLayerSource) {
                layer2SourceRef.current = newLayerSource;
                const { outputNode, panningControl } = setupPanning(audioContextRef.current, newLayerSource.source);
                layer2PanningControlRef.current = panningControl;
                outputNode.connect(gainNode);
                if (is8dAudioEnabled && !breathPannerStateRef.current.enabled && typeof panningSpeed === 'number' && typeof panningDepth === 'number') {
                    set8dPanning('layer', true, panningSpeed, panningDepth);
                }
                setIsLayer2Active(true);
                gainNode.gain.linearRampToValueAtTime(MAX_LAYER2_GAIN * (layer2Volume / 100), audioContextRef.current.currentTime + 0.3);
            }
        } else { setIsLayer2Active(false); }
    }, 350);
}, [createAudioSource, setupPanning, layer2Volume, set8dPanning, stopOscillators]);

  const toggleLayer3 = useCallback((freq: Frequency | null, mode: SoundGenerationMode) => {
      const gainNode = layer3GainNodeRef.current;
      if (!audioContextRef.current || !gainNode) { return; }
      const now = audioContextRef.current.currentTime;
      gainNode.gain.cancelScheduledValues(now); gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
      setTimeout(() => {
          if (layer3SourceRef.current) { layer3SourceRef.current.source.disconnect(); stopOscillators(layer3SourceRef.current.nodes); layer3SourceRef.current = null; }
          if (freq && audioContextRef.current) {
              const newLayerSource = createAudioSource(audioContextRef.current, freq, mode);
              if (newLayerSource) {
                  layer3SourceRef.current = newLayerSource; newLayerSource.source.connect(gainNode);
                  setIsLayer3Active(true);
                  gainNode.gain.linearRampToValueAtTime(MAX_LAYER3_GAIN * (layer3Volume / 100), audioContextRef.current.currentTime + 0.3);
              }
          } else { setIsLayer3Active(false); }
      }, 350);
  }, [createAudioSource, layer3Volume, stopOscillators]);

  const setMainVolume = useCallback((value: number) => {
    setMainVolumeState(value);
    if (gainNodeRef.current && audioContextRef.current) { gainNodeRef.current.gain.setTargetAtTime(MAX_GAIN * (value / 100), audioContextRef.current.currentTime, 0.01); }
  }, []);

  const setLayer2Volume = useCallback((value: number) => {
    setLayer2VolumeState(value);
    if (layer2GainNodeRef.current && audioContextRef.current) { layer2GainNodeRef.current.gain.setTargetAtTime(MAX_LAYER2_GAIN * (value / 100), audioContextRef.current.currentTime, 0.01); }
  }, []);
  
  const setLayer3Volume = useCallback((value: number) => {
    setLayer3VolumeState(value);
    if (layer3GainNodeRef.current && audioContextRef.current) { layer3GainNodeRef.current.gain.setTargetAtTime(MAX_LAYER3_GAIN * (value / 100), audioContextRef.current.currentTime, 0.01); }
  }, []);

  const enableBreathPanner = useCallback((channel: 'main' | 'layer', radius: number) => {
    breathPannerStateRef.current = { enabled: true, channel, radius };
    const controlRef = channel === 'main' ? mainPanningControlRef : layer2PanningControlRef;
    if (controlRef.current) {
        controlRef.current.settings.current.enabled = false;
        if(controlRef.current.panningFrameId.current) { cancelAnimationFrame(controlRef.current.panningFrameId.current); controlRef.current.panningFrameId.current = null; }
        const { psychoacousticGain } = controlRef.current;
        if(audioContextRef.current) psychoacousticGain.gain.setTargetAtTime(1, audioContextRef.current.currentTime, 0.05);
    }
  }, []);

  const disableBreathPanner = useCallback(() => {
    const state = breathPannerStateRef.current;
    if (state.enabled && state.channel) {
        const controlRef = state.channel === 'main' ? mainPanningControlRef : layer2PanningControlRef;
        if (controlRef.current && audioContextRef.current) {
            controlRef.current.panner.pan.setTargetAtTime(0, audioContextRef.current.currentTime, 0.1);
        }
    }
    breathPannerStateRef.current = { enabled: false, channel: null, radius: 5 };
  }, []);

  const updateBreathPanner = useCallback((channel: 'main' | 'layer', progress: number) => {
    const state = breathPannerStateRef.current;
    if (!state.enabled || state.channel !== channel) return;
    const controlRef = channel === 'main' ? mainPanningControlRef : layer2PanningControlRef;
    if (!controlRef.current || !audioContextRef.current) return;

    const { panner, psychoacousticGain } = controlRef.current;
    const now = audioContextRef.current.currentTime;
    const SMOOTHING_TIME_CONSTANT = 0.1;
    const panValue = Math.cos(progress * Math.PI);
    panner.pan.setTargetAtTime(panValue, now, SMOOTHING_TIME_CONSTANT);
    psychoacousticGain.gain.setTargetAtTime(1, now, SMOOTHING_TIME_CONSTANT);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume().catch(e => console.error("Failed to resume AudioContext:", e));
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => { document.removeEventListener('visibilitychange', handleVisibilityChange); };
  }, []);

  useEffect(() => { return () => { teardown(true); }; }, [teardown]);

  return {
    isPlaying, startPlayback, pause, resume, stop, setTimer, analyser: analyserRef.current,
    isLayer2Active, isLayer3Active, toggleLayer2, toggleLayer3, mainVolume, setMainVolume,
    layer2Volume, setLayer2Volume, layer3Volume, setLayer3Volume, set8dPanning,
    enableBreathPanner, disableBreathPanner, updateBreathPanner,
  };
};
