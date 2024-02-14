import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const MonitoringPopUp = ({ showModal, setShowModal, selectedItem }) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Selected Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedItem && (
          <>
            <p>Test Name: {selectedItem.testName}</p>
            <p>Last Tested: {selectedItem.lastTested}</p>
            <p>Icon: <i className={selectedItem.icon} /></p>
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

export default MonitoringPopUp;
