import React from 'react';

export const BreathingGuideVisualizer: React.FC<{
    phase: string;
    progress: number;
    time: number;
    color: string;
}> = ({ phase, progress, time, color }) => {
    // Optimized style to be less resource-intensive on mobile browsers
    const visualizerStyle = {
        '--glow-color': color,
        // Scale from a smaller base to reduce repaint area
        transform: `scale(${0.6 + progress * 0.4})`,
        opacity: 0.5 + progress * 0.5,
        // Hint to the browser that these properties will change, allowing for optimization
        willChange: 'transform, opacity',
    } as React.CSSProperties;

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 animate-fade-in pointer-events-none">
            {/* 
              This element is smaller (w-3/4) and uses box-shadow instead of a large
              radial gradient, which is significantly more performant.
            */}
            <div
                className="w-3/4 h-3/4 rounded-full bg-[var(--glow-color)]"
                style={{
                    ...visualizerStyle,
                    boxShadow: `0 0 80px 40px var(--glow-color)`,
                }}
            />
            <div className="absolute text-center text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                <p className="text-2xl font-bold tracking-wider uppercase drop-shadow-lg">{phase}</p>
                <p className="text-4xl font-light tabular-nums mt-1 drop-shadow-lg">{Math.ceil(time)}</p>
            </div>
        </div>
    );
};