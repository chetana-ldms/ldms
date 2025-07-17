import React, {useState} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import {fetchReplyIncidentUrl} from '../../../../../api/IncidentsApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ReplyModal = ({show, onHide, incidentData, onSend}) => {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!message) {
      notifyFail('Please enter the message')
      return
    }
    setLoading(true)
    const data = {
      replyDateTime: new Date().toISOString(),
      orgId: incidentData?.orgId,
      toolId: incidentData?.toolId,
      incidentId: incidentData?.incidentID,
      notes: message,
    }
    try {
      const responseData = await fetchReplyIncidentUrl(data)
      const {isSuccess, message: responseMessage} = responseData
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
    <Modal show={show} onHide={handleClose} className='replyModal application-modal'>
      <ToastContainer />
      <Modal.Header closeButton>
        <Modal.Title>Reply</Modal.Title>
        <button type='button' class='application-modal-close' aria-label='Close'>
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
            <textarea
              name='message'
              className='form-control'
              placeholder='Type your reply here...'
              rows={8}
              style={{minHeight: '150px'}}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
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
