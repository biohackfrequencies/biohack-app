import React from 'react';
import { OracleIcon, XMarkIcon } from './BohoIcons';

interface OraclePromptModalProps {
  onEnter: () => void;
  onClose: () => void;
}

export const OraclePromptModal: React.FC<OraclePromptModalProps> = ({ onEnter, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="relative text-center bg-white/90 dark:bg-slate-800/90 rounded-2xl shadow-xl w-full max-w-sm p-8">
                <button onClick={onClose} className="absolute top-3 right-3 p-1 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <OracleIcon className="w-16 h-16 text-brand-gold mx-auto mb-4" />
                <h3 className="text-xl font-display font-bold text-slate-800 dark:text-dark-text-primary">Reflection</h3>
                <p className="mt-2 text-slate-600 dark:text-dark-text-secondary">
                    Your session is complete. Would you like to enter the Architect's Portal for a reflection on your experience?
                </p>
                <div className="mt-6 flex flex-col gap-2">
                    <button onClick={onEnter} className="w-full py-3 font-bold text-white rounded-lg shadow-md transition-colors bg-brand-gold hover:brightness-110">
                        Enter Portal
                    </button>
                    <button onClick={onClose} className="w-full py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg">
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};
