import React, { useState } from "react";
import { fetchAddChatMessage } from "../../../../../api/IncidentsApi";

const ChatFooter = ({ socket, username, selectedIncident, onSendMessage }) => {
  const userID = Number(sessionStorage.getItem("userId"));
  const orgId = Number(sessionStorage.getItem("orgId"));
  const { incidentID } = selectedIncident;
  const id = incidentID;
  const date = new Date().toISOString();
  const [message, setMessage] = useState("");
  console.log(message, "message");
  const [attachment, setAttachment] = useState(null);

  const handleTyping = () => socket.emit("typing", `${username} is typing`);

  const handleSendMessage = async (e) => {
    console.log(e, "handleSendMessage");
    e.preventDefault();
    console.log("attachment:", attachment);
    if (message.trim() || attachment) {
      const formData = new FormData();
      formData.append("MesssageDate", date || "");
      formData.append("OrgId", orgId || 0);
      formData.append("FromUserID", userID || 0);
      formData.append("ToUserID", 0);
      formData.append("ChatMessage", message || "");
      formData.append("ChatSubject", "Incident");
      formData.append("SubjectRefID", id || 0);
      if (attachment) {
        // Convert base64 data to binary data
        const binaryAttachment = atob(attachment.data);
        const byteArray = new Uint8Array(binaryAttachment.length);
        for (let i = 0; i < binaryAttachment.length; i++) {
          byteArray[i] = binaryAttachment.charCodeAt(i);
        }

        // Create a new Blob with the binary data
        const blob = new Blob([byteArray], { type: attachment.type });

        // Create a new File object from the Blob
        const file = new File([blob], attachment.name, {
          type: attachment.type,
        });

        // Append the file as an IFormFile
        formData.append("ChatAttachmentFile", file);
      }

      console.log("formData:", formData);
      try {
        const response = await fetchAddChatMessage(formData);
        console.log(response, "chat Add API");
        const date = new Date().toISOString();
        socket.emit("message", {
          text: message,
          name: username,
          attachment: attachment,
          incidentID: id,
          createdDate: date,
        });
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
                className="attachment link text-underline"
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
