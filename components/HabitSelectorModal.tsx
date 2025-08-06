import React, { useState } from 'react';
import { TrackableActivityId, TrackableActivityBase } from '../types';
import { PlusCircleIcon, XMarkIcon, SparklesIcon } from './BohoIcons';
import type { TrackableActivity } from '../constants';

interface HabitSelectorModalProps {
  currentHabits: TrackableActivityId[];
  activities: TrackableActivity[];
  addCustomActivity: (name: string) => TrackableActivityBase | undefined;
  removeCustomActivity: (id: TrackableActivityId) => void;
  onSave: (newHabits: TrackableActivityId[]) => void;
  onClose: () => void;
  isSubscribed: boolean;
  habitLimit: number;
}

export const HabitSelectorModal: React.FC<HabitSelectorModalProps> = ({ 
  currentHabits, activities, addCustomActivity, removeCustomActivity, onSave, onClose,
  isSubscribed, habitLimit
}) => {
  const [selection, setSelection] = useState(new Set(currentHabits));
  const [customName, setCustomName] = useState('');
  const [showLimitError, setShowLimitError] = useState(false);

  const isHabitLimitReached = !isSubscribed && selection.size >= habitLimit;

  const handleToggle = (habitId: TrackableActivityId) => {
    const newSelection = new Set(selection);
    const isAdding = !newSelection.has(habitId);

    if (isAdding && isHabitLimitReached) {
        setShowLimitError(true);
        setTimeout(() => setShowLimitError(false), 3000);
        return;
    }

    if (newSelection.has(habitId)) {
      newSelection.delete(habitId);
    } else {
      newSelection.add(habitId);
    }
    setSelection(newSelection);
  };

  const handleSave = () => {
    onSave(Array.from(selection));
  };
  
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubscribed) {
        window.location.hash = '#/pricing';
        return;
    }
    if (customName.trim()) {
      const newActivity = addCustomActivity(customName);
      if (newActivity) {
          // Add the new activity to the current selection immediately
          const newSelection = new Set(selection);
          newSelection.add(newActivity.id);
          setSelection(newSelection);
      }
      setCustomName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white/90 dark:bg-slate-800/90 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 text-center">Customize Your Trackers</h3>
          <p className="text-sm text-center text-slate-600 dark:text-slate-400">Select the habits you want to track on your dashboard.</p>
        </div>
        <div className="overflow-y-auto p-4">
          {!isSubscribed && (
            <div className={`p-3 mb-4 rounded-lg text-center transition-all duration-300 ${showLimitError ? 'bg-red-100 dark:bg-red-900/40' : 'bg-black/5 dark:bg-white/5'}`}>
                 <p className="text-sm text-slate-700 dark:text-slate-200">
                    You're tracking <span className="font-bold">{selection.size} / {habitLimit}</span> habits.
                    <button onClick={() => window.location.hash = '#/pricing'} className="font-bold text-purple-600 dark:text-purple-400 ml-1 hover:underline">Upgrade for unlimited.</button>
                </p>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {activities.map(activity => {
              const isSelected = selection.has(activity.id);
              return (
                <div key={activity.id} className="relative">
                  <button
                    onClick={() => handleToggle(activity.id)}
                    className={`w-full h-full flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 dark:bg-slate-700/50 ${
                      isSelected ? 'shadow-md' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: isSelected ? `${activity.color}20` : '',
                      borderColor: isSelected ? activity.color : 'transparent',
                    }}
                    aria-pressed={isSelected}
                  >
                    <div
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-600 transition-colors"
                      style={{ color: activity.color }}
                    >
                      {activity.icon && <activity.icon className="w-7 h-7" />}
                    </div>
                    <p
                      className="text-sm font-semibold text-center transition-colors text-slate-800 dark:text-slate-300"
                      style={{ color: isSelected ? activity.color : undefined }}
                    >
                      {activity.name}
                    </p>
                  </button>
                  {activity.custom && (
                     <button 
                        onClick={() => removeCustomActivity(activity.id)}
                        className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        aria-label={`Remove ${activity.name}`}
                     >
                       <XMarkIcon className="w-3 h-3"/>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-center mb-2">Create a Custom Habit</h4>
            <form onSubmit={handleAddCustom} className="flex gap-2">
              <input 
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder={isSubscribed ? "e.g., Journaling..." : "Available for Pro members"}
                className="flex-grow p-2 rounded-md border border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 disabled:opacity-60"
                disabled={!isSubscribed}
              />
              <button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 transition flex items-center gap-1 disabled:bg-slate-400 dark:disabled:bg-slate-600" disabled={!isSubscribed}>
                {!isSubscribed ? <SparklesIcon className="w-5 h-5"/> : <PlusCircleIcon className="w-5 h-5" />}
                {isSubscribed ? 'Add' : 'Pro'}
              </button>
            </form>
          </div>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex gap-2">
            <button onClick={onClose} className="w-full py-3 bg-slate-200 dark:bg-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                Cancel
            </button>
            <button onClick={handleSave} className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Save
            </button>
        </div>
      </div>
    </div>
  );
};