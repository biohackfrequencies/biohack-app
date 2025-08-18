import React from 'react';
import { CategoryId, Frequency, CustomStack, GuidedSession, ColorTheme } from '../types';
import { BrainwaveIcon, SolfeggioIcon, AngelIcon, RifeIcon, NoiseIcon, CelestialIcon, GuidedSessionIcon, StackIcon, ElementIcon, PathfinderIcon, OracleIcon, TreeOfLifeIcon } from './BohoIcons';
import { MyLibrary } from './MyLibrary';
import { useSubscription } from '../hooks/useSubscription';
import { FeaturedCard } from './FeaturedCard';
import { useTheme } from '../contexts/ThemeContext';
import { ProBadge } from './ProBadge';

export const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
  elements: ElementIcon,
  codex: PathfinderIcon,
  kabbalah: TreeOfLifeIcon,
  guided: GuidedSessionIcon,
  brainwaves: BrainwaveIcon,
  solfeggio: SolfeggioIcon,
  angel: AngelIcon,
  celestial: CelestialIcon,
  rife: RifeIcon,
  noise: NoiseIcon,
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
    background: `linear-gradient(135deg, ${primary}80, ${secondary}80)`,
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
      <div className="absolute inset-0 bg-white/0 dark:bg-dark-surface/30 group-hover:bg-white/30 dark:group-hover:bg-dark-surface/20 transition-colors duration-300"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
        {Icon && <Icon className="h-12 w-12 mb-2 text-slate-900/[0.85] dark:text-dark-text-primary/[0.95] drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]" />}
        <h3 className="text-base font-display font-bold text-slate-800 dark:text-dark-text-primary tracking-wide">{details.title}</h3>
      </div>
      
      <div className="absolute inset-0 z-20 p-4 flex flex-col items-center justify-center bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-sm text-slate-800 dark:text-dark-text-secondary">{details.description}</p>
      </div>
    </button>
  );
};

const ActionCard: React.FC<{
  title: string;
  description: string;
  Icon: React.FC<{ className?: string }>;
  onClick: () => void;
  colors: ColorTheme;
  isLocked: boolean;
}> = ({ title, description, Icon, onClick, colors, isLocked }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const { primary, secondary, accent } = colors;
  
  const lightStyle = {
    background: `linear-gradient(135deg, ${primary}60, ${secondary}60)`,
    border: `1px solid ${accent}40`,
  };
  const darkStyle = {
    background: `linear-gradient(135deg, ${primary}80, ${secondary}80)`,
    borderColor: accent,
    '--tw-border-opacity': '0.7',
  };

  return (
    <button
      onClick={onClick}
      title={title}
      className="group relative w-full h-40 flex flex-col items-center justify-center p-4 rounded-2xl text-center transition-all duration-300 shadow-lg hover:-translate-y-1 text-slate-800 dark:text-dark-text-primary overflow-hidden hover:shadow-[0_8px_30px_-5px_var(--glow-color)] border dark:border"
      style={{
        ...(isDarkMode ? darkStyle : lightStyle),
        '--glow-color': `${accent}80`,
      } as any}
    >
      {isLocked && (
        <div className="absolute top-3 right-3 z-20">
            <ProBadge />
        </div>
      )}
      <div className="absolute inset-0 bg-white/0 dark:bg-dark-surface/30 group-hover:bg-white/30 dark:group-hover:bg-dark-surface/20 transition-colors duration-300"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
        <Icon className="h-12 w-12 mb-2 text-slate-900/[0.85] dark:text-dark-text-primary/[0.95] drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]" />
        <h3 className="text-base font-display font-bold text-slate-800 dark:text-dark-text-primary tracking-wide">{title}</h3>
      </div>
      
      <div className="absolute inset-0 z-20 p-4 flex flex-col items-center justify-center bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-sm text-slate-800 dark:text-dark-text-secondary">{description}</p>
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

  const categoryOrder: CategoryId[] = [
    'elements', 'codex', 'kabbalah', 'guided', 'brainwaves', 'solfeggio', 'angel', 'celestial', 'rife', 'noise'
  ];
  
  return (
    <div className="space-y-16 animate-fade-in">
       <section className="text-center">
            <h2 className="text-4xl font-display text-center font-semibold text-slate-800 dark:text-dark-text-primary">The Sound Library</h2>
            <p className="max-w-xl mx-auto font-sans text-base leading-relaxed text-slate-700/80 dark:text-dark-text-secondary mt-2">
                Explore our library of acoustic protocols designed to support focus, relaxation, and cognitive well-being. These sound experiences are based on research in acoustics, resonance, and neuro-acoustics, and are offered for informational, educational, and wellness purposes.
            </p>
            <div className="mt-4 p-3 max-w-xl mx-auto rounded-xl bg-amber-100/50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-500/30 text-amber-800 dark:text-amber-200 text-sm">
                For immersive experiences (such as Binaural Beats or 8D Spatial Audio), headphones are recommended.
            </div>
       </section>

       {featuredItem && (
        <div className="max-w-2xl mx-auto">
          <FeaturedCard item={featuredItem} />
        </div>
       )}
       
      <section className="space-y-6">
        <h3 className="text-3xl font-display text-center font-semibold text-slate-800 dark:text-dark-text-primary">All Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {categoryOrder.map(id => {
                const details = categories[id];
                const categoryId = id as CategoryId;
                if (!details || !categoryIcons[categoryId]) return null;
                return (
                    <CategoryCard
                        key={id}
                        categoryId={categoryId}
                        details={details}
                        onSelect={() => window.location.hash = `#/category/${categoryId}`}
                    />
                )
            })}
             <ActionCard
                title="Creator Studio"
                description="Design and customize your own sessions by combining frequencies, soundscapes, and protocols tailored to your personal journey."
                Icon={StackIcon}
                onClick={() => handlePremiumFeatureClick(() => window.location.hash = '#/create')}
                colors={{ primary: '#EEE8B2', secondary: '#C18D52', accent: '#C18D52' }}
                isLocked={!isSubscribed}
            />
             <ActionCard
                title="Codex Alchemist"
                description="Describe an intention and our AI will instantly design a personalized sound session for you."
                Icon={OracleIcon}
                onClick={() => handlePremiumFeatureClick(() => window.location.hash = '#/ai-agent')}
                colors={{ primary: '#a7f3d0', secondary: '#cffafe', accent: '#22d3ee' }}
                isLocked={!isSubscribed}
            />
        </div>
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