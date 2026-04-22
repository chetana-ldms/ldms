import React, {useState} from 'react'
import {Modal} from 'react-bootstrap'
import HostRiskModal from './HostRiskModal'

function IpDetailsModal({show, handleClose, risk}) {
  console.log('risk', risk) // Debugging line
  const [showHostModal, setShowHostModal] = useState(false)
  const [selectedHost, setSelectedHost] = useState(null)

  if (!risk) return null

  const handleDomainClick = (domain) => {
    setSelectedHost(domain)
    setShowHostModal(true)
  }

  return (
    <>
      <Modal
        show={show}
        backdrop='static'
        keyboard={false}
        onHide={handleClose}
        className='IpDetailsModal application-modal channel-edit'
      >
        <Modal.Header>
          <Modal.Title>
            <h2 className='mb-0 text-white'>{risk.assetName}</h2>
          </Modal.Title>

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
          <h2 className='mt-4 mb-4'>IP address details</h2>

          <table className='table'>
            <tbody>
              <tr>
                <td className='text-muted'>SOURCE</td>
                <td>
                  <span className='badge bg-primary'>{risk.sources?.[0]}</span>
                </td>
              </tr>

              <tr>
                <td className='text-muted'>OWNER</td>
                <td>{risk.owner}</td>
              </tr>

              <tr>
                <td className='text-muted'>COUNTRY</td>
                <td>{risk.country}</td>
              </tr>

              <tr>
                <td className='text-muted'>AUTONOMOUS SYSTEM (AS)</td>
                <td>{risk.asName}</td>
              </tr>

              <tr>
                <td className='text-muted'>ASN</td>
                <td>AS{risk.asn}</td>
              </tr>

              <tr>
                <td className='text-muted'>SERVICES</td>
                <td>
                  {risk.services?.map((service, i) => (
                    <span key={i} className='badge bg-warning me-2'>
                      {service}
                    </span>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>

          {/* SCORECARD / DOMAIN SECTION */}
          {risk.sources?.[0] !== 'Custom Range' ? (
            <>
              <h5 className='mt-5'>IP address scorecard</h5>

              <div className='alert alert-warning mt-3'>
                This IP is sourced from DNS records, so it does not receive its own score. To view
                scoring and risks relating to this IP, click on a domain below.
              </div>

              <h5 className='mt-4'>Domains ({risk.domains?.length || 0})</h5>

              <table className='table'>
                <tbody>
                  {risk.domains?.map((domain, index) => (
                    <tr key={index}>
                      <td
                        className='text-primary'
                        style={{cursor: 'pointer'}}
                        onClick={() => handleDomainClick(domain)}
                      >
                        {domain}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <h2>IP Addresses</h2>
              <table className='table'>
                <tbody>
                  <tr>
                    <td
                      className='text-primary'
                      style={{cursor: 'pointer'}}
                      onClick={() => handleDomainClick(risk.assetName)}
                    >
                      {risk.assetName}
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </Modal.Body>
      </Modal>

      <HostRiskModal
        show={showHostModal}
        handleClose={() => setShowHostModal(false)}
        host={selectedHost}
      />
    </>
  )
}

export default IpDetailsModal
