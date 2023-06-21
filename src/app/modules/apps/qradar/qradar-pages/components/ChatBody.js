// ChatBody.jsx
import React from "react";

const ChatBody = ({ messages, typingStatus, lastMessageRef }) => {
  const loggedInUserName = sessionStorage.getItem("userName");

  return (
    <>
      <header className="chat__mainHeader">User: {loggedInUserName}</header>

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
