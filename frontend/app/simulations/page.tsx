'use client';

/**
 * Simulations Page
 * Create and manage incident simulations
 */

import { useAppStore } from '@/store/appStore';
import { useRouter } from 'next/navigation';
import { Activity, Play, Pause, Save, AlertTriangle, TrendingUp } from 'lucide-react';

export default function SimulationsPage() {
  const router = useRouter();
  const {
    isSimulating,
    activeSimulation,
    startSimulation,
    stopSimulation,
    resetSimulation,
    saveSimulation,
    metrics,
  } = useAppStore();

  const handleStartSimulation = () => {
    startSimulation();
    router.push('/'); // Navigate to dashboard
  };

  const handleStopAndSave = () => {
    stopSimulation();
    saveSimulation();
  };

  return (
    <div className="h-full p-6 overflow-y-auto" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--primary)' }}>
            <Activity className="h-5 w-5" style={{ color: 'var(--primary-foreground)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              Simulations
            </h1>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Create and manage incident simulations
            </p>
          </div>
        </div>

        {/* Simulation Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Control Panel */}
          <div
            className="rounded-lg border p-6"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              Simulation Control
            </h2>
            
            {!isSimulating ? (
              <div>
                <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
                  Start a new simulation to generate traffic and test anomaly detection
                </p>
                <button
                  onClick={handleStartSimulation}
                  className="w-full px-4 py-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                  }}
                >
                  <Play className="h-5 w-5" />
                  Start New Simulation
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4 p-3 rounded-md" style={{ backgroundColor: 'var(--secondary)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      Simulation Running
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {activeSimulation?.name}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={handleStopAndSave}
                    className="w-full px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: 'var(--secondary)',
                      color: 'var(--foreground)',
                    }}
                  >
                    <Pause className="h-4 w-4" />
                    Stop & Save
                  </button>
                  
                  <button
                    onClick={resetSimulation}
                    className="w-full px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 border"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    Reset Simulation
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Current Stats */}
          <div
            className="rounded-lg border p-6"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              Current Statistics
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Total Requests
                  </span>
                  <span className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                    {metrics.totalRequests}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      backgroundColor: 'var(--primary)',
                      width: `${Math.min((metrics.totalRequests / 1000) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Success Rate
                  </span>
                  <span className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                    {(metrics.successRate * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{
                      width: `${metrics.successRate * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Average Latency
                  </span>
                  <span className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                    {Math.round(metrics.averageLatency)}ms
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Anomalies Detected
                  </span>
                  <span className="text-lg font-bold text-red-500">
                    {metrics.anomalyCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simulation Types */}
        <div
          className="rounded-lg border p-6"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            Simulation Scenarios
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                  Normal Traffic
                </h3>
              </div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Simulate standard edge traffic with minimal anomalies
              </p>
            </div>

            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                  Latency Spikes
                </h3>
              </div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Inject random latency anomalies into traffic
              </p>
            </div>

            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                  Error Bursts
                </h3>
              </div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Simulate cascading failures and error conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
