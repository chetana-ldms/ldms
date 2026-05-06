import React, {useState, useEffect} from 'react'
import {Modal, Button, Form, Row, Col, Spinner} from 'react-bootstrap'
import {fetchupdateRisksUrl} from '../../../../../api/BreachRiskApi'
import {fetchMasterData} from '../../../../../api/Api'
import {fetchUsersByOrgTool} from '../../../../../api/IncidentsApi'
import {notify, notifyFail} from '../components/notification/Notification'
import { getCurrentTimeZone } from '../../../../../../utils/helper'
function RiskEditModal({show, onHide, risk, onSuccess}) {
    console.log('RiskEditModal: received risk', risk)
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const userID = Number(sessionStorage.getItem('userId'))
  const [statusId, setStatusId] = useState('')
  const [severityId, setSeverityId] = useState('')
  const [ownerUserId, setOwnerUserId] = useState('')
  const [assignedToUserId, setAssignedToUserId] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [statusList, setStatusList] = useState([])
  const [severityList, setSeverityList] = useState([])
  const [userList, setUserList] = useState([])
  console.log(userList, "userList in modal")
  useEffect(() => {
    if (!risk) return
    setStatusId(risk.statusId ?? '')
    setSeverityId(risk.severityId ?? '')
    setOwnerUserId(risk.ownerId ?? '')
    setAssignedToUserId(risk.assignedToUserId ?? '')
    setComment('')
  }, [risk])
  useEffect(() => {
    const load = async () => {
      try {
        const [sev, sta, users] = await Promise.all([
          fetchMasterData({maserDataType: 'Risk_Severity', orgId, toolId}),
          fetchMasterData({maserDataType: 'Risk_Status', orgId, toolId}),
          fetchUsersByOrgTool(orgId, toolId, userID),
        ])
        setSeverityList(sev || [])
        setStatusList(sta || [])
        setUserList(users?.usersList ?? [])
      } catch (err) {
        console.error('RiskEditModal: failed to load dropdown data', err)
      }
    }
    load()
  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!risk) return

    const payload = {
      orgId,
      toolId,
      modifiedUserId: userID,
      riskIds: [Number(risk.riskId)],
      comment: comment || '',
      modifiedDate: new Date().toISOString(),
    }

    if (statusId) payload.statusId = Number(statusId)
    if (severityId) payload.severityId = Number(severityId)
    if (ownerUserId) payload.ownerUserId = Number(ownerUserId)
    if (assignedToUserId) payload.assignedToUserId = Number(assignedToUserId)

    try {
      setSubmitting(true)
      const response = await fetchupdateRisksUrl(payload)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        onHide()
        onSuccess?.()
      } else {
        notifyFail(message)
      }
    } catch (err) {
      console.error('RiskEditModal: update failed', err)
      notifyFail('Update failed. Please try again.')
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
      className='riskEditModal application-modal'
    >
      <Modal.Header closeButton className='border-bottom pb-3'>
        <Modal.Title className='fs-5 fw-semibold'>
          Edit Risk
          {risk?.finding && (
            <div className='text-muted fs-6 fw-normal mt-1'>
              {risk.finding.length > 60 ? risk.finding.slice(0, 60) + '…' : risk.finding}
            </div>
          )}
        </Modal.Title>
        <button
          type='button'
          className='application-modal-close'
          aria-label='Close'
          onClick={onHide}
        >
          <i className='fa fa-close' />
        </button>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className='py-4'>
          {/* Read-only info strip */}
          {risk && (
            <div className='rounded bg-light p-3 mb-4 border'>
              <Row className='g-2 fs-7 text-muted'>
                <Col xs={6}>
                  <span className='fw-semibold text-dark'>Risk ID: </span>
                  {risk.riskId}
                </Col>
                <Col xs={6}>
                  <span className='fw-semibold text-dark'>Category: </span>
                  {risk.category || '—'}
                </Col>
                <Col xs={6}>
                  <span className='fw-semibold text-dark'>Source: </span>
                  {risk.source || '—'}
                </Col>
                <Col xs={6}>
                  <span className='fw-semibold text-dark'>First detected: </span>
                  {getCurrentTimeZone(risk.firstDetectedDate) ??  '—'}
                </Col>
              </Row>
            </div>
          )}

          <Row className='g-3'>
            {/* Status */}
            <Col xs={12} md={6}>
              <Form.Group controlId='edit-status'>
                <Form.Label className='fw-semibold fs-7 mb-1'>Status</Form.Label>
                <Form.Select
                  value={statusId}
                  onChange={(e) => setStatusId(e.target.value)}
                  size='sm'
                >
                  <option value=''>— Select status —</option>
                  {statusList.map((item) => (
                    <option key={item.dataID} value={item.dataID}>
                      {item.dataValue}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Severity */}
            <Col xs={12} md={6}>
              <Form.Group controlId='edit-severity'>
                <Form.Label className='fw-semibold fs-7 mb-1'>Severity</Form.Label>
                <Form.Select
                  value={severityId}
                  onChange={(e) => setSeverityId(e.target.value)}
                  size='sm'
                >
                  <option value=''>— Select severity —</option>
                  {severityList.map((item) => (
                    <option key={item.dataID} value={item.dataID}>
                      {item.dataValue}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Owner */}
            <Col xs={12}>
              <Form.Group controlId='edit-owner'>
                <Form.Label className='fw-semibold fs-7 mb-1'>Owner</Form.Label>
                <Form.Select
                  value={ownerUserId}
                  onChange={(e) => setOwnerUserId(e.target.value)}
                  size='sm'
                >
                  <option value=''>— Select owner —</option>
                  {userList.map((user, i) => (
                    <option key={i} value={user.userID}>
                      {user.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Assigned To */}
            <Col xs={12}>
              <Form.Group controlId='edit-assigned-to'>
                <Form.Label className='fw-semibold fs-7 mb-1'>Assigned To</Form.Label>
                <Form.Select
                  value={assignedToUserId}
                  onChange={(e) => setAssignedToUserId(e.target.value)}
                  size='sm'
                >
                  <option value=''>— Select user —</option>
                  {userList.map((user, i) => (
                    <option key={i} value={user.userID}>
                      {user.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Comment */}
            <Col xs={12}>
              <Form.Group controlId='edit-comment'>
                <Form.Label className='fw-semibold fs-7 mb-1'>Comment</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={3}
                  placeholder='Add a note about this change…'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  size='sm'
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className='border-top pt-3'>
          <Button variant='light' onClick={onHide} disabled={submitting}>
            Cancel
          </Button>
          <Button variant='primary' type='submit' disabled={submitting} style={{minWidth: 90}}>
            {submitting ? (
              <>
                <Spinner animation='border' size='sm' className='me-2' />
                Saving…
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default RiskEditModal
