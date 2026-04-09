import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";
import {v1 as uuidv1} from "uuid";
import api from "../api.js";

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);
    const { user, logout } = useAuth();

    const getAllThreads = async () => {
        try {
            const response = await api.get("/api/thread");
            const filteredData = response.data.map(thread => ({threadId: thread.threadId, title: thread.title}));
            //console.log(filteredData);
            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await api.get(`/api/thread/${newThreadId}`);
            const res = response.data;
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch(err) {
            console.log(err);
        }
    }   

    const deleteThread = async (threadId) => {
        try {
            const response = await api.delete(`/api/thread/${threadId}`);
            const res = response.data;
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch(err) {
            console.log(err);
        }
    }

    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
                <div className="logo">
                    <span className="logo-text">Nexa</span>
                    <span className="logo-accent">AI</span>
                </div>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>


            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} 
                            onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted": " "}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation(); //stop event bubbling
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>
 
            <div className="user-info">
                <div className="user-details">
                    <div className="user-avatar">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="user-text">
                        <p className="username">{user?.username || 'User'}</p>
                        <p className="user-email">{user?.email || ''}</p>
                    </div>
                </div>
                <button className="logout-btn" onClick={logout}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Logout
                </button>
            </div>
            <div className="sign">
                <p className="brand-name">NexaAI</p>
                <p className="brand-tagline">Your AI Assistant</p>
            </div>
        </section>
    )
}

export default Sidebar;