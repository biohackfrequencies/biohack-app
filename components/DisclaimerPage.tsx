
import React, { useState, useEffect } from 'react';
import { BackIcon } from './BohoIcons';

const DisclaimerSection: React.FC<{
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

export const DisclaimerPage: React.FC = () => {
    const [backLink, setBackLink] = useState('#/');

    useEffect(() => {
        const returnTo = sessionStorage.getItem('returnTo');
        // Ensure we have a valid hash and it's not the disclaimer page itself
        if (returnTo && returnTo.startsWith('#/')) {
            setBackLink(returnTo);
        }
    }, []);

    const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.hash = backLink;
        // Clean up session storage after use for cleaner subsequent navigation
        if (sessionStorage.getItem('returnTo')) {
            sessionStorage.removeItem('returnTo');
        }
    };
    
    return (
        <div className="animate-fade-in max-w-3xl mx-auto space-y-8">
            <a href={backLink} onClick={handleBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-dark-text-muted dark:hover:text-dark-text-primary transition-colors">
                <BackIcon className="w-6 h-6" />
                <span className="font-semibold">Back</span>
            </a>

            <div className="p-6 sm:p-8 rounded-2xl shadow-lg bg-white/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-lg">
                <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-dark-text-primary text-center">Disclaimer & Terms of Use</h2>
                <p className="mt-4 text-center text-slate-600 dark:text-dark-text-secondary">
                    This application, including all sound protocols, frequencies, harmonic charts, and related content, is designed for personal exploration, education, and wellness support.
                </p>

                <DisclaimerSection title="Not Medical Advice">
                    <p>
                        The information and sound experiences provided are not a substitute for professional medical advice, diagnosis, or treatment. Nothing within the app should be interpreted as prescribing, diagnosing, or curing any condition.
                    </p>
                </DisclaimerSection>

                <DisclaimerSection title="Personal Responsibility">
                    <p>
                        By using this app, you acknowledge that all outcomes are subjective, experiential, and may vary for each individual. You accept full responsibility for your well-being and choices.
                    </p>
                </DisclaimerSection>
                
                <DisclaimerSection title="Consult a Professional">
                    <p>
                        If you have any health concerns, medical conditions, or are pregnant, always consult with a qualified healthcare provider before using sound-based practices.
                    </p>
                </DisclaimerSection>

                <DisclaimerSection title="No Guarantees">
                   <p>
                        While the app is designed with care and based on research in acoustics, harmonics, and wellness practices, results cannot be guaranteed. The app is offered as a tool for personal growth and exploration.
                    </p>
                </DisclaimerSection>

                <DisclaimerSection title="Limitation of Liability">
                    <p>
                        The creators, developers, and partners of this app disclaim any liability for damages, injuries, or adverse effects, direct or indirect, resulting from use of the app.
                    </p>
                </DisclaimerSection>

                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="font-semibold text-center text-slate-700 dark:text-dark-text-secondary">
                        By continuing to use the app, you agree to these terms and conditions.
                    </p>
                </div>
            </div>
        </div>
    );
};
