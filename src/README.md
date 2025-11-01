# Zero-Shot Prompt for LLM: Modern React + TypeScript Chat UI

---

**You are an expert front-end engineer and prompt engineer. Generate a complete, production-ready, modular React + TypeScript chat UI project with the following exact requirements and structure.**

---

## 1. Project Overview

- Build a modern, responsive chat UI using React 18+, TypeScript, Zustand, Material UI (MUI), and Font Awesome.
- The UI must support session-based, streaming chat between a human user and an LLM backend (REST API, streaming responses).
- The application must be ready to deploy (Vite or Create React App structure), with robust error handling and accessibility.

---

## 2. Project Structure

```
src/
  api/
    chatApi.ts
  components/
    ChatWindow.tsx
    MessageList.tsx
    MessageInput.tsx
    SessionHeader.tsx
    SuggestionBar.tsx
    Loader.tsx
  hooks/
    useChatStream.ts
    useSession.ts
  store/
    chatStore.ts
    sessionStore.ts
  assets/
  App.tsx
  main.tsx
  index.css
  App.css
  theme.ts (optional for MUI theme)
public/
  index.html
package.json
tsconfig.json
vite.config.ts
eslint.config.js
README.md
```

---

## 3. Functional Requirements

- **Session Management:** Each chat starts a session with a unique conversationId (from backend). Store session info in Zustand.
- **Chat UI:**
  - Header at the top (SessionHeader).
  - Large, scrollable chat area (MessageList) in the center.
  - User input and send button at the bottom (MessageInput).
  - Suggestions bar and loader as needed.
  - The chat window is centered horizontally and vertically, occupying 60% of the screen width on desktop, responsive for mobile.
- **Message Alignment:** User messages are left-aligned; LLM/app responses are right-aligned.
- **Streaming Responses:** LLM responses (including error messages) are streamed character by character in the chat area.
- **Error Handling:**
  - If the backend is not connected or session cannot be established, show a polite, streamed error message in the chat area.
  - Suppress and handle all API errors gracefully; do not crash or spam the console.
- **State Management:** Use Zustand for chat and session state.
- **Accessibility:** Use MUI and ARIA best practices.
- **Styling:** Use Material UI for layout and theming, Font Awesome for icons, and ensure no scrollbars except in the chat area.
- **Testability:** Code must be modular and testable.

---

## 4. Implementation Details

- **API Layer (`api/chatApi.ts`):**

  - `startSession(userId: string): Promise<string | null>`: POST to `/api/session`, return conversationId or null on error.
  - `sendMessage(conversationId, question, onChunk, onError)`: POST to `/api/chat/{conversationId}/stream`, stream NDJSON responses, call `onChunk` for each, `onError` on failure.

- **Zustand Stores:**

  - `chatStore.ts`: messages, loading, error, suggestions, add/update/clear methods.
  - `sessionStore.ts`: conversationId, userId, set/clear methods.

- **Hooks:**

  - `useSession(userId)`: Starts session, stores conversationId, handles errors.
  - `useChatStream()`: Handles sending user messages, streaming LLM responses, and error streaming.

- **Components:**

  - `ChatWindow.tsx`: Main layout, centers chat UI.
  - `MessageList.tsx`: Renders messages, aligns user left and LLM right, uses MUI and Font Awesome.
  - `MessageInput.tsx`: User input, always enabled, sends message on Enter/click.
  - `SessionHeader.tsx`: Shows session/conversation info.
  - `SuggestionBar.tsx`: Shows clickable suggestions.
  - `Loader.tsx`: Shows loading spinner when waiting for response.

- **Streaming Simulation:** If backend is not connected, stream the error message character by character in the chat area.

- **Styling:**

  - No scrollbars on the main page; only the chat area is scrollable.
  - Chat window is centered and responsive.
  - Use MUI theming and Font Awesome icons.

- **Error Handling:**
  - All API errors are caught and handled.
  - If session cannot be established, show a streamed error message in the chat area.

---

## 5. Example: Streaming Error Message

```typescript
// In useChatStream.ts
if (!conversationId) {
  const politeMsg =
    "Sorry, the chat UI is not connected to the backend service at the moment. Please try again later.";
  const llmMsgId = (Date.now() + 1).toString();
  addMessage({ id: llmMsgId, sender: "llm", answer: "", isStreaming: true });
  let i = 0;
  const stream = () => {
    i++;
    updateLastMessage({ answer: politeMsg.slice(0, i) });
    if (i < politeMsg.length) setTimeout(stream, 15);
    else updateLastMessage({ isStreaming: false });
  };
  stream();
  return;
}
```

---

## 6. Console Error Suppression

- All API errors (e.g., 404 on `/api/session`) must be caught and not shown in the console or crash the app.

---

## 7. Acceptance Criteria

- The UI and all code must match the described structure and behavior exactly.
- No bugs, no unhandled errors, and all features must work as described.
- The code must be modular, readable, and ready for production.

---

**Generate the complete project as described above, with all files, code, and configuration, using best practices for React, TypeScript, Zustand, Material UI, and Font Awesome.**
