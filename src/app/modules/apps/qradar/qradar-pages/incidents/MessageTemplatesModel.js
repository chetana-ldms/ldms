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
  const onlyOrgMode = !!propOrgId

  const [templates, setTemplates] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [types, setTypes] = useState([])
  const [groups, setGroups] = useState([])
  const [selectedType, setSelectedType] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [activeKey, setActiveKey] = useState(null)

  // Preview modal states
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')
  const [attachmentPreviewList, setAttachmentPreviewList] = useState([])

  // Reset modal
  const resetModalState = () => {
    setTemplates([])
    setSearch('')
    setSelectedType(null)
    setSelectedGroup(null)
    setActiveKey(null)
  }

  useEffect(() => {
    if (show) {
      loadDropdownData()
      loadTemplates()
    } else {
      resetModalState()
    }
  }, [show, effectiveOrgId])

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

  // ----------------------------------------------
  // ⭐ Convert CID inline images → Base64
  // ----------------------------------------------
  const processInlineImages = (html, attachments = []) => {
    if (!html || !attachments.length) return html

    let processedHtml = html

    attachments.forEach((att) => {
      if (att?.isInline && att?.contentId && att?.data) {
        const cidRef = `cid:${att.contentId}`
        const base64URL = `data:${att.fileType};base64,${att.data}`

        processedHtml = processedHtml.replaceAll(cidRef, base64URL)
      }
    })

    return processedHtml
  }

  // ----------------------------------------------
  // ⭐ Attachment Preview Renderer
  // ----------------------------------------------
  const renderAttachmentPreview = (att) => {
    if (!att?.data || !att?.fileType) return null

    const base64URL = `data:${att.fileType};base64,${att.data}`

    if (att.fileType.startsWith('image/')) {
      return (
        <div className='mb-2'>
          <img
            src={base64URL}
            alt={att.fileName}
            style={{
              maxWidth: '160px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <div className='small text-muted'>{att.fileName}</div>
        </div>
      )
    }

    return (
      <div className='mb-2'>
        <a href={base64URL} download={att.fileName}>
          📄 {att.fileName}
        </a>
      </div>
    )
  }
  const handleFetchTemplateProcess = async (templateId, isPreview = false, tplContent = '') => {
    if (onlyOrgMode) {
      if (!isPreview) {
        onSelectTemplate({
          html: tplContent,
          attachments: [], // org-mode has no attachments
        })
        handleClose()
      }
      return
    }

    try {
      setLoading(true)
      const response = await fetchMessageTemplatesProcessUrl(templateId, incidentID)

      if (response?.isSuccess && response?.templateData) {
        const allAttachments = response.attachmentsInBase64 || []

        // Final HTML with inline images fixed
        const finalHtml = processInlineImages(response.templateData, allAttachments)

        // Only non-inline attachments to show/send
        const nonInlineAttachments = allAttachments.filter((a) => a?.isInline === false)

        if (isPreview) {
          setAttachmentPreviewList(nonInlineAttachments)
          setPreviewHtml(finalHtml)
          setShowPreviewModal(true)
        } else {
          onSelectTemplate({
            html: finalHtml,
            attachments: nonInlineAttachments,
          })
          handleClose()
        }
      } else {
        alert('Failed to fetch template content.')
      }
    } catch (err) {
      console.error('Error fetching template:', err)
      alert('Something went wrong!')
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

  const handleClose = () => {
    resetModalState()
    onHide()
  }

  return (
    <>
      <Modal
        backdrop='static'
        keyboard={false}
        show={show}
        onHide={handleClose}
        centered
        size='lg'
        className='messageTemplatesModal application-modal'
      >
        <Modal.Header closeButton>
          <Modal.Title>Message Templates</Modal.Title>
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
                    <span className='fw-semibold text-primary fs-6'>{tpl.title}</span>
                  </Accordion.Header>

                  <Accordion.Body className='bg-light border rounded p-3'>
                    <div
                      className='text-dark lh-base mb-3'
                      style={{whiteSpace: 'pre-wrap', fontSize: '0.95rem'}}
                    >
                      {tpl.contentText}
                    </div>

                    <div className='d-flex justify-content-end gap-2'>
                      {!onlyOrgMode && (
                        <Button
                          variant='outline-primary'
                          size='sm'
                          onClick={(e) => {
                            e.stopPropagation()
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
                          handleFetchTemplateProcess(tpl.templateId, false, tpl.contentText)
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
      <Modal
        show={showPreviewModal}
        onHide={() => setShowPreviewModal(false)}
        size='lg'
        centered
        className='application-modal'
      >
        <Modal.Header closeButton>
          <Modal.Title>Template Preview</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div dangerouslySetInnerHTML={{__html: previewHtml}} />

          <hr />
          <h6>Attachments:</h6>

          {attachmentPreviewList
            .filter((att) => att?.isInline === false)
            .map((att) => (
              <div key={att.attachmentId}>{renderAttachmentPreview(att)}</div>
            ))}

          {attachmentPreviewList.filter((a) => a?.isInline === false).length === 0 && (
            <div>No attachments.</div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowPreviewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default MessageTemplatesModal
