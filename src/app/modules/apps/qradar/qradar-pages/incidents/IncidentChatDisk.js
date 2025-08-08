import React, {useState, useEffect, useRef} from 'react'
import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import Modal from 'react-bootstrap/Modal'

const IncidentChatDisk = () => {
  const userName = sessionStorage.getItem('userName') || 'Unknown User'
  const [steps, setSteps] = useState([])
  const [chatSteps, setChatSteps] = useState([])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [show, setShow] = useState(false)

  const containerRef = useRef(null)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  // Load JSON and inject welcome message
  useEffect(() => {
    fetch('/ldms/media/reports/disc_failuire_chat.json')
      .then((res) => res.json())
      .then((data) => {
        const welcomeMessage = {
          type: 'bot',
          sender: 'Pluto',
          text: `
    <div style="font-size: 14px;">
      <p>A Disk Failure event was detected at Wed Jul 28 2022 21:02:17 GMT +0000 (UTC)</p>
      <table class="table table-bordered mb-3" style="font-size: 13px; text-align: center;">
        <thead>
          <tr style="background-color: #4a4a4a; color: white;">
            <th colspan="2">Threat Level</th>
          </tr>
          <tr style="background-color: #f1c232; font-weight: bold;">
            <td colspan="2">Critical</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="background-color: #4a4a4a; color: white;">Targeted Asset</td>
            <td style="background-color: #4a4a4a; color: white;">Threat Actor</td>
          </tr>
          <tr>
            <td>Windows</td>
            <td>Hardware Sensor</td>
          </tr>
          <tr>
            <td style="background-color: #4a4a4a; color: white;">Tactic</td>
            <td style="background-color: #4a4a4a; color: white;">Technique</td>
          </tr>
          <tr>
            <td>Availability</td>
            <td>Destruction via Hardware Fault</td>
          </tr>
        </tbody>
      </table>
      <p>Performing key information extraction...</p>
      <p>Performing enrichment of extracted data...</p>
    </div>
  `,
          stepType: 'info',
          time: new Date().toLocaleTimeString(),
        }

        setChatSteps([welcomeMessage]) // show table at the top
        setSteps(data)
      })
      .catch((err) => console.error('Fetch error:', err))
  }, [])

  // Scroll to bottom on update
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [chatSteps])

  // Auto display steps
  useEffect(() => {
    if (steps.length === 0 || isPaused || stepIndex >= steps.length) return

    const currentStep = steps[stepIndex]
    const timer = setTimeout(() => {
      const botMessage = {
        type: 'bot',
        sender: 'Pluto',
        text: currentStep.message,
        stepType: currentStep.type,
        time: new Date().toLocaleTimeString(),
      }
      setChatSteps((prev) => [...prev, botMessage])

      if (currentStep.type === 'question') {
        setIsPaused(true)
      } else {
        setStepIndex((prev) => prev + 1)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [steps, stepIndex, isPaused])

  const handleSend = (event) => {
    event.preventDefault()
    const message = event.target.elements.message.value.trim()
    if (!message) return

    const response = message.toLowerCase()
    const isAffirmative = response === 'y' || response === 'yes'
    const isNegative = response === 'n' || response === 'no'
    const isNamedReply = isAffirmative || isNegative

    const userMessage = {
      type: 'user',
      sender: isNamedReply ? userName : '',
      text: message,
      time: new Date().toLocaleTimeString(),
    }

    setChatSteps((prev) => [...prev, userMessage])
    event.target.reset()

    if (isPaused) {
      if (isAffirmative) {
        setIsPaused(false)
        setStepIndex((prev) => prev + 1)
      } else if (isNegative) {
        console.log('Chat flow stopped by user.')
      }
    }
  }

  const renderStep = (step, index) => {
    const isUser = step.type === 'user'
    const avatarSrc = toAbsoluteUrl(isUser ? '/media/avatars/300-1.jpg' : '/media/avatars/bot.png')

    return (
      <div className='d-flex flex-stack py-4' key={index}>
        <div className='d-flex flex-row' style={{width: '100%'}}>
          <div className='symbol symbol-45px symbol-circle'>
            <img alt={step.sender || 'User'} src={avatarSrc} />
          </div>
          <div className='ms-5' style={{width: '100%'}}>
            {step.sender && (
              <p className='fs-5 fw-bolder text-blue mb-2'>
                {step.sender} <span className='sub-txt text-gray float-right'>{step.time}</span>
              </p>
            )}
            {!step.sender && isUser && (
              <span className='sub-txt float-right d-block mb-1'>{step.time}</span>
            )}

            {/* If step is info type, render HTML table */}
            {step.stepType === 'info' ? (
              <div className='fs-14 mb-2' dangerouslySetInnerHTML={{__html: step.text}} />
            ) : (
              <p className='fs-14 mb-2' style={{whiteSpace: 'pre-line'}}>
                {step.text}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div>
        <div className='mx-ht chat-ht'>
          <div
            className='chat-box scroll-y me-n5 h-500px'
            ref={containerRef}
            style={{overflowY: 'auto'}}
          >
            {chatSteps.map((step, idx) => renderStep(step, idx))}
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
    </>
  )
}

export default IncidentChatDisk
