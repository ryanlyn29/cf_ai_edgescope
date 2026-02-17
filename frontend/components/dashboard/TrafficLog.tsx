/**
 * Traffic Log Panel
 * Shows recent traffic requests in real-time
 */

import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { TrafficRequest } from '../../types';
import { getNodeById } from '../../data/nodes';

interface TrafficLogProps {
  traffic: TrafficRequest[];
  maxItems?: number;
}

export function TrafficLog({ traffic, maxItems = 50 }: TrafficLogProps) {
  const recentTraffic = traffic.slice(-maxItems).reverse();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 size={14} className="text-green-500" />;
      case 'error':
        return <XCircle size={14} className="text-red-500" />;
      case 'timeout':
        return <Clock size={14} className="text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400';
      case 'error':
        return 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400';
      case 'timeout':
        return 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400';
      default:
        return '';
    }
  };

  return (
    <div className="h-full flex flex-col rounded-lg border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
          Traffic Log
        </h3>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Real-time request monitoring
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 border-b" style={{ backgroundColor: 'var(--secondary)', borderColor: 'var(--border)' }}>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                Route
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                From
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                To
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                Latency
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {recentTraffic.map((req) => {
              const fromNode = getNodeById(req.from);
              const toNode = getNodeById(req.to);
              const time = new Date(req.timestamp).toLocaleTimeString();

              return (
                <tr
                  key={req.id}
                  className="hover:bg-secondary transition-colors"
                >
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(req.status)}
                      <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(req.status)}`}>
                        {req.responseCode}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-mono" style={{ color: 'var(--foreground)' }}>
                        {req.method}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {req.path}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {fromNode?.city || req.from}
                  </td>
                  <td className="px-4 py-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {toNode?.city || req.to}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className={`text-xs font-mono ${
                      req.latency < 100 ? 'text-green-600 dark:text-green-400' :
                      req.latency < 300 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {Math.round(req.latency)}ms
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {time}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {recentTraffic.length === 0 && (
          <div className="flex items-center justify-center h-32" style={{ color: 'var(--muted-foreground)' }}>
            <p className="text-sm">No traffic data yet. Start simulation to see activity.</p>
          </div>
        )}
      </div>
    </div>
  );
}
