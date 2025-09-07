import React, { useMemo } from 'react';
// FIX: Import CustomStack type.
import { CategoryId, Frequency, GuidedSession, ColorTheme, CustomStack } from '../types';
import { BackIcon, InfoIcon, SparklesIcon, PathfinderIcon } from './BohoIcons';
import { FrequencyCard } from './FrequencyCard';
import { useSubscription } from '../hooks/useSubscription';
import { categoryIcons } from './HomePage';
import { SessionCard } from './SessionCard';

interface CategoryPageProps {
  categoryId: CategoryId;
  frequenciesInCategory: Frequency[];
  allFrequencies: Frequency[];
  sessions: GuidedSession[];
  onBack: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  categories: Record<CategoryId, { title: string; description:string; colors: ColorTheme; }>;
}

const sortFreeFirst = <T extends { premium?: boolean, baseFrequency?: number, title?: string, name?: string }>(
  items: T[],
  secondarySortKey: 'frequency' | 'title' | 'default'
): T[] => {
  return [...items].sort((a, b) => {
    if (a.premium !== b.premium) {
      return a.premium ? 1 : -1; // false (free) comes first
    }
    // If premium status is the same, sort by the secondary key
    if (secondarySortKey === 'frequency' && a.baseFrequency !== undefined && b.baseFrequency !== undefined) {
      return a.baseFrequency - b.baseFrequency;
    }
    if (secondarySortKey === 'title') {
      const nameA = a.title || a.name || '';
      const nameB = b.title || b.name || '';
      return nameA.localeCompare(nameB);
    }
    return 0; // default order
  });
};

const CategorySection: React.FC<{ title: string; frequencies: Frequency[]; onSelect: (item: Frequency) => void; favorites: string[]; toggleFavorite: (id: string) => void; }> = ({ title, frequencies, onSelect, favorites, toggleFavorite }) => (
    <div className="space-y-4">
        <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-dark-text-primary">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {frequencies.map(freq => (
                <FrequencyCard
                    key={freq.id}
                    frequency={freq}
                    onSelect={() => onSelect(freq)}
                    isFavorite={favorites.includes(freq.id)}
                    onToggleFavorite={() => toggleFavorite(freq.id)}
                />
            ))}
        </div>
    </div>
);

// FIX: Update onSelect prop to accept CustomStack
const SessionSection: React.FC<{ title: string; sessions: (GuidedSession | CustomStack)[]; onSelect: (item: GuidedSession | CustomStack) => void; favorites: string[]; toggleFavorite: (id: string) => void; isSubscribed: boolean; allFrequencies: Frequency[]; }> = ({ title, sessions, onSelect, favorites, toggleFavorite, isSubscribed, allFrequencies }) => (
    <div className="space-y-4">
        <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-dark-text-primary">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map(session => (
                <SessionCard
                    key={session.id}
                    session={session}
                    onSelect={() => onSelect(session)}
                    isFavorite={favorites.includes(session.id)}
                    onToggleFavorite={() => toggleFavorite(session.id)}
                    isLocked={!!session.premium && !isSubscribed}
                    allFrequencies={allFrequencies}
                />
            ))}
        </div>
    </div>
);


