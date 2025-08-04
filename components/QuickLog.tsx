import React from 'react';
import { ActivityLogItem, TrackableActivity, TrackableActivityId } from '../types';
import { XMarkIcon, CustomizeIcon } from './BohoIcons';

interface QuickLogProps {
  activities: TrackableActivity[];
  habits: TrackableActivityId[];
  onLogActivity: (activityId: TrackableActivityId) => void;
  onEditLog: (item: ActivityLogItem) => void;
  deleteActivityLogItem: (itemId: string) => void;
  todayLog: ActivityLogItem[];
  onOpenCustomizer: () => void;
  isManageMode: boolean;
  setIsManageMode: (isManaging: boolean) => void;
  isSubscribed: boolean;
  logLimit: number;
}

export const QuickLog: React.FC<QuickLogProps> = ({ 
    activities, habits, onLogActivity, todayLog, onOpenCustomizer, 
    onEditLog, deleteActivityLogItem, isManageMode, setIsManageMode, isSubscribed, logLimit
}) => {
  const activitiesToDisplay = activities.filter(activity => habits.includes(activity.id));
  const sortedTodayLog = [...todayLog].sort((a, b) => b.timestamp - a.timestamp);
  
  const isLogLimitReached = !isSubscribed && todayLog.length >= logLimit;

  const handleManageClick = () => {
    setIsManageMode(!isManageMode);
  };

  return (
    <section className="p-6 rounded-3xl shadow-lg bg-gradient-to-br from-[#EEE8B2]/40 to-[#96CDB0]/40 dark:bg-gradient-to-br dark:from-dark-surface/80 dark:to-dark-bg/80">
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-display text-4xl font-bold text-slate-800 dark:text-dark-text-primary">
                <span className="italic">Quick</span> Log
            </h3>
            <button 
              onClick={onOpenCustomizer} 
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-slate-200/50 hover:bg-slate-200 dark:bg-[#3A3258] dark:hover:bg-[#453F5A] text-slate-700 dark:text-dark-text-primary border border-slate-300/50 dark:border-dark-border/50 transition-colors">
                <CustomizeIcon className="w-4 h-4 text-slate-500 dark:text-dark-text-muted" />
                Customize
            </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
            {activitiesToDisplay.map(activity => {
                 const Icon = activity.icon;
                 return (
                    <button
                        key={activity.id}
                        onClick={() => onLogActivity(activity.id)}
                        className={`group flex flex-col items-center justify-center text-center gap-2 p-3 h-32 rounded-3xl transition-all duration-300 bg-black/5 dark:bg-white/5 backdrop-blur-sm border border-slate-200/50 dark:border-white/10 shadow-lg ${isLogLimitReached ? 'opacity-60' : 'hover:-translate-y-1 hover:bg-black/10 dark:hover:bg-white/10'}`}
                        aria-label={`Log ${activity.name}`}
                    >
                        <div
                            className="w-16 h-16 flex items-center justify-center rounded-full transition-colors bg-white dark:bg-black/20 shadow-inner"
                            style={{ color: activity.color }}
                        >
                            {Icon && <Icon className="w-8 h-8 transition-transform group-hover:scale-110" />}
                        </div>
                        <p className="text-sm font-semibold text-slate-600 dark:text-dark-text-secondary group-hover:text-slate-800 dark:group-hover:text-dark-text-primary transition-colors">
                            {activity.name}
                        </p>
                    </button>
                )
            })}
        </div>

        {sortedTodayLog.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xl font-bold font-display text-slate-800 dark:text-dark-text-primary">Today's Entries</h4>
                    <button 
                        onClick={handleManageClick}
                        className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-black/20 dark:hover:bg-black/30 text-slate-700 dark:text-dark-text-primary transition-colors"
                    >
                        {isManageMode ? 'Done' : 'Manage'}
                    </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {sortedTodayLog.map(item => {
                        const activity = activities.find(a => a.id === item.activityId);
                        if (!activity) return null;
                        
                        const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

                        return (
                            <div key={item.id} className="flex items-center gap-2 group">
                                <button
                                    onClick={() => onEditLog(item)}
                                    disabled={isManageMode}
                                    className="w-full flex items-center gap-4 p-3 rounded-lg text-left transition-colors bg-slate-100/70 hover:bg-slate-200/70 dark:bg-black/10 dark:hover:bg-black/20 disabled:hover:bg-black/10"
                                >
                                    <div
                                        className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full"
                                        style={{ backgroundColor: `${activity.color}20`, color: activity.color }}
                                    >
                                        {activity.icon && <activity.icon className="w-6 h-6" />}
                                    </div>
                                    <div className="flex-grow overflow-hidden">
                                        <p className="font-bold text-slate-800 dark:text-dark-text-primary truncate">{item.details?.name || activity.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-dark-text-muted">
                                            <span className="flex-shrink-0">{time}</span>
                                            {item.details?.duration && (
                                                <>
                                                    <span className="flex-shrink-0">&middot;</span>
                                                    <span className="flex-shrink-0">{item.details.duration} {activity.id === 'sleep' ? 'hrs' : 'min'}</span>
                                                </>
                                            )}
                                            {item.details?.notes && (
                                                <>
                                                    <span className="flex-shrink-0">&middot;</span>
                                                    <span className="italic truncate">"{item.details.notes}"</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </button>
                                {isManageMode && (
                                    <button
                                        onClick={() => deleteActivityLogItem(item.id)}
                                        className="p-2 text-red-500 rounded-full transition-all bg-slate-100 hover:bg-red-100 dark:bg-black/10 dark:hover:bg-red-500/80 dark:hover:text-white"
                                        aria-label="Delete entry"
                                    >
                                        <XMarkIcon className="w-5 h-5"/>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
    </section>
  );
};