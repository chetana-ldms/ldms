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
  console.log(conversation, 'conversation')

  const loadConversation = async () => {
    try {
      setConversation([])
      const response = await fetchIncidentConversationUrl(orgId, toolId, incidentID)

      if (response?.isSuccess) {
        setConversation(response?.conversations || [])
      } else {
        console.error('API failed:', response?.message)
        setConversation([])
      }
    } catch (error) {
      console.error('Error fetching conversation:', error)
      setConversation([])
    }
  }

  useEffect(() => {
    if (show && orgId && toolId && incidentID) {
      loadConversation()
    }
  }, [show, orgId, toolId, incidentID])
  useEffect(() => {
    const userId = Number(sessionStorage.getItem('userId'))
    if (show && userId) {
      const loadSignature = async () => {
        try {
          const response = await fetchSignatureUrl(userId)
          if (response?.isSuccess && response.data?.signatureHtml) {
            const sigHtml = response.data.signatureHtml
            setSignature(sigHtml)
            setMessage(`<p><br/></p>${sigHtml}`) // load signature by default
            setHasSignatureInEditor(true) // mark as added
          } else {
            setSignature('')
            setMessage('<p><br/></p>')
            setHasSignatureInEditor(false)
          }
        } catch (err) {
          console.error(err)
          notifyFail('Failed to load signature')
          setSignature('')
          setMessage('<p><br/></p>')
          setHasSignatureInEditor(false)
        }
      }
      loadSignature()
    }
  }, [show])

  const handleAddSignature = () => {
    if (signature && !hasSignatureInEditor) {
      setMessage(signature)
      setHasSignatureInEditor(true)
    }
  }

  const handleClearSignature = () => {
    if (hasSignatureInEditor) {
      setMessage('')
      setHasSignatureInEditor(false)
    }
  }
  const handleSend = async () => {
    if (!message || message === '<p><br></p>') {
      notifyFail('Please enter the message')
      return
    }

    // Convert inline images to cid
    const {cleanedHtml, attachments: inlineAttachments} = processHtmlWithInlineImages(message)

    try {
      setLoading(true)

      let responseData
      if (incidentData?.conversationId) {
        // 🔹 Replying to Forward API
        const data = {
          forwardDateTime: new Date().toISOString(),
          orgId: incidentData?.orgId,
          toolId: incidentData?.toolId,
          incidentId: incidentData?.incidentID,
          email: [incidentData?.incidentEmail], // main "To" email
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
        // 🔹 Normal Incident Reply API
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
        <button type='button' className='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
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

          <Form.Group controlId='formBody' className=''>
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
            <RichTextEditor
              value={message}
              onChange={setMessage}
              onAttach={(file) => setAttachments((prev) => [...prev, file])}
            />
          </Form.Group>

          <Form.Group className='d-flex justify-content-end gap-2 mt-3'>
            <div>
              {' '}
              {signature && (
                <Form.Group className='d-flex justify-content-end gap-2 mt-3'>
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
                </Form.Group>
              )}
            </div>
            <div>
              <Button variant='secondary me-2' onClick={handleClose} disabled={loading}>
                Close
              </Button>
              <Button variant='primary' onClick={handleSend} disabled={loading}>
                {loading ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default ReplyModal
