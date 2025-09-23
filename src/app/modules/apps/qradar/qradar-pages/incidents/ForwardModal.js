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

const animatedComponents = makeAnimated()

const ForwardModal = ({show, onHide, incidentData, onForward}) => {
  console.log('Incident Data in Forward Modal:', incidentData)

  const [subject, setSubject] = useState(`${incidentData?.subject || 'Incident update'}`)
  const [to, setTo] = useState([])
  const [cc, setCc] = useState([])
  const [bcc, setBcc] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [includeOriginalAttachments, setIncludeOriginalAttachments] = useState(true)
  const [includePreviousConversations, setIncludePreviousConversations] = useState(true)
  const handleForward = async () => {
    if (!to.length || !subject || !message || message === '<p><br></p>') {
      notifyFail('All required fields must be filled')
      return
    }

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
        response = await fetchIncidentConversationForwardUrl({
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

          <Form.Group className='mb-1'>
            <RichTextEditor value={message} onChange={setMessage} />
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
