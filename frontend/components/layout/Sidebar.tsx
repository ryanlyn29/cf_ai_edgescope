'use client';

/**
 * Sidebar Navigation - EdgeScope Style with Next.js
 */

import {
  Activity,
  Map,
  BarChart3,
  AlertCircle,
  Sparkles,
  FolderOpen,
  FileText,
  HelpCircle,
  Settings,
  Receipt,
  Search,
  Plus,
  ChevronDown,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const mainNav = [
  { label: 'Overview', icon: Activity, path: '/overview' },
  { label: 'Live Traffic', icon: Map, path: '/live-traffic' },
  { label: 'Anomalies', icon: AlertCircle, path: '/anomalies' },
  { label: 'AI Insights', icon: Sparkles, path: '/insights' },
];

const monitoringNav = [
  { label: 'Dashboard', icon: BarChart3, path: '/' },
  { label: 'Simulations', icon: Activity, path: '/simulations' },
  { label: 'Network Map', icon: Map, path: '/network-map' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics', badge: 12 },
  { label: 'Edge Nodes', icon: Zap, path: '/edge-nodes' },
];

const sessionsNav = [
  { label: 'Saved Sessions', icon: FolderOpen, path: '/sessions' },
  { label: 'Reports', icon: FileText, path: '/reports' },
];

const bottomNav = [
  { label: 'Help center', icon: HelpCircle, path: '/help' },
  { label: 'Settings', icon: Settings, path: '/settings' },
  { label: 'Billing', icon: Receipt, path: '/billing' },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-[260px] flex-col border-r bg-card" style={{ borderColor: 'var(--sidebar-border)' }}>
      {/* Header */}
      <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: 'var(--sidebar-border)' }}>
        <div className="flex h-7 w-7 items-center justify-center rounded-md" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
          <Zap className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>EdgeScope</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        {/* Search */}
        <div className="mb-3">
          <div className="flex items-center gap-2 rounded-md border px-3 py-1.5" style={{ backgroundColor: 'var(--secondary)', borderColor: 'var(--border)' }}>
            <Search className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
            <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Search</span>
          </div>
        </div>

        {/* Main nav */}
        <nav className="mb-4 flex flex-col gap-0.5">
          {mainNav.map((item) => (
            <SidebarLink
              key={item.label}
              href={item.path}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </nav>

        {/* Monitoring */}
        <div className="mb-1 flex items-center justify-between px-2">
          <div className="flex items-center gap-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded" style={{ backgroundColor: 'var(--primary)' }}>
              <Activity className="h-3 w-3" style={{ color: 'var(--primary-foreground)' }} />
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Monitoring</span>
            <ChevronDown className="h-3 w-3" style={{ color: 'var(--muted-foreground)' }} />
          </div>
          <Plus className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
        </div>
        <nav className="mb-4 flex flex-col gap-0.5">
          {monitoringNav.map((item) => (
            <SidebarLink
              key={item.label}
              href={item.path}
              label={item.label}
              icon={item.icon}
              badge={item.badge}
            />
          ))}
        </nav>

        {/* Sessions */}
        <div className="mb-1 flex items-center justify-between px-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Sessions</span>
            <ChevronDown className="h-3 w-3" style={{ color: 'var(--muted-foreground)' }} />
          </div>
          <Plus className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
        </div>
        <nav className="flex flex-col gap-0.5">
          {sessionsNav.map((item) => (
            <SidebarLink
              key={item.label}
              href={item.path}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </nav>
      </div>

      {/* Bottom nav */}
      <div className="border-t px-3 py-2" style={{ borderColor: 'var(--sidebar-border)' }}>
        <nav className="flex flex-col gap-0.5">
          {bottomNav.map((item) => (
            <SidebarLink
              key={item.label}
              href={item.path}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </nav>
      </div>

      {/* User Profile */}
      <div className="border-t px-4 py-3" style={{ borderColor: 'var(--sidebar-border)' }}>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold text-sm">
            ES
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>EdgeScope User</p>
            <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>user@edgescope.io</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  badge,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
        isActive ? 'font-medium' : 'hover:bg-secondary'
      }`}
      style={{
        backgroundColor: isActive ? 'var(--secondary)' : undefined,
        color: isActive ? 'var(--foreground)' : 'var(--sidebar-foreground)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
        <span>{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{badge}</span>
      )}
    </Link>
  );
}
