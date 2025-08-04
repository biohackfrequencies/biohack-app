import React, { useState } from 'react';
import { UserGoals } from '../types';
import { XMarkIcon } from './BohoIcons';

interface GoalSettingsModalProps {
  initialGoals: UserGoals;
  onSave: (newGoals: UserGoals) => void;
  onClose: () => void;
}

export const GoalSettingsModal: React.FC<GoalSettingsModalProps> = ({ initialGoals, onSave, onClose }) => {
  const [mindGoal, setMindGoal] = useState(initialGoals.mind);
  const [moveGoal, setMoveGoal] = useState(initialGoals.move);

  const handleSave = () => {
    onSave({
      mind: mindGoal > 0 ? mindGoal : 20,
      move: moveGoal > 0 ? moveGoal : 10000,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm flex flex-col p-6">
        <button onClick={onClose} className="absolute top-3 right-3 p-1 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
            <XMarkIcon className="w-6 h-6" />
        </button>
        <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-200 text-center mb-6">Set Your Daily Goals</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="mind-goal" className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Mind Goal (minutes)</label>
            <input
              id="mind-goal"
              type="number"
              value={mindGoal}
              onChange={e => setMindGoal(parseInt(e.target.value, 10) || 0)}
              placeholder="e.g., 20"
              className="w-full p-2 rounded-md border border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
            />
          </div>
          <div>
            <label htmlFor="move-goal" className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Move Goal (steps)</label>
            <input
              id="move-goal"
              type="number"
              step="100"
              value={moveGoal}
              onChange={e => setMoveGoal(parseInt(e.target.value, 10) || 0)}
              placeholder="e.g., 10000"
              className="w-full p-2 rounded-md border border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <button 
            onClick={handleSave}
            className="w-full py-3 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-md transition-colors"
          >
            Save Goals
          </button>
        </div>
      </div>
    </div>
  );
};