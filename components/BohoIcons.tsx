import React from 'react';

export interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

export const AlchemyIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 10 L 12 30 L 36 30 Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22 h 24" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 38 A 12 12 0 0 0 24 14" strokeOpacity="0.6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 38 A 12 12 0 0 1 24 14" strokeOpacity="0.6" />
    </svg>
);


export const AtomIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <ellipse cx="24" cy="24" rx="20" ry="8" />
        <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(60 24 24)" />
        <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(120 24 24)" />
        <circle cx="24" cy="24" r="3" fill="currentColor" />
    </svg>
);
export const ElementIcon = AtomIcon;


export const ShareIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.0" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 100-2.186m0 2.186c-.18-.324-.283-.696-.283-1.093s.103-.77.283 1.093m0 2.186l-9.566-5.314" />
    </svg>
);


export const SettingsIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <circle cx="24" cy="24" r="6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 14v-4m0 26v-4m10-10h4m-28 0h4m7.07-7.07l2.83-2.83m-14.14 14.14l2.83-2.83m14.14-8.48l-2.83 2.83m-8.48 14.14l-2.83 2.83" />
    </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <circle cx="24" cy="24" r="18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 18v12" />
        <circle cx="24" cy="14" r="1.5" fill="currentColor" />
    </svg>
);

export const SchumannIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <circle cx="24" cy="24" r="6" fill="currentColor" fillOpacity="0.1" />
        <circle cx="24" cy="24" r="12" strokeOpacity="0.7" />
        <circle cx="24" cy="24" r="18" strokeOpacity="0.4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 6 v-2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 44 v-2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 24 h-2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M38 24 h2" />
    </svg>
);


export const SparklesIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 8 L 24 12" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 40 L 24 36" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 24 L 8 24" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M40 24 L 36 24" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 15.5 L 18 18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M32.5 32.5 L 30 30" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 32.5 L 18 30" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M32.5 15.5 L 30 18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 12 L 18 10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M30 38 L 29 36" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 36 L 18 38" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M30 10 L 29 12" />
    </svg>
);

export const PathfinderIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 2C12.95 2 4 10.95 4 22s8.95 20 20 20 20-8.95 20-20S35.05 2 24 2z" strokeOpacity="0.3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M30 18l-6 12-6-12 6-12 6 12z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 14v-4m0 28v-4m10-10h4M10 24h-4" />
        <path d="M18 18 l -2 -2" strokeLinecap="round" />
        <path d="M32 32 l -2 -2" strokeLinecap="round" />
    </svg>
);


export const CelestialBrandIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg fill="none" viewBox="0 0 100 100" stroke="currentColor" strokeWidth="2" className={className} style={style} aria-hidden="true">
    {/* Sun */}
    <circle cx="50" cy="50" r="10" />
    <g transform="translate(50,50)">
      <path strokeLinecap="round" d="M0 -13 v-6" />
      <path strokeLinecap="round" d="M0 13 v6" />
      <path strokeLinecap="round" d="M-13 0 h-6" />
      <path strokeLinecap="round" d="M13 0 h6" />
    </g>

    {/* Crescent Moon */}
    <path d="M50 22 A 28 28 0 1 0 50 78" />

    {/* Stars */}
    <path d="M22 28 l 1.5 -3 1.5 3 -1.5 3 z" />
    <path d="M78 72 l 1.5 -3 1.5 3 -1.5 3 z" />
    <path d="M25 75 l 1 -2 1 2 -1 2 z" />
  </svg>
);

export const GuidedSessionIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <circle cx="24" cy="24" r="7" />
        <path strokeLinecap="round" d="M24 4v4" />
        <path strokeLinecap="round" d="M24 40v4" />
        <path strokeLinecap="round" d="M9.86 9.86l2.82 2.82" />
        <path strokeLinecap="round" d="M35.32 35.32l2.82 2.82" />
        <path strokeLinecap="round" d="M4 24h4" />
        <path strokeLinecap="round" d="M40 24h4" />
        <path strokeLinecap="round" d="M9.86 38.14l2.82-2.82" />
        <path strokeLinecap="round" d="M35.32 12.68l2.82-2.82" />
    </svg>
);


export const BrainwaveIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 38c-7.73 0-14-6.27-14-14S16.27 10 24 10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 10c4.47 0 8.45 2.13 11 5.39" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 24h-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M38 24h-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.8 15.2C17.6 13.6 16 12.8 14 12.8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M33.4 33.4c-1.2 1.2-2.8 2-4.4 2.4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 31c-2.8-1.2-5-3.8-6-7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M32 18c.8 2.4 1 5 0 7.4" />
    </svg>
);

export const SolfeggioIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 10v22c0 3.31 2.69 6 6 6s6-2.69 6-6V10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 10h-4c-1.1 0-2 .9-2 2v0c0 1.1.9 2 2 2h4" />
        <path strokeLinecap="round" strokeLinejoin="round"d="M30 10h4c1.1 0 2 .9 2 2v0c0 1.1-.9 2-2 2h-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 38v-2" />
    </svg>
);

export const AngelIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 18c0-5.52 4.48-10 10-10s10 4.48 10 10c0 2.21-.71 4.26-1.91 5.91" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 28s4-4 12-4 12 4 12 4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 34s4-4 12-4 12 4 12 4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 8v-2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M32.09 23.91C30.95 25.4 29.28 26.5 27.29 27.05" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 23.91C17.05 25.4 18.72 26.5 20.71 27.05" />
    </svg>
);

export const CelestialIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
    <circle cx="24" cy="24" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M24 14 A 16 16 0 0 0 24 34" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M24 14 A 16 16 0 0 1 24 34" />
    <path d="M10 12 L 12 10" strokeLinecap="round" />
    <path d="M38 36 L 36 38" strokeLinecap="round" />
    <path d="M14 38 L 12 36" strokeLinecap="round" />
    <path d="M38 12 L 36 10" strokeLinecap="round" />
  </svg>
);

