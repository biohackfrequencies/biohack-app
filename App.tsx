import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Frequency, CategoryId, CustomStack, GuidedSession, ActivityLogItem, TrackableActivityId, PlayableItem, AppContentData, CodexReflection } from './types';
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
import { PlayerProvider, usePlayer } from './contexts/PlayerContext';
import { GlobalPlayerUI } from './components/GlobalPlayerUI';
import { processedAppContent } from './data/content';
import AIWellnessAgent from './components/AIWellnessAgent';
import { ToneGeneratorPage } from './components/ToneGeneratorPage';
import { CodexOraclePage } from './components/CodexOraclePage';
import { OraclePromptModal } from './components/OraclePromptModal';

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
  if (pathname === 'ai-agent') return parsed('ai-agent');
  if (pathname === 'codex-breathing-path') return parsed('codex-breathing-path');
  if (pathname === 'codex-oracle') return parsed('codex-oracle');

  return parsed('dashboard');
};

const App: React.FC<{ content: AppContentData }> = ({ content }) => {
  const [route, setRoute] = useState(window.location.hash);
  const { isSubscribed } = useSubscription();
  const { favorites, setFavorites, customStacks, setCustomStacks, activityLog, setActivityLog, activities, codexReflections } = useUserData();
  const { lastCompletedSession } = usePlayer();
  const [showOraclePrompt, setShowOraclePrompt] = useState(false);

  useEffect(() => {
    if (lastCompletedSession) {
      setShowOraclePrompt(true);
    }
  }, [lastCompletedSession]);

  const closeOraclePrompt = () => {
    setShowOraclePrompt(false);
  };

  const enterOraclePortal = () => {
    closeOraclePrompt();
    window.location.hash = '#/codex-oracle';
  };

  const { page, id, fragment } = parseRoute(route);
  
  const { featuredItem, allFrequencies, allSessions, dailyQuote } = useMemo(() => {
    if (!content) return { featuredItem: null, allFrequencies: [], allSessions: [], dailyQuote: null };

    const processItems = <T extends { id: string; categoryId: CategoryId; subCategory?: string; premium?: boolean; baseFrequency?: number; title?: string; name?: string; }>(items: T[]): T[] => {
        const itemsByCategory = new Map<CategoryId, T[]>();
        items.forEach(item => {
            if (!itemsByCategory.has(item.categoryId)) {
                itemsByCategory.set(item.categoryId, []);
            }
            itemsByCategory.get(item.categoryId)!.push(item);
        });

        const processedItems: T[] = [];

        itemsByCategory.forEach((categoryItems) => {
            const itemsBySubCategory = new Map<string, T[]>();
            const hasSubCategories = categoryItems.some(item => item.subCategory);

            if (hasSubCategories) {
                categoryItems.forEach(item => {
                    const subCatKey = item.subCategory || 'uncategorized';
                    if (!itemsBySubCategory.has(subCatKey)) {
                        itemsBySubCategory.set(subCatKey, []);
                    }
                    itemsBySubCategory.get(subCatKey)!.push(item);
                });
            } else {
                itemsBySubCategory.set('default', categoryItems);
            }

            itemsBySubCategory.forEach((subCategoryItems) => {
                const alwaysFree = subCategoryItems.filter(item => item.premium === false);
                const candidatesForFreeTier = subCategoryItems.filter(item => item.premium !== false);

                candidatesForFreeTier.sort((a, b) => {
                    if (a.baseFrequency !== undefined && b.baseFrequency !== undefined) {
                        return a.baseFrequency - b.baseFrequency;
                    }
                    const nameA = a.title || a.name || '';
                    const nameB = b.title || b.name || '';
                    return nameA.localeCompare(nameB);
                });

                const dynamicFree = candidatesForFreeTier.slice(0, 2);
                const premium = candidatesForFreeTier.slice(2);

                alwaysFree.forEach(item => processedItems.push({ ...item, premium: false }));
                dynamicFree.forEach(item => processedItems.push({ ...item, premium: false }));
                premium.forEach(item => processedItems.push({ ...item, premium: true }));
            });
        });
        
        return processedItems;
    };
    
    const allFrequenciesWithDynamicPremium = processItems(content.initial_frequencies);
    const allSessionsWithDynamicPremium = processItems(content.guided_sessions);
    
    const weekNumber = getWeekNumber(new Date());
    
    const IdsToExclude = ['earth-resonance-grounding', 'schumann-resonance'];
    const eligibleCandidates = content.featured_candidates.filter(id => !IdsToExclude.includes(id));
    
    if (eligibleCandidates.length === 0) {
        return { featuredItem: null, allFrequencies: allFrequenciesWithDynamicPremium, allSessions: allSessionsWithDynamicPremium, dailyQuote: null };
    }

    const featuredIndex = weekNumber % eligibleCandidates.length;
    const featuredId = eligibleCandidates[featuredIndex];
    let featuredItem: Frequency | GuidedSession | null = null;
    
    const frequencies = allFrequenciesWithDynamicPremium.map(f => {
        const isFeatured = f.id === featuredId;
        const item = { ...f, isFeatured, premium: isFeatured ? false : f.premium };
        if (isFeatured) {
            featuredItem = item;
        }
        return item;
    });

    const sessions = allSessionsWithDynamicPremium.map(s => {
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

  const renderContent = () => {
    if ((page === 'create' || page === 'stack' || page === 'codex-breathing-path' || page === 'ai-agent' || page === 'codex-oracle') && !isSubscribed) {
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
            codexReflections={codexReflections}
        />;
      case 'create':
        return <CreateStackPage allFrequencies={allFrequencies} categories={content.categories} onSaveStack={handleSaveStack} onBack={() => window.location.hash = '#/library'} />;
      case 'ai-agent':
        return <AIWellnessAgent allFrequencies={allFrequencies} onSaveStack={handleSaveStack} onBack={() => window.location.hash = '#/library'} />;
      case 'codex-breathing-path':
        return <ToneGeneratorPage onBack={() => window.location.hash = '#/library'} allFrequencies={allFrequencies} />;
      case 'codex-oracle':
        return <CodexOraclePage
            onBack={() => window.location.hash = '#/library'}
            allFrequencies={allFrequencies}
            allSessions={allSessions}
            customStacks={customStacks}
        />;
      case 'player':
      case 'session':
      case 'stack': {
        let selectedItem: PlayableItem | undefined;
        let onBack: () => void;
        
        if (page === 'player') {
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
          categoryId={id as CategoryId} 
          frequenciesInCategory={allFrequencies.filter(f => f.categoryId === id)}
          allFrequencies={allFrequencies}
          sessions={allSessions} 
          onBack={() => window.location.hash = '#/library'}
          favorites={favorites} 
          toggleFavorite={toggleFavorite}
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
            dailyQuote={dailyQuote}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent animate-fade-in dark:bg-transparent">
      {showOraclePrompt && <OraclePromptModal onEnter={enterOraclePortal} onClose={closeOraclePrompt} />}
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
        <p className="mt-4">© {new Date().getFullYear()} HeartBeat Productions LLC. All rights reserved.</p>
        <p className="mt-2 text-xs opacity-75">v1.0.0</p>
      </footer>
    </div>
  );
};

const AppInitializer: React.FC = () => {
    const { isAuthenticated, isAuthInitializing, isPasswordRecovery } = useAuth();
    const { isUserDataLoading } = useUserData();
    const { isInitializing: isSubscriptionInitializing } = useSubscription();
    
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