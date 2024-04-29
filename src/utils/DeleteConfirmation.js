import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

function DeleteConfirmation({ show, onConfirm, onCancel }) {
  return (
    <Modal
      show={show}
      onHide={onCancel}
      className="application-modal small-modal border-0"
    >
      {/* <Modal.Header closeButton className="no-bg no-pad"></Modal.Header>
      <button type="button" class="application-modal-close" aria-label="Close">
        <i className="fa fa-close black mt-3" />
      </button> */}
      <Modal.Body className="border-btm">
        <p className="fs-15 text-center">Are you sure you want to delete?</p>
      </Modal.Body>
      <Modal.Footer className="text-center margin-auto">
        <Button className="btn-secondary btn-small" onClick={onCancel}>
          No
        </Button>
        <Button className="btn-small btn-new" onClick={onConfirm}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteConfirmation;
