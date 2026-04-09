import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        if (!reply) {
            setLatestReply(null);
            return;
        }

        if (!prevChats?.length) return;

        const lastChat = prevChats[prevChats.length - 1];

        if (lastChat?.role !== "assistant") {
            setLatestReply(null);
            return;
        }

        const content = reply.split(" ");
        let idx = 0;

        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));
            idx++;

            if (idx >= content.length) {
                clearInterval(interval);
            }
        }, 40);

        return () => clearInterval(interval);
    }, [prevChats, reply]);

    const lastChat = prevChats?.[prevChats.length - 1];
    const showTypingEffect = lastChat?.role === "assistant";

    return (
        <>
            {newChat && (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <i className="fa-solid fa-comments"></i>
                    </div>
                    <h1>Start a New Chat!</h1>
                    <p>Ask me anything, I'm here to help you with your questions.</p>
                </div>
            )}

            <div className="chats">
                {showTypingEffect
                    ? prevChats?.slice(0, -1).map((chat, idx) => (
                          <div
                              className={chat.role === "user" ? "userDiv" : "gptDiv"}
                              key={idx}
                          >
                              {chat.role === "user" ? (
                                  <p className="userMessage">{chat.content}</p>
                              ) : (
                                  <div className="assistantMessage">
                                      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                          {chat.content}
                                      </ReactMarkdown>
                                  </div>
                              )}
                          </div>
                      ))
                    : prevChats?.map((chat, idx) => (
                          <div
                              className={chat.role === "user" ? "userDiv" : "gptDiv"}
                              key={idx}
                          >
                              {chat.role === "user" ? (
                                  <p className="userMessage">{chat.content}</p>
                              ) : (
                                  <div className="assistantMessage">
                                      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                          {chat.content}
                                      </ReactMarkdown>
                                  </div>
                              )}
                          </div>
                      ))}

                {showTypingEffect && (
                    <div className="gptDiv" key="typing">
                        <div className="assistantMessage">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {latestReply || lastChat.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Chat;