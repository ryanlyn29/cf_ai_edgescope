/**
 * Traffic Simulation Engine
 * Generates realistic traffic patterns between edge nodes
 */

import type { TrafficRequest, Anomaly, GeoNode } from '../types';
import { EDGE_NODES } from '../data/nodes';

// Calculate approximate latency based on distance
function calculateLatency(from: GeoNode, to: GeoNode): number {
  const R = 6371; // Earth's radius in km
  const dLat = (to.lat - from.lat) * Math.PI / 180;
  const dLon = (to.lng - from.lng) * Math.PI / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  // Base latency: ~20ms per 1000km + random variance
  const baseLatency = (distance / 1000) * 20;
  const variance = Math.random() * 30 - 15; // ±15ms
  
  return Math.max(10, Math.round(baseLatency + variance));
}

// Generate a random traffic request
export function generateTrafficRequest(
  nodes: GeoNode[] = EDGE_NODES
): TrafficRequest {
  const from = nodes[Math.floor(Math.random() * nodes.length)];
  let to = nodes[Math.floor(Math.random() * nodes.length)];
  
  // Ensure different nodes
  while (to.id === from.id) {
    to = nodes[Math.floor(Math.random() * nodes.length)];
  }
  
  const latency = calculateLatency(from, to);
  
  // 95% success rate normally
  const status = Math.random() < 0.95 ? 'success' : 
                 Math.random() < 0.5 ? 'error' : 'timeout';
  
  const methods = ['GET', 'POST', 'PUT', 'DELETE'];
  const paths = ['/api/data', '/api/users', '/api/analytics', '/api/config', '/api/metrics'];
  
  return {
    id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    from: from.id,
    to: to.id,
    timestamp: Date.now(),
    latency,
    status,
    method: methods[Math.floor(Math.random() * methods.length)],
    path: paths[Math.floor(Math.random() * paths.length)],
    responseCode: status === 'success' ? 200 : status === 'error' ? 500 : 504,
  };
}

// Generate a batch of traffic
export function generateTrafficBatch(count: number): TrafficRequest[] {
  return Array.from({ length: count }, () => generateTrafficRequest());
}

// Inject an anomaly into traffic (high latency)
export function injectLatencyAnomaly(
  nodes: GeoNode[] = EDGE_NODES
): TrafficRequest {
  const request = generateTrafficRequest(nodes);
  return {
    ...request,
    latency: request.latency * 5 + Math.random() * 1000, // 5x latency + spike
    status: Math.random() < 0.3 ? 'timeout' : request.status,
  };
}

// Inject error burst
export function injectErrorBurst(
  count: number,
  affectedNode?: string
): TrafficRequest[] {
  return Array.from({ length: count }, () => {
    const request = affectedNode
      ? generateTrafficRequest(EDGE_NODES.filter(n => n.id === affectedNode || Math.random() < 0.3))
      : generateTrafficRequest();
    
    return {
      ...request,
      status: 'error' as const,
      responseCode: [500, 502, 503][Math.floor(Math.random() * 3)],
    };
  });
}

// Detect anomalies in traffic
export function detectAnomalies(traffic: TrafficRequest[]): Anomaly[] {
  const anomalies: Anomaly[] = [];
  
  if (traffic.length === 0) return anomalies;
  
  // Calculate metrics
  const avgLatency = traffic.reduce((sum, r) => sum + r.latency, 0) / traffic.length;
  const errorRate = traffic.filter(r => r.status === 'error').length / traffic.length;
  const timeoutRate = traffic.filter(r => r.status === 'timeout').length / traffic.length;
  
  // Detect high latency
  const highLatencyRequests = traffic.filter(r => r.latency > avgLatency * 3);
  if (highLatencyRequests.length > traffic.length * 0.1) {
    const affectedNodes = [...new Set(highLatencyRequests.flatMap(r => [r.from, r.to]))];
    anomalies.push({
      id: `anomaly_latency_${Date.now()}`,
      type: 'latency',
      severity: highLatencyRequests.length > traffic.length * 0.3 ? 'critical' : 'high',
      description: `High latency detected: ${Math.round(avgLatency)}ms average`,
      affectedNodes,
      timestamp: Date.now(),
    });
  }
  
  // Detect high error rate
  if (errorRate > 0.15) {
    const errorRequests = traffic.filter(r => r.status === 'error');
    const affectedNodes = [...new Set(errorRequests.flatMap(r => [r.from, r.to]))];
    anomalies.push({
      id: `anomaly_error_${Date.now()}`,
      type: 'error_rate',
      severity: errorRate > 0.3 ? 'critical' : errorRate > 0.2 ? 'high' : 'medium',
      description: `High error rate: ${(errorRate * 100).toFixed(1)}%`,
      affectedNodes,
      timestamp: Date.now(),
    });
  }
  
  // Detect timeout issues
  if (timeoutRate > 0.05) {
    const timeoutRequests = traffic.filter(r => r.status === 'timeout');
    const affectedNodes = [...new Set(timeoutRequests.flatMap(r => [r.from, r.to]))];
    anomalies.push({
      id: `anomaly_timeout_${Date.now()}`,
      type: 'timeout',
      severity: timeoutRate > 0.15 ? 'high' : 'medium',
      description: `High timeout rate: ${(timeoutRate * 100).toFixed(1)}%`,
      affectedNodes,
      timestamp: Date.now(),
    });
  }
  
  return anomalies;
}
