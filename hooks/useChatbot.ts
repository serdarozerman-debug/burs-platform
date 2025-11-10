'use client';

import { useState } from 'react';
import { ChatMessage, ChatbotRequest, ChatbotResponse } from '@/types/chatbot';
import { apiClient } from '@/lib/api-client';

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(message: string, context?: any) {
    if (!message.trim()) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      setLoading(true);
      setError(null);

      const request: ChatbotRequest = {
        message,
        conversation_id: conversationId || undefined,
        context,
      };

      const response = await apiClient.post<ChatbotResponse>(
        '/api/chatbot',
        request
      );

      // Add assistant message
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.reply,
        recommended_scholarships: response.scholarships?.map(s => s.id),
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Update conversation ID
      if (response.conversation_id) {
        setConversationId(response.conversation_id);
      }

      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function clearMessages() {
    setMessages([]);
    setConversationId(null);
    setError(null);
  }

  return {
    messages,
    conversationId,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
}

