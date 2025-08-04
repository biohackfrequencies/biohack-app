import React from 'react';
import { SparklesIcon } from './BohoIcons';

interface UpdatePromptProps {
    onUpdate: () => void;
}

export const UpdatePrompt: React.FC<UpdatePromptProps> = ({ onUpdate }) => {
    return (
        <div 
            className="fixed bottom-4 right-4 z-50 animate-fade-in-up"
            role="alert"
            aria-live="assertive"
        >
            <div className="flex items-center gap-4 p-4 rounded-2xl shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex-shrink-0">
                    <SparklesIcon className="w-8 h-8 text-brand-orange" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">A new version is available!</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Update now to get the latest features.</p>
                </div>
                <button
                    onClick={onUpdate}
                    className="ml-4 px-4 py-2 rounded-full bg-brand-orange text-white font-semibold whitespace-nowrap hover:brightness-90 transition-colors shadow-md"
                >
                    Update
                </button>
            </div>
        </div>
    );
};