/**
 * Memory layer using Cloudflare KV
 * Manages chat history persistence by session ID
 */

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatHistory {
  sessionId: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Retrieves chat history for a given session ID
 * Returns empty array if session doesn't exist
 */
export async function getHistory(
  kv: KVNamespace,
  sessionId: string
): Promise<Message[]> {
  try {
    const data = await kv.get(`session:${sessionId}`, 'json');
    
    if (!data) {
      return [];
    }

    const history = data as ChatHistory;
    return history.messages || [];
  } catch (error) {
    console.error('Error retrieving history:', error);
    return [];
  }
}

/**
 * Saves chat history for a given session ID
 */
export async function saveHistory(
  kv: KVNamespace,
  sessionId: string,
  messages: Message[]
): Promise<void> {
  try {
    const existingData = await kv.get(`session:${sessionId}`, 'json');
    const existingHistory = existingData as ChatHistory | null;

    const history: ChatHistory = {
      sessionId,
      messages,
      createdAt: existingHistory?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    // Store for 30 days (60 * 60 * 24 * 30 seconds)
    await kv.put(`session:${sessionId}`, JSON.stringify(history), {
      expirationTtl: 2592000,
    });
  } catch (error) {
    console.error('Error saving history:', error);
    throw error;
  }
}

/**
 * Lists all active sessions (for debugging/admin purposes)
 */
export async function listSessions(kv: KVNamespace): Promise<string[]> {
  try {
    const list = await kv.list({ prefix: 'session:' });
    return list.keys.map(key => key.name.replace('session:', ''));
  } catch (error) {
    console.error('Error listing sessions:', error);
    return [];
  }
}

/**
 * Deletes a session's chat history
 */
export async function deleteSession(
  kv: KVNamespace,
  sessionId: string
): Promise<void> {
  try {
    await kv.delete(`session:${sessionId}`);
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
}
