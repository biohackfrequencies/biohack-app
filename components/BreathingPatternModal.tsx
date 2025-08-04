import React from 'react';
import { BreathingPattern, BREATHING_PATTERNS } from '../types';
import { XMarkIcon, CheckmarkIcon } from './BohoIcons';

interface BreathingPatternModalProps {
  onSelect: (pattern: BreathingPattern) => void;
  onClose: () => void;
  selectedPattern: BreathingPattern;
}

export const BreathingPatternModal: React.FC<BreathingPatternModalProps> = ({ onSelect, onClose, selectedPattern }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white/90 dark:bg-slate-800/90 rounded-2xl shadow-xl w-full max-w-sm max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Select Breathing Pattern</h3>
          <button onClick={onClose} className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="overflow-y-auto p-2">
          {BREATHING_PATTERNS.map(pattern => {
            const isSelected = selectedPattern.name === pattern.name;
            return (
              <button
                key={pattern.name}
                onClick={() => onSelect(pattern)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors flex justify-between items-center"
              >
                <span className={`font-semibold ${isSelected ? 'text-cyan-600 dark:text-cyan-400' : 'dark:text-slate-200'}`}>{pattern.name}</span>
                {isSelected && <CheckmarkIcon className="w-5 h-5 text-cyan-500" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
