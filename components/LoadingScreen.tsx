import React from 'react';
import { CelestialBrandIcon } from './BohoIcons';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#EEE8B2] to-[#96CDB0] dark:bg-dark-bg z-50">
      <div className="relative flex items-center justify-center">
        {/* Pulsing rings */}
        <div className="absolute w-48 h-48 rounded-full bg-brand-gold/30 animate-ping opacity-75"></div>
        <div className="absolute w-32 h-32 rounded-full bg-brand-gold/40 animate-ping" style={{animationDelay: '0.5s'}}></div>
        
        {/* Icon */}
        <CelestialBrandIcon className="relative w-24 h-24 text-brand-gold dark:text-dark-text-primary" />
      </div>
    </div>
  );
};

export default LoadingScreen;