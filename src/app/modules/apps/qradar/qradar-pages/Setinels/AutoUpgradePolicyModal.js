import React, {useEffect, useState} from 'react'
import {Modal, Button, Form, Row, Col} from 'react-bootstrap'
import {fetchAvailablePackagesUrl, fetchUpgradePolicyUrl} from '../../../../../api/SentinalApi'
import {notify, notifyFail} from '../components/notification/Notification'

const AutoUpgradePolicyModal = ({show, onClose, selectedOS, refreshData}) => {
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const [version, setVersion] = useState([])
  console.log(version, "version")
  const [loading, setLoading] = useState(false)
  const [policyName, setPolicyName] = useState('')
  const [policyDescription, setPolicyDescription] = useState('')
  const [agentVersion, setAgentVersion] = useState('')
  const [maxRetries, setMaxRetries] = useState('')
  const [updateTiming, setUpdateTiming] = useState('immediate')
  const [affectedEndpoints, setAffectedEndpoints] = useState('allEndpoints')

  const reload = async () => {
    try {
      setLoading(true)
      let scopeLevel = 'account'
      let scopeId = accountId

      if (groupId) {
        scopeLevel = 'group'
        scopeId = groupId
      } else if (siteId) {
        scopeLevel = 'site'
        scopeId = siteId
      }

      const data = {
        orgId: orgId,
        toolId: toolId,
        scopeLevel: scopeLevel,
        scopeId: scopeId,
        osType: selectedOS,
      }

      const response = await fetchAvailablePackagesUrl(data)
      setVersion(response)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])
  const resetFields = () => {
    setPolicyName('');
    setPolicyDescription('');
    setAgentVersion('');
    setMaxRetries('');
    setUpdateTiming('immediate');
    setAffectedEndpoints('allEndpoints');
  };
  const handleSubmit = async (e) => {
    e.preventDefault()
    const selectedPackage = version.find((ver) => ver.displayName === agentVersion)
    console.log(selectedPackage, "selectedPackage")
    if (!selectedPackage) {
      notifyFail('Selected agent version not found in the version list.')
    }
    let scopeLevel = 'account'
    let scopeId = accountId

    if (groupId) {
      scopeLevel = 'group'
      scopeId = groupId
    } else if (siteId) {
      scopeLevel = 'site'
      scopeId = siteId
    }
    const data = {
      scopeLevel: scopeLevel,
      scopeId: scopeId,
      name: policyName,
      description: policyDescription,
      osType: selectedOS,
      package: {
        build: selectedPackage.build,
        fileId: selectedPackage.fileId || "0",
        major: selectedPackage.major,
        minor: selectedPackage.minor,
      },
      maxRetries,
      isScheduled: updateTiming == 'immediate' ? false : true,
      allEndpoints: affectedEndpoints == 'allEndpoints' ? true : false,
      orgId,
      toolId,
    }

    try {
      const response = await fetchUpgradePolicyUrl(data)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        resetFields()
        onClose()
        refreshData()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleClose = () => {
    resetFields();
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} className='application-modal'>
      <Modal.Header closeButton>
        <Modal.Title>New Upgrade Policy</Modal.Title>
        <button type='button' className='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div>
            <label>Scope : </label> {groupId ? 'group' : siteId ? 'site' : 'Account'}
          </div>
          <div className='row'>
            <div className='col-md-2'>
              <label>Scope : </label> {selectedOS}
            </div>
            <div className='col-md-3 border-1 border-left'>
              <label>Status : </label> Disabled
            </div>
          </div>
        </div>
        <hr />
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='policyName' className='mb-3'>
            <Row>
              <Col sm='4'>
                <Form.Label>Name</Form.Label>
              </Col>
              <Col sm='8'>
                <Form.Control
                  type='text'
                  placeholder='Enter policy name'
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId='policyDescription' className='mb-3'>
            <Row>
              <Col sm='4'>
                <Form.Label>Description</Form.Label>
              </Col>
              <Col sm='8'>
                <Form.Control
                  as='textarea'
                  rows={3}
                  placeholder='Enter description'
                  value={policyDescription}
                  onChange={(e) => setPolicyDescription(e.target.value)}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId='agentVersion' className='mb-3'>
            <Row>
              <Col sm='4'>
                <Form.Label>Agent Version</Form.Label>
              </Col>
              <Col sm='8'>
                <Form.Select value={agentVersion} onChange={(e) => setAgentVersion(e.target.value)}>
                  <option>Select agent version</option>
                  { 
                    version?.map((ver, index) => (
                      <option key={index} value={ver.displayName}>
                        {ver.displayName}
                      </option>
                    ))
                  }
                </Form.Select>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId='maxRetries' className='mb-3'>
            <Row>
              <Col sm='4'>
                <Form.Label>Maximum number of retries if upgrade fails</Form.Label>
              </Col>
              <Col sm='8'>
                <Form.Control
                  type='text'
                  placeholder='Enter max retries'
                  value={maxRetries}
                  onChange={(e) => setMaxRetries(e.target.value)}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId='updateTiming' className='mb-3'>
            <Row>
              <Col sm='4'>
                <Form.Label>Update Timing</Form.Label>
              </Col>
              <Col sm='8'>
                <Form.Check
                  type='radio'
                  label='Effective immediately'
                  name='updateTiming'
                  id='immediate'
                  checked={updateTiming === 'immediate'}
                  onChange={() => setUpdateTiming('immediate')}
                />
                <Form.Check
                  type='radio'
                  label='According to Maintenance Window'
                  name='updateTiming'
                  id='maintenance'
                  checked={updateTiming === 'maintenance'}
                  onChange={() => setUpdateTiming('maintenance')}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId='affectedEndpoints' className='mb-3'>
            <Row>
              <Col sm='4'>
                <Form.Label>Affected Endpoints</Form.Label>
              </Col>
              <Col sm='8'>
                <Form.Check
                  type='radio'
                  label='All endpoints in scope'
                  name='affectedEndpoints'
                  id='allEndpoints'
                  checked={affectedEndpoints === 'allEndpoints'}
                  onChange={() => setAffectedEndpoints('allEndpoints')}
                />
                <Form.Check
                  type='radio'
                  label='Filtered by endpoint tag'
                  name='affectedEndpoints'
                  id='filteredEndpoints'
                  checked={affectedEndpoints === 'filteredEndpoints'}
                  onChange={() => setAffectedEndpoints('filteredEndpoints')}
                />
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Cancel
        </Button>
        <Button variant='primary' type='submit' onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AutoUpgradePolicyModal
