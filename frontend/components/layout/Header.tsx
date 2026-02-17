'use client';

/**
 * Header Component - EdgeScope Style
 */

import { Sun, Moon, Play, Pause, RefreshCw, Zap, LayoutDashboard, Share2, Activity, AlertTriangle, Lightbulb, Map, BarChart3, Server, Clock, FileText } from 'lucide-react';
import { useTheme } from '@/components/contexts/ThemeContext';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  isSimulating?: boolean;
  onToggleSimulation?: () => void;
  onResetSimulation?: () => void;
}

const pageConfig: Record<string, { title: string; icon: React.ElementType }> = {
  '/': { title: 'Dashboard', icon: LayoutDashboard },
  '/overview': { title: 'Overview', icon: LayoutDashboard },
  '/live-traffic': { title: 'Live Traffic', icon: Activity },
  '/anomalies': { title: 'Anomalies', icon: AlertTriangle },
  '/insights': { title: 'Insights', icon: Lightbulb },
  '/simulations': { title: 'Simulations', icon: Play },
  '/network-map': { title: 'Network Map', icon: Map },
  '/analytics': { title: 'Analytics', icon: BarChart3 },
  '/edge-nodes': { title: 'Edge Nodes', icon: Server },
  '/sessions': { title: 'Sessions', icon: Clock },
  '/reports': { title: 'Reports', icon: FileText },
};

export function Header({ isSimulating, onToggleSimulation, onResetSimulation }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  
  const currentPage = pageConfig[pathname] || pageConfig['/'];
  const Icon = currentPage.icon;

  return (
    <header className="flex items-center justify-between border-b px-6 py-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
        <div className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded" style={{ backgroundColor: 'var(--primary)' }}>
            <Zap className="h-3 w-3" style={{ color: 'var(--primary-foreground)' }} />
          </div>
          <span className="font-medium" style={{ color: 'var(--foreground)' }}>EdgeScope</span>
        </div>
        <span style={{ color: 'var(--muted-foreground)' }}>{">"}</span>
        <div className="flex items-center gap-1.5">
          <Icon className="h-4 w-4" />
          <span>{currentPage.title}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Simulation Controls */}
        {onToggleSimulation && (
          <>
            <button
              onClick={onToggleSimulation}
              className={`
                px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5
                ${isSimulating
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'text-white hover:opacity-90'
                }
              `}
              style={{
                backgroundColor: isSimulating ? undefined : 'var(--primary)',
                color: isSimulating ? undefined : 'var(--primary-foreground)',
              }}
            >
              {isSimulating ? (
                <>
                  <Pause size={14} />
                  Stop
                </>
              ) : (
                <>
                  <Play size={14} />
                  Start Simulation
                </>
              )}
            </button>
            
            {onResetSimulation && (
              <button
                onClick={onResetSimulation}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 hover:bg-secondary"
                style={{ color: 'var(--foreground)' }}
              >
                <RefreshCw size={14} />
                Reset
              </button>
            )}
          </>
        )}

        {/* Share Button */}
        <button
          className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 hover:bg-secondary"
          style={{ color: 'var(--foreground)' }}
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md transition-colors hover:bg-secondary"
          style={{ color: 'var(--muted-foreground)' }}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
}
