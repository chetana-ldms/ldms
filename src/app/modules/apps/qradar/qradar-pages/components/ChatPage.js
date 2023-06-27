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
    // Scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleRefreshChatHistory = () => {
    setRefreshChatHistory(true);
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
          refreshChatHistory={refreshChatHistory}
          setRefreshChatHistory={setRefreshChatHistory}
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
