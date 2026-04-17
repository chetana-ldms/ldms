import React, {useState} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import {fetchdeleteRisksUrl} from '../../../../../api/BreachRiskApi'
import {notify, notifyFail} from '../components/notification/Notification'

function RiskDeleteModal({show, onHide, risk, riskIds, isBulkDelete, onSuccess}) {
  const [deleteComment, setDeleteComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setDeleteComment('')
    onHide()
  }

  const handleDeleteConfirm = async () => {
    if (!deleteComment.trim()) {
      notifyFail('Comment is required for deletion.')
      return
    }

    try {
      setLoading(true)
      const payload = {
        riskIds: isBulkDelete ? riskIds.map(Number) : [Number(risk?.riskId)],
        reason: deleteComment,
        deletedUserId: Number(sessionStorage.getItem('userId')),
        deletedDate: new Date().toISOString(),
      }

      const response = await fetchdeleteRisksUrl(payload)
      const {isSuccess, message} = response

      if (isSuccess) {
        notify(message)
        handleClose()
        onSuccess()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.error(error)
      notifyFail('Failed to delete risk.')
    } finally {
      setLoading(false)
    }
  }

  const deleteCount = isBulkDelete ? riskIds.length : 1

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop='static'
      keyboard={false}
      className='riskDeleteModal application-modal'
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
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
          Are you sure you want to delete {deleteCount} risk{deleteCount > 1 ? 's' : ''}?
        </p>
        <Form.Group>
          <Form.Label>
            Comment <span className='text-danger'>*</span>
          </Form.Label>
          <Form.Control
            as='textarea'
            rows={3}
            placeholder='Enter comment for deletion...'
            value={deleteComment}
            onChange={(e) => setDeleteComment(e.target.value)}
            disabled={loading}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant='danger' onClick={handleDeleteConfirm} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RiskDeleteModal
