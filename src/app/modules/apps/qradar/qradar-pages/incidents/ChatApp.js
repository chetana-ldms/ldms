import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import ChatPage from "../components/ChatPage";
import { fetchGetChatHistory } from "../../../../../api/IncidentsApi";

const ChatApp = ({ selectedIncident }) => {
  const [socket, setSocket] = useState(null);
  const userId = sessionStorage.getItem("userId");
  const orgId = sessionStorage.getItem("orgId");
  const userName = sessionStorage.getItem("userName");

  useEffect(() => {
    // Create a socket connection
    console.log("Attempting to establish socket connection...");
    const socketInstance = io("http://182.71.241.246:4000");
    setSocket(socketInstance);
    console.log("Socket:", socketInstance);

    // Clean up the socket connection on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [userId, userName, orgId]);

  return (
    <div className="app-chat">
      {socket ? (
        <ChatPage socket={socket} selectedIncident={selectedIncident} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ChatApp;
