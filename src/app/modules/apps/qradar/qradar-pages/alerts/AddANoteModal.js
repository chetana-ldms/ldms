import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { fetchThreatNotesUrl } from '../../../../../api/AlertsApi';
import { notify, notifyFail } from "../components/notification/Notification";

const AddANoteModal =  ({ show, handleClose, handleAction, selectedValue, selectedAlert }) => {
    const data = { selectedValue, selectedAlert }
    const value = data.selectedValue
    const AlertId = data.selectedAlert
    console.log(data, "data")
    const orgId = Number(sessionStorage.getItem("orgId"));
  const [noteText, setNoteText] = useState('');

  const handleNoteChange = (event) => {
    setNoteText(event.target.value);
  };
  const handleSubmit = async () => {
    const modifiedUserId = Number(sessionStorage.getItem("userId"));
    const modifiedDate = new Date().toISOString();
    try {
      const data = {
        orgID: orgId,
        toolID: 1,
        toolTypeID: 1,
        alertIDs: selectedAlert,
        notes: noteText,
        modifiedDate,
        modifiedUserId,
      };
      
      const responseData =  await fetchThreatNotesUrl(data);
      const { isSuccess, message } = responseData;
  
      if (isSuccess) {
        notify(message);
      } else {
        notifyFail(message);
      }
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="addANoteModal">
      <Modal.Header closeButton>
        <Modal.Title>Add a Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2">
          <textarea
            className="form-control"
            placeholder="Add a note..."
            rows="2"
            value={noteText}
            onChange={handleNoteChange}
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Apply 
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddANoteModal;
