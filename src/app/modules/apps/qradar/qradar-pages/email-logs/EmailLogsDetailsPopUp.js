import React from 'react'
import {Modal, Button} from 'react-bootstrap'
import {getCurrentTimeZone} from '../../../../../../utils/helper'

function EmailLogsDetailsPopUp({show, onClose, selectedItem}) {
  return (
    <Modal
      backdrop='static'
      keyboard={false}
      show={show}
      onHide={onClose}
      className='application-modal'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Email Logs Details</Modal.Title>
        <button type='button' className='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        {selectedItem ? (
          <div>
            <p>
              <strong>Date and Time:</strong> {getCurrentTimeZone(selectedItem.createdDate)}
            </p>
            <p>
              <strong>Message Id:</strong> {selectedItem.messageId}
            </p>
            <p>
              <strong>Sender Address:</strong> {selectedItem.senderAddress}
            </p>
            <p>
              <strong>Recipient Address:</strong> {selectedItem.recipientAddress}
            </p>
            <p>
              <strong>Message Subject:</strong> {selectedItem.messageSubject}
            </p>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EmailLogsDetailsPopUp
