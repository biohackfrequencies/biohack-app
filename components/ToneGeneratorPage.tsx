import React, { useState, useEffect, useRef } from 'react';
import { BackIcon, PathfinderIcon, CheckmarkIcon } from './BohoIcons';
import { codexData } from '../data/codex';
import { CustomStack, HarmonicInfluenceMap, HarmonicInfluenceNode, Frequency } from '../types';
import { calculateHarmonicInfluence } from '../services/harmonicInfluenceService';
import { CodexUniversalisField } from './CodexUniversalisField';
import { usePlayer } from '../contexts/PlayerContext';

interface ToneGeneratorPageProps {
    onBack: () => void;
    allFrequencies: Frequency[];
}

type PlaybackMode = 'short' | 'medium' | 'long';
type FieldMode = 'static' | 'breathing' | 'rotating';

const ModeSelector: React.FC<{
    selectedMode: PlaybackMode;
    onSelectMode: (mode: PlaybackMode) => void;
}> = ({ selectedMode, onSelectMode }) => {
    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (remainingSeconds === 0) return `${minutes} min`;
        return `${minutes}m ${remainingSeconds}s`;
    };

    const modes: { id: PlaybackMode; label: string; description: string }[] = [
        { id: 'short', label: 'Short', description: `Core + Daily (${2} steps, ${formatDuration(2 * 30)})` },
        { id: 'medium', label: 'Medium', description: `All four tones (${4} steps, ${formatDuration(4 * 30)})` },
        { id: 'long', label: 'Long', description: `All four as arpeggios (${12} steps, ${formatDuration(12 * 10)})` },
    ];
    return (
        <div className="flex justify-center p-1 rounded-full bg-slate-200/50 dark:bg-dark-surface">
            {modes.map(mode => (
                 <div className="relative group flex-1" key={mode.id}>
                    <button
                        onClick={() => onSelectMode(mode.id)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors w-full ${
                            selectedMode === mode.id
                                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
                        }`}
                    >
                        {mode.label}
                    </button>
                    <div className="absolute bottom-full mb-2 w-48 p-2 rounded-lg bg-slate-800 text-white text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 left-1/2 -translate-x-1/2">
                        {mode.description}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const InfluenceCard: React.FC<{ title: string; node: HarmonicInfluenceNode }> = ({ title, node }) => (
    <div className="p-4 rounded-lg bg-black/5 dark:bg-dark-bg/30 border-l-4" style={{ borderColor: node.color }}>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
        <p className="font-bold text-lg text-slate-800 dark:text-dark-text-primary">{node.note} - {node.archetype}</p>
        <p className="text-sm text-slate-600 dark:text-dark-text-secondary">{node.guidance}</p>
    </div>
);

export const ToneGeneratorPage: React.FC<ToneGeneratorPageProps> = ({ onBack, allFrequencies }) => {
    const player = usePlayer();
    const { currentlyPlayingItem, sessionStepIndex } = player;

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
    const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('medium');
    const [useDrone, setUseDrone] = useState(false);
    const [fieldMode, setFieldMode] = useState<FieldMode>('static');
    const [highlightedModulus, setHighlightedModulus] = useState<number | null>(null);

    // Save state to session storage on change
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

    // Recalculate on mount to ensure daily/monthly data is current
    useEffect(() => {
        if (sessionStorage.getItem('codexInfluenceMap')) {
            const { year, month, day } = birthDate;
            const yearNum = parseInt(year, 10);
            const monthNum = parseInt(month, 10);
            const dayNum = parseInt(day, 10);
            if (!isNaN(yearNum) && !isNaN(monthNum) && !isNaN(dayNum)) {
                setInfluenceMap(calculateHarmonicInfluence(yearNum, monthNum, dayNum));
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (currentlyPlayingItem?.id.startsWith('path-influence-') && 'steps' in currentlyPlayingItem) {
            const currentStep = currentlyPlayingItem.steps[sessionStepIndex];
            if (currentStep) {
                const modulusToHighlight = parseInt(currentStep.frequencyId.replace('codex-', ''));
                setHighlightedModulus(modulusToHighlight);
            }
        } else if (highlightedModulus !== null) {
            setHighlightedModulus(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentlyPlayingItem, sessionStepIndex]);

    const handleCalculateMap = () => {
        setDateError(null);
        const { year, month, day } = birthDate;
        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10);
        const dayNum = parseInt(day, 10);

        if (!year || !month || !day || isNaN(yearNum) || isNaN(monthNum) || isNaN(dayNum)) {
            setDateError("Please enter a valid date.");
            return;
        }
        if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31 || yearNum < 1900 || yearNum > new Date().getFullYear()) {
            setDateError("Please enter a realistic date.");
            return;
        }

        const map = calculateHarmonicInfluence(yearNum, monthNum, dayNum);
        setInfluenceMap(map);
    };
    
    const handlePlayPath = () => {
        if (!influenceMap) return;
        
        let sourceModuli: number[] = [];
        let stepDuration = 30; // seconds

        const fullPathModuli = influenceMap.suggestedPathModuli;

        switch (playbackMode) {
            case 'short':
                sourceModuli = [fullPathModuli[0], fullPathModuli[3]]; // Core + Daily
                break;
            case 'medium':
                sourceModuli = fullPathModuli; // All four
                break;
            case 'long':
                sourceModuli = fullPathModuli; // All four, will be expanded
                stepDuration = 10; // Shorter duration for each arpeggio note
                break;
        }

        let finalStepsData: { modulus: number; isRoot: boolean }[] = [];
        if (playbackMode === 'long') {
            sourceModuli.forEach(mod => {
                finalStepsData.push({ modulus: mod, isRoot: true });
                finalStepsData.push({ modulus: (mod + 4) % 24, isRoot: false }); // Major Third
                finalStepsData.push({ modulus: (mod + 7) % 24, isRoot: false }); // Perfect Fifth
            });
        } else {
            finalStepsData = sourceModuli.map(mod => ({ modulus: mod, isRoot: true }));
        }
        
        const droneFrequencyId = useDrone ? `codex-${influenceMap.coreBlueprint.modulus}` : undefined;
        
        const pathTitles = ["Core Blueprint", "Yearly Modulation", "Monthly Overlay", "Daily Resonance"];
        const pathShortTitles = ["Core", "Yearly", "Monthly", "Daily"];

        const steps = finalStepsData.map((item, index) => {
            const node = codexData.find(n => n.modulus === item.modulus)!;
            const frequencyId = `codex-${node.modulus}`;
            
            let title: string;
            if (playbackMode === 'long') {
                const rootIndex = Math.floor(index / 3);
                title = `${pathShortTitles[rootIndex]} Arpeggio: ${node.note}`;
            } else {
                const sourceIndex = sourceModuli.indexOf(item.modulus);
                const titleIndex = playbackMode === 'short' ? (sourceIndex === 0 ? 0 : 3) : sourceIndex;
                title = `${pathTitles[titleIndex]}: ${node.note}`;
            }

            return {
                title,
                description: node.archetype,
                duration: stepDuration,
                frequencyId: frequencyId,
                layerFrequencyId: (droneFrequencyId && droneFrequencyId !== frequencyId) ? droneFrequencyId : undefined,
            };
        });

        const newStack: CustomStack = {
            id: `path-influence-${Date.now()}`,
            title: `My Harmonic Influence Path`,
            description: `A personalized journey through your core harmonic frequencies based on your birth date.`,
            steps: steps,
            colors: { primary: '#e9d5ff', secondary: '#c4b5fd', accent: '#a855f7' },
            categoryId: 'guided',
        };

        const firstStep = newStack.steps[0];
        if (!firstStep) return;

        const firstMainFreq = allFrequencies.find(f => f.id === firstStep.frequencyId);
        if (!firstMainFreq) return;
        
        const firstLayerFreq = firstStep.layerFrequencyId ? allFrequencies.find(f => f.id === firstStep.layerFrequencyId) : null;
        
        player.startPlayback(
            newStack,
            firstMainFreq,
            firstMainFreq.defaultMode,
            firstLayerFreq || null,
            firstLayerFreq?.defaultMode || 'BINAURAL'
        );
    };


    return (
        <div className="max-w-7xl mx-auto animate-fade-in space-y-8">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-600 dark:text-dark-text-muted hover:text-slate-900 dark:hover:text-dark-text-primary transition-colors self-start" aria-label="Back">
                <BackIcon className="w-6 h-6" />
                <span className="font-semibold">Back to Library</span>
            </button>
            <div className="p-8 rounded-2xl bg-white/60 dark:bg-dark-surface backdrop-blur-md border border-white/50 dark:border-dark-border/50 shadow-lg text-center">
                <PathfinderIcon className="w-20 h-20 text-slate-500 dark:text-brand-gold mx-auto mb-4" />
                <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-dark-text-primary">Codex Harmonics</h2>
                <p className="text-slate-700/80 dark:text-dark-text-secondary mt-2 max-w-2xl mx-auto">
                    Discover your Harmonic Influence Map and see it come alive in the Codex Universalis Field. Enter your birth date to generate a personalized journey.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="p-6 rounded-2xl bg-white/80 dark:bg-dark-surface/80 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-lg space-y-4">
                    <h3 className="text-2xl font-display font-bold text-center text-slate-800 dark:text-dark-text-primary">Your Harmonic Influence Map</h3>
                    <div className="flex flex-col sm:flex-row items-stretch justify-center gap-2">
                        <input type="text" inputMode="numeric" pattern="\d*" maxLength={4} placeholder="YYYY" value={birthDate.year} onChange={e => setBirthDate({...birthDate, year: e.target.value})} className="w-full sm:w-28 p-2 rounded-md border border-slate-300 dark:bg-slate-700 dark:border-slate-600 text-center" />
                        <input type="text" inputMode="numeric" pattern="\d*" maxLength={2} placeholder="MM" value={birthDate.month} onChange={e => setBirthDate({...birthDate, month: e.target.value})} className="w-full sm:w-20 p-2 rounded-md border border-slate-300 dark:bg-slate-700 dark:border-slate-600 text-center" />
                        <input type="text" inputMode="numeric" pattern="\d*" maxLength={2} placeholder="DD" value={birthDate.day} onChange={e => setBirthDate({...birthDate, day: e.target.value})} className="w-full sm:w-20 p-2 rounded-md border border-slate-300 dark:bg-slate-700 dark:border-slate-600 text-center" />
                        <button onClick={handleCalculateMap} className="w-full sm:w-auto px-4 py-2 bg-brand-gold text-white font-semibold rounded-md shadow hover:brightness-90 transition-colors">Calculate</button>
                    </div>
                    {dateError && <p className="text-center text-sm text-red-500 mt-2">{dateError}</p>}

                    {influenceMap && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-dark-border animate-fade-in space-y-4">
                            <InfluenceCard title="Core Blueprint" node={influenceMap.coreBlueprint} />
                            <InfluenceCard title="Yearly Modulation" node={influenceMap.yearlyModulation} />
                            <InfluenceCard title="Monthly Overlay" node={influenceMap.monthlyOverlay} />
                            <InfluenceCard title="Daily Resonance" node={influenceMap.dailyResonance} />

                            <div className="space-y-3 pt-4">
                                <p className="text-center text-sm font-semibold text-slate-600 dark:text-dark-text-secondary">Playback Mode</p>
                                <ModeSelector selectedMode={playbackMode} onSelectMode={setPlaybackMode} />
            
                                <div className="flex items-center justify-center pt-2">
                                    <label htmlFor="drone-checkbox" className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-dark-text-secondary">
                                        <input
                                            type="checkbox"
                                            id="drone-checkbox"
                                            checked={useDrone}
                                            onChange={(e) => setUseDrone(e.target.checked)}
                                            className="hidden"
                                        />
                                        <div className="w-5 h-5 rounded border-2 border-slate-400 dark:border-slate-500 flex items-center justify-center flex-shrink-0">
                                            {useDrone && <CheckmarkIcon className="w-3 h-3 text-brand-gold font-bold" />}
                                        </div>
                                        <span>Add Core Blueprint drone for grounding</span>
                                    </label>
                                </div>
                            </div>
            
                            <button
                                onClick={handlePlayPath}
                                className="w-full mt-2 py-3 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-lg shadow-lg hover:brightness-90 transition-all text-base"
                            >
                                Play My Harmonic Path
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-6 rounded-2xl bg-white/80 dark:bg-dark-surface/80 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-lg space-y-4 flex flex-col items-center">
                    <h3 className="text-2xl font-display font-bold text-center text-slate-800 dark:text-dark-text-primary">Codex Universalis Field</h3>
                    <CodexUniversalisField
                        nodes={codexData}
                        influenceMap={influenceMap}
                        interactionMode={fieldMode}
                        allFrequencies={allFrequencies}
                        highlightedModulus={highlightedModulus}
                    />
                     <div className="flex justify-center p-1 rounded-full bg-slate-200/50 dark:bg-dark-surface mt-4 w-full max-w-xs">
                        <button onClick={() => setFieldMode('static')} className={`px-4 py-1 text-xs font-semibold rounded-full w-full ${fieldMode === 'static' ? 'bg-white dark:bg-slate-700 shadow' : 'text-slate-500'}`}>Static</button>
                        <button onClick={() => setFieldMode('breathing')} className={`px-4 py-1 text-xs font-semibold rounded-full w-full ${fieldMode === 'breathing' ? 'bg-white dark:bg-slate-700 shadow' : 'text-slate-500'}`}>Breathing</button>
                        <button onClick={() => setFieldMode('rotating')} className={`px-4 py-1 text-xs font-semibold rounded-full w-full ${fieldMode === 'rotating' ? 'bg-white dark:bg-slate-700 shadow' : 'text-slate-500'}`}>Rotating</button>
                    </div>
                </div>

            </div>

        </div>
    );
};