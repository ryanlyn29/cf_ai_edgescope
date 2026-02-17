'use client';

/**
 * Chat Panel Component
 * AI-powered chat interface for simulation insights
 */

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { sendChatMessage } from '@/services/api';

export function ChatPanel() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { chatMessages, addChatMessage, traffic, anomalies, metrics } = useAppStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user' as const,
      content: input.trim(),
      timestamp: Date.now(),
    };

    addChatMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      // Send context with the message
      const context = {
        trafficCount: traffic.length,
        anomalyCount: anomalies.length,
        metrics,
        recentAnomalies: anomalies.slice(-3),
      };

      const response = await sendChatMessage(input.trim(), context);
      
      const assistantMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant' as const,
        content: response.message,
        timestamp: Date.now(),
      };

      addChatMessage(assistantMessage);
    } catch (error) {
      const errorMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: Date.now(),
      };
      addChatMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-lg border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
          <Bot className="h-4 w-4" style={{ color: 'var(--primary)' }} />
          AI Assistant
        </h3>
        <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Ask questions about simulations and anomalies
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
            <Bot className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Start a conversation with the AI assistant</p>
            <p className="text-xs mt-2">Try asking:</p>
            <div className="mt-2 space-y-1 text-xs">
              <p>"What anomaly just occurred?"</p>
              <p>"Why is latency increasing?"</p>
              <p>"Summarize this simulation"</p>
            </div>
          </div>
        )}

        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                <Bot className="h-4 w-4" style={{ color: 'var(--primary-foreground)' }} />
              </div>
            )}
            
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'border'
              }`}
              style={message.role === 'assistant' ? { backgroundColor: 'var(--secondary)', borderColor: 'var(--border)' } : undefined}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-60">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--secondary)' }}>
                <User className="h-4 w-4" style={{ color: 'var(--foreground)' }} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
              <Bot className="h-4 w-4" style={{ color: 'var(--primary-foreground)' }} />
            </div>
            <div className="max-w-[80%] rounded-lg px-4 py-2 border" style={{ backgroundColor: 'var(--secondary)', borderColor: 'var(--border)' }}>
              <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'var(--muted-foreground)' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about anomalies, metrics, or simulations..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 disabled:opacity-50"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