export const CategoryPage: React.FC<CategoryPageProps> = ({ categoryId, frequenciesInCategory, allFrequencies, sessions, onBack, favorites, toggleFavorite, categories }) => {
  const categoryDetails = categories[categoryId];
  const { isSubscribed } = useSubscription();
  const Icon = categoryIcons[categoryId];
  const relevantSessions = sessions.filter(s => s.categoryId === categoryId);

  const isAngel = categoryId === 'angel';
  const isKabbalah = categoryId === 'kabbalah';
  const isBrainwaves = categoryId === 'brainwaves';
  const isGuided = categoryId === 'guided';
  const showScienceLink = ['elements', 'codex', 'kabbalah'].includes(categoryId);

  // FIX: Update handleSelect signature to accept CustomStack for type correctness with SessionSection
  const handleSelect = (item: Frequency | GuidedSession | CustomStack) => {
    if (item.premium && !isSubscribed) {
      window.location.hash = '#/pricing';
    } else {
      if ('steps' in item) { // GuidedSession or CustomStack
        window.location.hash = `#/session/${item.id}`;
      } else { // Frequency
        window.location.hash = `#/player/${item.id}`;
      }
    }
  };

  const guidedContent = useMemo(() => {
    if (!isGuided) return null;

    const mindAndSpirit = sortFreeFirst(
        relevantSessions.filter(s => s.subCategory === 'Mind & Spirit'),
        'title'
    );
    
    const bodyAndWellness = sortFreeFirst(
        relevantSessions.filter(s => s.subCategory === 'Body & Wellness'),
        'title'
    );

    return { mindAndSpirit, bodyAndWellness };
  }, [isGuided, relevantSessions]);
  
  const ascensionContent = useMemo(() => {
    if (!isAngel) return null;

    return {
      starseedOrigins: sortFreeFirst(relevantSessions.filter(s => s.subCategory === 'Starseed Origins'), 'title'),
      ancientCivilizations: sortFreeFirst(relevantSessions.filter(s => s.subCategory === 'Ancient Civilizations'), 'title'),
      divineHarmonics: sortFreeFirst(relevantSessions.filter(s => s.subCategory === 'Divine Harmonics'), 'title'),
      fibonacciProtocols: sortFreeFirst(relevantSessions.filter(s => s.subCategory === 'Fibonacci Protocols'), 'title'),
      angelicFrequencies: sortFreeFirst(frequenciesInCategory.filter(f => f.subCategory === 'Angelic Frequencies'), 'frequency'),
      fibonacciFrequencies: sortFreeFirst(frequenciesInCategory.filter(f => f.subCategory === 'Fibonacci Protocols'), 'frequency'),
    };
  }, [isAngel, relevantSessions, frequenciesInCategory]);

  const kabbalahContent = useMemo(() => {
      if (!isKabbalah) return null;
      const sephirotIds = ['kabbalah-keter', 'kabbalah-chokhmah', 'kabbalah-binah', 'kabbalah-chesed', 'kabbalah-gevurah', 'kabbalah-tiferet', 'kabbalah-netzach', 'kabbalah-hod', 'kabbalah-yesod', 'kabbalah-malkuth'];
      const motherLetterIds = ['kabbalah-aleph', 'kabbalah-mem', 'kabbalah-shin'];
      const doubleLetterIds = ['kabbalah-bet', 'kabbalah-gimel', 'kabbalah-dalet', 'kabbalah-kaf', 'kabbalah-pe', 'kabbalah-resh', 'kabbalah-tav'];
      const simpleLetterIds = ['kabbalah-he', 'kabbalah-vav', 'kabbalah-zayin', 'kabbalah-chet', 'kabbalah-tet', 'kabbalah-yod', 'kabbalah-lamed', 'kabbalah-nun', 'kabbalah-samekh', 'kabbalah-ayin', 'kabbalah-tzade', 'kabbalah-qof'];

      const getFrequenciesByIds = (ids: string[]) => ids.map(id => frequenciesInCategory.find(f => f.id === id)).filter((f): f is Frequency => !!f);

      const sections = [
        { title: "The Three Mother Letters (Primordial Forces)", frequencies: sortFreeFirst(getFrequenciesByIds(motherLetterIds), 'frequency') },
        { title: "The Seven Double Letters (Planets / Polarities)", frequencies: sortFreeFirst(getFrequenciesByIds(doubleLetterIds), 'frequency') },
        { title: "The Twelve Simple Letters (Zodiac / Human Faculties)", frequencies: sortFreeFirst(getFrequenciesByIds(simpleLetterIds), 'frequency') },
        { title: "The Tree of Life (10 Sephirot)", frequencies: sortFreeFirst(getFrequenciesByIds(sephirotIds), 'frequency') },
      ];

      const sortedSessions = sortFreeFirst(relevantSessions, 'title');
      return { sections, sortedSessions };
  }, [isKabbalah, frequenciesInCategory, relevantSessions]);

  const brainwavesContent = useMemo(() => {
    if (!isBrainwaves) return null;
    
    const mirrorAxisProtocols = sortFreeFirst(
        relevantSessions.filter(s => s.id.startsWith('mirror-axis-') || s.id === 'phi-axis-harmonic-balance'),
        'title'
    );

    const singleFrequencies = sortFreeFirst(
        frequenciesInCategory.filter(f => f.defaultMode !== 'SPLIT_BINAURAL'),
        'frequency'
    );
        
    return { mirrorAxisProtocols, singleFrequencies };
  }, [isBrainwaves, relevantSessions, frequenciesInCategory]);


  const otherContent = useMemo(() => {
      if (isAngel || isKabbalah || isBrainwaves || isGuided) return null;
      
      const freqSortKey = (categoryId === 'solfeggio' || categoryId === 'elements') ? 'frequency' : 'title';
      
      const sortedFrequencies = sortFreeFirst([...frequenciesInCategory], freqSortKey);
      const sortedSessions = sortFreeFirst([...relevantSessions], 'title');

      return { sortedFrequencies, sortedSessions };
  }, [isAngel, isKabbalah, isBrainwaves, isGuided, frequenciesInCategory, relevantSessions, categoryId]);


  const headerStyle = { background: `linear-gradient(135deg, ${categoryDetails.colors.primary}60, ${categoryDetails.colors.secondary}60)`, borderColor: `${categoryDetails.colors.accent}80` };

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
        <div className="mt-4 flex flex-wrap justify-center items-center gap-4">
            {showScienceLink && (
                 <a href={`#/science#${categoryId}`} 
                   onClick={(e) => {
                       e.preventDefault();
                       sessionStorage.setItem('returnTo', window.location.hash);
                       window.location.hash = `#/science#${categoryId}`;
                   }}
                   className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors bg-white/50 dark:bg-dark-surface/50 text-slate-700 dark:text-dark-text-secondary hover:bg-white/80 dark:hover:bg-dark-surface border border-slate-300/50 dark:border-dark-border/50"
                >
                    <InfoIcon className="w-5 h-5" />
                    <span>Learn about the Science</span>
                </a>
            )}
            {categoryId === 'codex' && (
                <button
                    onClick={() => {
                        if (!isSubscribed) {
                            window.location.hash = '#/pricing';
                        } else {
                            window.location.hash = '#/codex-breathing-path';
                        }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors bg-white/50 dark:bg-dark-surface/50 text-slate-700 dark:text-dark-text-secondary hover:bg-white/80 dark:hover:bg-dark-surface border border-slate-300/50 dark:border-dark-border/50"
                >
                    <PathfinderIcon className="w-5 h-5" />
                    <span>Open Codex Wheel</span>
                    {!isSubscribed && <SparklesIcon className="w-4 h-4 text-brand-orange ml-1" />}
                </button>
            )}
        </div>
      </div>
      
      {isGuided && guidedContent ? (
        <div className="space-y-12">
            {guidedContent.mindAndSpirit.length > 0 && (
                <SessionSection title="Mind & Spirit" sessions={guidedContent.mindAndSpirit} onSelect={handleSelect} favorites={favorites} toggleFavorite={toggleFavorite} isSubscribed={isSubscribed} allFrequencies={allFrequencies} />
            )}
            {guidedContent.bodyAndWellness.length > 0 && (
                <SessionSection title="Body & Wellness" sessions={guidedContent.bodyAndWellness} onSelect={handleSelect} favorites={favorites} toggleFavorite={toggleFavorite} isSubscribed={isSubscribed} allFrequencies={allFrequencies} />
            )}
        </div>
      ) : isAngel && ascensionContent ? (
        <div className="space-y-12">
          {ascensionContent.starseedOrigins.length > 0 && (
            <SessionSection title="Starseed Origins" sessions={ascensionContent.starseedOrigins} onSelect={handleSelect} favorites={favorites} toggleFavorite={toggleFavorite} isSubscribed={isSubscribed} allFrequencies={allFrequencies} />
          )}
          {ascensionContent.ancientCivilizations.length > 0 && (
            <SessionSection title="Ancient Civilizations" sessions={ascensionContent.ancientCivilizations} onSelect={handleSelect} favorites={favorites} toggleFavorite={toggleFavorite} isSubscribed={isSubscribed} allFrequencies={allFrequencies} />
          )}
          {ascensionContent.divineHarmonics.length > 0 && (
            <SessionSection title="Divine Harmonics" sessions={ascensionContent.divineHarmonics} onSelect={handleSelect} favorites={favorites} toggleFavorite={toggleFavorite} isSubscribed={isSubscribed} allFrequencies={allFrequencies} />
          )}
          {ascensionContent.fibonacciProtocols.length > 0 && (
            <SessionSection title="Fibonacci Protocols" sessions={ascensionContent.fibonacciProtocols} onSelect={handleSelect} favorites={favorites} toggleFavorite={toggleFavorite} isSubscribed={isSubscribed} allFrequencies={allFrequencies} />
          )}
          {ascensionContent.angelicFrequencies.length > 0 && (
            <CategorySection title="Angelic Frequencies" frequencies={ascensionContent.angelicFrequencies} onSelect={handleSelect} favorites={favorites} toggleFavorite={toggleFavorite} />
          )}
          {ascensionContent.fibonacciFrequencies.length > 0 && (
            <CategorySection title="Fibonacci Frequencies" frequencies={ascensionContent.fibonacciFrequencies} onSelect={handleSelect} favorites={favorites} toggleFavorite={toggleFavorite} />
          )}
        </div>
      ) : isBrainwaves && brainwavesContent ? (
        <div className="space-y-12">
            {brainwavesContent.mirrorAxisProtocols.length > 0 && (
                <SessionSection title="Mirror Axis & Guided Protocols" sessions={brainwavesContent.mirrorAxisProtocols} onSelect={handleSelect} favorites={favorites} toggleFavorite={toggleFavorite} isSubscribed={isSubscribed} allFrequencies={allFrequencies} />
            )}
            {brainwavesContent.singleFrequencies.length > 0 && (
                <CategorySection 
                    title="Single Brainwave Frequencies"
                    frequencies={brainwavesContent.singleFrequencies}
                    onSelect={handleSelect}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                />
            )}
        </div>
      ) : isKabbalah && kabbalahContent ? (
        <div className="space-y-12">
            {kabbalahContent.sortedSessions.length > 0 && (
                <SessionSection title="Guided Protocols" sessions={kabbalahContent.sortedSessions} onSelect={handleSelect} favorites={favorites} toggleFavorite={toggleFavorite} isSubscribed={isSubscribed} allFrequencies={allFrequencies} />
            )}
            {kabbalahContent.sections.map(section => (
                <CategorySection 
                    key={section.title}
                    title={section.title}
                    frequencies={section.frequencies}
                    onSelect={handleSelect}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                />
            ))}
        </div>
      ) : otherContent ? (
        <>
            {categoryId === 'elements' && otherContent.sortedSessions.length > 0 && (
                <SessionSection title="Elemental Triads" sessions={otherContent.sortedSessions} onSelect={handleSelect} favorites={favorites} toggleFavorite={toggleFavorite} isSubscribed={isSubscribed} allFrequencies={allFrequencies} />
            )}

            {frequenciesInCategory.length > 0 && (
                <div className="space-y-4">
                    {categoryId === 'elements' && <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-dark-text-primary">Individual Elements</h3>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherContent.sortedFrequencies.map(freq => (
                            <FrequencyCard
                                key={freq.id}
                                frequency={freq}
                                onSelect={() => handleSelect(freq)}
                                isFavorite={favorites.includes(freq.id)}
                                onToggleFavorite={() => toggleFavorite(freq.id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {categoryId !== 'elements' && otherContent.sortedSessions.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherContent.sortedSessions.map(session => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            onSelect={() => handleSelect(session)}
                            isFavorite={favorites.includes(session.id)}
                            onToggleFavorite={() => toggleFavorite(session.id)}
                            isLocked={!!session.premium && !isSubscribed}
                            allFrequencies={allFrequencies}
                        />
                    ))}
                </div>
            )}
        </>
      ) : null}
    </div>
  );
};