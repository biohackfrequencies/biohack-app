import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { Frequency, GuidedSession, CustomStack, SoundGenerationMode, ActivityLogItem } from '../types';
import { useBinauralBeat } from '../hooks/useBinauralBeat';
import { useBreathingGuide } from '../hooks/useBreathingGuide';
import { useUserData } from './UserDataContext';
import { logMindfulMinutes } from '../services/healthService';

export type PlayableItem = Frequency | GuidedSession | CustomStack;
type UseBinauralBeatReturn = ReturnType<typeof useBinauralBeat>;
type UseBreathingGuideReturn = ReturnType<typeof useBreathingGuide>;

interface PlayerContextType extends Omit<UseBinauralBeatReturn, 'startPlayback' | 'pause' | 'resume' | 'stop' | 'toggleLayer'>, UseBreathingGuideReturn {
  currentlyPlayingItem: PlayableItem | null;
  startPlayback: (
    itemToPlay: PlayableItem,
    mainAudioFreq: Frequency,
    mainMode: SoundGenerationMode,
    layerFreq: Frequency | null,
    layerMode: SoundGenerationMode,
  ) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  toggleLayer: (freq: Frequency | null, mode: SoundGenerationMode) => void;
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

  // 8D Audio state is now centralized here
  const [is8dEnabled, setIs8dEnabled] = useState(false);
  const [panningSpeed, setPanningSpeed] = useState(30);
  const [panningDepth, setPanningDepth] = useState(50);

  const audioHook = useBinauralBeat();
  const breathingHook = useBreathingGuide();
  const { setActivityLog } = useUserData();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeLogItemRef = useRef(activeLogItem);
  activeLogItemRef.current = activeLogItem;
  
  const totalSessionTimeElapsedRef = useRef(0);
  
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

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    finalizeLogItem();
    audioHook.stop();
    breathingHook.stopGuide();
    setCurrentlyPlayingItem(null);
    setSessionStepIndex(0);
    setSessionTimeInStep(0);
    totalSessionTimeElapsedRef.current = 0;
    // Reset 8D state on stop
    setIs8dEnabled(false);
  }, [audioHook, breathingHook, finalizeLogItem]);

  const pause = useCallback(() => {
    finalizeLogItem();
    audioHook.pause();
  }, [audioHook, finalizeLogItem]);
  
  const resume = useCallback(() => {
    if (currentlyPlayingItem) {
      const newItem = logSessionActivity({ id: currentlyPlayingItem.id, name: 'name' in currentlyPlayingItem ? currentlyPlayingItem.name : currentlyPlayingItem.title });
      setActiveLogItem(newItem);
    }
    audioHook.resume();
  }, [audioHook, currentlyPlayingItem, logSessionActivity]);

  const startPlayback = useCallback((
    itemToPlay: PlayableItem,
    mainAudioFreq: Frequency,
    mainMode: SoundGenerationMode,
    layerFreq: Frequency | null,
    layerMode: SoundGenerationMode
  ) => {
    const isNewItem = currentlyPlayingItem?.id !== itemToPlay.id;

    if (isNewItem) {
      finalizeLogItem(); 
      if ('steps' in itemToPlay) {
        setSessionStepIndex(0);
        setSessionTimeInStep(0);
        totalSessionTimeElapsedRef.current = 0;
      }
      breathingHook.stopGuide();
      const newItem = logSessionActivity({ id: itemToPlay.id, name: 'name' in itemToPlay ? itemToPlay.name : itemToPlay.title });
      setActiveLogItem(newItem);
    }
    
    setCurrentlyPlayingItem(itemToPlay);
    
    audioHook.startPlayback(mainAudioFreq, mainMode, layerFreq, layerMode, { isEnabled: is8dEnabled, speed: panningSpeed, depth: panningDepth });

  }, [audioHook, breathingHook, currentlyPlayingItem?.id, logSessionActivity, finalizeLogItem, is8dEnabled, panningSpeed, panningDepth]);

  const toggleLayer = useCallback((freq: Frequency | null, mode: SoundGenerationMode) => {
    audioHook.toggleLayer(freq, mode, is8dEnabled, panningSpeed, panningDepth);
  }, [audioHook, is8dEnabled, panningSpeed, panningDepth]);

  useEffect(() => {
    if (audioHook.isPlaying && currentlyPlayingItem && 'steps' in currentlyPlayingItem) {
      const session = currentlyPlayingItem;
      
      intervalRef.current = setInterval(() => {
        let elapsedBeforeStep = 0;
        for (let i = 0; i < sessionStepIndex; i++) {
          elapsedBeforeStep += session.steps[i].duration;
        }

        setSessionTimeInStep((prevTime) => {
          const currentStep = session.steps[sessionStepIndex];
          if (!currentStep) {
            stop();
            return 0;
          }
          const newTime = prevTime + 1;
          totalSessionTimeElapsedRef.current = elapsedBeforeStep + newTime;

          if (newTime >= currentStep.duration) {
            if (sessionStepIndex < session.steps.length - 1) {
              setSessionStepIndex(prevIndex => prevIndex + 1);
              return 0;
            } else {
              stop();
              return prevTime;
            }
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [audioHook.isPlaying, currentlyPlayingItem, sessionStepIndex, stop]);

  useEffect(() => {
    if (audioHook.isPlaying) {
      audioHook.set8dPanning('main', is8dEnabled, panningSpeed, panningDepth);
      if(audioHook.isLayer2Active) {
        audioHook.set8dPanning('layer', is8dEnabled, panningSpeed, panningDepth);
      }
    } else {
      audioHook.set8dPanning('main', false, 0, 0);
      audioHook.set8dPanning('layer', false, 0, 0);
    }
  }, [is8dEnabled, panningSpeed, panningDepth, audioHook.isPlaying, audioHook.isLayer2Active, audioHook.set8dPanning]);


  const value: PlayerContextType = {
    ...audioHook,
    startPlayback,
    pause,
    resume,
    stop,
    toggleLayer,
    ...breathingHook,
    currentlyPlayingItem,
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