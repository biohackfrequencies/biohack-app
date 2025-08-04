import React, { useState, useEffect } from 'react';
import { ActivityLogItem, TrackableActivity, LogDetail } from '../types';
import { XMarkIcon, DuplicateIcon } from './BohoIcons';
import { MOOD_OPTIONS } from '../constants';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating }) => {
    return (
        <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star: number) => (
                <button key={star} onClick={() => setRating(star)} className="text-4xl transition-transform hover:scale-110 focus:outline-none">
                    <span className={star <= rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}>★</span>
                </button>
            ))}
        </div>
    );
};

interface LogDetailModalProps {
  item: ActivityLogItem;
  activity: TrackableActivity;
  onClose: () => void;
  onSave: (updatedItem: ActivityLogItem) => void;
  onDuplicate: () => void;
}

export const LogDetailModal: React.FC<LogDetailModalProps> = ({ item, activity, onClose, onSave, onDuplicate }) => {
  const [details, setDetails] = useState<LogDetail>(item.details || {});
  const [logDate, setLogDate] = useState(new Date(item.timestamp));

  useEffect(() => {
    setDetails(item.details || {});
    setLogDate(new Date(item.timestamp));
  }, [item]);

  const handleSave = () => {
    const originalTime = new Date(item.timestamp);
    const newTimestamp = new Date(
        logDate.getFullYear(),
        logDate.getMonth(),
        logDate.getDate(),
        originalTime.getHours(),
        originalTime.getMinutes(),
        originalTime.getSeconds()
    ).getTime();

    onSave({ ...item, timestamp: newTimestamp, details });
  };
  
  const handleDuplicate = () => {
      onDuplicate();
  }

  const handleDetailChange = (field: keyof LogDetail, value: string | number | undefined) => {
    setDetails((prev: LogDetail) => ({ ...prev, [field]: value }));
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = new Date(e.target.value);
      const userTimezoneOffset = newDate.getTimezoneOffset() * 60000;
      setLogDate(new Date(newDate.getTime() + userTimezoneOffset));
  };
  
  const showDuration = !['supplements', 'diet', 'mood'].includes(activity.id);
  const showName = ['supplements', 'diet'].includes(activity.id) || activity.custom;

  const placeholderPrompts: Record<string, string> = {
    mood: "What might have influenced this feeling?",
    sleep: "Did you notice any dreams or interruptions?",
    workout: "How was your energy during this workout?",
    session: "What sensations or thoughts came up during this session?",
    meditation: "How deep was your focus? What came up for you?",
    yoga: "What did your body feel like after the practice?",
    cold: "How did you feel before, during, and after?",
    default: "Any reflections or details to add?",
  };
  const journalPlaceholder = placeholderPrompts[activity.id] || placeholderPrompts.default;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm flex flex-col p-6">
        <button onClick={onClose} className="absolute top-3 right-3 p-1 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
            <XMarkIcon className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-4 mb-6">
            {activity.icon && (
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full" style={{ backgroundColor: `${activity.color}20`, color: activity.color }}>
                    <activity.icon className="w-7 h-7" />
                </div>
            )}
            <div>
                <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-200">Edit {activity.name} Entry</h3>
                <input
                    type="date"
                    value={logDate.toISOString().split('T')[0]}
                    onChange={handleDateChange}
                    className="p-1 rounded-md border border-slate-300/80 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 text-sm"
                />
            </div>
        </div>
        
        <div className="space-y-4">
            {showName && (
                 <div>
                    <label htmlFor="log-name" className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">{activity.id === 'diet' ? 'Meal / Item Name' : 'Item Name'}</label>
                    <input
                        id="log-name"
                        type="text"
                        value={details.name || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDetailChange('name', e.target.value)}
                        placeholder={activity.id === 'diet' ? 'e.g., Lunch, Smoothie' : 'e.g., Vitamin D3, Magnesium'}
                        className="w-full p-2 rounded-md border border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                    />
                </div>
            )}
            
            {activity.id === 'sleep' && (
                 <div className="pt-2">
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 text-center">Sleep Quality</label>
                     <StarRating
                        rating={details.sleepQuality || 0}
                        setRating={(rating: number) => handleDetailChange('sleepQuality', rating)}
                    />
                </div>
            )}
            
            {activity.id === 'mood' && (
                 <div className="pt-2">
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 text-center">Mood</label>
                     <div className="flex justify-center gap-4">
                        {(Object.keys(MOOD_OPTIONS) as Array<keyof typeof MOOD_OPTIONS>).map((moodKey: 'happy' | 'neutral' | 'sad') => {
                            const Icon = MOOD_OPTIONS[moodKey].icon;
                            const color = MOOD_OPTIONS[moodKey].color;
                            const isSelected = details.moodValue === moodKey;
                            return (
                                <button key={moodKey} onClick={() => handleDetailChange('moodValue', moodKey)}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${isSelected ? 'scale-110 shadow-lg' : 'opacity-70 hover:opacity-100'}`}
                                    style={{ borderColor: isSelected ? color : 'transparent' }}
                                >
                                    <Icon className="w-10 h-10" style={{ color }} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

             {showDuration && (
                <div>
                    <label htmlFor="log-duration" className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Duration (optional)</label>
                    <div className="flex items-center gap-2">
                        <input
                            id="log-duration"
                            type="number"
                            min="0"
                            step={activity.id === 'sleep' ? 0.5 : 1}
                            value={details.duration || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDetailChange('duration', parseFloat(e.target.value) || 0)}
                            placeholder={activity.id === 'sleep' ? 'e.g., 8' : 'e.g., 20'}
                            className="w-full p-2 rounded-md border border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                        />
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{activity.id === 'sleep' ? 'hours' : 'minutes'}</span>
                    </div>
                </div>
             )}

            <div>
                <label htmlFor="log-notes" className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Notes / Journal (optional)</label>
                <textarea
                    id="log-notes"
                    value={details.notes || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleDetailChange('notes', e.target.value)}
                    placeholder={journalPlaceholder}
                    className="w-full h-24 p-2 rounded-md border border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                />
            </div>
        </div>
        
        <div className="mt-6 flex flex-col gap-2">
          <button 
            onClick={handleSave}
            className="w-full py-3 font-bold text-white rounded-lg shadow-md transition-colors"
            style={{ backgroundColor: activity.color }}
          >
            Save Details
          </button>
          <div className="flex gap-2">
            <button 
                onClick={handleDuplicate}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300/80 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
                <DuplicateIcon className="w-4 h-4" />
                Duplicate
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};