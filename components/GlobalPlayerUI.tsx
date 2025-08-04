import React from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { PlayIcon, PauseIcon, XMarkIcon } from './BohoIcons';
import { CustomStack } from '../types';

interface GlobalPlayerUIProps {
    customStacks: CustomStack[];
}

export const GlobalPlayerUI: React.FC<GlobalPlayerUIProps> = ({ customStacks }) => {
    const player = usePlayer();
    const { isPlaying, currentlyPlayingItem, stop, pause, resume } = player;

    if (!currentlyPlayingItem) {
        return null;
    }

    const isSession = 'steps' in currentlyPlayingItem;
    const title = isSession ? currentlyPlayingItem.title : currentlyPlayingItem.name;
    const colors = currentlyPlayingItem.colors;
    
    let href = '';
    if (currentlyPlayingItem) {
        if ('steps' in currentlyPlayingItem) {
            const isCustom = customStacks.some((s: CustomStack) => s.id === currentlyPlayingItem.id);
            href = isCustom ? `#/stack/${currentlyPlayingItem.id}` : `#/session/${currentlyPlayingItem.id}`;
        } else {
            href = `#/player/${currentlyPlayingItem.id}`;
        }
    }
    
    const togglePlayPause = () => {
        if (isPlaying) {
            pause();
        } else {
            resume();
        }
    }

    const navigate = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
        e.preventDefault();
        window.location.hash = hash;
    };
    
    return (
        <div 
            className="fixed bottom-0 left-0 right-0 z-40 animate-fade-in-up"
            style={{
                background: `linear-gradient(135deg, ${colors.primary}99, ${colors.secondary}99)`,
                borderTop: `1px solid ${colors.accent}60`,
            }}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20 sm:h-16">
                    <a 
                        href={href}
                        onClick={(e) => navigate(e, href)}
                        className="flex-grow flex items-center gap-4 overflow-hidden"
                    >
                        <div className="w-12 h-12 sm:w-10 sm:h-10 rounded-md flex-shrink-0" style={{ backgroundColor: colors.accent }}>
                            {/* Visualizer could go here but might be too much for a mini player */}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-slate-800 dark:text-dark-text-primary truncate">{title}</p>
                            <p className="text-sm text-slate-600 dark:text-dark-text-secondary">Now Playing...</p>
                        </div>
                    </a>
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 ml-4">
                        <button 
                            onClick={togglePlayPause} 
                            className="w-12 h-12 flex items-center justify-center rounded-full text-white" 
                            style={{ backgroundColor: colors.accent }}
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
                        </button>
                         <button 
                            onClick={stop} 
                            className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 dark:text-dark-text-secondary bg-slate-200/50 dark:bg-dark-surface/50 hover:bg-slate-300 dark:hover:bg-dark-surface transition-colors"
                            aria-label="Stop playback"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};