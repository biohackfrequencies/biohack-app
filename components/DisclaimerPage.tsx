
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
                <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-dark-text-primary text-center">Legal Disclaimer</h2>
                <p className="mt-4 text-center text-slate-600 dark:text-dark-text-secondary">
                    Please read the following disclaimer carefully before using the Biohack Frequencies application ("the App"). Your use of the App constitutes your full agreement to this disclaimer.
                </p>

                <DisclaimerSection title="Not Medical Advice">
                    <p>
                        The content and services provided by the App, including all text, graphics, images, audio, and information, are for informational, educational, and entertainment purposes only. The App is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
                    </p>
                    <p>
                        Never disregard professional medical advice or delay in seeking it because of something you have read, heard, or experienced on the App. The App is not a medical device.
                    </p>
                </DisclaimerSection>

                <DisclaimerSection title="Consult Your Physician">
                    <p>
                        Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Do not start or stop any treatment or wellness protocol based on information from the App without first consulting your healthcare provider. This is especially important if you are pregnant, have a pacemaker, are prone to seizures, or have any other serious medical condition.
                    </p>
                </DisclaimerSection>
                
                <DisclaimerSection title="AI-Generated Content">
                    <p>
                        The AI Wellness Agent and AI Insight features generate content based on patterns in your data and general wellness principles. This content is for informational and educational purposes only and should not be considered medical advice. The AI does not have a medical background and its suggestions are not a substitute for consultation with a qualified healthcare professional.
                    </p>
                </DisclaimerSection>
                
                <DisclaimerSection title="Data & Privacy">
                    <p>
                        The App may request permission to access data from services like Apple Health or Google Health Connect to provide personalized insights. This data is processed on your device and sent to our AI service for analysis in an anonymized format. We are committed to protecting your privacy. We do not sell your personal health data.
                    </p>
                </DisclaimerSection>

                <DisclaimerSection title="Specific Wellness Protocols">
                   <p>
                        Protocols with names suggesting specific outcomes (e.g., 'Metabolic Harmony', 'Vision Restoration') are designed to support overall wellness and create a conducive environment for the body's natural processes. They are not intended to diagnose, treat, cure, or prevent any disease or medical condition.
                    </p>
                </DisclaimerSection>

                <DisclaimerSection title="No Guaranteed Outcomes">
                    <p>
                        While the principles of neural entrainment and bio-resonance are based on scientific studies, individual results may vary. We make no claims, representations, or guarantees that you will achieve any specific outcome from using the App. The effects of sound therapy are highly individual and depend on numerous factors.
                    </p>
                </DisclaimerSection>

                <DisclaimerSection title="Assumption of Risk">
                    <p>
                        You voluntarily assume any and all risks, known or unknown, associated with your use of the App. You agree that Biohack Frequencies, its owners, employees, and affiliates will not be held liable for any direct, indirect, consequential, or special damages that may result from the use of, or the inability to use, the materials and services on this App.
                    </p>
                </DisclaimerSection>

                 <DisclaimerSection title="Use of Headphones">
                    <p>
                        For protocols using Binaural Beats or 8D Spatial Audio, headphones are required for the intended effect. Please ensure your volume is set to a comfortable level to prevent hearing damage. Do not use the App while driving, operating heavy machinery, or performing any other tasks that require your full attention.
                    </p>
                </DisclaimerSection>

            </div>
        </div>
    );
};