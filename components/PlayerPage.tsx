import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Frequency, SoundGenerationMode, CategoryId, BREATHING_PATTERNS, BreathingPattern, ColorTheme, PlayableItem, GuidedSession, CustomStack, BenefitCategory } from '../types';
import { Visualizer } from './Visualizer';
import { PlayIcon, PauseIcon, BackIcon, HeartIcon, HeartFilledIcon, ClockIcon, LayersIcon, InfoIcon, LungsIcon, ChevronDownIcon, ShareIcon, CheckmarkIcon, BrainwaveIcon } from './BohoIcons';
import { LayerSelectorModal } from './LayerSelectorModal';
import { useSubscription } from '../hooks/useSubscription';
import { SpatialAudioController } from './SpatialAudioController';
import useLocalStorage from '../hooks/useLocalStorage';
import { BreathingGuideVisualizer } from './BreathingGuideVisualizer';
import { BreathingPatternModal } from './BreathingPatternModal';
import { usePlayer } from '../contexts/PlayerContext';
import { useTheme } from '../contexts/ThemeContext';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const getScienceLink = (categoryId: CategoryId) => {
    switch (categoryId) {
        case 'brainwaves': return '#/science#brainwaves';
        case 'solfeggio': return '#/science#solfeggio';
        case 'rife': return '#/science#rife';
        case 'noise': return '#/science#noise';
        case 'angel': return '#/science#angel';
        case 'celestial': return '#/science#schumann';
        case 'elements': return '#/science#elements';
        case 'codex': return '#/science#codex';
        default: return '#/science';
    }
};

interface PlayerPageProps {
  item: PlayableItem;
  allFrequencies: Frequency[];
  onBack: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  categories: Record<CategoryId, { title: string; description:string; colors: ColorTheme; }>;
}

const modeDescriptions: Record<string, React.ReactNode> = {
  PURE: 'A single, clean frequency creating a clear, resonant sound. Ideal for specific Rife or Solfeggio frequencies where a precise tone is key.',
  BINAURAL: <>Two slightly different frequencies are played in each ear, prompting the brain to "hear" a third, phantom beat. <strong className="font-semibold text-amber-600 dark:text-amber-400">Headphones required.</strong></>,
  ISOCHRONIC: 'A single tone that rapidly pulses on and off, creating a distinct, rhythmic beat. This powerful entrainment method is effective even without headphones.',
  AMBIENCE: 'A spectrum of sound, including colored noises and natural soundscapes, designed to mask other noises, aiding focus and relaxation.',
};