export const RifeIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 12l10.39 6v12L24 36l-10.39-6v-12L24 12z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.61 18L24 24l10.39-6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 36V24" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 21l-4.39-2.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M30 21l4.39-2.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.61 30l10.39-6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M34.39 30L24 24" />
    </svg>
);

export const IsochronicIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
    <circle cx="24" cy="24" r="4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M24 10 V 14" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M24 38 V 34" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 24 H 14" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M38 24 H 34" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.07 14.07 l 2.83 2.83" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M33.93 33.93 l -2.83 -2.83" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.07 33.93 l 2.83 -2.83" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M33.93 14.07 l -2.83 2.83" />
  </svg>
);

export const BeautyIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M34 26c0 5.52-4.48 10-10 10s-10-4.48-10-10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 26c0-5.52 4.48-10 10-10s10 4.48 10 10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M34 26c-1-1.33-2.5-3-4-4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 22c-1.5 1-3 2.67-4 4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M24 16v-4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M30 18c.67.5 1.28 1.08 1.82 1.74" />
  </svg>
);

export const NoiseIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 24c4-6 8-6 12 0s8 6 12 0" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 16c4 6 8 6 12 0s8-6 12 0" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 32c4-6 8-6 12 0s8 6 12 0" />
  </svg>
);

export const StackIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 40V8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12h16" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 20h16" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 28h16" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 36h16" />
    </svg>
);

export const LayeredSoundIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <circle cx="20" cy="24" r="14" strokeOpacity="0.9" />
        <circle cx="28" cy="24" r="14" strokeOpacity="0.9" />
    </svg>
);

export const FocusIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <path d="M24 12 L 18 24 L 24 36 L 30 24 Z" strokeOpacity="0.9" />
        <circle cx="24" cy="24" r="18" strokeOpacity="0.4" />
    </svg>
);

export const SpatialAudioIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <circle cx="24" cy="24" r="4" strokeOpacity="0.9"/>
        <path strokeLinecap="round" d="M24 10 A 14 8 0 0 1 24 38" strokeOpacity="0.7"/>
        <path strokeLinecap="round" d="M24 10 A 14 8 0 0 0 24 38" strokeOpacity="0.7"/>
        <path strokeLinecap="round" d="M12 24 A 6 12 0 0 0 36 24" strokeOpacity="0.4"/>
        <path strokeLinecap="round" d="M12 24 A 6 12 0 0 1 36 24" strokeOpacity="0.4"/>
    </svg>
);

export const LungsIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 38c-4.42 0-8-3.58-8-8V18c0-2.21.9-4.21 2.34-5.66" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M28 38c4.42 0 8-3.58 8-8V18c0-2.21-.9-4.21-2.34-5.66" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 10v28" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 10c-4 0-6 2-6 4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 10c4 0 6 2 6 4" />
    </svg>
);

export const HeartFilledIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
);
  
export const HeartIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.0} stroke="currentColor" className={className} style={style}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

export const AppleHealthIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="currentColor" viewBox="0 0 24 24" className={className} style={style}>
      <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z" />
    </svg>
);

export const GoogleHealthIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
        <path d="M11.726 5.075C10.038 3.42 7.561 3.42 5.873 5.075L5.834 5.114C4.146 6.769 4.146 9.189 5.834 10.844L11.981 16.883L12.019 16.844L18.166 10.844C19.854 9.189 19.854 6.769 18.166 5.114C16.478 3.458 13.922 3.458 12.234 5.114L11.981 5.362L11.726 5.075Z" fill="#EA4335"/>
        <path d="M12.019 16.844L11.981 16.883L5.834 10.844C4.146 9.189 4.146 6.769 5.834 5.114L5.873 5.075C4.185 6.73 4.185 9.15 5.873 10.805L11.981 16.883L12.019 16.844Z" fill="#FBBC05"/>
        <path d="M18.166 5.114C19.854 6.769 19.854 9.189 18.166 10.844L12.019 16.844V16.883L18.127 10.805C19.815 9.15 19.815 6.73 18.127 5.075C16.439 3.42 13.962 3.42 12.274 5.075L11.981 5.362L12.234 5.114C13.922 3.458 16.478 3.458 18.166 5.114Z" fill="#4285F4"/>
        <path d="M11.981 5.362L12.274 5.075C13.962 3.42 16.439 3.42 18.127 5.075C19.815 6.73 19.815 9.15 18.127 10.805L11.981 16.883V5.362Z" fill="#34A853"/>
    </svg>
);


export const ClockIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.0} stroke="currentColor" className={className} style={style}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const PlayIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M8 5v14l11-7z" />
    </svg>
);
  
export const PauseIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
);

export const BackIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

export const VolumeIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.0} stroke="currentColor" className={className} style={style}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);

export const LayersIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.0} stroke="currentColor" className={className} style={style}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

export const CheckmarkCircleIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.0} stroke="currentColor" className={className} style={style}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const XCircleIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.0} stroke="currentColor" className={className} style={style}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const CreditCardIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.0} stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 21z" />
    </svg>
);

