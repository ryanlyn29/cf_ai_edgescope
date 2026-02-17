'use client';

/**
 * Sessions Page
 * View and manage saved simulation sessions
 */

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { FolderOpen, Clock, Activity, AlertTriangle, Play } from 'lucide-react';

export default function SessionsPage() {
  const { simulations, loadSimulation } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved simulations from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edgescope-simulations');
      if (saved) {
        // Simulations are already loaded in the store
      }
    }
  }, []);

  if (!mounted) {
    return null;
  }

  const handleLoadSession = (id: string) => {
    loadSimulation(id);
    window.location.href = '/'; // Navigate to dashboard
  };

  return (
    <div className="h-full p-6 overflow-y-auto" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--primary)' }}>
            <FolderOpen className="h-5 w-5" style={{ color: 'var(--primary-foreground)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              Saved Sessions
            </h1>
            <p style={{ color: 'var(--muted-foreground)' }}>
              View and replay saved simulation sessions
            </p>
          </div>
        </div>

        {simulations.length === 0 ? (
          <div
            className="rounded-lg border p-12 text-center"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <FolderOpen className="h-16 w-16 mx-auto mb-4 opacity-20" style={{ color: 'var(--muted-foreground)' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              No Saved Sessions
            </h3>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Start a simulation and save it to see it here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {simulations.map((simulation) => {
              const duration = simulation.endTime
                ? Math.round((simulation.endTime - simulation.startTime) / 1000)
                : 0;
              
              return (
                <div
                  key={simulation.id}
                  className="rounded-lg border p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                  onClick={() => handleLoadSession(simulation.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
                        {simulation.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        <Clock className="h-3 w-3" />
                        {new Date(simulation.startTime).toLocaleString()}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        simulation.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {simulation.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2" style={{ color: 'var(--muted-foreground)' }}>
                        <Activity className="h-4 w-4" />
                        Requests
                      </span>
                      <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                        {simulation.traffic.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2" style={{ color: 'var(--muted-foreground)' }}>
                        <AlertTriangle className="h-4 w-4" />
                        Anomalies
                      </span>
                      <span className="font-medium text-red-500">
                        {simulation.anomalies.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2" style={{ color: 'var(--muted-foreground)' }}>
                        <Clock className="h-4 w-4" />
                        Duration
                      </span>
                      <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                        {duration}s
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-full px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 hover:opacity-90"
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoadSession(simulation.id);
                    }}
                  >
                    <Play className="h-4 w-4" />
                    Load Session
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
