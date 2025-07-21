import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { fetchReplyIncidentUrl } from '../../../../../api/IncidentsApi'
import { notify, notifyFail } from '../components/notification/Notification'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // Rich editor styles

const ReplyModal = ({ show, onHide, incidentData, onSend }) => {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!message || message === '<p><br></p>') {
      notifyFail('Please enter the message')
      return
    }

    const data = {
      replyDateTime: new Date().toISOString(),
      orgId: incidentData?.orgId,
      toolId: incidentData?.toolId,
      incidentId: incidentData?.incidentID,
      notes: message,
    }

    try {
      setLoading(true)
      const responseData = await fetchReplyIncidentUrl(data)
      const { isSuccess, message: responseMessage } = responseData
      if (isSuccess) {
        notify(responseMessage)
        setMessage('')
        onHide()
        onSend()
      } else {
        notifyFail(responseMessage)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setMessage('')
    onHide()
  }

  return (
    <Modal show={show} onHide={handleClose} className='replyModal application-modal' size='lg'>
      <ToastContainer />
      <Modal.Header closeButton>
        <Modal.Title>Reply</Modal.Title>
        <button type='button' className='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId='formTo'>
            <Form.Label>To</Form.Label>
            <Form.Control type='email' value={incidentData?.incidentEmail || ''} disabled />
          </Form.Group>

          <Form.Group controlId='formBody' className='mt-3'>
            <Form.Label>
              Message <sup className='red'>*</sup>
            </Form.Label>
            <ReactQuill
              value={message}
              onChange={setMessage}
              placeholder='Type your reply here...'
              theme='snow'
              style={{ minHeight: '200px' }}
            />
          </Form.Group>

          <Form.Group className='d-flex justify-content-end gap-2 mt-3'>
            <Button variant='secondary' onClick={handleClose} disabled={loading}>
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