export const VisaIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg viewBox="0 0 192.756 192.756" className={className} style={style} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
    <g fillRule="evenodd" clipRule="evenodd">
      <path fill="#ffffff" d="M0 0h192.756v192.756H0V0z"/>
      <path d="M189.922 50.809c0-8.986-4.67-13.444-13.729-13.444H16.562c-4.528 0-7.854 1.203-10.048 3.679-2.476 2.477-3.68 5.661-3.68 9.765v91.138c0 4.104 1.204 7.217 3.68 9.764 2.548 2.477 5.803 3.68 10.048 3.68h159.631c9.059 0 13.729-4.527 13.729-13.443V50.809zm-13.729-11.321c7.5 0 11.322 3.821 11.322 11.321v91.138c0 7.57-3.822 11.32-11.322 11.32H16.562c-3.609 0-6.368-1.061-8.42-3.184-2.123-2.053-3.184-4.883-3.184-8.137V50.809c0-7.5 3.75-11.321 11.604-11.321h159.631z" fill="#315881"/>
      <path d="M17.835 44.724c-3.042 0-4.953.495-6.014 1.557-.92 1.203-1.344 3.184-1.344 6.085v19.741h171.802V52.366c0-5.165-2.549-7.642-7.643-7.642H17.835z" fill="#315881"/>
      <path d="M10.477 140.107c0 5.234 2.476 7.924 7.358 7.924h156.801c5.094 0 7.643-2.689 7.643-7.924v-19.742H10.477v19.742z" fill="#dfa43b"/>
      <path d="M67.367 80.528c0 .92-.142 1.627-.495 2.123l-12.383 21.582-.779-26.323H33.898l6.651 3.184c1.91 1.203 2.901 2.759 2.901 4.741l1.839 27.951h9.694l23.21-35.876H66.306c.707.637 1.061 1.627 1.061 2.618zM147.467 78.971l.777-1.062h-12.1c.424.424.566.637.566.778-.143.565-.426.92-.566 1.344l-17.619 32.124c-.424.566-.85 1.062-1.344 1.629h9.977l-.496-1.062c0-.92.496-2.617 1.557-5.023l2.123-3.963h10.26c.426 3.326.709 6.086.85 8.139l-.85 1.91h12.383l-1.84-2.689-3.678-32.125zm-7.36 19.742h-7.359l6.297-12.1 1.062 12.1zM109.539 76.07c-3.82 0-7.076 1.062-9.977 3.184-3.185 1.84-4.741 4.175-4.741 7.077 0 3.326 1.132 6.227 3.396 8.42l6.865 4.74c2.477 1.77 3.68 3.326 3.68 4.742 0 1.344-.639 2.547-1.84 3.467-1.203.92-2.549 1.344-4.246 1.344-2.477 0-6.722-1.768-12.595-5.023v6.58c4.599 2.76 9.058 4.176 13.373 4.176 4.105 0 7.572-1.133 10.545-3.68 3.184-2.336 4.74-5.094 4.74-8.137 0-2.549-1.133-4.883-3.68-7.36l-6.582-4.741c-2.191-1.769-3.395-3.326-3.395-4.528 0-2.759 1.627-4.175 4.953-4.175 2.264 0 5.59 1.274 10.047 3.963l1.346-6.864c-3.752-2.124-7.643-3.185-11.889-3.185zM83.217 113.785c-.142-1.486-.425-2.83-.567-4.246l8.987-29.011 2.123-2.618H80.811c.142.637.283 1.486.425 2.123 0 .637 0 1.416-.142 2.123l-8.986 28.728-1.84 2.902h12.949v-.001z" fill="#315881"/>
    </g>
  </svg>
);

