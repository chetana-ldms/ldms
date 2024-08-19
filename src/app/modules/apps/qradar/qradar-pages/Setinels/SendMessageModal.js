// SendMessageModal.js
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { fetchAgentActionUrl } from "../../../../../api/Api";
import { notify, notifyFail } from "../components/notification/Notification";

const SendMessageModal = ({ show, handleClose, items, selectedActionId, refreshData }) => {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const [message, setMessage] = useState("");
  const maxCharacters = 140;

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const sendSelectedItemsToBackend = async () => {
    const endPointsData = items.map((item) => ({
      agentIds: item.id,
      accountIds: item.accountId,
      groupIds: item.groupId,
      siteIds: item.siteId,
    }))

    const payload = {
      orgId,
      toolId,
      agentActionId: selectedActionId,
      endPointsData,
      sendMessageText: message,
      executedUserId: Number(sessionStorage.getItem('userId')),
      executedDate: new Date().toISOString(),
    }
    try {
      const response = await fetchAgentActionUrl(payload)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        refreshData();
        handleClose();
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleSubmit = () => {
    sendSelectedItemsToBackend()
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
