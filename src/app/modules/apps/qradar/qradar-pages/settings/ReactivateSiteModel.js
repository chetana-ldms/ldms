import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { fetchSiteActionUrl } from '../../../../../api/SettingsApi';
import { notify, notifyFail } from '../components/notification/Notification';

const ReactivateSiteModel = ({
  show,
  handleClose,
  items,
  selectedActionId,
  refreshData,
  computerNames,
}) => {
  const orgId = Number(sessionStorage.getItem('orgId'));
  const toolId = Number(sessionStorage.getItem('toolID'));
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [expirationDate, setExpirationDate] = useState('');

  const sendSelectedItemsToBackend = async () => {
    const siteId = items.map((item) => item.id).join(',');
    const siteNames = items.map((item) => item.name).join(', ');
    const formattedExpirationDate = expirationDate
      ? new Date(expirationDate).toISOString()
      : '';

    const payload = {
      orgId,
      toolId,
      actionId: selectedActionId,
      siteId: siteId,
      siteName: siteNames,
      executedUserId: Number(sessionStorage.getItem('userId')),
      executedDate: new Date().toISOString(),
      expirationDate: isUnlimited ? null : formattedExpirationDate,
      isUnlimitedExpiration: isUnlimited,
    };

    console.log(payload, 'payload');
    try {
      const response = await fetchSiteActionUrl(payload);
      const { isSuccess, message } = response;
      if (isSuccess) {
        refreshData();
        notify(message);
        handleClose();
        window.location.reload();
      } else {
        notifyFail(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReactivate = () => {
    if (!isUnlimited && !expirationDate) {
      notifyFail('Select "Unlimited expiration" or expiration date.');
      return;
    }
    sendSelectedItemsToBackend();
  };

  return (
    <Modal show={show} onHide={handleClose} className="application-modal">
      <Modal.Header closeButton>
        <Modal.Title>Reactivate Site ({computerNames})</Modal.Title>
        <button
          type="button"
          className="application-modal-close"
          aria-label="Close"
        >
          <i className="fa fa-close" />
        </button>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formUnlimitedExpiration">
            <Form.Label>Expiration Date</Form.Label>
            <Form.Check
              type="checkbox"
              label="Unlimited expiration"
              checked={isUnlimited}
              onChange={() => {
                setIsUnlimited(!isUnlimited);
                if (!isUnlimited) {
                  setExpirationDate('');
                }
              }}
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
