import React, {useRef, useState} from 'react'
import {Modal, Accordion} from 'react-bootstrap'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import HostRiskModal from './HostRiskModal'

function RiskDetailsModal({show, handleClose, risk}) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null)
  const dropdownRef = useRef(null)
  const [showHostModal, setShowHostModal] = useState(false)
  const [selectedHost, setSelectedHost] = useState(null)

  if (!risk) return null

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'danger'
      case 'high':
        return 'warning'
      case 'medium':
        return 'info'
      case 'low':
        return 'secondary'
      default:
        return 'dark'
    }
  }

  const handleHostClick = (host) => {
    setSelectedHost(host)
    setShowHostModal(true)
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
    <>
      <Modal
        show={show}
        backdrop='static'
        keyboard={false}
        onHide={handleClose}
        className='riskDetailsModal application-modal channel-edit'
      >
        <Modal.Header className='border-0 pb-0 d-flex align-items-center'>
          {/* LEFT SIDE */}
          <div className='d-flex align-items-center gap-3'>
            <div
              className='rounded-circle bg-danger text-white d-flex align-items-center justify-content-center'
              style={{width: 40, height: 40, fontWeight: 700}}
            >
              !!!
            </div>

            <h4 className='mb-0 text-white'>{risk.finding}</h4>
          </div>

          {/* RIGHT SIDE */}
          <div className='ms-auto d-flex align-items-center gap-2 me-5'>
            <div className='position-relative' ref={dropdownRef}>
              <button
                className='btn btn-green btn-small px-4'
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Manage risks {showDropdown ? '▲' : '▾'}
              </button>

              {showDropdown && (
                <div
                  className='position-absolute end-0 mt-2 bg-white text-dark shadow rounded-3 py-2'
                  style={{width: '200px', zIndex: 1055}}
                >
                  <div
                    className={`px-3 py-2 ${
                      selectedAction === 'remediate' ? 'bg-primary text-white' : ''
                    }`}
                    style={{cursor: 'pointer'}}
                    onClick={() => setSelectedAction('remediate')}
                  >
                    <div>
                      <strong>Request remediation</strong>
                    </div>
                    <div>Address risks</div>
                  </div>

                  <div
                    className={`px-3 py-2 ${
                      selectedAction === 'waive' ? 'bg-primary text-white' : ''
                    }`}
                    style={{cursor: 'pointer'}}
                    onClick={() => setSelectedAction('waive')}
                  >
                    <div>
                      <strong>Waive a risk</strong>
                    </div>
                    <div>Dismiss a risk</div>
                  </div>
                </div>
              )}
            </div>

            <button
              type='button'
              className='application-modal-close'
              aria-label='Close'
              onClick={handleClose}
            >
              <i className='fa fa-close' />
            </button>
          </div>
        </Modal.Header>

        <Modal.Body className='h-600px scroll-y'>
          {/* ACCORDION */}
          <Accordion alwaysOpen defaultActiveKey={['0', '1', '2', '3']} flush>
            {/* SUMMARY */}
            <Accordion.Item eventKey='0'>
              <Accordion.Header>Summary</Accordion.Header>
              <Accordion.Body>
                <p className='mb-0'>{risk.description}</p>
              </Accordion.Body>
            </Accordion.Item>

            {/* RISK DETAILS */}
            <Accordion.Item eventKey='1'>
              <Accordion.Header>Risk details</Accordion.Header>
              <Accordion.Body>
                <p>{risk.riskTitle}</p>
              </Accordion.Body>
            </Accordion.Item>

            {/* REMEDIATION */}
            <Accordion.Item eventKey='2'>
              <Accordion.Header>Recommended remediation</Accordion.Header>
              <Accordion.Body>
                <p>{risk.remediation}</p>
              </Accordion.Body>
            </Accordion.Item>

            {/* ASSETS */}
            <Accordion.Item eventKey='3'>
              <Accordion.Header>Assets affected ({risk.hostnameCount})</Accordion.Header>

              <Accordion.Body>
                <table className='table table-sm'>
                  <thead>
                    <tr>
                      <th>Assets</th>
                      <th>First detected</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {risk.hostnames?.map((host, index) => (
                      <tr key={index}>
                        <td
                          className='text-primary'
                          style={{cursor: 'pointer'}}
                          onClick={() => handleHostClick(host)}
                        >
                          {host}
                        </td>

                        <td>{getFormattedDate(dayBeforeYesterday)}</td>

                        <td>
                          <span className='badge bg-danger'>Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Modal.Body>
      </Modal>

      {/* HOST MODAL */}
      <HostRiskModal
        show={showHostModal}
        handleClose={() => setShowHostModal(false)}
        host={selectedHost}
      />
    </>
  )
}

export default RiskDetailsModal
