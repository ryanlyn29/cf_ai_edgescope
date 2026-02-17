/**
 * Global Application Store
 * Manages simulation state, metrics, anomalies, and chat sessions
 */

import { create } from 'zustand';
import type { TrafficRequest, Anomaly, Metrics } from '@/types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface Simulation {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
  status: 'running' | 'paused' | 'completed';
  traffic: TrafficRequest[];
  anomalies: Anomaly[];
}

interface AppState {
  // Simulation State
  isSimulating: boolean;
  activeSimulation: Simulation | null;
  simulations: Simulation[];
  traffic: TrafficRequest[];
  
  // Metrics State
  metrics: Metrics;
  
  // Anomalies State
  anomalies: Anomaly[];
  
  // Chat State
  chatMessages: ChatMessage[];
  chatSessionId: string | null;
  
  // Actions
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
  addTraffic: (request: TrafficRequest) => void;
  addAnomaly: (anomaly: Anomaly) => void;
  updateMetrics: (metrics: Partial<Metrics>) => void;
  saveSimulation: () => void;
  loadSimulation: (id: string) => void;
  
  // Chat Actions
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  startChatSession: () => void;
}

const initialMetrics: Metrics = {
  totalRequests: 0,
  successRate: 1.0,
  averageLatency: 0,
  errorCount: 0,
  anomalyCount: 0,
  activeNodes: 24,
};

export const useAppStore = create<AppState>((set, get) => ({
  // Initial State
  isSimulating: false,
  activeSimulation: null,
  simulations: [],
  traffic: [],
  metrics: initialMetrics,
  anomalies: [],
  chatMessages: [],
  chatSessionId: null,

  // Simulation Actions
  startSimulation: () => {
    const newSimulation: Simulation = {
      id: `sim-${Date.now()}`,
      name: `Simulation ${new Date().toLocaleTimeString()}`,
      startTime: Date.now(),
      status: 'running',
      traffic: [],
      anomalies: [],
    };
    
    set({
      isSimulating: true,
      activeSimulation: newSimulation,
      traffic: [],
      anomalies: [],
      metrics: initialMetrics,
    });
  },

  stopSimulation: () => {
    const { activeSimulation } = get();
    if (activeSimulation) {
      set({
        isSimulating: false,
        activeSimulation: {
          ...activeSimulation,
          endTime: Date.now(),
          status: 'paused',
        },
      });
    }
  },

  resetSimulation: () => {
    set({
      isSimulating: false,
      activeSimulation: null,
      traffic: [],
      anomalies: [],
      metrics: initialMetrics,
    });
  },

  addTraffic: (request: TrafficRequest) => {
    set((state) => ({
      traffic: [...state.traffic, request].slice(-1000), // Keep last 1000
    }));
  },

  addAnomaly: (anomaly: Anomaly) => {
    set((state) => ({
      anomalies: [...state.anomalies, anomaly].slice(-10), // Keep last 10
    }));
  },

  updateMetrics: (newMetrics: Partial<Metrics>) => {
    set((state) => ({
      metrics: { ...state.metrics, ...newMetrics },
    }));
  },

  saveSimulation: () => {
    const { activeSimulation, traffic, anomalies } = get();
    if (activeSimulation) {
      const completedSimulation: Simulation = {
        ...activeSimulation,
        endTime: Date.now(),
        status: 'completed',
        traffic: [...traffic],
        anomalies: [...anomalies],
      };
      
      set((state) => ({
        simulations: [...state.simulations, completedSimulation],
      }));
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('edgescope-simulations');
        const existing = saved ? JSON.parse(saved) : [];
        localStorage.setItem(
          'edgescope-simulations',
          JSON.stringify([...existing, completedSimulation])
        );
      }
    }
  },

  loadSimulation: (id: string) => {
    const { simulations } = get();
    const simulation = simulations.find((sim) => sim.id === id);
    
    if (simulation) {
      set({
        activeSimulation: simulation,
        traffic: simulation.traffic,
        anomalies: simulation.anomalies,
        isSimulating: false,
      });
    }
  },

  // Chat Actions
  addChatMessage: (message: ChatMessage) => {
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    }));
  },

  clearChat: () => {
    set({ chatMessages: [] });
  },

  startChatSession: () => {
    set({ chatSessionId: `session-${Date.now()}` });
  },
}));

// Selectors for optimized component re-renders
export const selectIsSimulating = (state: AppState) => state.isSimulating;
export const selectTraffic = (state: AppState) => state.traffic;
export const selectAnomalies = (state: AppState) => state.anomalies;
export const selectMetrics = (state: AppState) => state.metrics;
export const selectChatMessages = (state: AppState) => state.chatMessages;
