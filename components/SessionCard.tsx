import React, { useMemo } from 'react';
import { GuidedSession, CustomStack, Frequency } from '../types';
import { ProBadge } from './ProBadge';
import { HeartIcon, HeartFilledIcon } from './BohoIcons';
import { getImageUrl } from '../services/imageService';

interface SessionCardProps {
    session: GuidedSession | CustomStack;
    onSelect: () => void;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    isLocked: boolean;
    allFrequencies: Frequency[];
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onSelect, isFavorite, onToggleFavorite, isLocked, allFrequencies }) => {
    const imageUrl = getImageUrl(session.id);

    const cardStyle = {
        '--glow-color': `${session.colors.accent}80`,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '160px'
    } as React.CSSProperties;

    const totalDuration = session.steps.reduce((sum, step) => sum + step.duration, 0);
    const durationInMinutes = Math.round(totalDuration / 60);
    
    const frequencyString = useMemo(() => {
        if (!allFrequencies) return '';
        const uniqueIds = [...new Set(session.steps.flatMap(step => [step.frequencyId, step.layerFrequencyId]).filter(Boolean) as string[])];
        if (uniqueIds.length === 0) return '';
        
        const displayIds = uniqueIds.slice(0, 2);
        
        const freqRanges = displayIds.map(id => {
            const freq = allFrequencies.find(f => f.id === id);
            return freq ? freq.range : '';
        }).filter(Boolean);
        
        let text = freqRanges.join(' & ');
        if (uniqueIds.length > 2) {
            text += '...';
        }
        return text;
    }, [session.steps, allFrequencies]);

    return (
      <div className="relative group h-full">
        <button
          onClick={onSelect}
          className="w-full h-full p-3 rounded-2xl text-left transition-all duration-300 shadow-lg hover:-translate-y-1 text-white hover:shadow-[0_8px_30px_-5px_var(--glow-color)] flex flex-col justify-start"
          style={cardStyle}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent group-hover:from-black/70 transition-all duration-300 rounded-2xl"></div>
          <div className="relative z-10">
            <div className="grid grid-cols-[1fr,auto] items-start gap-2">
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white tracking-wide drop-shadow-md">{session.title}</h3>
                {isLocked && <ProBadge />}
            </div>
            <p className="text-sm mt-1" style={{color: session.colors.accent}}>{durationInMinutes} min • {frequencyString}</p>
            <p className="mt-2 text-white/90 text-xs drop-shadow-sm line-clamp-2">{session.description}</p>
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
}