const ElementInfoTabs: React.FC<{ element: Frequency, accentColor: string }> = ({ element, accentColor }) => {
  const [activeTab, setActiveTab] = useState<'symbolism' | 'science' | 'cosmos'>('symbolism');

  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      <div className="flex justify-center border-b border-slate-300/50 dark:border-dark-border/50 mb-4">
        <button
          onClick={() => setActiveTab('symbolism')}
          aria-pressed={activeTab === 'symbolism'}
          className={`px-4 py-2 font-semibold text-sm transition-colors ${activeTab === 'symbolism' ? 'border-b-2 text-slate-800 dark:text-dark-text-primary' : 'text-slate-500 dark:text-dark-text-muted hover:text-slate-700 dark:hover:text-dark-text-secondary'}`}
          style={{ borderColor: activeTab === 'symbolism' ? accentColor : 'transparent' }}
        >
          Codex Overlay
        </button>
        <button
          onClick={() => setActiveTab('science')}
          aria-pressed={activeTab === 'science'}
          className={`px-4 py-2 font-semibold text-sm transition-colors ${activeTab === 'science' ? 'border-b-2 text-slate-800 dark:text-dark-text-primary' : 'text-slate-500 dark:text-dark-text-muted hover:text-slate-700 dark:hover:text-dark-text-secondary'}`}
          style={{ borderColor: activeTab === 'science' ? accentColor : 'transparent' }}
        >
          Science
        </button>
        <button
          onClick={() => setActiveTab('cosmos')}
          aria-pressed={activeTab === 'cosmos'}
          className={`px-4 py-2 font-semibold text-sm transition-colors ${activeTab === 'cosmos' ? 'border-b-2 text-slate-800 dark:text-dark-text-primary' : 'text-slate-500 dark:text-dark-text-muted hover:text-slate-700 dark:hover:text-dark-text-secondary'}`}
          style={{ borderColor: activeTab === 'cosmos' ? accentColor : 'transparent' }}
        >
          Cosmos
        </button>
      </div>

      <div className="text-center text-slate-700 dark:text-dark-text-secondary p-2 animate-fade-in min-h-[180px]">
        {activeTab === 'symbolism' && (
          <div className="space-y-4">
            <p className="italic">{element.description}</p>
            <div>
              <p className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-dark-text-muted">Energetic Association</p>
              <p>{element.energeticAssociation}</p>
            </div>
            <div>
              <p className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-dark-text-muted">Biological Association</p>
              <p>{element.biologicalAssociation}</p>
            </div>
             <div>
              <p className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-dark-text-muted">Sacred Geometry</p>
              <p>{element.sacredGeometry}</p>
            </div>
          </div>
        )}
        {activeTab === 'science' && (
          <div className="space-y-4">
             <div>
              <p className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-dark-text-muted">Atomic Number</p>
              <p>{element.atomicNumber}</p>
            </div>
             <div>
              <p className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-dark-text-muted">Common Material Uses</p>
              <p>{element.materialUses}</p>
            </div>
          </div>
        )}
        {activeTab === 'cosmos' && (
            <div className="space-y-4">
                <div>
                    <p className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-dark-text-muted">Planetary Association</p>
                    <p>{element.planetaryAssociation || 'N/A'}</p>
                </div>
                <div>
                    <p className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-dark-text-muted">Zodiac Association</p>
                    <p>{element.zodiacAssociation || 'N/A'}</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};


export const PlayerPage: React.FC<PlayerPageProps> = ({ 
    item, allFrequencies, onBack, favorites, toggleFavorite, categories
}) => {
  const player = usePlayer();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const { 
    currentlyPlayingItem, isPlaying, isLayer2Active, isLayer3Active, analyser, 
    mainVolume, layer2Volume, layer3Volume, setMainVolume, setLayer2Volume, setLayer3Volume,
    setTimer, startPlayback, pause, resume, toggleLayer2, toggleLayer3, stop,
    activePattern, currentPhase, phaseProgress, phaseTime, startGuide, stopGuide,
    sessionStepIndex, sessionTimeInStep,
    is8dEnabled, setIs8dEnabled, panningSpeed, setPanningSpeed, panningDepth, setPanningDepth
  } = player;

  const { isSubscribed } = useSubscription();
  
  const [selectedMode, setSelectedMode] = useState<SoundGenerationMode>(('defaultMode' in item) ? item.defaultMode : 'PURE');
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  const [layer2Freq, setLayer2Freq] = useState<Frequency | null>(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const layerFreqParam = params.get('layerFreq');
    if (item.id.startsWith('custom-') && layerFreqParam) {
        const layerFreqValue = parseFloat(layerFreqParam);
        if (!isNaN(layerFreqValue)) {
            return {
                id: `custom-layer-${layerFreqValue}`,
                name: `Custom Layer (${layerFreqValue} Hz)`,
                range: `${layerFreqValue} Hz`,
                baseFrequency: layerFreqValue,
                binauralFrequency: 0,
                description: `A custom generated layered tone at ${layerFreqValue} Hz.`,
                category: BenefitCategory.WELLNESS,
                categoryId: 'guided',
                defaultMode: 'PURE',
                availableModes: ['PURE', 'BINAURAL', 'ISOCHRONIC'],
                colors: { primary: '#cbd5e1', secondary: '#e2e8f0', accent: '#94a3b8' },
                premium: true,
            };
        }
    }
    return null;
  });
  const [layer3Freq, setLayer3Freq] = useState<Frequency | null>(null);

  const [isTimerMenuOpen, setIsTimerMenuOpen] = useState(false);
  const [activeTimer, setActiveTimer] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLayerModalOpen, setIsLayerModalOpen] = useState(false);
  const [editingLayer, setEditingLayer] = useState<2 | 3 | null>(null);
  const [isBreathingMenuOpen, setIsBreathingMenuOpen] = useState(false);
  const [selectedPattern, setSelectedPattern] = useLocalStorage<BreathingPattern>('biohack_breathing_pattern', BREATHING_PATTERNS[0]);

  const timerEndTimeRef = useRef<number | null>(null);
  
  const isSession = 'steps' in item;
  const isCurrentItemPlaying = currentlyPlayingItem?.id === item.id;
  const singleFrequency = isSession ? null : item as Frequency;
  const sessionData = isSession ? item as GuidedSession | CustomStack : null;
  const isElement = item.categoryId === 'elements';
  
  const currentStep = sessionData ? sessionData.steps[sessionStepIndex] : null;
  const mainFrequencyForPlayback = isSession ? allFrequencies.find(f => f.id === currentStep?.frequencyId) : singleFrequency;
  const layer2FrequencyForPlayback = isSession ? allFrequencies.find(f => f.id === currentStep?.layerFrequencyId) : layer2Freq;
  const layer3FrequencyForPlayback = isSession ? allFrequencies.find(f => f.id === currentStep?.layer3FrequencyId) : layer3Freq;

  const totalDuration = useMemo(() => sessionData ? sessionData.steps.reduce((sum, step) => sum + step.duration, 0) : 0, [sessionData]);
  
  const totalTimeElapsed = useMemo(() => {
    if (!sessionData || !isCurrentItemPlaying) return 0;
    let elapsed = 0;
    for (let i = 0; i < sessionStepIndex; i++) {
        elapsed += sessionData.steps[i].duration;
    }
    elapsed += sessionTimeInStep;
    return elapsed;
  }, [sessionStepIndex, sessionTimeInStep, sessionData, isCurrentItemPlaying]);

  useEffect(() => {
    if (currentlyPlayingItem && currentlyPlayingItem.id !== item.id) {
      stop();
    }
  }, [item.id, currentlyPlayingItem?.id, stop]);
  

  const togglePlayPause = useCallback(() => {
    if (isCurrentItemPlaying && isPlaying) {
      pause();
    } else if (isCurrentItemPlaying && !isPlaying) {
      resume();
    } else {
      if (mainFrequencyForPlayback) {
        // Determine the correct mode for the main frequency. For sessions, it's fixed by the data.
        // For single frequencies, it's controlled by the user's selection.
        const mainModeForPlayback = isSession ? mainFrequencyForPlayback.defaultMode : selectedMode;
        
        startPlayback(
          item, allFrequencies, 
          mainFrequencyForPlayback, mainModeForPlayback, 
          layer2FrequencyForPlayback || null, layer2FrequencyForPlayback?.defaultMode || 'BINAURAL',
          layer3FrequencyForPlayback || null, layer3FrequencyForPlayback?.defaultMode || 'PURE'
        );
      }
    }
  }, [isCurrentItemPlaying, isPlaying, pause, resume, startPlayback, item, allFrequencies, mainFrequencyForPlayback, selectedMode, layer2FrequencyForPlayback, layer3FrequencyForPlayback, isSession]);
  
  const handleModeChange = useCallback((newMode: SoundGenerationMode) => {
    setSelectedMode(newMode);
    if (isCurrentItemPlaying && isPlaying && mainFrequencyForPlayback) {
       startPlayback(
          item, allFrequencies, 
          mainFrequencyForPlayback, newMode, 
          layer2FrequencyForPlayback || null, layer2FrequencyForPlayback?.defaultMode || 'BINAURAL',
          layer3FrequencyForPlayback || null, layer3FrequencyForPlayback?.defaultMode || 'PURE'
        );
    }
  }, [isCurrentItemPlaying, isPlaying, startPlayback, item, allFrequencies, mainFrequencyForPlayback, layer2FrequencyForPlayback, layer3FrequencyForPlayback]);

  useEffect(() => {
    if (currentlyPlayingItem?.id !== item.id) {
        setSelectedMode(('defaultMode' in item) ? item.defaultMode : 'PURE');
        setIsTimerMenuOpen(false);
        setActiveTimer(0);
        setTimeRemaining(0);
        stopGuide();
    }
  }, [item, currentlyPlayingItem, stopGuide]);
  
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    if (isCurrentItemPlaying && isPlaying && activeTimer > 0 && timerEndTimeRef.current) {
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
  }, [isCurrentItemPlaying, isPlaying, activeTimer]);

  const handleSetTimer = (duration: number) => {
    setTimer(duration);
    setActiveTimer(duration);
    timerEndTimeRef.current = duration > 0 ? Date.now() + duration * 1000 : null;
    setIsTimerMenuOpen(false);
  };
  
  const openLayerModal = (layer: 2 | 3) => {
    if (!isSubscribed && !isSession) {
      window.location.hash = '#/pricing';
      return;
    }
    setEditingLayer(layer);
    setIsLayerModalOpen(true);
  };

  const handleSelectLayer = (newLayerFreq: Frequency) => {
    if (editingLayer === 2) {
      setLayer2Freq(newLayerFreq);
      toggleLayer2(newLayerFreq, newLayerFreq.defaultMode);
    } else if (editingLayer === 3) {
      setLayer3Freq(newLayerFreq);
      toggleLayer3(newLayerFreq, newLayerFreq.defaultMode);
    }
    setIsLayerModalOpen(false);
    setEditingLayer(null);
  };

  const handleRemoveLayer2 = () => {
    setLayer2Freq(null);
    toggleLayer2(null, 'BINAURAL');
  };
  const handleRemoveLayer3 = () => {
    setLayer3Freq(null);
    toggleLayer3(null, 'BINAURAL');
  };

  const handleNavigateToScience = (e: React.MouseEvent, categoryId: CategoryId) => {
    e.preventDefault();
    sessionStorage.setItem('returnTo', window.location.hash);
    window.location.hash = getScienceLink(categoryId);
  };
  
  const toggleBreathingGuide = () => {
      if (activePattern) {
          stopGuide();
      } else {
          startGuide(selectedPattern);
      }
  };

  const handleSelectPattern = (pattern: BreathingPattern) => {
    setSelectedPattern(pattern);
    setIsBreathingMenuOpen(false);
    if (activePattern) {
        startGuide(pattern);
    }
  };

  const handleShare = async () => {
    const canonicalBaseUrl = 'https://biohackfrequencies.app';
    const shareUrl = canonicalBaseUrl + window.location.hash;
    const shareText = `Check out the "${'name' in item ? item.name : item.title}" protocol on the Biohack Frequencies app.`;
    const shareTitle = `Biohack Frequencies: ${'name' in item ? item.name : item.title}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
      } catch (error: any) {
        if (error.name !== 'AbortError') console.error('Error sharing:', error);
      }
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShareState('copied');
        setTimeout(() => setShareState('idle'), 2500);
      }).catch(() => alert('Could not copy link to clipboard.'));
    } else {
        alert('Share functionality is not supported on your browser.');
    }
  };

  const colors = isSession ? (mainFrequencyForPlayback?.colors || item.colors) : item.colors;
  const isFavorite = favorites.includes(item.id);
  const descriptionText = 'description' in item ? item.description : (sessionData?.advice || '');
  const isLongDescription = descriptionText.length > 200;
  
  const backgroundStyle = isDarkMode
    ? { background: `linear-gradient(160deg, ${colors.primary}20, var(--dark-bg) 70%)`, '--player-color': colors.accent }
    : { background: `linear-gradient(160deg, ${colors.primary}30, #F9F6F2 80%)`, '--player-color': colors.accent };

  const ModeButton: React.FC<{mode: SoundGenerationMode, children: React.ReactNode}> = ({ mode, children }) => {
    if (!singleFrequency || !singleFrequency.availableModes?.includes(mode)) return null;
    const isActive = selectedMode === mode;
    const description = modeDescriptions[mode];

    return (
        <div className="relative group">
            <button
                onClick={() => handleModeChange(mode)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all border ${
                isActive 
                    ? 'text-white shadow-md' 
                    : 'bg-white/50 dark:bg-dark-surface/30 border-slate-300/80 dark:border-dark-border/50 text-slate-600 dark:text-dark-text-secondary hover:bg-white/80 dark:hover:bg-dark-surface hover:border-slate-400 dark:hover:border-dark-border'
                }`}
                style={{ backgroundColor: isActive ? colors.accent : '', borderColor: isActive ? 'transparent' : '' }}
            >
                {children}
            </button>
            <div className="absolute bottom-full mb-3 w-64 p-3 rounded-lg bg-slate-800 dark:bg-slate-900 text-white dark:text-slate-200 text-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 left-1/2 -translate-x-1/2">
                {description}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-800 dark:border-t-slate-900"></div>
            </div>
        </div>
    );
  };

  const LayerControl: React.FC<{
    layerNumber: 2 | 3;
    frequency: Frequency | null;
    isActive: boolean;
    onOpenModal: () => void;
    onRemove: () => void;
  }> = ({ layerNumber, frequency, isActive, onOpenModal, onRemove }) => {
    return (
        <div className="pt-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <LayersIcon className="w-6 h-6 text-slate-700 dark:text-dark-text-secondary" />
                    <div>
                        <span className="font-semibold text-slate-700 dark:text-dark-text-secondary">Layer {layerNumber}</span>
                        {frequency && <p className="text-xs font-semibold" style={{ color: frequency.colors.accent }}>{frequency.name}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isActive && (
                        <button onClick={onRemove} className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50">Remove</button>
                    )}
                    <button onClick={onOpenModal} className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-dark-text-secondary hover:bg-slate-300 dark:hover:bg-slate-600">
                        {isActive ? 'Change' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
  };
  
  if (!mainFrequencyForPlayback) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Loading frequency data...</p>
        </div>
    );
  }

  return (
    <div
      className="p-4 sm:p-8 rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/20 border border-black/5 dark:border-white/5 relative animate-fade-in transition-all duration-500 text-slate-800 dark:text-dark-text-secondary flex flex-col items-center"
      style={backgroundStyle as React.CSSProperties}
    >
        {isLayerModalOpen && (
            <LayerSelectorModal 
                allFrequencies={allFrequencies} 
                onSelect={handleSelectLayer}
                onClose={() => { setIsLayerModalOpen(false); setEditingLayer(null); }}
                currentMainFrequencyId={item.id}
                isSubscribed={isSubscribed}
                title={`Select Frequency for Layer ${editingLayer}`}
                categories={categories}
            />
        )}
        {isBreathingMenuOpen && (
            <BreathingPatternModal
                onSelect={handleSelectPattern}
                onClose={() => setIsBreathingMenuOpen(false)}
                selectedPattern={selectedPattern}
            />
        )}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 dark:text-dark-text-muted hover:text-slate-900 dark:hover:text-dark-text-primary transition-colors" aria-label={`Back`}>
            <BackIcon className="w-6 h-6" />
            <span className="hidden sm:inline font-semibold">Back</span>
        </button>
      </div>

        <div className="text-center my-8">
            <h2 className="text-4xl sm:text-5xl font-display font-bold drop-shadow-sm text-slate-800 dark:text-dark-text-primary">
              {isSession ? sessionData?.title : singleFrequency?.name}
            </h2>
            <p className="text-slate-500 dark:text-dark-text-muted mt-2 text-lg drop-shadow-sm">
                {isSession ? `${totalDuration / 60} Minute Guided Session` : singleFrequency?.range}
            </p>
        </div>

        <div className="w-full max-w-lg h-80 sm:h-96 my-4 md:my-0 relative">
          <Visualizer 
            analyser={analyser} 
            isPlaying={isCurrentItemPlaying && isPlaying} 
            colors={colors}
            baseFrequency={mainFrequencyForPlayback.baseFrequency}
          />
           {activePattern && (
                <BreathingGuideVisualizer 
                    phase={currentPhase}
                    progress={phaseProgress}
                    time={phaseTime}
                    color={colors.accent}
                />
            )}
        </div>

        <button
            onClick={togglePlayPause}
            className="w-24 h-24 my-6 rounded-full flex items-center justify-center text-white transition-all duration-300 focus:outline-none focus:ring-4 ring-opacity-50"
            style={{ backgroundColor: isCurrentItemPlaying && isPlaying ? '#a1a1aa' : colors.accent, '--tw-ring-color': colors.accent } as React.CSSProperties}
            aria-label={isCurrentItemPlaying && isPlaying ? 'Pause' : 'Play'}
        >
            {isCurrentItemPlaying && isPlaying ? <PauseIcon className="w-12 h-12" /> : <PlayIcon className="w-12 h-12" />}
        </button>
        
        {isSession && (
            <>
                <div className="w-full max-w-2xl my-4 text-center">
                    <p className="text-lg font-bold text-slate-800 dark:text-dark-text-primary">
                        {currentStep?.title}
                        {mainFrequencyForPlayback && ` (${mainFrequencyForPlayback.baseFrequency} Hz)`}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-dark-text-secondary">{currentStep?.description}</p>
                </div>
                <div className="w-full max-w-lg space-y-2 mb-6">
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-slate-600 dark:text-dark-text-muted">STEP {sessionStepIndex + 1} / {sessionData?.steps.length}</span>
                            <span style={{ color: colors.accent }}>{formatTime((currentStep?.duration || 0) - sessionTimeInStep)}</span>
                        </div>
                        <div className="w-full bg-slate-900/10 dark:bg-slate-700 rounded-full h-1.5"><div className="h-1.5 rounded-full" style={{ width: `${(sessionTimeInStep / (currentStep?.duration || 1)) * 100}%`, backgroundColor: colors.accent, transition: 'width 0.5s linear' }}></div></div>
                    </div>
                     <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-slate-600 dark:text-dark-text-muted">TOTAL</span>
                            <span className="text-slate-600 dark:text-dark-text-muted">{formatTime(totalDuration - totalTimeElapsed)}</span>
                        </div>
                        <div className="w-full bg-slate-900/10 dark:bg-slate-700 rounded-full h-1.5"><div className="h-1.5 rounded-full" style={{ width: `${(totalTimeElapsed / totalDuration) * 100}%`, backgroundColor: colors.secondary, transition: 'width 0.5s linear' }}></div></div>
                    </div>
                </div>
            </>
        )}

        {isElement ? (
            <ElementInfoTabs element={item as Frequency} accentColor={colors.accent} />
        ) : descriptionText ? (
            <p className="max-w-2xl text-center text-slate-700 dark:text-dark-text-secondary my-6 drop-shadow-sm">
                <span className={!isDescriptionExpanded && isLongDescription ? 'line-clamp-3' : ''}>
                    {descriptionText}
                </span>
                {isLongDescription && (
                    <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className="text-sm font-bold mt-2 ml-1" style={{color: colors.accent}}>
                        {isDescriptionExpanded ? 'Show Less' : 'Read More'}
                    </button>
                )}
            </p>
        ) : null}

        <div className="w-full max-w-sm flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
                 <button onClick={() => toggleFavorite(item.id)} className="p-2 text-slate-500 dark:text-dark-text-muted hover:text-red-500 transition-colors" aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                    {isFavorite ? <HeartFilledIcon className="w-7 h-7 text-red-500" /> : <HeartIcon className="w-7 h-7" />}
                 </button>
                 <button onClick={handleShare} className="p-2 w-11 h-11 flex items-center justify-center text-slate-500 dark:text-dark-text-muted hover:text-indigo-500 transition-colors" aria-label="Share">
                    {shareState === 'copied' ? <CheckmarkIcon className="w-7 h-7 text-green-500" /> : <ShareIcon className="w-7 h-7" />}
                 </button>
                 {!isSession && singleFrequency && (
                    <>
                        <button onClick={(e) => singleFrequency && handleNavigateToScience(e, singleFrequency.categoryId)} className="p-2 text-slate-500 dark:text-dark-text-muted hover:text-blue-500 transition-colors" aria-label="Learn about the science">
                            <InfoIcon className="w-7 h-7" />
                        </button>
                        <div className="relative">
                            <button onClick={() => setIsTimerMenuOpen(v => !v)} disabled={!isCurrentItemPlaying} className={`p-2 transition-colors ${!isCurrentItemPlaying ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed' : activeTimer > 0 ? 'text-teal-500 dark:text-teal-400' : 'text-slate-500 dark:text-dark-text-muted hover:text-teal-500 dark:hover:text-teal-400'}`} aria-label="Set session timer" >
                                <ClockIcon className="w-7 h-7" />
                            </button>
                            {isTimerMenuOpen && (
                                <div className="absolute bottom-full right-0 mb-2 w-32 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md rounded-lg shadow-xl border border-slate-200 dark:border-dark-border z-30 origin-bottom-right">
                                    {[15, 30, 60].map(min => (
                                        <button key={min} onClick={() => handleSetTimer(min * 60)} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-dark-text-secondary hover:bg-slate-200/50 dark:hover:bg-slate-600/50">{min} min</button>
                                    ))}
                                    <button onClick={() => handleSetTimer(0)} className="block w-full text-left px-4 py-2 text-sm font-bold text-red-500 dark:text-red-400 hover:bg-red-100/50 dark:hover:bg-red-900/20">Clear</button>
                                </div>
                            )}
                        </div>
                    </>
                 )}
            </div>

            {activeTimer > 0 && isCurrentItemPlaying && isPlaying && !isSession && (
                 <div className="my-4 text-center text-sm font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                    Time Remaining: {formatTime(timeRemaining)}
                 </div>
            )}
        </div>
      
       <div className="w-full max-w-lg my-6 p-6 rounded-2xl bg-white/50 dark:bg-dark-surface/50 border border-slate-200/50 dark:border-dark-border/50 shadow-inner space-y-4">
            <h3 className="font-display text-xl font-bold text-center text-slate-700 dark:text-dark-text-primary mb-2">Sound Options</h3>
             {!isSession && singleFrequency && singleFrequency.availableModes && singleFrequency.availableModes.length > 1 && (
                <div className="flex items-center justify-center flex-wrap gap-2">
                    <ModeButton mode="PURE">Pure Tone</ModeButton>
                    <ModeButton mode="BINAURAL">Binaural</ModeButton>
                    <ModeButton mode="ISOCHRONIC">Isochronic</ModeButton>
                </div>
            )}
            
             {!isSession && (
                <>
                  <LayerControl layerNumber={2} frequency={layer2Freq} isActive={isLayer2Active} onOpenModal={() => openLayerModal(2)} onRemove={handleRemoveLayer2} />
                  <LayerControl layerNumber={3} frequency={layer3Freq} isActive={isLayer3Active} onOpenModal={() => openLayerModal(3)} onRemove={handleRemoveLayer3} />
                </>
             )}

            <hr className="border-slate-900/10 dark:border-dark-border" />
            <div className="w-full flex items-stretch gap-2">
                <button
                    onClick={toggleBreathingGuide}
                    className="flex-grow p-3 rounded-lg bg-white/50 dark:bg-dark-surface/50 border border-slate-900/5 dark:border-dark-border/50 shadow-inner flex items-center justify-center gap-3 text-cyan-600 dark:text-cyan-400 hover:bg-white/80 dark:hover:bg-dark-surface transition-colors"
                >
                    <LungsIcon className="w-7 h-7" />
                    <div className="text-left">
                        <span className="font-semibold">{activePattern ? 'Guide: On' : 'Start Breathing'}</span>
                        <p className="text-xs">{selectedPattern.name}</p>
                    </div>
                </button>
                <button
                    onClick={() => setIsBreathingMenuOpen(true)}
                    className="flex-shrink-0 w-14 rounded-lg bg-white/50 dark:bg-dark-surface/50 border border-slate-900/5 dark:border-dark-border/50 shadow-inner flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-dark-surface transition-colors"
                    aria-label="Change breathing pattern"
                >
                    <ChevronDownIcon className="w-5 h-5" />
                </button>
            </div>
      </div>

       {isSession && sessionData && (
          <div className="w-full max-w-2xl my-6">
              <h3 className="font-display text-xl font-bold text-center text-slate-700 dark:text-dark-text-primary mb-4">
                  Session Protocol
              </h3>
              <div className="max-h-60 overflow-y-auto space-y-2 rounded-lg p-2 bg-white/30 dark:bg-dark-surface/30 border border-slate-200/50 dark:border-dark-border/50">
                  {sessionData.steps.map((step, index) => {
                      const isCompleted = index < sessionStepIndex;
                      const isCurrent = index === sessionStepIndex;
                      const mainFreq = allFrequencies.find(f => f.id === step.frequencyId);
                      const layerFreq = step.layerFrequencyId ? allFrequencies.find(f => f.id === step.layerFrequencyId) : null;
                      const layer3Freq = step.layer3FrequencyId ? allFrequencies.find(f => f.id === step.layer3FrequencyId) : null;
                      
                      const containerClasses = `flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${isCurrent ? 'bg-white/80 dark:bg-dark-surface shadow-md' : isCompleted ? 'opacity-50' : 'bg-white/30 dark:bg-dark-surface/30'}`;
                      const iconBgColor = isCurrent ? colors.accent : (isCompleted ? '#94a3b8' : '#cbd5e1');
                      
                      let frequencyText = mainFreq ? `${mainFreq.name} (${mainFreq.range})` : step.frequencyId;
                      if (layerFreq) frequencyText += ` + ${layerFreq.name} (${layerFreq.range})`;
                      if (layer3Freq) frequencyText += ` + ${layer3Freq.name} (${layer3Freq.range})`;
                      

                      return (
                          <div key={index} className={containerClasses}>
                              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full" style={{ backgroundColor: iconBgColor, color: isCurrent || isCompleted ? 'white' : '#475569' }}>
                                  {isCompleted ? <CheckmarkIcon className="w-5 h-5" /> : (isCurrent ? <BrainwaveIcon className="w-5 h-5 animate-pulse" /> : <span className="font-bold text-sm">{index + 1}</span>)}
                              </div>
                              <div className="flex-grow overflow-hidden">
                                  <p className={`font-bold truncate ${isCurrent ? 'text-slate-800 dark:text-dark-text-primary' : 'text-slate-600 dark:text-dark-text-secondary'}`}>{step.title}</p>
                                  <p className="text-xs text-slate-500 dark:text-dark-text-muted truncate">{frequencyText}</p>
                              </div>
                              <div className="text-sm font-semibold text-slate-600 dark:text-dark-text-secondary flex-shrink-0">
                                  {formatTime(step.duration)}
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
        )}
      
      <div className="w-full max-w-sm space-y-5 rounded-2xl bg-white/50 dark:bg-dark-surface/50 border border-slate-900/5 dark:border-dark-border/50 p-6 shadow-inner backdrop-blur-sm">
        <div className="grid grid-cols-[minmax(0,1fr),minmax(0,2fr)] items-center gap-4">
          <label htmlFor="main-volume" className="cursor-pointer text-slate-700 dark:text-dark-text-secondary text-sm font-semibold truncate text-right" title={mainFrequencyForPlayback.name}>
            {mainFrequencyForPlayback.name}
          </label>
          <input id="main-volume" type="range" min="0" max="100" value={mainVolume} onChange={(e) => setMainVolume(parseInt(e.target.value, 10))} className="mobile-slider" style={{'--thumb-color': colors.accent} as React.CSSProperties}/>
        </div>
        <div className={`grid grid-cols-[minmax(0,1fr),minmax(0,2fr)] items-center gap-4 transition-opacity ${isLayer2Active ? 'opacity-100' : 'opacity-30'}`}>
          <label htmlFor="layer2-volume" className={`cursor-pointer ${!isLayer2Active && 'cursor-not-allowed'} text-slate-700 dark:text-dark-text-secondary text-sm font-semibold truncate text-right`} title={layer2FrequencyForPlayback?.name || 'Layer 2'}>
            {layer2FrequencyForPlayback?.name || 'Layer 2'}
          </label>
          <input id="layer2-volume" type="range" min="0" max="100" disabled={!isLayer2Active} value={layer2Volume} onChange={(e) => setLayer2Volume(parseInt(e.target.value, 10))} className={`mobile-slider ${!isLayer2Active && 'cursor-not-allowed'}`} style={{ '--thumb-color': (layer2FrequencyForPlayback?.colors || colors).accent} as React.CSSProperties} />
        </div>
        <div className={`grid grid-cols-[minmax(0,1fr),minmax(0,2fr)] items-center gap-4 transition-opacity ${isLayer3Active ? 'opacity-100' : 'opacity-30'}`}>
            <label htmlFor="layer3-volume" className={`cursor-pointer ${!isLayer3Active && 'cursor-not-allowed'} text-slate-700 dark:text-dark-text-secondary text-sm font-semibold truncate text-right`} title={layer3FrequencyForPlayback?.name || 'Layer 3'}>
                {layer3FrequencyForPlayback?.name || 'Layer 3'}
            </label>
            <input 
                id="layer3-volume" 
                type="range" 
                min="0" 
                max="100" 
                disabled={!isLayer3Active}
                value={layer3Volume} 
                onChange={(e) => setLayer3Volume(parseInt(e.target.value, 10))} 
                className={`mobile-slider ${!isLayer3Active && 'cursor-not-allowed'}`} 
                style={{ '--thumb-color': (layer3FrequencyForPlayback?.colors || colors).accent} as React.CSSProperties}
            />
        </div>
        <hr className="border-slate-900/10 dark:border-dark-border" />
        <SpatialAudioController
            isSubscribed={isSubscribed}
            isEnabled={is8dEnabled}
            onToggle={(enabled) => setIs8dEnabled(enabled)}
            speed={panningSpeed}
            onSpeedChange={(val) => setPanningSpeed(val)}
            depth={panningDepth}
            onDepthChange={(val) => setPanningDepth(val)}
            color={colors.accent}
        />
        <p className="text-xs text-center text-slate-500 dark:text-dark-text-muted pt-2">
            8D Audio applies to the first two layers for an immersive soundscape. Layer 3 remains centered.
        </p>
      </div>
    </div>
  );
};