'use client';

/**
 * Overview Page
 * Complete system overview with key metrics and status
 */

import { useAppStore } from '@/store/appStore';
import { Activity, TrendingUp, AlertCircle, CheckCircle2, Clock, Zap, Users } from 'lucide-react';
import { MetricsPanel } from '@/components/dashboard/MetricsPanel';

export default function OverviewPage() {
  const { isSimulating, metrics, anomalies, traffic, activeSimulation } = useAppStore();

  const statusCards = [
    {
      title: 'System Status',
      value: isSimulating ? 'Active' : 'Idle',
      icon: Activity,
      color: isSimulating ? 'text-green-500' : 'text-gray-500',
      bgColor: isSimulating ? 'bg-green-50 dark:bg-green-950/20' : 'bg-gray-50 dark:bg-gray-950/20',
    },
    {
      title: 'Total Requests',
      value: metrics.totalRequests.toLocaleString(),
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      trend: '+12.5%',
    },
    {
      title: 'Active Anomalies',
      value: anomalies.length,
      icon: AlertCircle,
      color: anomalies.length > 0 ? 'text-red-500' : 'text-green-500',
      bgColor: anomalies.length > 0 ? 'bg-red-50 dark:bg-red-950/20' : 'bg-green-50 dark:bg-green-950/20',
    },
    {
      title: 'Success Rate',
      value: `${(metrics.successRate * 100).toFixed(1)}%`,
      icon: CheckCircle2,
      color: metrics.successRate > 0.95 ? 'text-green-500' : 'text-yellow-500',
      bgColor: metrics.successRate > 0.95 ? 'bg-green-50 dark:bg-green-950/20' : 'bg-yellow-50 dark:bg-yellow-950/20',
    },
    {
      title: 'Avg Latency',
      value: `${Math.round(metrics.averageLatency)}ms`,
      icon: Clock,
      color: metrics.averageLatency < 100 ? 'text-green-500' : metrics.averageLatency < 300 ? 'text-yellow-500' : 'text-red-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      title: 'Active Nodes',
      value: metrics.activeNodes,
      icon: Zap,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/20',
    },
    {
      title: 'Error Count',
      value: metrics.errorCount,
      icon: AlertCircle,
      color: metrics.errorCount === 0 ? 'text-green-500' : 'text-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
    {
      title: 'Current Session',
      value: activeSimulation ? 'Running' : 'None',
      icon: Users,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
    },
  ];

  return (
    <div className="h-full p-6 overflow-y-auto" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            System Overview
          </h1>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Real-time monitoring of edge traffic and performance metrics
          </p>
        </div>

        {/* Status Banner */}
        {isSimulating && activeSimulation && (
          <div className="mb-6 rounded-lg border p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-green-500 animate-pulse" />
                <div>
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    Active Simulation
                  </p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    {activeSimulation.name} - Started {new Date(activeSimulation.startTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Duration</p>
                <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                  {Math.round((Date.now() - activeSimulation.startTime) / 1000)}s
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statusCards.map((card) => (
            <div
              key={card.title}
              className="rounded-lg border p-4"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
              <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                {card.title}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {card.value}
                </p>
                {card.trend && (
                  <span className="text-xs text-green-500">{card.trend}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Metrics Panel */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            Performance Metrics
          </h2>
          <MetricsPanel metrics={metrics} />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Anomalies */}
          <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <AlertCircle className="h-4 w-4" />
              Recent Anomalies
            </h3>
            {anomalies.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500 opacity-30" />
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  No anomalies detected - System healthy
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {anomalies.slice(-5).reverse().map((anomaly) => (
                  <div
                    key={anomaly.id}
                    className="p-3 rounded-lg border"
                    style={{ backgroundColor: 'var(--secondary)', borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                          {anomaly.description}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                          {new Date(anomaly.timestamp).toLocaleTimeString()} • {anomaly.affectedNodes.join(', ')}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        anomaly.severity === 'critical' ? 'bg-red-100 text-red-700' :
                        anomaly.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {anomaly.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Health */}
          <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Activity className="h-4 w-4" />
              System Health
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: 'var(--muted-foreground)' }}>Network Availability</span>
                  <span className="font-medium text-green-500">99.9%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '99.9%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: 'var(--muted-foreground)' }}>Response Time</span>
                  <span className={`font-medium ${metrics.averageLatency < 100 ? 'text-green-500' : 'text-yellow-500'}`}>
                    {Math.round(metrics.averageLatency)}ms
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${metrics.averageLatency < 100 ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${Math.min((metrics.averageLatency / 500) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: 'var(--muted-foreground)' }}>Success Rate</span>
                  <span className="font-medium text-green-500">{(metrics.successRate * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${metrics.successRate * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: 'var(--muted-foreground)' }}>Resource Usage</span>
                  <span className="font-medium text-blue-500">67%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '67%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
