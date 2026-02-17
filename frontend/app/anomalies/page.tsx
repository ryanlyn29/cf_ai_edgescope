'use client';

/**
 * Anomalies Page
 * View and investigate detected anomalies with AI analysis
 */

import { useAppStore } from '@/store/appStore';
import { AnomaliesPanel } from '@/components/dashboard/AnomaliesPanel';
import { AlertCircle, TrendingUp, Activity, CheckCircle2 } from 'lucide-react';
import { useCallback } from 'react';
import { sendAnomalyAnalysis } from '@/services/api';
import type { Anomaly } from '@/types';

export default function AnomaliesPage() {
  const { anomalies, traffic, metrics } = useAppStore();

  // Group anomalies by type
  const anomalyTypes = anomalies.reduce((acc, anomaly) => {
    acc[anomaly.type] = (acc[anomaly.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group by severity
  const anomalySeverity = anomalies.reduce((acc, anomaly) => {
    acc[anomaly.severity] = (acc[anomaly.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleAnalyzeAnomaly = useCallback(async (anomaly: Anomaly) => {
    try {
      await sendAnomalyAnalysis(anomaly, traffic.slice(-50));
    } catch (error) {
      console.error('Failed to analyze anomaly:', error);
    }
  }, [traffic]);

  const stats = [
    {
      label: 'Total Anomalies',
      value: anomalies.length,
      icon: AlertCircle,
      color: anomalies.length > 0 ? 'text-red-500' : 'text-green-500',
    },
    {
      label: 'Critical Issues',
      value: anomalySeverity['critical'] || 0,
      icon: AlertCircle,
      color: 'text-red-500',
    },
    {
      label: 'High Priority',
      value: anomalySeverity['high'] || 0,
      icon: TrendingUp,
      color: 'text-orange-500',
    },
    {
      label: 'System Health',
      value: anomalies.length === 0 ? 'Healthy' : 'Issues Detected',
      icon: anomalies.length === 0 ? CheckCircle2 : Activity,
      color: anomalies.length === 0 ? 'text-green-500' : 'text-yellow-500',
    },
  ];

  return (
    <div className="h-full p-6 overflow-y-auto" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: anomalies.length > 0 ? 'var(--destructive)' : 'var(--primary)' }}>
              <AlertCircle className="h-5 w-5" style={{ color: 'var(--primary-foreground)' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                Anomaly Detection
              </h1>
              <p style={{ color: 'var(--muted-foreground)' }}>
                Real-time anomaly detection and AI-powered investigation
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border p-4"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--secondary)' }}>
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

        {/* Analysis Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* By Type */}
          <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              Anomalies by Type
            </h3>
            {Object.keys(anomalyTypes).length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: 'var(--muted-foreground)' }}>
                No data available
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(anomalyTypes).map(([type, count]) => (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize" style={{ color: 'var(--muted-foreground)' }}>{type.replace('_', ' ')}</span>
                      <span className="font-medium" style={{ color: 'var(--foreground)' }}>{count}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500"
                        style={{ width: `${(count / anomalies.length) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* By Severity */}
          <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              By Severity Level
            </h3>
            {Object.keys(anomalySeverity).length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: 'var(--muted-foreground)' }}>
                No data available
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(anomalySeverity).map(([severity, count]) => (
                  <div key={severity}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize" style={{ color: 'var(--muted-foreground)' }}>{severity}</span>
                      <span className="font-medium" style={{ color: 'var(--foreground)' }}>{count}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          severity === 'critical' ? 'bg-red-500' :
                          severity === 'high' ? 'bg-orange-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${(count / anomalies.length) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Impact */}
          <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              System Impact
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'var(--muted-foreground)' }}>Error Rate</span>
                  <span className={`font-medium ${metrics.errorCount > 10 ? 'text-red-500' : 'text-green-500'}`}>
                    {((metrics.errorCount / metrics.totalRequests) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'var(--muted-foreground)' }}>Affected Nodes</span>
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                    {new Set(anomalies.flatMap(a => a.affectedNodes)).size}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'var(--muted-foreground)' }}>Avg Latency Impact</span>
                  <span className={`font-medium ${metrics.averageLatency > 300 ? 'text-red-500' : 'text-green-500'}`}>
                    +{Math.round(metrics.averageLatency * 0.2)}ms
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'var(--muted-foreground)' }}>Detection Rate</span>
                  <span className="font-medium text-green-500">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Anomalies List */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            Detected Anomalies
          </h2>
          <AnomaliesPanel anomalies={anomalies} onAnalyze={handleAnalyzeAnomaly} />
        </div>

        {/* Recommendations */}
        {anomalies.length > 0 && (
          <div className="rounded-lg border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Recommended Actions
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    Investigate High Priority Anomalies
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    Review critical and high severity anomalies first to minimize impact
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    Use AI Analysis
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    Click "Analyze with AI" on any anomaly for detailed root cause analysis
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    Monitor Affected Nodes
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    Check edge nodes that appear most frequently in anomaly reports
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
