import React, { useState, useMemo } from 'react';
import { Frequency, CustomStack, SessionStep, CategoryId, ColorTheme } from '../types';
import { StackIcon, BackIcon, LayersIcon } from './BohoIcons';
import { LayerSelectorModal } from './LayerSelectorModal';
import { useSubscription } from '../hooks/useSubscription';

interface CreateStackPageProps {
  allFrequencies: Frequency[];
  onSaveStack: (stack: CustomStack) => void;
  onBack: () => void;
  existingStack?: CustomStack;
  categories: Record<CategoryId, { title: string; description:string; colors: ColorTheme; }>;
}

const StepItem: React.FC<{
    step: SessionStep,
    index: number,
    allFrequencies: Frequency[],
    updateStepDuration: (index: number, duration: number) => void,
    removeStep: (index: number) => void,
    moveStep: (index: number, direction: 'up' | 'down') => void,
    openLayerModal: (index: number) => void,
    removeLayer: (index: number) => void,
    isLast: boolean,
}> = ({ step, index, allFrequencies, updateStepDuration, removeStep, moveStep, openLayerModal, removeLayer, isLast }) => {
    const mainFreq = allFrequencies.find(f => f.id === step.frequencyId);
    const layerFreq = allFrequencies.find(f => f.id === step.layerFrequencyId);

    if (!mainFreq) return null;

    return (
        <div className="p-4 rounded-lg bg-slate-100/70 dark:bg-dark-surface/50 border border-slate-200 dark:border-dark-border/50 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-slate-800 dark:text-dark-text-primary">Step {index + 1}: {mainFreq.name}</p>
                    <p className="text-xs" style={{ color: mainFreq.colors.accent }}>{mainFreq.range}</p>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => moveStep(index, 'up')} disabled={index === 0} className="p-1 rounded-full bg-white/50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-600 disabled:opacity-30 text-sm">&#9650;</button>
                    <button onClick={() => moveStep(index, 'down')} disabled={isLast} className="p-1 rounded-full bg-white/50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-600 disabled:opacity-30 text-sm">&#9660;</button>
                    <button onClick={() => removeStep(index)} className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 text-lg">&times;</button>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <label htmlFor={`duration-${index}`} className="text-sm font-semibold text-slate-600 dark:text-dark-text-secondary">Duration:</label>
                <input
                    id={`duration-${index}`} type="number" value={step.duration / 60} min="1" max="60"
                    onChange={e => updateStepDuration(index, parseInt(e.target.value, 10))}
                    className="w-20 p-2 rounded-md border border-slate-300 dark:bg-slate-700 dark:border-dark-border dark:text-dark-text-primary"
                />
                <span className="text-sm text-slate-600 dark:text-dark-text-secondary">min</span>
            </div>
            <div className="p-3 rounded-md bg-white/60 dark:bg-slate-700/40 border border-slate-200/80 dark:border-dark-border/50">
                {layerFreq ? (
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-dark-text-muted">LAYER</p>
                            <p className="font-semibold text-slate-800 dark:text-dark-text-primary">{layerFreq.name}</p>
                        </div>
                        <div>
                            <button onClick={() => openLayerModal(index)} className="text-xs font-semibold text-blue-600 dark:text-blue-400 mr-2">Change</button>
                            <button onClick={() => removeLayer(index)} className="text-xs font-semibold text-red-600 dark:text-red-400">Remove</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => openLayerModal(index)} className="w-full flex items-center justify-center gap-2 text-slate-600 dark:text-dark-text-secondary hover:text-slate-900 dark:hover:text-dark-text-primary transition-colors">
                        <LayersIcon className="w-5 h-5" />
                        <span className="text-sm font-semibold">Add Layer</span>
                    </button>
                )}
            </div>
        </div>
    );
};


