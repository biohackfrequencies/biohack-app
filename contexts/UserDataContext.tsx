





import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';
import { CustomStack, ActivityLogItem, UserGoals, TrackableActivityId, TrackableActivityBase, ProfileInsert, ProfileUpdate, CodexReflection } from '../types';
import { TRACKABLE_ACTIVITIES, TrackableActivity } from '../constants';
import { PlusCircleIcon } from '../components/BohoIcons';

const CUSTOM_COLORS = ['#fb923c', '#f472b6', '#34d399', '#60a5fa', '#a78bfa', '#facc15', '#ef4444'];

const useSyncedState = <T,>(key: string, initialValue: T, enabled: boolean): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    if (enabled) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state, enabled]);

  return [state, setState];
};

interface UserDataContextType {
  isUserDataLoading: boolean;
  favorites: string[];
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
  customStacks: CustomStack[];
  setCustomStacks: React.Dispatch<React.SetStateAction<CustomStack[]>>;
  activityLog: ActivityLogItem[];
  setActivityLog: React.Dispatch<React.SetStateAction<ActivityLogItem[]>>;
  trackedHabits: TrackableActivityId[];
  setTrackedHabits: React.Dispatch<React.SetStateAction<TrackableActivityId[]>>;
  userGoals: UserGoals;
  setUserGoals: React.Dispatch<React.SetStateAction<UserGoals>>;
  proAccessExpiresAt: number | null;
  setProAccessExpiresAt: React.Dispatch<React.SetStateAction<number | null>>;
  customActivities: TrackableActivityBase[];
  addCustomActivity: (name: string) => TrackableActivityBase | undefined;
  removeCustomActivity: (id: TrackableActivityId) => void;
  codexReflections: CodexReflection[];
  setCodexReflections: React.Dispatch<React.SetStateAction<CodexReflection[]>>;
  aiCreditsRemaining: number;
  setAiCreditsRemaining: React.Dispatch<React.SetStateAction<number>>;
}

const UserDataContext = createContext<UserDataContextType | null>(null);

