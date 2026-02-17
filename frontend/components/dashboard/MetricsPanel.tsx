/**
 * Metrics Panel - EdgeScope Style
 */

import { TrendingUp, TrendingDown, Activity, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import type { Metrics } from '../../types';

interface MetricsPanelProps {
  metrics: Metrics;
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  const metricCards = [
    {
      label: 'Total Requests',
      value: metrics.totalRequests.toLocaleString(),
      icon: Activity,
      trend: null,
      change: 0,
    },
    {
      label: 'Success Rate',
      value: `${(metrics.successRate * 100).toFixed(1)}%`,
      icon: CheckCircle2,
      trend: metrics.successRate > 0.95 ? 'up' : 'down',
      change: 5.4,
    },
    {
      label: 'Avg Latency',
      value: `${Math.round(metrics.averageLatency)}ms`,
      icon: Clock,
      trend: metrics.averageLatency < 100 ? 'down' : 'up',
      change: 7.2,
    },
    {
      label: 'Errors',
      value: metrics.errorCount.toLocaleString(),
      icon: AlertTriangle,
      trend: null,
      change: 0,
    },
    {
      label: 'Anomalies',
      value: metrics.anomalyCount.toLocaleString(),
      icon: AlertTriangle,
      trend: null,
      change: 0,
    },
    {
      label: 'Active Nodes',
      value: metrics.activeNodes.toLocaleString(),
      icon: Activity,
      trend: null,
      change: 0,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="mb-4">
        <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
          Performance Summary
        </h2>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          View your key performance metrics
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="rounded-lg border p-4"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <p className="mb-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {metric.label}
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                    {metric.value}
                  </p>
                  {metric.trend && (
                    <div className="mt-1 flex items-center gap-1">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3" style={{ color: 'var(--primary)' }} />
                      ) : (
                        <TrendingDown className="h-3 w-3" style={{ color: 'var(--destructive)' }} />
                      )}
                      <span
                        className="text-xs font-medium"
                        style={{ color: metric.trend === 'up' ? 'var(--primary)' : 'var(--destructive)' }}
                      >
                        {metric.change}%
                      </span>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        than last hour
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--secondary)' }}>
                  <Icon size={16} style={{ color: 'var(--muted-foreground)' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
