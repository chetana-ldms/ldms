import React, { useState, useEffect, useRef } from "react";
import { fetchADUserBOTAskUrl } from "../../../../../api/ChatBotApi";
import { Container, Form, Button, Spinner, InputGroup } from "react-bootstrap";
import useFeatureActions from "../configuration/useFeatureActions";
import VoiceInput from './VoiceInput';
import { speak } from './VoiceOutput';

function ChatBot() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);
  const orgId = Number(sessionStorage.getItem("orgId"));
  const toolId = Number(sessionStorage.getItem("toolID"));
  const roleId = Number(sessionStorage.getItem('roleID'));
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'));
  const { featureActions } = useFeatureActions(orgId, toolId, roleId, featureId);

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    );
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleVoiceSearch = (voiceText) => {
    setQuery(voiceText);
    handleSearch(null, voiceText);
  };

  const handleSearch = async (event, customQuery) => {
    if (event) event.preventDefault();
    const searchQuery = customQuery !== undefined ? customQuery : query;
    if (!searchQuery.trim()) return;

    setChatHistory((prev) => [...prev, { type: "question", text: searchQuery }]);
    setLoading(true);

    const data = {
      orgId: orgId,
      toolId: toolId,
      userQuery: searchQuery,
    };

    try {
      const response = await fetchADUserBOTAskUrl(data);
      const userDetails = response?.users[0];

      let answerText = "No user found.";
      if (userDetails) {
        answerText = `Name: ${userDetails.displayName || "N/A"}\nEmail: ${userDetails.mail || "N/A"}\nJob Title: ${userDetails.jobTitle || "N/A"}\nOffice Location: ${userDetails.officeLocation || "N/A"}`;
      }

      setChatHistory((prev) => [...prev, { type: "answer", text: answerText }]);
      speak(answerText); // Convert response to voice
    } catch (error) {
      console.error("Error fetching user details:", error);
      setChatHistory((prev) => [...prev, { type: "answer", text: "Invalid user." }]);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  const handleClear = () => {
    setChatHistory([]);
    setQuery("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };

  return (
    <Container className="mt-4 position-relative">
      <div
        ref={chatBoxRef}
        className="chat-box border p-3 mb-5 rounded"
        style={{
          height: "370px",
          overflowY: "auto",
          background: "#f8f9fa",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`p-2 mb-2 rounded ${
              message.type === "question"
                ? "bg-primary text-white align-self-end"
                : "bg-primary text-dark border"
            }`}
            style={{
              fontSize: "15px",
              maxWidth: "100%",
              borderRadius: "10px",
              padding: "10px",
              whiteSpace: "pre-line",
              border: message.type === "answer" ? "1px solid rgb(222, 229, 237)" : "none",
              background: message.type === "answer" ? "#e3f2fd" : "",
            }}
          >
            {message.text}
          </div>
        ))}

        {loading && (
          <div className="text-center mt-3">
            <Spinner animation="border" variant="primary" />
          </div>
        )}
      </div>

      <Form className="d-flex justify-content-center w-100 p-3 bg-white" style={{ zIndex: 99, background: "transparent" }}>
        <InputGroup className="w-50">
          <Form.Control
            type="text"
            placeholder="Type your question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <VoiceInput setQuery={setQuery} onVoiceComplete={handleVoiceSearch} />
          <Button variant="primary" size="sm" onClick={handleSearch} disabled={loading}>
            {loading ? "Loading..." : "Ask"}
          </Button>
          <Button variant="danger" size="sm" onClick={handleClear} className="ms-2">
            Clear
          </Button>
        </InputGroup>
      </Form>
    </Container>
  );
}

export default ChatBot;