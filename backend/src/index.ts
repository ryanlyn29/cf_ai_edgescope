/**
 * Main entry point for the Cloudflare Worker
 * Handles API routes using Hono framework
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { analyzeLog } from './ai';
import { getHistory, saveHistory, Message } from './memory';

// Type definitions for Cloudflare Worker bindings
type Bindings = {
  AI: any;
  CHAT_HISTORY: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS middleware - allows requests from any origin during development
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));

// Health check endpoint
app.get('/', (c) => {
  return c.json({
    status: 'ok',
    service: 'cf-ai-edgescope',
    version: '1.0.0',
    endpoints: {
      chat: 'POST /api/chat',
      analyze: 'POST /api/analyze',
      history: 'GET /api/history/:sessionId',
      health: 'GET /',
    },
  });
});

// Main chat endpoint
app.post('/api/chat', async (c) => {
  try {
    const body = await c.req.json();
    const { message, sessionId } = body;

    // Validate input
    if (!message || typeof message !== 'string') {
      return c.json(
        { error: 'Message is required and must be a string' },
        400
      );
    }

    if (!sessionId || typeof sessionId !== 'string') {
      return c.json(
        { error: 'SessionId is required and must be a string' },
        400
      );
    }

    // Get chat history from KV
    const history = await getHistory(c.env.CHAT_HISTORY, sessionId);

    // Create user message
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };

    // Analyze the log using Workers AI
    const analysis = await analyzeLog(c.env.AI, history, message);

    // Create assistant message with the analysis
    const assistantMessage: Message = {
      role: 'assistant',
      content: JSON.stringify(analysis),
      timestamp: Date.now(),
    };

    // Update history
    const updatedHistory = [...history, userMessage, assistantMessage];
    await saveHistory(c.env.CHAT_HISTORY, sessionId, updatedHistory);

    // Return the response
    return c.json({
      success: true,
      sessionId,
      analysis,
      messageCount: updatedHistory.length,
    });
  } catch (error) {
    console.error('[/api/chat] Error:', error);
    
    return c.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

// Get chat history for a session
app.get('/api/history/:sessionId', async (c) => {
  try {
    const sessionId = c.req.param('sessionId');

    if (!sessionId) {
      return c.json({ error: 'SessionId is required' }, 400);
    }

    const history = await getHistory(c.env.CHAT_HISTORY, sessionId);

    return c.json({
      success: true,
      sessionId,
      messages: history,
      count: history.length,
    });
  } catch (error) {
    console.error('Error in /api/history:', error);
    
    return c.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

// Analyze network anomaly with AI
app.post('/api/analyze', async (c) => {
  try {
    const body = await c.req.json();
    const { anomaly, traffic } = body;

    if (!anomaly) {
      return c.json({ error: 'Anomaly data is required' }, 400);
    }

    // Import the AI analysis function
    const { analyzeLog } = await import('./ai');
    
    // Format the anomaly as a structured log for AI
    const anomalyDescription = `
Network Anomaly Detected:
Type: ${anomaly.type}
Severity: ${anomaly.severity}
Description: ${anomaly.description}
Affected Nodes: ${anomaly.affectedNodes.join(', ')}
Timestamp: ${new Date(anomaly.timestamp).toISOString()}

Recent Traffic Data:
${traffic?.slice(-10).map((t: any) => 
  `- ${t.from} → ${t.to}: ${t.status} (${t.latency}ms, ${t.method} ${t.path})`
).join('\n') || 'No traffic data'}

Please analyze this network anomaly and provide:
1. Root cause analysis
2. Impact assessment
3. Recommended actions to resolve
`;

    // Use the existing AI analysis function
    const analysis = await analyzeLog(c.env.AI, [], anomalyDescription);

    return c.json({
      success: true,
      analysis: {
        summary: analysis.summary,
        rootCause: analysis.reasoning,
        impactAssessment: analysis.summary,
        recommendedActions: [analysis.potential_fix],
        severity: anomaly.severity,
      },
    });
  } catch (error) {
    console.error('[/api/analyze] Error:', error);
    
    return c.json(
      {
        error: 'Failed to analyze anomaly',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

// Export the Hono app as the default Worker export
export default app;
