import React from 'react';
import { CategoryId, Frequency, CustomStack, GuidedSession, ColorTheme } from '../types';
import { BrainwaveIcon, SolfeggioIcon, AngelIcon, RifeIcon, NoiseIcon, IsochronicIcon, BeautyIcon, CelestialIcon, GuidedSessionIcon, StackIcon, FocusIcon, ElementIcon, InfoIcon } from './BohoIcons';
import { MyLibrary } from './MyLibrary';
import { useSubscription } from '../hooks/useSubscription';
import { FeaturedCard } from './FeaturedCard';
import { useTheme } from '../contexts/ThemeContext';
import { HarmonicElementsCtaCard } from './HarmonicElementsCtaCard';

export const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
  elements: ElementIcon,
  beauty: BeautyIcon,
  guided: GuidedSessionIcon,
  brainwaves: BrainwaveIcon,
  solfeggio: SolfeggioIcon,
  angel: AngelIcon,
  celestial: CelestialIcon,
  rife: RifeIcon,
  isochronic: IsochronicIcon,
  noise: NoiseIcon,
  focus: FocusIcon,
};

const CategoryCard: React.FC<{
  categoryId: CategoryId;
  details: { title: string; description: string; colors: ColorTheme };
  onSelect: () => void;
}> = ({ categoryId, details, onSelect }) => {
  const Icon = categoryIcons[categoryId];
  const { primary, secondary, accent } = details.colors;
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const lightStyle = {
    background: `linear-gradient(135deg, ${primary}60, ${secondary}60)`,
    border: `1px solid ${accent}40`,
  };
  const darkStyle = {
    background: `linear-gradient(135deg, ${primary}60, ${secondary}60)`,
    borderColor: accent,
    '--tw-border-opacity': '0.7',
  };

  return (
    <button
      onClick={onSelect}
      title={details.title}
      className="group relative w-full h-40 flex flex-col items-center justify-center p-4 rounded-2xl text-center transition-all duration-300 shadow-lg hover:-translate-y-1 text-slate-800 dark:text-dark-text-primary overflow-hidden hover:shadow-[0_8px_30px_-5px_var(--glow-color)] border dark:border"
      style={{
        ...(isDarkMode ? darkStyle : lightStyle),
        '--glow-color': `${accent}80`,
      } as any}
    >
      <div className="absolute inset-0 bg-white/0 dark:bg-black/20 group-hover:bg-white/30 dark:group-hover:bg-black/30 transition-colors duration-300"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
        {Icon && <Icon className="h-12 w-12 mb-2 text-slate-700/80 dark:text-dark-text-muted/80" />}
        <h3 className="text-base font-display font-bold text-slate-800 dark:text-dark-text-primary tracking-wide">{details.title}</h3>
      </div>
      
      <div className="absolute inset-0 z-20 p-4 flex items-center justify-center bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-sm text-slate-800 dark:text-dark-text-secondary">{details.description}</p>
      </div>
    </button>
  );
};

interface HomePageProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  customStacks: CustomStack[];
  allFrequencies: Frequency[];
  allSessions: GuidedSession[];
  featuredItem: Frequency | GuidedSession | null;
  categories: Record<CategoryId, { title: string; description: string; colors: ColorTheme }>;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  favorites, toggleFavorite, customStacks, allFrequencies, allSessions, featuredItem, categories
}) => {
  const { isSubscribed } = useSubscription();

  const handlePremiumFeatureClick = (callback: () => void) => {
    if (isSubscribed) {
      callback();
    } else {
      window.location.hash = '#/pricing';
    }
  };
  
  return (
    <div className="space-y-16 animate-fade-in">
       <section className="text-center">
            <h2 className="text-4xl font-display text-center font-semibold text-slate-800 dark:text-dark-text-primary">The Sound Library</h2>
            <p className="max-w-xl mx-auto font-sans text-base leading-relaxed text-slate-700/80 dark:text-dark-text-secondary mt-2">
                Explore our library of science-backed acoustic protocols designed to help you achieve specific mental states for focus, relaxation, and cognitive enhancement.
            </p>
            <div className="mt-6 max-w-xl mx-auto p-3 rounded-lg bg-amber-100/50 dark:bg-amber-900/20 border border-amber-200/80 dark:border-amber-500/30 flex items-center justify-center gap-3">
                <InfoIcon className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                    For best results with Binaural or 8D protocols, please use headphones.
                </p>
            </div>
       </section>

       <section>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-4xl mx-auto">
           <button
              onClick={() => handlePremiumFeatureClick(() => window.location.hash = '#/create')}
              className="group relative w-full p-8 rounded-2xl overflow-hidden text-center flex flex-col items-center justify-center bg-gradient-to-br from-[#EEE8B2]/60 to-[#C18D52]/40 dark:bg-gradient-to-br dark:from-dark-surface dark:to-dark-bg border border-[#C18D52]/30 dark:border-brand-gold/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:saturate-125"
          >
              <div className="absolute -right-6 -bottom-6 w-28 h-28 text-brand-gold/30 dark:text-brand-gold/10 opacity-80 group-hover:scale-110 transition-transform duration-500">
                <StackIcon />
              </div>
              <div className="relative">
                <h4 className="text-2xl font-display font-bold text-slate-800 dark:text-dark-text-primary drop-shadow-sm">Creator Studio</h4>
                <p className="text-slate-700/90 dark:text-dark-text-secondary text-sm mt-1">Design your own sessions with optional layered frequencies.</p>
              </div>
          </button>
        </div>
      </section>
       
       {featuredItem && (
        <div className="max-w-2xl mx-auto">
          <FeaturedCard item={featuredItem} />
        </div>
       )}
       
      <section className="space-y-6">
        <h3 className="text-3xl font-display text-center font-semibold text-slate-800 dark:text-dark-text-primary">All Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Object.entries(categories).filter(([id]) => id !== 'elements').map(([id, details]) => {
                const categoryId = id as CategoryId;
                if (!categoryIcons[categoryId]) return null;
                return (
                    <CategoryCard
                        key={id}
                        categoryId={categoryId}
                        details={details}
                        onSelect={() => window.location.hash = `#/category/${categoryId}`}
                    />
                )
            })}
        </div>
      </section>

      <section className="max-w-4xl mx-auto">
        <HarmonicElementsCtaCard />
      </section>

      <MyLibrary
        favorites={favorites}
        allFrequencies={allFrequencies}
        allSessions={allSessions}
        customStacks={customStacks}
        toggleFavorite={toggleFavorite}
      />
      
    </div>
  );
};
