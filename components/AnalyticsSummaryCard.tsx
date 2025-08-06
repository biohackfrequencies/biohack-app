import React, { useMemo } from 'react';
import { ActivityLogItem, TrackableActivityId } from '../types';
import { ProBadge } from './ProBadge';

interface AnalyticsSummaryCardProps {
    activityLog: ActivityLogItem[];
    trackedHabits: TrackableActivityId[];
    isSubscribed: boolean;
}

export const AnalyticsSummaryCard: React.FC<AnalyticsSummaryCardProps> = ({ activityLog, trackedHabits, isSubscribed }) => {
    
    const weeklyConsistency = useMemo(() => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const recentLogs = activityLog.filter(log => log.timestamp >= sevenDaysAgo.getTime() && trackedHabits.includes(log.activityId));
        
        const uniqueDaysLogged = new Set(recentLogs.map(log => {
            const date = new Date(log.timestamp);
            date.setHours(0, 0, 0, 0);
            return date.getTime();
        })).size;

        if (trackedHabits.length === 0) return 0;

        return Math.round((uniqueDaysLogged / 7) * 100);

    }, [activityLog, trackedHabits]);

    const handleNavigate = () => {
        window.location.hash = '#/analytics';
    };

    return (
        <div
            className="relative group p-6 rounded-3xl shadow-lg transition-all duration-300
            bg-gradient-to-br from-[#EEE8B2]/40 to-[#C18D52]/20 dark:bg-dark-surface
            hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-[0_8px_30px_-5px_var(--glow-color)]
            dark:border dark:border-brand-gold/40"
            style={{'--glow-color': '#C18D5240'} as React.CSSProperties}
        >
            {!isSubscribed && (
                <div className="absolute top-4 right-4 z-20">
                    <ProBadge onClick={() => window.location.hash = '#/pricing'} />
                </div>
            )}
            <div className="absolute inset-0 bg-transparent dark:group-hover:bg-black/20 transition-colors duration-300 rounded-3xl"></div>
            <div className="relative z-10">
                <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-dark-text-primary mb-2 text-center">
                    Your Progress
                </h3>
                <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-slate-800 dark:text-dark-text-primary">{weeklyConsistency}%</p>
                        <p className="text-sm font-semibold text-slate-700/80 dark:text-dark-text-secondary/80">Weekly Consistency</p>
                    </div>
                </div>
                {isSubscribed ? (
                    <div className="mt-4 text-center">
                        <button
                            onClick={handleNavigate}
                            className="px-6 py-2 bg-black/5 dark:bg-dark-bg/50 text-slate-800 dark:text-dark-text-primary font-bold rounded-lg shadow hover:bg-black/10 dark:hover:bg-dark-bg transition-all"
                        >
                            View Full Analytics
                        </button>
                    </div>
                ) : (
                    <p className="mt-4 text-center text-xs text-slate-600 dark:text-dark-text-secondary">
                        Unlock detailed trend charts and consistency heatmaps with Pro.
                    </p>
                )}
            </div>
        </div>
    );
};
