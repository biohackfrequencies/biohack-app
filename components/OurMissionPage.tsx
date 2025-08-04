import React from 'react';
import { BackIcon, CelestialBrandIcon } from './BohoIcons';

const MissionSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
    <h3 className="text-xl font-display font-bold text-slate-800 dark:text-dark-text-primary">{title}</h3>
    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-dark-text-secondary leading-relaxed space-y-3 mt-2">
      {children}
    </div>
  </div>
);

export const OurMissionPage: React.FC = () => {
    const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.hash = '#/settings';
    };
    
    return (
        <div className="animate-fade-in max-w-3xl mx-auto space-y-8">
            <a href="#/settings" onClick={handleBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-dark-text-muted dark:hover:text-dark-text-primary transition-colors">
                <BackIcon className="w-6 h-6" />
                <span className="font-semibold">Back to Settings</span>
            </a>

            <div className="p-6 sm:p-8 rounded-2xl shadow-lg bg-white/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-lg">
                <CelestialBrandIcon className="w-24 h-24 text-slate-500 dark:text-purple-400 mx-auto mb-4" />
                <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-dark-text-primary text-center">Our Mission: Sound Science for Human Potential</h2>
                <p className="mt-4 text-center text-slate-600 dark:text-dark-text-secondary">
                    The Story Behind the Frequencies.
                </p>

                <MissionSection title="The Origin: An Expert's Journey">
                    <p>
                        Our story begins with our founder, a professional DJ and sound engineer whose world has revolved around sound for over 25 years. We've lived and breathed the profound impact frequency has on human emotion, learning how to shift moods and create entire experiences by controlling it. It was an art and a craft.
                    </p>
                </MissionSection>

                <MissionSection title="The Pivot to Science">
                    <p>
                        But that curiosity went deeper. Seeing how sound could help overcome personal obstacles, we knew it was more than just a feeling—it was science. This led us down a path from the studio to the laboratory, studying the real, measurable effects of specific frequencies. We made it our mission to bridge the gap between intuitive 'sound healing' and verifiable, data-driven bio-acoustics.
                    </p>
                </MissionSection>

                <MissionSection title="The Mission Statement">
                   <p>
                        This app is the result of that mission. It's not about 'new age bla bla.' It's about providing you with scientifically-grounded tools to help upgrade your own consciousness. Every protocol is chosen with the precision of a sound engineer and the passion of those who have experienced its transformative power firsthand.
                    </p>
                </MissionSection>

                <MissionSection title="Our Invitation to You">
                    <p>
                        Sound is more than just hearing; it is a feeling. It's a vibration that can resonate with every cell in your body, creating a cascade of change from the inside out. This is where the true transformation begins.
                    </p>
                    <p>
                        This app is your instrument. Our life's work is now in your hands. Explore, experiment, and feel the change for yourself. Welcome to the journey.
                    </p>
                </MissionSection>
            </div>
        </div>
    );
};