
import React, { useState, useMemo } from 'react';
import { ActivityLogItem, TrackableActivity, TrackableActivityId } from '../types';
import { BackIcon, FlameIcon, StarIcon } from './BohoIcons';

const getDayKey = (date: Date): number => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
};

const WeeklyRhythm: React.FC<{
    activityLog: ActivityLogItem[];
}> = ({ activityLog }) => {

    const { currentStreak, bestStreak, weeklyData } = useMemo(() => {
        if (activityLog.length === 0) {
            return { currentStreak: 0, bestStreak: 0, weeklyData: [] };
        }

        const logDays = new Set(activityLog.map(log => getDayKey(new Date(log.timestamp))));
        const sortedDays = Array.from(logDays).sort();

        // Calculate Streaks
        let currentStreak = 0;
        let bestStreak = 0;
        let tempStreak = 0;

        for (let i = 0; i < sortedDays.length; i++) {
            tempStreak++;
            if (i + 1 < sortedDays.length) {
                const diff = (sortedDays[i+1] - sortedDays[i]) / (1000 * 60 * 60 * 24);
                if (diff > 1) {
                    if (tempStreak > bestStreak) bestStreak = tempStreak;
                    tempStreak = 0;
                }
            }
        }
        if (tempStreak > bestStreak) bestStreak = tempStreak;

        const todayKey = getDayKey(new Date());
        const yesterdayKey = getDayKey(new Date(Date.now() - 864e5));
        
        if (logDays.has(todayKey) || logDays.has(yesterdayKey)) {
            let streak = 0;
            let dayToCheck = new Date();
            while(logDays.has(getDayKey(dayToCheck))) {
                streak++;
                dayToCheck.setDate(dayToCheck.getDate() - 1);
            }
            currentStreak = streak;
        } else {
            currentStreak = 0;
        }


        // Group by week
        const firstDay = new Date(sortedDays[0]);
        const today = new Date();
        const weeklyMap = new Map<string, Set<number>>();

        let currentDay = new Date(firstDay);
        while(currentDay <= today) {
            const weekStart = new Date(currentDay);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Sunday
            const weekKey = weekStart.toISOString().split('T')[0];

            if(!weeklyMap.has(weekKey)) {
                weeklyMap.set(weekKey, new Set());
            }

            if(logDays.has(getDayKey(currentDay))) {
                weeklyMap.get(weekKey)!.add(currentDay.getDay());
            }
            
            currentDay.setDate(currentDay.getDate() + 1);
        }

        const weeks = Array.from(weeklyMap.keys()).sort().reverse().map(weekKey => {
            const startDate = new Date(weekKey);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 6);
            return {
                label: `${startDate.toLocaleString('default', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleString('default', { month: 'short', day: 'numeric' })}`,
                loggedDays: weeklyMap.get(weekKey) as Set<number>
            };
        });

        return { currentStreak, bestStreak, weeklyData: weeks };
    }, [activityLog]);

    const WEEK_DAYS_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-orange-100 dark:bg-orange-900/40 text-center">
                    <FlameIcon className="w-8 h-8 text-orange-500 mx-auto" />
                    <p className="text-3xl font-bold text-orange-800 dark:text-orange-300 mt-1">{currentStreak}</p>
                    <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">Current Streak</p>
                </div>
                 <div className="p-4 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-center">
                    <StarIcon className="w-8 h-8 text-amber-500 mx-auto" />
                    <p className="text-3xl font-bold text-amber-800 dark:text-amber-300 mt-1">{bestStreak}</p>
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Best Streak</p>
                </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                <div className="sticky top-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm z-10 py-1 grid grid-cols-[1fr,auto] items-center">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Week</span>
                    <div className="flex justify-around w-48">
                        {WEEK_DAYS_LABELS.map(day => <span key={day} className="text-xs font-bold text-slate-500 dark:text-slate-400">{day}</span>)}
                    </div>
                </div>
                {weeklyData.map(week => (
                    <div key={week.label} className="grid grid-cols-[1fr,auto] items-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{week.label}</span>
                         <div className="flex justify-around w-48">
                            {Array.from({length: 7}).map((_, i) => (
                                <div key={i} className={`w-5 h-5 rounded-full border-2 ${week.loggedDays.has(i) ? 'bg-teal-500 border-teal-600' : 'bg-slate-200 dark:bg-slate-600 border-transparent'}`}></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const TrendChart: React.FC<{
    activityLog: ActivityLogItem[];
    activity: TrackableActivity;
}> = ({ activityLog, activity }) => {
     const getPastDays = (numDays: number): Date[] => {
        const days: Date[] = [];
        for (let i = 0; i < numDays; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            days.push(d);
        }
        return days.reverse();
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const data = useMemo(() => {
        const days = getPastDays(30);
        const logByDay = new Map<number, number>();

        activityLog.filter(log => log.activityId === activity.id).forEach(log => {
            const date = new Date(log.timestamp);
            date.setHours(0, 0, 0, 0);
            const dayKey = date.getTime();
            logByDay.set(dayKey, (logByDay.get(dayKey) || 0) + 1);
        });
        
        return days.map(day => ({
            date: day,
            count: logByDay.get(day.getTime()) || 0
        }));
    }, [activityLog, activity.id]);
    
    const maxCount = Math.max(1, ...data.map(d => d.count));

    return (
        <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50">
            <div className="flex justify-between items-end h-32 gap-1 px-2 border-b border-slate-300 dark:border-slate-600">
                {data.map(({ date, count }) => (
                    <div key={date.getTime()} className="group relative flex-1 h-full flex items-end justify-center">
                        <div 
                            className="w-[75%] rounded-t-md transition-all duration-300 ease-in-out"
                            style={{ 
                                height: `${(count / maxCount) * 100}%`,
                                backgroundColor: activity.color,
                            }}
                         />
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1 px-2">
                <span>{formatDate(data[0].date)}</span>
                <span>Today</span>
            </div>
        </div>
    );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 font-semibold rounded-full text-sm transition-colors ${
            active ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
        }`}
    >
        {children}
    </button>
);


interface AnalyticsPageProps {
    activityLog: ActivityLogItem[];
    activities: TrackableActivity[];
    onBack: () => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ activityLog, activities, onBack }) => {
    const [activeTab, setActiveTab] = useState<'consistency' | 'trends'>('consistency');
    const [trendActivityId, setTrendActivityId] = useState<TrackableActivityId>(activities[0]?.id || 'session');
    
    const selectedTrendActivity = activities.find(a => a.id === trendActivityId);

    return (
        <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors self-start">
                <BackIcon className="w-6 h-6" />
                <span className="font-semibold">Back to Dashboard</span>
            </button>
            <div className="text-center">
                <h2 className="text-4xl font-display font-bold text-slate-800 dark:text-slate-200">Your Analytics</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Discover patterns and track your progress over time.</p>
            </div>

            <div className="p-6 rounded-2xl shadow-lg bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-6">
                <div className="flex justify-center p-1 rounded-full bg-slate-200/50 dark:bg-slate-900/30">
                    <TabButton active={activeTab === 'consistency'} onClick={() => setActiveTab('consistency')}>Consistency</TabButton>
                    <TabButton active={activeTab === 'trends'} onClick={() => setActiveTab('trends')}>Habit Trends</TabButton>
                </div>

                {activeTab === 'consistency' && (
                    <div className="animate-fade-in">
                        <div className="flex items-center gap-4 mb-4">
                            <FlameIcon className="w-10 h-10 text-orange-500 dark:text-orange-400" />
                            <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-200">Weekly Rhythm</h3>
                        </div>
                        <WeeklyRhythm activityLog={activityLog} />
                    </div>
                )}

                {activeTab === 'trends' && (
                    <div className="animate-fade-in">
                         <div className="flex items-center gap-4 mb-4">
                            <StarIcon className="w-10 h-10 text-amber-500 dark:text-amber-400" />
                            <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-200">Habit Trends (30 Days)</h3>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                             <span className="font-semibold text-slate-700 dark:text-slate-300">Show trend for:</span>
                             <select value={trendActivityId} onChange={e => setTrendActivityId(e.target.value)} className="p-2 rounded-md border border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200">
                                {activities.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                            </select>
                        </div>
                        {selectedTrendActivity && <TrendChart activityLog={activityLog} activity={selectedTrendActivity} />}
                    </div>
                )}
            </div>
        </div>
    );
};
