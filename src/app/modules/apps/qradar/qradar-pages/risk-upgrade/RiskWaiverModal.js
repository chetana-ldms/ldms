import React, {useState, useEffect} from 'react'
import {Modal, Button, Form, Spinner, Row, Col} from 'react-bootstrap'
import {fetchRisks, fetchcreateWaiverRequestUrl, fetcheligibleForWaiverRequestUrl} from '../../../../../api/BreachRiskApi'
import {fetchUsersByOrgTool} from '../../../../../api/IncidentsApi'
import {notify, notifyFail} from '../components/notification/Notification'

function RiskWaiverModal({show, onHide, selectedAlertIds, onSuccess}) {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const userID = Number(sessionStorage.getItem('userId'))

  const [risksData, setRisksData] = useState([])
  console.log(risksData, 'risksData in modal')
  const [selectedWaiverItems, setSelectedWaiverItems] = useState(new Map()) // Map<riskId, Set<assetId>>
  const [waiverReason, setWaiverReason] = useState('')
  const [waiverExpiryDate, setWaiverExpiryDate] = useState('')
  const [approverUserId, setApproverUserId] = useState('')
  const [approverUsersList, setApproverUsersList] = useState([])
  const [riskWaiverApprovalFlag, setRiskWaiverApprovalFlag] = useState(false)
  const [loadingRisks, setLoadingRisks] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Reset form when modal is hidden
  useEffect(() => {
    if (!show) {
      setRisksData([])
      setSelectedWaiverItems(new Map())
      setWaiverReason('')
      setWaiverExpiryDate('')
      setApproverUserId('')
    }
  }, [show])
 useEffect(() => {
  if (show && selectedAlertIds.length > 0) {
    const loadData = async () => {
      setLoadingRisks(true)
      try {
        const response = await fetcheligibleForWaiverRequestUrl(
          selectedAlertIds.map(Number),
          toolId
        )
        if (response) {
          setRiskWaiverApprovalFlag(response.riskWaiverApprovalFlag)
        }
        if (response?.data) {
          setRisksData(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch risks:', error)
        notifyFail('Failed to load risk details.')
      } finally {
        setLoadingRisks(false)
      }

      setLoadingUsers(true)
      try {
        const usersResponse = await fetchUsersByOrgTool(orgId, toolId, userID)
        setApproverUsersList(usersResponse?.usersList || [])
      } catch (error) {
        console.error('Failed to fetch approver users:', error)
        notifyFail('Failed to load approver users.')
      } finally {
        setLoadingUsers(false)
      }
    }
    loadData()
  }
}, [show, selectedAlertIds, orgId, toolId, userID])
  const handleAssetCheckboxChange = (riskId, assetId, isChecked) => {
    setSelectedWaiverItems((prev) => {
      const newMap = new Map(prev)
      if (!newMap.has(riskId)) {
        newMap.set(riskId, new Set())
      }
      const assets = newMap.get(riskId)
      if (isChecked) {
        assets.add(assetId)
      } else {
        assets.delete(assetId)
      }
      if (assets.size === 0) {
        newMap.delete(riskId)
      }
      return newMap
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (selectedWaiverItems.size === 0) {
      notifyFail('Please select at least one asset to waive.')
      return
    }

    if (riskWaiverApprovalFlag && !approverUserId) {
      notifyFail('Please select an approver.')
      return
    }

    const itemsToWaiver = []
    selectedWaiverItems.forEach((assetIds, riskId) => {
      assetIds.forEach((assetId) => {
        itemsToWaiver.push({riskId: Number(riskId), assetId: Number(assetId)})
      })
    })

    const payload = {
      items: itemsToWaiver,
      toolId: toolId,
      orgId: orgId,
      waiverReason: waiverReason.trim() ? waiverReason : null, // Pass null if waiverReason is empty
      waiverExpiryDate: waiverExpiryDate ? new Date(waiverExpiryDate).toISOString() : null,
      requestedByUserId: userID,
      approverUserId: Number(approverUserId) ?? 0,
      requestDate: new Date().toISOString(),
    }

    setSubmitting(true)
    try {
      const response = await fetchcreateWaiverRequestUrl(payload)
      if (response?.isSuccess) {
        notify(response.message)
        onHide()
        onSuccess()
      } else {
        notifyFail(response?.message || 'Failed to create waiver request.')
      }
    } catch (error) {
      console.error('Waiver request failed:', error)
      notifyFail('An error occurred while creating waiver request.')
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
        <Modal.Title>Create Waiver Request</Modal.Title>
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
        <Modal.Body className='h-600px scroll-y'>
          {(loadingRisks || loadingUsers) && (
            <div className='text-center py-5'>
              <Spinner animation='border' />
              <p>Loading data...</p>
            </div>
          )}

          {!loadingRisks && risksData.length === 0 && (
            <p className='text-center text-muted'>No risks found for waiver.</p>
          )}

          {!loadingRisks && risksData.length > 0 && (
            <div className='table-responsive mb-4'>
              <table className='table table-bordered table-sm align-middle'>
                <thead className='table-light'>
                  <tr>
                    <th className='text-center' style={{width: '40px'}}>
                      #
                    </th>
                    <th>Risk Title</th>
                    <th>Asset Name</th>
                  </tr>
                </thead>
                <tbody>
                  {risksData.flatMap((risk) =>
                    (risk.riskAssets || [])
                      .filter((asset) => !asset.isWaived)
                      .map((asset) => (
                        <tr key={`${risk.riskId}-${asset.assetId}`}>
                          <td className='text-center'>
                            <Form.Check
                              type='checkbox'
                              id={`risk-${risk.riskId}-asset-${asset.assetId}`}
                              checked={
                                selectedWaiverItems.get(risk.riskId)?.has(asset.assetId) || false
                              }
                              onChange={(e) =>
                                handleAssetCheckboxChange(
                                  risk.riskId,
                                  asset.assetId,
                                  e.target.checked
                                )
                              }
                            />
                          </td>
                          <td>{risk.finding || risk.riskTitle}</td>
                          <td>{asset.assetName}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <Form.Group className='mb-3'>
            <Form.Label>
              Waiver Reason <span className='text-danger'>*</span>
            </Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              value={waiverReason}
              onChange={(e) => setWaiverReason(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Waiver Expiry Date</Form.Label>
            <Form.Control
              type='date'
              value={waiverExpiryDate}
              onChange={(e) => setWaiverExpiryDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </Form.Group>

          {riskWaiverApprovalFlag && (
            <Form.Group className='mb-3'>
              <Form.Label>
                Approver <span className='text-danger'>*</span>
              </Form.Label>
              <Form.Select
                value={approverUserId}
                onChange={(e) => setApproverUserId(e.target.value)}
                required
              >
                <option value=''>Select Approver</option>
                {approverUsersList.map((user) => (
                  <option key={user.userID} value={user.userID}>
                    {user.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={onHide} disabled={submitting}>
            Cancel
          </Button>
          <Button variant='primary' type='submit' disabled={submitting}>
            {submitting ? (
              <Spinner animation='border' size='sm' className='me-2' />
            ) : (
              'Submit Waiver'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default RiskWaiverModal
