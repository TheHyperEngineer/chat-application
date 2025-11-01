import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'llm';
  question?: string;
  answer?: string;
  // CHANGED: Plan is now an array of strings
  plan?: string[];
  suggestions?: string[];
  isStreaming?: boolean;
}

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  suggestions: string[];
  addMessage: (msg: Partial<ChatMessage> & { id?: string }) => string;
  updateMessageById: (id: string, partial: Partial<ChatMessage>) => void;
  appendToMessageAnswer: (id: string, suffix: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuggestions: (suggestions: string[]) => void;
  clear: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  loading: false,
  error: null,
  suggestions: [],

  addMessage: (msg) => {
    const id = msg.id ?? crypto.randomUUID();
    const newMsg: ChatMessage = {
      id,
      sender: msg.sender ?? 'llm',
      question: msg.question,
      answer: msg.answer,
      plan: msg.plan,
      suggestions: msg.suggestions,
      isStreaming: !!msg.isStreaming,
    };
    set((state) => ({ messages: [...state.messages, newMsg] }));
    return id;
  },

  updateMessageById: (id, partial) =>
    set((state) => ({
      messages: state.messages.map((m) => (m.id === id ? { ...m, ...partial } : m)),
    })),

  appendToMessageAnswer: (id, suffix) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, answer: (m.answer ?? '') + (suffix ?? '') } : m
      ),
    })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSuggestions: (suggestions) => set({ suggestions }),
  clear: () => set({ messages: [], suggestions: [], error: null, loading: false }),
}));