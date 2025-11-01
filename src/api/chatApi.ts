import axios from 'axios';

// --- Types ---
export interface ChatResponse {
  question: string;
  conversationId: string;
  plan?: string;
  answer: string;
  suggestions?: string[];
  error?: string;
  code?: string;
  finalChunk?: boolean; // added: indicates this is the last chunk
}

export interface Session {
  conversationId: string;
}

const API_BASE = 'http://localhost:8080/api';

// --- Start a new chat session ---
export async function startSession(userId: string): Promise<Session> {
  try {
    const res = await axios.post(`${API_BASE}/session`, { userId });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Failed to start session');
  }
}

// --- Send a message and receive streaming NDJSON ---
export async function sendMessage(
  conversationId: string,
  question: string,
  onMessage: (msg: ChatResponse) => void,
  onError?: (err: Error) => void,
  signal?: AbortSignal
): Promise<void> {
  const url = `${API_BASE}/chat/${encodeURIComponent(conversationId)}/stream`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
      signal,
    });
    if (!response.body) throw new Error('No response body');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let shouldContinue = true;

    while (shouldContinue) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const data: ChatResponse = JSON.parse(line);
          onMessage(data);
          if (data.finalChunk) {
            // stop reading further — this is the last chunk
            shouldContinue = false;
            break;
          }
        } catch (e) {
          // Ignore malformed lines
        }
      }
    }

    if (buffer.trim()) {
      try {
        const data: ChatResponse = JSON.parse(buffer);
        onMessage(data);
      } catch (e) {
        // Ignore malformed last line
      }
    }
  } catch (err: any) {
    if (onError) onError(err instanceof Error ? err : new Error('Unknown error'));
    else handleApiError(err, 'Streaming error');
  }
}

// --- End a chat session ---
export async function endSession(conversationId: string): Promise<void> {
  try {
    await axios.post(`${API_BASE}/session/${encodeURIComponent(conversationId)}/end`);
  } catch (err) {
    handleApiError(err, 'Failed to end session');
  }
}

// --- Error handling ---
function handleApiError(err: unknown, context: string): never {
  let message = context;
  if (axios.isAxiosError(err)) {
    message += `: ${err.response?.data?.message || err.message}`;
  } else if (err instanceof Error) {
    message += `: ${err.message}`;
  }
  throw new Error(message);
}
