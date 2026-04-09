import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import ChatWindow from "./ChatWindow.jsx"
import { MyContext } from './MyContext.jsx'   
import Sidebar from "./Sidebar.jsx"
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import {v1 as uuidv1} from "uuid"

function ChatApp() {  
   const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);
    const[currThreadId,setCurrThreadId]=useState(uuidv1());
    const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
    const [newChat, setNewChat] = useState(true);
    const [allThreads, setAllThreads] = useState([]);
  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId,setCurrThreadId,
     newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  }; 
   

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <Sidebar/>
        <ChatWindow />
      </MyContext.Provider>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <ChatApp />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App