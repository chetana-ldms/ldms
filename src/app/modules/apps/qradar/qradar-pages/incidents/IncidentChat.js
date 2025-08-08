import React, {useState, useEffect, useRef} from 'react'
import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import Modal from 'react-bootstrap/Modal'

const IncidentChat = () => {
  const [show, setShow] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const message_1 = useRef(null)
  const message_2 = useRef(null)
  const message_3 = useRef(null)
  const message_4 = useRef(null)
  const message_5 = useRef(null)

  const handleSend = (event) => {
    event.preventDefault()
    const message = event.target.elements.message.value.trim()
    if (message !== '') {
      setChatMessages([...chatMessages, {text: message, time: new Date().toLocaleTimeString()}])
      event.target.reset()
    }
  }

  const [showChat, setShowChat] = useState(1)

  useEffect(() => {
    if (showChat === 2) message_1.current?.scrollIntoView({block: 'end', behavior: 'smooth'})
    if (showChat === 3) message_2.current?.scrollIntoView({block: 'end', behavior: 'smooth'})
    if (showChat === 4) message_3.current?.scrollIntoView({block: 'end', behavior: 'smooth'})
    if (showChat === 5) message_4.current?.scrollIntoView({block: 'end', behavior: 'smooth'})
    if (showChat === 6) message_5.current?.scrollIntoView({block: 'end', behavior: 'smooth'})

    const timer = setTimeout(() => {
      setShowChat((prev) => prev + 1)
    }, 3000)

    return () => clearTimeout(timer)
  }, [showChat])

  const Message_1 = () => (
    <div className='d-flex flex-stack py-4' ref={message_1}>
      <div className='d-flex'>
        <div className='symbol symbol-45px symbol-circle'>
          <img alt='Pic' src={toAbsoluteUrl('/media/avatars/bot.png')} width='32px' />
        </div>
        <div className='ms-5'>
          <p className='fs-5 fw-bolder text-blue mb-2'>
            Pluto <span className='sub-txt text-gray float-right'>2:02:17 PM</span>
          </p>
          <p className='fs-12 text-gray-900 mb-2'>
            A failed login attempt was detected at Wed Jul 28 2022 21:02:17 GMT +0000 (UTC)
          </p>
          <table className='table-bordered chat-table mb-5'>
            <tr className='text-center dark'>
              <td colSpan='3'>Threat level</td>
            </tr>
            <tr className='text-center yellow'>
              <td colSpan='3'>High</td>
            </tr>
            <tr className='text-center dark'>
              <td colSpan='2'>Targeted Asset</td>
              <td colSpan='2'>Threat Actor</td>
            </tr>
            <tr className='text-center'>
              <td colSpan='2'>Windows</td>
              <td colSpan='2'>N/A</td>
            </tr>
            <tr className='text-center dark'>
              <td>Tactic</td>
              <td>Technique</td>
              <td>Credibility</td>
            </tr>
            <tr className='text-center'>
              <td>Credential Access</td>
              <td>Brute Force</td>
              <td>A1 Reliable</td>
            </tr>
          </table>
          <p className='fs-14'>Performing key Information extraction...</p>
          <p className='mt-5 fs-14'>Performing enrichment of extracted data...</p>
        </div>
      </div>
    </div>
  )

  const Message_2 = () => (
    <div className='d-flex flex-stack py-4' ref={message_2}>
      <div className='d-flex'>
        <div className='symbol symbol-45px symbol-circle'>
          <img alt='Pic' src={toAbsoluteUrl('/media/avatars/bot.png')} />
        </div>
        <div className='ms-5'>
          <p className='fs-5 fw-bolder text-blue mb-2'>
            System message <span className='sub-txt text-gray float-right'>2:02:20 PM</span>
          </p>
          <p className='fs-14'>
            Completed task "New Alert" from "Active Directory Account Failed to logon (manual)".
          </p>
        </div>
      </div>
    </div>
  )

  const Message_3 = () => (
    <div className='d-flex flex-stack py-4' ref={message_3}>
      <div className='d-flex'>
        <div className='symbol symbol-45px symbol-circle'>
          <img alt='Pic' src={toAbsoluteUrl('/media/avatars/bot.png')} />
        </div>
        <div className='ms-5'>
          <p className='fs-5 fw-bolder text-blue mb-2'>
            Pluto <span className='sub-txt text-gray float-right'>2:02:20 PM</span>
          </p>
          <p className='fw-bold fs-20'>User details</p>
          <div className='row'>
            <div className='col-md-2'>
              <div className='symbol symbol-45px symbol-circle'>
                <img alt='Pic' src={toAbsoluteUrl('/media/avatars/300-5.jpg')} />
              </div>
            </div>
            <div className='col-md-10'>
              <a href='#' className='fs-5 fw-bolder text-blue text-hover-primary mb-2'>
                Max Smith
              </a>
              <div className='fw-normal text-gray'>Cyber Defense Head Operation IT</div>
            </div>
          </div>
          <div className='d-flex align-items-center gap-2 mt-5'>
            <span className='fw-bold'>Member of :</span> Users, IT
          </div>
          <div className='d-flex align-items-center gap-2'>
            <span className='fw-bold'>Accout Locked :</span> False
          </div>
          <div className='d-flex align-items-center gap-2'>
            <span className='fw-bold'>Account Disabled :</span> False
          </div>
          <h5 className='mt-4'>Contact Details</h5>
          <div className='d-flex align-items-center gap-2'>
            <i className='fas fa-phone'></i>
            <a href='#' className='text-black'>
              +6141 234 567
            </a>
          </div>
          <div className='d-flex align-items-center gap-2'>
            <i className='fas fa-envelope'></i>
            <a href='#' className='text-black'>
              smith@kpmg.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )

  const Message_4 = () => (
    <div className='d-flex flex-stack py-4' ref={message_4}>
      <div className='d-flex'>
        <div className='symbol symbol-45px symbol-circle'>
          <img alt='Pic' src={toAbsoluteUrl('/media/avatars/bot.png')} />
        </div>
        <div className='ms-5'>
          <p className='fs-5 fw-bolder text-blue mb-2'>
            System message <span className='sub-txt text-gray float-right'>2:02:20 PM</span>
          </p>
          <p className='fs-14'>
            Completed task "Collect Information" from "Active Directory Account Failed to logon
            (manual)".
          </p>
          <p className='fs-14'>Completed task "Closed Approved Action" from same playbook.</p>
        </div>
      </div>
    </div>
  )

  const Message_5 = () => (
    <div className='text-center mb-5' ref={message_5}>
      <p className='fw-bolder'>Completed task in 2mins 2secs</p>
    </div>
  )

  return (
    <>
      <div>
        <div className='mx-ht chat-ht'>
          <div className='chat-box scroll-y me-n5 h-500px'>
            {showChat > 1 && <Message_1 />}
            {showChat > 2 && <Message_2 />}
            {showChat > 3 && <Message_3 />}
            {showChat > 4 && <Message_4 />}
            {showChat > 4 && <Message_5 />}
            {chatMessages.map((message, index) => (
              <div className='row' key={index}>
                <div className='col-md-2'>
                  <div className='symbol symbol-45px symbol-circle'>
                    <img alt='Pic' src={toAbsoluteUrl('/media/avatars/300-1.jpg')} />
                  </div>
                </div>
                <div className='col-md-10'>
                  <a href='#' className='fs-5 fw-bolder text-blue text-hover-primary mb-2'>
                    vinu@lancesoft.com Senior Analyst
                  </a>
                  <span className='sub-txt float-right'>{message.time}</span>
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            <div className='separator separator-dashed'></div>
          </div>
        </div>
        <form onSubmit={handleSend} className='chat-form pad-10'>
          <div className='input-group'>
            <input
              type='text'
              className='form-control bg-white'
              name='message'
              placeholder='Type your message here...'
            />
            <button type='submit' className='btn-chat'>
              <span className='input-group-text btn-new'>
                <i className='fas fa-paper-plane white'></i>
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Chat fullscreen modal (no header) */}
      <Modal show={show} onHide={handleClose} className='chat-fullscreen'>
        {/* Header removed */}
        <div className='col-md-12 border-1 border-gray-300 border-end chat-section'>
          <div className='chat-box scroll-y me-n5 h-600px'>
            <Message_1 />
            <Message_2 />
            <Message_3 />
            <Message_4 />
            <Message_5 />
            <div className='separator separator-dashed'></div>
          </div>
          <div className='input-group mb-5'>
            <span className='input-group-text'>
              <i className='fas fa-plus'></i>
            </span>
            <input type='text' className='form-control' placeholder='Message or Command' />
            <span className='input-group-text'>
              <i className='fas fa-face-smile'></i>
            </span>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default IncidentChat
