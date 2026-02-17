/**
 * Anomalies Panel
 * Shows detected anomalies with AI explanations
 */

import { AlertTriangle, TrendingUp, XOctagon, Clock, Zap } from 'lucide-react';
import { CollapsibleSection } from '../ui/CollapsibleSection';
import type { Anomaly } from '../../types';

interface AnomaliesPanelProps {
  anomalies: Anomaly[];
  onAnalyze?: (anomaly: Anomaly) => void;
}

export function AnomaliesPanel({ anomalies, onAnalyze }: AnomaliesPanelProps) {
  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'latency':
        return Clock;
      case 'error_rate':
        return XOctagon;
      case 'timeout':
        return AlertTriangle;
      default:
        return Zap;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-zinc-500 text-white';
    }
  };

  if (anomalies.length === 0) {
    return (
      <div className="rounded-lg border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-2" style={{ color: 'var(--muted-foreground)', opacity: 0.3 }} />
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            No anomalies detected
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Your network is running smoothly
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {anomalies.map((anomaly) => {
        const Icon = getAnomalyIcon(anomaly.type);
        const time = new Date(anomaly.timestamp).toLocaleTimeString();

        return (
          <div
            key={anomaly.id}
            className="rounded-lg border overflow-hidden"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getSeverityColor(anomaly.severity)}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                      {anomaly.description}
                    </h4>
                    <span className={`text-xs px-2 py-0.5 rounded ${getSeverityColor(anomaly.severity)}`}>
                      {anomaly.severity}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    Affected nodes: {anomaly.affectedNodes.join(', ')} • {time}
                  </p>
                </div>
              </div>

              {anomaly.aiExplanation && (
                <CollapsibleSection title="AI Analysis" defaultOpen={false}>
                  <div className="space-y-2 text-sm">
                    <p style={{ color: 'var(--foreground)' }}>
                      {anomaly.aiExplanation}
                    </p>
                    {anomaly.suggestedAction && (
                      <div className="border rounded p-3" style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--border)' }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--primary)' }}>
                          Suggested Action
                        </p>
                        <p className="text-xs" style={{ color: 'var(--foreground)' }}>
                          {anomaly.suggestedAction}
                        </p>
                      </div>
                    )}
                  </div>
                </CollapsibleSection>
              )}

              {!anomaly.aiExplanation && onAnalyze && (
                <button
                  onClick={() => onAnalyze(anomaly)}
                  className="mt-3 text-xs hover:underline flex items-center gap-1"
                  style={{ color: 'var(--primary)' }}
                >
                  <TrendingUp size={12} />
                  Analyze with AI
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
