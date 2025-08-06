import React from 'react';
import { SparklesIcon } from './BohoIcons';

interface DailyInspirationCardProps {
  quote: string;
  author: string;
  userName: string | null;
}

export const DailyInspirationCard: React.FC<DailyInspirationCardProps> = ({ quote, author, userName }) => {
  const greeting = userName ? `Welcome, ${userName}` : 'Welcome';

  return (
    <div
      className="relative group p-6 rounded-3xl shadow-lg transition-all duration-300
      bg-gradient-to-br from-[#EEE8B2]/40 to-[#C18D52]/20 dark:bg-dark-surface
      hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-[0_8px_30px_-5px_var(--glow-color)]
      dark:border dark:border-brand-gold/40"
      style={{ '--glow-color': '#C18D5240' } as React.CSSProperties}
    >
      <div className="absolute inset-0 bg-transparent dark:group-hover:bg-black/20 transition-colors duration-300 rounded-3xl"></div>
      <div className="relative z-10 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
            <SparklesIcon className="w-6 h-6 text-brand-gold" />
            <h3 className="font-semibold text-slate-800 dark:text-dark-text-primary">{greeting}</h3>
        </div>
        <blockquote className="font-display text-lg italic text-slate-700 dark:text-dark-text-primary">
            "{quote}"
        </blockquote>
        <cite className="block not-italic mt-4 font-semibold text-slate-600 dark:text-dark-text-muted">
            &mdash; {author}
        </cite>
      </div>
    </div>
  );
};