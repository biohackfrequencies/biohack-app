import React from 'react';
import { LockIcon } from './BohoIcons';

interface ProBadgeProps {
  onClick?: () => void;
}

export const ProBadge: React.FC<ProBadgeProps> = ({ onClick }) => {
  const content = (
    <>
      <LockIcon className="w-3 h-3" />
      <span className="text-xs font-bold tracking-wider uppercase">Pro</span>
      <span className="sr-only">Pro feature</span>
    </>
  );

  const classes = "flex items-center gap-1.5 px-2 py-1 rounded-full bg-brand-gold text-white shadow-sm z-30";

  if (onClick) {
    return (
      <button onClick={onClick} className={`${classes} transition-transform hover:scale-105`} aria-label="Upgrade to Pro">
        {content}
      </button>
    );
  }

  return (
    <div className={classes}>
      {content}
    </div>
  );
};