import React, { useState, useEffect, useRef } from "react";
import { PageLayout } from "./components/PageLayout";
import { loginRequest } from "./authConfig";
import { callMsGraph, sendMessageToChannel, createChannel } from "./graph";
import { ProfileData } from "./components/ProfileData";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import "./TeamsChannel.css";
import Button from "react-bootstrap/Button";

const ProfileContent = () => {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const [token, setToken] = useState("");
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [channelMessages, setChannelMessages] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [messageText, setMessageText] = useState("");
  const [sentMessages, setSentMessages] = useState([]);
  const [newChannelName, setNewChannelName] = useState(""); // State for the new channel name

  const messageContainerRef = useRef(null);

  const teamId = "17e93b8c-2a9a-4c9f-aca0-69c24ca5bc91";
  const channelId = "19%3abe544de8b2824967b39d33c120e0f7b9%40thread.tacv2";

  useEffect(() => {
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        setToken(response.accessToken);
        console.log("Access token:", response.accessToken);
        callMsGraph(response.accessToken).then((response) =>
          setGraphData(response)
        );
      });
  }, []);

  const handleCreateChannel = () => {
    createChannel(token, teamId, newChannelName) // Pass the newChannelName parameter to the createChannel function
      .then(() => {
        console.log("Channel created successfully!");
        // Refresh the channel list or perform any necessary actions
      })
      .catch((error) => {
        console.error("Failed to create channel:", error);
      });
  };

  const handleSendMessage = () => {
    console.log("Token before sending message:", token);

    if (token && messageText) {
      sendMessageToChannel(token, teamId, channelId, messageText)
        .then(() => {
          console.log("Message sent successfully!");
          // Create a new message object
          const newMessage = {
            content: messageText,
            from: accounts[0].name,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
          };
          // Add the new message to the sentMessages state
          setSentMessages((prevSentMessages) => [
            ...prevSentMessages,
            newMessage,
          ]);
          setIsMessageSent(true);
          setMessageText("");
        })
        .catch((error) => {
          console.error("Failed to send message:", error);
        });
    } else {
      console.log("Token is not available or empty.");
    }
  };

  const handleRetrieveMessages = () => {
    retrieveChannelMessages();
  };

  const retrieveChannelMessages = () => {
    fetch(
      `https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/messages?$expand=replies`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Failed to retrieve channel messages:", data.error);
        } else if (data.value && Array.isArray(data.value)) {
          const userIds = [];
          data.value.forEach((message) => {
            const userId = message.from?.user?.id || "";
            userIds.push(userId);
            const displayName = message.from?.user?.displayName || "";
            if (!userMap[userId]) {
              setUserMap((prevUserMap) => ({
                ...prevUserMap,
                [userId]: displayName,
              }));
            }
          });

          const messages = data.value.map((message) => {
            const repliedMessages = message.replies
              ? message.replies.map((reply) => reply.body.content)
              : [];
            const userId = message.from?.user?.id || "";
            const timestamp = message.createdDateTime || "";
            const formattedTimestamp = new Date(timestamp).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }
            );

            const attachments = message.attachments
              ? message.attachments.map((attachment) => ({
                  name: attachment.name,
                  contentType: attachment.contentType,
                  size: attachment.size,
                  url: attachment.contentUrl,
                }))
              : [];

            return {
              content: message.body.content,
              replies: repliedMessages,
              from: userMap[userId] || "Unknown User",
              userId: userId,
              timestamp: formattedTimestamp,
              attachments: attachments,
            };
          });

          setChannelMessages(messages);
        } else {
          console.error(
            "Failed to retrieve channel messages: Unexpected response",
            data
          );
        }
      })
      .catch((error) => {
        console.error("Failed to retrieve channel messages:", error);
      });
  };

  useEffect(() => {
    retrieveChannelMessages();
    scrollToBottom();

    const startMessageRetrievalTimer = () => {
      const timer = setInterval(() => {
        retrieveChannelMessages();
        scrollToBottom();
      }, 10000);

      return () => clearInterval(timer);
    };

    startMessageRetrievalTimer();
  }, [token, teamId, channelId, userMap]);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  return (
    <>
      <h5 className="card-title">Welcome {accounts[0].name}</h5>
      <br />

      {graphData ? (
        <div
          style={{
            textAlign: "left",
            display: "block",
            margin: "20px",
            background: "#e7ebf0",
            padding: "20px",
          }}
        >
          {/* <ProfileData graphData={graphData} /> */}

          {/* {isMessageSent && (
            <p className="success-message text-success">
              <br />
              <b>Message sent successfully!</b>
            </p>
          )} */}
          <h2>Channel Messages</h2>
          <br />

          {channelMessages.length > 0 && (
            <div
              style={{ height: "300px", overflowY: "scroll" }}
              ref={messageContainerRef}
            >
              {channelMessages
                .concat(sentMessages) // Add the sent messages to the list
                .slice(0)
                .reverse()
                .map((message, index) => (
                  <div key={index}>
                    <p style={{ marginBottom: "0", fontSize: "14px" }}>
                      <b> {message.from}</b>
                      {"   "}
                      <span style={{ fontSize: "12px" }}>
                        {message.timestamp}
                      </span>
                    </p>
                    <p style={{ fontSize: "14px" }}>{message.content}</p>
                    {message.attachments &&
                      message.attachments.map((attachment, index) => (
                        <p key={index}>
                          {attachment.url ? (
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              download={attachment.name}
                            >
                              {attachment.name}
                            </a>
                          ) : (
                            <span>{attachment.name}</span>
                          )}
                          <br />
                        </p>
                      ))}
                  </div>
                ))}
            </div>
          )}

          <br />
          {token && (
            <>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Enter message"
                style={{ width: "30%", marginRight: "10px" }}
              />
              <Button
                variant="primary"
                onClick={handleSendMessage}
                style={{ fontSize: "12px" }}
              >
                Send
              </Button>
              <Button
                variant="primary"
                style={{ visibility: "hidden" }}
                onClick={handleRetrieveMessages}
              >
                Retrieve Messages
              </Button>

              <br />
              <Button
                variant="primary"
                onClick={handleCreateChannel}
                style={{ fontSize: "12px" }}
              >
                Create Channel
              </Button>
            </>
          )}
        </div>
      ) : (
        <>
          <Button variant="secondary" disabled className="hidden">
            Request Profile Information
          </Button>
        </>
      )}

      <p>
        <b>Auth Token: </b>
        {token}
      </p>
      <br />
      <ProfileData graphData={graphData} />
    </>
  );
};

const MainContent = () => {
  return (
    <div className="TeamsChannel">
      <AuthenticatedTemplate>
        <ProfileContent />
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <h5>
          <center>Please sign-in to see your profile information.</center>
        </h5>
      </UnauthenticatedTemplate>
    </div>
  );
};

export function TeamsChannel() {
  return (
    <PageLayout>
      <center>
        <MainContent />
      </center>
    </PageLayout>
  );
}
