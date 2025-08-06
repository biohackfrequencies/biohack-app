
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import type { AuthChangeEvent, AuthError, Session, User, AuthResponse, UserResponse, AuthOtpResponse } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthInitializing: boolean;
  user: User | null;
  session: Session | null;
  isPasswordRecovery: boolean;
  login: (email: string, pass: string) => Promise<AuthResponse>;
  signUp: (email: string, pass: string) => Promise<AuthResponse>;
  logout: () => Promise<{ error: AuthError | null }>;
  resendVerification: (email: string) => Promise<AuthOtpResponse>;
  sendPasswordResetEmail: (email: string) => Promise<{ data: object | null; error: AuthError | null; }>;
  updateUserPassword: (password: string) => Promise<UserResponse>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthInitializing, setIsAuthInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  
  useEffect(() => {
    // This is a robust way to handle auth state. The listener fires immediately
    // with the current session, and then on any change (login, logout, etc.).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      }
      
      // Once this listener has fired, we know the initial auth state has been determined.
      setIsAuthInitializing(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<AuthResponse> => {
    // A manual login is NOT a password recovery flow.
    setIsPasswordRecovery(false);
    const response = await supabase.auth.signInWithPassword({ email, password: pass });
    if (response.data.session) {
      setSession(response.data.session);
      setUser(response.data.session.user);
    }
    return response;
  }, []);

  const signUp = useCallback(async (email: string, pass: string) => {
    // A sign-up is NOT a password recovery flow.
    setIsPasswordRecovery(false);
    return supabase.auth.signUp({
      email,
      password: pass,
      options: {
        emailRedirectTo: 'https://biohackfrequencies.app',
      },
    });
  }, []);

  const resendVerification = useCallback(async (email: string) => {
    return supabase.auth.resend({ type: 'signup', email });
  }, []);
  
  const sendPasswordResetEmail = useCallback(async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://biohackfrequencies.app',
    });
  }, []);

  const updateUserPassword = useCallback(async (password: string) => {
    const response = await supabase.auth.updateUser({ password });
    if (!response.error) {
        // After a successful update, the recovery flow is complete.
        setIsPasswordRecovery(false);
    }
    return response;
  }, []);

  const logout = useCallback(async () => {
    // Explicit logout always ends any recovery flow.
    setIsPasswordRecovery(false);
    
    // First, sign out from Supabase
    const result = await supabase.auth.signOut();

    // After sign-out is confirmed, clear all user-specific local storage
    // This prevents data from a previous session from "leaking" to a new one
    const keysToRemove = [
        'biohack_favorites',
        'biohack_stacks',
        'biohack_activity_log',
        'biohack_course_progress',
        'biohack_tracked_habits',
        'biohack_user_goals',
        'biohack_custom_activities',
        'biohack_pro_expires',
        'iap_mock_purchased_id',
    ];
    keysToRemove.forEach((key: string) => {
        try {
            localStorage.removeItem(key);
        } catch (e: any) {
            console.error(`Failed to remove item ${key} from localStorage`, e);
        }
    });

    // Redirect and force a full page reload to ensure all state is reset
    window.location.hash = '#/'; 
    window.location.reload();

    return result;
  }, []);

  const value: AuthContextType = {
    isAuthenticated: !!user,
    isAuthInitializing,
    user,
    session,
    isPasswordRecovery,
    login,
    signUp,
    logout,
    resendVerification,
    sendPasswordResetEmail,
    updateUserPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
