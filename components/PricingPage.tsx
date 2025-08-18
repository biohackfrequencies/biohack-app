import React, { useState } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { PathfinderIcon, SparklesIcon, BackIcon, CheckmarkCircleIcon, XCircleIcon, GiftIcon, ChevronDownIcon } from './BohoIcons';
import LoadingSpinner from './LoadingSpinner';
import { MOCK_PRODUCT_ID_ANNUAL, MOCK_PRODUCT_ID_LIFETIME, MOCK_PRODUCT_ID_MONTHLY } from '../services/iapService';
import { Capacitor } from '@capacitor/core';

interface PricingPageProps {
  onBack: () => void;
}

interface Plan {
    id: string;
    title: string;
    price: string;
    originalPrice?: string;
    numericPrice: number;
    period: string;
    isPopular: boolean;
    offer: string | null;
    description: string;
    buttonText: string;
    style: {
        bg: string;
        border: string;
        buttonClass: string;
    };
}

const AppStoreBadge: React.FC = () => (
    <button onClick={() => alert('Coming soon to the App Store!')} className="inline-block bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-md">
        <div className="flex items-center gap-2">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M15.228 6.949c.884-1.012 1.43-2.346 1.43-3.717 0-.05-.012-.1-.012-.15-.008-.066-.008-.14-.016-.217-.031-.255-.07-.517-.125-.783a5.55 5.55 0 0 0-1.203-2.285c-.5-.45-1.063-.82-1.688-1.11a5.397 5.397 0 0 0-3.328 0c-1.02.483-1.894 1.25-2.617 2.258-1.508 2.083-2.5 4.75-2.5 7.641 0 3.258 1.233 6.341 3.208 8.358.825.867 1.742 1.55 2.75 2.033.95.45 1.95.642 2.942.642.225 0 .45-.017.675-.05.017 0 .033-.008.05-.008.075-.017.15-.025.225-.042a5.52 5.52 0 0 0 2.85-1.1c.45-.333.884-.716 1.292-1.141a10.428 10.428 0 0 0 1.95-2.634c-.05.008-.1.008-.15.008-2.125 0-4.142-.85-5.65-2.383-1.642-1.667-2.659-3.9-2.659-6.308 0-2.4 1.017-4.633 2.659-6.3.3-.308.625-.591.967-.858zM15.154.009a4.843 4.843 0 0 1 3.217 1.333c.258.242.5.5.716.767a5.105 5.105 0 0 1 1.059 2.1c.05.25.092.5.116.75.017.125.025.25.042.375.016.15.025.3.025.45 0 .3-.025.6-.075.892a5.45 5.45 0 0 1-2.025 3.391 5.392 5.392 0 0 1-3.6 1.484 5.513 5.513 0 0 1-3.733-1.741c-1.3-1.45-2.092-3.3-2.092-5.258 0-1.958.8-3.817 2.092-5.275a5.508 5.508 0 0 1 3.733-1.758c.075 0 .15-.008.225-.008z"/></svg>
            <div className="text-left">
                <p className="text-xs">Download on the</p>
                <p className="text-lg font-semibold -mt-1">App Store</p>
            </div>
        </div>
    </button>
);

const GooglePlayBadge: React.FC = () => (
    <button onClick={() => alert('Coming soon to the Google Play Store!')} className="inline-block bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-md">
        <div className="flex items-center gap-3">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M21.53,10.85,3.77,1.48a1,1,0,0,0-1.3.42,1,1,0,0,0-.1.87L5.22,12,2.37,21.23a1,1,0,0,0,.1.87,1,1,0,0,0,1.3.42L21.53,13.15a1,1,0,0,0,0-1.74Z"/></svg>
            <div className="text-left">
                <p className="text-xs">GET IT ON</p>
                <p className="text-lg font-semibold -mt-1">Google Play</p>
            </div>
        </div>
    </button>
);

