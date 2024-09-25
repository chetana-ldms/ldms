import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ReactivateSiteModel = ({ show, handleClose, items, selectedActionId, refreshData }) => {
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [expirationDate, setExpirationDate] = useState('');

  const handleReactivate = () => {
    const expiration = isUnlimited ? 'Unlimited' : expirationDate;
    refreshData();
    
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Reactivate Site</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formUnlimitedExpiration">
          <Form.Label>Expiration Date</Form.Label>
            <Form.Check
              type="checkbox"
              label="Unlimited expiration"
              checked={isUnlimited}
              onChange={() => setIsUnlimited(!isUnlimited)}
            />
          </Form.Group>

          <Form.Group controlId="formExpirationDate">
            <Form.Label>Choose Expiration</Form.Label>
            <Form.Control
              type="date"
              disabled={isUnlimited}
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleReactivate}>
          Reactivate
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReactivateSiteModel;