export const MastercardIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg viewBox="0 -139.5 750 750" className={className} style={style} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
    <g fillRule="nonzero">
      <rect fill="#000000" x="0" y="0" width="750" height="471" rx="40" />
      <path d="M434.008334,235.5 C434.008334,334.641668 353.6375,415.004169 254.499999,415.004169 C155.362498,415.004169 74.9999973,334.641668 74.9999973,235.5 C74.9999973,136.366666 155.362498,55.9958324 254.499999,55.9958324 C353.6375,55.9958324 434.008334,136.366666 434.008334,235.5" fill="#D9222A" />
      <path d="M495.491667,55.9958324 C449.1125,55.9958324 406.85,73.5916658 374.991666,102.462499 C368.504166,108.345833 362.445833,114.7 356.866666,121.458333 L393.133333,121.458333 C398.091667,127.4875 402.658333,133.829166 406.816667,140.470833 L343.183333,140.470833 C339.370833,146.575 335.908333,152.916666 332.841666,159.479167 L417.154167,159.479167 C420.033333,165.6375 422.575,171.975 424.754167,178.483333 L325.241666,178.483333 C323.166666,184.675 321.420833,191.0125 320.024999,197.491667 L429.966667,197.491667 C432.604167,209.741667 434.008334,222.458334 434.008334,235.5 C434.008334,255.433334 430.754167,274.612501 424.754167,292.520834 L325.241666,292.520834 C327.416666,299.033334 329.958333,305.375001 332.837499,311.529168 L417.154167,311.529168 C414.079167,318.091668 410.625,324.433335 406.808333,330.541668 L343.183333,330.541668 C347.3375,337.170835 351.9125,343.520835 356.866666,349.537501 L393.125,349.537501 C387.554167,356.308335 381.491666,362.670835 374.995833,368.550002 C406.854167,397.416668 449.1125,415.004169 495.491667,415.004169 C594.629168,415.004169 675.000002,334.641668 675.000002,235.5 C675.000002,136.370833 594.629168,55.9958324 495.491667,55.9958324" fill="#EE9F2D" />
      <path d="M651.075002,335.558335 C651.075002,332.358335 653.666669,329.758335 656.870835,329.758335 C660.075002,329.758335 662.666669,332.358335 662.666669,335.558335 C662.666669,338.758335 660.075002,341.358335 656.870835,341.358335 C653.666669,341.358335 651.075002,338.758335 651.075002,335.558335 Z M656.870835,339.966668 C659.304169,339.966668 661.279169,337.991668 661.279169,335.558335 C661.279169,333.120835 659.304169,331.154168 656.870835,331.154168 C654.433335,331.154168 652.466669,333.120835 652.466669,335.558335 C652.466669,337.991668 654.433335,339.966668 656.870835,339.966668 Z M656.087502,338.108335 L654.900002,338.108335 L654.900002,333.012501 L657.050002,333.012501 C657.500002,333.012501 657.958335,333.012501 658.354169,333.266668 C658.766669,333.545835 659.000002,334.037501 659.000002,334.545835 C659.000002,335.116668 658.662502,335.650001 658.116669,335.858335 L659.054169,338.108335 L657.737502,338.108335 L656.958335,336.091668 L656.087502,336.091668 L656.087502,338.108335 Z M656.087502,335.216668 L656.745835,335.216668 C656.991669,335.216668 657.250002,335.237501 657.470835,335.116668 C657.666669,334.991668 657.766669,334.758335 657.766669,334.533335 C657.766669,334.337501 657.645835,334.112501 657.479169,334.016668 C657.270835,333.887501 656.941669,333.916668 656.720835,333.916668 L656.087502,333.916668 L656.087502,335.216668 Z" fill="#000000" />
      <path d="M212.587498,255.154167 C210.541665,254.916667 209.641665,254.854167 208.237498,254.854167 C197.191665,254.854167 191.599998,258.641667 191.599998,266.120834 C191.599998,270.733334 194.329165,273.666667 198.587498,273.666667 C206.524998,273.666667 212.245832,266.108334 212.587498,255.154167 Z M226.758332,288.150001 L210.612498,288.150001 L210.983332,280.475001 C206.058332,286.541668 199.487498,289.425001 190.558332,289.425001 C179.995832,289.425001 172.754165,281.175001 172.754165,269.195834 C172.754165,251.170834 185.349998,240.654167 206.970832,240.654167 C209.179165,240.654167 212.012498,240.854167 214.912498,241.225001 C215.516665,238.783334 215.674998,237.7375 215.674998,236.425 C215.674998,231.516667 212.279165,229.6875 203.174998,229.6875 C193.641665,229.579167 185.779165,231.958334 182.549998,233.020834 C182.754165,231.791667 185.249998,216.3625 185.249998,216.3625 C194.962498,213.516667 201.366665,212.445834 208.574998,212.445834 C225.308332,212.445834 234.170832,219.958334 234.154165,234.158334 C234.187499,237.9625 233.558332,242.658334 232.574999,248.829167 C230.883332,259.558334 227.254165,282.545834 226.758332,288.150001 Z" fill="#000000" />
      <polyline fill="#000000" points="164.599998 288.150001 145.112498 288.150001 156.274998 218.154167 131.349998 288.150001 118.070831 288.150001 116.429164 218.554167 104.695831 288.150001 86.4541641 288.150001 101.691664 197.095833 129.712498 197.095833 131.412498 248.062501 148.504165 197.095833 179.670832 197.095833 164.599998 288.150001" />
      <path d="M519.575001,255.154167 C517.537501,254.916667 516.633334,254.854167 515.233334,254.854167 C504.191667,254.854167 498.600001,258.641667 498.600001,266.120834 C498.600001,270.733334 501.325001,273.666667 505.583334,273.666667 C513.520834,273.666667 519.245834,266.108334 519.575001,255.154167 Z M533.758334,288.150001 L517.612501,288.150001 L517.979168,280.475001 C513.054168,286.541668 506.479167,289.425001 497.558334,289.425001 C486.991667,289.425001 479.758334,281.175001 479.758334,269.195834 C479.758334,251.170834 492.345834,240.654167 513.970834,240.654167 C516.179168,240.654167 519.008334,240.854167 521.904168,241.225001 C522.508334,238.783334 522.666668,237.7375 522.666668,236.425 C522.666668,231.516667 519.275001,229.6875 510.170834,229.6875 C500.637501,229.579167 492.783334,231.958334 489.541667,233.020834 C489.745834,231.791667 492.250001,216.3625 492.250001,216.3625 C501.962501,213.516667 508.362501,212.445834 515.562501,212.445834 C532.304168,212.445834 541.166668,219.958334 541.150001,234.158334 C541.183334,237.9625 540.554168,242.658334 539.570834,248.829167 C537.887501,259.558334 534.250001,282.545834 533.758334,288.150001 Z" fill="#000000" />
      <path d="M313.366666,287.025001 C308.033333,288.704168 303.874999,289.425001 299.366666,289.425001 C289.404166,289.425001 283.966666,283.700001 283.966666,273.158334 C283.824999,269.887501 285.399999,261.279167 286.637499,253.420834 C287.762499,246.504167 295.087499,202.891667 295.087499,202.891667 L314.458333,202.891667 L312.195833,214.1 L323.895833,214.1 L321.254166,231.895834 L309.512499,231.895834 C307.262499,245.979167 304.058333,263.520834 304.020833,265.845834 C304.020833,269.662501 306.058333,271.329167 310.691666,271.329167 C312.912499,271.329167 314.633333,271.104167 315.945833,270.629167 L313.366666,287.025001" fill="#000000" />
      <path d="M372.758333,286.425001 C366.104166,288.458334 359.683333,289.441668 352.879166,289.425001 C331.195833,289.404168 319.891666,278.079167 319.891666,256.391667 C319.891666,231.079167 334.270833,212.445834 353.791666,212.445834 C369.7625,212.445834 379.9625,222.879167 379.9625,239.241667 C379.9625,244.670834 379.2625,249.970834 377.575,257.454167 L338.999999,257.454167 C337.695833,268.195834 344.570833,272.670834 355.8375,272.670834 C362.770833,272.670834 369.025,271.241667 375.979166,268.008334 L372.758333,286.425001 Z M361.870833,242.525001 C361.979166,240.983334 363.925,229.308334 352.858333,229.308334 C346.6875,229.308334 342.274999,234.0125 340.479166,242.525001 L361.870833,242.525001 Z" fill="#000000" />
      <path d="M238.445832,237.508334 C238.445832,246.875001 242.987499,253.333334 253.287499,258.183334 C261.179166,261.891667 262.399999,262.991667 262.399999,266.354167 C262.399999,270.970834 258.920832,273.054167 251.208332,273.054167 C245.395832,273.054167 239.987499,272.145834 233.749999,270.133334 C233.749999,270.133334 231.187499,286.454168 231.070832,287.233334 C235.499999,288.200001 239.449999,289.095834 251.349999,289.425001 C271.912499,289.425001 281.408332,281.595834 281.408332,264.675001 C281.408332,254.500001 277.433332,248.529167 267.670832,244.041667 C259.499999,240.291667 258.562499,239.454167 258.562499,235.995834 C258.562499,231.991667 261.799999,229.95 268.099999,229.95 C271.924999,229.95 277.149999,230.358334 282.099999,231.0625 L284.874999,213.8875 C279.829166,213.0875 272.179166,212.445834 267.724999,212.445834 C245.924999,212.445834 238.379165,223.833334 238.445832,237.508334" fill="#000000" />
      <path d="M467.533334,214.391667 C472.945834,214.391667 477.991667,215.8125 484.945834,219.3125 L488.133334,199.55 C485.279167,198.429167 475.229167,191.85 466.716667,191.85 C453.675,191.85 442.65,198.320834 434.895834,209 C423.5875,205.254167 418.9375,212.825 413.2375,220.366667 L408.175,221.545834 C408.558333,219.0625 408.904167,216.595834 408.7875,214.1 L390.891667,214.1 C388.445833,237.016667 384.1125,260.229167 380.720833,283.175001 L379.8375,288.150001 L399.333333,288.150001 C402.5875,267.008334 404.370833,253.470834 405.454167,244.308334 L412.795833,240.225001 C413.891667,236.145834 417.325,234.766667 424.2125,234.933334 C423.3125,239.766667 422.829167,244.850001 422.829167,250.116667 C422.829167,274.341667 435.9,289.425001 456.879167,289.425001 C462.283334,289.425001 466.920834,288.712501 474.100001,286.766668 L477.529167,266.008334 C471.070834,269.187501 465.770834,270.683334 460.970834,270.683334 C449.641667,270.683334 442.7875,262.320834 442.7875,248.500001 C442.7875,228.45 452.983334,214.391667 467.533334,214.391667" fill="#000000" />
      <polyline fill="#FFFFFF" points="170.208331 282.741668 150.716665 282.741668 161.887498 212.754167 136.962498 282.741668 123.679164 282.741668 122.037498 213.154167 110.304164 282.741668 92.0624975 282.741668 107.299998 191.7 135.320831 191.7 136.108331 248.062501 155.012498 191.7 185.279165 191.7 170.208331 282.741668" />
      <path d="M632.520835,197.095833 L628.200002,223.404167 C622.870835,216.391667 617.145835,211.316667 609.587502,211.316667 C599.754168,211.316667 590.804168,218.770834 584.945835,229.741667 C576.787501,228.05 568.350001,225.179167 568.350001,225.179167 L568.345835,225.245834 C569.004168,219.1125 569.266668,215.370834 569.208335,214.1 L551.308334,214.1 C548.870834,237.016667 544.537501,260.229167 541.150001,283.175001 L540.258334,288.150001 L559.750001,288.150001 C562.383335,271.054167 564.400001,256.858334 565.883335,245.600001 C572.541668,239.583334 575.875001,234.333334 582.604168,234.683334 C579.625001,241.887501 577.879168,250.187501 577.879168,258.700001 C577.879168,277.212501 587.245835,289.425001 601.412502,289.425001 C608.554168,289.425001 614.033335,286.962501 619.379168,281.254168 L618.466668,288.137501 L636.900002,288.137501 L651.741669,197.095833 L632.520835,197.095833 Z M608.150002,271.037501 C601.516668,271.037501 598.166668,266.129167 598.166668,256.441667 C598.166668,241.887501 604.437502,231.566667 613.279168,231.566667 C619.975002,231.566667 623.600002,236.670834 623.600002,246.075001 C623.600002,260.754167 617.229168,271.037501 608.150002,271.037501 Z" fill="#FFFFFF" />
      <path d="M493.745834,194.15 L490.554167,213.916667 C483.604167,210.420834 478.554167,208.995834 473.145834,208.995834 C458.595834,208.995834 448.395834,223.054167 448.395834,243.104167 C448.395834,256.925001 455.254167,265.283334 466.579167,265.283334 C471.379167,265.283334 476.675001,263.791667 483.133334,260.608334 L479.712501,281.358334 C472.529167,283.316668 467.895834,284.029168 462.4875,284.029168 C441.5125,284.029168 428.4375,268.945834 428.4375,244.720834 C428.4375,212.170834 446.495834,189.420833 472.325001,189.420833 C480.833334,189.420833 490.887501,193.029167 493.745834,194.15" fill="#FFFFFF" />
      <path d="M525.187501,249.758334 C523.145834,249.520834 522.245834,249.458334 520.841668,249.458334 C509.800001,249.458334 504.208334,253.245834 504.208334,260.725001 C504.208334,265.329167 506.937501,268.270834 511.191668,268.270834 C519.129168,268.270834 524.854168,260.712501 525.187501,249.758334 Z M539.366668,282.741668 L523.216668,282.741668 L523.587501,275.079167 C518.662501,281.133334 512.087501,284.029168 503.166667,284.029168 C492.604167,284.029168 485.362501,275.779167 485.362501,263.800001 C485.362501,245.766667 497.958334,235.258334 519.575001,235.258334 C521.787501,235.258334 524.616668,235.458334 527.516668,235.829167 C528.116668,233.3875 528.279168,232.341667 528.279168,231.020834 C528.279168,226.1125 524.887501,224.291667 515.783334,224.291667 C506.250001,224.183334 498.387501,226.5625 495.154167,227.6125 C495.358334,226.3875 497.858334,210.975 497.858334,210.975 C507.566667,208.116667 513.975001,207.045834 521.175001,207.045834 C537.916668,207.045834 546.779168,214.5625 546.758334,228.75 C546.791668,232.570834 546.162501,237.2625 545.179168,243.425001 C543.495834,254.150001 539.854168,277.150001 539.366668,282.741668 Z" fill="#FFFFFF" />
      <path d="M318.974999,281.620834 C313.637499,283.300001 309.479166,284.029168 304.974999,284.029168 C295.012499,284.029168 289.574999,278.304167 289.574999,267.762501 C289.437499,264.483334 291.012499,255.883334 292.249999,248.025001 C293.370832,241.100001 300.695832,197.491667 300.695832,197.491667 L320.062499,197.491667 L317.804166,208.704167 L327.745833,208.704167 L325.099999,226.491667 L315.124999,226.491667 C312.874999,240.583334 309.662499,258.112501 309.629166,260.441667 C309.629166,264.270834 311.670833,265.925001 316.299999,265.925001 C318.520833,265.925001 320.237499,265.708334 321.554166,265.233334 L318.974999,281.620834" fill="#FFFFFF" />
      <path d="M378.366666,281.029167 C371.716666,283.062501 365.2875,284.041668 358.4875,284.029168 C336.804166,284.008334 325.499999,272.683334 325.499999,250.995834 C325.499999,225.675 339.879166,207.045834 359.4,207.045834 C375.370833,207.045834 385.570833,217.475 385.570833,233.845834 C385.570833,239.279167 384.870833,244.579167 383.1875,252.058334 L344.6125,252.058334 C343.308333,262.800001 350.183333,267.279167 361.45,267.279167 C368.379166,267.279167 374.6375,265.845834 381.5875,262.604167 L378.366666,281.029167 Z M367.475,237.116667 C367.591666,235.579167 369.533333,223.9 358.4625,223.9 C352.295833,223.9 347.883333,228.616667 346.0875,237.116667 L367.475,237.116667 Z" fill="#FFFFFF" />
      <path d="M244.054165,232.1125 C244.054165,241.479167 248.595832,247.929167 258.895832,252.787501 C266.787499,256.495834 268.008332,257.600001 268.008332,260.958334 C268.008332,265.575001 264.524999,267.658334 256.820832,267.658334 C251.004165,267.658334 245.595832,266.750001 239.354165,264.737501 C239.354165,264.737501 236.799999,281.058334 236.683332,281.837501 C241.104165,282.804168 245.058332,283.687501 256.958332,284.029168 C277.524999,284.029168 287.016666,276.200001 287.016666,259.283334 C287.016666,249.104167 283.045832,243.133334 273.279166,238.645834 C265.112499,234.8875 264.166666,234.0625 264.166666,230.6 C264.166666,226.6 267.412499,224.541667 273.708332,224.541667 C277.529166,224.541667 282.754166,224.9625 287.712499,225.666667 L290.483332,208.4875 C285.441666,207.6875 277.791666,207.045834 273.337499,207.045834 C251.533332,207.045834 243.991665,218.425 244.054165,232.1125" fill="#FFFFFF" />
      <path d="M642.508335,282.741668 L624.070835,282.741668 L624.987502,275.850001 C619.641668,281.566668 614.162502,284.029168 607.020835,284.029168 C592.854168,284.029168 583.491668,271.816667 583.491668,253.304167 C583.491668,228.675 598.012502,207.9125 615.200002,207.9125 C622.758335,207.9125 628.479168,211 633.804168,218.008334 L638.129169,191.7 L657.350002,191.7 L642.508335,282.741668 Z M613.762502,265.633334 C622.837502,265.633334 629.212502,255.350001 629.212502,240.679167 C629.212502,231.275 625.583335,226.170834 618.887502,226.170834 C610.050002,226.170834 603.770835,236.4875 603.770835,251.045834 C603.770835,260.733334 607.129168,265.633334 613.762502,265.633334 Z" fill="#FFFFFF" />
      <path d="M556.920835,208.704167 C554.479168,231.620834 550.145834,254.833334 546.758334,277.766667 L545.866668,282.741668 L565.358335,282.741668 C572.329168,237.466667 574.016668,228.625 584.945835,229.733334 C586.687501,220.466667 589.929168,212.35 592.345835,208.254167 C584.183335,206.554167 579.625001,211.166667 573.658335,219.929167 C574.129168,216.141667 574.991668,212.4625 574.820835,208.704167 L556.920835,208.704167" fill="#FFFFFF" />
      <path d="M396.5,208.704167 C394.054167,231.620834 389.720833,254.833334 386.333333,277.766667 L385.445833,282.741668 L404.945833,282.741668 C411.908333,237.466667 413.591667,228.625 424.516667,229.733334 C426.266667,220.466667 429.508334,212.35 431.916667,208.254167 C423.7625,206.554167 419.2,211.166667 413.2375,219.929167 C413.708333,216.141667 414.5625,212.4625 414.4,208.704167 L396.5,208.704167" fill="#FFFFFF" />
      <path d="M651.066669,276.945834 C651.066669,273.733334 653.662502,271.145834 656.862502,271.145834 C660.066669,271.145834 662.658335,273.733334 662.658335,276.945834 C662.658335,280.141667 660.066669,282.741668 656.862502,282.741668 C653.662502,282.741668 651.066669,280.141667 651.066669,276.945834 Z M656.862502,281.350001 C659.300002,281.350001 661.266669,279.375001 661.266669,276.945834 C661.266669,274.512501 659.300002,272.537501 656.862502,272.537501 C654.429169,272.537501 652.454169,274.512501 652.454169,276.945834 C652.454169,279.375001 654.429169,281.350001 656.862502,281.350001 Z M656.079169,279.479167 L654.891669,279.479167 L654.891669,274.395834 L657.045835,274.395834 C657.491669,274.395834 657.954169,274.404167 658.341669,274.650001 C658.758335,274.933334 658.995835,275.416667 658.995835,275.925001 C658.995835,276.500001 658.658335,277.037501 658.108335,277.241667 L659.050002,279.479167 L657.729169,279.479167 L656.950002,277.470834 L656.079169,277.470834 L656.079169,279.479167 Z M656.079169,276.600001 L656.733335,276.600001 C656.979169,276.600001 657.245835,276.616667 657.462502,276.500001 C657.658335,276.375001 657.758335,276.137501 657.758335,275.912501 C657.758335,275.725001 657.641669,275.500001 657.470835,275.387501 C657.266669,275.270834 656.929169,275.304167 656.708335,275.304167 L656.079169,275.304167 L656.079169,276.600001 Z" fill="#FFFFFF" />
    </g>
  </svg>
);

