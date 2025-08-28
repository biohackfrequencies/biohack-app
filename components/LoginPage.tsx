import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CelestialBrandIcon } from './BohoIcons';
import LoadingSpinner from './LoadingSpinner';

const LoginPage: React.FC = () => {
  const { login, signUp, resendVerification, sendPasswordResetEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [needsVerification, setNeedsVerification] = useState(false);
  
  const clearState = () => {
      setError(null);
      setMessage(null);
      setNeedsVerification(false);
  };

  const handleResend = async () => {
    setIsLoading(true);
    clearState();
    try {
      const { error: resendError } = await resendVerification(email);
      if (resendError) throw resendError;
      setMessage('A new verification email has been sent. Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearState();
    try {
      const { error: resetError } = await sendPasswordResetEmail(email);
      if (resetError) throw resetError;
      setMessage('If an account with that email exists, a password reset link has been sent.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearState();

    try {
      const { error: authError } = authMode === 'signup'
        ? await signUp(email, password)
        : await login(email, password);
      
      if (authError) {
        if (authError.message === 'Email not confirmed') {
            setError('Your email has not been verified. Please check your inbox for a confirmation link.');
            setNeedsVerification(true);
            return;
        }
        throw authError;
      }

      if (authMode === 'signup') {
        setMessage('Success! Please check your email for a verification link to complete your sign up.');
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormContent = () => {
    if (authMode === 'reset') {
      return (
        <>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-dark-text-primary mb-6">Reset Password</h2>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required className="w-full px-4 py-3 rounded-lg border border-slate-300/80 dark:border-slate-600 bg-white/80 dark:bg-slate-700/50 dark:text-dark-text-primary focus:ring-2 focus:ring-brand-gold focus:border-transparent transition" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center py-3 px-4 rounded-lg font-bold text-white bg-brand-gold hover:scale-105 transition-transform shadow-lg hover:shadow-xl disabled:bg-slate-400 disabled:scale-100">
              {isLoading ? <LoadingSpinner /> : 'Send Reset Link'}
            </button>
          </form>
          <div className="mt-4 text-sm">
            <button onClick={() => { setAuthMode('login'); clearState(); }} className="text-brand-gold hover:underline">
              Back to Log In
            </button>
          </div>
        </>
      );
    }

    return (
        <>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-dark-text-primary mb-6">
                {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required className="w-full px-4 py-3 rounded-lg border border-slate-300/80 dark:border-slate-600 bg-white/80 dark:bg-slate-700/50 dark:text-dark-text-primary focus:ring-2 focus:ring-brand-gold focus:border-transparent transition" /></div>
                <div><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-3 rounded-lg border border-slate-300/80 dark:border-slate-600 bg-white/80 dark:bg-slate-700/50 dark:text-dark-text-primary focus:ring-2 focus:ring-brand-gold focus:border-transparent transition" /></div>
                <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center py-3 px-4 rounded-lg font-bold text-white bg-brand-gold hover:scale-105 transition-transform shadow-lg hover:shadow-xl disabled:bg-slate-400 disabled:scale-100">
                    {isLoading ? <LoadingSpinner /> : (authMode === 'signup' ? 'Sign Up' : 'Log In')}
                </button>
            </form>
            <div className="mt-4 text-sm flex justify-between">
                <button onClick={() => { setAuthMode(authMode === 'signup' ? 'login' : 'signup'); clearState(); }} className="text-brand-gold hover:underline">
                    {authMode === 'signup' ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                </button>
                 <button onClick={() => { setAuthMode('reset'); clearState(); }} className="text-slate-500 dark:text-dark-text-secondary hover:underline">
                    Forgot your password?
                </button>
            </div>
        </>
    );
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full text-center">
        <CelestialBrandIcon className="h-28 w-28 text-slate-600/80 dark:text-slate-400/80 mx-auto" />
        <div className="flex flex-col items-center leading-tight mb-8">
          <h1 className="font-display font-bold text-5xl text-slate-700 dark:text-dark-text-primary tracking-wide">
            Biohack Frequencies
          </h1>
          <p className="font-sans text-lg uppercase tracking-wider text-slate-600/90 dark:text-dark-text-muted mt-1">
            Your Harmonic Blueprint
          </p>
        </div>
        
        <div className="p-8 rounded-2xl shadow-xl bg-white/80 dark:bg-[#0f312c]/80 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-lg">
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 p-3 rounded-lg bg-red-500/10 mb-4">
                <p>{error}</p>
                {needsVerification && (
                  <button type="button" onClick={handleResend} className="mt-2 font-bold underline" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Resend verification email'}
                  </button>
                )}
              </div>
            )}
            {message && <p className="text-sm text-green-600 dark:text-green-400 p-3 rounded-lg bg-green-500/10 mb-4">{message}</p>}
            
            {renderFormContent()}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
