import React, {useEffect, useState} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import {fetchCVEMarkAsFalsePositiveUrl} from '../../../../../api/ApplicationSectionApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const MarkasFalsePositivePopUp = ({
  show,
  onClose,
  refreshData,
  selectedItem: initialSelectedItem,
  selectedAlert,
  id,
  selectedItems,
}) => {
  const [reason, setReason] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const toolId = Number(sessionStorage.getItem('toolID'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  console.log(selectedItems, 'selectedItems')
  useEffect(() => {
    if (initialSelectedItem) {
      setSelectedItem(initialSelectedItem)
    }
  }, [initialSelectedItem])

  const handleSave = async () => {
    if (selectedAlert) {
      const data = {
        orgId: orgId,
        toolId: toolId,
        cveIds: selectedAlert,
        applicationId: id,
        reason: reason,
      }

      try {
        const response = await fetchCVEMarkAsFalsePositiveUrl(data)
        const {isSuccess, message} = response
        if (isSuccess) {
          notify(message)
          refreshData()
          onClose()
        } else {
          notifyFail(message)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <Modal show={show} onHide={onClose} className='application-modal'>
      <ToastContainer />
      <Modal.Header closeButton>
        <Modal.Title>
          Mark False Positive
          {selectedAlert.length > 1 && ` (${selectedAlert.length}) CVEs`}
        </Modal.Title>

        <button type='button' class='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className='popup-details'>
          {selectedAlert.length === 1 && (
            <div>
              <h5 className='cve-id'>{selectedItem?.cveId}</h5>
              <div className='row'>
                <div className='severity-section col-md-3'>
                  <div className='severity-label'>
                    <strong>Severity</strong>
                  </div>
                  <div
                    className={`severity-value ${selectedItem?.severity?.toLowerCase() || 'low'}`}
                  >
                    {selectedItem?.severity || 'Low'}
                  </div>
                </div>
                <div className='col-md-3'>
                  <div>
                    <strong>NVD Base Score</strong>
                  </div>
                  <div>{selectedItem?.nvdBaseScore || 'N/A'}</div>
                </div>
                <div className='col-md-3'>
                  <div>
                    <strong>Vendor</strong>
                  </div>
                  <div>{selectedItems?.vendor || 'N/A'}</div>
                </div>
                <div className='col-md-3'>
                  <div>
                    <strong>Application</strong>
                  </div>
                  <div>{selectedItems?.name || 'N/A'}</div>
                </div>
                <div className='description mt-5'>
                  <strong>Description:</strong>
                  <p>{selectedItem?.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <Form>
          <Form.Group controlId='reasonInput'>
            <Form.Label>Write a Reason*</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              placeholder='Explain why this CVE is a False Positive'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={250}
            />
            <Form.Text className='text-muted'>{reason.length}/250</Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onClose}>
          Cancel
        </Button>
        <Button variant='primary' onClick={handleSave} disabled={!reason.trim()}>
          Mark
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MarkasFalsePositivePopUp