export const AmexIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg fill="currentColor" viewBox="0 -6 36 36" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">
    <path d="M33.6 0H2.4C1.075 0 0 1.075 0 2.4v19.2C0 22.925 1.075 24 2.4 24h31.2c1.325 0 2.4-1.075 2.4-2.4V2.4C36 1.075 34.925 0 33.6 0zM22.181 8.242h2.262l-2.074 7.518h-2.25l2.062-7.518zm-4.945.723l1.812 6.795h-2.227l-1.8-6.795h2.215zm-4.332 6.795h-2.223l1.246-4.527-1.246-2.268h2.21l.656 1.277.652-1.277h2.215l-1.246 2.268 1.246 4.527h-2.227l-.652-1.293-.652 1.293zM28.4 15.76h-2.984v-1.12l1.656-2.227c.43-.578.691-1.008.691-1.488 0-.543-.395-.875-.98-.875-.57 0-1.14.285-1.59.59l-.332-1.855c.535-.305 1.457-.59 2.191-.59.98 0 1.57.414 2.016 1.137.445.723.238 1.68-.387 2.508l-1.238 1.656h1.949v1.8z" />
  </svg>
);

// --- START OF NEW ICONS ---
// Social Icons
export const YouTubeIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
      <path fillRule="evenodd" d="M19.8 6.2a2.4 2.4 0 00-1.7-1.7C16.5 4 12 4 12 4s-4.5 0-6.1.5a2.4 2.4 0 00-1.7 1.7c-.5 1.6-.5 5.8-.5 5.8s0 4.2.5 5.8a2.4 2.4 0 001.7 1.7c1.6.5 6.1.5 6.1.5s4.5 0 6.1-.5a2.4 2.4 0 001.7-1.7c.5-1.6.5-5.8.5-5.8s0-4.2-.5-5.8zm-8.3 8.3V7.5l5.2 3-5.2 3z" clipRule="evenodd" />
    </svg>
);

