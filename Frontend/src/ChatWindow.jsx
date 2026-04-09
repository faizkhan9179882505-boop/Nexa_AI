import "./ChatWindow.css";
import Chat from "./Chat";
import { MyContext } from "./MyContext";
import { useContext, useState } from "react";
import { ScaleLoader } from "react-spinners";
import axios from "axios";
import { useAuth } from "./contexts/AuthContext.jsx";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat
  } = useContext(MyContext);
  
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = prompt; // save current input before clearing
    setLoading(true);
    setNewChat(false);

    try {
      const response = await axios.post("/api/chat", {
        message: userMessage,
        threadId: currThreadId,
      });

      const data = response.data;
      console.log(data.reply);

      setReply(data.reply);

      setPrevChats((prev) => [
        ...prev,
        {
          role: "user",
          content: userMessage,
        },
        {
          role: "assistant",
          content: data.reply,
        },
      ]);

      setPrompt("");
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          NexaAI <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv">
          <span className="userIcon">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
      </div>

      <Chat />

      <ScaleLoader color="#fff" loading={loading} />

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e)=> e.key==='Enter'?handleSend():''}
          />
          <div id="submit" onClick={handleSend}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        <p className="info">
          NexaAI can make mistakes. Check important info. See Cookie Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;