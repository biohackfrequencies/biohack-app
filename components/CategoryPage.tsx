import React from 'react';
import { Frequency, CategoryId, GuidedSession, ColorTheme } from '../types';
import { BackIcon } from './BohoIcons';
import { FrequencyCard } from './FrequencyCard';
import { useSubscription } from '../hooks/useSubscription';
import { categoryIcons } from './HomePage';
import { useTheme } from '../contexts/ThemeContext';
import { SessionCard } from './SessionCard';

interface CategoryPageProps {
  categoryId: CategoryId;
  frequencies: Frequency[];
  sessions: GuidedSession[];
  onBack: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  categories: Record<CategoryId, { title: string; description:string; colors: ColorTheme; }>;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categoryId, frequencies, sessions, onBack, favorites, toggleFavorite, categories }) => {
  const categoryDetails = categories[categoryId];
  const { isSubscribed } = useSubscription();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const Icon = categoryIcons[categoryId];

  const relevantSessions = sessions.filter(s => s.categoryId === categoryId);

  const handleSelect = (item: Frequency | GuidedSession) => {
    if (item.premium && !isSubscribed) {
      window.location.hash = '#/pricing';
    } else {
      if ('steps' in item) { // GuidedSession
        window.location.hash = `#/session/${item.id}`;
      } else { // Frequency
        window.location.hash = `#/player/${item.id}`;
      }
    }
  };

  const renderContent = () => {
    const getSortScore = (item: { premium?: boolean; isFeatured?: boolean }) => {
        if (item.isFeatured) return -1; // Featured items first
        if (!item.premium) return 0;   // Then free items
        return 1;                      // Then premium items
    };
    
    const sortedFrequencies = [...frequencies].sort((a, b) => {
        const scoreA = getSortScore(a);
        const scoreB = getSortScore(b);
        if (scoreA !== scoreB) {
            return scoreA - scoreB;
        }
        // For specific categories, apply a secondary sort by base frequency.
        if (categoryId === 'solfeggio' || categoryId === 'elements') {
            return a.baseFrequency - b.baseFrequency;
        }
        // For other categories, sort alphabetically for consistent ordering.
        return a.name.localeCompare(b.name);
    });

    const sortedSessions = [...relevantSessions].sort((a, b) => getSortScore(a) - getSortScore(b));

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSessions.map(session => (
                <SessionCard
                    key={session.id}
                    session={session}
                    onSelect={() => handleSelect(session)}
                    isFavorite={favorites.includes(session.id)}
                    onToggleFavorite={() => toggleFavorite(session.id)}
                    isLocked={!!session.premium && !isSubscribed}
                />
            ))}
            {sortedFrequencies.map(freq => (
                <FrequencyCard
                    key={freq.id}
                    frequency={freq}
                    onSelect={() => handleSelect(freq)}
                    isFavorite={favorites.includes(freq.id)}
                    onToggleFavorite={() => toggleFavorite(freq.id)}
                />
            ))}
        </div>
    );
  };

  const headerStyle = isDarkMode
    ? { background: `linear-gradient(135deg, ${categoryDetails.colors.primary}50, ${categoryDetails.colors.secondary}50)`, borderColor: `${categoryDetails.colors.accent}50` }
    : { background: `linear-gradient(135deg, ${categoryDetails.colors.primary}60, ${categoryDetails.colors.secondary}60)`, borderColor: `${categoryDetails.colors.accent}80` };


  return (
    <div className="space-y-8 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-600 dark:text-dark-text-muted hover:text-slate-900 dark:hover:text-dark-text-primary transition-colors self-start" aria-label="Back to library">
        <BackIcon className="w-6 h-6" />
        <span className="font-semibold">Back to Library</span>
      </button>

      <div className="text-center p-8 rounded-xl flex flex-col items-center border" style={headerStyle}>
        {Icon && <Icon className="w-16 h-16 mb-4 text-slate-700/80 dark:text-dark-text-muted/80"/>}
        <h2 className="text-4xl font-display font-bold text-slate-800 dark:text-dark-text-primary">{categoryDetails.title}</h2>
        <p className="text-slate-700/80 dark:text-dark-text-secondary/90 max-w-2xl mx-auto mt-2">{categoryDetails.description}</p>
      </div>

      {renderContent()}
    </div>
  );
};