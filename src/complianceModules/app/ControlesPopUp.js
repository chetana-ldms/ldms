
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ControlesPopUp = ({ showModal, setShowModal, selectedItem }) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Selected Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedItem && (
          <>
            <p>Description: {selectedItem.description}</p>
            <p>Icons: {selectedItem.icons.join(', ')}</p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ControlesPopUp;
