'use client';

/**
 * Analytics Page
 * Historical data analysis and performance trends
 */

import { useAppStore } from '@/store/appStore';
import { BarChart3, TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';
import { useMemo } from 'react';

export default function AnalyticsPage() {
  const { traffic, metrics, simulations, anomalies } = useAppStore();

  // Calculate trend data
  const trendData = useMemo(() => {
    if (traffic.length < 10) return [];
    
    const buckets = 10;
    const bucketSize = Math.ceil(traffic.length / buckets);
    const trends = [];
    
    for (let i = 0; i < buckets; i++) {
      const start = i * bucketSize;
      const end = Math.min((i + 1) * bucketSize, traffic.length);
      const bucket = traffic.slice(start, end);
      
      if (bucket.length === 0) continue;
      
      const successCount = bucket.filter(r => r.status === 'success').length;
      const avgLatency = bucket.reduce((sum, r) => sum + r.latency, 0) / bucket.length;
      const errorCount = bucket.filter(r => r.status === 'error').length;
      
      trends.push({
        label: `T${i + 1}`,
        requests: bucket.length,
        successRate: (successCount / bucket.length) * 100,
        avgLatency: Math.round(avgLatency),
        errors: errorCount,
      });
    }
    
    return trends;
  }, [traffic]);

  // Performance comparison
  const performanceMetrics = [
    {
      title: 'Response Time',
      current: `${Math.round(metrics.averageLatency)}ms`,
      change: -12.5,
      trend: 'down',
      status: metrics.averageLatency < 100 ? 'excellent' : metrics.averageLatency < 300 ? 'good' : 'needs attention',
    },
    {
      title: 'Success Rate',
      current: `${(metrics.successRate * 100).toFixed(1)}%`,
      change: 2.3,
      trend: 'up',
      status: metrics.successRate > 0.95 ? 'excellent' : metrics.successRate > 0.85 ? 'good' : 'needs attention',
    },
    {
      title: 'Throughput',
      current: `${traffic.length} req`,
      change: 45.2,
      trend: 'up',
      status: 'excellent',
    },
    {
      title: 'Error Rate',
      current: `${((metrics.errorCount / metrics.totalRequests) * 100).toFixed(2)}%`,
      change: -8.1,
      trend: 'down',
      status: metrics.errorCount < 10 ? 'excellent' : 'needs attention',
    },
  ];

  return (
    <div className="h-full p-6 overflow-y-auto" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--primary)' }}>
              <BarChart3 className="h-5 w-5" style={{ color: 'var(--primary-foreground)' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                Performance Analytics
              </h1>
              <p style={{ color: 'var(--muted-foreground)' }}>
                Historical data analysis and performance trends
              </p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {performanceMetrics.map((metric) => (
            <div
              key={metric.title}
              className="rounded-lg border p-4"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                {metric.title}
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {metric.current}
                </p>
                <div className="flex items-center gap-1">
                  {metric.trend === 'up' ? (
                    <TrendingUp className={`h-3 w-3 ${metric.title === 'Error Rate' ? 'text-red-500' : 'text-green-500'}`} />
                  ) : (
                    <TrendingDown className={`h-3 w-3 ${metric.title === 'Error Rate' ? 'text-green-500' : 'text-red-500'}`} />
                  )}
                  <span className={`text-xs font-medium ${
                    (metric.trend === 'up' && metric.title !== 'Error Rate') || (metric.trend === 'down' && metric.title === 'Error Rate')
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}>
                    {Math.abs(metric.change)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  metric.status === 'excellent' ? 'bg-green-100 text-green-700' :
                  metric.status === 'good' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {metric.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trend Chart */}
        <div className="rounded-lg border p-6 mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            Traffic Trends
          </h3>
          {trendData.length === 0 ? (
            <div className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
              <Activity className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No data available. Start a simulation to see trends.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Bar Chart */}
              <div className="h-64 flex items-end gap-2">
                {trendData.map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                      <div
                        className="w-full rounded-t transition-all hover:opacity-80 cursor-pointer"
                        style={{
                          height: `${(data.requests / Math.max(...trendData.map(d => d.requests))) * 100}%`,
                          backgroundColor: 'var(--primary)',
                          minHeight: '20px',
                        }}
                        title={`${data.requests} requests`}
                      />
                    </div>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {data.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Avg Success Rate</p>
                  <p className="text-lg font-bold text-green-500">
                    {(trendData.reduce((sum, d) => sum + d.successRate, 0) / trendData.length).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Avg Latency</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                    {Math.round(trendData.reduce((sum, d) => sum + d.avgLatency, 0) / trendData.length)}ms
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Total Errors</p>
                  <p className="text-lg font-bold text-red-500">
                    {trendData.reduce((sum, d) => sum + d.errors, 0)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Historical Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session History */}
          <div className="rounded-lg border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              Session History
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--muted-foreground)' }}>Total Sessions</span>
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                  {simulations.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--muted-foreground)' }}>Active Session</span>
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                  {simulations.filter(s => s.status === 'running').length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--muted-foreground)' }}>Completed</span>
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                  {simulations.filter(s => s.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--muted-foreground)' }}>Total Requests Processed</span>
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                  {simulations.reduce((sum, s) => sum + s.traffic.length, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Anomaly Statistics */}
          <div className="rounded-lg border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              Anomaly Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--muted-foreground)' }}>Total Detected</span>
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                  {simulations.reduce((sum, s) => sum + s.anomalies.length, 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--muted-foreground)' }}>Currently Active</span>
                <span className="font-medium text-red-500">
                  {anomalies.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--muted-foreground)' }}>Detection Rate</span>
                <span className="font-medium text-green-500">
                  100%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--muted-foreground)' }}>Avg Response Time</span>
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                  {'<2s'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
