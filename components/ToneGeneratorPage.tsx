import React, { useState } from 'react';
import { BackIcon, PathfinderIcon } from './BohoIcons';
import { codexData } from '../data/codex';
import { codexPairings } from '../data/codexPairs';
import { CodexNode, CustomStack } from '../types';

interface ToneGeneratorPageProps {
    onBack: () => void;
    onPlayAiSession: (session: CustomStack) => void;
}

export const ToneGeneratorPage: React.FC<ToneGeneratorPageProps> = ({ onBack, onPlayAiSession }) => {
    const [primaryNode, setPrimaryNode] = useState<CodexNode>(codexData[0]);
    const [secondaryNode, setSecondaryNode] = useState<CodexNode | null>(null);

    const handlePlay = (freq: number) => {
        window.location.hash = `#/player/custom?freq=${freq}`;
    };

    const handlePlayPair = () => {
        if (primaryNode && secondaryNode) {
            window.location.hash = `#/player/custom?freq=${primaryNode.frequency}&layerFreq=${secondaryNode.frequency}`;
        }
    };
    
    const handleNodeClick = (node: CodexNode) => {
        if (primaryNode && secondaryNode) {
            setPrimaryNode(node);
            setSecondaryNode(null);
        } else if (primaryNode) {
            if (node.modulus !== primaryNode.modulus) {
                setSecondaryNode(node);
            }
        } else {
            setPrimaryNode(node);
        }
    };

    const handleGeneratePath = (pathType: 'short' | 'medium' | 'long') => {
        if (!primaryNode) return;

        const pathModuli = primaryNode.journeys[pathType].moduli;
        const pathNodes = pathModuli.map(mod => codexData.find(n => n.modulus === mod)!);

        const newStack: CustomStack = {
            id: `path-${Date.now()}`,
            title: `${primaryNode.note} Harmonic Journey (${pathType})`,
            description: `A harmonically resonant journey from the Codex wheel, starting with ${primaryNode.note}.`,
            steps: pathNodes.map(node => ({
                title: node.note,
                description: node.archetype,
                duration: 30, // 30 seconds per tone
                frequencyId: `codex-${node.modulus}`,
            })),
            colors: { primary: '#e9d5ff', secondary: '#c4b5fd', accent: '#a855f7' },
            categoryId: 'guided',
        };

        onPlayAiSession(newStack);
    };
    
    const getInterpretation = (p: CodexNode, s: CodexNode): string => {
        const key = `${p.modulus}|${s.modulus}`;
        return codexPairings[key] || "No interpretation found for this pair.";
    };

    const wheelRadius = 150;
    const nodeSize = 32;

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-600 dark:text-dark-text-muted hover:text-slate-900 dark:hover:text-dark-text-primary transition-colors self-start" aria-label="Back">
                <BackIcon className="w-6 h-6" />
                <span className="font-semibold">Back to Library</span>
            </button>
            <div className="p-8 rounded-2xl bg-white/60 dark:bg-dark-surface backdrop-blur-md border border-white/50 dark:border-dark-border/50 shadow-lg text-center">
                <PathfinderIcon className="w-20 h-20 text-slate-500 dark:text-brand-gold mx-auto mb-4" />
                <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-dark-text-primary">Codex Harmonics</h2>
                <p className="text-slate-700/80 dark:text-dark-text-secondary mt-2 max-w-xl mx-auto">
                    An interactive wheel linking 24 harmonic positions to musical notes, frequencies, and symbolic archetypes. Select tones to discover their resonance or generate entire harmonic journeys.
                </p>
            </div>

            <p className="text-center text-slate-700 dark:text-dark-text-secondary italic">
                Every position on this wheel is a unique tone and symbolic meaning — find yours or explore freely.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Codex Wheel */}
                <div className="relative w-[320px] h-[320px] mx-auto">
                    {codexData.map((node, i) => {
                        const angle = (i / 24) * 2 * Math.PI - (Math.PI / 2);
                        const x = wheelRadius * Math.cos(angle) + wheelRadius - (nodeSize / 2);
                        const y = wheelRadius * Math.sin(angle) + wheelRadius - (nodeSize / 2);
                        const isPrimary = primaryNode.modulus === node.modulus;
                        const isSecondary = secondaryNode?.modulus === node.modulus;
                        
                        let sizeClass = 'w-8 h-8 border-2';
                        let zIndex = 'z-0';
                        if (isPrimary) {
                           sizeClass = 'w-10 h-10 border-4 z-10 shadow-lg';
                        } else if (isSecondary) {
                           sizeClass = 'w-8 h-8 border-2 border-dashed';
                        }
                        
                        return (
                            <button
                                key={node.modulus}
                                onClick={() => handleNodeClick(node)}
                                className={`absolute flex items-center justify-center rounded-full font-bold text-xs transition-all duration-300 ${sizeClass} ${zIndex} bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200`}
                                style={{
                                    left: `${x}px`,
                                    top: `${y}px`,
                                    borderColor: (isPrimary || isSecondary) ? '#C18D52' : 'rgb(203 213 225)',
                                }}
                                title={`${node.note} - ${node.frequency} Hz`}
                            >
                                {node.modulus}
                            </button>
                        );
                    })}
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[260px] h-[260px] border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-full"></div>
                    </div>
                </div>

                {/* Details Card */}
                <div className="p-6 rounded-2xl bg-white/80 dark:bg-dark-surface/80 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-lg">
                    <p className="font-semibold text-sm text-brand-gold">
                        Primary: Modulus {primaryNode.modulus}
                    </p>
                    <h3 className="text-4xl font-bold text-slate-800 dark:text-dark-text-primary mt-1">{primaryNode.note}</h3>
                    <p className="text-xl font-mono text-slate-600 dark:text-dark-text-secondary">{primaryNode.frequency.toFixed(2)} Hz</p>
                    <div className="my-4 h-px bg-slate-200 dark:bg-dark-border"></div>
                    <p className="font-bold text-slate-700 dark:text-dark-text-primary">Symbolic Archetype:</p>
                    <p className="text-slate-600 dark:text-dark-text-secondary italic">{primaryNode.archetype}</p>
                    
                    {secondaryNode && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-dark-border animate-fade-in">
                            <p className="font-semibold text-sm text-brand-gold">
                                Secondary: Modulus {secondaryNode.modulus}
                            </p>
                            <h4 className="text-2xl font-bold text-slate-800 dark:text-dark-text-primary mt-1">{secondaryNode.note} ({secondaryNode.frequency.toFixed(2)} Hz)</h4>
                            <div className="my-4 h-px bg-slate-200 dark:bg-dark-border"></div>
                             <p className="font-bold text-slate-700 dark:text-dark-text-primary">Combined Resonance:</p>
                             <p className="text-slate-600 dark:text-dark-text-secondary italic">{getInterpretation(primaryNode, secondaryNode)}</p>
                            <div className="mt-4 flex flex-col gap-2">
                                <button
                                    onClick={handlePlayPair}
                                    className="w-full py-3 bg-brand-gold text-white font-bold rounded-lg shadow-lg hover:brightness-90 transition-all text-base"
                                >
                                    Play Pairing
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handlePlay(primaryNode.frequency)}
                                        className="w-full py-2 bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-dark-text-secondary font-semibold rounded-lg shadow-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-all text-sm"
                                    >
                                        Play Tone 1
                                    </button>
                                     <button
                                        onClick={() => handlePlay(secondaryNode.frequency)}
                                        className="w-full py-2 bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-dark-text-secondary font-semibold rounded-lg shadow-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-all text-sm"
                                    >
                                        Play Tone 2
                                    </button>
                                </div>
                                <button
                                    onClick={() => setSecondaryNode(null)}
                                    className="w-full py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-100/50 dark:hover:bg-red-900/20 rounded-lg"
                                >
                                    Clear Pairing
                                </button>
                            </div>
                        </div>
                    )}

                    {!secondaryNode && (
                         <div className="mt-4 space-y-4">
                             <button
                                onClick={() => handlePlay(primaryNode.frequency)}
                                className="w-full py-2 bg-brand-gold text-white font-bold rounded-lg shadow-lg hover:brightness-90 transition-all text-base"
                            >
                                Play Tone
                            </button>
                             <div className="pt-4 border-t border-slate-200 dark:border-dark-border">
                                <p className="text-center font-bold text-slate-700 dark:text-dark-text-primary mb-2">Generate Harmonic Journey</p>
                                <div className="text-xs text-slate-600 dark:text-dark-text-secondary mb-3 text-center space-y-1">
                                    <p>A Harmonic Journey is a sequence of tones designed to guide you through a specific sound experience.</p>
                                    <p><strong className="font-semibold text-slate-700 dark:text-dark-text-primary">Short (Triad):</strong> Root, harmony, octave — balanced and centered.</p>
                                    <p><strong className="font-semibold text-slate-700 dark:text-dark-text-primary">Medium (Arpeggio):</strong> A flowing 5‑tone pattern — richer and more dynamic.</p>
                                    <p><strong className="font-semibold text-slate-700 dark:text-dark-text-primary">Long (Scale):</strong> A full 7‑tone journey — immersive and evolving.</p>
                                </div>
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => handleGeneratePath('short')} className="px-3 py-1 text-sm font-semibold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-dark-text-secondary hover:bg-slate-300 dark:hover:bg-slate-600">Short (Triad)</button>
                                    <button onClick={() => handleGeneratePath('medium')} className="px-3 py-1 text-sm font-semibold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-dark-text-secondary hover:bg-slate-300 dark:hover:bg-slate-600">Medium (Arpeggio)</button>
                                    <button onClick={() => handleGeneratePath('long')} className="px-3 py-1 text-sm font-semibold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-dark-text-secondary hover:bg-slate-300 dark:hover:bg-slate-600">Long (Scale)</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};