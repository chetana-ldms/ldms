

import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const AddRequirementsPopUp = ({ showSecondModal, setShowSecondModal }) => {
  return (
    <Modal show={showSecondModal} onHide={() => setShowSecondModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add Requirements </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h2>Add Your requirements Here!!!</h2>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={() => setShowSecondModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddRequirementsPopUp;
