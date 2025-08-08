import React, {useState, useEffect, useRef} from 'react'
import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import Modal from 'react-bootstrap/Modal'
import {getCurrentTimeZone} from '../../../../../../utils/helper'

const IncidentChatNetwork = (selectedAlert) => {
  const userName = sessionStorage.getItem('userName') || 'Unknown User'
  const [commands, setCommands] = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [show, setShow] = useState(false)
  const [isResolved, setIsResolved] = useState(0)
  const containerRef = useRef(null)

  useEffect(() => {
    fetch('/ldms/media/reports/network_outage_commands.json')
      .then((res) => res.json())
      .then((data) => {
        setCommands(data)
      })
      .catch((err) => console.error('Fetch error:', err))
  }, [])

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [chatMessages])

  useEffect(() => {
    // Insert Message_1 at first render
    setChatMessages([
      {
        type: 'system',
        time: '2:02:17 PM',
      },
    ])
  }, [])

  const normalizeQuotes = (str) =>
    str.replace(/\\"/g, '"').replace(/[“”]/g, '"').trim().toLowerCase()

  const handleSend = (event) => {
    event.preventDefault()
    const inputCommand = event.target.elements.message.value.trim()
    if (inputCommand === '') return

    const time = new Date().toLocaleTimeString()
    const normalizedInput = normalizeQuotes(inputCommand)

    const matchedCommand = commands.find(
      (cmd) => normalizeQuotes(cmd.command) === normalizedInput && cmd.isResolved === isResolved
    )

    const newMessages = [
      {
        type: 'user',
        text: inputCommand,
        time,
      },
    ]

    if (matchedCommand) {
      setIsResolved(matchedCommand.isAfterResolved)
      newMessages.push({
        type: 'bot',
        text: `✅ Executed: ${matchedCommand.command}\n🧠 Response: ${matchedCommand.result}`,
        time,
      })
    } else {
      newMessages.push({
        type: 'bot',
        text: '❌ Command not recognized.',
        time,
      })
    }

    setChatMessages((prev) => [...prev, ...newMessages])
    event.target.reset()
  }

  const handleClose = () => setShow(false)

  const Message_1 = () => (
    <div className='d-flex flex-stack py-4'>
      <div className='d-flex'>
        <div className='symbol symbol-45px symbol-circle'>
          <img alt='Bot' src={toAbsoluteUrl('/media/avatars/bot.png')} width='32px' />
        </div>
        <div className='ms-5'>
          <p className='fs-5 fw-bolder text-blue mb-2'>
            Pluto <span className='sub-txt text-gray float-right'>2:02:17 PM</span>
          </p>
          <p className='fs-12 text-gray-900 mb-2'>
            A network outage alert was detected on {getCurrentTimeZone(selectedAlert?.detectedtime)}
            .
          </p>
          <table className='table-bordered chat-table mb-5'>
            <tbody>
              <tr className='text-center dark'>
                <td colSpan='3'>Threat Level</td>
              </tr>
              <tr className='text-center yellow'>
                <td colSpan='3'>Medium</td>
              </tr>
              <tr className='text-center dark'>
                <td colSpan='2'>Targeted Asset</td>
                <td colSpan='2'>Threat Actor</td>
              </tr>
              <tr className='text-center'>
                <td colSpan='2'>Windows</td>
                <td colSpan='2'>Nation State Group</td>
              </tr>
              <tr className='text-center dark'>
                <td colSpan='2'>Tactic</td>
                <td colSpan='2'>Technique</td>
              </tr>
              <tr className='text-center'>
                <td colSpan='2'>Command and Control</td>
                <td colSpan='2'>Network Denial of Service</td>
              </tr>
            </tbody>
          </table>
          <p className='fs-14'>Performing key information extraction...</p>
          <p className='mt-5 fs-14'>Performing enrichment of extracted data...</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div>
        <div className='mx-ht chat-ht'>
          <div className='chat-box scroll-y me-n5 h-500px' ref={containerRef}>
            <Message_1 />
            {chatMessages.map((message, index) => {
              if (message.type === 'system') return null
              const isUser = message.type === 'user'
              return (
                <div className='row mb-2' key={index}>
                  <div className='col-md-2'>
                    <div className='symbol symbol-45px symbol-circle'>
                      <img
                        alt='Pic'
                        src={
                          isUser
                            ? toAbsoluteUrl('/media/avatars/300-1.jpg')
                            : toAbsoluteUrl('/media/avatars/bot.png')
                        }
                      />
                    </div>
                  </div>
                  <div className='col-md-10'>
                    <a href='#' className='fs-5 fw-bolder text-blue text-hover-primary mb-2'>
                      {isUser ? userName : 'Pluto'}
                    </a>
                    <span className='sub-txt float-right'>{message.time}</span>
                    <p style={{whiteSpace: 'pre-line'}}>{message.text}</p>
                  </div>
                </div>
              )
            })}
            <div className='separator separator-dashed'></div>
          </div>
        </div>

        <form onSubmit={handleSend} className='chat-form pad-10'>
          <div className='input-group'>
            <input
              type='text'
              className='form-control bg-white'
              name='message'
              placeholder='Type your command here...'
            />
            <button type='submit' className='btn-chat'>
              <span className='input-group-text btn-new'>
                <i className='fas fa-paper-plane white'></i>
              </span>
            </button>
          </div>
        </form>
      </div>

      <Modal show={show} onHide={handleClose} className='chat-fullscreen'>
        <div className='col-md-12 border-1 border-gray-300 border-end chat-section'>
          <div className='chat-box scroll-y me-n5 h-600px'>
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

export default IncidentChatNetwork
