/**
 * API Service for communicating with the backend Worker
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AnalysisResponse {
  summary: string;
  reasoning: string;
  potential_fix: string;
}

export interface ChatResponse {
  success: boolean;
  sessionId: string;
  analysis: AnalysisResponse;
  messageCount: number;
}

export interface HistoryResponse {
  success: boolean;
  sessionId: string;
  messages: Message[];
  count: number;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}

/**
 * Sends a message to the backend for analysis
 */
export async function sendMessage(
  message: string,
  sessionId: string
): Promise<ChatResponse> {
  console.log('📤 [sendMessage] Sending request to backend...');
  console.log('📤 [sendMessage] API URL:', API_URL);
  console.log('📤 [sendMessage] Session ID:', sessionId);
  
  try {
    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error('⏱️ [sendMessage] Request timeout after 60 seconds');
      controller.abort();
    }, 60000); // 60 second timeout

    console.log('📤 [sendMessage] Fetching...');
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, sessionId }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('📥 [sendMessage] Response received. Status:', response.status);

    if (!response.ok) {
      console.error('❌ [sendMessage] Response not OK:', response.status);
      let errorData: ErrorResponse;
      try {
        errorData = await response.json();
      } catch (parseError) {
        console.error('❌ [sendMessage] Failed to parse error response');
        throw new Error(`HTTP ${response.status}: Failed to send message`);
      }
      throw new Error(errorData.message || errorData.error || 'Failed to send message');
    }

    console.log('📥 [sendMessage] Parsing response...');
    const data: ChatResponse = await response.json();
    console.log('✅ [sendMessage] Success! Analysis received');
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('⏱️ [sendMessage] Request aborted (timeout)');
      throw new Error('Request timeout - the AI is taking too long to respond. Please try again.');
    }
    console.error('❌ [sendMessage] API Error:', error);
    throw error;
  }
}

/**
 * Retrieves chat history for a session
 */
export async function getHistory(sessionId: string): Promise<HistoryResponse> {
  try {
    const response = await fetch(`${API_URL}/api/history/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || errorData.error || 'Failed to get history');
    }

    const data: HistoryResponse = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Health check for the backend
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

/**
 * Sends anomaly data to backend for AI analysis
 */
export async function sendAnomalyAnalysis(
  anomaly: any,
  traffic: any[]
): Promise<any> {
  console.log('📤 [sendAnomalyAnalysis] Analyzing anomaly...');
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error('⏱️ [sendAnomalyAnalysis] Request timeout');
      controller.abort();
    }, 60000);

    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ anomaly, traffic }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to analyze anomaly`);
    }

    const data = await response.json();
    console.log('✅ [sendAnomalyAnalysis] Analysis received');
    return data.analysis;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - AI analysis taking too long');
    }
    console.error('❌ [sendAnomalyAnalysis] Error:', error);
    throw error;
  }
}

/**
 * Sends a chat message with simulation context
 */
export async function sendChatMessage(
  message: string,
  context?: any
): Promise<{ message: string }> {
  console.log('📤 [sendChatMessage] Sending chat message...');
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error('⏱️ [sendChatMessage] Request timeout');
      controller.abort();
    }, 60000);

    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        sessionId: `session-${Date.now()}`,
        context 
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to send chat message`);
    }

    const data = await response.json();
    console.log('✅ [sendChatMessage] Response received');
    
    // Extract message from analysis
    if (data.analysis) {
      return {
        message: `${data.analysis.summary}\n\n${data.analysis.reasoning}\n\n**Suggested Action:** ${data.analysis.potential_fix}`
      };
    }
    
    return { message: 'Response received from AI' };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - Chat response taking too long');
    }
    console.error('❌ [sendChatMessage] Error:', error);
    throw error;
  }
}
