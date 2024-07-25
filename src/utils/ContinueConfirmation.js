import React from "react";
import { Modal, Button } from "react-bootstrap";

function ContinueConfirmation({ isVisible, onContinue, onDismiss }) {
  return (
    <Modal
      show={isVisible}
      onHide={onDismiss}
      className="application-modal small-modal border-0"
    >
      <Modal.Body className="border-btm">
        <p className="fs-15 text-center">Do you want to continue?</p>
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
