import React, { useState, useEffect } from 'react';
import { BackIcon, PathfinderIcon, VolumeIcon, LayersIcon, InfoIcon } from './BohoIcons';
import { CustomStack, HarmonicInfluenceMap, HarmonicInfluenceNode, Frequency, BREATHING_PATTERNS, ColorTheme, CodexNode } from '../types';
import { calculateHarmonicInfluence } from '../services/harmonicInfluenceService';
import { usePlayer } from '../contexts/PlayerContext';
import { CodexUniversalisField } from './CodexUniversalisField';
import { codexData } from '../data/codex';
import { SpatialAudioController } from './SpatialAudioController';
import { useSubscription } from '../hooks/useSubscription';

interface ToneGeneratorPageProps {
    onBack: () => void;
    allFrequencies: Frequency[];
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Helper function to create a color theme from a single hex color
const createColorTheme = (accentColor: string): ColorTheme => {
    try {
        let [r, g, b] = (accentColor.match(/\w\w/g) || []).map(h => parseInt(h, 16));

        if (isNaN(r) || isNaN(g) || isNaN(b)) {
            // Fallback for invalid hex
            return { primary: '#e2e8f0', secondary: '#f1f5f9', accent: '#94a3b8' };
        }

        // Create a lighter primary color by mixing with a light gray to avoid pure white
        const pR = Math.floor(r * 0.3 + 249 * 0.7);
        const pG = Math.floor(g * 0.3 + 246 * 0.7);
        const pB = Math.floor(b * 0.3 + 242 * 0.7);
        const primary = `#${[pR, pG, pB].map(x => x.toString(16).padStart(2, '0')).join('')}`;

        // Create a secondary color that's a bit more saturated than primary
        const sR = Math.floor(r * 0.5 + 249 * 0.5);
        const sG = Math.floor(g * 0.5 + 246 * 0.5);
        const sB = Math.floor(b * 0.5 + 242 * 0.5);
        const secondary = `#${[sR, sG, sB].map(x => x.toString(16).padStart(2, '0')).join('')}`;
        
        return {
            primary,
            secondary,
            accent: accentColor,
        };
    } catch (e) {
        return { primary: '#e2e8f0', secondary: '#f1f5f9', accent: '#94a3b8' };
    }
};

const InfluenceCard: React.FC<{ title: string; node: HarmonicInfluenceNode, onHover: (mod: number | null) => void }> = ({ title, node, onHover }) => (
    <div 
        className="p-4 rounded-lg bg-black/5 dark:bg-dark-bg/30 border-l-4 transition-all duration-300 hover:bg-black/10 dark:hover:bg-dark-bg/50" 
        style={{ borderColor: node.color }}
        onMouseEnter={() => onHover(node.modulus)}
        onMouseLeave={() => onHover(null)}
    >
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
        <p className="font-bold text-lg text-slate-800 dark:text-dark-text-primary">{node.note} - {node.archetype}</p>
        <p className="text-sm text-slate-600 dark:text-dark-text-secondary">{node.guidance}</p>
    </div>
);

export const ToneGeneratorPage: React.FC<ToneGeneratorPageProps> = ({ onBack, allFrequencies }) => {
    const player = usePlayer();
    const { 
        startPlayback, startGuide, activePattern, isPlaying, currentlyPlayingItem, sessionStepIndex, sessionTimeInStep,
        is8dEnabled, setIs8dEnabled, panningSpeed, setPanningSpeed, panningDepth, setPanningDepth,
        mainVolume, setMainVolume, layer2Volume, setLayer2Volume, isLayer2Active, 
        // FIX: Replaced non-existent 'toggleLayer' with 'toggleLayer2' from the PlayerContext.
        toggleLayer2
    } = player;
    const { isSubscribed } = useSubscription();

    const [birthDate, setBirthDate] = useState(() => {
        try {
            const saved = sessionStorage.getItem('codexBirthDate');
            return saved ? JSON.parse(saved) : { year: '', month: '', day: '' };
        } catch {
            return { year: '', month: '', day: '' };
        }
    });
    
    const [influenceMap, setInfluenceMap] = useState<HarmonicInfluenceMap | null>(() => {
        try {
            const saved = sessionStorage.getItem('codexInfluenceMap');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [dateError, setDateError] = useState<string | null>(null);
    const [highlightedModulus, setHighlightedModulus] = useState<number | null>(null);
    const [interactionMode, setInteractionMode] = useState<'static' | 'breathing' | 'rotating'>('static');
    const [hoveredNodeInfo, setHoveredNodeInfo] = useState<CodexNode | null>(null);

    // Local state to track what's playing from the wheel
    const [mainFrequency, setMainFrequency] = useState<Frequency | null>(null);
    const [layeredFrequency, setLayeredFrequency] = useState<Frequency | null>(null);

    // Sync local state with player state
    useEffect(() => {
        if (!isPlaying) {
            setMainFrequency(null);
            setLayeredFrequency(null);
        } else {
            const currentMainId = currentlyPlayingItem?.id;
            const currentIsCodex = currentMainId?.startsWith('codex-');

            if (currentIsCodex) {
                const mainFreq = allFrequencies.find(f => f.id === currentMainId);
                if (mainFreq) setMainFrequency(mainFreq);
                // Note: We can't know the layered frequency from player context alone,
                // so we only reset it when play stops. This is a reasonable tradeoff.
            } else {
                setMainFrequency(null);
                setLayeredFrequency(null);
            }
        }
    }, [isPlaying, currentlyPlayingItem, allFrequencies]);


    useEffect(() => {
        sessionStorage.setItem('codexBirthDate', JSON.stringify(birthDate));
    }, [birthDate]);
    
    useEffect(() => {
        if (influenceMap) {
            sessionStorage.setItem('codexInfluenceMap', JSON.stringify(influenceMap));
        } else {
            sessionStorage.removeItem('codexInfluenceMap');
        }
    }, [influenceMap]);
    
    useEffect(() => {
        const isBreathingPathPlaying = currentlyPlayingItem && currentlyPlayingItem.id.startsWith('path-influence');
        if (isPlaying && isBreathingPathPlaying) {
            setInteractionMode('breathing');
        } else if (!isBreathingPathPlaying) { // Check ensures it doesn't wrongly switch if another track is playing
            setInteractionMode('static');
            if (activePattern) player.stopGuide();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying, currentlyPlayingItem]);

    useEffect(() => {
        const { year, month, day } = birthDate;
        if (year && month && day) {
            handleCalculateMap(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNavigateToScience = (e: React.MouseEvent) => {
        e.preventDefault();
        sessionStorage.setItem('returnTo', window.location.hash);
        window.location.hash = '#/science#codex';
    };

    const handleCalculateMap = (showError = true) => {
        if (showError) setDateError(null);
        const { year, month, day } = birthDate;
        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10);
        const dayNum = parseInt(day, 10);

        if (!year || !month || !day || isNaN(yearNum) || isNaN(monthNum) || isNaN(dayNum)) {
            if (showError) setDateError("Please enter a valid date.");
            return;
        }
        if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31 || yearNum < 1900 || yearNum > new Date().getFullYear()) {
            if (showError) setDateError("Please enter a realistic date.");
            return;
        }

        const map = calculateHarmonicInfluence(yearNum, monthNum, dayNum);
        setInfluenceMap(map);
    };
    
    const handleNodeClick = (node: CodexNode) => {
        const frequencyToPlay = allFrequencies.find(f => f.id === `codex-${node.modulus}`);
        if (!frequencyToPlay) return;

        const isCodexTonePlaying = currentlyPlayingItem?.id.startsWith('codex-');

        if (!isPlaying || !isCodexTonePlaying) {
            startPlayback(frequencyToPlay, allFrequencies, frequencyToPlay, 'PURE', null, 'PURE', null, 'PURE');
            setMainFrequency(frequencyToPlay);
            setLayeredFrequency(null);
        } else {
            if (mainFrequency?.id === frequencyToPlay.id) return;
            if (layeredFrequency?.id === frequencyToPlay.id) {
                toggleLayer2(null, 'PURE');
                setLayeredFrequency(null);
                return;
            }
            toggleLayer2(frequencyToPlay, 'PURE');
            setLayeredFrequency(frequencyToPlay);
        }
    };


    const playGeneratedPath = (stack: CustomStack) => {
        const firstStep = stack.steps[0];
        const firstMainFreq = allFrequencies.find(f => f.id === firstStep.frequencyId);
        if (!firstMainFreq) return;
        const firstLayerFreq = firstStep.layerFrequencyId ? allFrequencies.find(f => f.id === firstStep.layerFrequencyId) : null;
        
        startPlayback(
            stack,
            allFrequencies,
            firstMainFreq,
            firstMainFreq.defaultMode,
            firstLayerFreq || null,
            firstLayerFreq?.defaultMode || 'BINAURAL',
            null,
            'PURE'
        );
    };
    
    const handlePlayBreathingPath = () => {
        if (!influenceMap) return;

        const BREATH_CYCLE_DURATION = 16;
        const influenceNodes = [influenceMap.coreBlueprint, influenceMap.yearlyModulation, influenceMap.monthlyOverlay, influenceMap.dailyResonance];

        const steps = influenceNodes.map((node, index) => ({
            title: `${node.archetype}: ${node.note}`, description: node.guidance, duration: BREATH_CYCLE_DURATION,
            frequencyId: `codex-${node.modulus}`,
            layerFrequencyId: (index > 0) ? `codex-${influenceMap.coreBlueprint.modulus}` : undefined,
        }));

        const newStack: CustomStack = {
            id: `path-influence-${Date.now()}`, title: `My Harmonic Breathing Path`,
            description: `A guided, 64-second breathing journey through your core harmonic frequencies.`,
            steps,
            colors: createColorTheme(influenceMap.coreBlueprint.color),
            categoryId: 'guided',
        };

        const firstStep = newStack.steps[0];
        const firstMainFreq = allFrequencies.find(f => f.id === firstStep.frequencyId);
        if (!firstMainFreq) return;
        
        startPlayback(newStack, allFrequencies, firstMainFreq, firstMainFreq.defaultMode, null, 'BINAURAL', null, 'PURE', { enableBreathPanner: true });
        
        const boxBreathingPattern = BREATHING_PATTERNS.find(p => p.name === 'Box Breathing');
        if (boxBreathingPattern) startGuide(boxBreathingPattern);
    };
    
    const handleGenerateJourney = (type: 'triad' | 'arpeggio' | 'scale') => {
        if (!influenceMap) return;
        let moduli: number[] = [];
        let title = '';
        const core = influenceMap.coreBlueprint.modulus;
        const year = influenceMap.yearlyModulation.modulus;
        const month = influenceMap.monthlyOverlay.modulus;
        const day = influenceMap.dailyResonance.modulus;

        switch(type) {
            case 'triad':
                title = 'Short Path (Triad)';
                moduli = [core, month, year];
                break;
            case 'arpeggio':
                title = 'Medium Path (Arpeggio)';
                moduli = [core, year, month, day];
                break;
            case 'scale':
                title = 'Long Path (Scale)';
                // A major scale pattern (whole, whole, half, whole, whole, whole) adapted to 24 tones
                // Equivalent steps: +4, +4, +2, +4, +4, +4
                moduli = [core, (core+4)%24, (core+8)%24, (core+10)%24, (core+14)%24, (core+18)%24, (core+22)%24];
                break;
        }
        
        const steps = moduli.map(mod => ({
            title: `${codexData[mod].archetype}: ${codexData[mod].note}`,
            description: codexData[mod].tag,
            duration: 180, // 3 minutes per step
            frequencyId: `codex-${mod}`,
        }));

        const newStack: CustomStack = {
            id: `journey-${type}-${Date.now()}`, title,
            description: `A generative journey based on your harmonic map.`,
            steps,
            colors: createColorTheme(influenceMap.coreBlueprint.color),
            categoryId: 'guided',
        };

        playGeneratedPath(newStack);
    };
    
    const handleRemoveLayer = () => {
      toggleLayer2(null, 'PURE');
      setLayeredFrequency(null);
    }
    
    const isJourneyPlaying = isPlaying && currentlyPlayingItem && currentlyPlayingItem.id.startsWith('journey-');
    const currentJourneyStep = isJourneyPlaying && 'steps' in currentlyPlayingItem ? currentlyPlayingItem.steps[sessionStepIndex] : null;

    const coreBlueprintColor = influenceMap?.coreBlueprint?.color || '#C18D52';

    return (
        <div className="max-w-7xl mx-auto animate-fade-in space-y-8">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-600 dark:text-dark-text-muted hover:text-slate-900 dark:hover:text-dark-text-primary transition-colors self-start" aria-label="Back">
                <BackIcon className="w-6 h-6" />
                <span className="font-semibold">Back to Library</span>
            </button>
            <div className="p-8 rounded-2xl bg-white/60 dark:bg-dark-surface backdrop-blur-md border border-white/50 dark:border-dark-border/50 shadow-lg text-center">
                <PathfinderIcon className="w-20 h-20 text-slate-500 dark:text-brand-gold mx-auto mb-4" />
                <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-dark-text-primary">Codex Universalis</h2>
                <p className="text-slate-700/80 dark:text-dark-text-secondary mt-2 max-w-2xl mx-auto">
                    Explore the interactive soundboard, or enter your birth date to reveal your daily harmonic map and generate personalized sonic journeys.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="p-6 rounded-2xl bg-white/80 dark:bg-dark-surface/80 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-lg space-y-4">
                    <div className="flex items-center justify-center gap-2">
                         <h3 className="text-2xl font-display font-bold text-center text-slate-800 dark:text-dark-text-primary">Your Harmonic Influence Map</h3>
                         <a href="#/science#codex" onClick={handleNavigateToScience} className="text-slate-500 dark:text-dark-text-secondary hover:text-blue-500 dark:hover:text-blue-400 transition-colors" aria-label="Learn more about the Codex">
                            <InfoIcon className="w-5 h-5" />
                        </a>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch justify-center gap-2">
                        <input type="text" inputMode="numeric" pattern="\d*" maxLength={4} placeholder="YYYY" value={birthDate.year} onChange={e => setBirthDate({...birthDate, year: e.target.value})} className="w-full sm:w-28 p-2 rounded-md border border-slate-300 dark:bg-slate-700 dark:border-slate-600 text-center" />
                        <input type="text" inputMode="numeric" pattern="\d*" maxLength={2} placeholder="MM" value={birthDate.month} onChange={e => setBirthDate({...birthDate, month: e.target.value})} className="w-full sm:w-20 p-2 rounded-md border border-slate-300 dark:bg-slate-700 dark:border-slate-600 text-center" />
                        <input type="text" inputMode="numeric" pattern="\d*" maxLength={2} placeholder="DD" value={birthDate.day} onChange={e => setBirthDate({...birthDate, day: e.target.value})} className="w-full sm:w-20 p-2 rounded-md border border-slate-300 dark:bg-slate-700 dark:border-slate-600 text-center" />
                        <button onClick={() => handleCalculateMap()} className="w-full sm:w-auto px-4 py-2 bg-brand-gold text-white font-semibold rounded-md shadow hover:brightness-90 transition-colors">Calculate</button>
                    </div>
                     {dateError && <p className="text-center text-sm text-red-500 mt-2">{dateError}</p>}
                     {influenceMap && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-dark-border animate-fade-in space-y-4">
                            <InfluenceCard title="Core Blueprint" node={influenceMap.coreBlueprint} onHover={setHighlightedModulus} />
                            <InfluenceCard title="Yearly Modulation" node={influenceMap.yearlyModulation} onHover={setHighlightedModulus} />
                            <InfluenceCard title="Monthly Overlay" node={influenceMap.monthlyOverlay} onHover={setHighlightedModulus} />
                            <InfluenceCard title="Daily Resonance" node={influenceMap.dailyResonance} onHover={setHighlightedModulus} />
                        </div>
                    )}
                </div>
                 <div className="p-6 rounded-2xl bg-white/80 dark:bg-dark-surface/80 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-lg space-y-4">
                    <CodexUniversalisField
                        nodes={codexData}
                        influenceMap={influenceMap}
                        interactionMode={interactionMode}
                        highlightedModulus={highlightedModulus}
                        onNodeClick={handleNodeClick}
                        onNodeHover={setHoveredNodeInfo}
                    />
                    <div className="min-h-[6rem] mt-4 p-4 rounded-xl bg-black/5 dark:bg-dark-bg/30 border border-slate-200/50 dark:border-dark-border/50 flex items-center justify-center text-center transition-all duration-300">
                        {hoveredNodeInfo ? (
                            <div className="animate-fade-in">
                                <p className="font-bold text-lg text-slate-800 dark:text-dark-text-primary">{hoveredNodeInfo.note} - {hoveredNodeInfo.archetype}</p>
                                <p className="text-sm text-slate-600 dark:text-dark-text-secondary mt-1">{hoveredNodeInfo.tag}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400 italic">Hover or click a node for details.</p>
                        )}
                    </div>
                     {influenceMap && (
                         <div className="space-y-3">
                            <div className="text-center text-sm text-slate-600 dark:text-dark-text-secondary p-3 rounded-xl bg-black/5 dark:bg-dark-bg/30 border border-slate-200/50 dark:border-dark-border/50">
                                <p className="font-display font-semibold italic text-slate-700 dark:text-dark-text-primary mb-1">Consider This Guideline:</p>
                                <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
                                    <p>Want to <span className="font-bold text-brand-sage">harmonize</span> &rarr; Sequence</p>
                                    <p>Want to <span className="font-bold text-brand-gold">activate</span> &rarr; Layer</p>
                                    <p>Want to <span className="font-bold text-brand-orange">explore or decode</span> &rarr; Combine</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <button
                                    onClick={handlePlayBreathingPath}
                                    disabled={!influenceMap}
                                    className="w-full sm:w-auto px-8 py-4 font-bold rounded-full text-white shadow-lg hover:scale-105 transition-all text-lg disabled:opacity-50 disabled:scale-100 disabled:bg-slate-400"
                                    style={{ 
                                        backgroundColor: influenceMap ? coreBlueprintColor : undefined
                                    }}
                                >
                                    Start Harmonic Breathing
                                </button>
                                <p className="text-xs text-slate-500 dark:text-dark-text-muted mt-3 max-w-xs mx-auto">
                                    A guided 64-second journey syncing your breath with your core harmonic frequencies.
                                </p>
                            </div>
                             <div className="pt-4 mt-2 border-t border-slate-200 dark:border-dark-border text-center">
                                 <h4 className="font-display text-lg font-bold text-slate-700 dark:text-dark-text-secondary">Generate a Custom Journey</h4>
                                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                                     <div>
                                         <button onClick={() => handleGenerateJourney('triad')} className="w-full px-3 py-2 text-sm font-semibold rounded-md bg-black/5 hover:bg-black/10 dark:bg-dark-bg/30 dark:hover:bg-dark-bg/50">Short Path</button>
                                         <p className="text-xs text-slate-500 dark:text-dark-text-muted mt-1">Core + Monthly + Yearly (9 min)</p>
                                     </div>
                                     <div>
                                         <button onClick={() => handleGenerateJourney('arpeggio')} className="w-full px-3 py-2 text-sm font-semibold rounded-md bg-black/5 hover:bg-black/10 dark:bg-dark-bg/30 dark:hover:bg-dark-bg/50">Medium Path</button>
                                         <p className="text-xs text-slate-500 dark:text-dark-text-muted mt-1">All Four Tones (12 min)</p>
                                     </div>
                                     <div>
                                        <button onClick={() => handleGenerateJourney('scale')} className="w-full px-3 py-2 text-sm font-semibold rounded-md bg-black/5 hover:bg-black/10 dark:bg-dark-bg/30 dark:hover:bg-dark-bg/50">Long Path</button>
                                        <p className="text-xs text-slate-500 dark:text-dark-text-muted mt-1">7-Step Harmonic Scale (21 min)</p>
                                     </div>
                                 </div>
                             </div>

                             {isJourneyPlaying && currentJourneyStep && 'steps' in currentlyPlayingItem && (
                                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-dark-border animate-fade-in space-y-2">
                                    <p className="text-center font-bold text-slate-800 dark:text-dark-text-primary">{currentJourneyStep.title}</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-slate-600 dark:text-dark-text-muted">STEP {sessionStepIndex + 1} / {currentlyPlayingItem.steps.length}</span>
                                            <span style={{ color: influenceMap.coreBlueprint.color }}>
                                                {formatTime(currentJourneyStep.duration - sessionTimeInStep)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-900/10 dark:bg-slate-700 rounded-full h-1.5">
                                            <div 
                                                className="h-1.5 rounded-full" 
                                                style={{ 
                                                    width: `${(sessionTimeInStep / currentJourneyStep.duration) * 100}%`, 
                                                    backgroundColor: influenceMap.coreBlueprint.color, 
                                                    transition: 'width 0.5s linear' 
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                             )}

                         </div>
                     )}
                     
                    {/* New Cubicle Grid */}
                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-dark-border">
                        <h3 className="text-xl font-display font-bold text-center text-slate-800 dark:text-dark-text-primary mb-4">Codex Soundboard</h3>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                            {codexData.map(node => (
                                <button
                                    key={node.modulus}
                                    onClick={() => handleNodeClick(node)}
                                    className="p-2 rounded-lg text-center transition-all duration-200 hover:-translate-y-0.5"
                                    style={{ 
                                        border: `2px solid ${node.color}`, 
                                        backgroundColor: `${node.color}20`,
                                    }}
                                >
                                    <div className="font-bold text-lg" style={{ color: node.color }}>{node.note.replace(/[0-9]/g, '')}</div>
                                    <div className="text-xs text-slate-700 dark:text-dark-text-secondary">{node.frequency.toFixed(2)} Hz</div>
                                </button>
                            ))}
                        </div>
                    </div>

                      {mainFrequency && (
                        <div className="space-y-4 mt-4 pt-4 border-t border-slate-200 dark:border-dark-border">
                            {/* Main Tone Section */}
                            <div>
                                <p className="text-xs font-bold uppercase text-slate-500 dark:text-dark-text-muted">Main Tone</p>
                                <p className="font-semibold" style={{color: mainFrequency.colors.accent}}>{mainFrequency.name}</p>
                                <div className="grid grid-cols-[auto,1fr] items-center gap-4 mt-1">
                                    <label htmlFor="main-volume" className="cursor-pointer text-slate-700 dark:text-dark-text-secondary"><VolumeIcon className="w-6 h-6" /></label>
                                    <input id="main-volume" type="range" min="0" max="100" value={mainVolume} onChange={(e) => setMainVolume(parseInt(e.target.value, 10))} className="mobile-slider" style={{'--thumb-color': mainFrequency?.colors.accent || '#C18D52'} as React.CSSProperties}/>
                                </div>
                            </div>

                            {/* Layered Tone Section */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-bold uppercase text-slate-500 dark:text-dark-text-muted">Layered Tone</p>
                                    {layeredFrequency && (
                                        <button onClick={handleRemoveLayer} className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50">Remove</button>
                                    )}
                                </div>
                                
                                {layeredFrequency ? (
                                    <>
                                        <p className="font-semibold" style={{color: layeredFrequency.colors.accent}}>{layeredFrequency.name}</p>
                                        <div className={`grid grid-cols-[auto,1fr] items-center gap-4 mt-1 transition-opacity ${isLayer2Active ? 'opacity-100' : 'opacity-30'}`}>
                                            <label htmlFor="layer2-volume" className={`cursor-pointer ${!isLayer2Active && 'cursor-not-allowed'}`}><LayersIcon className="w-6 h-6 text-slate-700 dark:text-dark-text-secondary" /></label>
                                            <input id="layer2-volume" type="range" min="0" max="100" disabled={!isLayer2Active} value={layer2Volume} onChange={(e) => setLayer2Volume(parseInt(e.target.value, 10))} className={`mobile-slider ${!isLayer2Active && 'cursor-not-allowed'}`} style={{ '--thumb-color': layeredFrequency.colors.accent} as React.CSSProperties} />
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-3 text-center rounded-lg bg-black/5 dark:bg-dark-bg/30 border border-slate-200/50 dark:border-dark-border/50">
                                        <p className="text-sm text-slate-600 dark:text-dark-text-secondary">Click another node or cubicle to add a layer.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                      )}

                     <div className="mt-4 pt-4 border-t border-slate-200 dark:border-dark-border">
                        <SpatialAudioController
                            isSubscribed={isSubscribed}
                            isEnabled={is8dEnabled}
                            onToggle={setIs8dEnabled}
                            speed={panningSpeed}
                            onSpeedChange={setPanningSpeed}
                            depth={panningDepth}
                            onDepthChange={setPanningDepth}
                            color={coreBlueprintColor}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};