import React, {useState, useEffect} from 'react'
import {Modal, Button, Form, Spinner, Row, Col} from 'react-bootstrap'
import {fetchRisks, fetchrevokeWaiverRequestUrl} from '../../../../../api/BreachRiskApi'
import {notify, notifyFail} from '../components/notification/Notification'

function RiskRevokeModel({show, onHide, selectedAlertIds, onSuccess}) {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const userID = Number(sessionStorage.getItem('userId'))

  const [risksData, setRisksData] = useState([])
  console.log(risksData, 'risksData in modal')
  const [selectedWaiverItems, setSelectedWaiverItems] = useState(new Map()) // Map<riskId, Set<assetId>>
  const [revokeReason, setRevokeReason] = useState('')
  const [loadingRisks, setLoadingRisks] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Reset form when modal is hidden
  useEffect(() => {
    if (!show) {
      setRisksData([])
      setSelectedWaiverItems(new Map())
      setRevokeReason('')
    }
  }, [show])
  useEffect(() => {
    if (show && selectedAlertIds.length > 0) {
      const loadData = async () => {
        setLoadingRisks(true)
        try {
          const response = await fetchRisks({
            orgId,
            toolId,
            riskIds: selectedAlertIds.map(Number),
            userId: userID,
          })
          if (response?.data) {
            setRisksData(response.data)
          }
        } catch (error) {
          console.error('Failed to fetch risks:', error)
          notifyFail('Failed to load risk details.')
        } finally {
          setLoadingRisks(false)
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
      notifyFail('Please select at least one asset to revoke.')
      return
    }

    const itemsToRevoke = []
    selectedWaiverItems.forEach((assetIds, riskId) => {
      assetIds.forEach((assetId) => {
        itemsToRevoke.push({riskId: Number(riskId), assetId: Number(assetId)})
      })
    })

    const payload = {
      orgId: orgId,
      toolId: toolId,
      items: itemsToRevoke,
      userId: userID,
      reason: revokeReason.trim(),
    }

    setSubmitting(true)
    try {
      const response = await fetchrevokeWaiverRequestUrl(payload)
      if (response?.isSuccess) {
        notify(response.message)
        onHide()
        onSuccess()
      } else {
        notifyFail(response?.message || 'Failed to create waiver request.')
      }
    } catch (error) {
      console.error('Revoke request failed:', error)
      notifyFail('An error occurred while creating revoke request.')
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
        <Modal.Title>Create Revoke Request</Modal.Title>
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
          {loadingRisks && (
            <div className='text-center py-5'>
              <Spinner animation='border' />
              <p>Loading data...</p>
            </div>
          )}

          {!loadingRisks && risksData.length === 0 && (
            <p className='text-center text-muted'>No risks found to revoke.</p>
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
                      .filter((asset) => asset.isWaived)
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
                          <td>{risk.riskTitle || risk.finding}</td>
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
              Revoke Reason <span className='text-danger'>*</span>
            </Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={onHide} disabled={submitting}>
            Cancel
          </Button>
          <Button variant='primary' type='submit' disabled={submitting}>
            {submitting ? (
              <Spinner animation='border' size='sm' className='me-2' />
            ) : (
              'Submit Revoke'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default RiskRevokeModel
