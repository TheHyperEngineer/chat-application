import "./App.css";
import ChatWindow from "./components/ChatWindow";
import { useSession } from "./hooks/useSession";

function App() {
  // For demo, use a static userId. In real app, get from auth/user context.
  useSession("demo-user");
  return <ChatWindow />;
}

export default App;
