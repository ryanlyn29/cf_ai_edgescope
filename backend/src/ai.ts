/**
 * AI Logic using Cloudflare Workers AI
 * Handles log analysis with Llama 3 8B Instruct
 */

import { Message } from './memory';

export interface AnalysisResponse {
  summary: string;
  reasoning: string;
  potential_fix: string;
}

const SYSTEM_PROMPT = `You are a Senior Site Reliability Engineer specialized in debugging and log analysis. When analyzing logs, stack traces, or error messages:

1. Identify the root cause of the issue
2. Explain the reasoning behind the error
3. Provide actionable fixes

IMPORTANT: You MUST respond ONLY with valid JSON in this exact format:
{
  "summary": "One-sentence summary of the error (under 20 words)",
  "reasoning": "Step-by-step explanation of what's happening and why",
  "potential_fix": "Concrete fix or code snippet to resolve the issue"
}

Do not include any text before or after the JSON. Only output valid JSON.`;

/**
 * Formats chat history for the AI model
 */
function formatMessages(history: Message[], newMessage: string): any[] {
  const messages: any[] = [
    { role: 'system', content: SYSTEM_PROMPT }
  ];

  // Add conversation history (limit to last 10 messages to stay within context)
  const recentHistory = history.slice(-10);
  for (const msg of recentHistory) {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    });
  }

  // Add new user message
  messages.push({
    role: 'user',
    content: newMessage
  });

  return messages;
}

/**
 * Calls Workers AI to analyze a log/error message
 */
export async function analyzeLog(
  ai: any,
  history: Message[],
  logMessage: string
): Promise<AnalysisResponse> {
  try {
    const messages = formatMessages(history, logMessage);

    const response = await ai.run('@cf/meta/llama-3-8b-instruct', {
      messages,
      temperature: 0.3, // Lower temperature for more focused, technical responses
      max_tokens: 1024,
    });

    // Parse the AI response
    let analysisText = response.response || '';
    
    // Try to extract JSON from the response
    // Sometimes the model adds markdown code blocks or extra text
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      analysisText = jsonMatch[0];
    }

    try {
      const parsed = JSON.parse(analysisText);
      
      // Validate the response structure
      if (!parsed.summary || !parsed.reasoning || !parsed.potential_fix) {
        throw new Error('Invalid response structure');
      }

      return {
        summary: parsed.summary.trim(),
        reasoning: parsed.reasoning.trim(),
        potential_fix: parsed.potential_fix.trim(),
      };
    } catch (parseError) {
      // Fallback: if JSON parsing fails, create a structured response
      console.error('[analyzeLog] Failed to parse AI response:', parseError);
      
      return {
        summary: 'Analysis completed but response format was unexpected',
        reasoning: analysisText,
        potential_fix: 'Please review the reasoning section for details.',
      };
    }
  } catch (error) {
    console.error('[analyzeLog] Error calling Workers AI:', error);
    
    // Return a graceful error response
    return {
      summary: 'Failed to analyze the log',
      reasoning: `An error occurred while processing your request: ${error instanceof Error ? error.message : 'Unknown error'}`,
      potential_fix: 'Please try again or check the log format.',
    };
  }
}

/**
 * Quick validation to check if a message looks like a log/error
 */
export function isLikelyLog(message: string): boolean {
  const logIndicators = [
    /error/i,
    /exception/i,
    /stack trace/i,
    /at\s+[\w.]+\s*\(/i, // Stack trace pattern
    /\d{4}-\d{2}-\d{2}/, // Date pattern
    /\[.*?\]/, // Log level brackets
    /HTTP\/\d\.\d/, // HTTP version
    /\d{3}\s+(OK|Error|Not Found)/i, // HTTP status
  ];

  return logIndicators.some(pattern => pattern.test(message));
}
