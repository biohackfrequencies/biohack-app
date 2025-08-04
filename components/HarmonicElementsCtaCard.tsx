

import React from 'react';
import { AtomIcon } from './BohoIcons';

export const HarmonicElementsCtaCard: React.FC = () => {
    return (
        <div
            className="relative group p-6 rounded-3xl shadow-lg transition-all duration-300
            bg-gradient-to-br from-cyan-100 to-sky-100 dark:bg-gradient-to-br dark:from-cyan-900/40 dark:to-sky-900/30
            hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-[0_8px_30px_-5px_var(--glow-color)]
            dark:border dark:border-cyan-800/50"
            style={{'--glow-color': '#22d3ee40'} as React.CSSProperties}
        >
            <div className="absolute inset-0 bg-transparent dark:group-hover:bg-black/20 transition-colors duration-300 rounded-3xl"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                    <AtomIcon className="w-10 h-10 text-cyan-800 dark:text-cyan-300" />
                    <div>
                        <h3 className="text-2xl font-display font-bold text-cyan-900 dark:text-cyan-100">Harmonic Elements</h3>
                        <p className="text-sm text-slate-700 dark:text-slate-200">Explore the frequency of 81 elements.</p>
                    </div>
                </div>
                <button
                    onClick={() => window.location.hash = '#/category/elements'}
                    className="w-full py-2 bg-black/5 dark:bg-dark-bg/50 text-cyan-800 dark:text-cyan-200 font-bold rounded-lg shadow hover:bg-black/10 dark:hover:bg-dark-bg transition-all"
                >
                    View Chart &rarr;
                </button>
            </div>
        </div>
    );
};