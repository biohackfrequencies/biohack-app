import React, { useState } from 'react';
import { Frequency, CustomStack, SessionStep, CategoryId, ColorTheme } from '../types';
import { AlchemyIcon, BackIcon, LayersIcon, SparklesIcon } from './BohoIcons';
import { LayerSelectorModal } from './LayerSelectorModal';
import { useSubscription } from '../hooks/useSubscription';

interface ElementalMixerPageProps {
  allFrequencies: Frequency[];
  onSaveStack: (stack: CustomStack) => void;
  onBack: () => void;
  categories: Record<CategoryId, { title: string; description:string; colors: ColorTheme; }>;
}

const Slot: React.FC<{
  frequency: Frequency | null;
  onClick: () => void;
  onRemove: () => void;
  slotNumber: number;
}> = ({ frequency, onClick, onRemove, slotNumber }) => {
  if (frequency) {
    return (
      <div className="relative p-4 rounded-lg border-2" style={{ borderColor: frequency.colors.accent }}>
        <p className="font-bold text-slate-800 dark:text-dark-text-primary">{frequency.name}</p>
        <p className="text-xs" style={{ color: frequency.colors.accent }}>{frequency.range}</p>
        <button onClick={onRemove} className="absolute top-2 right-2 text-xs font-semibold text-red-500 hover:text-red-700">Remove</button>
      </div>
    );
  }

  return (
    <button onClick={onClick} className="w-full h-20 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
      <LayersIcon className="w-6 h-6" />
      <span className="text-sm font-semibold">Select Element {slotNumber}</span>
    </button>
  );
};

export const ElementalMixerPage: React.FC<ElementalMixerPageProps> = ({ allFrequencies, onSaveStack, onBack, categories }) => {
  const { isSubscribed } = useSubscription();
  const [title, setTitle] = useState('');
  const [slot1, setSlot1] = useState<Frequency | null>(null);
  const [slot2, setSlot2] = useState<Frequency | null>(null);
  const [slot3, setSlot3] = useState<Frequency | null>(null);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [showEthics, setShowEthics] = useState(false);

  const harmonicElements = allFrequencies.filter(f => f.categoryId === 'elements');
  const selectedIds = [slot1, slot2, slot3].map(f => f?.id).filter(Boolean) as string[];

  const handleSelect = (freq: Frequency) => {
    if (editingSlot === 1) setSlot1(freq);
    if (editingSlot === 2) setSlot2(freq);
    if (editingSlot === 3) setSlot3(freq);
    setEditingSlot(null);
  };
  
  const handleSave = () => {
    if (!title.trim() || !slot1) {
      alert('Please provide a title and at least one element.');
      return;
    }

    const steps: SessionStep[] = [{
      title: 'Elemental Resonance',
      description: 'A custom blend of harmonic elements.',
      duration: 600, // 10 minutes default
      frequencyId: slot1.id,
      layerFrequencyId: slot2?.id,
      layer3FrequencyId: slot3?.id,
    }];
    
    const newStack: CustomStack = {
      id: `mixture-${Date.now()}`,
      title,
      description: [slot1.name, slot2?.name, slot3?.name].filter(Boolean).join(' + '),
      steps,
      categoryId: 'guided',
      colors: slot1.colors,
      isMixture: true,
    };
    
    setShowEthics(true);
    setTimeout(() => {
        onSaveStack(newStack);
    }, 2500); // Give user time to read the message
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-8">
      {editingSlot !== null && (
        <LayerSelectorModal
          allFrequencies={harmonicElements.filter(f => !selectedIds.includes(f.id))}
          onSelect={handleSelect}
          onClose={() => setEditingSlot(null)}
          currentMainFrequencyId=""
          title={`Select Element for Slot ${editingSlot}`}
          isSubscribed={isSubscribed}
          categories={categories}
        />
      )}
      <button onClick={onBack} className="flex items-center gap-2 text-slate-600 dark:text-dark-text-muted hover:text-slate-900 dark:hover:text-dark-text-primary transition-colors self-start" aria-label="Back">
        <BackIcon className="w-6 h-6" />
        <span className="font-semibold">Back to Library</span>
      </button>

      <div className="p-8 rounded-2xl bg-white/60 dark:bg-dark-surface backdrop-blur-md border border-white/50 dark:border-dark-border/50 shadow-lg text-center">
        <AlchemyIcon className="w-20 h-20 text-slate-500 dark:text-brand-gold mx-auto mb-4" />
        <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-dark-text-primary">Sonic Alchemy Lab</h2>
        <p className="text-slate-700/80 dark:text-dark-text-secondary mt-2 max-w-2xl mx-auto">
          Create your own "molecular resonances" by layering up to three elemental frequencies.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white/80 dark:bg-dark-surface/80 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-lg space-y-4">
        <div>
          <label htmlFor="mixture-title" className="block text-sm font-semibold text-slate-600 dark:text-dark-text-secondary mb-1">Mixture Name</label>
          <input
            id="mixture-title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., 'Vitality Blend' or 'Starseed Tuner'"
            className="w-full p-3 text-lg rounded-xl border border-slate-300/80 dark:border-dark-border bg-white/80 dark:bg-slate-700 dark:text-dark-text-primary"
          />
        </div>
        <div className="space-y-3">
          <Slot frequency={slot1} onClick={() => setEditingSlot(1)} onRemove={() => setSlot1(null)} slotNumber={1} />
          <Slot frequency={slot2} onClick={() => setEditingSlot(2)} onRemove={() => setSlot2(null)} slotNumber={2} />
          <Slot frequency={slot3} onClick={() => setEditingSlot(3)} onRemove={() => setSlot3(null)} slotNumber={3} />
        </div>
        {showEthics && (
             <div className="mt-4 p-3 rounded-lg bg-teal-100/50 dark:bg-teal-900/30 text-center animate-fade-in flex items-center justify-center gap-3">
                <SparklesIcon className="w-5 h-5 text-teal-600 dark:text-teal-300" />
                <p className="text-sm font-semibold text-teal-800 dark:text-teal-200">Codex Ethics: Use with intention, clarity, and harmonic responsibility.</p>
            </div>
        )}
        <button
          onClick={handleSave}
          disabled={!title.trim() || !slot1 || showEthics}
          className="w-full mt-4 py-4 px-4 rounded-lg font-bold text-white bg-brand-gold hover:scale-105 transition-transform shadow-lg hover:shadow-xl disabled:bg-slate-400 disabled:scale-100"
        >
          {showEthics ? 'Saving...' : 'Save Elemental Mixture'}
        </button>
      </div>
    </div>
  );
};
