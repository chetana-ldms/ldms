import React, {useEffect, useState} from 'react'
import {Modal, Spinner, Accordion, Badge} from 'react-bootstrap'
import {fetchRisks} from '../../../../../api/BreachRiskApi'
import {getCurrentTimeZone} from '../../../../../../utils/helper'

function HostRiskModal({show, handleClose, host}) {
  const [loading, setLoading] = useState(false)
  const [hostRisks, setHostRisks] = useState([])
  const [activeKey, setActiveKey] = useState(null)

  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))

  useEffect(() => {
    if (show && host) {
      loadHostRisks()
    }
  }, [show, host])

  const loadHostRisks = async () => {
    try {
      setLoading(true)

      const payload = {
        orgId,
        toolId,
      }

      const response = await fetchRisks(payload)
      const allRisks = response?.data || []

      // Filter risks matching selected host
      const matched = allRisks.filter((risk) => risk?.hostnames?.includes(host))

      setHostRisks(matched)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

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

      <Modal.Body className=" h-600px scroll-y">
        {loading ? (
          <div className='text-center'>
            <Spinner animation='border' />
          </div>
        ) : (
          <>
            <h5 className='mb-3'>Risks ({hostRisks?.length})</h5>

            {hostRisks?.length === 0 && (
              <div className='text-muted'>No risks found for this host.</div>
            )}

            {hostRisks?.map((risk, index) => (
              <div key={index} className='border rounded p-3 mb-4 shadow-sm'>
                {/* 🔥 Heading */}
                <div className='d-flex align-items-center gap-2 mb-3'>
                  <div className='bg-danger text-white rounded-circle px-3 py-2'>!!!</div>
                  <h6 className='mb-0 fw-semibold'>{risk.finding}</h6>
                </div>

                {/* 🔽 Accordion */}
                <Accordion activeKey={activeKey} onSelect={(k) => setActiveKey(k)} flush>
                  {/* ================= SUMMARY ================= */}
                  <Accordion.Item eventKey={`summary-${index}`}>
                    <Accordion.Header>Summary</Accordion.Header>
                    <Accordion.Body>
                      <p className='mb-0'>{risk.description || 'No summary available'}</p>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* ================= RISK DETAILS ================= */}
                  <Accordion.Item eventKey={`details-${index}`}>
                    <Accordion.Header>Risk details</Accordion.Header>
                    <Accordion.Body>
                      <p>{risk.riskTitle || 'No risk details available'}</p>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* ================= REMEDIATION ================= */}
                  <Accordion.Item eventKey={`remediation-${index}`}>
                    <Accordion.Header>Recommended remediation</Accordion.Header>
                    <Accordion.Body>
                      <p>{risk.remediation || 'No remediation provided'}</p>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            ))}
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default HostRiskModal