export const InstagramIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);

export const GlobeIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.25 12H20.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-2.485 3-2.485 13.5 0 16.5 2.485-3 2.485-13.5 0-16.5z" />
    </svg>
);

// UI Icons
export const HomeIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.0} stroke="currentColor" className={className} style={style}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
    </svg>
);

export const XMarkIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

export const CheckmarkIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

export const LockIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.0} stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

export const UserCircleIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const OuraRingIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" />
    </svg>
);

export const CGMIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c-3.75 0-7.5-3.04-7.5-7.146 0-3.15 1.5-6.57 5.25-11.25C10.5 2.25 12 1.5 12 1.5s1.5.75 2.25 1.854c3.75 4.68 5.25 8.1 5.25 11.25C19.5 18.71 15.75 21.75 12 21.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5l1.5 1.5L15 9" />
    </svg>
);

export const ChatIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.372A.75.75 0 019 19.5v-.013c0-.387.195-.724.488-1.121a.75.75 0 01.67-.318H18a2.25 2.25 0 002.25-2.25V6.521a2.25 2.25 0 00-2.25-2.25h-4.818a.75.75 0 01-.67-.318l-1.32-2.285A.75.75 0 0010.292 1.5H9c-4.97 0-9 3.694-9 8.25z" />
    </svg>
);

