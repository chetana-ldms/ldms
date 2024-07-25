// SendMessageModal.js
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const SendMessageModal = ({ show, handleClose, handleSendMessage }) => {
  const [message, setMessage] = useState("");
  const maxCharacters = 140;

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = () => {
    handleSendMessage(message);
    setMessage(""); 
  };

  const handleCloseWithReset = () => {
    setMessage(""); 
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleCloseWithReset} className="application-modal small-modal border-0">
      <Modal.Header closeButton>
        <Modal.Title>Send Message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2 header-filter">
          <textarea
            className="form-control"
            placeholder="Type your message..."
            maxLength={maxCharacters}
            rows="4"
            value={message}
            onChange={handleChange}
          ></textarea>
          <div className="text-right mt-2">
            <small>{maxCharacters - message.length} characters left</small>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseWithReset} className="btn-small">
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} className="btn-new btn-small">
          Send
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SendMessageModal;
