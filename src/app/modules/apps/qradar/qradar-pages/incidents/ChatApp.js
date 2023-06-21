import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import ChatPage from "../components/ChatPage";

const ChatApp = () => {
  const [socket, setSocket] = useState(null);
  const userId = sessionStorage.getItem("userId");
  const orgId = sessionStorage.getItem("orgId");
  const userName = sessionStorage.getItem("userName");

  useEffect(() => {
    // Create a socket connection
    console.log("Attempting to establish socket connection...");
    const socketInstance = io("http://localhost:4000");
    setSocket(socketInstance);
    console.log("Socket:", socketInstance);

    // Clean up the socket connection on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [userId, userName, orgId]);

  return (
    <div className="app-chat">
      {socket ? <ChatPage socket={socket} /> : <div>Loading...</div>}
    </div>
  );
};

export default ChatApp;
