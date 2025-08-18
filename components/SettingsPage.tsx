import React, { useState } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { SparklesIcon, BackIcon, UserCircleIcon, OuraRingIcon, CalendarIcon, CGMIcon, FitbitIcon } from './BohoIcons';
import LoadingSpinner from './LoadingSpinner';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useIntegrations } from '../contexts/IntegrationsContext';

type IntegrationId = 'oura' | 'calendar' | 'cgm' | 'fitbit';

const ThemeOptionButton: React.FC<{
  currentTheme: string;
  themeValue: string;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ currentTheme, themeValue, onClick, children }) => {
  const isActive = currentTheme === themeValue;
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
        isActive
          ? 'bg-brand-gold text-white shadow'
          : 'bg-slate-200 dark:bg-slate-700 dark:text-dark-text-secondary dark:hover:bg-slate-600 hover:bg-slate-300 text-slate-700'
      }`}
    >
      {children}
    </button>
  );
};

const IntegrationItem: React.FC<{
  id: IntegrationId;
  name: string;
  description: string;
  Icon: React.FC<{ className?: string }>;
  connectedIntegrations: Set<IntegrationId>;
  toggleIntegration: (id: IntegrationId) => void;
}> = ({ id, name, description, Icon, connectedIntegrations, toggleIntegration }) => {
  const isConnected = connectedIntegrations.has(id);
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon className="w-8 h-8 text-slate-500 dark:text-dark-text-secondary" />
        <div>
          <p className="font-semibold text-slate-800 dark:text-dark-text-primary">{name}</p>
          <p className="text-xs text-slate-600 dark:text-dark-text-secondary">{description}</p>
        </div>
      </div>
      <button
        onClick={() => toggleIntegration(id)}
        role="switch"
        aria-checked={isConnected}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ring-brand-gold ${isConnected ? 'bg-brand-gold' : 'bg-slate-300 dark:bg-slate-600'}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isConnected ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  const { isSubscribed, unsubscribe } = useSubscription();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { theme, setTheme } = useTheme();
  const { connectedIntegrations, toggleIntegration } = useIntegrations();
  const [copyStatus, setCopyStatus] = useState('Copy');

  const navigate = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    window.location.hash = hash;
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  const handleToggleIntegration = (id: IntegrationId) => {
    // If trying to enable (it's not currently connected) AND user is not subscribed, redirect to pricing.
    if (!connectedIntegrations.has(id) && !isSubscribed) {
        window.location.hash = '#/pricing';
        return;
    }
    // Otherwise, allow the toggle (this covers disabling, or enabling for pro users).
    toggleIntegration(id);
  };
  
  const handleCopyEmail = () => {
    const email = 'info@heartbeat-productions.com';
    navigator.clipboard.writeText(email).then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy'), 2000);
    }).catch(err => {
        console.error('Failed to copy email: ', err);
        setCopyStatus('Failed');
        setTimeout(() => setCopyStatus('Copy'), 2000);
    });
  };


  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-8">
      <a href="#/" onClick={(e) => navigate(e, '/')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-dark-text-muted dark:hover:text-dark-text-primary transition-colors">
        <BackIcon className="w-6 h-6" />
        <span className="font-semibold">Back to Home</span>
      </a>

      <div className="p-6 sm:p-8 rounded-2xl shadow-lg bg-white/80 dark:bg-dark-bg/80 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-lg">
        <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-dark-text-primary text-center">Settings & Info</h2>
        
        <div className="mt-8">
            <h3 className="text-xl font-bold font-display text-brand-gold">Appearance</h3>
            <div className="mt-4 p-4 bg-slate-500/5 dark:bg-black/20 rounded-xl border border-slate-500/10 dark:border-slate-700/50 flex items-center justify-between">
                <p className="font-semibold text-slate-800 dark:text-dark-text-primary">Theme</p>
                <div className="flex items-center gap-2">
                    <ThemeOptionButton currentTheme={theme} themeValue="light" onClick={() => setTheme('light')}>Light</ThemeOptionButton>
                    <ThemeOptionButton currentTheme={theme} themeValue="dark" onClick={() => setTheme('dark')}>Dark</ThemeOptionButton>
                    <ThemeOptionButton currentTheme={theme} themeValue="system" onClick={() => setTheme('system')}>System</ThemeOptionButton>
                </div>
            </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-bold font-display text-brand-gold">Account</h3>
           <div className="mt-4 p-4 bg-slate-500/5 dark:bg-black/20 rounded-xl border border-slate-500/10 dark:border-slate-700/50 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <UserCircleIcon className="w-10 h-10 text-slate-500 dark:text-dark-text-muted"/>
                    <div>
                        <p className="font-semibold text-slate-800 dark:text-dark-text-primary">Logged In As</p>
                        <p className="text-sm text-slate-600 dark:text-dark-text-secondary">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-24 h-10 flex items-center justify-center text-sm font-semibold rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-dark-text-secondary dark:hover:bg-slate-600 transition disabled:opacity-50"
                >
                    {isLoggingOut ? <LoadingSpinner /> : 'Logout'}
                </button>
             </div>
           </div>
        </div>

        <div className="mt-8">
            <h3 className="text-xl font-bold font-display text-brand-gold">Integrations</h3>
            <div className="mt-4 p-4 bg-slate-500/5 dark:bg-black/20 rounded-xl border border-slate-500/10 dark:border-slate-700/50 space-y-4">
                <IntegrationItem
                id="oura"
                name="Oura Ring"
                description="Sync readiness, sleep scores & temperature."
                Icon={OuraRingIcon}
                connectedIntegrations={connectedIntegrations}
                toggleIntegration={handleToggleIntegration}
                />
                <hr className="border-slate-200 dark:border-slate-700" />
                <IntegrationItem
                id="fitbit"
                name="Fitbit"
                description="Sync active minutes, steps & sleep score."
                Icon={FitbitIcon}
                connectedIntegrations={connectedIntegrations}
                toggleIntegration={handleToggleIntegration}
                />
                <hr className="border-slate-200 dark:border-slate-700" />
                <IntegrationItem
                id="calendar"
                name="Google Calendar"
                description="Get proactive suggestions for focus blocks."
                Icon={CalendarIcon}
                connectedIntegrations={connectedIntegrations}
                toggleIntegration={handleToggleIntegration}
                />
                <hr className="border-slate-200 dark:border-slate-700" />
                <IntegrationItem
                id="cgm"
                name="Continuous Glucose Monitor"
                description="Correlate sound therapy with blood sugar levels."
                Icon={CGMIcon}
                connectedIntegrations={connectedIntegrations}
                toggleIntegration={handleToggleIntegration}
                />
            </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold font-display text-brand-gold">Subscription</h3>
          <div className="mt-4 p-4 bg-slate-500/5 dark:bg-black/20 rounded-xl border border-slate-500/10 dark:border-slate-700/50 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-dark-text-primary">Your Status</p>
                  {isSubscribed ? (
                    <div className="flex items-center gap-2 text-brand-gold">
                      <SparklesIcon className="w-5 h-5" />
                      <span className="font-bold">Pro Member</span>
                    </div>
                  ) : (
                    <p className="text-slate-600 dark:text-dark-text-secondary">Free User</p>
                  )}
                </div>
                {!isSubscribed && (
                  <a
                    href="#/pricing"
                    onClick={(e) => navigate(e, '/pricing')}
                    className="px-4 py-2 rounded-full bg-brand-gold text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Upgrade to Pro
                  </a>
                )}
            </div>
             {isSubscribed && <hr className="border-slate-200 dark:border-slate-700" />}
             {isSubscribed && (
                 <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600 dark:text-dark-text-secondary">Unsubscribe (Demo Only)</p>
                    <button
                      onClick={unsubscribe}
                      className="px-4 py-2 text-sm font-semibold rounded-full bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition"
                    >
                      Unsubscribe
                    </button>
                 </div>
             )}
          </div>
        </div>

        <div className="mt-8">
            <h3 className="text-xl font-bold font-display text-slate-700 dark:text-dark-text-primary">🌐 About Us</h3>
            <p className="mt-2 text-slate-600 dark:text-dark-text-secondary">
                Learn about our mission, vision, and the story behind the frequencies.
            </p>
            <a
                href="#/our-mission"
                onClick={(e) => navigate(e, '/our-mission')}
                className="mt-4 inline-block px-5 py-2.5 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-800 dark:hover:bg-white transition"
            >
                Read Our Story
            </a>
        </div>

        <div className="mt-8">
            <h3 className="text-xl font-bold font-display text-slate-700 dark:text-dark-text-primary">The Science</h3>
            <p className="mt-2 text-slate-600 dark:text-dark-text-secondary">
                Learn about the principles of neural entrainment and acoustic science that power this app.
            </p>
            <a
                href="#/science"
                onClick={(e) => navigate(e, '/science')}
                className="mt-4 inline-block px-5 py-2.5 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-800 dark:hover:bg-white transition"
            >
                Explore the Science
            </a>
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-bold font-display text-slate-700 dark:text-dark-text-primary">Contact & Support</h3>
          <p className="mt-2 text-slate-600 dark:text-dark-text-secondary">
            Have questions, feedback, or need assistance? We'd love to hear from you.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
              <a
                href="mailto:info@heartbeat-productions.com"
                className="inline-block px-5 py-2.5 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-800 dark:hover:bg-white transition"
              >
                Email Us
              </a>
              <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-600 dark:text-dark-text-secondary">or copy:</p>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                      <span className="font-mono text-sm text-slate-700 dark:text-dark-text-secondary">info@heartbeat-productions.com</span>
                      <button onClick={handleCopyEmail} className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors w-16 text-center">
                          {copyStatus}
                      </button>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};