export const DuplicateIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
);

export const FitbitIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="currentColor" viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
        <circle cx="12" cy="5" r="2.5" />
        <circle cx="17.5" cy="9.5" r="2.5" />
        <circle cx="6.5" cy="9.5" r="2.5" />
        <circle cx="14.5" cy="16.5" r="2.5" />
        <circle cx="9.5" cy="16.5" r="2.5" />
    </svg>
);

export const PencilIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

export const CustomizeIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
);

export const PlusCircleIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const FlameIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.0" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797A8.33 8.33 0 0112 2.25c1.153 0 2.243.3 3.224.862z" />
    </svg>
);

export const StarIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);

export const JournalIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);

export const LightbulbIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a.75.75 0 01-1.5 0c0-1.09.9-1.97 1.97-1.97s1.97.88 1.97 1.97a.75.75 0 01-1.5 0zM12 6.75A2.25 2.25 0 009.75 9v1.076c0 .54.166 1.057.465 1.498a2.25 2.25 0 013.57 0c.299-.441.465-.958.465-1.498V9A2.25 2.25 0 0012 6.75z" />
    </svg>
);

export const GiftIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25v-8.25M12 4.875A2.625 2.625 0 1012 9.75a2.625 2.625 0 000-4.875zM12 4.875c-1.373 0-2.522.69-3.235 1.765M12 4.875c1.373 0 2.522.69 3.235 1.765" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.875m-3.235 1.765L6.44 3.75m11.12 1.815l2.325-1.765" />
    </svg>
);

