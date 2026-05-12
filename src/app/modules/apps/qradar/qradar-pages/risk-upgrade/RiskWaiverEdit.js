import React, {useState, useEffect} from 'react'
import {Modal, Button, Form, Row, Col, Spinner} from 'react-bootstrap'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {fetchupdateWaiverRequestUrl} from '../../../../../api/BreachRiskApi'
import {notify, notifyFail} from '../components/notification/Notification'

function RiskWaiverEdit({show, onHide, risk, onSuccess}) {
    console.log(risk, 'risk in edit modal')
  const [reason, setReason] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const userID = Number(sessionStorage.getItem('userId'))

  useEffect(() => {
    if (risk) {
      setReason(risk.reason || '')
      const dateVal = getCurrentTimeZone(risk.expiryDate)
      if (dateVal) {
        setExpiryDate(new Date(dateVal).toISOString().split('T')[0])
      } else {
        setExpiryDate('')
      }
    }
  }, [risk])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!risk) return

    setSubmitting(true)
    try {
      const payload = {
        waiverRequestId: Number(risk.waiverId),
        userId: userID,
        reason: reason.trim(),
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
        items: (risk.items || []).map((item) => ({
          riskId: Number(item.riskId),
          assetId: Number(item.assetId),
        })),
        modifiedDate: new Date().toISOString(),
      }

      const response = await fetchupdateWaiverRequestUrl(payload)
      if (response?.isSuccess) {
        notify(response.message || 'Waiver request updated successfully')
        onHide()
        onSuccess?.()
      } else {
        notifyFail(response?.message || 'Failed to update waiver request')
      }
    } catch (error) {
      console.error('Update failed:', error)
      notifyFail('An error occurred while updating the waiver request')
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
      className='riskWaiverEditModal application-modal'
      centered
    >
      <Form onSubmit={handleSubmit}>
      <Modal.Header closeButton className='border-bottom pb-3'>
        <Modal.Title className='fs-5 fw-semibold'>Edit Waiver Request</Modal.Title>
        <button
          type='button'
          className='application-modal-close'
          aria-label='Close'
          onClick={onHide}
        >
          <i className='fa fa-close' />
        </button>
      </Modal.Header>

      <Modal.Body className='py-4'>
        {risk && (
          <div className='rounded bg-light p-4 border shadow-sm'>
            <Row className='g-4 fs-14'>
              <Col xs={6}>
                <span className='fw-bold text-dark d-block mb-1'>Waiver ID: </span>
                <span className='text-muted'>{risk.waiverId}</span>
              </Col>
              <Col xs={6}>
                <span className='fw-bold text-dark d-block mb-1'>Status: </span>
                  <span
                    className={`badge ${
                      risk.statusName === 'Approved'
                        ? 'bg-success'
                        : risk.statusName === 'Rejected'
                        ? 'bg-danger'
                        : 'bg-info'
                    }`}
                  >
                    {risk.statusName}
                  </span>
              </Col>
              <Col xs={12}>
                  <Form.Group controlId='edit-reason'>
                    <Form.Label className='fw-bold text-dark mb-1'>Reason</Form.Label>
                    <Form.Control
                      as='textarea'
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group controlId='edit-expiry'>
                    <Form.Label className='fw-bold text-dark mb-1'>Expiry Date</Form.Label>
                    <Form.Control
                      type='date'
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </Form.Group>
              </Col>
              <Col xs={6}>
                <span className='fw-bold text-dark d-block mb-1'>Requested By: </span>
                <span className='text-muted'>{risk.requestedByUserName || '—'}</span>
              </Col>
              <Col xs={6}>
                <span className='fw-bold text-dark d-block mb-1'>Requested Date: </span>
                <span className='text-muted'>{getCurrentTimeZone(risk.requestedDate) || '—'}</span>
              </Col>
            </Row>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className='border-top pt-3'>
        <Button variant='secondary' className='btn-small' onClick={onHide} disabled={submitting}>
          Cancel
        </Button>
        <Button variant='primary' className='btn-small' type='submit' disabled={submitting}>
          {submitting ? <Spinner animation='border' size='sm' /> : 'Save Changes'}
        </Button>
      </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default RiskWaiverEdit