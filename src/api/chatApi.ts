import axios from 'axios';
import type { ChatMessage } from '../store/chatStore';

export interface ChatResponse {
  question: string;
  conversationId: string;
  plan: string;
  answer: string;
  suggestions: string[];
}

export async function startSession(userId: string): Promise<string | null> {
  // Replace with your backend endpoint
  try {
    const res = await axios.post('/api/session', { userId });
    return res.data.conversationId;
  } catch (e) {
    // Suppress error, return null
    return null;
  }
}

export async function sendMessage(
  conversationId: string,
  question: string,
  onChunk: (data: ChatResponse) => void,
  onError: (err: any) => void
) {
  try {
    const response = await fetch(`/api/chat/${conversationId}/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    if (!response.body) throw new Error('No response body');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let partial = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      partial += decoder.decode(value, { stream: true });
      // Split by newlines for NDJSON or chunked JSON
      const parts = partial.split('\n').filter(Boolean);
      for (const part of parts) {
        try {
          const data = JSON.parse(part);
          onChunk(data);
        } catch (e) {
          // Wait for more data
        }
      }
      partial = '';
    }
  } catch (err) {
    onError(err);
  }
}