const PromoCodeSection: React.FC<{
    activateSubscription: (productId: string, duration?: number) => void;
}> = ({ activateSubscription }) => {
    const [promoCode, setPromoCode] = useState('');
    const [promoError, setPromoError] = useState('');
    const [promoSuccess, setPromoSuccess] = useState('');

    const handlePromoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPromoError('');
        setPromoSuccess('');

        if (promoCode.toUpperCase() === 'DEMO') {
            activateSubscription(MOCK_PRODUCT_ID_LIFETIME);
            setPromoSuccess('Success! You now have lifetime Pro access for this demo.');
        } else {
            setPromoError('Invalid promo code. Please try again.');
        }
        setPromoCode('');
    };

    return (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center justify-center gap-2">
                <GiftIcon className="w-6 h-6 text-slate-600 dark:text-dark-text-secondary" />
                <h3 className="text-lg font-semibold text-slate-700 dark:text-dark-text-primary">Have a promo code?</h3>
            </div>
            <form onSubmit={handlePromoSubmit} className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
                <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-700/50 text-center"
                />
                <button type="submit" className="px-4 py-2 rounded-md bg-slate-800 text-white font-semibold hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-800 dark:hover:bg-white transition-colors">
                    Apply
                </button>
            </form>
            {promoError && <p className="text-center text-sm text-red-500 mt-2">{promoError}</p>}
            {promoSuccess && <p className="text-center text-sm text-green-600 mt-2">{promoSuccess}</p>}
        </div>
    );
};

const FaqItem: React.FC<{
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}> = ({ question, answer, isOpen, onClick }) => (
    <div className="border-b border-slate-200 dark:border-slate-700/50">
        <button
            onClick={onClick}
            className="w-full flex justify-between items-center text-left py-4"
        >
            <span className="font-semibold text-slate-800 dark:text-dark-text-primary">{question}</span>
            <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
            <div className="pb-4 text-slate-600 dark:text-dark-text-secondary">
                <p>{answer}</p>
            </div>
        </div>
    </div>
);


