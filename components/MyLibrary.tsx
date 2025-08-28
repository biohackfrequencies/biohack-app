import React, { useMemo } from 'react';
import { CustomStack, Frequency, GuidedSession, CodexReflection } from '../types';
import { GuidedSessionIcon, StackIcon, HeartFilledIcon, AlchemyIcon, JournalIcon } from './BohoIcons';
import { useSubscription } from '../hooks/useSubscription';
import { getImageUrl } from '../services/imageService';

interface MyLibraryProps {
  favorites: string[];
  allFrequencies: Frequency[];
  allSessions: GuidedSession[];
  customStacks: CustomStack[];
  toggleFavorite: (id: string) => void;
  codexReflections: CodexReflection[];
}

const SessionCard: React.FC<{
    session: GuidedSession | CustomStack;
    isCustom: boolean;
    onSelect: () => void;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
    allFrequencies: Frequency[];
}> = ({ session, isCustom, onSelect, isFavorite, onToggleFavorite, allFrequencies }) => {
    const imageUrl = getImageUrl(session.id);
    
    const cardStyle = {
        '--glow-color': `${session.colors.accent}80`,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: isCustom ? '128px' : 'auto'
    } as React.CSSProperties;
    
    const totalDuration = session.steps.reduce((sum, step) => sum + step.duration, 0);
    const durationInMinutes = Math.round(totalDuration / 60);

    const frequencyString = useMemo(() => {
        const uniqueIds = [...new Set(session.steps.flatMap(step => [step.frequencyId, step.layerFrequencyId]).filter(Boolean) as string[])];
        if (uniqueIds.length === 0) return '';
        const displayIds = uniqueIds.slice(0, 2);
        const freqRanges = displayIds.map(id => {
            const freq = allFrequencies.find(f => f.id === id);
            return freq ? freq.range : '';
        }).filter(Boolean);
        let text = freqRanges.join(' & ');
        if (uniqueIds.length > 2) text += '...';
        return text;
    }, [session.steps, allFrequencies]);
    
    const subtitle = (session as CustomStack).isMixture 
      ? 'Elemental Mixture'
      : (isCustom 
        ? `Custom • ${frequencyString}`
        : `${durationInMinutes} Min • ${frequencyString}`);

    const Icon = (session as CustomStack).isMixture ? AlchemyIcon : (isCustom ? StackIcon : GuidedSessionIcon);

    return (
        <div className="relative group h-full">
            <button onClick={onSelect} className="w-full h-full p-6 rounded-2xl text-left transition-all duration-300 shadow-lg hover:-translate-y-1 text-white hover:shadow-[0_8px_30px_-5px_var(--glow-color)] flex flex-col justify-end" style={cardStyle}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-black/80 transition-all duration-300 rounded-2xl"></div>
                <div className="relative z-10">
                    <div className='flex items-center gap-3 mb-2'>
                        <Icon className="w-6 h-6 text-white/80"/>
                        <p className='text-xs font-bold uppercase tracking-wider text-white/80'>{subtitle}</p>
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

const ReflectionCard: React.FC<{
  reflection: CodexReflection;
  allPlayableItems: (Frequency | GuidedSession | CustomStack)[];
  customStacks: CustomStack[];
}> = ({ reflection, allPlayableItems, customStacks }) => {
    const recommendedItem = allPlayableItems.find(item => item.id === reflection.recommendedSessionId);
    const [isExpanded, setIsExpanded] = React.useState(false);

    const cardStyle = {
        '--glow-color': `#C18D5240`,
    };

    return (
        <div 
            className="w-full p-4 rounded-2xl text-left transition-all duration-300 shadow-lg text-slate-800 dark:text-dark-text-primary bg-white/50 dark:bg-dark-surface/50 border border-slate-200/50 dark:border-dark-border/50"
            // FIX: Cast style object to React.CSSProperties to allow custom properties.
            style={cardStyle as React.CSSProperties}
        >
            <button onClick={() => setIsExpanded(!isExpanded)} className="w-full text-left">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <p className="text-xs text-slate-500 dark:text-dark-text-muted">{new Date(reflection.timestamp).toLocaleDateString()}</p>
                        <h4 className="font-display font-bold text-lg text-brand-gold">{reflection.title}</h4>
                        <p className="text-sm italic text-slate-600 dark:text-dark-text-secondary mt-1 line-clamp-1">Intention: "{reflection.intention}"</p>
                    </div>
                    <JournalIcon className="w-8 h-8 text-brand-gold/70 flex-shrink-0 mt-1" />
                </div>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] mt-4 pt-4 border-t border-slate-200 dark:border-dark-border' : 'max-h-0'}`}>
                    <div className="prose prose-sm prose-slate dark:prose-invert max-w-none whitespace-pre-wrap font-sans">
                        <p>{reflection.transmission}</p>
                    </div>
                    {recommendedItem && (
                        <div className="mt-4 pt-3 border-t border-dashed border-slate-300 dark:border-dark-border/50">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-dark-text-muted">Recommended Session:</p>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const itemType = 'steps' in recommendedItem ? (customStacks.some(s => s.id === recommendedItem.id) ? 'stack' : 'session') : 'player';
                                    window.location.hash = `#/${itemType}/${recommendedItem.id}`;
                                }}
                                className="font-semibold text-brand-gold hover:underline"
                            >
                                {'title' in recommendedItem ? recommendedItem.title : recommendedItem.name}
                            </button>
                        </div>
                    )}
                </div>
            </button>
        </div>
    );
};


