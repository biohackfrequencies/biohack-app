import React, { useState, useEffect } from 'react';
import { CelestialBrandIcon, SparklesIcon, HomeIcon, BrainwaveIcon, SettingsIcon, HeartFilledIcon } from './BohoIcons';
import { useSubscription } from '../hooks/useSubscription';

export const Header: React.FC = () => {
  const { isSubscribed } = useSubscription();
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/dashboard');
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial set
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
      e.preventDefault();
      window.location.hash = hash;
  };

  const page = route.replace(/^#\/?/, '').split('/')[0] || 'dashboard';

  const navLinks = [
    { href: '#/dashboard', page: 'dashboard', label: 'Home', icon: HomeIcon },
    { href: '#/library', page: 'library', label: 'Library', icon: BrainwaveIcon },
    { href: '#/library#my-library', page: 'favorites', label: 'Favorites', icon: HeartFilledIcon },
    { href: '#/settings', page: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <header className="bg-transparent">
      {/* Branding Section */}
      <div className="p-4">
        <div className="container mx-auto flex items-center justify-center">
          <a 
            href="#/" 
            onClick={(e) => navigate(e, '/')}
            className="flex flex-row items-center justify-center gap-4 group w-full" 
            aria-label="Biohack Frequencies Home"
          >
            <CelestialBrandIcon className="h-16 w-16 sm:h-20 sm:w-20 text-slate-600/80 dark:text-dark-text-primary" />
            <div className="flex flex-col items-center leading-tight">
              <span className="font-display font-bold text-2xl sm:text-4xl text-slate-700 dark:text-dark-text-primary tracking-wide text-center">
                Biohack Frequencies
              </span>
              <span className="font-sans text-xs sm:text-sm uppercase tracking-wider text-slate-600/90 dark:text-dark-text-muted text-center">
                Wellness Co-pilot
              </span>
            </div>
            <div className="h-16 w-16 sm:h-20 sm:w-20" aria-hidden="true" />
          </a>
        </div>
      </div>
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-30 bg-white/70 dark:bg-dark-bg/70 backdrop-blur-lg shadow-md py-2">
        <div className="container mx-auto flex items-center justify-center gap-1 sm:gap-2">
          {navLinks.map(link => {
            const isFavoritesLink = link.page === 'favorites';
            // A link is active if its page matches, UNLESS it's the library link and the favorites fragment is present.
            // The favorites link is active ONLY if the favorites fragment is present.
            const isActive = isFavoritesLink
              ? route.includes('#my-library')
              : (page === link.page && !route.includes('#my-library'));
            
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={e => navigate(e, link.href)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold transition-colors flex-shrink-0 ${
                  isActive
                    ? 'bg-brand-sage text-slate-800'
                    : 'text-slate-600 hover:bg-slate-200/70 dark:text-dark-text-secondary dark:hover:bg-dark-surface'
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{link.label}</span>
              </a>
            );
          })}
          
          <div className="flex-shrink-0">
            {isSubscribed ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-brand-gold text-slate-900 font-bold shadow animate-fade-in">
                <SparklesIcon className="w-5 h-5" />
                <span className="text-sm hidden sm:inline">Pro Member</span>
              </div>
            ) : (
              <a
                href="#/pricing"
                onClick={e => navigate(e, '#/pricing')}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold transition-colors bg-brand-orange text-white shadow hover:brightness-110"
              >
                <SparklesIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Go Pro</span>
              </a>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};