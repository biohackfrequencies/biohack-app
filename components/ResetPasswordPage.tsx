import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CelestialBrandIcon } from './BohoIcons';
import LoadingSpinner from './LoadingSpinner';

const ResetPasswordPage: React.FC = () => {
  const { updateUserPassword, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error: updateError } = await updateUserPassword(password);
      if (updateError) {
        throw updateError;
      }
      setMessage('Your password has been successfully updated. You will now be logged out and can log in with your new password.');
      
      // After a delay, log the user out to force a fresh login.
      setTimeout(async () => {
          await logout();
      }, 4000);

    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoToLogin = async () => {
      await logout();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full text-center">
        <CelestialBrandIcon className="h-28 w-28 text-slate-600/80 dark:text-slate-400/80 mx-auto" />
        <div className="p-8 rounded-2xl shadow-xl bg-white/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-lg mt-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-dark-text-primary mb-6">
            Set a New Password
          </h2>
          {message ? (
            <div className="space-y-4">
                 <p className="text-sm text-green-600 dark:text-green-400 p-3 rounded-lg bg-green-500/10">{message}</p>
                 <button onClick={handleGoToLogin} className="w-full py-3 px-4 rounded-lg font-bold text-white bg-brand-gold hover:scale-105 transition-transform shadow-lg">
                    Back to Log In
                 </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-300/80 dark:border-slate-600 bg-white/80 dark:bg-slate-700/50 dark:text-dark-text-primary focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-300/80 dark:border-slate-600 bg-white/80 dark:bg-slate-700/50 dark:text-dark-text-primary focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
                />
              </div>
              {error && <p className="text-sm text-red-600 dark:text-red-400 p-3 rounded-lg bg-red-500/10">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 rounded-lg font-bold text-white bg-brand-gold hover:scale-105 transition-transform shadow-lg hover:shadow-xl disabled:bg-slate-400 disabled:scale-100"
              >
                {isLoading ? <LoadingSpinner /> : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;