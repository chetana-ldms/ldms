// ChatFooter.jsx
import React, { useState } from "react";

const ChatFooter = ({ socket, username }) => {
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);

  const handleTyping = () => socket.emit("typing", `${username} is typing`);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() || attachment) {
      socket.emit("message", {
        text: message,
        name: username,
        attachment: attachment,
      });
    }
    setMessage("");
    setAttachment(null);
  };

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    e.target.value = ""; // Clear the input value

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setAttachment({
          name: file.name,
          type: file.type,
          data: reader.result.split(",")[1],
        });
      };
    } else {
      // If no file is selected, clear the attachment state
      setAttachment(null);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <div className="send-input-container">
          <input
            type="text"
            placeholder="Write message"
            className="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {attachment && (
            <div className="attachment-section">
              <input
                type="text"
                placeholder="Attachment"
                className="attachment"
                value={attachment.name}
                readOnly
              />

              <i
                className="fa fa-times remove"
                onClick={handleRemoveAttachment}
              />
            </div>
          )}
        </div>
        <label htmlFor="attachment" className="attachment__label">
          <input
            id="attachment"
            type="file"
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleAttachmentChange}
            style={{ display: "none" }}
          />
          <i className="fa fa-paperclip" />
        </label>
        <button className="sendBtn">
          <i className="fa fa-paper-plane" />
        </button>
      </form>
    </div>
  );
};

export default ChatFooter;
