import React, { useState } from "react";
import axios from "axios";
import { fetchAddChatMessage } from "../../../../../api/IncidentsApi";

const ChatFooter = ({ socket, username, selectedIncident, onSendMessage }) => {
  const userID = Number(sessionStorage.getItem("userId"));
  const orgId = Number(sessionStorage.getItem("orgId"));
  const { incidentID } = selectedIncident;
  const id = incidentID;
  const date = new Date().toISOString();
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);

  const handleTyping = () => socket.emit("typing", `${username} is typing`);

  // const handleSendMessage = async (e) => {
  //   e.preventDefault();
  //   if (message.trim() || attachment) {
  //     const messageData = {
  //       text: message,
  //       name: username,
  //       attachment: attachment
  //     };
  //     const formData = {
  //       orgId,
  //       fromUserID: userID,
  //       toUserID: 0,
  //       chatMessage: message || attachment,
  //       chatSubject: "Incident",
  //       subjectRefID: id,
  //       messsageDate: date
  //     };
  //     try {
  //       const response = await fetchAddChatMessage(formData);
  //       console.log(response, "chat Add api");
  //       onSendMessage();
  //     } catch (error) {
  //       console.log("Error sending chat message:", error);
  //     }
  //   }
  //   setMessage("");
  //   setAttachment(null);
  // };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    console.log("attachment:", attachment);
    if (message.trim() || attachment) {
      const formData = new FormData();
      formData.append("ChatAttachmentFile", attachment ? attachment.data : "");
      formData.append("MesssageDate", date || "");
      formData.append("OrgId", orgId || "");
      formData.append("FromUserID", userID || "");
      formData.append("ToUserID", 0);
      formData.append("ChatMessage", message || (attachment ? attachment.name : ""));
      formData.append("ChatSubject", "Incident");
      formData.append("SubjectRefID", id || "");
      // formData.append("AttachmentName", attachment ? attachment.name : ""); 
      
      try {
        const response = await fetchAddChatMessage(formData);
        console.log(response, "chat Add API");
        onSendMessage();
      } catch (error) {
        console.log(error);
      }
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
          data: reader.result.split(",")[1]
        });
      };
    } else {
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
        <button className="sendBtn" type="submit">
          <i className="fa fa-paper-plane" />
        </button>
      </form>
    </div>
  );
};

export default ChatFooter;
