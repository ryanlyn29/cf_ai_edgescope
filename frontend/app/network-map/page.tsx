'use client';

/**
 * Network Map Page
 * Network topology visualization
 */

import { useAppStore } from '@/store/appStore';
import { NetworkMap } from '@/components/dashboard/NetworkMap';
import { Map, Activity, Zap } from 'lucide-react';

export default function NetworkMapPage() {
  const { traffic, anomalies, metrics, isSimulating } = useAppStore();
  
  const highlightedNodes = anomalies.flatMap(a => a.affectedNodes);

  return (
    <div className="h-full p-6 overflow-y-auto" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--primary)' }}>
              <Map className="h-5 w-5" style={{ color: 'var(--primary-foreground)' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                Network Map
              </h1>
              <p style={{ color: 'var(--muted-foreground)' }}>
                Real-time network topology and traffic visualization
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isSimulating && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md" style={{ backgroundColor: 'var(--secondary)' }}>
                <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  Simulation Active
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Total Requests</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              {traffic.length}
            </p>
          </div>
          
          <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Active Nodes</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              {metrics.activeNodes}
            </p>
          </div>
          
          <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Avg Latency</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              {Math.round(metrics.averageLatency)}ms
            </p>
          </div>
          
          <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Anomalies</span>
            </div>
            <p className="text-2xl font-bold text-red-500">
              {anomalies.length}
            </p>
          </div>
        </div>

        {/* Network Map */}
        <div className="h-[600px]">
          <NetworkMap traffic={traffic} highlightedNodes={highlightedNodes} />
        </div>

        {/* Legend */}
        <div className="mt-4 rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
            Map Legend
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Normal Node</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Anomaly Detected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-blue-500"></div>
              <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Success Traffic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-red-500"></div>
              <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Error Traffic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
