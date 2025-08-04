import React from 'react';
import { InsightIcon } from './BohoIcons';
import LoadingSpinner from './LoadingSpinner';
import { ProBadge } from './ProBadge';

interface AIInsightsCardProps {
    insight: string | null;
    isLoading: boolean;
    isSubscribed: boolean;
}

export const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ insight, isLoading, isSubscribed }) => {
    
    const renderProContent = () => {
        if (isLoading) {
            return (
                <div className="h-24 flex flex-col items-center justify-center text-center">
                    <LoadingSpinner className="w-8 h-8 text-green-800 dark:text-green-300" />
                    <p className="text-sm text-slate-600 dark:text-dark-text-secondary mt-2">Analyzing your latest data...</p>
                </div>
            );
        }

        if (insight) {
             return (
                <div className="p-4 rounded-xl bg-black/5 dark:bg-dark-bg/50">
                    <p className="text-center font-semibold text-slate-800 dark:text-dark-text-primary">{insight}</p>
                </div>
            );
        }

        return (
             <div className="h-24 flex flex-col items-center justify-center text-center">
                <p className="text-slate-600 dark:text-dark-text-secondary">No new insights right now. Log some activity or check back tomorrow!</p>
            </div>
        )
    };

    const renderFreeContent = () => (
        <div className="h-24 flex flex-col items-center justify-center text-center p-4">
            <p className="font-semibold text-slate-800 dark:text-dark-text-primary">Get personalized insights from your health data.</p>
            <p className="text-xs text-slate-600 dark:text-dark-text-secondary">Let our AI find correlations to optimize your wellness.</p>
        </div>
    );

    return (
        <div 
            className="relative group p-6 rounded-3xl shadow-lg transition-all duration-300
            bg-gradient-to-br from-[#EEE8B2]/40 to-[#96CDB0]/40 dark:bg-gradient-to-br dark:from-dark-surface/80 dark:to-dark-bg/80
            hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-[0_8px_30px_-5px_var(--glow-color)]
            dark:border dark:border-brand-gold/50"
            style={{'--glow-color': '#C18D5240'} as React.CSSProperties}
        >
             {!isSubscribed && (
                <div className="absolute top-4 right-4 z-20">
                    <ProBadge onClick={() => window.location.hash = '#/pricing'} />
                </div>
            )}
             <div className="absolute inset-0 bg-transparent dark:group-hover:bg-black/20 transition-colors duration-300 rounded-3xl"></div>
             <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                    <InsightIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
                    <div>
                        <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-dark-text-primary">AI Insight</h3>
                        <p className="text-sm text-slate-700 dark:text-dark-text-secondary">Your personalized bio-feedback.</p>
                    </div>
                </div>
                {isSubscribed ? renderProContent() : renderFreeContent()}
            </div>
        </div>
    );
}