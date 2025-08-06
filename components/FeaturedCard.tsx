import React from 'react';
import { Frequency, GuidedSession } from '../types';
import { SparklesIcon } from './BohoIcons';
import { getImageUrl } from '../services/imageService';

interface FeaturedCardProps {
  item: Frequency | GuidedSession;
}

export const FeaturedCard: React.FC<FeaturedCardProps> = ({ item }) => {
  const isSession = 'steps' in item;
  const itemName = isSession ? item.title : item.name;
  
  const imageUrl = getImageUrl(item.id);

  const { colors, description } = item;

  const handleSelect = () => {
    if (isSession) {
      window.location.hash = `#/session/${item.id}`;
    } else {
      window.location.hash = `#/player/${item.id}`;
    }
  };

  const cardStyle = {
    background: `url(${imageUrl})`,
    borderColor: `${colors.accent}40`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <section>
      <div 
        className="relative p-6 rounded-2xl border overflow-hidden text-center flex flex-col items-center shadow-lg justify-center"
        style={cardStyle}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent transition-all duration-300 rounded-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm mb-3 mx-auto max-w-max">
              <SparklesIcon className="w-5 h-5" style={{ color: colors.accent }} />
              <span className="text-sm font-bold" style={{ color: colors.accent }}>Free This Week</span>
          </div>
          <h3 className="text-3xl font-display font-bold text-white drop-shadow-md">{itemName}</h3>
          <p className="mt-2 text-white/90 max-w-xl mx-auto drop-shadow-sm line-clamp-2">{description}</p>
          <button 
            onClick={handleSelect} 
            className="mt-4 px-6 py-2 bg-white/90 dark:bg-slate-800/50 text-slate-800 font-bold rounded-full shadow-lg hover:bg-white dark:hover:bg-slate-700 transition-transform hover:scale-105 focus:outline-none focus:ring-4"
            style={{
              color: colors.accent,
              '--tw-ring-color': colors.accent
            } as React.CSSProperties}
          >
            Try Now &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};