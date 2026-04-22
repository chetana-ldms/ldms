import React, {useState, useEffect, useRef, useMemo} from 'react'
import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import Modal from 'react-bootstrap/Modal'
import {getCurrentTimeZone} from '../../../../../../utils/helper'

const IncidentChatMemory = ({selectedAlert}) => {
  console.log('selectedAlertMemory', selectedAlert)
  const [show, setShow] = useState(false)
  const [fixedTime] = useState(() => {
    const now = new Date()
    return `${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString('en-GB', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })}`
  })

  const addedTime = useMemo(() => {
    const [dateStr, timeStr] = fixedTime.split(' ')
    const [day, month, year] = dateStr.split('/').map(Number)
    const [time, modifier] = timeStr.split(' ')
    let [h, m, s] = time.split(':').map(Number)

    if (modifier === 'PM' && h < 12) h += 12
    if (modifier === 'AM' && h === 12) h = 0

    const date = new Date(year, month - 1, day, h, m, s + 2) // add 2 seconds
    return `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString('en-GB', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })}`
  }, [fixedTime])

  const [chatMessages, setChatMessages] = useState([])
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const message_1 = useRef(null)
  const message_2 = useRef(null)
  const message_3 = useRef(null)
  const message_4 = useRef(null)
  const message_5 = useRef(null)
  const message_6 = useRef(null)
  const message_7 = useRef(null)
  const message_8 = useRef(null)
  const message_9 = useRef(null)

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
    // if (showChat === 4) message_3.current?.scrollIntoView({block: 'end', behavior: 'smooth'})
    if (showChat === 5) message_4.current?.scrollIntoView({block: 'end', behavior: 'smooth'})
    if (showChat === 6) message_5.current?.scrollIntoView({block: 'end', behavior: 'smooth'})
    if (showChat === 7) message_6.current?.scrollIntoView({block: 'end', behavior: 'smooth'})
    // if (showChat === 8) message_7.current?.scrollIntoView({block: 'end', behavior: 'smooth'})
    if (showChat === 9) message_8.current?.scrollIntoView({block: 'end', behavior: 'smooth'})
    // if (showChat === 10) message_9.current?.scrollIntoView({block: 'end', behavior: 'smooth'})

    const timer = setTimeout(() => {
      setShowChat((prev) => prev + 1)
    }, 3000)

    return () => clearTimeout(timer)
  }, [showChat])
  const getTimeAfterSeconds = (baseDateTimeString, secondsToAdd) => {
    const [dateStr, timeStr, modifier] = baseDateTimeString.split(' ')
    const [day, month, year] = dateStr.split('/').map(Number)
    let [hours, minutes, seconds] = timeStr.split(':').map(Number)
    if (modifier === 'PM' && hours < 12) hours += 12
    if (modifier === 'AM' && hours === 12) hours = 0
    const date = new Date(year, month - 1, day, hours, minutes, seconds + secondsToAdd)
    return date
      .toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      .replace('am', 'AM')
      .replace('pm', 'PM')
  }

  const Message_1 = () => (
    <div className='d-flex flex-stack py-4' ref={message_1}>
      <div className='d-flex'>
        <div className='symbol symbol-45px symbol-circle'>
          <img alt='Pic' src={toAbsoluteUrl('/media/avatars/bot.png')} width='32px' />
        </div>
        <div className='ms-5'>
          <p className='fs-5 fw-bolder text-blue mb-2'>
            Pluto{' '}
            <span className='sub-txt text-gray float-right'>
              {' '}
              {getTimeAfterSeconds(fixedTime, 0)}
            </span>
          </p>
          <p className='fs-12 text-gray-900 mb-2'>
            A {selectedAlert?.name} the Alert at {getCurrentTimeZone(selectedAlert?.detectedtime)}
          </p>
          <table className='table-bordered chat-table mb-5'>
            <tr className='text-center dark'>
              <td colSpan='3'>Threat level</td>
            </tr>
            <tr className='text-center yellow'>
              <td colSpan='3'>High</td>
            </tr>
            <tr className='text-center dark'>
              <td>Targeted Asset</td>
              <td>Threat Actor</td>
            </tr>
            <tr className='text-center'>
              <td>Windows : (10.0.0.25)</td>
              <td>Insider</td>
            </tr>
            <tr className='text-center dark'>
              <td>Tactic</td>
              <td>Technique</td>
            </tr>
            <tr className='text-center'>
              <td>Impact</td>
              <td>Resource hijacking</td>
            </tr>
          </table>
          <p className='fs-14'>Performing key Information extraction...</p>
          <p className='mt-5 fs-14'>Performing enrichment of extracted data...</p>
        </div>
      </div>
    </div>
  )
  const Message_2 = () => (
    <div className='d-flex flex-stack py-4' ref={message_3}>
      <div className='d-flex'>
        <div className='symbol symbol-45px symbol-circle'>
          <img alt='Pic' src={toAbsoluteUrl('/media/avatars/bot.png')} />
        </div>
        <div className='ms-5'>
          <p className='fs-5 fw-bolder text-blue mb-2'>
            Pluto{' '}
            <span className='sub-txt text-gray float-right'>
              {' '}
              {getTimeAfterSeconds(fixedTime, 2)}
            </span>
          </p>
          <p className=''>Attempting to reach server `10.0.0.25` in the network...</p>
          <p className=''>Executed the command: ping 10.0.0.25 </p>
          <p className='fs-14'>Ping result:** ✅ Host reachable</p>
        </div>
      </div>
    </div>
  )
  const Message_4 = () => (
    <div className='d-flex flex-stack py-4' ref={message_3}>
      <div className='d-flex'>
        <div className='symbol symbol-45px symbol-circle'>
          <img alt='Pic' src={toAbsoluteUrl('/media/avatars/bot.png')} />
        </div>
        <div className='ms-5'>
          <p className='fs-5 fw-bolder text-blue mb-2'>
            Pluto{' '}
            <span className='sub-txt text-gray float-right'>
              {' '}
              {getTimeAfterSeconds(fixedTime, 6)}
            </span>
          </p>
          <p className=''>Establish remote session to 10.0.0.25</p>
          <p>Executing command: Enter-PSSession -ComputerName 10.0.0.25 -Credential $Credential</p>
          <p>Remote session to 10.0.0.25 established successfully </p>
        </div>
      </div>
    </div>
  )

  const Message_5 = () => (
    <div className='d-flex flex-stack py-4' ref={message_4}>
      <div className='d-flex'>
        <div className='symbol symbol-45px symbol-circle'>
          <img alt='Pic' src={toAbsoluteUrl('/media/avatars/bot.png')} />
        </div>
        <div className='ms-5'>
          <p className='fs-5 fw-bolder text-blue mb-2'>
            Pluto{' '}
            <span className='sub-txt text-gray float-right'>
              {' '}
              {getTimeAfterSeconds(fixedTime, 8)}
            </span>
          </p>
          <p className='fs-14'>Identify the high consuming process</p>
          <p className='fs-14'>
            Executing command: Get-Process | Sort-Object -Property WorkingSet -Descending |
            Select-Object -First 5
          </p>
          <p className='fs-14'>java.exe with PID 9876 is consuming the most memory</p>
        </div>
      </div>
    </div>
  )
  const Message_6 = () => (
    <div className='d-flex flex-stack py-4' ref={message_4}>
      <div className='d-flex'>
        <div className='symbol symbol-45px symbol-circle'>
          <img alt='Pic' src={toAbsoluteUrl('/media/avatars/bot.png')} />
        </div>
        <div className='ms-5'>
          <p className='fs-5 fw-bolder text-blue mb-2'>
            Pluto{' '}
            <span className='sub-txt text-gray float-right'>
              {' '}
              {getTimeAfterSeconds(fixedTime, 10)}
            </span>
          </p>
          <p className='fs-14'>Executing command:Stop-Process -Id 9876 -Force</p>
          <p className='fs-14'>Command executed successfully</p>
          <p className='fs-14'>Result:** Process `9876` (Java) terminated.</p>
        </div>
      </div>
    </div>
  )
  const Message_8 = () => (
    <div className='d-flex flex-stack py-4' ref={message_4}>
      <div className='d-flex'>
        <div className='symbol symbol-45px symbol-circle'>
          <img alt='Pic' src={toAbsoluteUrl('/media/avatars/bot.png')} />
        </div>
        <div className='ms-5'>
          <p className='fs-5 fw-bolder text-blue mb-2'>
            Pluto{' '}
            <span className='sub-txt text-gray float-right'>
              {' '}
              {getTimeAfterSeconds(fixedTime, 14)}
            </span>
          </p>
          <p className='fs-14'>Running validation check to confirm memory release</p>
          <p className='fs-14'>Executing command:Get-Process | Measure-Object WorkingSet -Sum</p>
          <p className='fs-14'>Memory usage dropped from 91% → 56%</p>
          <p>Completed The Task in 18 seconds</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div>
        <div className='mx-ht chat-ht'>
          <div className='chat-box scroll-y me-n5 h-500px'>
            {showChat > 1 && <Message_1 />}
            {showChat > 2 && <Message_2 />}
            {/* {showChat > 3 && <Message_3 />} */}
            {showChat > 4 && <Message_4 />}
            {showChat > 5 && <Message_5 />}
            {showChat > 6 && <Message_6 />}
            {/* {showChat > 7 && <Message_7 />} */}
            {showChat > 8 && <Message_8 />}
            {/* {showChat > 9 && <Message_9 />} */}
            {chatMessages.map((message, index) => (
              <div className='row' key={index}>
                <div className='col-md-2'>
                  <div className='symbol symbol-45px symbol-circle'>
                    <img alt='Pic' src={toAbsoluteUrl('/media/avatars/300-1.jpg')} />
                  </div>
                </div>
                <div className='col-md-10'>
                  <a href='#' className='fs-5 fw-bolder text-blue text-hover-primary mb-2'>
                   Senior Security Analyst
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
            {showChat > 1 && <Message_1 />}
            {showChat > 2 && <Message_2 />}
            {/* {showChat > 3 && <Message_3 />} */}
            {showChat > 4 && <Message_4 />}
            {showChat > 5 && <Message_5 />}
            {showChat > 6 && <Message_6 />}
            {/* {showChat > 7 && <Message_7 />} */}
            {showChat > 8 && <Message_8 />}
            {/* {showChat > 9 && <Message_9 />} */}
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

export default IncidentChatMemory
