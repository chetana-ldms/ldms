import React, { useEffect, useState, useRef } from "react";
import ChatBar from "./ChatBar";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

const ChatPage = ({ socket, selectedIncident }) => {
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");
  const lastMessageRef = useRef(null);
  const [refreshChatHistory, setRefreshChatHistory] = useState(false);

  useEffect(() => {
    socket.on("messageResponse", (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  useEffect(() => {
    socket.on("typingResponse", (data) => setTypingStatus(data));
  }, [socket]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleRefreshChatHistory = () => {
    setRefreshChatHistory(true);
  };
  const resetMessages = () => {
    setMessages([]);
  };

  return (
    <div className="chat-app">
      {/* <ChatBar socket={socket} username={sessionStorage.getItem("userName")} /> */}
      <div className="chat__main">
        <ChatBody
          messages={messages}
          typingStatus={typingStatus}
          lastMessageRef={lastMessageRef}
          selectedIncident={selectedIncident}
          setRefreshChatHistory={setRefreshChatHistory}
          resetMessages={resetMessages}
        />
        <ChatFooter
          socket={socket}
          username={sessionStorage.getItem("userName")}
          selectedIncident={selectedIncident}
          onSendMessage={handleRefreshChatHistory}
        />
      </div>
    </div>
  );
};

export default ChatPage;
