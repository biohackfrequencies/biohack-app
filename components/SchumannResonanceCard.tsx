import React from 'react';
import { SchumannIcon } from './BohoIcons';
import { getImageUrl } from '../services/imageService';

export const SchumannResonanceCard: React.FC = () => {
  const schumannColors = { primary: "#86efac", secondary: "#bbf7d0", accent: "#4ade80" };
  const imageUrl = getImageUrl('schumann-cta');

  const handleNavigate = () => {
    // Navigate to the new free guided session
    window.location.hash = '#/session/earth-resonance-grounding';
  };

  return (
    <div
      className="relative group p-6 rounded-3xl shadow-lg transition-all duration-300 overflow-hidden text-center
      hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-[0_8px_30px_-5px_var(--glow-color)]"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '--glow-color': `${schumannColors.accent}40`
      } as React.CSSProperties}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 group-hover:from-black/80 transition-all duration-300"></div>
      <div className="relative z-10">
        <SchumannIcon className="w-12 h-12 text-white/90 mx-auto" />
        <h3 className="text-2xl font-display font-bold text-white mt-2 drop-shadow-md">Tune into Earth's Heartbeat</h3>
        <p className="text-sm text-white/90 mt-1 mb-4 drop-shadow-sm">Experience our new 15-min guided grounding protocol, featuring the 7.83 Hz Schumann Resonance. Free for all users.</p>
        <button
          onClick={handleNavigate}
          className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white font-bold rounded-full shadow-lg hover:bg-white/30 transition-transform hover:scale-105"
        >
          Listen Now
        </button>
      </div>
    </div>
  );
};