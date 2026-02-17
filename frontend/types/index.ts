/**
 * Shared TypeScript types for EdgeScope
 */

// Geographic node representing an edge location
export interface GeoNode {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  region: string; // e.g., "North America", "Europe", "Asia"
}

// Traffic request between nodes
export interface TrafficRequest {
  id: string;
  from: string; // node ID
  to: string; // node ID
  timestamp: number;
  latency: number; // milliseconds
  status: 'success' | 'error' | 'timeout';
  method: string; // GET, POST, etc.
  path: string;
  responseCode?: number;
}

// Anomaly detected by AI
export interface Anomaly {
  id: string;
  type: 'latency' | 'error_rate' | 'timeout' | 'unusual_pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedNodes: string[];
  timestamp: number;
  aiExplanation?: string;
  suggestedAction?: string;
}

// Simulation session
export interface Simulation {
  id: string;
  name: string;
  createdAt: number;
  duration: number; // seconds
  requestCount: number;
  nodeCount: number;
  anomalies: Anomaly[];
  traffic: TrafficRequest[];
}

// Real-time metrics
export interface Metrics {
  totalRequests: number;
  successRate: number;
  averageLatency: number;
  errorCount: number;
  anomalyCount: number;
  activeNodes: number;
}

// AI Analysis Response
export interface AIAnalysisResponse {
  summary: string;
  rootCause: string;
  impactAssessment: string;
  recommendedActions: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}
