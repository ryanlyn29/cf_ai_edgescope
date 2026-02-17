/**
 * Textarea Component
 * Multi-line input for log entries
 */

import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all font-mono text-sm ${className}`}
        {...props}
      />
    </div>
  );
}
