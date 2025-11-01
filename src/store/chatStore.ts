import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'llm';
  question?: string;
  answer?: string;
  plan?: string;
  planHistory?: string[]; // NEW: accumulate plan entries
  suggestions?: string[];
  isStreaming?: boolean;
}

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  suggestions: string[];
  addMessage: (msg: Partial<ChatMessage> & { id?: string }) => void;
  updateMessageById: (id: string, partial: Partial<ChatMessage>) => void;
  appendToMessageAnswer: (id: string, suffix: string) => void;
  appendPlanToMessage: (id: string, planEntry: string) => void; // NEW
  removeMessageById: (id: string) => void;
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

  addMessage: (msg) =>
    set((state) => {
      const id =
        msg.id ??
        (typeof globalThis !== 'undefined' && (globalThis as any).crypto?.randomUUID
          ? (globalThis as any).crypto.randomUUID()
          : String(Date.now()));
      const newMsg: ChatMessage = {
        id,
        sender: msg.sender ?? 'llm',
        question: msg.question,
        answer: msg.answer,
        plan: msg.plan,
        planHistory: msg.plan ? [msg.plan] : [],
        suggestions: msg.suggestions,
        isStreaming: !!msg.isStreaming,
      };
      return { messages: [...state.messages, newMsg] };
    }),

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

  // NEW: append a plan entry only if non-empty and different from last
  appendPlanToMessage: (id, planEntry) =>
    set((state) => ({
      messages: state.messages.map((m) => {
        if (m.id !== id) return m;
        const history = m.planHistory ?? [];
        if (!planEntry) return m;
        if (history.length === 0 || history[history.length - 1] !== planEntry) {
          const newHistory = [...history, planEntry];
          return { ...m, planHistory: newHistory, plan: planEntry };
        }
        return m;
      }),
    })),

  removeMessageById: (id) =>
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id),
    })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSuggestions: (suggestions) => set({ suggestions }),
  clear: () => set({ messages: [], suggestions: [], error: null, loading: false }),
}));

// Helper that adds a message and returns its deterministic id synchronously.
export function addMessageWithId(msg: Partial<ChatMessage> & { id?: string }): string {
  const id =
    msg.id ??
    (typeof globalThis !== 'undefined' && (globalThis as any).crypto?.randomUUID
      ? (globalThis as any).crypto.randomUUID()
      : String(Date.now()));
  useChatStore.getState().addMessage({ ...msg, id });
  return id;
}