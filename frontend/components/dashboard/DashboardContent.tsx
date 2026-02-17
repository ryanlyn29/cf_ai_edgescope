'use client';

/**
 * Dashboard Content Component
 * Coordinates simulation, visualization, and AI analysis
 */

import { useEffect, useCallback } from 'react';
import { NetworkMap } from './NetworkMap';
import { MetricsPanel } from './MetricsPanel';
import { TrafficLog } from './TrafficLog';
import { AnomaliesPanel } from './AnomaliesPanel';
import { generateTrafficRequest, detectAnomalies, injectLatencyAnomaly, injectErrorBurst } from '@/utils/simulation';
import type { Anomaly } from '@/types';
import { sendAnomalyAnalysis } from '@/services/api';
import { useAppStore } from '@/store/appStore';

interface DashboardContentProps {
  isSimulating: boolean;
}

export function DashboardContent({ isSimulating }: DashboardContentProps) {
  const {
    traffic,
    anomalies,
    metrics,
    addTraffic,
    addAnomaly,
    updateMetrics,
  } = useAppStore();

  // Generate traffic simulation
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Randomly inject anomalies (10% chance)
      if (Math.random() < 0.1) {
        if (Math.random() < 0.5) {
          // Inject latency spike
          addTraffic(injectLatencyAnomaly());
        } else {
          // Inject error burst
          const errorRequests = injectErrorBurst(3);
          errorRequests.forEach(req => addTraffic(req));
        }
      } else {
        // Normal traffic
        addTraffic(generateTrafficRequest());
      }
    }, 500); // New request every 500ms

    return () => clearInterval(interval);
  }, [isSimulating, addTraffic]);

  // Detect anomalies
  useEffect(() => {
    if (traffic.length < 20) return;

    const recentTraffic = traffic.slice(-50);
    const detected = detectAnomalies(recentTraffic);
    
    if (detected.length > 0) {
      detected.forEach(anomaly => {
        // Check if anomaly already exists
        const exists = anomalies.some(
          a => a.type === anomaly.type && Date.now() - a.timestamp < 10000
        );
        if (!exists) {
          addAnomaly(anomaly);
        }
      });
    }
  }, [traffic, anomalies, addAnomaly]);

  // Update metrics
  useEffect(() => {
    if (traffic.length === 0) return;

    const recentTraffic = traffic.slice(-100);
    const successCount = recentTraffic.filter(r => r.status === 'success').length;
    const errorCount = recentTraffic.filter(r => r.status === 'error').length;
    const avgLatency = recentTraffic.reduce((sum, r) => sum + r.latency, 0) / recentTraffic.length;

    updateMetrics({
      totalRequests: traffic.length,
      successRate: successCount / recentTraffic.length,
      averageLatency: avgLatency,
      errorCount,
      anomalyCount: anomalies.length,
      activeNodes: 24,
    });
  }, [traffic, anomalies, updateMetrics]);

  // Analyze anomaly with AI
  const handleAnalyzeAnomaly = useCallback(async (anomaly: Anomaly) => {
    try {
      await sendAnomalyAnalysis(anomaly, traffic.slice(-50));
      // Analysis result is handled by the AnomaliesPanel component
    } catch (error) {
      console.error('Failed to analyze anomaly:', error);
    }
  }, [traffic]);

  const highlightedNodes = anomalies.flatMap(a => a.affectedNodes);

  return (
    <div className="h-full p-6 space-y-4 overflow-y-auto">
      {/* Metrics Row */}
      <MetricsPanel metrics={metrics} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[500px]">
        {/* Map - Takes 2 columns */}
        <div className="lg:col-span-2">
          <NetworkMap traffic={traffic} highlightedNodes={highlightedNodes} />
        </div>

        {/* Anomalies Panel */}
        <div className="overflow-y-auto">
          <AnomaliesPanel anomalies={anomalies} onAnalyze={handleAnalyzeAnomaly} />
        </div>
      </div>

      {/* Traffic Log */}
      <div className="h-[400px]">
        <TrafficLog traffic={traffic} maxItems={100} />
      </div>
    </div>
  );
}
