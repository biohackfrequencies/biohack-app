import React, { useState, useMemo } from 'react';
import { Frequency } from '../types';
import { SearchIcon } from './BohoIcons';
import { ProBadge } from './ProBadge';

interface LayerSelectorModalProps {
  allFrequencies: Frequency[],
  onSelect: (freq: Frequency) => void,
  onClose: () => void,
  currentMainFrequencyId: string,
  title: string,
  isSubscribed: boolean,
}

export const LayerSelectorModal: React.FC<LayerSelectorModalProps> = ({ 
    allFrequencies, onSelect, onClose, currentMainFrequencyId, title, isSubscribed
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const filteredFrequencies = useMemo(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return allFrequencies.filter(f => 
            f.id !== currentMainFrequencyId &&
            f.name.toLowerCase().includes(lowerCaseQuery)
        );
    }, [searchQuery, allFrequencies, currentMainFrequencyId]);

    const handleSelect = (freq: Frequency) => {
        if (freq.premium && !isSubscribed) {
            window.location.hash = '#/pricing';
        } else {
            onSelect(freq);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-white/90 dark:bg-slate-800/90 rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 text-center">{title}</h3>
                     <div className="relative mt-2">
                        <input
                            type="search"
                            placeholder="Search for a frequency..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pr-10 rounded-full border border-slate-300/60 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                        />
                        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                </div>
                <div className="overflow-y-auto p-2">
                    {filteredFrequencies.length > 0 ? filteredFrequencies.map(freq => {
                        const isLocked = !!freq.premium && !isSubscribed;
                        return (
                            <button
                                key={freq.id}
                                onClick={() => handleSelect(freq)}
                                className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-semibold dark:text-slate-200">{freq.name}</p>
                                    <p className="text-sm" style={{color: freq.colors.accent}}>{freq.range}</p>
                                </div>
                                {isLocked && <ProBadge />}
                            </button>
                        )
                    }) : <p className="text-center p-4 text-slate-500 dark:text-slate-400">No frequencies found.</p>}
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={onClose} className="w-full py-2 bg-slate-200 dark:bg-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}