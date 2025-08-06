import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';
import { CustomStack, ActivityLogItem, UserGoals, TrackableActivityId, TrackableActivityBase, ProfileInsert } from '../types';
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
}

const UserDataContext = createContext<UserDataContextType | null>(null);

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthInitializing } = useAuth();
  const [isUserDataLoading, setIsUserDataLoading] = useState(true);
  
  // These hooks will read/write from localStorage
  const [favorites, setFavorites] = useSyncedState<string[]>('biohack_favorites', [], !!user);
  const [customStacks, setCustomStacks] = useSyncedState<CustomStack[]>('biohack_stacks', [], !!user);
  const [activityLog, setActivityLog] = useSyncedState<ActivityLogItem[]>('biohack_activity_log', [], !!user);
  const [trackedHabits, setTrackedHabits] = useSyncedState<TrackableActivityId[]>('biohack_tracked_habits', ['session', 'workout', 'meditation', 'sleep', 'supplements', 'rlt', 'mood'], !!user);
  const [userGoals, setUserGoals] = useSyncedState<UserGoals>('biohack_user_goals', { mind: 20, move: 10000 }, !!user);
  const [customActivities, setCustomActivities] = useSyncedState<TrackableActivityBase[]>('biohack_custom_activities', [], !!user);
  const [proAccessExpiresAt, setProAccessExpiresAt] = useSyncedState<number | null>('biohack_pro_expires', null, !!user);
  
  const bootstrapInProgress = useRef(false);

  // --- Data Fetching and State Lifecycle Management ---
  useEffect(() => {
    const bootstrapUserData = async () => {
      if (isAuthInitializing || bootstrapInProgress.current) {
        return;
      }

      if (!user) {
        // Logged out: reset all local state and finish loading.
        setFavorites([]);
        setCustomStacks([]);
        setActivityLog([]);
        setTrackedHabits(['session', 'workout', 'meditation', 'sleep', 'supplements', 'rlt', 'mood']);
        setUserGoals({ mind: 20, move: 10000 });
        setCustomActivities([]);
        setProAccessExpiresAt(null);
        setIsUserDataLoading(false);
        return;
      }

      // Logged in: start the bootstrap process.
      bootstrapInProgress.current = true;
      setIsUserDataLoading(true);

      try {
        // Step 1: Atomic fetch or create.
        let { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Handle case where profile doesn't exist (new user)
        if (error && error.code === 'PGRST116') {
          const defaultHabits = ['session', 'workout', 'meditation', 'sleep', 'supplements', 'rlt', 'mood'];
          const defaultGoals = { mind: 20, move: 10000 };

          const newProfileData: ProfileInsert = {
              id: user.id,
              favorites: [],
              custom_stacks: [],
              activity_log: [],
              tracked_habits: defaultHabits,
              user_goals: defaultGoals,
              custom_activities: [],
              pro_access_expires_at: null,
            };

          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert(newProfileData)
            .select()
            .single();

          if (insertError) {
            throw insertError; // If creation fails, we have a critical problem.
          }

          profile = newProfile; // Use the newly created profile data.
        } else if (error) {
          // Any other error is a real problem.
          throw error;
        }
        
        // At this point, `profile` is guaranteed to be non-null.
        // Step 2: Hydrate local state from the guaranteed profile.
        if (profile) {
            setFavorites(profile.favorites || []);
            setCustomStacks(profile.custom_stacks || []);
            setActivityLog(profile.activity_log || []);
            setTrackedHabits(profile.tracked_habits || ['session', 'workout', 'meditation', 'sleep', 'supplements', 'rlt', 'mood']);
            setUserGoals(profile.user_goals || { mind: 20, move: 10000 });
            setCustomActivities(profile.custom_activities || []);
            setProAccessExpiresAt(profile.pro_access_expires_at ? new Date(profile.pro_access_expires_at).getTime() : null);
        }

      } catch (e) {
        console.error("Failed to bootstrap user data:", e);
        // Reset to a clean state on critical failure
        setFavorites([]); setCustomStacks([]); setActivityLog([]);
      } finally {
        // Step 3: Guaranteed to run, ensuring the app never gets stuck.
        setIsUserDataLoading(false);
        bootstrapInProgress.current = false;
      }
    };

    bootstrapUserData();
  }, [user, isAuthInitializing]);
  
  // --- Data Syncing ---
  const syncEnabled = user && !isUserDataLoading;

  useEffect(() => {
    if (syncEnabled) {
      const timer = setTimeout(() => {
        const sync = async () => {
          const { error } = await supabase.from('profiles').update({ favorites }).eq('id', user.id);
          if (error) console.error("Network error syncing favorites:", error.message || error);
        };
        sync();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [favorites, syncEnabled, user]);

  useEffect(() => {
    if (syncEnabled) {
      const timer = setTimeout(() => {
        const sync = async () => {
          const { error } = await supabase.from('profiles').update({ custom_stacks: customStacks }).eq('id', user.id);
          if (error) console.error("Network error syncing custom_stacks:", error.message || error);
        };
        sync();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [customStacks, syncEnabled, user]);

  useEffect(() => {
    if (syncEnabled) {
      const timer = setTimeout(() => {
         const sync = async () => {
          const { error } = await supabase.from('profiles').update({ activity_log: activityLog }).eq('id', user.id);
          if (error) console.error("Network error syncing activity_log:", error.message || error);
        };
        sync();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activityLog, syncEnabled, user]);
  
  useEffect(() => {
    if (syncEnabled) {
      const timer = setTimeout(() => {
        const sync = async () => {
          const { error } = await supabase.from('profiles').update({ tracked_habits: trackedHabits }).eq('id', user.id);
          if (error) console.error("Network error syncing tracked_habits:", error.message || error);
        };
        sync();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [trackedHabits, syncEnabled, user]);

  useEffect(() => {
    if (syncEnabled) {
      const timer = setTimeout(() => {
        const sync = async () => {
          const { error } = await supabase.from('profiles').update({ user_goals: userGoals }).eq('id', user.id);
          if (error) console.error("Network error syncing user_goals:", error.message || error);
        };
        sync();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [userGoals, syncEnabled, user]);

  useEffect(() => {
    if (syncEnabled) {
      const timer = setTimeout(() => {
        const sync = async () => {
          const { error } = await supabase.from('profiles').update({ custom_activities: customActivities }).eq('id', user.id);
          if (error) console.error("Network error syncing custom_activities:", error.message || error);
        };
        sync();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [customActivities, syncEnabled, user]);

  useEffect(() => {
    if (syncEnabled) {
      const timer = setTimeout(() => {
        const sync = async () => {
          const isoDate = proAccessExpiresAt ? new Date(proAccessExpiresAt).toISOString() : null;
          const { error } = await supabase.from('profiles').update({ pro_access_expires_at: isoDate }).eq('id', user.id);
          if (error) console.error("Network error syncing pro_access_expires_at:", error.message || error);
        };
        sync();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [proAccessExpiresAt, syncEnabled, user]);

  // --- Activities logic (moved from useActivities hook) ---

  const addCustomActivity = useCallback((name: string): TrackableActivityBase | undefined => {
    if (!name.trim()) return;
    const newActivity: TrackableActivityBase = {
      id: `custom-${name.trim().toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name: name.trim(),
      color: CUSTOM_COLORS[customActivities.length % CUSTOM_COLORS.length],
      custom: true,
    };
    setCustomActivities(prev => [...prev, newActivity]);
    setTrackedHabits(prev => [...prev, newActivity.id]); // Also add it to tracked habits
    return newActivity;
  }, [customActivities.length, setCustomActivities, setTrackedHabits]);

  const removeCustomActivity = useCallback((id: TrackableActivityId) => {
    setCustomActivities(prev => prev.filter(act => act.id !== id));
    setTrackedHabits(prev => prev.filter(habitId => habitId !== id)); // Remove from tracked habits as well
  }, [setCustomActivities, setTrackedHabits]);

  const value = {
    isUserDataLoading,
    favorites, setFavorites,
    customStacks, setCustomStacks,
    activityLog, setActivityLog,
    trackedHabits, setTrackedHabits,
    userGoals, setUserGoals,
    proAccessExpiresAt, setProAccessExpiresAt,
    customActivities, addCustomActivity, removeCustomActivity
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};

export const useUserData = (): UserDataContextType & { activities: TrackableActivity[] } => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  
  // Reconstruct the full activities list here. This keeps the core context type simple
  // while providing the hydrated list to all consumers of the hook.
  const activities = useMemo(() => {
      const hydratedCustomActivities: TrackableActivity[] = context.customActivities.map(act => ({
          ...act,
          icon: PlusCircleIcon,
      }));
      return [...TRACKABLE_ACTIVITIES, ...hydratedCustomActivities];
  }, [context.customActivities]);

  return { ...context, activities };
};