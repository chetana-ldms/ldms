import React, { useEffect, useState } from "react";
import { fetchGetChatHistory } from "../../../../../api/IncidentsApi";

const ChatBody = ({
  messages,
  typingStatus,
  lastMessageRef,
  selectedIncident,
  refreshChatHistory,
  setRefreshChatHistory
}) => {
  const loggedInUserName = sessionStorage.getItem("userName");
  const { incidentID } = selectedIncident;
  const id = incidentID;
  const orgId = sessionStorage.getItem("orgId");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch chat history for the selected incident
      const data = {
        orgId: orgId,
        subject: "Incident",
        subjectRefId: id
      };
      const chatHistory = await fetchGetChatHistory(data);
      setChatHistory(chatHistory || []);
      setRefreshChatHistory(false); // Reset the refresh trigger
    };

    fetchData();
  }, [id, refreshChatHistory, setRefreshChatHistory]);

  const exportChatHistory = () => {
    const filename = `Chat_History_Incident_${id}.txt`;
    const formattedChatHistory = chatHistory
      .map(message => `${message.fromUserName}: ${message.chatMessage}`)
      .join("\n");

    const element = document.createElement("a");
    element.href = "data:text/plain;charset=utf-8," + encodeURIComponent(formattedChatHistory);
    element.download = filename;
    element.click();
  };

  return (
    <>
      <header className="chat__mainHeader">
        <span>User: {loggedInUserName}</span>
        <button onClick={exportChatHistory}>Download Chat History</button>
      </header>
      <div>
        <ul style={{ listStyle: "none", padding: 10 }}>
          {chatHistory.length > 0 ? (
            chatHistory.map((message, index) => (
              <li key={index}>
                <span>{message.fromUserName}</span>
                <br />
                {message.chatMessage}
              </li>
            ))
          ) : (
            <div>No chat history available.</div>
          )}
        </ul>
      </div>

      <div className="message__container">
        {messages.map((message) => (
          <div className="message__chats" key={message.id}>
            {message.name === loggedInUserName ? (
              <p className="sender__name">You</p>
            ) : (
              <p>{message.name}</p>
            )}
            <div
              className={
                message.name === loggedInUserName
                  ? "message__sender"
                  : "message__recipient"
              }
            >
              <p>{message.text}</p>
              {message.attachment && (
                <div>
                  <a
                    href={`data:${message.attachment.type};base64,${message.attachment.data}`}
                    download={message.attachment.name}
                  >
                    {message.attachment.name}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="message__status">
          <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />
      </div>
    </>
  );
};

export default ChatBody;
