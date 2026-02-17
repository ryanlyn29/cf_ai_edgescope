/**
 * CollapsibleSection Component
 * Expandable section for displaying detailed information
 */

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Props {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleSection({ title, children, defaultOpen = false }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-md my-2 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        {title}
      </button>
      {isOpen && (
        <div className="p-4 bg-white dark:bg-black text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed border-t border-zinc-200 dark:border-zinc-800">
          {children}
        </div>
      )}
    </div>
  );
}
