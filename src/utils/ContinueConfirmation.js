import React from "react";
import { Modal, Button } from "react-bootstrap";

function ContinueConfirmation({ isVisible, onContinue, onDismiss, computerNames, selectedActionDisplayName }) {
  return (
    <Modal
      show={isVisible}
      onHide={onDismiss}
      className="application-modal small-modal border-0"
    >
      <Modal.Body className="border-btm">
        <h6 className="text-center">Selected {computerNames}</h6>
        <p className="fs-15 text-center">Are you sure you want to perform : <strong>{selectedActionDisplayName}</strong>?</p>
      </Modal.Body>
      <Modal.Footer className="text-center margin-auto">
        <Button className="btn-small btn-new" onClick={onContinue}>
          Yes
        </Button>
        <Button className="btn-secondary btn-small" onClick={onDismiss}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ContinueConfirmation;
