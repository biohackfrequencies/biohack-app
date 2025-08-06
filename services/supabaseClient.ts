import { createClient } from '@supabase/supabase-js';
import type { ProfileRow, ProfileInsert, ProfileUpdate } from '../types';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

const supabaseUrl = 'https://nabzcphuoxqwiogswuhw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYnpjcGh1b3hxd2lvZ3N3dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMTgwOTYsImV4cCI6MjA2ODg5NDA5Nn0.hSde4LG7JkF5kMszf-BOuq4bTX6dZv0ydYqVAFYT76E';


if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});