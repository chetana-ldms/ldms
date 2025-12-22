import React, {useEffect, useState} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import {ToastContainer} from 'react-toastify'
import RichTextEditor from '../../../../../../utils/RichTextEditor'
import AsyncCreatableSelect from 'react-select/async-creatable'
import makeAnimated from 'react-select/animated'
import {
  fetchEmailSearchUrl,
  fetchForwardIncidentUrl,
  fetchIncidentConversationForwardUrl,
  fetchReplyToForwardUrl,
} from '../../../../../api/IncidentsApi'
import {notify, notifyFail} from '../components/notification/Notification'
import MessageTemplatesModal from './MessageTemplatesModel'
import {processHtmlWithInlineImages} from './processHtmlWithInlineImages'
import QuotedTextModal from './QuotedTextModal'

const animatedComponents = makeAnimated()

const ForwardModal = ({show, onHide, incidentData, onForward}) => {
  console.log('Incident Data in Forward Modal:', incidentData)
  const [attachments, setAttachments] = useState([])
  const [subject, setSubject] = useState(`${incidentData?.subject || 'Incident update'}`)
  const [to, setTo] = useState([])
  const [cc, setCc] = useState([])
  const [bcc, setBcc] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [includeOriginalAttachments, setIncludeOriginalAttachments] = useState(true)
  const [includePreviousConversations, setIncludePreviousConversations] = useState(true)
  const [showMessageTemplateModal, setShowMessageTemplateModal] = useState(false)
  const [showQuotedTextModal, setShowQuotedTextModal] = useState(false)
  const [quotedText, setQuotedText] = useState('')
  const [quotedAttachments, setQuotedAttachments] = useState([])
  const [conversation, setConversation] = useState([])
  console.log('Conversation data:', conversation)

  const handleMessageTemplateClick = () => {
    setShowMessageTemplateModal(true)
  }

  const handleTemplateSelect = (templateHtml) => {
    if (templateHtml) {
      setMessage((prev) => `${prev}<br/>${templateHtml?.html}`)
      setAttachments((prev) => [...prev, ...(templateHtml?.attachments || [])])
    }
    setShowMessageTemplateModal(false)
  }
  const handleForward = async () => {
    if (!to.length || !subject || !message || message === '<p><br></p>') {
      notifyFail('All required fields must be filled')
      return
    }
    const extractEmail = (text) => {
      if (!text) return null
      const match = text.match(/<?([\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})>?/)
      return match ? match[1] : null
    }
    const fromEmailsRaw = Array.isArray(incidentData?.toEmails)
      ? incidentData.toEmails
      : incidentData?.toEmails
      ? [incidentData.toEmails]
      : incidentData?.incidentEmail
      ? [incidentData.incidentEmail]
      : []
    const fromEmails = fromEmailsRaw.map((item) => extractEmail(item)).filter((email) => !!email)
    if (fromEmails.length === 0) {
      notifyFail('From email is required before sending the reply')
      setLoading(false)
      return
    }
    const {cleanedHtml, attachments: inlineAttachments} = processHtmlWithInlineImages(message)
    const previousConversations = quotedText ? [quotedText] : []
    const previousConversationsAttachments = quotedAttachments?.length
      ? quotedAttachments
      : conversation?.flatMap((mail) => mail.attachments || []) || []

    // Base data (common)
    const baseData = {
      forwardDateTime: new Date().toISOString(),
      orgId: incidentData?.orgId || 0,
      toolId: incidentData?.toolId || 0,
      incidentId: incidentData?.incidentID || 0,
      body: message,
      email: to.map((e) => e.value),
      ccEmails: cc.map((e) => e.value),
      bccEmails: bcc.map((e) => e.value),
      userId: Number(sessionStorage.getItem('userId')) || 0,
    }

    let response
    try {
      setLoading(true)

      if (incidentData?.replyForward) {
        // 🔹 Reply API
        response = await fetchReplyToForwardUrl({
          forwardDateTime: baseData.forwardDateTime,
          orgId: baseData.orgId,
          toolId: baseData.toolId,
          incidentId: baseData.incidentId,
          body: baseData.body,
          email: baseData.email,
          ccEmails: baseData.ccEmails,
          bccEmails: baseData.bccEmails,
          userId: baseData.userId,
        })
      } else if (incidentData?.conversationId) {
        // 🔹 Conversation-specific forward API
        response = await fetchForwardIncidentUrl({
          ...baseData,
          includeOriginalAttachments,
          includePreviousConversations,
          conversationId: incidentData.conversationId,
        })
      } else {
        // 🔹 Default forward API
        response = await fetchForwardIncidentUrl({
          ...baseData,
          includeOriginalAttachments,
          includePreviousConversations,
          FromEmails: fromEmails,
          Subject: incidentData?.subject,
          attachments: [...attachments.map((f) => ({file: f})), ...inlineAttachments],
          PreviousConversations: previousConversations,
          PreviousConversations_Attachments: previousConversationsAttachments.map(
            (file, index) => ({
              file,
              ContentId: `inline_${index}.png`,
            })
          ),
        })
      }

      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        handleClose()
        onForward()
      } else {
        notifyFail(message)
      }
    } catch (err) {
      notifyFail(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (incidentData) {
      setSubject(`${incidentData.subject || 'Incident update'}`)
      setCc([])
      setBcc([])
    }
  }, [incidentData?.incidentID])
  const handleClose = () => {
    setSubject(`${incidentData?.subject || 'Incident update'}`)
    setTo([])
    setCc([])
    setBcc([])
    setMessage('')
    if (incidentData?.replyForward) {
      onHide({...incidentData, replyForward: false})
    } else {
      onHide()
    }
  }

  const loadEmailOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 1) return []
    const response = await fetchEmailSearchUrl(
      incidentData?.orgId,
      incidentData?.toolId,
      inputValue
    )
    if (!response || !Array.isArray(response)) return []
    return response.map((email) => ({label: email, value: email}))
  }

  const customStyles = {
    control: (base) => ({...base, minHeight: '40px'}),
    menu: (base) => ({...base, zIndex: 9999}),
  }

  return (
    <Modal show={show} onHide={handleClose} size='lg' className='forwardModal application-modal'>
      <ToastContainer />
      <Modal.Header closeButton>
        <Modal.Title> {incidentData?.replyForward ? 'Reply' : 'Forward'}</Modal.Title>
        <button type='button' className='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>

      <Modal.Body className='py-2'>
        <Form>
          <Form.Group className='mb-1 row align-items-center'>
            <Form.Label className='col-md-2 col-form-label'>From</Form.Label>
            <div className='col-md-10'>
              <Form.Control
                type='text'
                value={
                  Array.isArray(incidentData?.toEmails) ? incidentData.toEmails.join(', ') : ''
                }
                disabled
              />
            </div>
          </Form.Group>

          <Form.Group className='mb-1 row align-items-center'>
            <Form.Label className='col-md-2 col-form-label'>
              Subject <sup className='red'>*</sup>
            </Form.Label>
            <div className='col-md-10'>
              <Form.Control
                type='text'
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder='Subject'
              />
            </div>
          </Form.Group>

          <Form.Group className='mb-1 row align-items-center'>
            <Form.Label className='col-md-2 col-form-label'>
              To <sup className='red'>*</sup>
            </Form.Label>
            <div className='col-md-10'>
              <AsyncCreatableSelect
                isMulti
                cacheOptions
                defaultOptions
                loadOptions={loadEmailOptions}
                components={{...animatedComponents, DropdownIndicator: () => null}}
                styles={customStyles}
                value={to}
                onChange={setTo}
                placeholder='Type or search email'
              />
            </div>
          </Form.Group>

          <Form.Group className='mb-1 row align-items-center'>
            <Form.Label className='col-md-2 col-form-label'>Cc</Form.Label>
            <div className='col-md-10'>
              <AsyncCreatableSelect
                isMulti
                cacheOptions
                defaultOptions
                loadOptions={loadEmailOptions}
                components={{...animatedComponents, DropdownIndicator: () => null}}
                styles={customStyles}
                value={cc}
                onChange={setCc}
                placeholder='Type or search email'
              />
            </div>
          </Form.Group>

          <Form.Group className='mb-1 row align-items-center'>
            <Form.Label className='col-md-2 col-form-label'>Bcc</Form.Label>
            <div className='col-md-10'>
              <AsyncCreatableSelect
                isMulti
                cacheOptions
                defaultOptions
                loadOptions={loadEmailOptions}
                components={{...animatedComponents, DropdownIndicator: () => null}}
                styles={customStyles}
                value={bcc}
                onChange={setBcc}
                placeholder='Type or search email'
              />
            </div>
          </Form.Group>
          {attachments.length > 0 && (
            <div className='d-flex flex-wrap gap-2 mb-2'>
              {attachments.map((file, idx) => (
                <div
                  key={idx}
                  className='d-flex align-items-center px-2 py-1 border rounded bg-light'
                  style={{fontSize: '13px'}}
                >
                  <span className='me-2'>
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                  <button
                    type='button'
                    className='btn btn-sm btn-link text-danger p-0'
                    onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className='d-flex justify-content-end mb-2'></div>
          <div className='d-flex justify-content-end mb-2'>
            <Button
              variant='outline-secondary'
              size='sm'
              onClick={() => setShowQuotedTextModal(true)}
            >
              <i className='fa fa-quote-right me-1'></i> Previous Conversation
            </Button>
          </div>
          <QuotedTextModal
            show={showQuotedTextModal}
            onHide={() => setShowQuotedTextModal(false)}
            orgId={incidentData?.orgId}
            toolId={incidentData?.toolId}
            incidentID={incidentData?.incidentID}
            onSave={({PreviousConversations, PreviousConversations_Attachments}) => {
              setQuotedText(PreviousConversations)
              setQuotedAttachments(PreviousConversations_Attachments)
            }}
          />
          <Form.Group className='mb-1'>
            <RichTextEditor
              value={message}
              onChange={setMessage}
              onAttach={(file) => setAttachments((prev) => [...prev, file])}
            />
          </Form.Group>
          {/* Show checkboxes only when conversationId exists and NOT replyForward */}
          {!incidentData?.conversationId && !incidentData?.replyForward && (
            <div className='mb-2 ms-2 mt-2'>
              <Form.Check
                type='checkbox'
                id='includeOriginalAttachments'
                label='Include Original Attachments'
                inline
                checked={includeOriginalAttachments}
                onChange={(e) => setIncludeOriginalAttachments(e.target.checked)}
              />
              <Form.Check
                type='checkbox'
                id='includePreviousConversations'
                label='Include Previous Conversations'
                inline
                checked={includePreviousConversations}
                onChange={(e) => setIncludePreviousConversations(e.target.checked)}
              />
            </div>
          )}

          <div className='d-flex justify-content-end gap-2 mt-3'>
            <Button
              variant='outline-info'
              size='sm'
              onClick={() => setShowMessageTemplateModal(true)}
              title='Insert Message Template'
            >
              <i className='fa fa-file-alt'></i> Templates
            </Button>

            <MessageTemplatesModal
              show={showMessageTemplateModal}
              onHide={() => setShowMessageTemplateModal(false)}
              onSelectTemplate={handleTemplateSelect}
              incidentData={incidentData}
            />
            <Button variant='secondary' onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant='primary' onClick={handleForward} disabled={loading}>
              {loading
                ? incidentData?.replyForward
                  ? 'Replying...'
                  : 'Forwarding...'
                : incidentData?.replyForward
                ? 'Reply'
                : 'Forward'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default ForwardModal
