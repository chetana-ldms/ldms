import React, { useState } from "react";

const ChatFooter = ({ socket, username }) => {
  const [message, setMessage] = useState("");
  const handleTyping = () => socket.emit("typing", `${username} is typing`);

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log("Sending message:", message); // Check if the message is correctly captured
    console.log("Username:", sessionStorage.getItem("userName")); // Check if the username is retrieved correctly
    if (message.trim() && sessionStorage.getItem("userName")) {
      console.log("Sending message through socket...");
      socket.emit("message", {
        text: message,
        name: username,
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
    }
    setMessage("");
  };
  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          // onKeyDown={handleTyping}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;
