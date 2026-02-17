/**
 * Network Map Visualization
 * Shows traffic flows between edge nodes
 */

import { useEffect, useRef } from 'react';
import type { GeoNode, TrafficRequest } from '../../types';
import { EDGE_NODES } from '../../data/nodes';

interface NetworkMapProps {
  traffic: TrafficRequest[];
  highlightedNodes?: string[];
}

export function NetworkMap({ traffic, highlightedNodes = [] }: NetworkMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas with background
    const isDark = document.documentElement.classList.contains('dark');
    ctx.fillStyle = isDark ? 'rgba(60, 60, 65, 0.8)' : 'rgba(250, 250, 250, 0.5)';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Map projection (simple equirectangular)
    const project = (lat: number, lng: number) => {
      const x = ((lng + 180) / 360) * rect.width;
      const y = ((90 - lat) / 180) * rect.height;
      return { x, y };
    };

    // Draw world map outline (simplified)
    ctx.strokeStyle = isDark ? 'rgba(150, 150, 150, 0.2)' : 'rgba(200, 200, 200, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, rect.width, rect.height);

    // Draw grid lines
    ctx.strokeStyle = isDark ? 'rgba(100, 100, 100, 0.1)' : 'rgba(200, 200, 200, 0.2)';
    for (let i = 1; i < 4; i++) {
      const x = (rect.width / 4) * i;
      const y = (rect.height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    // Draw traffic flows
    const recentTraffic = traffic.slice(-50); // Last 50 requests
    recentTraffic.forEach((req, i) => {
      const fromNode = EDGE_NODES.find(n => n.id === req.from);
      const toNode = EDGE_NODES.find(n => n.id === req.to);

      if (!fromNode || !toNode) return;

      const from = project(fromNode.lat, fromNode.lng);
      const to = project(toNode.lat, toNode.lng);

      // Fade older traffic
      const age = i / recentTraffic.length;
      const alpha = age * 0.6 + 0.1;

      // Color by status
      let color = `rgba(59, 130, 246, ${alpha})`; // blue for success
      if (req.status === 'error') color = `rgba(239, 68, 68, ${alpha})`; // red for error
      if (req.status === 'timeout') color = `rgba(251, 146, 60, ${alpha})`; // orange for timeout

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    });

    // Draw nodes
    EDGE_NODES.forEach(node => {
      const pos = project(node.lat, node.lng);
      const isHighlighted = highlightedNodes.includes(node.id);

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, isHighlighted ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = isHighlighted ? '#ef4444' : '#3b82f6';
      ctx.fill();

      // Node label
      if (isHighlighted) {
        ctx.fillStyle = isDark ? '#fff' : '#000';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(node.city, pos.x + 8, pos.y + 4);
      }
    });
  }, [traffic, highlightedNodes]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      <div className="absolute bottom-4 left-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Success</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Error</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Timeout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
