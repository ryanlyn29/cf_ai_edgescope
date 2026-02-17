'use client';

/**
 * Edge Nodes Page
 * Monitor and manage edge locations
 */

import { useAppStore } from '@/store/appStore';
import { EDGE_NODES } from '@/data/nodes';
import { Zap, MapPin, Activity, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useMemo } from 'react';

export default function EdgeNodesPage() {
  const { traffic, anomalies } = useAppStore();

  // Calculate node statistics
  const nodeStats = useMemo(() => {
    return EDGE_NODES.map(node => {
      const nodeTraffic = traffic.filter(
        t => t.from === node.id || t.to === node.id
      );
      const nodeAnomalies = anomalies.filter(
        a => a.affectedNodes.includes(node.id)
      );
      const avgLatency = nodeTraffic.length > 0
        ? nodeTraffic.reduce((sum, t) => sum + t.latency, 0) / nodeTraffic.length
        : 0;
      const successRate = nodeTraffic.length > 0
        ? (nodeTraffic.filter(t => t.status === 'success').length / nodeTraffic.length) * 100
        : 100;

      return {
        ...node,
        requestCount: nodeTraffic.length,
        anomalyCount: nodeAnomalies.length,
        avgLatency: Math.round(avgLatency),
        successRate: successRate.toFixed(1),
        status: nodeAnomalies.length > 0 ? 'warning' : avgLatency > 300 ? 'degraded' : 'healthy',
      };
    });
  }, [traffic, anomalies]);

  const stats = {
    total: EDGE_NODES.length,
    healthy: nodeStats.filter(n => n.status === 'healthy').length,
    degraded: nodeStats.filter(n => n.status === 'degraded').length,
    warning: nodeStats.filter(n => n.status === 'warning').length,
  };

  return (
    <div className="h-full p-6 overflow-y-auto" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--primary)' }}>
              <Zap className="h-5 w-5" style={{ color: 'var(--primary-foreground)' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                Edge Nodes
              </h1>
              <p style={{ color: 'var(--muted-foreground)' }}>
                Monitor and manage Cloudflare edge locations worldwide
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Total Nodes</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              {stats.total}
            </p>
          </div>

          <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Healthy</span>
            </div>
            <p className="text-2xl font-bold text-green-500">
              {stats.healthy}
            </p>
          </div>

          <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Degraded</span>
            </div>
            <p className="text-2xl font-bold text-yellow-500">
              {stats.degraded}
            </p>
          </div>

          <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Issues</span>
            </div>
            <p className="text-2xl font-bold text-red-500">
              {stats.warning}
            </p>
          </div>
        </div>

        {/* Nodes Table */}
        <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
              Node Status Overview
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b" style={{ backgroundColor: 'var(--secondary)', borderColor: 'var(--border)' }}>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    Region
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    Requests
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    Avg Latency
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    Success Rate
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    Anomalies
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {nodeStats.map((node) => (
                  <tr key={node.id} className="hover:bg-secondary transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {node.status === 'healthy' && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                        {node.status === 'degraded' && (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        )}
                        {node.status === 'warning' && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          node.status === 'healthy' ? 'bg-green-100 text-green-700' :
                          node.status === 'degraded' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {node.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                            {node.city}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                            {node.code}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {node.country}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        {node.requestCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-medium ${
                        node.avgLatency < 100 ? 'text-green-500' :
                        node.avgLatency < 300 ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {node.avgLatency || '-'}ms
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-medium ${
                        parseFloat(node.successRate) > 95 ? 'text-green-500' : 'text-yellow-500'
                      }`}>
                        {node.requestCount > 0 ? `${node.successRate}%` : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-medium ${
                        node.anomalyCount > 0 ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {node.anomalyCount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="mt-6 rounded-lg border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            Geographic Distribution
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['North America', 'Europe', 'Asia Pacific', 'Other'].map((region) => {
              const regionNodes = nodeStats.filter(n => {
                if (region === 'North America') return ['US', 'Canada', 'Mexico'].includes(n.country);
                if (region === 'Europe') return ['UK', 'Germany', 'France', 'Netherlands'].includes(n.country);
                if (region === 'Asia Pacific') return ['Singapore', 'Japan', 'Australia', 'India'].includes(n.country);
                return !['US', 'Canada', 'Mexico', 'UK', 'Germany', 'France', 'Netherlands', 'Singapore', 'Japan', 'Australia', 'India'].includes(n.country);
              });
              const totalRequests = regionNodes.reduce((sum, n) => sum + n.requestCount, 0);

              return (
                <div key={region} className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>{region}</p>
                  <p className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                    {regionNodes.length}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {totalRequests.toLocaleString()} requests
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
