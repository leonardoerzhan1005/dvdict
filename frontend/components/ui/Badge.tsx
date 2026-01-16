import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
        variant === 'default'
          ? 'bg-blue-900 text-white'
          : 'border border-slate-200 text-blue-900'
      }`}
    >
      {children}
    </span>
  );
};

