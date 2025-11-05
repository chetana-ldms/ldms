import React, {useEffect, useState} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import {
  fetchEmailSearchUrl,
  fetchIncidentConversationUrl,
  fetchReplyIncidentWithHtmlContentUrl,
  fetchReplyToForwardUrl,
} from '../../../../../api/IncidentsApi'
import {fetchSignatureUrl} from '../../../../../api/ConfigurationApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import RichTextEditor from '../../../../../../utils/RichTextEditor'
import AsyncCreatableSelect from 'react-select/async-creatable'
import {processHtmlWithInlineImages} from './processHtmlWithInlineImages'
import makeAnimated from 'react-select/animated'
import MessageTemplatesModal from './MessageTemplatesModel'
import QuotedTextModal from './QuotedTextModal'
const animatedComponents = makeAnimated()
const ReplyModal = ({show, onHide, incidentData, onSend}) => {
  const {orgId, toolId, incidentID} = incidentData || {}
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState([])
  const [loading, setLoading] = useState(false)
  const [cc, setCc] = useState([])
  const [bcc, setBcc] = useState([])
  const [subject, setSubject] = useState(`${incidentData?.subject || 'Incident update'}`)
  const [signature, setSignature] = useState('')
  const [hasSignatureInEditor, setHasSignatureInEditor] = useState(false)
  const [conversation, setConversation] = useState([])
  console.log('Conversation data:', conversation)
  const [showConversation, setShowConversation] = useState(false)
  const [conversationHtml, setConversationHtml] = useState('')
  const [showMessageTemplateModal, setShowMessageTemplateModal] = useState(false)
  const [showQuotedTextModal, setShowQuotedTextModal] = useState(false)
  const [quotedText, setQuotedText] = useState('')
  const [quotedAttachments, setQuotedAttachments] = useState([])

  const handleMessageTemplateClick = () => {
    setShowMessageTemplateModal(true)
  }

  const handleTemplateSelect = (templateHtml) => {
    if (templateHtml) {
      setMessage((prev) => `${prev}<br/>${templateHtml}`)
    }
    setShowMessageTemplateModal(false)
  }
  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
  const renderConversationHtml = (mail) => {
    // Helper to recursively get all HTML content
    const getAllMailContent = (m) => {
      let content = `
      On ${formatDateTime(m.createdAt)}, ${m.author || 'Unknown Sender'} wrote:<br>
      ${m.htmlCurrent || ''}<br><br>
    `

      if (Array.isArray(m.conversationMailTrailData) && m.conversationMailTrailData.length > 0) {
        content += m.conversationMailTrailData.map(getAllMailContent).join('')
      }

      return content
    }

    // ✅ Wrap all items inside a single quoted-text div
    const allContent = getAllMailContent(mail)

    const html = `
    <div rel='quoted-text'>
      <div style="border-left:1px solid #ccc; margin-left:8px; padding-left:8px; color:#6c757d;">
        ${allContent}
      </div>
    </div>
  `

    return html
  }

  const loadConversation = async () => {
    try {
      setConversation([])
      const response = await fetchIncidentConversationUrl(orgId, toolId, incidentID)

      if (response?.isSuccess) {
        const convos = response?.conversations || []
        const lastConvo = convos.length > 0 ? [convos[convos.length - 1]] : []
        setConversation(lastConvo)

        // ✅ Generate quoted HTML with single wrapper
        const conversationHtml = lastConvo.map((mail) => renderConversationHtml(mail)).join('')
        return conversationHtml
      } else {
        console.error('API failed:', response?.message)
        setConversation([])
        return ''
      }
    } catch (error) {
      console.error('Error fetching conversation:', error)
      setConversation([])
      return ''
    }
  }
  useEffect(() => {
    const userId = Number(sessionStorage.getItem('userId'))
    if (show && userId) {
      const loadSignature = async () => {
        try {
          const response = await fetchSignatureUrl(userId)
          if (response?.isSuccess && response.data?.signatureHtml) {
            const sigHtml = response.data.signatureHtml
            setSignature(sigHtml)
            setHasSignatureInEditor(true)
          } else {
            setSignature('')
            setHasSignatureInEditor(false)
          }
        } catch (err) {
          console.error(err)
          notifyFail('Failed to load signature')
          setSignature('')
          setHasSignatureInEditor(false)
        }
      }
      loadSignature()
    }
  }, [show])
  const handleAddSignature = () => {
    if (signature && !hasSignatureInEditor) {
      setMessage((prev) => `${prev}<br/>${signature}`)
      setHasSignatureInEditor(true)
    }
  }
  const handleClearSignature = () => {
    if (hasSignatureInEditor) {
      setMessage((prev) => prev.replace(signature, ''))
      setHasSignatureInEditor(false)
    }
  }
  const handleSend = async () => {
    if (!message || message === '<p><br></p>') {
      notifyFail('Please enter the message')
      return
    }

    const {cleanedHtml, attachments: inlineAttachments} = processHtmlWithInlineImages(message)

    try {
      setLoading(true)
      let responseData

      // ✅ Fetch quoted conversation HTML before sending (if applicable)
      const quotedHtml = await loadConversation()
      const finalBody = `
      <div>
        ${cleanedHtml}
      </div>
    `

      if (incidentData?.conversationId) {
        // ✅ Existing conversation (Reply)
        const data = {
          forwardDateTime: new Date().toISOString(),
          orgId: incidentData?.orgId,
          toolId: incidentData?.toolId,
          incidentId: incidentData?.incidentID,
          email: [incidentData?.incidentEmail],
          body: finalBody,
          ccEmails: cc.map((e) => e.value),
          bccEmails: bcc.map((e) => e.value),
          userId: Number(sessionStorage.getItem('userId')),
          includeOriginalAttachments: true,
          includePreviousConversations: true,
          conversationId: incidentData.conversationId,
        }
        responseData = await fetchReplyToForwardUrl(data)
      } else {
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
        const fromEmails = fromEmailsRaw
          .map((item) => extractEmail(item))
          .filter((email) => !!email)
        if (fromEmails.length === 0) {
          notifyFail('From email is required before sending the reply')
          setLoading(false)
          return
        }
        const previousConversations = quotedText ? [quotedText] : []
        const previousConversationsAttachments = quotedAttachments?.length
          ? quotedAttachments
          : conversation?.flatMap((mail) => mail.attachments || []) || []

        const data = {
          replyDateTime: new Date().toISOString(),
          orgId: incidentData?.orgId,
          toolId: incidentData?.toolId,
          incidentId: incidentData?.incidentID,
          notes: finalBody,
          ccEmails: cc.map((e) => e.value),
          bccEmails: bcc.map((e) => e.value),
          userId: Number(sessionStorage.getItem('userId')),
          attachments: [...attachments.map((f) => ({file: f})), ...inlineAttachments],
          PreviousConversations: previousConversations,
          PreviousConversations_Attachments: previousConversationsAttachments.map(
            (file, index) => ({
              file,
              ContentId: `inline_${index}.png`,
            })
          ),

          FromEmails: fromEmails,
        }

        responseData = await fetchReplyIncidentWithHtmlContentUrl(data)
      }

      const {isSuccess, message: responseMessage} = responseData
      if (isSuccess) {
        notify(responseMessage)
        setMessage('')
        setAttachments([])
        onHide()
        onSend()
      } else {
        notifyFail(responseMessage)
      }
    } catch (err) {
      console.error(err)
      notifyFail('Something went wrong while sending reply')
    } finally {
      setLoading(false)
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
  const handleClose = () => {
    setMessage('')
    setAttachments([])
    onHide()
  }
  const customStyles = {
    control: (base) => ({...base, minHeight: '40px'}),
    menu: (base) => ({...base, zIndex: 9999}),
  }
  useEffect(() => {
    if (incidentData) {
      setSubject(`${incidentData.subject || 'Incident update'}`)
      const ccList = Array.isArray(incidentData.replyCCEmails)
        ? incidentData.replyCCEmails
        : incidentData.replyCCEmails
        ? [incidentData.replyCCEmails]
        : []
      setCc(ccList.map((email) => ({label: email, value: email})))
      setBcc([])
    }
  }, [incidentData.incidentID])

  return (
    <Modal show={show} onHide={handleClose} className='replyModal application-modal' size='lg'>
      <ToastContainer />
      <Modal.Header closeButton>
        <Modal.Title>Reply</Modal.Title>
      </Modal.Header>

      <Modal.Body className='pt-1 pb-2'>
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
            <Form.Label className='col-md-2 col-form-label'>To</Form.Label>
            <div className='col-md-10'>
              <Form.Control type='email' value={incidentData?.incidentEmail || ''} disabled />
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
                components={{
                  ...animatedComponents,
                  DropdownIndicator: () => null,
                }}
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
                components={{
                  ...animatedComponents,
                  DropdownIndicator: () => null,
                }}
                styles={customStyles}
                value={bcc}
                onChange={setBcc}
                placeholder='Type or search email'
              />
            </div>
          </Form.Group>
          <Form.Group controlId='formBody'>
            <Form.Label>
              Message <sup className='red'>*</sup>
            </Form.Label>
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

            <RichTextEditor
              value={message}
              onChange={setMessage}
              onAttach={(file) => setAttachments((prev) => [...prev, file])}
            />
          </Form.Group>
          <Form.Group className='d-flex justify-content-end gap-2 mt-3'>
            {signature && (
              <>
                <Button
                  variant='outline-primary'
                  size='sm'
                  onClick={handleAddSignature}
                  disabled={hasSignatureInEditor}
                >
                  Add Signature
                </Button>
                <Button
                  variant='outline-danger'
                  size='sm'
                  onClick={handleClearSignature}
                  disabled={!hasSignatureInEditor}
                >
                  Clear Signature
                </Button>
              </>
            )}
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
            <Button variant='secondary me-2' onClick={handleClose} disabled={loading}>
              Close
            </Button>
            <Button variant='primary' onClick={handleSend} disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
export default ReplyModal
