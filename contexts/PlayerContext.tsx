import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { Frequency, GuidedSession, CustomStack, SoundGenerationMode, ActivityLogItem, BreathingPattern } from '../types';
import { useBinauralBeat } from '../hooks/useBinauralBeat';
import { useBreathingGuide } from '../hooks/useBreathingGuide';
import { useUserData } from './UserDataContext';
import { logMindfulMinutes } from '../services/healthService';

export type PlayableItem = Frequency | GuidedSession | CustomStack;
type UseBinauralBeatReturn = ReturnType<typeof useBinauralBeat>;
type UseBreathingGuideReturn = ReturnType<typeof useBreathingGuide>;

interface PlayerContextType extends Omit<UseBinauralBeatReturn, 'startPlayback' | 'pause' | 'resume' | 'stop' | 'toggleLayer2' | 'toggleLayer3' | 'setTimer'>, UseBreathingGuideReturn {
  currentlyPlayingItem: PlayableItem | null;
  lastCompletedSession: { id: string; name: string } | null;
  clearLastCompletedSession: () => void;
  startPlayback: (
    itemToPlay: PlayableItem,
    allFrequenciesData: Frequency[],
    mainAudioFreq: Frequency,
    mainMode: SoundGenerationMode,
    layer2Freq: Frequency | null,
    layer2Mode: SoundGenerationMode,
    layer3Freq: Frequency | null,
    layer3Mode: SoundGenerationMode,
    options?: { enableBreathPanner?: boolean }
  ) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setTimer: (duration: number) => void;
  activeTimer: number;
  timeRemaining: number;
  toggleLayer2: (freq: Frequency | null, mode: SoundGenerationMode) => void;
  toggleLayer3: (freq: Frequency | null, mode: SoundGenerationMode) => void;
  sessionStepIndex: number;
  sessionTimeInStep: number;
  is8dEnabled: boolean;
  setIs8dEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  panningSpeed: number;
  setPanningSpeed: React.Dispatch<React.SetStateAction<number>>;
  panningDepth: number;
  setPanningDepth: React.Dispatch<React.SetStateAction<number>>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentlyPlayingItem, setCurrentlyPlayingItem] = useState<PlayableItem | null>(null);
  const [sessionStepIndex, setSessionStepIndex] = useState(0);
  const [sessionTimeInStep, setSessionTimeInStep] = useState(0);
  const [activeLogItem, setActiveLogItem] = useState<ActivityLogItem | null>(null);
  const [lastCompletedSession, setLastCompletedSession] = useState<{ id: string; name: string } | null>(null);
  const [activeTimer, setActiveTimer] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const [is8dEnabled, setIs8dEnabled] = useState(false);
  const [panningSpeed, setPanningSpeed] = useState(30);
  const [panningDepth, setPanningDepth] = useState(50);
  const [isBreathPanningActive, setIsBreathPanningActive] = useState(false);
  
  const timerEndTimeRef = useRef<number | null>(null);
  const audioHook = useBinauralBeat();
  const breathingHook = useBreathingGuide();
  const { setActivityLog } = useUserData();

  // Destructure hook returns to stabilize callbacks and prevent re-renders.
  const {
    isPlaying,
    stop: stopAudio,
    pause: pauseAudio,
    resume: resumeAudio,
    setTimer: setAudioHookTimer,
    startPlayback: startAudioPlayback,
    toggleLayer2: toggleAudioLayer2,
    toggleLayer3: toggleAudioLayer3,
    enableBreathPanner,
    disableBreathPanner,
    set8dPanning,
    isLayer2Active
  } = audioHook;
  const { stopGuide: stopBreathingGuideInternal, startGuide: startBreathingGuideInternal } = breathingHook;

  const allFrequenciesRef = useRef<Frequency[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeLogItemRef = useRef(activeLogItem);
  activeLogItemRef.current = activeLogItem;
  
  const totalSessionTimeElapsedRef = useRef(0);
  
  const clearLastCompletedSession = useCallback(() => {
    setLastCompletedSession(null);
  }, []);

  const logSessionActivity = useCallback((session: { id: string, name: string, duration?: number }): ActivityLogItem => {
    const newItem: ActivityLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      activityId: 'session',
      timestamp: Date.now(),
      details: {
        name: session.name,
        notes: '',
        duration: session.duration ? Math.round(session.duration / 60) : undefined,
      }
    };
    setActivityLog(prev => [...prev, newItem]);
    return newItem;
  }, [setActivityLog]);
  
  const updateActivityLogItem = useCallback((itemToUpdate: ActivityLogItem) => {
    setActivityLog(prev => prev.map(item => item.id === itemToUpdate.id ? itemToUpdate : item));
  }, [setActivityLog]);

  const finalizeLogItem = useCallback(() => {
    if (activeLogItemRef.current && currentlyPlayingItem) {
      const isSession = 'steps' in currentlyPlayingItem;
      const durationSeconds = isSession
        ? totalSessionTimeElapsedRef.current
        : (Date.now() - activeLogItemRef.current.timestamp) / 1000;
      
      if (durationSeconds > 1) { 
        updateActivityLogItem({
          ...activeLogItemRef.current,
          details: { ...activeLogItemRef.current.details, duration: Math.round(durationSeconds / 60) },
        });
        logMindfulMinutes(durationSeconds);
      }
      setActiveLogItem(null);
    }
  }, [currentlyPlayingItem, updateActivityLogItem]);
  
  const setTimer = useCallback((duration: number) => {
    setAudioHookTimer(duration);
    setActiveTimer(duration);
    if (duration > 0) {
        setTimeRemaining(duration);
        timerEndTimeRef.current = Date.now() + duration * 1000;
    } else {
        setTimeRemaining(0);
        timerEndTimeRef.current = null;
    }
  }, [setAudioHookTimer]);

  const stopGuide = useCallback(() => {
      stopBreathingGuideInternal();
      if (isBreathPanningActive) {
          disableBreathPanner();
          setIsBreathPanningActive(false);
          if (is8dEnabled) {
              set8dPanning('main', true, panningSpeed, panningDepth);
              if(isLayer2Active) {
                set8dPanning('layer', true, panningSpeed, panningDepth);
              }
          }
      }
  }, [stopBreathingGuideInternal, isBreathPanningActive, disableBreathPanner, is8dEnabled, set8dPanning, panningSpeed, panningDepth, isLayer2Active]);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    if (currentlyPlayingItem && 'steps' in currentlyPlayingItem && totalSessionTimeElapsedRef.current >= 300) { // 5 min check
        setLastCompletedSession({ id: currentlyPlayingItem.id, name: currentlyPlayingItem.title });
    } else {
        setLastCompletedSession(null);
    }
    
    finalizeLogItem();
    stopAudio();
    stopGuide();
    setTimer(0);
    setCurrentlyPlayingItem(null);
    setSessionStepIndex(0);
    setSessionTimeInStep(0);
    totalSessionTimeElapsedRef.current = 0;
  }, [stopAudio, finalizeLogItem, stopGuide, currentlyPlayingItem, setTimer]);

  const pause = useCallback(() => {
    finalizeLogItem();
    pauseAudio();
  }, [pauseAudio, finalizeLogItem]);
  
  const resume = useCallback(() => {
    if (currentlyPlayingItem) {
      const newItem = logSessionActivity({ id: currentlyPlayingItem.id, name: 'name' in currentlyPlayingItem ? currentlyPlayingItem.name : currentlyPlayingItem.title });
      setActiveLogItem(newItem);
    }
    resumeAudio();
  }, [resumeAudio, currentlyPlayingItem, logSessionActivity]);

  const startPlayback = useCallback((
    itemToPlay: PlayableItem,
    allFrequenciesData: Frequency[],
    mainAudioFreq: Frequency,
    mainMode: SoundGenerationMode,
    layer2Freq: Frequency | null,
    layer2Mode: SoundGenerationMode,
    layer3Freq: Frequency | null,
    layer3Mode: SoundGenerationMode,
    options?: { enableBreathPanner?: boolean }
  ) => {
    const isNewItem = currentlyPlayingItem?.id !== itemToPlay.id;

    if (isNewItem) {
      finalizeLogItem(); 
      if ('steps' in itemToPlay) {
        setSessionStepIndex(0);
        setSessionTimeInStep(0);
        totalSessionTimeElapsedRef.current = 0;
      }
      stopBreathingGuideInternal();
      const newItem = logSessionActivity({ id: itemToPlay.id, name: 'name' in itemToPlay ? itemToPlay.name : itemToPlay.title });
      setActiveLogItem(newItem);
    }
    
    setLastCompletedSession(null);
    setCurrentlyPlayingItem(itemToPlay);
    allFrequenciesRef.current = allFrequenciesData;
    
    const shouldEnableBreathPanner = options?.enableBreathPanner || isBreathPanningActive;
    const panningConfig = is8dEnabled && !shouldEnableBreathPanner
        ? { isEnabled: true, speed: panningSpeed, depth: panningDepth }
        : { isEnabled: false, speed: 0, depth: 0 };

    if (shouldEnableBreathPanner) {
        enableBreathPanner('main', 5);
        setIsBreathPanningActive(true);
    } else {
        if (isBreathPanningActive) disableBreathPanner();
        setIsBreathPanningActive(false);
    }
    
    startAudioPlayback(mainAudioFreq, mainMode, layer2Freq, layer2Mode, layer3Freq, layer3Mode, panningConfig);

  }, [currentlyPlayingItem?.id, finalizeLogItem, stopBreathingGuideInternal, logSessionActivity, isBreathPanningActive, is8dEnabled, panningSpeed, panningDepth, enableBreathPanner, disableBreathPanner, startAudioPlayback]);
  
  const startGuide = useCallback((pattern: BreathingPattern) => {
      startBreathingGuideInternal(pattern);
      if (isPlaying && is8dEnabled && currentlyPlayingItem && !('steps' in currentlyPlayingItem)) {
          enableBreathPanner('main', 5);
          setIsBreathPanningActive(true);
      }
  }, [startBreathingGuideInternal, isPlaying, is8dEnabled, currentlyPlayingItem, enableBreathPanner]);

  const toggleLayer2 = useCallback((freq: Frequency | null, mode: SoundGenerationMode) => {
    toggleAudioLayer2(freq, mode, is8dEnabled, panningSpeed, panningDepth);
  }, [toggleAudioLayer2, is8dEnabled, panningSpeed, panningDepth]);

  const toggleLayer3 = useCallback((freq: Frequency | null, mode: SoundGenerationMode) => {
    toggleAudioLayer3(freq, mode);
  }, [toggleAudioLayer3]);

  // This effect keeps the total elapsed time ref up-to-date for accurate logging.
  useEffect(() => {
    if (currentlyPlayingItem && 'steps' in currentlyPlayingItem) {
      let elapsedBeforeStep = 0;
      for (let i = 0; i < sessionStepIndex; i++) {
        elapsedBeforeStep += currentlyPlayingItem.steps[i].duration;
      }
      totalSessionTimeElapsedRef.current = elapsedBeforeStep + sessionTimeInStep;
    }
  }, [sessionTimeInStep, sessionStepIndex, currentlyPlayingItem]);

  // This effect handles session step progression.
  useEffect(() => {
    // Only run if a session is actively playing.
    if (isPlaying && currentlyPlayingItem && 'steps' in currentlyPlayingItem) {
      const session = currentlyPlayingItem;
      const stepIndex = sessionStepIndex;
      const currentStep = session.steps[stepIndex];

      if (!currentStep) {
        stop(); // End of session or invalid step
        return;
      }

      // Clear any previous timers before setting new ones for the current step.
      if (intervalRef.current) clearInterval(intervalRef.current);
      let transitionTimer: ReturnType<typeof setTimeout>;

      // This timer updates the UI every second.
      const uiTimer = setInterval(() => {
        setSessionTimeInStep(t => t + 1);
      }, 1000);
      intervalRef.current = uiTimer;
      
      // This timer handles the transition to the next step when the current one ends.
      transitionTimer = setTimeout(() => {
        const nextStepIndex = stepIndex + 1;
        if (nextStepIndex < session.steps.length) {
          const nextStep = session.steps[nextStepIndex];
          const mainFreq = allFrequenciesRef.current.find(f => f.id === nextStep.frequencyId);
          const layer2Freq = nextStep.layerFrequencyId ? allFrequenciesRef.current.find(f => f.id === nextStep.layerFrequencyId) ?? null : null;
          const layer3Freq = nextStep.layer3FrequencyId ? allFrequenciesRef.current.find(f => f.id === nextStep.layer3FrequencyId) ?? null : null;
          
          if (mainFreq && currentlyPlayingItem) {
            startPlayback(
              currentlyPlayingItem,
              allFrequenciesRef.current,
              mainFreq,
              mainFreq.defaultMode,
              layer2Freq,
              layer2Freq?.defaultMode || 'BINAURAL',
              layer3Freq,
              layer3Freq?.defaultMode || 'PURE'
            );
            setSessionStepIndex(nextStepIndex);
            setSessionTimeInStep(0);
          } else {
            stop();
          }
        } else {
          stop(); // End of the session
        }
      }, (currentStep.duration - sessionTimeInStep) * 1000);

      // Cleanup function to clear timers when the step changes or playback stops.
      return () => {
        clearInterval(uiTimer);
        clearTimeout(transitionTimer);
      };
    } else {
      // Ensure timers are cleared if playback stops or the item changes.
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  // By removing `sessionTimeInStep`, this effect only re-runs when a step actually changes,
  // making it robust against high-frequency UI re-renders from the breathing guide.
  }, [isPlaying, currentlyPlayingItem, sessionStepIndex, stop, startPlayback]);

  // Countdown timer effect
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    if (isPlaying && activeTimer > 0 && timerEndTimeRef.current) {
        const updateRemaining = () => {
            const remaining = Math.max(0, (timerEndTimeRef.current! - Date.now()) / 1000);
            setTimeRemaining(remaining);
            if (remaining <= 0 && intervalId) {
                clearInterval(intervalId);
            }
        };
        updateRemaining();
        intervalId = setInterval(updateRemaining, 1000);
    }
    return () => { if (intervalId) clearInterval(intervalId); };
  }, [isPlaying, activeTimer]);


  useEffect(() => {
    if (isPlaying && !isBreathPanningActive) {
      set8dPanning('main', is8dEnabled, panningSpeed, panningDepth);
      if(isLayer2Active) {
        set8dPanning('layer', is8dEnabled, panningSpeed, panningDepth);
      }
    } else if (!isBreathPanningActive) {
      set8dPanning('main', false, 0, 0);
      set8dPanning('layer', false, 0, 0);
    }
  }, [is8dEnabled, panningSpeed, panningDepth, isPlaying, isLayer2Active, set8dPanning, isBreathPanningActive]);

  useEffect(() => {
    if (isBreathPanningActive && isPlaying && breathingHook.activePattern) {
        audioHook.updateBreathPanner('main', breathingHook.phaseProgress);
    }
  }, [isBreathPanningActive, isPlaying, breathingHook.activePattern, breathingHook.currentPhase, breathingHook.phaseProgress, audioHook.updateBreathPanner]);


  const value: PlayerContextType = {
    ...audioHook,
    // Overwrite with stabilized versions
    isPlaying,
    startPlayback,
    pause,
    resume,
    stop,
    setTimer,
    activeTimer,
    timeRemaining,
    toggleLayer2,
    toggleLayer3,
    // Add breathing hook state and stabilized controls
    ...breathingHook,
    startGuide,
    stopGuide,
    // Add player state
    currentlyPlayingItem,
    lastCompletedSession,
    clearLastCompletedSession,
    sessionStepIndex,
    sessionTimeInStep,
    is8dEnabled,
    setIs8dEnabled,
    panningSpeed,
    setPanningSpeed,
    panningDepth,
    setPanningDepth,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
