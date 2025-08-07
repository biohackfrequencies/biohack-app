import React from 'react';
import { Frequency } from '../types';
import { ProBadge } from './ProBadge';
import { HeartIcon, HeartFilledIcon } from './BohoIcons';
import { useSubscription } from '../hooks/useSubscription';
import { getImageUrl } from '../services/imageService';

interface FrequencyCardProps {
  frequency: Frequency;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const FrequencyCard: React.FC<FrequencyCardProps> = ({ frequency, onSelect, isFavorite, onToggleFavorite }) => {
  const { isSubscribed } = useSubscription();
  const isLocked = frequency.premium && !isSubscribed;
  
  const imageUrl = getImageUrl(frequency.id);

  const cardStyle = {
    '--glow-color': `${frequency.colors.accent}80`,
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '192px' // h-48, reduced from 224px
  } as React.CSSProperties;

  return (
    <div className="relative group h-full">
        <button
          onClick={onSelect}
          className="w-full h-full p-4 rounded-2xl text-left transition-all duration-300 shadow-lg hover:-translate-y-1 text-white hover:shadow-[0_8px_30px_-5px_var(--glow-color)] flex flex-col justify-start"
          style={cardStyle}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent group-hover:from-black/70 transition-all duration-300 rounded-2xl"></div>
          
          <div className="relative z-10">
            <div className="grid grid-cols-[1fr,auto] items-start gap-2">
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide drop-shadow-md">{frequency.name}</h3>
                {isLocked && <ProBadge />}
            </div>
            <p className="text-base mt-1" style={{color: frequency.colors.accent}}>{frequency.range}</p>
            <p className="mt-2 text-white/90 text-sm drop-shadow-sm line-clamp-3">{frequency.description}</p>
          </div>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm text-white hover:text-red-400 hover:bg-white/40 dark:hover:bg-slate-900/40 transition-all z-20"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? <HeartFilledIcon className="w-5 h-5 text-red-500"/> : <HeartIcon className="w-5 h-5"/>}
        </button>
    </div>
  );
};