import React, { useState } from 'react';
import { CelestialBrandIcon, SparklesIcon, BrainwaveIcon, LayersIcon, SpatialAudioIcon, LungsIcon, SolfeggioIcon, GuidedSessionIcon, RLTIcon, WorkoutIcon, MeditationIcon } from './BohoIcons';

interface OnboardingFlowProps {
    onFinish: () => void;
}

const TOTAL_STEPS = 5;

const OnboardingStep: React.FC<{
    currentStep: number;
    stepNumber: number;
    title: string;
    description: string;
    children: React.ReactNode;
}> = ({ currentStep, stepNumber, title, description, children }) => {
    const isActive = currentStep === stepNumber;
    return (
        <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="animate-fade-in-up" style={{ animationDelay: `${0.2}s` }}>
                    {children}
                </div>
                <h2 className="text-3xl font-display font-bold mt-6 animate-fade-in-up" style={{ color: 'var(--onboarding-title-color)', animationDelay: `${0.3}s` }}>
                    {title}
                </h2>
                <p className="mt-2 max-w-sm mx-auto animate-fade-in-up" style={{ color: 'var(--onboarding-desc-color)', animationDelay: `${0.4}s` }}>
                    {description}
                </p>
            </div>
        </div>
    );
};

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onFinish }) => {
    const [currentStep, setCurrentStep] = useState(1);

    const handleNext = () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // By applying the 'dark' class and a dark gradient background, we ensure high contrast for text and controls.
    return (
        <div 
            className="fixed inset-0 dark z-50 flex flex-col items-center justify-between p-4 sm:p-8"
            style={{ background: 'linear-gradient(125deg, #081B1B, #203B37, #5A8F76)' }}
        >
            <div className="w-full max-w-md h-full flex flex-col justify-center relative">
                <OnboardingStep currentStep={currentStep} stepNumber={1} title="Welcome to Biohack Frequencies" description="Your journey into the science and soul of sound begins now. Let's explore your new toolkit.">
                    <CelestialBrandIcon className="w-32 h-32 text-brand-gold" />
                </OnboardingStep>
                
                <OnboardingStep currentStep={currentStep} stepNumber={2} title="Your Harmonic Dashboard" description="This is your daily snapshot. Track your goals with Activity Rings, log habits with a single tap, and discover personalized AI insights.">
                    <div className="w-56 h-56 flex items-center justify-center bg-white/10 dark:bg-dark-surface/30 rounded-full shadow-lg border border-white/20 dark:border-dark-border/50 relative p-4">
                       <div className="absolute w-full h-full rounded-full border-4 border-dashed border-brand-sage/50 animate-spin-slow"></div>
                       <div className="relative grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white/20 dark:bg-dark-bg/40 rounded-xl backdrop-blur-sm shadow-md"><WorkoutIcon className="w-10 h-10 text-rose-400"/></div>
                            <div className="p-3 bg-white/20 dark:bg-dark-bg/40 rounded-xl backdrop-blur-sm shadow-md"><MeditationIcon className="w-10 h-10 text-purple-400"/></div>
                            <div className="p-3 bg-white/20 dark:bg-dark-bg/40 rounded-xl backdrop-blur-sm shadow-md"><RLTIcon className="w-10 h-10 text-pink-400"/></div>
                            <div className="p-3 bg-white/20 dark:bg-dark-bg/40 rounded-xl backdrop-blur-sm shadow-md"><BrainwaveIcon className="w-10 h-10 text-teal-400"/></div>
                       </div>
                    </div>
                </OnboardingStep>

                <OnboardingStep currentStep={currentStep} stepNumber={3} title="The Sound Library" description="Explore 140+ protocols. From scientifically-backed Brainwave Entrainment to ancient Solfeggio tones, find the perfect frequency for any intention.">
                     <div className="w-56 h-56 p-4 bg-white/10 dark:bg-dark-surface/30 rounded-xl shadow-lg border border-white/20 dark:border-dark-border/50 grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-center rounded-lg bg-white/20 dark:bg-dark-bg/40 backdrop-blur-sm shadow-inner"><BrainwaveIcon className="w-10 h-10 text-purple-400"/></div>
                        <div className="flex items-center justify-center rounded-lg bg-white/20 dark:bg-dark-bg/40 backdrop-blur-sm shadow-inner"><SolfeggioIcon className="w-10 h-10 text-amber-400"/></div>
                        <div className="flex items-center justify-center rounded-lg bg-white/20 dark:bg-dark-bg/40 backdrop-blur-sm shadow-inner"><GuidedSessionIcon className="w-10 h-10 text-emerald-400"/></div>
                        <div className="flex items-center justify-center rounded-lg bg-white/20 dark:bg-dark-bg/40 backdrop-blur-sm shadow-inner"><LayersIcon className="w-10 h-10 text-sky-400"/></div>
                    </div>
                </OnboardingStep>
                
                <OnboardingStep currentStep={currentStep} stepNumber={4} title="The Player Experience" description="Customize sessions with frequency layering, our signature 8D Spatial Audio, and a built-in breathing guide. Headphones recommended!">
                    <div className="w-56 h-56 p-4 bg-white/10 dark:bg-dark-surface/30 rounded-full shadow-lg border border-white/20 dark:border-dark-border/50 flex items-center justify-center">
                        <div className="relative flex items-center justify-center w-40 h-40">
                            <LayersIcon className="w-16 h-16 text-sky-400 animate-pulse" style={{animationDelay: '0.5s'}} />
                            <SpatialAudioIcon className="absolute w-28 h-28 text-purple-400 animate-pulse" />
                            <LungsIcon className="absolute w-10 h-10 text-cyan-300 animate-pulse" style={{animationDelay: '1s'}} />
                        </div>
                    </div>
                </OnboardingStep>

                <OnboardingStep currentStep={currentStep} stepNumber={5} title="You're All Set!" description="Your harmonic blueprint is ready to be explored. We're excited to have you on this journey.">
                    <div className="w-32 h-32 flex items-center justify-center bg-brand-gold/20 rounded-full">
                         <SparklesIcon className="w-20 h-20 text-brand-gold" />
                    </div>
                </OnboardingStep>

            </div>
            
            <div className="w-full max-w-md flex flex-col items-center gap-4">
                 <div className="flex justify-center gap-2">
                    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                        <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${currentStep === i + 1 ? 'bg-brand-gold' : 'bg-slate-400/50 dark:bg-slate-600'}`} />
                    ))}
                </div>
                <div className="flex w-full gap-2">
                    {currentStep > 1 && (
                        <button onClick={handleBack} className="flex-1 py-3 bg-slate-200/50 dark:bg-dark-surface/50 hover:bg-slate-200 dark:hover:bg-dark-surface font-semibold text-slate-700 dark:text-dark-text-secondary rounded-lg transition-colors">
                            Back
                        </button>
                    )}
                    {currentStep < TOTAL_STEPS ? (
                         <button onClick={handleNext} className="flex-1 py-3 bg-brand-gold text-white font-bold rounded-lg shadow hover:brightness-90 transition-all">
                            Next
                        </button>
                    ) : (
                        <button onClick={onFinish} className="flex-1 py-3 bg-brand-gold text-white font-bold rounded-lg shadow hover:brightness-90 transition-all">
                           Get Started
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};