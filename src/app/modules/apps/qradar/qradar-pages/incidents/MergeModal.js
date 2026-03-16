import React, {useState, useEffect} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {fetchMergeIncidentsUrl} from '../../../../../api/IncidentsApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const MergeModal = ({show, onClose, onConfirm, selectedItems}) => {
  const [primaryId, setPrimaryId] = useState(null)
  const [items, setItems] = useState([])
  console.log('selectedItems', selectedItems)
  useEffect(() => {
    if (selectedItems && selectedItems.length > 0) {
      setItems(selectedItems)
      setPrimaryId(selectedItems[0].incidentID)
    }
  }, [selectedItems, show])

  const handleRemove = (incidentID) => {
    const updated = items.filter((item) => item.incidentID !== incidentID)
    setItems(updated)
    if (incidentID === primaryId && updated.length > 0) {
      setPrimaryId(updated[0].incidentID)
    }
  }

  const handleConfirm = async () => {
    const primary = items.find((item) => item.incidentID === primaryId)
    const secondary = items.filter((item) => item.incidentID !== primaryId)
    const payload = {
      mergingToIncidentId: primary.incidentID,
      mergableIncidents: secondary.map((item) => ({incidentId: item.incidentID})),
      mergeUserId: Number(sessionStorage.getItem('userId')),
      mergeDate: new Date().toISOString(),
      orgId: Number(sessionStorage.getItem('orgId')),
      toolId: 2,
    }

    try {
      const response = await fetchMergeIncidentsUrl(payload)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        onConfirm?.()
        onClose()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.error('Merge failed:', error)
    }
  }

  return (
    <Modal
      backdrop='static'
      keyboard={false}
      show={show}
      onHide={onClose}
      className='mergrModal application-modal'
    >
      <ToastContainer />
      <Modal.Header closeButton>
        <Modal.Title>Merge ticket</Modal.Title>
        <button type='button' class='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        <p className='mb-3 text-muted'>
          {items.length} ticket(s) selected (interactions from secondary tickets will be added to
          the primary ticket). Summaries and Discussion Threads from secondary tickets will be
          discarded.
        </p>

        {items.map((item) => (
          <div
            key={item.incidentID}
            className='border rounded p-3 mb-2 d-flex justify-content-between align-items-center position-relative'
            style={{backgroundColor: '#f9f9f9'}}
          >
            <div className='ps-5 ms-1'>
              <div className='fw-bold mb-1'>
                #{item.incidentID} — {item.subject}
              </div>
              <div className='small text-muted'>
                Group: - - • Agent: {item.ownerName || item.createdUser}
                <br />
                Created: {getCurrentTimeZone(item.createdDate)}
              </div>
            </div>

            <div className='d-flex align-items-center'>
              {primaryId === item.incidentID ? (
                <span className='badge bg-primary'>Primary</span>
              ) : (
                <Button
                  variant='outline-secondary'
                  size='sm'
                  onClick={() => setPrimaryId(item.incidentID)}
                >
                  Make Primary
                </Button>
              )}
            </div>

            <button
              className='btn btn-link text-danger position-absolute start-0 top-50 translate-middle-y'
              style={{left: '-20px'}}
              onClick={() => handleRemove(item.incidentID)}
              title='Remove ticket'
            >
              <i className='fa fa-minus-circle' />
            </button>
          </div>
        ))}
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={onClose}>
          Cancel
        </Button>
        <Button variant='primary' onClick={handleConfirm} disabled={items.length < 2}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MergeModal
