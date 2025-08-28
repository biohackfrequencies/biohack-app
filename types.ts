

export type SoundGenerationMode = 'PURE' | 'BINAURAL' | 'ISOCHRONIC' | 'AMBIENCE' | 'SPLIT_BINAURAL';

export enum BenefitCategory {
  HEALING = 'Healing',
  COGNITIVE = 'Cognitive',
  RELAXATION = 'Relaxation',
  WELLNESS = 'Wellness',
  AMBIENCE = 'Ambience',
  SPIRITUAL = 'Spiritual',
  SESSION = 'Session',
}

export type CategoryId = 'brainwaves' | 'solfeggio' | 'angel' | 'rife' | 'noise' | 'celestial' | 'guided' | 'elements' | 'codex' | 'kabbalah';

export type ColorTheme = {
  primary: string;
  secondary: string;
  accent: string;
};

export interface Frequency {
  id: string;
  name: string;
  range: string;
  baseFrequency: number;
  binauralFrequency: number;
  leftFrequency?: number;
  rightFrequency?: number;
  description: string;
  category: BenefitCategory;
  categoryId: CategoryId;
  defaultMode: SoundGenerationMode;
  availableModes?: SoundGenerationMode[];
  colors: ColorTheme;
  premium?: boolean;
  isFeatured?: boolean;
  subCategory?: string;
  // Optional fields for Harmonic Elements
  atomicNumber?: number;
  materialUses?: string;
  biologicalAssociation?: string;
  energeticAssociation?: string;
  sacredGeometry?: string;
  planetaryAssociation?: string;
  zodiacAssociation?: string;
  row?: number;
}

export interface HistoryItem {
  id: string;
  name: string;
  type: 'frequency' | 'session' | 'stack';
  href: string;
  lastPlayed: number;
}

export interface SessionStep {
  title: string;
  description: string;
  duration: number; // in seconds
  frequencyId: string;
  layerFrequencyId?: string;
  layer3FrequencyId?: string; // For Elemental Mixtures
}

export interface GuidedSession {
  id: string;
  title: string;
  description: string;
  steps: SessionStep[];
  colors: ColorTheme;
  advice?: string;
  premium?: boolean;
  categoryId: CategoryId;
  isFeatured?: boolean;
  subCategory?: string;
}

export type CustomStack = {
  id: string;
  title: string;
  description: string;
  steps: SessionStep[];
  colors: ColorTheme;
  advice?: string;
  premium?: boolean;
  isFeatured?: boolean;
  categoryId: 'guided';
  subCategory?: string;
  isMixture?: boolean; // Flag for Elemental Mixtures
};

export type PlayableItem = Frequency | GuidedSession | CustomStack;

export type BreathingPattern = {
  name: string;
  pattern: (number | string)[]; // [duration, phase, duration, phase, ...]
};

export const BREATHING_PATTERNS: BreathingPattern[] = [
    { name: 'Box Breathing', pattern: [4, 'Inhale', 4, 'Hold', 4, 'Exhale', 4, 'Hold'] },
    { name: '4-7-8 Relax', pattern: [4, 'Inhale', 7, 'Hold', 8, 'Exhale'] },
    { name: 'Coherent Breathing', pattern: [5.5, 'Inhale', 5.5, 'Exhale'] },
];

export type TrackableActivityId = string;

// A base type with only JSON-serializable properties, safe for DB storage.
export type TrackableActivityBase = {
    id: TrackableActivityId;
    name: string;
    color: string;
    custom?: boolean;
};

export type LogDetail = {
    name?: string;
    duration?: number; // in minutes or hours for sleep
    notes?: string;
    sleepQuality?: number; // 1-5 stars
    moodValue?: 'happy' | 'neutral' | 'sad';
};

export type ActivityLogItem = {
    id: string;
    activityId: TrackableActivityId;
    timestamp: number;
    details?: LogDetail;
};

export type UserGoals = {
  mind: number; // in minutes
  move: number; // in steps
};

export type HealthDataSummary = {
    hrv?: number; // Heart Rate Variability in ms
    rhr?: number; // Resting Heart Rate in bpm
    sleep?: {
        total: number; // in hours
        deep: number; // in hours
        rem: number; // in hours
    };
};

