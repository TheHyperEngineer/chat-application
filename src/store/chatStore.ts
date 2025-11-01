import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'llm';
  question?: string;
  answer?: string;
  plan?: string;
  suggestions?: string[];
  isStreaming?: boolean;
}

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  suggestions: string[];
  addMessage: (msg: ChatMessage) => void;
  updateLastMessage: (partial: Partial<ChatMessage>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuggestions: (suggestions: string[]) => void;
  clear: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
  error: null,
  suggestions: [],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  updateLastMessage: (partial) => set((state) => {
    const messages = [...state.messages];
    if (messages.length > 0) {
      messages[messages.length - 1] = {
        ...messages[messages.length - 1],
        ...partial,
      };
    }
    return { messages };
  }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSuggestions: (suggestions) => set({ suggestions }),
  clear: () => set({ messages: [], suggestions: [], error: null, loading: false }),
}));
