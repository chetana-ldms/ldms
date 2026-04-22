import React, {useEffect, useState} from 'react'
import {Modal, Spinner, Accordion, Badge} from 'react-bootstrap'
import {fetchAssetScanDetailsUrl, fetchRisks} from '../../../../../api/BreachRiskApi'
import {getCurrentTimeZone} from '../../../../../../utils/helper'

function HostRiskModal({show, handleClose, host}) {
  const [loading, setLoading] = useState(false)
  const [hostRisks, setHostRisks] = useState([])
  const [activeKey, setActiveKey] = useState(null)
  const [assetScanDetails, setAssetScanDetails] = useState([])

  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))

  useEffect(() => {
    if (show && host) {
      loadHostRisks()
      loadAssetScanDetails()
    }
  }, [show, host])

  // const loadHostRisks = async () => {
  //   try {
  //     setLoading(true)

  //     const payload = {
  //       orgId,
  //       toolId,
  //     }
  //     const response = await fetchRisks(payload)
  //     const allRisks = response?.data || []
  //     const matched = allRisks.filter((risk) => risk?.hostnames?.includes(host))

  //     setHostRisks(matched)
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const loadHostRisks = async () => {
    try {
      setLoading(true)

      const res = await fetch('/ldms/media/breach-risks/risks.json')
      const data = await res.json()

      const allRisks = data?.data || []

      const matched = allRisks.filter((risk) => risk?.hostnames?.includes(host))

      setHostRisks(matched)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  // const loadAssetScanDetails = async () => {
  //   try {
  //     const payload = {
  //       orgId,
  //       toolId,
  //       assetId: 0,
  //       assetName: host,
  //     }

  //     const response = await fetchAssetScanDetailsUrl(payload)

  //     setAssetScanDetails(response?.data || [])
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const loadAssetScanDetails = async () => {
    try {
      const res = await fetch('/ldms/media/breach-risks/AssetScanDetails.json')
      const data = await res.json()

      setAssetScanDetails(data?.data || [])
    } catch (error) {
      console.log(error)
    }
  }

  const scanData = assetScanDetails || []

  const ipAddress =
    scanData?.attributes?.find((attr) => attr.attributeName === 'a_record')?.attributeValue || '-'
  const sortedRisks = [...(scanData?.risks || [])].sort((a, b) => b.severity - a.severity)
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 5:
        return 'bg-danger' // Critical - Red
      case 4:
        return 'bg-warning' // High - Yellow
      case 3:
        return 'bg-primary' // Medium - Blue
      case 2:
        return 'bg-info' // Low - Light Blue
      case 1:
      default:
        return 'bg-secondary' // Info - Grey
    }
  }
  const getFormattedDate = (date) => {
    return getCurrentTimeZone(date) // reuse your existing formatter
  }

  const today = new Date()

  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const dayBeforeYesterday = new Date()
  dayBeforeYesterday.setDate(today.getDate() - 2)

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop='static'
      keyboard={false}
      className='hostRisksModal application-modal channel-edit'
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title>{host}</Modal.Title>
        <button
          type='button'
          className='application-modal-close'
          aria-label='Close'
          onClick={handleClose}
        >
          <i className='fa fa-close' />
        </button>
      </Modal.Header>

      <Modal.Body className='h-600px scroll-y'>
        {loading ? (
          <div className='text-center'>
            <Spinner animation='border' />
          </div>
        ) : (
          <>
            <div className='ps-5'>
              <h2>{host} information</h2>
              <hr></hr>
              <div className='mb-2 mt-2'>
                <span className='text-muted me-5 pe-5'>RISK RATING </span>
                <span className='ps-5'>{assetScanDetails?.automatedScore ?? '-'}</span>
              </div>
              <hr></hr>
              <div className='mb-2'>
                <span className='text-muted me-5 pe-5'>LAST SCANNED </span>
                <span>{getFormattedDate(yesterday)}</span>
              </div>

              <hr />

              <div>
                <span className='text-muted me-5 pe-5'>FIRST SCANNED</span>
                <span>{getFormattedDate(dayBeforeYesterday)}</span>
              </div>
              <hr></hr>
              <div className=''>
                <span className='text-muted me-5 pe-5'>IP Addresses</span>
                <span className='ps-5'>{ipAddress}</span>
              </div>
              <hr></hr>
            </div>

            <h5 className='mb-3 mt-3'>Risks ({assetScanDetails?.risks?.length})</h5>

            {assetScanDetails?.risks?.length === 0 && (
              <div className='text-muted'>No risks found for this host.</div>
            )}

            <Accordion activeKey={activeKey} onSelect={(k) => setActiveKey(k)} flush>
              {sortedRisks.map((risk, index) => {
                const matchedHostRisk = hostRisks.find((hr) => hr.finding === risk.title)

                return (
                  <Accordion.Item
                    eventKey={`${index}`}
                    key={index}
                    className='border rounded mb-3 shadow-sm'
                  >
                    <Accordion.Header>
                      <div className='d-flex align-items-center gap-2'>
                        <div
                          className={`${getSeverityColor(
                            risk?.severity
                          )} text-white rounded-circle px-3 py-2 d-flex align-items-center justify-content-center`}
                        >
                          {'!'.repeat(risk?.severity || 1)}
                        </div>
                        <span className='fw-semibold'>{risk.title}</span>
                      </div>
                    </Accordion.Header>

                    <Accordion.Body>
                      <div className='mb-3'>
                        <p className='text-primary'>ASSETS:</p>
                        <div>
                          {risk?.sources?.length ? (
                            risk.sources.map((src, i) => <div key={i}>{src}</div>)
                          ) : (
                            <span>No assets available</span>
                          )}
                        </div>
                      </div>
                      <div className='mb-3'>
                        <p className='text-primary'>First Detected:</p>
                        <p className='mb-0'>{getFormattedDate(dayBeforeYesterday)}</p>
                      </div>
                      <div className='mb-3'>
                        <strong>Summary:</strong>
                        <p className='mb-0'>{risk.description || 'No summary available'}</p>
                      </div>

                      <div className='mb-3'>
                        <strong>Risk details:</strong>
                        <p>{matchedHostRisk?.riskTitle || 'No risk details available'}</p>
                      </div>

                      <div>
                        <strong>Recommended remediation:</strong>
                        <p>{matchedHostRisk?.remediation || 'No remediation provided'}</p>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                )
              })}
            </Accordion>

            <h5 className='mb-5 mt-5'>
              Additional checks ({assetScanDetails?.otherChecks?.length})
            </h5>
            {assetScanDetails?.otherChecks?.length === 0 && (
              <div className='text-muted'>No Additional checks found for this host.</div>
            )}
            <Accordion activeKey={activeKey} onSelect={(k) => setActiveKey(k)} flush>
              {assetScanDetails?.otherChecks?.map((risk, index) => {
                return (
                  <Accordion.Item
                    eventKey={`${index}`}
                    key={index}
                    className='border rounded mb-3 shadow-sm'
                  >
                    <Accordion.Header>
                      <div className='d-flex align-items-center gap-2'>
                        <div className='bg-success text-white rounded-circle px-3 py-2'>✓</div>
                        <span className='fw-semibold'>{risk.title}</span>
                      </div>
                    </Accordion.Header>

                    <Accordion.Body>
                      <div className='mb-3'>
                        <p className='text-primary'>ASSETS:</p>
                        <div>
                          {risk?.sources?.length ? (
                            risk.sources.map((src, i) => <div key={i}>{src}</div>)
                          ) : (
                            <span>No assets available</span>
                          )}
                        </div>
                      </div>
                      <div className='mb-3'>
                        <p className='text-primary'>First Detected:</p>
                        <p className='mb-0'>{getCurrentTimeZone(risk.checkedDate || '')}</p>
                      </div>
                      <div className='mb-3'>
                        <strong>Summary:</strong>
                        <p className='mb-0'>{risk.description || 'No summary available'}</p>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                )
              })}
            </Accordion>
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default HostRiskModal
