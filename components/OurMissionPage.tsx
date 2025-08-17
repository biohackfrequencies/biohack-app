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
                <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-dark-text-primary text-center">🌐 About Us</h2>
                
                <MissionSection title="Our Mission">
                    <p>
                        We believe sound is more than music — it is a key to unlocking human potential. Our mission is to provide scientifically-grounded tools that empower people to shift their frequency, transform their state of being, and live in greater alignment with their highest selves.
                    </p>
                </MissionSection>

                <MissionSection title="The Story Behind the Frequencies">
                    <p>
                        Our journey began with our founder — a DJ and sound engineer with over 25 years of experience shaping soundscapes for human emotion. What started as an art of creating moods and experiences through music became a deeper quest: understanding why sound moves us so profoundly.
                    </p>
                    <p>
                        This curiosity led us beyond the studio and into the science of bio-acoustics. Through years of exploration, research, and experimentation, we discovered how specific frequencies resonate with body, mind, and spirit. What was once an intuitive practice revealed itself as a bridge between ancient wisdom and modern science.
                    </p>
                </MissionSection>

                <MissionSection title="Our Vision">
                   <p>
                        We envision a world where sound becomes a daily tool for self-discovery, healing, and collective harmony. Where every person has the ability to tune themselves like an instrument — to reduce stress, enhance focus, expand creativity, and raise consciousness.
                    </p>
                </MissionSection>
                
                <MissionSection title="Core Values">
                    <ul>
                        <li><strong>Integrity of Sound</strong> – Every frequency is chosen with precision, respect, and authenticity.</li>
                        <li><strong>Bridging Science & Spirit</strong> – We combine measurable bio-acoustics with timeless wisdom.</li>
                        <li><strong>Accessibility for All</strong> – Tools for transformation should be intuitive and available to everyone.</li>
                        <li><strong>Transformation Through Experience</strong> – Growth comes from feeling, not theory.</li>
                        <li><strong>Collective Resonance</strong> – Individual tuning creates harmony in the greater human symphony.</li>
                    </ul>
                </MissionSection>

                <MissionSection title="Our Invitation to You">
                    <p>
                        Sound is not just something you hear. It’s something you feel — a vibration that reaches every cell, shaping your energy and your reality.
                    </p>
                    <p>
                        This app is your instrument.<br />
                        This is your invitation to explore, to experiment, and to transform.
                    </p>
                    <p className="font-semibold">
                        Welcome to the journey.<br />
                        Welcome to your frequency.
                    </p>
                </MissionSection>
            </div>
        </div>
    );
};
