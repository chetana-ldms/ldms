import React, {useState} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { fetchMissingCVEAddUrl } from '../../../../../api/ApplicationSectionApi'
function AddMissingCVE({show, onClose, refreshData, id}) {
  const toolId = Number(sessionStorage.getItem('toolID'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [cveId, setCveId] = useState('')
  const [reason, setReason] = useState('')

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const data = {
      orgId: orgId,
      toolId: toolId,
      cveIds: [cveId],
      applicationId: id,
      reason: reason,
    }

    try {
      const response = await fetchMissingCVEAddUrl(data)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        refreshData()
        onClose()
        setCveId('')
        setReason('')
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal show={show} onHide={onClose} className='application-modal'>
      <ToastContainer />
      <Modal.Header closeButton>
        <Modal.Title>Add Missing CVE</Modal.Title>
        <button type='button' class='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          <div className='cve-details mb-4'>
            <Form.Group controlId='formCveId' className='mb-3'>
              <Form.Label className='fw-bold'>CVE ID</Form.Label>
              <Form.Control
                type='text'
                placeholder='CVE-YYYY-NNNN'
                value={cveId}
                onChange={(e) => setCveId(e.target.value)}
                required
              />
              <Form.Text className='text-muted'>
                CVE format should be CVE-YYYY-&lt;identifier&gt;
              </Form.Text>
            </Form.Group>

            {/* <div className='d-flex align-items-center mb-3'>
              <div className='severity-indicator me-3'>
                <span className='dot medium'></span> Medium
              </div>
              <div className='base-score'>
                <span className='fw-bold'>NVD Base Score:</span> 5.3 (CVSS v3.1)
              </div>
            </div> */}
          </div>

          <Form.Group controlId='formReason' className='mb-3'>
            <Form.Label className='fw-bold'>Write a Reason</Form.Label>
            <Form.Control
              as='textarea'
              rows={2}
              maxLength={250}
              placeholder='Reason for adding this CVE'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
            <div className='text-end text-muted small'>{reason.length}/250</div>
          </Form.Group>

          <div className='text-end'>
            <Button variant='outline-secondary' onClick={onClose} className='me-2'>
              Cancel
            </Button>
            <Button variant='primary' type='submit'>
              Add
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default AddMissingCVE
