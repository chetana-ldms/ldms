import React, {useState} from 'react'
import {Modal, Button, Form, Spinner} from 'react-bootstrap'
import {fetchApproveOrRejectUrl} from '../../../../../api/BreachRiskApi'
import {notify, notifyFail} from '../components/notification/Notification'

function WaiverApprovalModal({show, onHide, waiverRequestIds, onSuccess}) {
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const userID = Number(sessionStorage.getItem('userId'))

  const handleAction = async (isApprove) => {
    if (!comment.trim()) {
      notifyFail('Comment is required.')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        orgId,
        toolId,
        waiverRequestIds: waiverRequestIds.map(Number),
        userId: userID,
        approveRejectReason: comment,
        isApprove: isApprove,
        approveRejectDate: new Date().toISOString(),
      }

      const response = await fetchApproveOrRejectUrl(payload)
      if (response?.isSuccess) {
        notify(response.message)
        setComment('')
        onHide()
        onSuccess()
      } else {
        notifyFail(response?.message || `Failed to ${isApprove ? 'approve' : 'reject'} request.`)
      }
    } catch (error) {
      console.error(`Waiver ${isApprove ? 'approval' : 'rejection'} failed:`, error)
      notifyFail('An error occurred while processing the request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop='static'
      keyboard={false}
      className='application-modal'
    >
      <Modal.Header closeButton>
        <Modal.Title>Waiver Request Approval</Modal.Title>
        <button
          type='button'
          className='application-modal-close'
          aria-label='Close'
          onClick={onHide}
        >
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        <p className='mb-3'>
          Are you sure you want to process {waiverRequestIds.length} waiver request(s)?
        </p>
        <Form.Group className='mb-3'>
          <Form.Label className='fw-bold'>
            Comment <span className='text-danger'>*</span>
          </Form.Label>
          <Form.Control
            as='textarea'
            rows={3}
            placeholder='Enter comment for approval or rejection'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={submitting}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className='d-flex justify-content-center gap-2'>
        <Button variant='secondary' className='btn-small' onClick={onHide} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant='danger'
          className='btn-small'
          onClick={() => handleAction(false)}
          disabled={submitting || !comment.trim()}
        >
          {submitting ? <Spinner animation='border' size='sm' /> : 'Reject'}
        </Button>
        <Button
          variant='success'
          className='btn-small'
          onClick={() => handleAction(true)}
          disabled={submitting || !comment.trim()}
        >
          {submitting ? <Spinner animation='border' size='sm' /> : 'Approve'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default WaiverApprovalModal