import React, {useEffect, useState} from 'react'
import {Modal, Button, Form, Row, Col} from 'react-bootstrap'
import {fetchAvailablePackagesUrl, fetchTagsUrl, fetchUpgradePolicyUrl} from '../../../../../api/SentinalApi'
import {notify, notifyFail} from '../components/notification/Notification'

const AutoUpgradePolicyUpdateModal = ({
  show,
  onClose,
  selectedOS,
  refreshData,
  selectedItem,
  modalState,
}) => {
  console.log(selectedItem, 'selectedItem')
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const [save, setSave] = useState(modalState?.save || '')
  const [version, setVersion] = useState([])
  const [loading, setLoading] = useState(false)
  const [policyName, setPolicyName] = useState('')
  const [policyDescription, setPolicyDescription] = useState('')
  const [agentVersion, setAgentVersion] = useState('')
  const [maxRetries, setMaxRetries] = useState('')
  const [updateTiming, setUpdateTiming] = useState('immediate')
  const [affectedEndpoints, setAffectedEndpoints] = useState('allEndpoints')
  const [tags, setTags] = useState([])
  console.log(tags, 'tags')
  const [tagKey, setTagKey] = useState('')
  const [tagValue, setTagValue] = useState('')
  const [dropdownTags, setDropdownTags] = useState([])
  const fetchDropdownTags = async () => {
    const data = {
      orgId: orgId,
      toolId: toolId,
      includeChildren: true,
      includeParents: true,
      orgAccountStructureLevel: [
        {levelName: 'AccountId', levelValue: accountId || ''},
        {levelName: 'SiteId', levelValue: siteId || ''},
        {levelName: 'GroupId', levelValue: groupId || ''},
      ],
    }
    try {
      const response = await fetchTagsUrl(data)
      setDropdownTags(response?.data || [])
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchDropdownTags()
  }, [])
  const handleAddTag = () => {
    if (tagKey && tagValue) {
      const isDuplicate = tags.some((tag) => tag.key === tagKey && tag.value === tagValue)
      if (isDuplicate) {
        notifyFail('This tag already exists.')
        return
      }
      const matchingTag = dropdownTags.find((tag) => tag.key === tagKey && tag.value === tagValue)

      if (matchingTag) {
        setTags([...tags, {key: tagKey, value: tagValue, id: matchingTag.id}])
        setTagKey('')
        setTagValue('')
      } else {
        notifyFail('Tag not found in dropdown.')
      }
    }
  }

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  useEffect(() => {
    setSave(modalState?.save || '')
  }, [modalState])
  useEffect(() => {
    if (selectedItem) {
      setPolicyName(selectedItem.name || '');
      setPolicyDescription(selectedItem.description || '');
      
      const versionString = `${selectedItem.package?.major} ${selectedItem.package?.minor?.toString().toUpperCase()} (${selectedItem.package?.build})`;
      const matchingVersion = version?.find((ver) => ver.displayName === versionString);
  
      setAgentVersion(matchingVersion ? matchingVersion.displayName : versionString);
      setMaxRetries(selectedItem.maxRetries || '');
      setUpdateTiming(selectedItem.isScheduled === false ? 'immediate' : 'maintenance');
      setAffectedEndpoints(selectedItem.allEndpoints ? 'allEndpoints' : 'filteredEndpoints');
      const matchedTags = selectedItem.tags?.map(tagId => {
        const matchingTag = dropdownTags.find(tag => tag.id === tagId);
        return matchingTag ? { key: matchingTag.key, value: matchingTag.value, id: matchingTag.id } : null;
      }).filter(Boolean); 
  
      setTags(matchedTags || []);
    }
  }, [selectedItem, dropdownTags]);
  

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
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (affectedEndpoints === 'filteredEndpoints' && tags.length === 0) {
      notifyFail('Please add at least one tag when using "Filtered by endpoint tag".');
      return;
    }
    const selectedPackage = version.find((ver) => ver.displayName === agentVersion)
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
    const tagIds = tags.map((tag) => tag.id)
    const data = {
      scopeLevel: scopeLevel,
      scopeId: scopeId,
      id: selectedItem?.id,
      name: policyName,
      description: policyDescription,
      osType: selectedOS,
      package: {
        build: selectedPackage.build,
        fileId: selectedPackage.fileId || '0',
        major: selectedPackage.major,
        minor: selectedPackage.minor,
      },
      maxRetries,
      isScheduled: updateTiming == 'immediate' ? false : true,
      allEndpoints: affectedEndpoints == 'allEndpoints' ? true : false,
      orgId,
      toolId,
      tags: tagIds,
    }

    try {
      const response = await fetchUpgradePolicyUrl(data)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        setSave(false)
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
    setSave(false)
    onClose()
  }

  return (
    <Modal show={show} onHide={handleClose} className='application-modal'>
      <Modal.Header closeButton>
        {save ? (
          <Modal.Title>View Upgrade Policy</Modal.Title>
        ) : (
          <Modal.Title>Edit Upgrade Policy</Modal.Title>
        )}
        <button type='button' className='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        <div>
            <div className='mb-2'>{selectedItem?.name}</div>
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
                  disabled
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
                  {version?.map((ver, index) => (
                    <option key={index} value={ver.displayName}>
                      {ver.displayName}
                    </option>
                  ))}
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
          {affectedEndpoints === 'filteredEndpoints' && (
            <>
              <Form.Group controlId='tagSelection' className='mb-3'>
                <Row>
                  <Col sm='4'></Col>
                  <Col sm='3'>
                    <Form.Select value={tagKey} onChange={(e) => setTagKey(e.target.value)}>
                      <option value=''> select Tag Key</option>
                      {dropdownTags.map((tag, index) => (
                        <option key={index} value={tag.key}>
                          {tag.key}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col sm='3'>
                    <Form.Select
                      value={tagValue}
                      onChange={(e) => setTagValue(e.target.value)}
                      disabled={!tagKey}
                    >
                      <option value=''>select Tag Value</option>
                      {dropdownTags
                        .filter((tag) => tag.key === tagKey)
                        .map((tag, index) => (
                          <option key={index} value={tag.value}>
                            {tag.value}
                          </option>
                        ))}
                    </Form.Select>
                  </Col>
                  <Col sm='2'>
                    <Button variant='primary' onClick={handleAddTag}>
                      Add
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
              <div>
                Tags:
                {tags.map((tag, index) => (
                  <span key={index} className='badge badge-secondary mx-1'>
                    {tag.key}: {tag.value}{' '}
                    <Button variant='link' onClick={() => handleRemoveTag(index)}>
                      ×
                    </Button>
                  </span>
                ))}
              </div>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Cancel
        </Button>
        <Button style={{display: loading || save ? 'none' : 'inline-block'}} variant='primary' type='submit' onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AutoUpgradePolicyUpdateModal
