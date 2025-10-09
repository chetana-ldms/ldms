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
  let html = `
    <div style="margin-top:10px; padding-top:10px; border-top:1px solid #ddd;">
      <p><strong>${mail.originalMailHeader || 'Mail'}</strong> - ${formatDateTime(mail.createdAt)}</p>
      <div><strong>From:</strong> ${mail.author || ''}</div>
      ${mail.toEmails ? `<div><strong>To:</strong> ${mail.toEmails}</div>` : ''}
      ${mail.ccEmails ? `<div><strong>Cc:</strong> ${mail.ccEmails}</div>` : ''}
      ${mail.bccEmails ? `<div><strong>Bcc:</strong> ${mail.bccEmails}</div>` : ''}
      <div>${mail.htmlCurrent || ''}</div>
    </div>
  `;

  // ✅ If there are nested trails, just append their content directly (no extra blockquotes)
  if (Array.isArray(mail.conversationMailTrailData) && mail.conversationMailTrailData.length > 0) {
    html += mail.conversationMailTrailData.map(trail => renderConversationHtml(trail)).join('');
  }

  return html;
};

const loadConversation = async () => {
  try {
    setConversation([]);

    const response = await fetchIncidentConversationUrl(orgId, toolId, incidentID);
    if (response?.isSuccess) {
      const convos = response?.conversations || [];
      const lastConvo = convos[convos.length - 1] ? [convos[convos.length - 1]] : [];
      setConversation(lastConvo);

      // Combine all conversation HTML
      const innerHtml = lastConvo.map((mail) => renderConversationHtml(mail)).join('');

      // ✅ Wrap everything in ONE <blockquote>
      const conversationHtml = `
        <blockquote style="margin-left:20px; border-left:2px solid #ccc; padding-left:10px;">
          ${innerHtml}
        </blockquote>
      `;

      return conversationHtml;
    } else {
      console.error('API failed:', response?.message);
      setConversation([]);
      return '';
    }
  } catch (error) {
    console.error('Error fetching conversation:', error);
    setConversation([]);
    return '';
  }
};

  const handleShowConversation = async () => {
    const convoHtml = await loadConversation()
    if (convoHtml) {
      setMessage((prev) => `${prev}<br/>${convoHtml}`)
      setShowConversation(true)
    }
  }
  const handleHideConversation = () => {
    setMessage((prev) => prev.replace(/<blockquote[\s\S]*<\/blockquote>/, ''))
    setShowConversation(false)
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
      if (incidentData?.conversationId) {
        const data = {
          forwardDateTime: new Date().toISOString(),
          orgId: incidentData?.orgId,
          toolId: incidentData?.toolId,
          incidentId: incidentData?.incidentID,
          email: [incidentData?.incidentEmail],
          body: cleanedHtml,
          ccEmails: cc.map((e) => e.value),
          bccEmails: bcc.map((e) => e.value),
          userId: Number(sessionStorage.getItem('userId')),
          includeOriginalAttachments: true,
          includePreviousConversations: true,
          conversationId: incidentData.conversationId,
        }
        responseData = await fetchReplyToForwardUrl(data)
      } else {
        const data = {
          replyDateTime: new Date().toISOString(),
          orgId: incidentData?.orgId,
          toolId: incidentData?.toolId,
          incidentId: incidentData?.incidentID,
          notes: cleanedHtml,
          ccEmails: cc.map((e) => e.value),
          bccEmails: bcc.map((e) => e.value),
          userId: Number(sessionStorage.getItem('userId')),
          attachments: [...attachments.map((f) => ({file: f})), ...inlineAttachments],
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
            <div className='d-flex justify-content-end mb-2'>
              {!showConversation ? (
                <Button variant='outline-secondary' size='sm' onClick={handleShowConversation}>
                  Add Previous Conversation
                </Button>
              ) : (
                <Button variant='outline-danger' size='sm' onClick={handleHideConversation}>
                  Remove Previous Conversation
                </Button>
              )}
            </div>
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
