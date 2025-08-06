import React, { useState, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { PencilIcon, CheckmarkIcon } from './BohoIcons';
import { ActivityLogItem, TrackableActivityId } from '../types';

interface ActivityRingsProps {
  goals: {
    mindGoal: number;
    mindProgress: number;
    moveGoal: number;
    moveProgress: number; // Will be overridden
    consistencyGoal: number;
    consistencyProgress: number;
    mindMinutes: number;
    loggedHabitsCount: number;
  };
  onOpenSettings: () => void;
  activityLog: ActivityLogItem[];
  trackedHabits: TrackableActivityId[];
  isSubscribed: boolean;
}

const MIND_COLOR = '#96CDB0'; 
const MOVE_COLOR = '#C18D52';
const CONSISTENCY_COLOR = '#5A8F76';

const Ring: React.FC<{
  progress: number;
  radius: number;
  stroke: number;
  color: string;
  cx: number;
  cy: number;
}> = ({ progress, radius, stroke, color, cx, cy }) => {
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  return (
    <>
      <circle
        className="text-white dark:text-dark-surface/50"
        strokeWidth={stroke}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={cx}
        cy={cy}
      />
      <circle
        className="transition-all duration-700 ease-in-out"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={cx}
        cy={cy}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ color }}
      />
    </>
  );
};

export const ActivityRings: React.FC<ActivityRingsProps> = ({ goals: initialGoals, onOpenSettings, activityLog, trackedHabits, isSubscribed }) => {
  const [steps, setSteps] = useLocalStorage('biohack_steps_cache', 3456);
  const [isEditingSteps, setIsEditingSteps] = useState(false);
  const [tempSteps, setTempSteps] = useState(steps.toString());
  
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

  const goals = {
      ...initialGoals,
      moveProgress: initialGoals.moveGoal > 0 ? Math.min(steps / initialGoals.moveGoal, 1) : 1,
  };
  
  const handleStepsSave = () => {
    const newSteps = parseInt(tempSteps, 10);
    if (!isNaN(newSteps) && newSteps >= 0) {
      setSteps(newSteps);
    }
    setIsEditingSteps(false);
  };

  const svgSize = 100;
  const strokeWidth = 8;
  const center = svgSize / 2;
  const radius1 = center - strokeWidth / 2;
  const radius2 = radius1 - strokeWidth - 2;
  const radius3 = radius2 - strokeWidth - 2;

  return (
    <div
      className="relative group p-6 rounded-3xl shadow-lg transition-all duration-300 
      bg-gradient-to-br from-[#EEE8B2]/20 via-[#96CDB0]/20 to-[#EEE8B2]/20 dark:bg-dark-surface
      hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[0_8px_30px_-5px_var(--glow-color)]
      dark:border dark:border-brand-gold/50"
      style={{'--glow-color': '#C18D5240'} as React.CSSProperties}
    >
      <div className="absolute inset-0 bg-transparent dark:group-hover:bg-black/20 transition-colors duration-300 rounded-3xl"></div>
      <div className="relative z-10">
        <div className="relative mb-4">
            <h3 className="text-xl font-display font-bold text-slate-800 dark:text-dark-text-primary text-center">
                Today's Goals
            </h3>
            <div className="absolute top-1/2 -translate-y-1/2 right-0 z-20 flex items-center gap-2">
                <button 
                    onClick={onOpenSettings}
                    className="p-2 rounded-full bg-black/5 dark:bg-dark-bg/50 hover:bg-black/10 dark:hover:bg-dark-bg text-slate-700 dark:text-dark-text-secondary transition"
                    aria-label="Edit goals"
                >
                    <PencilIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
        
        <div className="flex gap-4 sm:gap-6 items-center">
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg className="w-full h-full" viewBox={`0 0 ${svgSize} ${svgSize}`}>
              <Ring progress={goals.mindProgress} radius={radius1} stroke={strokeWidth} color={MIND_COLOR} cx={center} cy={center} />
              <Ring progress={goals.moveProgress} radius={radius2} stroke={strokeWidth} color={MOVE_COLOR} cx={center} cy={center} />
              <Ring progress={goals.consistencyProgress} radius={radius3} stroke={strokeWidth} color={CONSISTENCY_COLOR} cx={center} cy={center} />
            </svg>
          </div>
          <div className="space-y-2 flex-grow">
              <div className="flex items-center gap-2">
                  <div className="w-2 h-8 rounded-full" style={{backgroundColor: MIND_COLOR}} />
                  <div>
                      <p className="font-semibold text-sm text-slate-800 dark:text-dark-text-primary">Mind</p>
                      <p className="text-xs text-slate-700 dark:text-dark-text-secondary">{goals.mindMinutes} / {goals.mindGoal} min</p>
                  </div>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-2 h-8 rounded-full" style={{backgroundColor: MOVE_COLOR}}/>
                  <div className="flex-grow">
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-sm text-slate-800 dark:text-dark-text-primary">Move</p>
                        {!isEditingSteps && (
                            <button onClick={() => {
                                setTempSteps(steps.toString());
                                setIsEditingSteps(true);
                            }} aria-label="Edit steps">
                                <PencilIcon className="w-3 h-3 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors" />
                            </button>
                        )}
                      </div>
                       {isEditingSteps ? (
                        <div className="flex items-center gap-1 mt-1">
                          <input
                            type="number"
                            value={tempSteps}
                            onChange={(e) => setTempSteps(e.target.value)}
                            onBlur={handleStepsSave}
                            onKeyDown={(e) => e.key === 'Enter' && handleStepsSave()}
                            className="w-20 bg-white/50 dark:bg-dark-bg/50 rounded-md p-1 text-xs font-semibold tabular-nums border border-slate-300 dark:border-dark-border"
                            autoFocus
                          />
                          <button onClick={handleStepsSave} className="p-1 rounded-full bg-green-500 hover:bg-green-600 text-white transition">
                            <CheckmarkIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-700 dark:text-dark-text-secondary">
                          {new Intl.NumberFormat().format(steps)} / {new Intl.NumberFormat().format(goals.moveGoal)} steps
                        </p>
                      )}
                  </div>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-2 h-8 rounded-full" style={{backgroundColor: CONSISTENCY_COLOR}}/>
                  <div>
                      <p className="font-semibold text-sm text-slate-800 dark:text-dark-text-primary">Consistency</p>
                      <p className="text-xs text-slate-700 dark:text-dark-text-secondary">{goals.loggedHabitsCount} / {goals.consistencyGoal} habits</p>
                  </div>
              </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-dark-border/20 text-center">
            <h4 className="text-xl font-display font-bold text-slate-800 dark:text-dark-text-primary mb-1">
                Your Progress
            </h4>
            <p className="text-4xl font-bold text-slate-800 dark:text-dark-text-primary">{weeklyConsistency}%</p>
            <p className="text-sm font-semibold text-slate-700/80 dark:text-dark-text-secondary/80">Weekly Consistency</p>
            
            {isSubscribed ? (
                <div className="mt-4">
                    <button
                        onClick={() => window.location.hash = '#/analytics'}
                        className="px-6 py-2 bg-black/5 dark:bg-dark-bg/50 text-slate-800 dark:text-dark-text-primary font-bold rounded-lg shadow hover:bg-black/10 dark:hover:bg-dark-bg transition-all"
                    >
                        View Full Analytics
                    </button>
                </div>
            ) : (
                <p className="mt-3 text-xs text-slate-600 dark:text-dark-text-secondary max-w-xs mx-auto">
                    Unlock detailed trend charts and consistency heatmaps with Pro.
                </p>
            )}
        </div>
      </div>
    </div>
  );
};