export const MyLibrary: React.FC<MyLibraryProps> = ({ 
  favorites, customStacks, toggleFavorite, allFrequencies, allSessions, codexReflections
}) => {
  const { isSubscribed } = useSubscription();
  
  const favoriteItems = useMemo(() => {
    const allContent: (Frequency | GuidedSession | CustomStack)[] = [...allFrequencies, ...allSessions, ...customStacks];
    return favorites
        .map(id => allContent.find(item => item.id === id))
        .filter((item): item is Frequency | GuidedSession | CustomStack => !!item);
  }, [favorites, allFrequencies, allSessions, customStacks]);

  const allPlayableItems = useMemo(() => [...allFrequencies, ...allSessions, ...customStacks], [allFrequencies, allSessions, customStacks]);
  const sortedReflections = useMemo(() => [...codexReflections].sort((a, b) => b.timestamp - a.timestamp), [codexReflections]);
  
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
    <div id="my-library" className="space-y-16 scroll-mt-32">
        <section className="space-y-6">
            <h3 className="text-4xl font-display text-center font-semibold text-slate-800 dark:text-dark-text-primary">My Favorites</h3>
            {favoriteItems.length > 0 ? (
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
                                    allFrequencies={allFrequencies}
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
            ) : (
                <div className="text-center text-slate-500 dark:text-dark-text-muted p-8 rounded-2xl bg-slate-500/5 dark:bg-dark-surface/20 backdrop-blur-sm border-2 border-dashed border-slate-500/10 dark:border-dark-border/50 flex flex-col items-center gap-4">
                    <HeartFilledIcon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                    <h4 className="font-semibold text-slate-700 dark:text-dark-text-secondary">Your favorites are a blank canvas.</h4>
                    <p>Tap the heart icon on any frequency or session to add it here.</p>
                </div>
            )}
        </section>

        <section className="space-y-6">
            <h3 className="text-4xl font-display text-center font-semibold text-slate-800 dark:text-dark-text-primary">Codex Journal</h3>
             {sortedReflections.length > 0 ? (
                <div className="space-y-4 max-w-2xl mx-auto">
                    {sortedReflections.map(reflection => (
                        <ReflectionCard key={reflection.id} reflection={reflection} allPlayableItems={allPlayableItems} customStacks={customStacks} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-slate-500 dark:text-dark-text-muted p-8 rounded-2xl bg-slate-500/5 dark:bg-dark-surface/20 backdrop-blur-sm border-2 border-dashed border-slate-500/10 dark:border-dark-border/50 flex flex-col items-center gap-4">
                    <JournalIcon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                    <h4 className="font-semibold text-slate-700 dark:text-dark-text-secondary">Your journal is empty.</h4>
                    <p>Visit the Codex Oracle to receive and save your first reading.</p>
                </div>
            )}
        </section>
    </div>
  );
};