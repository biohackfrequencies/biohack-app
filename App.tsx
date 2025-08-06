import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Frequency, CategoryId, CustomStack, GuidedSession, ActivityLogItem, TrackableActivityId, HarmonicElement, BenefitCategory, PlayableItem, AppContentData, CodexNode } from './types';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { CategoryPage } from './components/CategoryPage';
import { PlayerPage } from './components/PlayerPage';
import { CreateStackPage } from './components/CreateStackPage';
import LoadingScreen from './components/LoadingScreen';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { useSubscription } from './hooks/useSubscription';
import PricingPage from './components/PricingPage';
import { SettingsPage } from './components/SettingsPage';
import { SciencePage } from './components/SciencePage';
import { DashboardPage } from './components/DashboardPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { YouTubeIcon, InstagramIcon, GlobeIcon } from './components/BohoIcons';
import { DisclaimerPage } from './components/DisclaimerPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import { UserDataProvider, useUserData } from './contexts/UserDataContext';
import { IntegrationsProvider } from './contexts/IntegrationsContext';
import { OurMissionPage } from './components/OurMissionPage';
import { PlayerProvider } from './contexts/PlayerContext';
import { GlobalPlayerUI } from './components/GlobalPlayerUI';
import { appContentData } from './data/content';
import { harmonicElements } from './data/elements';
import { ToneGeneratorPage } from './components/ToneGeneratorPage';
import { codexData } from './data/codex';

const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

