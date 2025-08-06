import React, { useMemo } from 'react';
import { CustomStack, Frequency, GuidedSession } from '../types';
import { FrequencyCard } from './FrequencyCard';
import { GuidedSessionIcon, StackIcon, HeartFilledIcon } from './BohoIcons';
import { useSubscription } from '../hooks/useSubscription';
import { getImageUrl } from '../services/imageService';

interface MyLibraryProps {
  favorites: string[];
  allFrequencies: Frequency[];
  allSessions: GuidedSession[];
  customStacks: CustomStack[];
  toggleFavorite: (id: string) => void;
}

const SessionCard: React.FC<{
    session: GuidedSession | CustomStack;
    isCustom: boolean;
    onSelect: () => void;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
}> = ({ session, isCustom, onSelect, isFavorite, onToggleFavorite }) => {
    const imageUrl = getImageUrl(session.id);
    
    const cardStyle = {
        '--glow-color': `${session.colors.accent}80`,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: isCustom ? '128px' : 'auto'
    } as React.CSSProperties;

    return (
        <div className="relative group h-full">
            <button onClick={onSelect} className="w-full h-full p-6 rounded-2xl text-left transition-all duration-300 shadow-lg hover:-translate-y-1 text-white hover:shadow-[0_8px_30px_-5px_var(--glow-color)] flex flex-col justify-end" style={cardStyle}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-black/80 transition-all duration-300 rounded-2xl"></div>
                <div className="relative z-10">
                    <div className='flex items-center gap-3 mb-2'>
                        {isCustom ? <StackIcon className="w-6 h-6 text-white/80"/> : <GuidedSessionIcon className="w-6 h-6 text-white/80"/>}
                        <p className='text-xs font-bold uppercase tracking-wider text-white/80'>{isCustom ? 'Custom Session' : 'Protocol'}</p>
                    </div>
                    <p className="font-display font-bold text-white drop-shadow-md truncate">{session.title}</p>
                </div>
            </button>
            {onToggleFavorite && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm text-white hover:text-red-400 hover:bg-white/40 dark:hover:bg-slate-900/40 transition-all z-20"
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <HeartFilledIcon className="w-5 h-5 text-red-500"/>
                </button>
            )}
        </div>
    );
};

export const MyLibrary: React.FC<MyLibraryProps> = ({ 
  favorites, customStacks, toggleFavorite, allFrequencies, allSessions
}) => {
  const { isSubscribed } = useSubscription();
  
  const favoriteItems = useMemo(() => {
    const allContent: (Frequency | GuidedSession | CustomStack)[] = [...allFrequencies, ...allSessions, ...customStacks];
    return favorites
        .map(id => allContent.find(item => item.id === id))
        .filter((item): item is Frequency | GuidedSession | CustomStack => !!item);
  }, [favorites, allFrequencies, allSessions, customStacks]);

  const hasFavorites = favoriteItems.length > 0;

  if (!hasFavorites) {
    return (
        <div id="my-library" className="space-y-6 scroll-mt-32">
            <h3 className="text-4xl font-display text-center font-semibold text-slate-800 dark:text-dark-text-primary">My Library</h3>
            <div className="text-center text-slate-500 dark:text-dark-text-muted p-8 rounded-2xl bg-slate-500/5 dark:bg-dark-surface/20 backdrop-blur-sm border-2 border-dashed border-slate-500/10 dark:border-dark-border/50 flex flex-col items-center gap-4">
                <HeartFilledIcon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                <h4 className="font-semibold text-slate-700 dark:text-dark-text-secondary">Your favorites are a blank canvas.</h4>
                <p>Tap the heart icon on any frequency or session to add it here.</p>
            </div>
        </div>
    );
  }
  
  const handleSelect = (item: Frequency | GuidedSession | CustomStack) => {
    const isCustomStack = customStacks.some(stack => stack.id === item.id);

    if (isCustomStack && !isSubscribed) {
      window.location.hash = '#/pricing';
      return;
    }
    if ('premium' in item && item.premium && !isSubscribed) {
      window.location.hash = '#/pricing';
      return;
    }

    if ('steps' in item) {
      if (isCustomStack) {
        window.location.hash = `#/stack/${item.id}`;
      } else {
        window.location.hash = `#/session/${item.id}`;
      }
    } else {
      window.location.hash = `#/player/${item.id}`;
    }
  };
  
  return (
    <div id="my-library" className="space-y-6 scroll-mt-32">
        <h3 className="text-4xl font-display text-center font-semibold text-slate-800 dark:text-dark-text-primary">My Favorites</h3>
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-500/5 dark:bg-dark-surface/20 backdrop-blur-sm border border-slate-500/10 dark:border-dark-border/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteItems.map(item => {
                  if (!item) return null;
                  if ('steps' in item) { // GuidedSession or CustomStack
                      const sessionItem = item as GuidedSession | CustomStack;
                      const isCustomStack = customStacks.some(s => s.id === sessionItem.id);
                      return (
                        <SessionCard
                            key={sessionItem.id}
                            session={sessionItem}
                            isCustom={isCustomStack}
                            onSelect={() => handleSelect(sessionItem)}
                            isFavorite={true}
                            onToggleFavorite={() => toggleFavorite(sessionItem.id)}
                        />
                      );
                  } else { // Frequency
                      const freqItem = item as Frequency;
                       return (
                          <FrequencyCard
                            key={freqItem.id}
                            frequency={freqItem}
                            onSelect={() => handleSelect(freqItem)}
                            isFavorite={true}
                            onToggleFavorite={() => toggleFavorite(freqItem.id)}
                          />
                       );
                  }
              })}
          </div>
      </div>
    </div>
  );
};
