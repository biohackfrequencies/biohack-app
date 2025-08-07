import React from 'react';
import { ProBadge } from './ProBadge';
import { SpatialAudioIcon } from './BohoIcons';

interface SpatialAudioControllerProps {
  isSubscribed: boolean;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  depth: number;
  onDepthChange: (value: number) => void;
  color: string;
  disabled?: boolean;
}

export const SpatialAudioController: React.FC<SpatialAudioControllerProps> = ({
  isSubscribed,
  isEnabled,
  onToggle,
  speed,
  onSpeedChange,
  depth,
  onDepthChange,
  color,
  disabled = false,
}) => {
  const isLocked = !isSubscribed;

  const handleToggle = () => {
    if (disabled) return;
    if (isLocked) {
      window.location.hash = '#/pricing';
    } else {
      onToggle(!isEnabled);
    }
  };
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSpeedChange(parseInt(e.target.value, 10));
  };
  
  const handleDepthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDepthChange(parseInt(e.target.value, 10));
  };

  const sliderStyle = {
    '--thumb-color': isEnabled && !disabled ? color : '#94a3b8'
  } as React.CSSProperties;

  return (
    <div className={`space-y-4 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <SpatialAudioIcon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">8D Spatial Audio</span>
              {!isLocked && <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">Our Signature Immersive Experience</p>}
            </div>
        </div>
        {isLocked ? (
            <div onClick={() => window.location.hash = '#/pricing'} className="cursor-pointer">
                <ProBadge />
            </div>
        ) : (
            <button
                id="panning-toggle"
                onClick={handleToggle}
                role="switch"
                aria-checked={isEnabled}
                disabled={disabled}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${disabled ? 'cursor-not-allowed' : ''}`}
                style={{'--tw-ring-color': color, backgroundColor: isEnabled && !disabled ? color : '#ccc'} as React.CSSProperties}
            >
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isEnabled && !disabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </button>
        )}
      </div>

      <div className={`space-y-3 transition-opacity ${(!isEnabled || isLocked || disabled) && 'opacity-50 cursor-not-allowed'}`}>
        <div className="grid grid-cols-[auto,1fr] items-center gap-3">
          <label htmlFor="panning-speed" className="text-sm font-semibold text-slate-600 dark:text-slate-300">Speed</label>
          <input
            id="panning-speed"
            type="range"
            min="0"
            max="100"
            value={speed}
            onChange={handleSpeedChange}
            disabled={!isEnabled || isLocked || disabled}
            className="w-full mobile-slider"
            style={sliderStyle}
          />
        </div>
        <div className="grid grid-cols-[auto,1fr] items-center gap-3">
          <label htmlFor="panning-depth" className="text-sm font-semibold text-slate-600 dark:text-slate-300">Depth</label>
          <input
            id="panning-depth"
            type="range"
            min="0"
            max="100"
            value={depth}
            onChange={handleDepthChange}
            disabled={!isEnabled || isLocked || disabled}
            className="w-full mobile-slider"
            style={sliderStyle}
          />
        </div>
      </div>
    </div>
  );
};