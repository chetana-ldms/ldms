import React, { useEffect, useState } from "react";
import {
  fetchDownloadAttachmentURL,
  fetchDownloadAttachmentUrl,
  fetchGetChatHistory,
} from "../../../../../api/IncidentsApi";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { getCurrentTimeZone } from "../../../../../../utils/helper";

const ChatBody = ({
  messages: initialMessages,
  typingStatus,
  lastMessageRef,
  selectedIncident,
  setRefreshChatHistory,
  resetMessages,
}) => {
  const loggedInUserName = sessionStorage.getItem("userName");
  const { incidentID } = selectedIncident;
  const id = incidentID;
  // Declare and assign value to messageId
  const messageId =
    initialMessages.length > 0 ? initialMessages[0].incidentID : null;
  console.log(messageId, "messageId");
  const isCurrentIncident = (message) => message.incidentID === id;
  const orgId = sessionStorage.getItem("orgId");
  const [messages, setMessages] = useState(initialMessages);
  const [chatHistory, setChatHistory] = useState([]);
  console.log(chatHistory, "chatHistory");
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);
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
      setMessages([]);
      resetMessages();
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
    const filename = `Chat_History_Incident_${id}.txt`;
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
  const handleDownloadAttachment = async (message) => {
    try {
      const data = {
        fileUrl: message.attachmentUrl,
        filePhysicalPath: message.attachmentPhysicalPath,
      };
      const response = await fetchDownloadAttachmentUrl(data);
      if (response.ok) {
        const fileBlob = await response.blob();
        const url = URL.createObjectURL(fileBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = message.fileName;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // notify("File Downloaded successfully");
      } else {
        // notifyFail("File not Downloaded successfully");
      }
    } catch (error) {
      console.log(error);
      // notifyFail("Error occurred while downloading the file");
    }
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
          {chatHistory.length > 0 &&
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
                  className={`date-time ${
                    message.fromUserName === loggedInUserName
                      ? "float-right"
                      : "float-left"
                  }`}
                >
                  {getCurrentTimeZone(message.messsageDate)}
                </div>
                <div className="clearfix" />
                <div
                  className={
                    message.fromUserName === loggedInUserName
                      ? "message__sender"
                      : "message__recipient"
                  }
                >
                  {message.messageType === "Chat_Message" && (
                    <>
                      <p>{message.chatMessage}</p>
                    </>
                  )}

                  {message.messageType === "Attachment" && (
                    <div>
                      <a
                        href={message.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDownloadAttachment(message);
                        }}
                      >
                        {message.chatMessage}
                      </a>
                    </div>
                  )}
                </div>
                <div className="clearfix" />
              </li>
            ))}
          {initialMessages.map(
            (message) =>
              isCurrentIncident(message) && (
                <div className="message__chats" key={message.id}>
                  {message.name === loggedInUserName ? (
                    <p className="sender__name">
                      <img
                        alt="Logo"
                        src={toAbsoluteUrl("/media/avatars/300-1.jpg")}
                        width="30"
                      />{" "}
                      You
                    </p>
                  ) : (
                    <p className="reciever__name">
                      <img
                        alt="Logo"
                        src={toAbsoluteUrl("/media/avatars/300-4.jpg")}
                        width="30"
                      />{" "}
                      {message.name}
                    </p>
                  )}
                  {message.createdDate && (
                    <div
                      className={`date-time ${
                        message.name === loggedInUserName
                          ? "float-right"
                          : "float-left"
                      }`}
                    >
                      {getCurrentTimeZone(message.createdDate)}
                    </div>
                  )}
                  <div className="clearfix" />
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
          )}
        </ul>
      </div>
    </>
  );
};

export default ChatBody;
