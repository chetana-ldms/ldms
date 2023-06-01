import React, {useCallback, useRef, useState} from 'react'
import {Container, Form, Button} from 'react-bootstrap'

const DemoSMS = () => {
  const [number, setNumber] = useState('')
  const [body, setBody] = useState('')
  const [message, setMessage] = useState('')
  const [storedMessage, setStoredMessage] = useState('')
  const [replyMessage, setReplyMessage] = useState('')

  const accountSid = 'AC706908ab1f90d8732aaa9ff965e693ba'
  const authToken = '843a69a7508fce85d89d75fb0c79b1d0'
  const apiUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('http://115.110.192.133:502/api/Notification/v1/SMS/Send', {
        method: 'POST',
        headers: {
          accept: 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          smsMessage: body,
          fromPhoneNumber: '+15855172328',
          toPhoneNumber: number,
        }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      setMessage('Message sent successfully.')
      setStoredMessage(data.message)
      console.log('storedMessage:', data.message)
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error)
      setMessage('Enter fields')
    }
  }

  const msgid = 'SM27abbe8936f44cfa895e476804977c1f'

  const onGetReply = async () => {
    try {
      const response = await fetch(
        `http://115.110.192.133:502/api/Notification/v1/SMS/GetReplyMessage`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messageID: msgid,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch reply message')
      }

      const data = await response.json()
      console.log('Reply:', data.content)
      if (data.content) {
        setReplyMessage(data.content)
      } else {
        setReplyMessage(data.message)
      }
    } catch (error) {
      console.error('Failed to fetch reply message:', error)
    }
  }

  return (
    <div className='row'>
      <div className='col-lg-6'>
        <div className='card-body'>
          <h4>Send SMS</h4>
          <Form onSubmit={onSubmit}>
            <Form.Group>
              <Form.Label htmlFor='to' className='fw-bold'>
                To
              </Form.Label>
              <Form.Control value={number} onChange={(e) => setNumber(e.target.value)} />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label htmlFor='message' className='fw-bold'>
                Message
              </Form.Label>
              <Form.Control
                as='textarea'
                rows='3'
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </Form.Group>
            <div className='clearfix' />
            <br />
            <Button className='float-left mt-10-mb-10' onClick={() => onGetReply()}>
              Get Reply
            </Button>
            <Button className='float-right' variant='primary' type='submit'>
              Send
            </Button>
            <div className='clearfix' />
            {message && <p className='mt-10 green fs-14'>Message sent successfully</p>}

            <div className='clearfix' />
            <Form.Group>
              <Form.Label htmlFor='message' className='fw-bold mt-5'>
                Show Reply msg:
              </Form.Label>
              <Form.Control
                as='textarea'
                rows='3'
                value={replyMessage}
                onChange={(e) => setBody(e.target.value)}
              />
            </Form.Group>
            {/* <p className='mt-10 green fs-14'>
              <span className='fw-bold'></span> {replyMessage}
            </p> */}
          </Form>
        </div>
      </div>
    </div>
  )
}
export {DemoSMS}
