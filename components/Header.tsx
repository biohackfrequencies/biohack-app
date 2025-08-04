import React from 'react';
import { CelestialBrandIcon, SparklesIcon, SettingsIcon, BrainwaveIcon } from './BohoIcons';
import { useSubscription } from '../hooks/useSubscription';

export const Header: React.FC = () => {
  const { isSubscribed } = useSubscription();
  
  const navigate = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
      e.preventDefault();
      window.location.hash = hash;
  };

  return (
    <header className="p-4">
      <div className="container mx-auto flex items-center justify-between">
        <a 
          href="#/" 
          onClick={(e) => navigate(e, '/')}
          className="flex items-center gap-2 sm:gap-4 group" 
          aria-label="Biohack Frequencies Home"
        >
          <CelestialBrandIcon className="h-16 w-16 sm:h-20 sm:w-20 text-slate-600/80 dark:text-dark-text-muted/80 flex-shrink-0" />
          <div className="flex flex-col items-start leading-tight">
            <span className="font-display font-bold text-2xl sm:text-4xl text-slate-700 dark:text-dark-text-primary tracking-wide">
              Biohack Frequencies
            </span>
            <span className="font-sans text-xs sm:text-sm uppercase tracking-wider text-slate-600/90 dark:text-dark-text-muted/90">
              Wellness Co-pilot
            </span>
          </div>
        </a>
         <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {isSubscribed ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold text-white shadow animate-fade-in">
              <SparklesIcon className="w-5 h-5" />
              <span className="text-sm font-semibold hidden sm:inline">Pro Member</span>
            </div>
          ) : (
            <button 
              onClick={() => window.location.hash = '#/pricing'}
              className="px-4 py-2 rounded-full bg-brand-gold text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              Go Pro
            </button>
          )}
          <a href="#/library" onClick={(e) => navigate(e, '/library')} aria-label="Sound Library" title="Sound Library">
            <BrainwaveIcon className="w-8 h-8 text-slate-600 hover:text-slate-900 dark:text-dark-text-muted dark:hover:text-dark-text-primary transition-colors" />
          </a>
          <a href="#/settings" onClick={(e) => navigate(e, '/settings')} aria-label="Settings" title="Settings">
            <SettingsIcon className="w-7 h-7 text-slate-600 hover:text-slate-900 dark:text-dark-text-muted dark:hover:text-dark-text-primary transition-colors" />
          </a>
        </div>
      </div>
    </header>
  );
};