export const CreateStackPage: React.FC<CreateStackPageProps> = ({ 
    allFrequencies, onSaveStack, onBack, existingStack, categories
}) => {
    const { isSubscribed } = useSubscription();
    const [title, setTitle] = useState(existingStack?.title || '');
    const [description, setDescription] = useState(existingStack?.description || '');
    const [steps, setSteps] = useState<SessionStep[]>(existingStack?.steps || []);
    const [searchQuery, setSearchQuery] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);

    const filteredFrequencies = useMemo(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return allFrequencies.filter(f => f.name.toLowerCase().includes(lowerCaseQuery));
    }, [searchQuery, allFrequencies]);


    const addStep = (freq: Frequency) => {
        const newStep: SessionStep = {
            title: freq.name,
            description: freq.description.substring(0, 100),
            duration: 300,
            frequencyId: freq.id,
        };
        setSteps(prev => [...prev, newStep]);
    };

    const updateStepDuration = (index: number, minutes: number) => {
        if (minutes < 1 || minutes > 60) return;
        setSteps(prev => prev.map((step, i) => i === index ? { ...step, duration: minutes * 60 } : step));
    };
    
    const removeStep = (index: number) => {
        setSteps(prev => prev.filter((_, i) => i !== index));
    };

    const moveStep = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === steps.length - 1)) return;
        const newSteps = [...steps];
        const [movedItem] = newSteps.splice(index, 1);
        newSteps.splice(index + (direction === 'up' ? -1 : 1), 0, movedItem);
        setSteps(newSteps);
    };
    
    const openLayerModal = (index: number) => {
        if(isSubscribed) {
            setEditingStepIndex(index);
            setIsModalOpen(true);
        } else {
            window.location.hash = '#/paywall';
        }
    };

    const handleSelectLayer = (layerFreq: Frequency) => {
        if (editingStepIndex !== null) {
            setSteps(prev => prev.map((step, i) => i === editingStepIndex ? { ...step, layerFrequencyId: layerFreq.id } : step));
        }
        setIsModalOpen(false);
        setEditingStepIndex(null);
    };
    
    const removeLayer = (index: number) => {
        setSteps(prev => prev.map((step, i) => {
            if (i === index) {
                const { layerFrequencyId, ...rest } = step;
                return rest;
            }
            return step;
        }));
    };

    const handleSave = () => {
        if (!title.trim() || !description.trim() || steps.length === 0) {
            alert('Please provide a title, description, and at least one step.');
            return;
        }
        const newStack: CustomStack = {
            id: existingStack?.id || `stack-${Date.now()}`,
            title,
            description,
            steps,
            categoryId: 'guided',
            colors: { primary: '#e2e8f0', secondary: '#f1f5f9', accent: '#94a3b8' }
        };
        onSaveStack(newStack);
    };

    return (
        <div className="p-2 sm:p-4 rounded-2xl bg-slate-100 dark:bg-dark-bg space-y-8 animate-fade-in max-w-7xl mx-auto">
             {isModalOpen && editingStepIndex !== null && (
                <LayerSelectorModal
                    allFrequencies={allFrequencies}
                    onSelect={handleSelectLayer}
                    onClose={() => setIsModalOpen(false)}
                    currentMainFrequencyId={steps[editingStepIndex]?.frequencyId}
                    title="Select a Layer Frequency"
                    isSubscribed={isSubscribed}
                    categories={categories}
                />
            )}
            <button onClick={onBack} className="flex items-center gap-2 text-slate-600 dark:text-dark-text-muted hover:text-slate-900 dark:hover:text-dark-text-primary transition-colors self-start" aria-label="Back">
                <BackIcon className="w-6 h-6" />
                <span className="font-semibold">Back to Home</span>
            </button>

            <div className="text-center p-8 rounded-xl bg-white/30 dark:bg-dark-surface/20 backdrop-blur-sm">
                <StackIcon className="w-20 h-20 text-slate-500 dark:text-brand-gold mx-auto mb-4" />
                <h2 className="text-4xl font-display font-bold text-slate-800 dark:text-dark-text-primary">Creator Studio</h2>
                <p className="text-slate-700/80 dark:text-dark-text-secondary max-w-2xl mx-auto mt-2">
                    Design your own personalized sound journeys by stacking multiple frequencies in a sequence.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6 p-6 rounded-2xl bg-white/60 dark:bg-dark-surface backdrop-blur-md border border-white/50 dark:border-dark-border/50 shadow-lg">
                    <h3 className="font-display text-2xl font-bold text-slate-800 dark:text-dark-text-primary">Your Session Stack</h3>
                    <div>
                        <label htmlFor="stack-title" className="block text-sm font-semibold text-slate-600 dark:text-dark-text-secondary mb-1">Stack Title</label>
                        <input id="stack-title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Morning Focus Flow" className="w-full p-3 text-lg rounded-xl border border-slate-300/80 dark:border-dark-border bg-white/80 dark:bg-slate-700 dark:text-dark-text-primary" />
                    </div>
                    <div>
                        <label htmlFor="stack-desc" className="block text-sm font-semibold text-slate-600 dark:text-dark-text-secondary mb-1">Description</label>
                        <textarea id="stack-desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this stack for?" className="w-full p-3 h-24 text-base rounded-xl border border-slate-300/80 dark:border-dark-border bg-white/80 dark:bg-slate-700 dark:text-dark-text-primary"></textarea>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-semibold text-slate-700 dark:text-dark-text-secondary">Steps ({steps.length})</h4>
                        {steps.length === 0 ? (
                            <p className="text-slate-500 dark:text-dark-text-muted text-center py-4 border-2 border-dashed border-slate-300 dark:border-dark-border rounded-lg">Add frequencies from the list on the right to begin.</p>
                        ) : (
                            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                {steps.map((step, index) => (
                                    <StepItem
                                        key={index}
                                        step={step}
                                        index={index}
                                        allFrequencies={allFrequencies}
                                        updateStepDuration={updateStepDuration}
                                        removeStep={removeStep}
                                        moveStep={moveStep}
                                        openLayerModal={openLayerModal}
                                        removeLayer={removeLayer}
                                        isLast={index === steps.length - 1}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={handleSave} className="w-full py-3 bg-brand-gold text-white font-bold rounded-lg shadow-lg hover:brightness-90 transition-all">Save Session Stack</button>
                </div>
                
                <div className="space-y-4 p-6 rounded-2xl bg-white/60 dark:bg-dark-surface backdrop-blur-md border border-white/50 dark:border-dark-border/50 shadow-lg">
                    <h3 className="font-display text-2xl font-bold text-slate-800 dark:text-dark-text-primary">Available Frequencies</h3>
                    <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search frequencies..." className="w-full p-3 rounded-lg border border-slate-300/80 dark:border-dark-border dark:bg-slate-700 dark:text-dark-text-primary" />
                    <div className="space-y-2 max-h-[40rem] overflow-y-auto pr-2">
                        {Object.entries(categories).map(([categoryId, categoryDetails]) => {
                            const categoryFrequencies = filteredFrequencies.filter(f => f.categoryId === categoryId);
                            if (categoryFrequencies.length === 0) return null;

                            // Sort frequencies within each category
                            categoryFrequencies.sort((a, b) => {
                                if (categoryId === 'solfeggio') {
                                    return a.baseFrequency - b.baseFrequency;
                                }
                                return a.name.localeCompare(b.name);
                            });

                            return (
                                <div key={categoryId}>
                                    <h4 className="font-bold text-slate-600 dark:text-dark-text-secondary sticky top-0 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm py-1">{categoryDetails.title}</h4>
                                    {categoryFrequencies.map(freq => (
                                        <button key={freq.id} onClick={() => addStep(freq)} className="w-full text-left p-2 rounded-md hover:bg-amber-100/50 dark:hover:bg-amber-900/20 transition-colors">
                                            <span className="font-semibold text-slate-800 dark:text-dark-text-primary">{freq.name}</span>
                                            <span className="text-sm ml-2" style={{color: freq.colors.accent}}>{freq.range}</span>
                                        </button>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};