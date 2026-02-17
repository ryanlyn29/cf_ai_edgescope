'use client';

/**
 * AI Insights Page
 * AI-powered analysis and recommendations
 */

import { useAppStore } from '@/store/appStore';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { Sparkles, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

export default function InsightsPage() {
  const { anomalies, metrics, traffic } = useAppStore();

  const insights = [
    {
      title: 'Traffic Overview',
      icon: Activity,
      description: `${traffic.length} total requests processed`,
      value: `${Math.round(metrics.successRate * 100)}% success rate`,
      color: metrics.successRate > 0.95 ? 'text-green-500' : 'text-yellow-500',
    },
    {
      title: 'Latency Analysis',
      icon: TrendingUp,
      description: `Average response time: ${Math.round(metrics.averageLatency)}ms`,
      value: metrics.averageLatency < 100 ? 'Good' : metrics.averageLatency < 300 ? 'Fair' : 'Poor',
      color: metrics.averageLatency < 100 ? 'text-green-500' : 'text-yellow-500',
    },
    {
      title: 'Anomaly Detection',
      icon: AlertTriangle,
      description: `${anomalies.length} anomalies detected`,
      value: anomalies.length === 0 ? 'System Healthy' : 'Review Required',
      color: anomalies.length === 0 ? 'text-green-500' : 'text-red-500',
    },
  ];

  return (
    <div className="h-full p-6 overflow-y-auto" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--primary)' }}>
            <Sparkles className="h-5 w-5" style={{ color: 'var(--primary-foreground)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              AI Insights
            </h1>
            <p style={{ color: 'var(--muted-foreground)' }}>
              AI-powered analysis and recommendations
            </p>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {insights.map((insight) => (
            <div
              key={insight.title}
              className="rounded-lg border p-4"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <insight.icon className={`h-5 w-5 ${insight.color}`} />
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                    {insight.title}
                  </h3>
                </div>
              </div>
              <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                {insight.description}
              </p>
              <p className={`text-lg font-bold ${insight.color}`}>
                {insight.value}
              </p>
            </div>
          ))}
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[600px]">
            <ChatPanel />
          </div>

          {/* Recent Anomalies */}
          <div className="space-y-4">
            <div
              className="rounded-lg border p-4"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                Recent Anomalies
              </h3>
              {anomalies.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  No anomalies detected
                </p>
              ) : (
                <div className="space-y-2">
                  {anomalies.slice(-5).reverse().map((anomaly) => (
                    <div
                      key={anomaly.id}
                      className="p-2 rounded border"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>
                        {anomaly.description}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                        {anomaly.affectedNodes.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* System Status */}
            <div
              className="rounded-lg border p-4"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                System Status
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--muted-foreground)' }}>Active Nodes</span>
                  <span style={{ color: 'var(--foreground)' }}>{metrics.activeNodes}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--muted-foreground)' }}>Total Requests</span>
                  <span style={{ color: 'var(--foreground)' }}>{metrics.totalRequests}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--muted-foreground)' }}>Error Count</span>
                  <span style={{ color: 'var(--foreground)' }}>{metrics.errorCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
