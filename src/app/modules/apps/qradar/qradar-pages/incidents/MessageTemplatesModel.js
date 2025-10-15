import React, {useEffect, useState} from 'react'
import {Modal, Button, InputGroup, Form, Spinner, Accordion, Row, Col} from 'react-bootstrap'
import Select from 'react-select'
import {
  fetchMessageTemplatesUrl,
  fetchTemplatesTemplateTypesUrl,
  fetchTemplatesGroupsUrl,
  fetchMessageTemplatesProcessUrl,
} from '../../../../../api/IncidentsApi'

const MessageTemplatesModal = ({
  show,
  onHide,
  onSelectTemplate,
  incidentData,
  orgId: propOrgId,
}) => {
  const effectiveOrgId = propOrgId || incidentData?.orgId
  const toolId = incidentData?.toolId || 0
  const incidentID = incidentData?.incidentID || null
  const onlyOrgMode = !!propOrgId // true => hide preview + skip process API

  const [templates, setTemplates] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [types, setTypes] = useState([])
  const [groups, setGroups] = useState([])
  const [selectedType, setSelectedType] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [activeKey, setActiveKey] = useState(null)

  useEffect(() => {
    if (show) {
      loadDropdownData()
      loadTemplates()
    } else {
      resetModalState()
    }
  }, [show, effectiveOrgId])

  const resetModalState = () => {
    setTemplates([])
    setSearch('')
    setSelectedType(null)
    setSelectedGroup(null)
    setActiveKey(null)
  }

  const loadDropdownData = async () => {
    try {
      const [typesRes, groupsRes] = await Promise.all([
        fetchTemplatesTemplateTypesUrl(),
        fetchTemplatesGroupsUrl(),
      ])
      setTypes(Array.isArray(typesRes?.data) ? typesRes.data : [])
      setGroups(Array.isArray(groupsRes?.data) ? groupsRes.data : [])
    } catch (err) {
      console.error('Failed to load dropdown data', err)
    }
  }

  const loadTemplates = async () => {
    setLoading(true)
    try {
      const payload = {
        orgId: effectiveOrgId,
        toolId: 0,
        templateId: 0,
        templatetypeid: selectedType?.masterId || 0,
        templategroupid: selectedGroup?.masterId || 0,
        searchText: search?.trim() || '',
      }

      const response = await fetchMessageTemplatesUrl(payload)
      if (response?.isSuccess && Array.isArray(response?.data)) {
        setTemplates(response.data)
      } else {
        setTemplates([])
      }
    } catch (err) {
      console.error('Failed to fetch templates', err)
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }

  const typeOptions = types.map((t) => ({
    label: t.displayName,
    value: t.templateTypeId,
    masterId: t.masterId,
  }))

  const groupOptions = groups.map((g) => ({
    label: g.displayName,
    value: g.templateGroupId,
    masterId: g.masterId,
  }))

  const customSelectStyle = {
    control: (provided) => ({
      ...provided,
      minHeight: '36px',
      fontSize: '0.9rem',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  }

  // ✅ Updated: Skip API if onlyOrgMode is true
  const handleFetchTemplateProcess = async (templateId, isPreview = false, tplContent = '') => {
    // Skip API if org mode (no incident context)
    if (onlyOrgMode) {
      if (typeof onSelectTemplate === 'function' && !isPreview) {
        onSelectTemplate(tplContent)
        handleClose()
      }
      return
    }

    try {
      setLoading(true)
      const transactionId = incidentID
      const response = await fetchMessageTemplatesProcessUrl(templateId, transactionId)

      if (response?.isSuccess && response?.templateData) {
        if (isPreview) {
          alert(`Preview:\n\n${response.templateData}`)
        } else if (typeof onSelectTemplate === 'function') {
          onSelectTemplate(response.templateData)
          handleClose()
        }
      } else {
        alert('Failed to fetch template content.')
      }
    } catch (error) {
      console.error('Error fetching template process:', error)
      alert('Something went wrong while fetching the template.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    resetModalState()
    onHide()
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size='lg'
      className='messageTemplatesModal application-modal'
    >
      <Modal.Header closeButton>
        <Modal.Title>Message Templates</Modal.Title>
        <button type='button' class='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>

      <Modal.Body>
        <Row className='align-items-center mb-3'>
          <Col md={4}>
            <InputGroup>
              <Form.Control
                placeholder='Search Message...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </Col>

          <Col md={3}>
            <Select
              options={typeOptions}
              value={selectedType}
              onChange={setSelectedType}
              isClearable
              placeholder='Select Type'
              styles={customSelectStyle}
            />
          </Col>

          <Col md={3}>
            <Select
              options={groupOptions}
              value={selectedGroup}
              onChange={setSelectedGroup}
              isClearable
              placeholder='Select Group'
              styles={customSelectStyle}
            />
          </Col>

          <Col md={2} className='text-end'>
            <Button variant='primary sm' onClick={loadTemplates}>
              <i className='fa fa-search me-1'></i>
            </Button>
          </Col>
        </Row>

        {loading ? (
          <div className='text-center my-3'>
            <Spinner animation='border' size='sm' /> Loading templates...
          </div>
        ) : templates.length === 0 ? (
          <div className='text-muted text-center my-3'>No templates found.</div>
        ) : (
          <Accordion alwaysOpen activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
            {templates.map((tpl, index) => (
              <Accordion.Item eventKey={index.toString()} key={tpl.templateId}>
                <Accordion.Header>
                  <div className='d-flex justify-content-between align-items-center w-100'>
                    <span className='fw-semibold text-primary fs-6'>{tpl.title}</span>
                  </div>
                </Accordion.Header>

                <Accordion.Body className='bg-light border rounded p-3'>
                  <div
                    className='text-dark lh-base mb-3'
                    style={{whiteSpace: 'pre-wrap', fontSize: '0.95rem'}}
                  >
                    {tpl.content}
                  </div>

                  <div className='d-flex justify-content-end gap-2'>
                    {!onlyOrgMode && (
                      <Button
                        variant='outline-primary'
                        size='sm'
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveKey(index.toString())
                          handleFetchTemplateProcess(tpl.templateId, true)
                        }}
                      >
                        Preview
                      </Button>
                    )}

                    <Button
                      variant='primary'
                      size='sm'
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFetchTemplateProcess(tpl.templateId, false, tpl.content)
                      }}
                    >
                      Select Template
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MessageTemplatesModal