const parseRoute = (hash: string): { page: string; id?: string; fragment?: string; params: URLSearchParams } => {
  const [path, fragment] = hash.replace(/^#\/?/, '').split('#');
  const [pathname, search] = path.split('?');
  const params = new URLSearchParams(search || '');

  const parsed = (page: string, id?: string) => ({ page, id, fragment, params });
  
  if (pathname === '' || pathname === '/') return parsed('dashboard');
  if (pathname === 'library') return parsed('library');
  if (pathname === 'pricing') return parsed('pricing');
  if (pathname === 'settings') return parsed('settings');
  if (pathname === 'science') return parsed('science');
  if (pathname === 'our-mission') return parsed('our-mission');
  if (pathname === 'disclaimer') return parsed('disclaimer');
  if (pathname === 'dashboard') return parsed('dashboard');
  if (pathname === 'analytics') return parsed('analytics');
  if (pathname.startsWith('player/')) return parsed('player', pathname.substring('player/'.length));
  if (pathname.startsWith('session/')) return parsed('session', pathname.substring('session/'.length));
  if (pathname.startsWith('stack/')) return parsed('stack', pathname.substring('stack/'.length));
  if (pathname.startsWith('category/')) return parsed('category', pathname.substring('category/'.length));
  if (pathname === 'create') return parsed('create');
  if (pathname === 'custom-tone') return parsed('custom-tone');

  return parsed('dashboard');
};

const App: React.FC<{ content: AppContentData }> = ({ content }) => {
  const [route, setRoute] = useState(window.location.hash);
  const { isSubscribed } = useSubscription();
  const { favorites, setFavorites, customStacks, setCustomStacks, activityLog, setActivityLog, activities } = useUserData();

  const { page, id, fragment, params } = parseRoute(route);
  
  const { featuredItem, allFrequencies, allSessions, dailyQuote } = useMemo(() => {
    if (!content) return { featuredItem: null, allFrequencies: [], allSessions: [], dailyQuote: null };
    
    const weekNumber = getWeekNumber(new Date());
    
    const IdsToExclude = ['earth-resonance-grounding', 'schumann-resonance'];
    const eligibleCandidates = content.featured_candidates.filter(id => !IdsToExclude.includes(id));
    
    if (eligibleCandidates.length === 0) {
        const frequencies = content.initial_frequencies.map(f => ({...f, isFeatured: false}));
        const sessions = content.guided_sessions.map(s => ({...s, isFeatured: false}));
        return { featuredItem: null, allFrequencies: frequencies, allSessions: sessions, dailyQuote: null };
    }

    const featuredIndex = weekNumber % eligibleCandidates.length;
    const featuredId = eligibleCandidates[featuredIndex];
    let featuredItem: Frequency | GuidedSession | null = null;
    
    const frequencies = content.initial_frequencies.map(f => {
        const isFeatured = f.id === featuredId;
        const item = { ...f, isFeatured, premium: isFeatured ? false : f.premium };
        if (isFeatured) {
            featuredItem = item;
        }
        return item;
    });

    const sessions = content.guided_sessions.map(s => {
        const isFeatured = s.id === featuredId;
        const item = { ...s, isFeatured, premium: isFeatured ? false : s.premium };
        if (isFeatured) {
             featuredItem = item;
        }
        return item;
    });

    const dayOfYear = getDayOfYear(new Date());
    const quotes = content.inspirational_quotes || [];
    const dailyQuote = quotes.length > 0 ? quotes[dayOfYear % quotes.length] : null;
    
    return { featuredItem, allFrequencies: frequencies, allSessions: sessions, dailyQuote };
  }, [content]);

  const addActivityLogItem = useCallback((activityId: TrackableActivityId, details?: any): ActivityLogItem => {
      const newItem: ActivityLogItem = {
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          activityId,
          timestamp: Date.now(),
          details: details || {},
      };
      setActivityLog(prev => [...prev, newItem]);
      return newItem;
  }, [setActivityLog]);

  const updateActivityLogItem = useCallback((itemToUpdate: ActivityLogItem) => {
    setActivityLog(prev => prev.map(item => item.id === itemToUpdate.id ? itemToUpdate : item));
  }, [setActivityLog]);

  const deleteActivityLogItem = useCallback((itemId: string) => {
    setActivityLog(prev => prev.filter(item => item.id !== itemId));
  }, [setActivityLog]);

  const duplicateActivityLogItem = useCallback((itemId: string): ActivityLogItem | null => {
    const itemToDuplicate = activityLog.find(item => item.id === itemId);
    if (!itemToDuplicate) return null;

    const newItem: ActivityLogItem = {
      ...itemToDuplicate,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(), // Create it for today
    };

    setActivityLog(prev => [...prev, newItem]);
    return newItem;
  }, [activityLog, setActivityLog]);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/dashboard');
    window.addEventListener('hashchange', handleHashChange);
    
    // Set initial route
    handleHashChange();
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    if (fragment) {
      setTimeout(() => {
        const elementToScroll = document.getElementById(fragment);
        if (elementToScroll) {
          elementToScroll.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, [page, id, fragment]);

  const toggleFavorite = useCallback((itemId: string) => {
    setFavorites(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
  }, [setFavorites]);
  
  const handleSaveStack = (stack: CustomStack) => {
      setCustomStacks(prev => {
          const existingIndex = prev.findIndex(s => s.id === stack.id);
          if (existingIndex > -1) {
              const newStacks = [...prev];
              newStacks[existingIndex] = stack;
              return newStacks;
          }
          return [stack, ...prev];
      });
      window.location.hash = `#/stack/${stack.id}`;
  };

  const handlePlayAiSession = (session: CustomStack) => {
    setCustomStacks(prev => {
        if (prev.some(s => s.id === session.id)) {
            return prev;
        }
        return [session, ...prev];
    });
    window.location.hash = `#/stack/${session.id}`;
  };

  const renderContent = () => {
    if ((page === 'create' || page === 'stack' || page === 'custom-tone') && !isSubscribed) {
        return <PricingPage onBack={() => window.location.hash = '#/library'} />;
    }

    if (page === 'player') {
        const freq = allFrequencies.find(f => f.id === id);
        if (freq && freq.premium && !isSubscribed) {
            return <PricingPage onBack={() => window.location.hash = `#/category/${freq.categoryId}`} />;
        }
    }
    if (page === 'session') {
        const sess = allSessions.find(s => s.id === id);
        if (sess && sess.premium && !isSubscribed) {
            return <PricingPage onBack={() => window.location.hash = `#/category/${sess.categoryId}`} />;
        }
    }

    switch(page) {
      case 'pricing': return <PricingPage onBack={() => window.history.back()} />;
      case 'settings': return <SettingsPage />;
      case 'science': return <SciencePage categories={content.categories} />;
      case 'our-mission': return <OurMissionPage />;
      case 'disclaimer': return <DisclaimerPage />;
      case 'analytics':
        return <AnalyticsPage
            activityLog={activityLog}
            activities={activities}
            onBack={() => window.location.hash = '#/dashboard'}
        />;
      case 'library':
         return <HomePage 
            featuredItem={featuredItem}
            favorites={favorites}
            allFrequencies={allFrequencies}
            allSessions={allSessions}
            customStacks={customStacks}
            toggleFavorite={toggleFavorite}
            categories={content.categories}
        />;
      case 'create':
        return <CreateStackPage allFrequencies={allFrequencies} categories={content.categories} onSaveStack={handleSaveStack} onBack={() => window.location.hash = '#/library'} />;
      case 'custom-tone':
        return <ToneGeneratorPage onBack={() => window.location.hash = '#/library'} onPlayAiSession={handlePlayAiSession} />;
      case 'player':
      case 'session':
      case 'stack': {
        let selectedItem: PlayableItem | undefined;
        let onBack: () => void;
        
        if (page === 'player' && id === 'custom') {
            const freqParam = params.get('freq');
            const freqValue = freqParam ? parseFloat(freqParam) : 432;
            const layerFreqParam = params.get('layerFreq');
            
            selectedItem = {
                id: `custom-${freqValue}${layerFreqParam ? `-${layerFreqParam}` : ''}`,
                name: `Custom Tone (${freqValue} Hz)`,
                range: `${freqValue} Hz`,
                baseFrequency: freqValue,
                binauralFrequency: 0,
                description: `A custom generated pure tone at ${freqValue} Hz. You can experiment with Binaural and Isochronic modes below.`,
                category: BenefitCategory.WELLNESS,
                categoryId: 'isochronic',
                defaultMode: 'PURE',
                availableModes: ['PURE', 'BINAURAL', 'ISOCHRONIC'],
                colors: { primary: '#e2e8f0', secondary: '#f1f5f9', accent: '#94a3b8' },
                premium: true,
            };
            onBack = () => window.location.hash = '#/custom-tone';
        } else if (page === 'player') {
          selectedItem = allFrequencies.find(f => f.id === id);
          onBack = () => window.location.hash = `#/category/${(selectedItem as Frequency)?.categoryId}`;
        } else if (page === 'session') {
          selectedItem = allSessions.find(s => s.id === id);
          onBack = () => window.location.hash = `#/category/${(selectedItem as GuidedSession)?.categoryId}`;
        } else {
          selectedItem = customStacks.find(s => s.id === id);
          onBack = () => window.location.hash = '#/library';
        }

        if (!selectedItem) {
          window.location.hash = '#/library';
          return null;
        }

        return <PlayerPage
          item={selectedItem}
          allFrequencies={allFrequencies}
          onBack={onBack}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          categories={content.categories}
        />;
      }
      case 'category': {
        if (!id || !(id in content.categories)) { window.location.hash = '#/library'; return null; }
        return <CategoryPage 
          categoryId={id as CategoryId} frequencies={allFrequencies.filter(f => f.categoryId === id)}
          sessions={allSessions} onBack={() => window.location.hash = '#/library'}
          favorites={favorites} toggleFavorite={toggleFavorite}
          categories={content.categories}
        />;
      }
      case 'dashboard':
      default:
         return <DashboardPage
            activityLog={activityLog}
            addActivityLogItem={addActivityLogItem}
            updateActivityLogItem={updateActivityLogItem}
            deleteActivityLogItem={deleteActivityLogItem}
            duplicateActivityLogItem={duplicateActivityLogItem}
            allFrequencies={allFrequencies}
            onPlayAiSession={handlePlayAiSession}
            dailyQuote={dailyQuote}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent animate-fade-in dark:bg-transparent">
      <Header />
      <main className="container mx-auto px-4 py-8 pb-24 sm:pb-20">
        {renderContent()}
      </main>
      <GlobalPlayerUI customStacks={customStacks} />
      <footer className="text-center mt-8 mb-6 text-slate-600 dark:text-dark-text-muted text-sm">
        <div className="flex justify-center items-center gap-6 mb-4">
            <a href="https://www.youtube.com/@BIOHACKFREQUENCIES" target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube">
              <YouTubeIcon className="w-8 h-8 text-slate-600 hover:text-slate-900 dark:text-dark-text-muted dark:hover:text-dark-text-primary transition-colors" />
            </a>
            <a href="https://www.instagram.com/biohackfrequencies/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
              <InstagramIcon className="w-8 h-8 text-slate-600 hover:text-slate-900 dark:text-dark-text-muted dark:hover:text-dark-text-primary transition-colors" />
            </a>
            <a href="https://biohackfrequencies.app" target="_blank" rel="noopener noreferrer" aria-label="Website" title="Website">
              <GlobeIcon className="w-8 h-8 text-slate-600 hover:text-slate-900 dark:text-dark-text-muted dark:hover:text-dark-text-primary transition-colors" />
            </a>
        </div>
        <p>For best results with Binaural or 8D protocols, please use headphones. This is for entertainment and wellness exploration, not a medical device. <a 
          href="#/disclaimer" 
          onClick={(e) => {
            e.preventDefault();
            sessionStorage.setItem('returnTo', window.location.hash || '#/dashboard');
            window.location.hash = '/disclaimer';
          }} 
          className="underline hover:text-slate-900 dark:hover:text-dark-text-primary">Legal Disclaimer</a>.</p>
        <p className="mt-4">© {new Date().getFullYear()} HeartBeat Productions BV. All rights reserved.</p>
        <p className="mt-2 text-xs opacity-75">v1.0.0</p>
      </footer>
    </div>
  );
};

const AppInitializer: React.FC = () => {
    const { isAuthenticated, isAuthInitializing, isPasswordRecovery } = useAuth();
    const { isUserDataLoading } = useUserData();
    const { isInitializing: isSubscriptionInitializing } = useSubscription();
    
    const processedAppContent = useMemo(() => {
        const elementFrequencies: Frequency[] = harmonicElements.map((el: HarmonicElement) => ({
            id: el.id,
            name: el.name,
            range: `${el.frequency} Hz`,
            baseFrequency: el.frequency,
            binauralFrequency: el.row,
            description: el.description,
            category: BenefitCategory.SPIRITUAL,
            categoryId: 'elements',
            defaultMode: 'PURE',
            availableModes: ['PURE', 'BINAURAL', 'ISOCHRONIC'],
            colors: appContentData.categories.elements.colors,
            premium: false,
        }));

        const codexFrequencies: Frequency[] = codexData.map((node: CodexNode) => ({
            id: `codex-${node.modulus}`,
            name: `${node.note} (${node.archetype})`,
            range: `${node.frequency.toFixed(2)} Hz`,
            baseFrequency: node.frequency,
            binauralFrequency: 0,
            description: node.archetype,
            category: BenefitCategory.SPIRITUAL,
            categoryId: 'codex',
            defaultMode: 'PURE',
            availableModes: ['PURE', 'BINAURAL', 'ISOCHRONIC'],
            colors: appContentData.categories.codex.colors,
            premium: true,
        }));

        const processedContent: AppContentData = {
            ...appContentData,
            initial_frequencies: [...appContentData.initial_frequencies, ...elementFrequencies, ...codexFrequencies],
        };
        return processedContent;
    }, []);

    const isAppInitializing = isAuthInitializing;

    if (isAppInitializing) {
        return <LoadingScreen />;
    }
  
    const hasRecoveryToken = window.location.hash.includes('type=recovery');
    if (hasRecoveryToken || isPasswordRecovery) {
        return <ResetPasswordPage />;
    }
  
    if (isAuthenticated) {
        const isUserSpecificDataLoading = isUserDataLoading || isSubscriptionInitializing;
        if (isUserSpecificDataLoading) {
            return <LoadingScreen />;
        }
        return <App content={processedAppContent} />;
    }

    return <LoginPage />;
};


export const Root: React.FC = () => (
  <AuthProvider>
    <UserDataProvider>
      <SubscriptionProvider>
        <ThemeProvider>
          <IntegrationsProvider>
            <PlayerProvider>
              <AppInitializer />
            </PlayerProvider>
          </IntegrationsProvider>
        </ThemeProvider>
      </SubscriptionProvider>
    </UserDataProvider>
  </AuthProvider>
);