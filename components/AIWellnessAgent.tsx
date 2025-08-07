import React, { useState } from 'react';
import { BackIcon, OracleIcon } from './BohoIcons';
import { Frequency, CustomStack } from '../types';
import { generateAiCreation } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface AIWellnessAgentProps {
  allFrequencies: Frequency[];
  onSaveStack: (stack: CustomStack) => void;
  onBack: () => void;
}

const AIWellnessAgent: React.FC<AIWellnessAgentProps> = ({ allFrequencies, onSaveStack, onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await generateAiCreation(prompt, allFrequencies);
      
      const newStack: CustomStack = {
        ...response.creation,
        id: `stack-ai-${Date.now()}`,
        categoryId: 'guided',
        colors: { primary: '#d8b4fe', secondary: '#e9d5ff', accent: '#c084fc' }, // AI theme color
        advice: response.advice,
      };

      onSaveStack(newStack); // This will save and navigate
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Sorry, I couldn't create a session right now. Please try a different prompt.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-8">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-600 dark:text-dark-text-muted hover:text-slate-900 dark:hover:text-dark-text-primary transition-colors self-start" aria-label="Back">
        <BackIcon className="w-6 h-6" />
        <span className="font-semibold">Back to Library</span>
      </button>

      <div className="p-8 rounded-2xl bg-white/60 dark:bg-dark-surface backdrop-blur-md border border-white/50 dark:border-dark-border/50 shadow-lg text-center">
        <OracleIcon className="w-20 h-20 text-slate-500 dark:text-brand-gold mx-auto mb-4" />
        <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-dark-text-primary">Codex Alchemist</h2>
        <p className="text-slate-700/80 dark:text-dark-text-secondary mt-2 max-w-2xl mx-auto">
          Describe an intention, feeling, or goal, and our AI will instantly design a personalized sound journey for you.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white/80 dark:bg-dark-surface/80 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Create a session to help me release creative blocks' or 'I feel scattered and need to ground my energy'"
            className="w-full h-32 p-4 text-lg rounded-xl border border-slate-300/80 dark:border-dark-border bg-white/80 dark:bg-slate-700 dark:text-dark-text-primary focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
            disabled={isLoading}
          />
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full flex items-center justify-center py-4 px-4 rounded-lg font-bold text-white bg-brand-gold hover:scale-105 transition-transform shadow-lg hover:shadow-xl disabled:bg-slate-400 disabled:scale-100"
          >
            {isLoading ? <LoadingSpinner /> : 'Generate Session'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIWellnessAgent;