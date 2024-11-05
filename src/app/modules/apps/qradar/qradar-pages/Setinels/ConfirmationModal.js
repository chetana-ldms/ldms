import React from "react";
import { Modal, Button } from "react-bootstrap";

function ConfirmationModal({ show, onConfirm, onCancel, message }) {
  return (
    <Modal
      show={show}
      onHide={onCancel}
      className="application-modal small-modal border-0"
    >
      <Modal.Body className="border-btm">
        <p className="fs-15 text-center">{message}</p>
      </Modal.Body>
      <Modal.Footer className="text-center margin-auto">
        <Button className="btn-small btn-new" onClick={onConfirm}>
          Yes
        </Button>
        <Button className="btn-secondary btn-small" onClick={onCancel}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;
