import { TrackableActivity } from './types';
import { WorkoutIcon, YogaIcon, RLTIcon, SupplementIcon, MeditationIcon, ColdIcon, SaunaIcon, FastingIcon, SunlightIcon, BrainwaveIcon, SleepIcon, DietIcon, MoodIcon, MoodHappyIcon, MoodNeutralIcon, MoodSadIcon } from './components/BohoIcons';
import type { IconProps } from './components/BohoIcons';
import type { FC } from 'react';

export const TRACKABLE_ACTIVITIES: TrackableActivity[] = [
    { id: 'session', name: 'Session', icon: BrainwaveIcon, color: '#c4b5fd' },
    { id: 'workout', name: 'Workout', icon: WorkoutIcon, color: '#fca5a5' },
    { id: 'meditation', name: 'Meditation', icon: MeditationIcon, color: '#d8b4fe' },
    { id: 'yoga', name: 'Yoga', icon: YogaIcon, color: '#93c5fd' },
    { id: 'sleep', name: 'Sleep', icon: SleepIcon, color: '#a5b4fc' },
    { id: 'mood', name: 'Mood', icon: MoodIcon, color: '#fde047' },
    { id: 'supplements', name: 'Supplements', icon: SupplementIcon, color: '#a7f3d0' },
    { id: 'diet', name: 'Diet', icon: DietIcon, color: '#fed7aa' },
    { id: 'rlt', name: 'RLT', icon: RLTIcon, color: '#f9a8d4' },
    { id: 'cold', name: 'Cold', icon: ColdIcon, color: '#a5f3fc' },
    { id: 'sauna', name: 'Sauna', icon: SaunaIcon, color: '#fdba74' },
    { id: 'fasting', name: 'Fasting', icon: FastingIcon, color: '#cbd5e1' },
    { id: 'sunlight', name: 'Sunlight', icon: SunlightIcon, color: '#fde047' },
];

type MoodOption = { icon: FC<IconProps>; color: string; };

export const MOOD_OPTIONS: Record<'happy' | 'neutral' | 'sad', MoodOption> = {
    happy: { icon: MoodHappyIcon, color: '#facc15' },
    neutral: { icon: MoodNeutralIcon, color: '#a8a29e' },
    sad: { icon: MoodSadIcon, color: '#93c5fd' },
};