import React, { useState } from 'react';
import { BackIcon, OracleIcon } from './BohoIcons';
import { useUserData } from '../contexts/UserDataContext';
import { getAiCodexReflection } from '../services/geminiService';
import { AiReflectionResponse } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { CodexReflection, CustomStack, Frequency, GuidedSession } from '../types';
import { useSubscription } from '../hooks/useSubscription';

interface CodexOraclePageProps {
  onBack: () => void;
  allFrequencies: Frequency[];
  allSessions: GuidedSession[];
  customStacks: CustomStack[];
}

const PRESET_INTENTIONS = [
    "I want to release creative blocks.",
    "Help me find clarity on my path.",
    "I wish to connect with my inner strength.",
    "I want to cultivate a feeling of abundance.",
    "How can I open my heart to new connections?",
];

export const CodexOraclePage: React.FC<CodexOraclePageProps> = ({ onBack, allFrequencies, allSessions, customStacks }) => {
    const { setCodexReflections, aiCreditsRemaining } = useUserData();
    const { isSubscribed } = useSubscription();
    const [intention, setIntention] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reflection, setReflection] = useState<AiReflectionResponse | null>(null);
    const hasNoCredits = !isSubscribed && aiCreditsRemaining <= 0;

    const handleShuffle = () => {
        const randomIndex = Math.floor(Math.random() * PRESET_INTENTIONS.length);
        setIntention(PRESET_INTENTIONS[randomIndex]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!intention.trim() || hasNoCredits) return;
        setIsLoading(true);
        setError(null);
        setReflection(null);

        try {
            const allPlayableItems = [...allFrequencies, ...allSessions, ...customStacks];
            const response = await getAiCodexReflection(intention, allPlayableItems);
            setReflection(response);

            // Save the new reflection
            const newReflection: CodexReflection = {
                id: `reflection-${Date.now()}`,
                timestamp: Date.now(),
                intention,
                title: response.title,
                transmission: response.transmission,
                recommendedSessionId: response.recommendedSessionId,
                imageData: response.imageData,
            };
            setCodexReflections(prev => [newReflection, ...prev]);

        } catch (err: any) {
            setError(err.message || "The Oracle is silent at this moment. Please try again later.");
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
        <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-dark-text-primary">The Architect's Portal</h2>
        <p className="text-slate-700/80 dark:text-dark-text-secondary mt-2 max-w-2xl mx-auto">
            State your intention, clear your mind, and receive a symbolic transmission from the Codex Oracle.
        </p>
      </div>
      
      {!reflection ? (
        <div className="p-6 rounded-2xl bg-white/80 dark:bg-dark-surface/80 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="Type your intention here..."
                className="w-full h-32 p-4 text-lg rounded-xl border border-slate-300/80 dark:border-dark-border bg-white/80 dark:bg-slate-700 dark:text-dark-text-primary focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
                disabled={isLoading}
            />
             <div className="flex flex-col sm:flex-row gap-2">
                <button
                    type="button"
                    onClick={handleShuffle}
                    disabled={isLoading}
                    className="w-full sm:w-auto flex-grow py-3 px-4 rounded-lg font-bold text-slate-700 dark:text-dark-text-secondary bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-700/80 dark:hover:bg-slate-600 transition disabled:opacity-50"
                >
                    Suggest an Intention
                </button>
                <button
                    type="submit"
                    disabled={isLoading || !intention.trim() || hasNoCredits}
                    className="w-full sm:w-auto flex-grow flex items-center justify-center py-3 px-4 rounded-lg font-bold text-white bg-brand-gold hover:scale-105 transition-transform shadow-lg hover:shadow-xl disabled:bg-slate-400 disabled:scale-100"
                >
                    {isLoading ? <div className="flex items-center gap-2"><LoadingSpinner className="w-5 h-5" /><span>Generating...</span></div> : 'Enter the Portal'}
                </button>
            </div>
            {isLoading && <p className="text-center text-sm text-slate-600 dark:text-dark-text-secondary">Generating transmission & symbolic image...</p>}
            {error && <p className="text-sm text-center text-red-500">{error}</p>}
            {hasNoCredits && (
              <p className="text-sm text-center text-amber-600 dark:text-amber-400 p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                  You've used all your free AI generations. <a href="#/pricing" className="font-bold underline">Upgrade to Pro</a> for more.
              </p>
            )}
             {!isSubscribed && (
                <p className="text-xs text-center text-slate-500 dark:text-dark-text-muted">
                    You have {aiCreditsRemaining} free AI generation{aiCreditsRemaining !== 1 ? 's' : ''} remaining.
                </p>
            )}
            </form>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-white/80 dark:bg-dark-surface/80 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-lg animate-fade-in">
            <div className="text-center mb-6">
                <p className="text-sm italic text-slate-600 dark:text-dark-text-secondary">Your Intention:</p>
                <p className="text-lg font-semibold text-slate-800 dark:text-dark-text-primary">"{intention}"</p>
            </div>
            
            {reflection.imageData && (
                <div className="mb-8 rounded-lg overflow-hidden shadow-lg border border-slate-200/50 dark:border-dark-border/50">
                    <img src={`data:image/png;base64,${reflection.imageData}`} alt={reflection.title} className="w-full h-auto" />
                </div>
            )}

            <div className="text-center mb-8">
                <h3 className="text-3xl font-display font-bold text-brand-gold">{reflection.title}</h3>
            </div>
            
            <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap font-sans mb-8">
                <p>{reflection.transmission}</p>
            </div>

            <button
                onClick={() => {
                    setReflection(null);
                    setIntention('');
                }}
                className="w-full flex items-center justify-center py-3 px-4 rounded-lg font-bold text-slate-700 dark:text-dark-text-secondary bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-700/80 dark:hover:bg-slate-600 transition"
            >
                Ask Another Question
            </button>
        </div>
      )}

    </div>
    );
};