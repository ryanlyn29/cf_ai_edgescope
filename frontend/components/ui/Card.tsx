/**
 * Card Component
 * Simple container with border
 */

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 ${className}`}>
      {children}
    </div>
  );
}
