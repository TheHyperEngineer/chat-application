import { create } from 'zustand';

interface SessionState {
  conversationId: string | null;
  userId: string | null;
  setConversationId: (id: string) => void;
  setUserId: (id: string) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  conversationId: null,
  userId: null,
  setConversationId: (id) => set({ conversationId: id }),
  setUserId: (id) => set({ userId: id }),
  clearSession: () => set({ conversationId: null, userId: null }),
}));
