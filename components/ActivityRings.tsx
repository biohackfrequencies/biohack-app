import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { PencilIcon, CheckmarkIcon } from './BohoIcons';

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
}

const MIND_COLOR = '#96CDB0'; 
const MOVE_COLOR = '#C18D52';
const CONSISTENCY_COLOR = '#5A8F76';

const Ring: React.FC<{
  progress: number;
  radius: number;
  stroke: number;
  color: string;
}> = ({ progress, radius, stroke, color }) => {
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
        cx="100"
        cy="100"
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
        cx="100"
        cy="100"
        transform="rotate(-90 100 100)"
        style={{ color }}
      />
    </>
  );
};

export const ActivityRings: React.FC<ActivityRingsProps> = ({ goals: initialGoals, onOpenSettings }) => {
  const [steps, setSteps] = useLocalStorage('biohack_steps_cache', 3456);
  const [isEditingSteps, setIsEditingSteps] = useState(false);
  const [tempSteps, setTempSteps] = useState(steps.toString());
  
  // Recalculate moveProgress based on the local `steps` state
  const goals = {
      ...initialGoals,
      moveProgress: Math.min(steps / initialGoals.moveGoal, 1),
  };
  
  const handleStepsSave = () => {
    const newSteps = parseInt(tempSteps, 10);
    if (!isNaN(newSteps) && newSteps >= 0) {
      setSteps(newSteps);
    }
    setIsEditingSteps(false);
  };

  return (
    <div
      className="relative group p-6 rounded-3xl shadow-lg transition-all duration-300 
      bg-gradient-to-br from-[#EEE8B2]/20 via-[#96CDB0]/20 to-[#EEE8B2]/20 dark:bg-dark-surface
      hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-[0_8px_30px_-5px_var(--glow-color)]
      dark:border dark:border-brand-gold/50"
      style={{'--glow-color': '#C18D5240'} as React.CSSProperties}
    >
      <div className="absolute inset-0 bg-transparent dark:group-hover:bg-black/20 transition-colors duration-300 rounded-3xl"></div>
      <div className="relative z-10">
        <div className="relative mb-4">
            <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-dark-text-primary text-center">
                Today's Goals
            </h3>
            <div className="absolute top-1/2 -translate-y-1/2 right-0 z-20 flex items-center gap-2">
                <button 
                    onClick={onOpenSettings}
                    className="p-2 rounded-full bg-black/5 dark:bg-dark-bg/50 hover:bg-black/10 dark:hover:bg-dark-bg text-slate-700 dark:text-dark-text-secondary transition"
                    aria-label="Edit goals"
                >
                    <PencilIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="relative w-full max-w-[250px] mx-auto aspect-square">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <Ring progress={goals.mindProgress} radius={88} stroke={16} color={MIND_COLOR} />
              <Ring progress={goals.moveProgress} radius={66} stroke={16} color={MOVE_COLOR} />
              <Ring progress={goals.consistencyProgress} radius={44} stroke={16} color={CONSISTENCY_COLOR} />
            </svg>
          </div>
          <div className="space-y-4">
              <div className="flex items-center gap-3">
                  <div className="w-3 h-10 rounded-full" style={{backgroundColor: MIND_COLOR}} />
                  <div>
                      <p className="font-bold text-slate-800 dark:text-dark-text-primary">Mind</p>
                      <p className="text-sm text-slate-700 dark:text-dark-text-secondary">{goals.mindMinutes} / {goals.mindGoal} min</p>
                  </div>
              </div>
              <div className="flex items-center gap-3">
                  <div className="w-3 h-10 rounded-full" style={{backgroundColor: MOVE_COLOR}}/>
                  <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800 dark:text-dark-text-primary">Move</p>
                        {!isEditingSteps && (
                            <button onClick={() => {
                                setTempSteps(steps.toString());
                                setIsEditingSteps(true);
                            }} aria-label="Edit steps">
                                <PencilIcon className="w-4 h-4 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors" />
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
                            className="w-24 bg-white/50 dark:bg-dark-bg/50 rounded-md p-1 text-sm font-semibold tabular-nums border border-slate-300 dark:border-dark-border"
                            autoFocus
                          />
                          <button onClick={handleStepsSave} className="p-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white transition">
                            <CheckmarkIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-700 dark:text-dark-text-secondary">
                          {new Intl.NumberFormat().format(steps)} / {new Intl.NumberFormat().format(goals.moveGoal)} steps
                        </p>
                      )}
                  </div>
              </div>
              <div className="flex items-center gap-3">
                  <div className="w-3 h-10 rounded-full" style={{backgroundColor: CONSISTENCY_COLOR}}/>
                  <div>
                      <p className="font-bold text-slate-800 dark:text-dark-text-primary">Consistency</p>
                      <p className="text-sm text-slate-700 dark:text-dark-text-secondary">{goals.loggedHabitsCount} / {goals.consistencyGoal} habits</p>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};