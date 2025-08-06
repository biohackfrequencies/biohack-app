import React from 'react';
import { BrainwaveIcon } from './BohoIcons';
import { getImageUrl } from '../services/imageService';

export const LibraryCtaCard: React.FC = () => {
    const imageUrl = getImageUrl('library-cta');

    return (
        <div
            className="relative group p-6 rounded-3xl shadow-lg transition-all duration-300 overflow-hidden
            hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-[0_8px_30px_-5px_var(--glow-color)]"
            style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                '--glow-color': '#93c5fd40'
            } as React.CSSProperties}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 group-hover:from-black/70 transition-all duration-300"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                    <BrainwaveIcon className="w-10 h-10 text-white/90" />
                    <div>
                        <h3 className="text-2xl font-display font-bold text-white drop-shadow-md">Sound Library</h3>
                        <p className="text-sm text-white/90 drop-shadow-sm">Explore protocols for focus, sleep, & more.</p>
                    </div>
                </div>
                <button
                    onClick={() => window.location.hash = '#/library'}
                    className="w-full py-2 bg-white/20 backdrop-blur-sm text-white font-bold rounded-lg shadow hover:bg-white/30 transition-all"
                >
                    Explore Now &rarr;
                </button>
            </div>
        </div>
    );
};