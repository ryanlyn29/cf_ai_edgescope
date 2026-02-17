'use client';

/**
 * Live Traffic Page
 * Real-time traffic monitoring and request logs
 */

import { useAppStore } from '@/store/appStore';
import { TrafficLog } from '@/components/dashboard/TrafficLog';
import { Activity, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LiveTrafficPage() {
  const { traffic, metrics, isSimulating } = useAppStore();
  const [requestsPerSecond, setRequestsPerSecond] = useState(0);

  // Calculate requests per second
  useEffect(() => {
    if (traffic.length < 2) return;
    
    const now = Date.now();
    const oneSecondAgo = now - 1000;
    const recentRequests = traffic.filter(r => r.timestamp > oneSecondAgo);
    setRequestsPerSecond(recentRequests.length);
  }, [traffic]);

  const stats = [
    {
      label: 'Requests/Second',
      value: isSimulating ? requestsPerSecond : 0,
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      label: 'Total Requests',
      value: traffic.length.toLocaleString(),
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      label: 'Avg Response Time',
      value: `${Math.round(metrics.averageLatency)}ms`,
      icon: Clock,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      label: 'Success Rate',
      value: `${(metrics.successRate * 100).toFixed(1)}%`,
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
  ];

  // Traffic by method
  const methodCounts = traffic.reduce((acc, req) => {
    acc[req.method] = (acc[req.method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Traffic by status
  const statusCounts = traffic.reduce((acc, req) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="h-full p-6 overflow-y-auto" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
              Live Traffic Monitor
            </h1>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Real-time traffic monitoring and request analytics
            </p>
          </div>
          
          {isSimulating && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md" style={{ backgroundColor: 'var(--secondary)' }}>
              <Activity className="h-4 w-4 text-green-500 animate-pulse" />
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                Live
              </span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border p-4"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                {stat.label}
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Traffic Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* By HTTP Method */}
          <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              Traffic by Method
            </h3>
            <div className="space-y-3">
              {Object.entries(methodCounts).map(([method, count]) => (
                <div key={method}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-mono" style={{ color: 'var(--muted-foreground)' }}>{method}</span>
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                      {count} ({((count / traffic.length) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(count / traffic.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By Status */}
          <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              Traffic by Status
            </h3>
            <div className="space-y-3">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize" style={{ color: 'var(--muted-foreground)' }}>{status}</span>
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                      {count} ({((count / traffic.length) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        status === 'success' ? 'bg-green-500' :
                        status === 'error' ? 'bg-red-500' :
                        'bg-orange-500'
                      }`}
                      style={{ width: `${(count / traffic.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Traffic Log */}
        <div className="h-[500px]">
          <TrafficLog traffic={traffic} maxItems={100} />
        </div>
      </div>
    </div>
  );
}