export type OuraData = {
    readinessScore?: number; // 0-100
    sleepScore?: number; // 0-100
    bodyTemperature?: number; // +/- degrees from baseline
};

export type FitbitData = {
    activeZoneMinutes?: number;
    steps?: number;
    sleepScore?: number;
};

export type CalendarEvent = {
    title: string;
    startTime: string; // ISO string
    endTime: string; // ISO string
    isFocusBlock?: boolean;
};

export type CgmData = {
    currentGlucose?: number; // mg/dL
    trend?: 'up' | 'down' | 'flat';
};

export type IntegratedDataSummary = {
    oura?: OuraData;
    fitbit?: FitbitData;
    calendar?: CalendarEvent[];
    cgm?: CgmData;
};

// Type for Harmonic Elements feature
export interface HarmonicElement {
  id: string;
  name: string;
  code: string;
  frequency: number;
  row: number;
  col: number;
  description: string;
  atomicNumber: number;
  materialUses: string;
  biologicalAssociation: string;
  energeticAssociation: string;
  sacredGeometry: string;
  planetaryAssociation?: string;
  zodiacAssociation?: string;
}

// Type for Codex Mod-24 feature
export interface CodexNode {
  modulus: number;
  note: string;
  frequency: number;
  archetype: string;
  tag: string;
  geometry: string;
  color: string;
}

// Types for Harmonic Influence Map
export interface HarmonicInfluenceNode extends CodexNode {
    modulus: number;
    guidance: string;
}

export interface HarmonicInfluenceMap {
    coreBlueprint: HarmonicInfluenceNode;
    yearlyModulation: HarmonicInfluenceNode;
    monthlyOverlay: HarmonicInfluenceNode;
    dailyResonance: HarmonicInfluenceNode;
    suggestedPath: string[];
    suggestedPathModuli: number[];
}

export interface CodexReflection {
  id: string;
  timestamp: number;
  intention: string;
  title: string;
  transmission: string;
  recommendedSessionId: string;
  sourceSessionId?: string;
  imageData?: string;
}


// Type for Supabase 'profiles' table row
export type ProfileRow = {
  id: string;
  favorites: string[];
  // FIX: Use `any` for complex JSONB columns to prevent Supabase type inference issues.
  // Type safety is maintained by casting on data retrieval.
  custom_stacks: any;
  activity_log: any;
  tracked_habits: TrackableActivityId[];
  // FIX: Use `any` for complex JSONB columns to prevent Supabase type inference issues.
  user_goals: any;
  custom_activities: any;
  codex_reflections: any;
  pro_access_expires_at: string | null;
  ai_credits_remaining?: number;
  ai_credits_reset_at?: string | null;
  api_requests?: number[];
};

export interface AppContentData {
    categories: Record<CategoryId, { title: string; description:string; colors: ColorTheme; premium?: boolean; }>;
    guided_sessions: GuidedSession[];
    initial_frequencies: Frequency[];
    featured_candidates: string[];
    inspirational_quotes: { quote: string; author: string; }[];
}


export type ProfileInsert = {
  id: string;
  favorites?: string[];
  // FIX: Use `any` for complex JSONB columns to prevent Supabase type inference issues.
  custom_stacks?: any;
  activity_log?: any;
  tracked_habits?: TrackableActivityId[];
  // FIX: Use `any` for complex JSONB columns to prevent Supabase type inference issues.
  user_goals?: any;
  custom_activities?: any;
  codex_reflections?: any;
  pro_access_expires_at?: string | null;
  ai_credits_remaining?: number;
  ai_credits_reset_at?: string | null;
  api_requests?: number[];
};

export type ProfileUpdate = {
  favorites?: string[];
  // FIX: Use `any` for complex JSONB columns to prevent Supabase type inference issues.
  custom_stacks?: any;
  activity_log?: any;
  tracked_habits?: TrackableActivityId[];
  // FIX: Use `any` for complex JSONB columns to prevent Supabase type inference issues.
  user_goals?: any;
  custom_activities?: any;
  codex_reflections?: any;
  pro_access_expires_at?: string | null;
  ai_credits_remaining?: number;
  ai_credits_reset_at?: string | null;
  api_requests?: number[];
};

// FIX: Moved Database type from supabaseClient.ts to be shared.
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