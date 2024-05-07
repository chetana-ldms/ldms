import React, { useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { fetchThreatNotesUrl } from "../../../../../api/AlertsApi";
import { notify, notifyFail } from "../components/notification/Notification";

const AddANoteModal = ({
  show,
  handleClose,
  handleAction,
  selectedValue,
  selectedAlert,
  refreshParent,
}) => {
  const data = { selectedValue, selectedAlert };
  const value = data.selectedValue;
  const AlertId = data.selectedAlert;
  console.log(data, "data");
  const orgId = Number(sessionStorage.getItem("orgId"));
  const noteText = useRef()
  const handleSubmit = async (event) => {
    event.preventDefault()
    const modifiedUserId = Number(sessionStorage.getItem("userId"));
    const modifiedDate = new Date().toISOString();
    if (!noteText.current.value) {
      notifyFail('Please enter the note')
      return
    }
    try {
      const data = {
        orgID: orgId,
        toolID: 1,
        toolTypeID: 1,
        alertIDs: selectedAlert,
        notes: noteText.current.value,
        modifiedDate,
        modifiedUserId,
      };

      const responseData = await fetchThreatNotesUrl(data);
      const { isSuccess, message } = responseData;

      if (isSuccess) {
        notify(message);
        refreshParent();
        handleClose();
      } else {
        notifyFail(message);
      }
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="addANoteModal application-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add a Note</Modal.Title>
        <button
          type="button"
          class="application-modal-close"
          aria-label="Close"
        >
          <i className="fa fa-close" />
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2 header-filter">
          <textarea
            className="form-control"
            placeholder="Add a note..."
            maxLength={4000}
            rows="2"
            ref={noteText}
            required
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} className="btn-small">
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          className="btn-new btn-small"
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddANoteModal;