// Custom hook for debounced Supabase sync
const useDebouncedSync = <K extends keyof ProfileUpdate>(
    column: K,
    value: ProfileUpdate[K],
    syncEnabled: boolean,
    userId?: string
) => {
    useEffect(() => {
        if (syncEnabled && userId) {
            const timer = setTimeout(() => {
                const sync = async () => {
                    try {
                        const updatePayload: ProfileUpdate = { [column]: value };
                        const { error } = await supabase.from('profiles').update(updatePayload).eq('id', userId);
                        if (error) {
                            console.warn(`Network issue syncing ${column}:`, error.message);
                        }
                    } catch (e: any) {
                        console.warn(`Could not sync ${column}. User might be offline or a network request was blocked. Message: ${e.message}`);
                    }
                };
                sync();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [value, column, syncEnabled, userId]);
};


export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthInitializing } = useAuth();
  const [isUserDataLoading, setIsUserDataLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const [favorites, setFavorites] = useSyncedState<string[]>('biohack_favorites', [], !!user);
  const [customStacks, setCustomStacks] = useSyncedState<CustomStack[]>('biohack_stacks', [], !!user);
  const [activityLog, setActivityLog] = useSyncedState<ActivityLogItem[]>('biohack_activity_log', [], !!user);
  const [trackedHabits, setTrackedHabits] = useSyncedState<TrackableActivityId[]>('biohack_tracked_habits', ['session', 'workout', 'meditation', 'sleep', 'supplements', 'rlt', 'mood'], !!user);
  const [userGoals, setUserGoals] = useSyncedState<UserGoals>('biohack_user_goals', { mind: 20, move: 10000 }, !!user);
  const [customActivities, setCustomActivities] = useSyncedState<TrackableActivityBase[]>('biohack_custom_activities', [], !!user);
  const [proAccessExpiresAt, setProAccessExpiresAt] = useSyncedState<number | null>('biohack_pro_expires', null, !!user);
  const [codexReflections, setCodexReflections] = useSyncedState<CodexReflection[]>('biohack_reflections', [], !!user);
  const [aiCreditsRemaining, setAiCreditsRemaining] = useSyncedState<number>('biohack_ai_credits', 5, !!user);
  const [aiCreditsResetAt, setAiCreditsResetAt] = useSyncedState<string | null>('biohack_ai_credits_reset', null, !!user);

  const bootstrapInProgress = useRef(false);

  useEffect(() => {
    const bootstrapUserData = async () => {
      if (isAuthInitializing || bootstrapInProgress.current) {
        return;
      }

      if (!user) {
        setFavorites([]);
        setCustomStacks([]);
        setActivityLog([]);
        setTrackedHabits(['session', 'workout', 'meditation', 'sleep', 'supplements', 'rlt', 'mood']);
        setUserGoals({ mind: 20, move: 10000 });
        setCustomActivities([]);
        setCodexReflections([]);
        setProAccessExpiresAt(null);
        setAiCreditsRemaining(5);
        setAiCreditsResetAt(null);
        setIsUserDataLoading(false);
        return;
      }

      bootstrapInProgress.current = true;
      setIsUserDataLoading(true);

      try {
        let { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code === 'PGRST116') {
          const defaultHabits = ['session', 'workout', 'meditation', 'sleep', 'supplements', 'rlt', 'mood'];
          const defaultGoals = { mind: 20, move: 10000 };
          const newProfileData: ProfileInsert = {
              id: user.id, favorites: [], custom_stacks: [], activity_log: [],
              tracked_habits: defaultHabits, user_goals: defaultGoals, custom_activities: [],
              codex_reflections: [],
              pro_access_expires_at: null,
              ai_credits_remaining: 5,
              ai_credits_reset_at: new Date().toISOString(),
              api_requests: [],
            };
          const { data: newProfile, error: insertError } = await supabase.from('profiles').insert(newProfileData).select().single();
          if (insertError) throw insertError;
          profile = newProfile;
        } else if (error) {
          throw error;
        }
        
        if (profile) {
            // FIX: Cast complex JSONB column types from `any` back to their specific types to restore type safety.
            setFavorites(profile.favorites || []);
            setCustomStacks((profile.custom_stacks as CustomStack[]) || []);
            setActivityLog((profile.activity_log as ActivityLogItem[]) || []);
            setTrackedHabits(profile.tracked_habits || ['session', 'workout', 'meditation', 'sleep', 'supplements', 'rlt', 'mood']);
            setUserGoals((profile.user_goals as UserGoals) || { mind: 20, move: 10000 });
            setCustomActivities((profile.custom_activities as TrackableActivityBase[]) || []);
            setCodexReflections((profile.codex_reflections as CodexReflection[]) || []);
            setProAccessExpiresAt(profile.pro_access_expires_at ? new Date(profile.pro_access_expires_at).getTime() : null);
            setAiCreditsRemaining(profile.ai_credits_remaining ?? 5);
            setAiCreditsResetAt(profile.ai_credits_reset_at ?? null);
        }
      } catch (e) {
        // This catch block is for network failures or other errors when fetching from Supabase.
        // The previous implementation reset the user's state to empty arrays, which could
        // wipe out locally-stored data if the user was temporarily offline.
        // This fix improves the error logging and, crucially, REMOVES the state-clearing calls.
        // Now, if the sync fails, the app will continue to run with the data already
        // loaded from localStorage by the `useSyncedState` hooks, ensuring a robust offline experience.
        const error = e as (Error & { details?: string; hint?: string; message: string });
        console.error("Failed to bootstrap user data from Supabase. App will continue with locally-stored data.");
        console.error("Error details:", { message: error.message, details: error.details, hint: error.hint, fullError: e });
        
        // DO NOT reset state here. Let the app use the data loaded from localStorage.
      } finally {
        setIsUserDataLoading(false);
        bootstrapInProgress.current = false;
      }
    };
    bootstrapUserData();
  }, [user, isAuthInitializing]);
  
  const syncEnabled = !!user && !isUserDataLoading && isOnline;
  
  useDebouncedSync('favorites', favorites, syncEnabled, user?.id);
  useDebouncedSync('custom_stacks', customStacks, syncEnabled, user?.id);
  useDebouncedSync('activity_log', activityLog, syncEnabled, user?.id);
  useDebouncedSync('tracked_habits', trackedHabits, syncEnabled, user?.id);
  useDebouncedSync('user_goals', userGoals, syncEnabled, user?.id);
  useDebouncedSync('custom_activities', customActivities, syncEnabled, user?.id);
  useDebouncedSync('codex_reflections', codexReflections, syncEnabled, user?.id);
  useDebouncedSync('ai_credits_remaining', aiCreditsRemaining, syncEnabled, user?.id);
  
  const proAccessExpiresAtIso = useMemo(() => proAccessExpiresAt ? new Date(proAccessExpiresAt).toISOString() : null, [proAccessExpiresAt]);
  useDebouncedSync('pro_access_expires_at', proAccessExpiresAtIso, syncEnabled, user?.id);

  const aiCreditsResetAtIso = useMemo(() => aiCreditsResetAt ? new Date(aiCreditsResetAt).toISOString() : null, [aiCreditsResetAt]);
  useDebouncedSync('ai_credits_reset_at', aiCreditsResetAtIso, syncEnabled, user?.id);

  const addCustomActivity = useCallback((name: string): TrackableActivityBase | undefined => {
    if (!name.trim()) return;
    const newActivity: TrackableActivityBase = {
      id: `custom-${name.trim().toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name: name.trim(),
      color: CUSTOM_COLORS[customActivities.length % CUSTOM_COLORS.length],
      custom: true,
    };
    setCustomActivities(prev => [...prev, newActivity]);
    setTrackedHabits(prev => [...prev, newActivity.id]);
    return newActivity;
  }, [customActivities.length, setCustomActivities, setTrackedHabits]);

  const removeCustomActivity = useCallback((id: TrackableActivityId) => {
    setCustomActivities(prev => prev.filter(act => act.id !== id));
    setTrackedHabits(prev => prev.filter(habitId => habitId !== id));
  }, [setCustomActivities, setTrackedHabits]);

  const value = {
    isUserDataLoading,
    favorites, setFavorites,
    customStacks, setCustomStacks,
    activityLog, setActivityLog,
    trackedHabits, setTrackedHabits,
    userGoals, setUserGoals,
    proAccessExpiresAt, setProAccessExpiresAt,
    customActivities, addCustomActivity, removeCustomActivity,
    codexReflections, setCodexReflections,
    aiCreditsRemaining, setAiCreditsRemaining,
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};

export const useUserData = (): UserDataContextType & { activities: TrackableActivity[] } => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  
  const activities = useMemo(() => {
      const hydratedCustomActivities: TrackableActivity[] = context.customActivities.map(act => ({
          ...act,
          icon: PlusCircleIcon,
      }));
      return [...TRACKABLE_ACTIVITIES, ...hydratedCustomActivities];
  }, [context.customActivities]);

  return { ...context, activities };
};