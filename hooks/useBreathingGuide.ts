import { useState, useEffect, useRef, useCallback } from 'react';
import { BreathingPattern } from '../types';

export const useBreathingGuide = () => {
  const [activePattern, setActivePattern] = useState<BreathingPattern | null>(null);
  const [currentPhase, setCurrentPhase] = useState<string>('');
  const [phaseProgress, setPhaseProgress] = useState(0); // 0 to 1
  const [phaseTime, setPhaseTime] = useState(0);

  const animationFrameId = useRef<number>(0);
  const patternIndex = useRef(0);
  const lastFrameTime = useRef(performance.now());
  const timeInPhase = useRef(0);
  
  const startGuide = useCallback((pattern: BreathingPattern) => {
    setActivePattern(pattern);
    patternIndex.current = 0;
    timeInPhase.current = 0;
    lastFrameTime.current = performance.now();
  }, []);

  const stopGuide = useCallback(() => {
    setActivePattern(null);
    setCurrentPhase('');
    setPhaseProgress(0);
    setPhaseTime(0);
    if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
    }
  }, []);

  useEffect(() => {
    if (!activePattern) {
      if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      return;
    }

    const animate = (now: number) => {
      const delta = (now - lastFrameTime.current) / 1000;
      lastFrameTime.current = now;
      timeInPhase.current += delta;
      
      const currentDuration = activePattern.pattern[patternIndex.current] as number;
      const currentPhaseName = activePattern.pattern[patternIndex.current + 1] as string;

      setCurrentPhase(currentPhaseName);
      setPhaseTime(currentDuration - timeInPhase.current);
      
      const progressWithinPhase = timeInPhase.current / currentDuration;
      let progress: number;

      if (currentPhaseName.toLowerCase().includes('inhale')) {
          progress = progressWithinPhase;
      } else if (currentPhaseName.toLowerCase().includes('exhale')) {
          progress = 1 - progressWithinPhase;
      } else { // Handles 'Hold'
          // Determine hold size based on the *previous* phase.
          const prevPhaseNameIndex = patternIndex.current === 0 
              ? activePattern.pattern.length - 1 
              : patternIndex.current - 1;
          const prevPhaseName = activePattern.pattern[prevPhaseNameIndex] as string;
          
          if (prevPhaseName.toLowerCase().includes('inhale')) {
              progress = 1; // Hold at max size
          } else { // Assume hold after exhale or at start
              progress = 0; // Hold at min size
          }
      }

      setPhaseProgress(Math.min(1, Math.max(0, progress)));

      if (timeInPhase.current >= currentDuration) {
        timeInPhase.current = 0;
        patternIndex.current = (patternIndex.current + 2) % activePattern.pattern.length;
      }
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [activePattern]);

  return {
    startGuide,
    stopGuide,
    activePattern,
    currentPhase,
    phaseProgress,
    phaseTime,
  };
};