const PricingPage: React.FC<PricingPageProps> = ({ onBack }) => {
  const { isSubscribed, purchaseSubscription, restoreSubscription, activateFreeSubscription } = useSubscription();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  
  const isMobile = Capacitor.isNativePlatform();

  const handlePurchase = async (productId: string) => {
    setPurchasingId(productId);
    setError(null);
    try {
      await purchaseSubscription(productId);
    } catch (err: any) {
      if (!err.isCancellation) {
          setError(err.message || 'An unexpected error occurred during purchase.');
      }
    } finally {
      setPurchasingId(null);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    setRestoreMessage(null);
    try {
        const result = await restoreSubscription();
        setRestoreMessage(result.message);
    } catch (err: any) {
        setRestoreMessage(err.message || "Failed to restore purchases.");
    } finally {
        setIsRestoring(false);
    }
  };

  const plans: Plan[] = [
    {
      id: MOCK_PRODUCT_ID_MONTHLY,
      title: 'Monthly',
      price: '$7.99',
      numericPrice: 7.99,
      period: 'per month',
      isPopular: false,
      offer: null,
      description: 'Flexible access to all Pro features, cancel anytime.',
      buttonText: 'Start Free Trial',
      style: {
          bg: 'bg-white/60 dark:bg-dark-surface/60',
          border: 'border-slate-300/50 dark:border-dark-border/50',
          buttonClass: 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900',
      }
    },
    {
      id: MOCK_PRODUCT_ID_ANNUAL,
      title: 'Annual',
      price: '$59.99',
      originalPrice: '$95.88',
      numericPrice: 59.99,
      period: 'per year',
      isPopular: true,
      offer: 'Save 40%',
      description: 'Commit for a year and get the best value.',
      buttonText: 'Start Free Trial',
      style: {
          bg: 'bg-gradient-to-br from-[#EEE8B2]/50 to-[#C18D52]/30 dark:from-dark-surface dark:to-dark-bg',
          border: 'border-brand-gold/70',
          buttonClass: 'bg-brand-gold text-white',
      }
    },
  ];

  const features = [
    { name: 'Sound Library', free: '2 Free/Category', pro: 'Unlimited' },
    { name: 'Harmonic Elements', free: true, pro: true },
    { name: 'Schumann Resonance Protocol', free: true, pro: true },
    { name: 'Guided Protocols', free: 'Limited Selection', pro: 'All Protocols' },
    { name: 'Interactive Breathwork Guide', free: true, pro: true },
    { name: 'AI Personal Insights', free: false, pro: true },
    { name: 'HealthKit / Health Connect', free: true, pro: 'Sync + AI Insights' },
    { name: 'Creator Studio', free: false, pro: true },
    { name: 'Codex Mod-24 Harmonics', free: false, pro: true },
    { name: 'Kabbalah Tree of Life', free: false, pro: true },
    { name: '8D Spatial Audio', free: false, pro: true },
    { name: 'Habit Tracking', free: '3 Habits', pro: 'Unlimited' },
    { name: 'Daily Logging', free: '5 Entries/Day', pro: 'Unlimited' },
    { name: 'Advanced Analytics', free: false, pro: true },
    { name: 'Oura, Calendar & CGM Integrations', free: false, pro: true },
  ];
  
  const faqData = [
    { question: "What's included in the 7-day free trial?", answer: "Your free trial gives you full access to all Biohack Pro features, including the AI Wellness Agent, Creator Studio, and all advanced analytics. You will not be charged until the trial period ends." },
    { question: "How do I cancel my subscription?", answer: "You can cancel your subscription at any time through your device's App Store (for iOS) or Google Play Store (for Android) subscription settings. Your Pro access will continue until the end of the current billing period." },
    { question: "Can I use my Pro account on multiple devices?", answer: "Yes! Your Pro subscription is linked to your account. Simply log in with the same email on any device (iOS, Android, or Web) to access all your Pro features and saved data." },
    { question: "What happens when my trial ends?", answer: "After your 7-day free trial, you will be automatically billed for the plan you selected (monthly or annual). If you cancel before the trial ends, you will not be charged." },
    { question: "Is my health data private?", answer: "Your privacy is our top priority. All personal health data is processed securely on your device or sent in an anonymized format for AI analysis. We do not store identifiable health data on our servers and we will never sell your data." }
  ];

  if (isSubscribed) {
      return (
        <div className="animate-fade-in max-w-2xl mx-auto text-center p-8">
            <SparklesIcon className="w-16 h-16 text-brand-gold mx-auto" />
            <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-dark-text-primary mt-4">You are a Pro Member!</h2>
            <p className="mt-2 text-slate-600 dark:text-dark-text-secondary">You have full access to all features. Thank you for your support!</p>
            <button onClick={onBack} className="mt-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-dark-text-muted dark:hover:text-dark-text-primary transition-colors mx-auto">
                <BackIcon className="w-6 h-6" />
                <span className="font-semibold">Go Back</span>
            </button>
        </div>
      )
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-12">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-dark-text-muted dark:hover:text-dark-text-primary transition-colors">
        <BackIcon className="w-6 h-6" />
        <span className="font-semibold">Back</span>
      </button>

      <div className="text-center">
        <PathfinderIcon className="w-16 h-16 text-brand-gold mx-auto" />
        <h2 className="text-4xl font-display font-bold text-slate-800 dark:text-dark-text-primary mt-4">Unlock Your Potential</h2>
        <p className="mt-2 text-slate-600 dark:text-dark-text-secondary max-w-2xl mx-auto">
          Upgrade to Pro to access our full suite of AI-powered wellness tools and advanced features. Start with a 7-day free trial.
        </p>
      </div>
      
      {error && (
        <div className="p-3 text-center bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
            {error}
        </div>
      )}
      
      {restoreMessage && (
        <div className="p-3 text-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
            {restoreMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan: Plan) => (
          <div key={plan.id} className={`relative p-6 rounded-2xl border-2 transition-transform hover:-translate-y-2 ${plan.style.bg} ${plan.isPopular ? plan.style.border : 'border-transparent'}`}>
            {plan.isPopular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-gold text-white text-xs font-bold rounded-full uppercase tracking-wider">{plan.offer}</div>}
            <h3 className="text-2xl font-bold text-slate-800 dark:text-dark-text-primary">{plan.title}</h3>
            <p className="text-sm text-slate-600 dark:text-dark-text-secondary mt-1">{plan.description}</p>
            <p className="my-6">
              <span className="text-4xl font-bold text-slate-900 dark:text-dark-text-primary">{plan.price}</span>
              <span className="text-slate-600 dark:text-dark-text-muted"> {plan.period}</span>
            </p>
            <button
                onClick={() => isMobile ? handlePurchase(plan.id) : alert("Purchases are only available on the mobile app.")}
                disabled={purchasingId !== null}
                className={`w-full py-3 rounded-lg font-bold shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:scale-100 ${plan.style.buttonClass}`}
            >
                {purchasingId === plan.id ? <LoadingSpinner /> : plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-slate-500 dark:text-dark-text-muted">
        <p>7-day free trial available for monthly and annual plans. You will not be charged until the trial period ends. Cancel anytime.</p>
        <button onClick={handleRestore} disabled={isRestoring} className="mt-2 font-semibold text-brand-gold hover:underline">
            {isRestoring ? 'Restoring...' : 'Restore Purchase'}
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-[#f0f7f4] dark:bg-[#203B37]/50 border border-[#cce3d8] dark:border-[#5A8F76]/50">
        <h3 className="text-2xl font-display font-bold text-center text-slate-800 dark:text-dark-text-primary mb-4">Compare Plans</h3>
        <div className="grid grid-cols-[1fr,auto,auto] items-center gap-x-4">
            {/* Headers */}
            <div className="font-bold text-slate-800 dark:text-dark-text-primary text-left pb-2 border-b-2 border-slate-200 dark:border-slate-700">Feature</div>
            <div className="font-bold text-slate-700 dark:text-dark-text-secondary text-center pb-2 border-b-2 border-slate-200 dark:border-slate-700">Free Plan</div>
            <div className="font-bold text-center text-brand-gold pb-2 border-b-2 border-slate-200 dark:border-slate-700">Pro Plan</div>

            {/* Rows */}
            {features.map((feature) => (
                <React.Fragment key={feature.name}>
                    <div className="py-3 text-slate-700 dark:text-dark-text-secondary font-semibold border-b border-slate-200/80 dark:border-slate-700/50">{feature.name}</div>
                    <div className="py-3 px-2 w-32 flex justify-center text-sm font-semibold text-slate-600 dark:text-dark-text-secondary text-center border-b border-slate-200/80 dark:border-slate-700/50">
                        {typeof feature.free === 'boolean' ? (feature.free ? <CheckmarkCircleIcon className="w-6 h-6 text-green-500" /> : <XCircleIcon className="w-6 h-6 text-slate-400" />) : feature.free}
                    </div>
                    <div className="py-3 px-2 w-32 flex justify-center text-sm font-bold text-brand-gold text-center border-b border-slate-200/80 dark:border-slate-700/50">
                        {typeof feature.pro === 'boolean' ? (feature.pro ? <CheckmarkCircleIcon className="w-6 h-6 text-green-500" /> : <XCircleIcon className="w-6 h-6 text-slate-400" />) : feature.pro}
                    </div>
                </React.Fragment>
            ))}
        </div>
      </div>
      
      <div className="p-8 rounded-2xl bg-white/60 dark:bg-dark-surface/60 border border-slate-200/50 dark:border-dark-border/50">
        <h3 className="text-2xl font-display font-bold text-center text-slate-800 dark:text-dark-text-primary">Frequently Asked Questions</h3>
        <div className="mt-6 max-w-lg mx-auto">
            {faqData.map((faq, index) => (
                <FaqItem 
                    key={index} 
                    question={faq.question} 
                    answer={faq.answer} 
                    isOpen={openFaq === index}
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                />
            ))}
        </div>
      </div>
      
      <PromoCodeSection activateSubscription={activateFreeSubscription} />

      {!isMobile && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/50 text-center">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-dark-text-primary">Get the Full Experience on Mobile</h3>
            <p className="text-sm text-slate-600 dark:text-dark-text-secondary mt-2">Download our app to subscribe and unlock Pro features on all your devices.</p>
            <div className="flex justify-center items-center gap-4 mt-4">
                <AppStoreBadge />
                <GooglePlayBadge />
            </div>
        </div>
      )}

    </div>
  );
};

export default PricingPage;