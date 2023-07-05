
import React, { useEffect, useState } from "react";
import { fetchGetChatHistory } from "../../../../../api/IncidentsApi";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";

const ChatBody = ({ messages, typingStatus, lastMessageRef, selectedIncident, setRefreshChatHistory }) => {
  const loggedInUserName = sessionStorage.getItem("userName");
  const { incidentID } = selectedIncident;
  const id = incidentID;
 // Declare and assign value to messageId
 const messageId = messages.length > 0 ? messages[0].incidentID : null;
 console.log(messageId, "messageId");
 const isCurrentIncident = (message) => message.incidentID === id;
  const orgId = sessionStorage.getItem("orgId");
  const [chatHistory, setChatHistory] = useState([]);
  console.log(chatHistory, "chatHistory")
  useEffect(() => {
    const fetchData = async () => {
      // Fetch chat history for the selected incident
      const data = {
        orgId: orgId,
        subject: "Incident",
        subjectRefId: id,
      };
      const chatHistory = await fetchGetChatHistory(data);
      setChatHistory(chatHistory || []);
      setRefreshChatHistory(false);
    };

    fetchData();
    setChatHistory([]);
    // const interval = setInterval(() => {
    //   fetchData();
    // }, 1000);

    // return () => {
    //   clearInterval(interval);
    // };
  }, [id, setRefreshChatHistory]);
  const exportChatHistory = () => {
    const filename = `Chat_History_Incident_${id}.pdf`;
    const formattedChatHistory = chatHistory
      .map((message) => `${message.fromUserName}: ${message.chatMessage}`)
      .join("\n");

    const element = document.createElement("a");
    element.href =
      "data:text/plain;charset=utf-8," +
      encodeURIComponent(formattedChatHistory);
    element.download = filename;
    element.click();
  };

  return (
    <>
      <header className="chat__mainHeader">
        <span>{loggedInUserName}</span>
        <span className="pointer" onClick={exportChatHistory}>
          <i className="fa fa-download" title="download chat history" />
        </span>
      </header>
      <div className="message__container">
        <ul
          className="message__chats"
          style={{ listStyle: "none", padding: 10 }}
        >
          {chatHistory.length > 0 ? (
            chatHistory.map((message, index) => (
              <li key={index}>
                {/* <span>{message.fromUserName}</span> */}
                {message.fromUserName === loggedInUserName ? (
                  <p className="sender__name">
                    <img
                      alt="Logo"
                      src={toAbsoluteUrl("/media/avatars/300-1.jpg")}
                      width="30"
                    />
                    You
                  </p>
                ) : (
                  <p className="reciever__name">
                    <img
                      alt="Logo"
                      src={toAbsoluteUrl("/media/avatars/300-4.jpg")}
                      width="30"
                    />
                    {message.fromUserName}{" "}
                  </p>
                )}
                <div
                  className={
                    message.fromUserName === loggedInUserName
                      ? "message__sender"
                      : "message__recipient"
                  }
                >
                  <p>{message.chatMessage}</p>
                </div>
              </li>
            ))
          ) : (
            <div>No chat history available.</div>
          )}
            {messages.map((message) => (
             isCurrentIncident(message) && (
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
                      // href={`data:${message.attachment.type};base64,${message.attachment.data}`}
                      href={`data:${message.attachment.type};base64,${message.attachment.data}`}
                      download={message.attachment.name}
                    >
                      {message.attachment.name}
                    </a>
                  </div>
                )}
              </div>
            </div>
             )
          ))}
        </ul>
      </div>
      <div className="attachment__container">
        {chatHistory.length > 0 &&
          chatHistory.map((message, index) => (
            <div key={index} className="attachment__item">
              {message.attachment && (
                <div>
                  <a
                    href={message.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Attachment: {message.attachment}
                  </a>
                </div>
              )}
            </div>
          ))}
      </div>
   
        {/* <div className="message__container">
          {messages.map((message) => (
             isCurrentIncident(message) && (
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
             )
          ))}

          <div className="message__status">
            <p>{typingStatus}</p>
          </div>
          <div ref={lastMessageRef} />
        </div> */}
   
    </>
  );

};

export default ChatBody;
