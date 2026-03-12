import React from 'react'
import {Modal, Button, Accordion} from 'react-bootstrap'

function VulnerabilitiesDetailsModal({show, handleClose, vulnerability}) {
  const cve = vulnerability?.cve

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop='static'
      keyboard={false}
      className='vulnerabilitiesDetailsModal application-modal channel-edit'
    >
      <Modal.Header closeButton>
        <Modal.Title>{cve?.id || 'CVE Details'}</Modal.Title>

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
        {/* Request Remediation */}
        <div className='d-flex justify-content-end mb-3'>
          <Button variant='primary'>Request Remediation</Button>
        </div>

        <Accordion defaultActiveKey='0'>
          {/* Summary */}
          <Accordion.Item eventKey='0'>
            <Accordion.Header>Summary</Accordion.Header>
            <Accordion.Body>
              <p>{cve?.description || '-'}</p>
            </Accordion.Body>
          </Accordion.Item>

          {/* CVE Details */}
          <Accordion.Item eventKey='1'>
            <Accordion.Header>CVE Details</Accordion.Header>
            <Accordion.Body>
              <p>
                <strong>Severity:</strong> {cve?.severity}
              </p>
              <p>
                <strong>EPSS:</strong> {((cve?.epss || 0) * 100).toFixed(2)}%
              </p>
              <p>
                <strong>Published Date:</strong> {cve?.publishedDate || '-'}
              </p>
              <p>
                <strong>Last Modified:</strong> {cve?.lastModifiedDate || '-'}
              </p>
            </Accordion.Body>
          </Accordion.Item>

          {/* References */}
          <Accordion.Item eventKey='2'>
            <Accordion.Header>References</Accordion.Header>
            <Accordion.Body>
              {cve?.references?.length > 0 ? (
                cve.references.map((ref, index) => (
                  <div key={index}>
                    <a href={ref} target='_blank' rel='noreferrer'>
                      {ref}
                    </a>
                  </div>
                ))
              ) : (
                <p>No references available</p>
              )}
            </Accordion.Body>
          </Accordion.Item>

          {/* Versions */}
          <Accordion.Item eventKey='3'>
            <Accordion.Header>Versions</Accordion.Header>
            <Accordion.Body>
              {vulnerability?.cpeDetails?.length > 0 ? (
                vulnerability.cpeDetails.map((cpe, index) => (
                  <div key={index}>
                    {cpe?.product} {cpe?.version || ''}
                  </div>
                ))
              ) : (
                <p>No version data available</p>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default VulnerabilitiesDetailsModal