// Activity Icons
export const WorkoutIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5h13.5m-13.5 9h13.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5a2.25 2.25 0 01-2.25-2.25v-1.5A2.25 2.25 0 015.25 1.5h0A2.25 2.25 0 017.5 3.75v1.5A2.25 2.25 0 015.25 7.5zM18.75 7.5a2.25 2.25 0 01-2.25-2.25v-1.5A2.25 2.25 0 0118.75 1.5h0A2.25 2.25 0 0121 3.75v1.5A2.25 2.25 0 0118.75 7.5zM5.25 16.5a2.25 2.25 0 002.25 2.25h0a2.25 2.25 0 002.25-2.25v-1.5A2.25 2.25 0 005.25 10.5h0A2.25 2.25 0 003 12.75v1.5A2.25 2.25 0 005.25 16.5zM18.75 16.5a2.25 2.25 0 002.25 2.25h0a2.25 2.25 0 002.25-2.25v-1.5a2.25 2.25 0 00-2.25-2.25h0a2.25 2.25 0 00-2.25 2.25v1.5z" />
    </svg>
);

export const YogaIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6a2 2 0 100-4 2 2 0 000 4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 21c3-3 5-3 8-3s5 0 8 3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v6m-4 2h8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 21l-1-3h16l-1 3" />
    </svg>
);

export const RLTIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 18a6 6 0 100-12 6 6 0 000 12z" />
    </svg>
);

export const SupplementIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5h7.5m-7.5 3h7.5m-7.5 3h7.5m3-9l-3.375-3.375a1.125 1.125 0 00-1.591 0L4.5 12.5l-1.5 6 6-1.5 9.375-9.375a1.125 1.125 0 000-1.591z" />
    </svg>
);


export const MeditationIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8a3 3 0 100-6 3 3 0 000 6zM9 12c-3.333 0-5 2.667-5 4v1h16v-1c0-1.333-1.667-4-5-4h-6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 20h14" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17l-2 3M17 17l2 3" />
    </svg>
);

export const ColdIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M12 12l7-7M12 12l-7 7m7-7l-7-7m7 7l7 7m-7-14h.01M19.07 4.93h.01M4.93 19.07h.01M19.07 19.07h.01M4.93 4.93h.01" />
    </svg>
);

export const SaunaIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 18.75l7.5-7.5 7.5 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18" />
    </svg>
);

export const FastingIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 9h17M3.5 15h17" />
    </svg>
);

export const SunlightIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 18a6 6 0 100-12 6 6 0 000 12z" />
    </svg>
);

export const SessionIcon: React.FC<IconProps> = GuidedSessionIcon;

export const SleepIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

export const DietIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.25 22.5l-.648-1.928a2.25 2.25 0 01-1.47-1.47l-1.928-.648 1.928-.648a2.25 2.25 0 011.47-1.47l.648-1.928.648 1.928a2.25 2.25 0 011.47 1.47l1.928.648-1.928.648a2.25 2.25 0 01-1.47 1.47z" />
    </svg>
);

export const MoodIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM9 9h.01M15 9h.01M9 15h6" />
    </svg>
);

export const MoodHappyIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM9 9h.01M15 9h.01M8.25 15a4.5 4.5 0 017.5 0" />
    </svg>
);

export const MoodNeutralIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM9 9h.01M15 9h.01M9 15h6" />
    </svg>
);

export const MoodSadIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.0" stroke="currentColor" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM9 9h.01M15 9h.01M15.75 15a4.5 4.5 0 01-7.5 0" />
    </svg>
);

// Redesigned AI Icons
export const InsightIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 38c-6.627 0-12-5.373-12-12 0-4.42 2.39-8.27 6-10.47V14c0-3.31 2.69-6 6-6s6 2.69 6 6v1.53c3.61 2.2 6 6.05 6 10.47 0 6.627-5.373 12-12 12z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 38v4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 42h8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 21 l1.5 3 3-1 -1 3 3 1 -3 1 1 3 -3 -1 -1.5 3 -1.5-3 -3 1 1-3 -3-1 3-1 -1-3 3 1z" />
    </svg>
);

export const OracleIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M38 28 C38 33.523 31.941 38 24 38 C16.059 38 10 33.523 10 28 C10 22.477 16.059 18 24 18 C31.941 18 38 22.477 38 28 Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 37 L 18 41 L 22 37" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 10 L 24 14" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.07 15.07 L 21.88 17.88" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M28.93 15.07 L 26.12 17.88" />
    </svg>
);

export const TreeOfLifeIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
        <circle cx="24" cy="8" r="3"/>
        <circle cx="16" cy="18" r="3"/>
        <circle cx="32" cy="18" r="3"/>
        <circle cx="24" cy="28" r="3"/>
        <circle cx="16" cy="38" r="3"/>
        <circle cx="32" cy="38" r="3"/>
        <path strokeLinecap="round" d="M24 11v14 M16 21v14 M32 21v14 M22 9.5L18 16.5 M26 9.5L30 16.5 M18 19.5L22 26.5 M30 19.5L26 26.5 M18 36.5L22 29.5 M30 36.5L26 29.5"/>
    </svg>
);