import React, { useState, useMemo } from 'react';
import { Frequency, CategoryId, ColorTheme } from '../types';
import { SearchIcon } from './BohoIcons';
import { ProBadge } from './ProBadge';

interface LayerSelectorModalProps {
  allFrequencies: Frequency[];
  onSelect: (freq: Frequency) => void;
  onClose: () => void;
  currentMainFrequencyId: string;
  title: string;
  isSubscribed: boolean;
  categories: Record<CategoryId, { title: string; description:string; colors: ColorTheme; }>;
}

export const LayerSelectorModal: React.FC<LayerSelectorModalProps> = ({ 
    allFrequencies, onSelect, onClose, currentMainFrequencyId, title, isSubscribed, categories
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const { groupedFrequencies, hasResults } = useMemo(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        let filtered = allFrequencies.filter(f => 
            f.id !== currentMainFrequencyId &&
            (f.name.toLowerCase().includes(lowerCaseQuery) || (f.energeticAssociation && f.energeticAssociation.toLowerCase().includes(lowerCaseQuery)))
        );

        if (searchQuery) {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            return { 
                groupedFrequencies: { 'Search Results': filtered },
                hasResults: filtered.length > 0 
            };
        }

        // Define a preferred order for categories
        const categoryOrder: CategoryId[] = ['brainwaves', 'solfeggio', 'elements', 'celestial', 'rife', 'angel', 'noise', 'codex'];
        const groups: Record<CategoryId, Frequency[]> = {} as any;

        categoryOrder.forEach(catId => {
            if (categories[catId]) {
                groups[catId] = [];
            }
        });

        filtered.forEach(freq => {
            if (groups[freq.categoryId]) {
                groups[freq.categoryId].push(freq);
            }
        });

        Object.keys(groups).forEach(key => {
            const catId = key as CategoryId;
            groups[catId].sort((a, b) => {
                if (catId === 'elements') {
                    return (a.atomicNumber || 0) - (b.atomicNumber || 0);
                }
                if (catId === 'solfeggio' || catId === 'angel') {
                    return a.baseFrequency - b.baseFrequency;
                }
                return a.name.localeCompare(b.name);
            });
        });

        const finalGrouped: Record<string, Frequency[]> = {};
        categoryOrder.forEach(catId => {
            if (groups[catId] && groups[catId].length > 0) {
                finalGrouped[categories[catId].title] = groups[catId];
            }
        });

        return { groupedFrequencies: finalGrouped, hasResults: filtered.length > 0 };
    }, [searchQuery, allFrequencies, currentMainFrequencyId, categories]);

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
                    {hasResults ? Object.entries(groupedFrequencies).map(([groupName, frequencies]) => (
                        <div key={groupName}>
                            <h4 className="font-bold text-slate-500 dark:text-slate-400 sticky top-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm py-1 px-4 z-10 text-sm uppercase tracking-wider">{groupName}</h4>
                            {frequencies.map(freq => {
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
                                            {freq.energeticAssociation && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{freq.energeticAssociation}</p>
                                            )}
                                        </div>
                                        {isLocked && <ProBadge />}
                                    </button>
                                )
                            })}
                        </div>
                    )) : <p className="text-center p-4 text-slate-500 dark:text-slate-400">No frequencies found.</p>}
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