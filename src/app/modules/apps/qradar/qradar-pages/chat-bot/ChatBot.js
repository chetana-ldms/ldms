import React, { useState, useEffect, useRef } from "react";
import { fetchADUserBOTAskUrl } from "../../../../../api/ChatBotApi";
import { Container, Form, Button, Spinner, InputGroup } from "react-bootstrap";

function ChatBot() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // Stores chat messages
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null); // Ref for scrolling chat box
  const orgId = Number(sessionStorage.getItem("orgId"));
  const toolId = Number(sessionStorage.getItem("toolID"));

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight; // Auto-scroll to the bottom
    }
  }, [chatHistory]); // Runs whenever chatHistory updates

  const handleSearch = async (event) => {
    if (event) event.preventDefault(); // Prevents default form submission

    if (!query.trim()) return;

    setChatHistory((prev) => [...prev, { type: "question", text: query }]);
    setLoading(true);

    const data = {
      orgId: orgId,
      toolId: toolId,
      userQuery: query,
    };

    try {
      const response = await fetchADUserBOTAskUrl(data);
      const userDetails = response?.users[0];

      let answerText = "No user found.";
      if (userDetails) {
        answerText = `Name: ${userDetails.displayName || "N/A"}\nEmail: ${
          userDetails.mail || "N/A"
        }\nJob Title: ${userDetails.jobTitle || "N/A"}\nOffice Location: ${
          userDetails.officeLocation || "N/A"
        }`;
      }

      setChatHistory((prev) => [...prev, { type: "answer", text: answerText }]);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setChatHistory((prev) => [...prev, { type: "answer", text: "Invalid user." }]);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  const handleClear = () => {
    setChatHistory([]); // Clears the chat history
    setQuery(""); // Clears the input field
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };

  return (
    <Container className="mt-4 position-relative">
      {/* Chat Box */}
      <div
        ref={chatBoxRef} // Attach ref to chat box
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

      {/* Input Field Fixed at Bottom */}
      <Form className="d-flex justify-content-center w-100 p-3 bg-white" style={{ zIndex: 99, background: "transparent" }}>
        <InputGroup className="w-50">
          <Form.Control
            type="text"
            placeholder="Enter your query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown} // Calls API on Enter key press
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(10px)",
            }}
          />
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
