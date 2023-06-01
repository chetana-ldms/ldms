import React, {useState, useEffect, useRef} from 'react'
import {Link, useParams} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {KTSVG, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
const IncidentsPageCollaboration = () => {
  //Chat fullscreen
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const [isChat, setIsChat] = useState(false)
  const showincidentdetails = () => {
    setIsChat(true)
    setIsShown(false)
  }

  const [isShown, setIsShown] = useState(false)

  const handleClick1 = () => {
    setIsShown(true)
    setIsChat(false)
  }

  const [chatMessages, setChatMessages] = useState([])
  const handleSend = (event) => {
    event.preventDefault()
    const message = event.target.elements.message.value.trim()
    if (message !== '') {
      setChatMessages([...chatMessages, {text: message, time: new Date().toLocaleTimeString()}])
      event.target.reset()
    }
  }

  const ref = useRef(null)
  const message_1 = useRef(null)
  const message_2 = useRef(null)
  const message_3 = useRef(null)
  const message_4 = useRef(null)
  const message_5 = useRef(null)
  const message_6 = useRef(null)
  // Playbooks Code ///
  const [loading, setLoading] = useState(false)
  const [playbooks, setPlaybooks] = useState([])
  const [incidentdata, setIncidentData] = useState([])
  const {status} = useParams()
  const [showChat, setShowChat] = useState(1)

  const handleClick = () => {
    message_3.current?.scrollIntoView({block: 'end', behavior: 'smooth'})
  }
  // function showincidentdetails() {
  //   setShowChat(0)
  // }
  // const inputRef = useRef(null)
  // const [input, setInput] = useState('')

  useEffect(() => {
    if (showChat === 2) {
      message_1.current?.scrollIntoView({block: 'end', behavior: 'smooth'})
    }
    if (showChat === 3) {
      message_2.current?.scrollIntoView({block: 'end', behavior: 'smooth'})
    }
    if (showChat === 4) {
      message_3.current?.scrollIntoView({block: 'end', behavior: 'smooth'})
    }
    if (showChat === 5) {
      message_4.current?.scrollIntoView({block: 'end', behavior: 'smooth'})
    }
    if (showChat === 6) {
      message_5.current?.scrollIntoView({block: 'end', behavior: 'smooth'})
    }
    if (showChat === 7) {
      message_6.current?.scrollIntoView({block: 'end', behavior: 'smooth'})
    }
    setTimeout(() => {
      setShowChat((showChat) => showChat + 1)
    }, 3000)
  }, [showChat])

  /* chat bot boxs */
  const Message_1 = () => {
    return (
      <div className='d-flex flex-stack py-4' ref={message_1} id='message_1'>
        <div className='d-flex'>
          <div className='ms-5'>
            <div className='row'>
              <div className='col-md-2'>
                <div className='symbol symbol-45px symbol-circle'>
                  <img alt='Pic' src={toAbsoluteUrl('/media/avatars/300-4.jpg')} />
                </div>
              </div>
              <div className='col-md-10'>
                <a href='#' className='fs-5 fw-bolder text-blue text-hover-primary mb-5'>
                  kim@lancesoft.com Senior Security Analyst
                </a>
                <span className='sub-txt float-right'>2:08:59 PM</span>
                <p>@John @Dave @Stuart it seems that we are dealing with WannaCry</p>
                <p>
                  I'll start to contain the spread, @Dave please update the CISO about this incident
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  const Message_2 = () => {
    return (
      <div className='d-flex flex-stack py-4' ref={message_2} id='message_2'>
        <div className='d-flex'>
          <div className='ms-5'>
            <div className='row'>
              <div className='col-md-2'>
                <div className='symbol symbol-45px symbol-circle'>
                  <img alt='Pic' src={toAbsoluteUrl('/media/avatars/300-5.jpg')} />
                </div>
              </div>
              <div className='col-md-10'>
                <a href='#' className='fs-5 fw-bolder text-blue text-hover-primary mb-2'>
                  dave@lancesoft.com Security Analyst
                </a>
                <span className='sub-txt float-right'>2:09:07 PM</span>
                <p>I'm on it</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  const Message_3 = () => {
    return (
      <div className='d-flex flex-stack py-4' ref={message_3} id='message_3'>
        <div className='d-flex'>
          <div className='ms-5'>
            <div className='row'>
              <div className='col-md-2'>
                <div className='symbol symbol-45px symbol-circle'>
                  <img alt='Pic' src={toAbsoluteUrl('/media/avatars/300-7.jpg')} />
                </div>
              </div>
              <div className='col-md-10'>
                <a href='#' className='fs-5 fw-bolder text-blue text-hover-primary mb-2'>
                  john@lancesoft.com Senior Threat Analyst
                </a>
                <span className='sub-txt float-right'>2:09:13 PM</span>
                <p>
                  I found that <b>Shadow Broker</b> leaked an SMB exploid named *EternalBlue*. SMB
                  is the transport protocol used by Windows machines for a wide variety of purposes
                  such a file sharing, printer sharing and access to remote Windows services. SMB
                  operates over TCP ports 137, 139 and 445. This vulnerability exists because the
                  SMB version 1 (SMBv1) server in various versions of Microsoft Windows mishandles
                  specially crafted packets from remote attackers, allowing them to execute
                  arbitrary code on the target's computer. As a mitigation I suggest blocking any
                  outbound traffic on TCP prots 137, 139 and 445.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  const Message_4 = () => {
    return (
      <div className='d-flex flex-stack py-4' ref={message_4} id='message_4'>
        <div className='d-flex'>
          <div className='ms-5'>
            <div className='row'>
              <div className='col-md-2'>
                <div className='symbol symbol-45px symbol-circle'>
                  <img alt='Pic' src={toAbsoluteUrl('/media/avatars/300-4.jpg')} />
                </div>
              </div>
              <div className='col-md-10'>
                <a href='#' className='fs-5 fw-bolder text-blue text-hover-primary mb-2'>
                  kim@lancesoft.com Senior Security Analyst
                </a>
                <span className='sub-txt float-right'>2:09:18 PM</span>
                <p>@John can you create an IOC list?</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const Message_5 = () => {
    return (
      <div className='d-flex flex-stack py-4' ref={message_5} id='message_5'>
        <div className='d-flex'>
          <div className='ms-5'>
            <div className='row'>
              <div className='col-md-2'>
                <div className='symbol symbol-45px symbol-circle'>
                  <img alt='Pic' src={toAbsoluteUrl('/media/avatars/300-7.jpg')} />
                </div>
              </div>
              <div className='col-md-10'>
                <a href='#' className='fs-5 fw-bolder text-blue text-hover-primary mb-2'>
                  john@lancesoft.com Senior Threat Intelligence Analyst
                </a>
                <span className='sub-txt float-right'>2:09:259 PM</span>
                <p>On it!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const Message_6 = () => {
    return (
      <div className='text-center mb-5'>
        <p className='fw-bolder'>Completed task in 2mins 2secs </p>
      </div>
    )
  }

  const ChatHeader = () => {
    return (
      <>
        <div className='mt-2 float-left'>
          <p>
            DC -20210728-00056
            {/* <i className='far fa-copy'></i> */}
          </p>
          <p className='fs-12'>User | Suspecious Mail</p>
        </div>
        <div className='badge text-black fw-normal icon-right float-right'>
          <a href='#' onClick={handleShow}>
            <i className='far fa-window-restore'></i>
          </a>
          <a href={toAbsoluteUrl('/media/reports/collabreport.docx')} download='myFile'>
            <i className='fas fa-download'></i>
          </a>
        </div>
      </>
    )
  }
  const getPlaybooks = () => {
    setLoading(true)
    var config = {
      method: 'get',
      url: 'http://115.110.192.133:8011/api/PlayBook/v1/PlayBooks',
      headers: {
        Accept: 'text/plain',
      },
    }

    axios(config)
      .then(function (response) {
        setPlaybooks(response.data.playbooks)
        console.log(response.data.playbooks)
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  useEffect(() => {
    setLoading(true)
    let data2 = JSON.stringify({
      orgID: '1',
      toolID: '1',
      toolTypeID: '1',
      paging: {
        rangeStart: '1',
        rangeEnd: '10',
      },
      loggedInUserId: '1',
    })
    var data = JSON.stringify({
      orgID: 1,
      toolID: 1,
      toolTypeID: 1,
      paging: {
        rangeStart: 1,
        rangeEnd: 10,
      },
    })

    var config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://115.110.192.133:502/api/IncidentManagement/Incidents',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      },
      data: data2,
    }

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data))
        setIncidentData(response.data.incidentList)
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [])
  return (
    <>
      <div className='card mb-5 mb-xl-8 bg-red incident-page'>
        <div className='card-body1 py-3'>
          {/* <UsersListLoading /> */}
          <div className='row'>
            <div className='col-md-4 border-1 border-gray-300 border-end'>
              <div className='card'>
                <div className='d-flex justify-content-between bd-highlight mb-3'>
                  <div className='p-1 bd-highlight'>
                    <a href='#' className='btn btn-sm btn-icon btn-light btn-secondary mx-3'>
                      <i className='fa-solid fa-arrows-rotate'></i>
                    </a>
                  </div>
                  {/* <input ref={inputRef} type='text' />
                  <button onClick={() => setInput(inputRef.current.value)}>Button</button>
                  <p>{input}</p> */}
                  <div className='p-1 bd-highlight'>
                    <h6 className='card-title align-items-start flex-column pt-2'>
                      <span className='card-label fw-bold fs-5 mb-1'>
                        Incidents <span className='text-black-50'>(4)</span>
                      </span>
                    </h6>
                  </div>
                  <div className='p-1 bd-highlight'>
                    {/* <a
                      href='#'
                      onClick={handleClickScroll}
                      className='btn btn-primary btn-sm create-btn'
                    >
                      Create Incident
                    </a> */}
                  </div>
                </div>

                <div className='card-title'>
                  {/* begin::Search */}
                  <div className='input-group'>
                    <input
                      type='text'
                      className='form-control form-control-sm'
                      placeholder='Search Incident'
                    />
                    <span className='input-group-text'>
                      <i className='fas fa-magnifying-glass'></i>
                    </span>
                  </div>
                  {/* end::Search */}
                  <div className='d-flex justify-content-between bd-highlight mb-3'>
                    <div className='p-2 bd-highlight'>
                      <div className='w-110px me-2'>
                        <select
                          name='status'
                          data-control='select2'
                          data-hide-search='true'
                          className='form-select form-select-white form-select-sm fw-bold'
                        >
                          <option value='1'>Status (3)</option>
                          <option value='4'>Closed</option>
                        </select>
                      </div>
                    </div>
                    <div className='p-2 bd-highlight mt-2'>Sort by</div>
                    <div className='p-2 bd-highlight'>
                      <div className='w-120px me-0'>
                        <select
                          name='status'
                          data-control='select2'
                          data-hide-search='true'
                          className='form-select form-select-white form-select-sm fw-bold'
                        >
                          <option value='1'>Modified</option>
                          <option value='4'>Latest</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className='scroll-y me-n5 h-600px'>
                    <div className='incident-list'>
                      <div>
                        {loading == true ? (
                          <>
                            <div>
                              <UsersListLoading />
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                        <div className='incident-section' onClick={showincidentdetails}>
                          <div className='row'>
                            <div className='col-md-1'>
                              <i className='fa-solid fa-arrow-up text-danger'></i>
                            </div>

                            <div className='text-dark col-md-9'>
                              <a href='#' className='text-dark'>
                                <span className='fw-bold'>
                                  {/* {item.description} */}
                                  Suspecious Mail
                                </span>
                              </a>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='d-flex justify-content-between'>
                              <div className='p-2 bd-highlight'>
                                <div className='badge text-black fw-normal'>
                                  {/* {item.incidentID} */}3
                                  <div className='badge text-black fw-normal'>
                                    <i className='fas fa-copy'></i>
                                  </div>
                                </div>
                              </div>
                              <div className='pt-3 bd-highlight'>
                                <div className='badge text-black fw-normal'>3 MIN</div>
                              </div>
                            </div>
                          </div>
                          <hr className='my-0' />
                          <div className='d-flex justify-content-between bd-highlight mt-2'>
                            <div className='p-1 bd-highlight fs-14'>
                              {/* {item.destinationUser} */}
                              Destination User
                            </div>
                            <div className='p-1 bd-highlight'>
                              <div className='badge badge-light-primary mx-1'>NEW</div>
                              <div className='badge badge-light-danger'>HIGH</div>
                            </div>
                          </div>
                        </div>
                        {incidentdata === null ? (
                          <UsersListLoading />
                        ) : (
                          incidentdata.map((item, index) => (
                            <>
                              <div className='incident-section' onClick={handleClick1}>
                                <div className='row'>
                                  <div className='col-md-1'>
                                    <i className='fa-solid fa-arrow-up text-danger'></i>
                                  </div>

                                  <div className='text-dark col-md-9'>
                                    <a href='#' className='text-dark'>
                                      <span className='fw-bold'>{item.description}</span>
                                      {/* <span className='fw-bold'>Multiple Failed Login</span> */}
                                    </a>
                                  </div>
                                </div>
                                <div className='row'>
                                  <div className='d-flex justify-content-between'>
                                    <div className='p-2 bd-highlight'>
                                      <div className='badge text-black fw-normal'>
                                        {item.incidentID}
                                        <div className='badge text-black fw-normal'>
                                          <i className='fas fa-copy'></i>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='pt-3 bd-highlight'>
                                      <div className='badge text-black fw-normal'>3 MIN</div>
                                    </div>
                                  </div>
                                </div>
                                <hr className='my-0' />
                                <div className='d-flex justify-content-between bd-highlight mt-2'>
                                  <div className='p-1 bd-highlight fs-14'>
                                    {item.destinationUser}
                                    {/* Destination User */}
                                  </div>
                                  <div className='p-1 bd-highlight'>
                                    <div className='badge badge-light-primary mx-1'>NEW</div>
                                    <div className='badge badge-light-danger'>HIGH</div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* ------------------------------------------------------- */}

            {isShown ? (
              <div className='col-md-4 border-1 border-gray-300 border-end chat-section'>
                <div className='chat-header'>
                  <>
                    <div className='mt-2 float-left'>
                      <p>
                        DC -20210728-00056
                        {/* <i className='far fa-copy'></i> */}
                      </p>
                      <p className='fs-12'>User</p>
                    </div>
                    <div className='badge text-black fw-normal icon-right float-right'>
                      <a href='#' onClick={handleShow}>
                        <i className='far fa-window-restore'></i>
                      </a>
                      {/* <a href={toAbsoluteUrl('/media/reports/collabreport.docx')} download='myFile'>
            <i className='fas fa-download'></i>
          </a> */}
                    </div>
                  </>
                </div>
                <div className='chat-box scroll-y me-n5 h-600px'></div>
              </div>
            ) : (
              <></>
            )}
            <div className='col-md-4 border-1 border-gray-300 border-end chat-section'>
              <div
                className='mx-ht'
                data-kt-scroll='true'
                data-kt-scroll-activate='{default: false, lg: true}'
                data-kt-scroll-max-height='auto'
                data-kt-scroll-dependencies='#kt_header, #kt_toolbar, #kt_footer, #kt_chat_contacts_header'
                data-kt-scroll-wrappers='#kt_content, #kt_chat_contacts_body'
                data-kt-scroll-offset='0px'
              >
                <div className='chat-header'>
                  <ChatHeader />
                </div>
                <div className='chat-box scroll-y me-n5 h-600px'>
                  <div className='date'>
                    <p className='fw-bold mt-10'>
                      <span>Today</span>
                    </p>
                  </div>
                  {/* chat bot msg */}
                  {showChat > 1 ? <Message_1 /> : null}
                  {showChat > 2 ? <Message_2 /> : null}
                  {showChat > 3 ? <Message_3 /> : null}
                  {showChat > 4 ? <Message_4 /> : null}
                  {showChat > 4 ? <Message_5 /> : null}
                  {showChat > 4 ? <Message_6 /> : null}
                  {/* //Chat message */}
                  {chatMessages.map((message, index) => (
                    <div className='row'>
                      <div className='col-md-2'>
                        <div className='symbol symbol-45px symbol-circle'>
                          <img alt='Pic' src={toAbsoluteUrl('/media/avatars/300-1.jpg')} />
                        </div>
                      </div>
                      <div className='col-md-10'>
                        <a href='#' className='fs-5 fw-bolder text-blue text-hover-primary mb-2'>
                          vinu@lancesoft.com Senior Analyst
                        </a>
                        <span className='sub-txt float-right'>2:09:18 PM</span>
                        <p>{message.text}</p>
                      </div>
                    </div>
                  ))}
                  <div className='separator separator-dashed'></div>
                </div>
              </div>
              <form onSubmit={handleSend} className='chat-form'>
                <div className='input-group'>
                  <input
                    type='text'
                    className='form-control'
                    name='message'
                    placeholder='Type your message here...'
                  />
                  <button type='submit' className='btn-chat'>
                    <span className='input-group-text'>
                      <i className='fas fa-paper-plane'></i>
                    </span>
                  </button>
                </div>
              </form>
            </div>
            {/* ------------------------------------------------------- */}

            {/* Chat fullscreen */}
            <Modal show={show} onHide={handleClose} className='chat-fullscreen'>
              <Modal.Header closeButton></Modal.Header>
              <div className='col-md-12 border-1 border-gray-300 border-end chat-section'>
                <div
                  className='mx-ht'
                  data-kt-scroll='true'
                  data-kt-scroll-activate='{default: false, lg: true}'
                  data-kt-scroll-max-height='auto'
                  data-kt-scroll-dependencies='#kt_header, #kt_toolbar, #kt_footer, #kt_chat_contacts_header'
                  data-kt-scroll-wrappers='#kt_content, #kt_chat_contacts_body'
                  data-kt-scroll-offset='0px'
                >
                  <div className='chat-header'>
                    <ChatHeader />
                  </div>
                  <div className='chat-box scroll-y me-n5 h-600px'>
                    <div className='date'>
                      <p className='fw-bold mt-10'>
                        <span>Today</span>
                      </p>
                    </div>

                    {/* chat bot msg */}
                    {showChat > 1 ? <Message_1 /> : null}
                    {showChat > 2 ? <Message_2 /> : null}
                    {showChat > 3 ? <Message_3 /> : null}
                    {showChat > 4 ? <Message_4 /> : null}
                    {showChat > 4 ? <Message_5 /> : null}
                    {showChat > 4 ? <Message_6 /> : null}
                    <div className='separator separator-dashed'></div>
                  </div>
                </div>
                <div className='input-group mb-5'>
                  <span className='input-group-text' id='basic-addon1'>
                    <i className='fas fa-plus'></i>
                  </span>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Message or Command'
                    aria-label='message'
                    aria-describedby='basic-addon1'
                  />
                  <span className='input-group-text'>
                    <i className='fas fa-face-smile'></i>
                  </span>
                </div>
              </div>
            </Modal>

            <div className='col-md-4 border-1 border-gray-600'>
              <div className='card'>
                <div className='d-flex justify-content-between bd-highlight mb-3'>
                  <div className='p-2 bd-highlight'>
                    <h6 className='card-title align-items-start flex-column pt-2'>
                      <span className='card-label fw-bold fs-3 mb-1'>Incidents Details</span>
                    </h6>
                  </div>
                </div>
                <div className='d-flex justify-content-between bd-highlight mb-3'>
                  <div className='p-2 bd-highlight'>
                    <ul className='nav nav-tabs nav-line-tabs mb-5 fs-8'>
                      <li className='nav-item'>
                        <a className='nav-link active' data-bs-toggle='tab' href='#kt_tab_pane_1'>
                          General
                        </a>
                      </li>
                      <li className='nav-item'>
                        <a className='nav-link' data-bs-toggle='tab' href='#kt_tab_pane_2'>
                          Alerts
                        </a>
                      </li>
                      <li className='nav-item'>
                        <a
                          className='nav-link'
                          onClick={getPlaybooks}
                          data-bs-toggle='tab'
                          href='#kt_tab_pane_3'
                        >
                          Playbooks
                        </a>
                      </li>
                      <li className='nav-item'>
                        <a className='nav-link' data-bs-toggle='tab' href='#kt_tab_pane_4'>
                          Observables
                        </a>
                      </li>
                      <li className='nav-item'>
                        <a className='nav-link' data-bs-toggle='tab' href='#kt_tab_pane_5'>
                          Timeline
                        </a>
                      </li>
                    </ul>

                    <div className='tab-content' id='myTabContent'>
                      <div
                        className='tab-pane fade show active scroll-y me-n5 pe-5 h-500px'
                        id='kt_tab_pane_1'
                        role='tabpanel'
                      >
                        <div className='row bd-highlight mb-3'>
                          <div className='col-md-3 bd-highlight mt-2'>Sort by</div>
                          <div className='col-md-9 bd-highlight'>
                            <div className='w-120px me-5'>
                              <select
                                name='status'
                                data-control='select2'
                                data-hide-search='true'
                                className='form-select form-control form-select-white form-select-sm fw-bold'
                              >
                                <option value='1'>New</option>
                                <option value='1'>Open</option>
                                <option value='1'>Pending</option>
                                <option value='1'>Closed</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        {/* Priority */}
                        <div className='row bd-highlight mb-3'>
                          <div className='col-md-3 bd-highlight mt-2'>Priority</div>
                          <div className='col-md-9 bd-highlight'>
                            <div className='w-120px me-5'>
                              <select
                                name='status'
                                data-control='select2'
                                data-hide-search='true'
                                className='form-select form-control form-select-white form-select-sm fw-bold text-danger'
                              >
                                <option value='1' className='text-danger'>
                                  High
                                </option>
                                <option value='1' className='text-warning'>
                                  Medium
                                </option>
                                <option value='1' className='text-info'>
                                  Low
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        {/* Severity */}
                        <div className='row bd-highlight mb-3'>
                          <div className='col-md-3 bd-highlight mt-2'>Severity</div>
                          <div className='col-md-9 bd-highlight'>
                            <div className='w-120px me-5'>
                              <select
                                name='status'
                                data-control='select2'
                                data-hide-search='true'
                                className='form-select form-control form-select-white form-select-sm fw-bold text-danger'
                              >
                                <option value='1' className='text-danger'>
                                  High
                                </option>
                                <option value='1' className='text-warning'>
                                  Medium
                                </option>
                                <option value='1' className='text-info'>
                                  Low
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Type */}
                        <div className='row bd-highlight mb-3'>
                          <div className='col-md-3 bd-highlight mt-2'>Type</div>
                          <div className='col-md-9 bd-highlight'>
                            <div className='w-120px me-5'>
                              <select
                                name='status'
                                data-control='select2'
                                data-hide-search='true'
                                className='form-select form-control form-select-white form-select-sm fw-bold'
                              >
                                <option value='1'>AD Failed Login</option>
                                <option value='1'>AD Failed Login</option>
                                <option value='1'>AD Failed Login</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        {/* Text */}
                        <div className='row bd-highlight mb-3'>
                          <div className='col-md-12 bd-highlight'>
                            <div className='d-flex align-items-center gap-2'>
                              <span className='fw-bold'>Alert Name - </span> Multiple failed login
                              for same IP
                            </div>
                          </div>
                          <div className='col-md-12 bd-highlight'>
                            <div className='d-flex align-items-center gap-2'>
                              <span className='fw-bold'>Event ID - </span> 4625
                            </div>
                          </div>
                          <div className='col-md-12 bd-highlight'>
                            <div className='d-flex align-items-center gap-2'>
                              <span className='fw-bold'>Destination User - </span> James James
                            </div>
                          </div>
                          <div className='col-md-12 bd-highlight'>
                            <div className='d-flex align-items-center gap-2'>
                              <span className='fw-bold'>Source IP - </span> 192.168.0.1
                            </div>
                          </div>
                          <div className='col-md-12 bd-highlight'>
                            <div className='d-flex align-items-center gap-2'>
                              <span className='fw-bold'>Vendor - </span> Microsoft
                            </div>
                          </div>
                        </div>
                        <div className='d-flex justify-content-between bd-highlight'>
                          <div className='p-2 bd-highlight'>
                            <div className='text-muted fs-13'>Incident ID</div>
                          </div>
                          <div className='p-2 bd-highlight'>
                            <div className='badge text-black fs-13'>
                              ____-20210728-00056
                              <div className='badge text-black fs-13'>
                                <i className='fas fa-copy'></i>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className='d-flex justify-content-between bd-highlight mb-3'>
                          <div className='p-2 bd-highlight'>
                            <div className='text-muted fs-13'>Owner</div>
                          </div>
                          <div className='p-2 bd-highlight'>
                            <div className='w-120px me-5'>
                              <select
                                name='status'
                                data-control='select2'
                                data-hide-search='true'
                                className='form-select form-control form-select-white form-select-sm fw-bold'
                              >
                                <option value='1'>User 1</option>
                                <option value='1'>User 2</option>
                                <option value='1'>User 3</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className='d-flex justify-content-between bd-highlight'>
                          <div className='p-2 bd-highlight'>
                            <div className='text-muted fs-13'>Created</div>
                          </div>
                          <div className='p-2 bd-highlight'>
                            <div className='badge text-black fw-normal'>
                              Jul 28, 2022 02:02:02 PM
                            </div>
                          </div>
                        </div>

                        <div className='d-flex justify-content-between bd-highlight'>
                          <div className='p-2 bd-highlight'>
                            <div className='text-muted fs-13'>Updated</div>
                          </div>
                          <div className='p-2 bd-highlight'>
                            <div className='badge text-black fw-normal'>
                              Jul 29, 2022 01:12:32 AM
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='tab-pane fade' id='kt_tab_pane_2' role='tabpanel'>
                        <div className='d-flex justify-content-between bd-highlight mb-3'>
                          <div className='p-2 bd-highlight'>
                            <h6 className='card-title align-items-start flex-column pt-2'>
                              <span className='card-label fw-bold fs-7 mb-1'>
                                Presented <span className='text-black-50'>(3/3)</span>
                              </span>
                            </h6>
                          </div>
                          <div className='p-2 bd-highlight'>
                            <a href='#' className='btn btn-secondary btn-sm'>
                              Show More
                            </a>
                          </div>
                        </div>
                        <table
                          className='scroll-y me-n5 pe-5 h-600px table table-hover table-row-dashed fs-6 gy-5 my-0 dataTable no-footer'
                          id='kt_inbox_listing'
                        >
                          <tbody>
                            <tr className='bg-gray-100 mb-3'>
                              <td className='min-w-80px p-2 pb-8'>
                                <div className='d-flex justify-content-between bd-highlight'>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    <div className='text-dark mb-1'>
                                      <a href='#' className='text-dark'>
                                        <span className='fw-bold'>
                                          CheckPoint - Malware Traffic
                                        </span>
                                      </a>
                                    </div>
                                  </div>
                                  <div className='p-1 bd-highlight'>
                                    <a
                                      href='#'
                                      className='btn btn-sm btn-icon btn-light btn-secondary mx-1'
                                    >
                                      <i className='fa-solid fa-trash'></i>
                                    </a>
                                    <a
                                      href='#'
                                      className='btn btn-sm btn-icon btn-light btn-secondary mx-1'
                                    >
                                      <i className='fa-solid fa-arrow-down'></i>
                                    </a>
                                  </div>
                                </div>

                                <div className='d-flex justify-content-between align-text-left bd-highlight'>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    Suspicious Rate
                                  </div>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    <i className='fa-solid fa-circle-check text-success'></i> 0
                                  </div>
                                </div>
                                <div className='d-flex justify-content-between align-text-left bd-highlight'>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    Detected date
                                  </div>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    7/01/2023, 02:20 PM
                                  </div>
                                </div>
                                <hr className='my-0' />
                              </td>
                            </tr>

                            <tr className='bg-gray-100'>
                              <td className='min-w-80px p-2 pb-8'>
                                <div className='d-flex justify-content-between bd-highlight'>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    <div className='text-dark mb-1'>
                                      <a href='#' className='text-dark'>
                                        <span className='fw-bold'>
                                          CheckPoint - Malware Traffic
                                        </span>
                                      </a>
                                    </div>
                                  </div>
                                  <div className='p-1 bd-highlight'>
                                    <a
                                      href='#'
                                      className='btn btn-sm btn-icon btn-light btn-secondary mx-1'
                                    >
                                      <i className='fa-solid fa-trash'></i>
                                    </a>
                                    <a
                                      href='#'
                                      className='btn btn-sm btn-icon btn-light btn-secondary mx-1'
                                    >
                                      <i className='fa-solid fa-arrow-down'></i>
                                    </a>
                                  </div>
                                </div>

                                <div className='d-flex justify-content-between align-text-left bd-highlight'>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    Suspicious Rate
                                  </div>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    <i className='fa-solid fa-circle-check text-success'></i> 0
                                  </div>
                                </div>
                                <div className='d-flex justify-content-between align-text-left bd-highlight'>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    Detected date
                                  </div>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    7/01/2023, 02:20 PM
                                  </div>
                                </div>
                                <hr className='my-0' />
                              </td>
                            </tr>

                            <tr className='bg-gray-100'>
                              <td className='min-w-80px p-2 pb-8'>
                                <div className='d-flex justify-content-between bd-highlight'>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    <div className='text-dark mb-1'>
                                      <a href='#' className='text-dark'>
                                        <span className='fw-bold'>
                                          CheckPoint - Malware Traffic
                                        </span>
                                      </a>
                                    </div>
                                  </div>
                                  <div className='p-1 bd-highlight'>
                                    <a
                                      href='#'
                                      className='btn btn-sm btn-icon btn-light btn-secondary mx-1'
                                    >
                                      <i className='fa-solid fa-trash'></i>
                                    </a>
                                    <a
                                      href='#'
                                      className='btn btn-sm btn-icon btn-light btn-secondary mx-1'
                                    >
                                      <i className='fa-solid fa-arrow-down'></i>
                                    </a>
                                  </div>
                                </div>

                                <div className='d-flex justify-content-between align-text-left bd-highlight'>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    Suspicious Rate
                                  </div>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    <i className='fa-solid fa-circle-check text-success'></i> 0
                                  </div>
                                </div>
                                <div className='d-flex justify-content-between align-text-left bd-highlight'>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    Detected date
                                  </div>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    7/01/2023, 02:20 PM
                                  </div>
                                </div>
                                <hr className='my-0' />
                              </td>
                            </tr>

                            <tr className='bg-gray-100'>
                              <td className='min-w-80px p-2 pb-8'>
                                <div className='d-flex justify-content-between bd-highlight'>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    <div className='text-dark mb-1'>
                                      <a href='#' className='text-dark'>
                                        <span className='fw-bold'>
                                          CheckPoint - Malware Traffic
                                        </span>
                                      </a>
                                    </div>
                                  </div>
                                  <div className='p-1 bd-highlight'>
                                    <a
                                      href='#'
                                      className='btn btn-sm btn-icon btn-light btn-secondary mx-1'
                                    >
                                      <i className='fa-solid fa-trash'></i>
                                    </a>
                                    <a
                                      href='#'
                                      className='btn btn-sm btn-icon btn-light btn-secondary mx-1'
                                    >
                                      <i className='fa-solid fa-arrow-down'></i>
                                    </a>
                                  </div>
                                </div>

                                <div className='d-flex justify-content-between align-text-left bd-highlight'>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    Suspicious Rate
                                  </div>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    <i className='fa-solid fa-circle-check text-success'></i> 0
                                  </div>
                                </div>
                                <div className='d-flex justify-content-between align-text-left bd-highlight'>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    Detected date
                                  </div>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    7/01/2023, 02:20 PM
                                  </div>
                                </div>
                                <hr className='my-0' />
                              </td>
                            </tr>

                            <tr className='bg-gray-100'>
                              <td className='min-w-80px p-2 pb-8'>
                                <div className='d-flex justify-content-between bd-highlight'>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    <div className='text-dark mb-1'>
                                      <a href='#' className='text-dark'>
                                        <span className='fw-bold'>
                                          CheckPoint - Malware Traffic
                                        </span>
                                      </a>
                                    </div>
                                  </div>
                                  <div className='p-1 bd-highlight'>
                                    <a
                                      href='#'
                                      className='btn btn-sm btn-icon btn-light btn-secondary mx-1'
                                    >
                                      <i className='fa-solid fa-trash'></i>
                                    </a>
                                    <a
                                      href='#'
                                      className='btn btn-sm btn-icon btn-light btn-secondary mx-1'
                                    >
                                      <i className='fa-solid fa-arrow-down'></i>
                                    </a>
                                  </div>
                                </div>

                                <div className='d-flex justify-content-between align-text-left bd-highlight'>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    Suspicious Rate
                                  </div>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    <i className='fa-solid fa-circle-check text-success'></i> 0
                                  </div>
                                </div>
                                <div className='d-flex justify-content-between align-text-left bd-highlight'>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    Detected date
                                  </div>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    7/01/2023, 02:20 PM
                                  </div>
                                </div>
                                <hr className='my-0' />
                              </td>
                            </tr>

                            <tr className='bg-gray-100'>
                              <td className='min-w-80px p-2 pb-8'>
                                <div className='d-flex justify-content-between bd-highlight'>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    <div className='text-dark mb-1'>
                                      <a href='#' className='text-dark'>
                                        <span className='fw-bold'>
                                          CheckPoint - Malware Traffic
                                        </span>
                                      </a>
                                    </div>
                                  </div>
                                  <div className='p-1 bd-highlight'>
                                    <a
                                      href='#'
                                      className='btn btn-sm btn-icon btn-light btn-secondary mx-3'
                                    >
                                      <i className='fa-solid fa-trash'></i>
                                    </a>
                                    <a
                                      href='#'
                                      className='btn btn-sm btn-icon btn-light btn-secondary mx-3'
                                    >
                                      <i className='fa-solid fa-arrow-down'></i>
                                    </a>
                                  </div>
                                </div>

                                <div className='d-flex justify-content-between align-text-left bd-highlight'>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    Suspicious Rate
                                  </div>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    <i className='fa-solid fa-circle-check text-success'></i> 0
                                  </div>
                                </div>
                                <div className='d-flex justify-content-between align-text-left bd-highlight'>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    Detected date
                                  </div>
                                  <div className='p-1 bd-highlight fw-bold fs-12'>
                                    7/01/2023, 02:20 PM
                                  </div>
                                </div>
                                <hr className='my-0' />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className='tab-pane fade' id='kt_tab_pane_3' role='tabpanel'>
                        <table className='table align-middle gs-0 gy-4 dash-table'>
                          <thead>
                            <tr className='fw-bold text-muted bg-blue'>
                              <th className='min-w-50px'>PlayBook Name</th>
                              <th className='min-w-50px'>Description</th>
                              {/* <th className='min-w-50px'>Alert Category</th> */}
                              <th className='min-w-50px'>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading == true ? (
                              <>
                                <tr>
                                  <td>
                                    <UsersListLoading />
                                  </td>
                                </tr>
                              </>
                            ) : (
                              ''
                            )}
                            {playbooks.map((item, index) => (
                              <tr key={index} className='fs-12'>
                                <td>{item.playBookName}</td>
                                <td>{item.remarks}</td>
                                {/* <td>{item.alertCatogory}</td> */}
                                <td>
                                  {item.active === 1 ? (
                                    <span className='badge badge-success'>Active</span>
                                  ) : (
                                    <span className='badge badge-danger'>In Active</span>
                                  )}
                                </td>

                                <td>
                                  {/* <Link className='text-white' to={`/qradar/updateplaybooks/${item.playBookID}`}>
                    <button className='btn btn-danger btn-small'>Update</button>
                  </Link> */}
                                  &nbsp;
                                  {/* <button
                    className='btn btn-warning disable btn-small pt-5'
                    onClick={() => handleExecute(item, index)}
                  >
                    Execute
                  </button> */}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className='tab-pane fade' id='kt_tab_pane_4' role='tabpanel'>
                        Observables data
                      </div>
                      <div className='tab-pane fade' id='kt_tab_pane_5' role='tabpanel'>
                        <div className='card-body pt-6 h-600px'>
                          <div className='timeline-label'>
                            <div className='timeline-item'>
                              <div className='timeline-label fw-bold text-gray-800 fs-6'>08:42</div>

                              <div className='timeline-badge'>
                                <i className='fa fa-genderless text-gray-600 fs-1'></i>
                              </div>

                              <div className='fw-semibold text-gray-700 ps-3 fs-7'>
                                Information passed to Concern team.
                              </div>
                            </div>

                            <div className='timeline-item d-flex align-items-center'>
                              <div className='timeline-label fw-bold text-gray-800 fs-6'>10:00</div>

                              <div className='timeline-badge'>
                                <i className='fa fa-genderless text-success fs-1'></i>
                              </div>

                              <div className='d-flex align-items-center'>
                                <span className='fw-bold text-gray-800 px-3'>
                                  Alert Reviewed by{' '}
                                </span>

                                <div className='symbol symbol-35px me-3'>
                                  <img alt='Pic' src={toAbsoluteUrl('/media/avatars/300-1.jpg')} />
                                </div>

                                <div className='symbol symbol-35px'>
                                  <img alt='Pic' src={toAbsoluteUrl('/media/avatars/300-2.jpg')} />
                                </div>
                              </div>
                            </div>

                            <div className='timeline-item'>
                              <div className='timeline-label fw-bold text-gray-800 fs-6'>14:37</div>

                              <div className='timeline-badge'>
                                <i className='fa fa-genderless text-danger fs-1'></i>
                              </div>

                              <div className='timeline-content fw-bold text-gray-800 ps-3'>
                                severity: notice message: undefined Rule:
                                <a href='#' className='text-primary'>
                                  Count 9
                                </a>
                              </div>
                            </div>

                            <div className='timeline-item'>
                              <div className='timeline-label fw-bold text-gray-800 fs-6'>16:50</div>

                              <div className='timeline-badge'>
                                <i className='fa fa-genderless text-primary fs-1'></i>
                              </div>

                              <div className='fw-semibold text-gray-700 ps-3 fs-7'>
                                Alert : IP address need to be blocked
                              </div>
                            </div>

                            <div className='timeline-item'>
                              <div className='timeline-label fw-bold text-gray-800 fs-6'>21:03</div>

                              <div className='timeline-badge'>
                                <i className='fa fa-genderless text-warning fs-1'></i>
                              </div>

                              <div className='timeline-content fw-semibold text-gray-800 ps-3'>
                                New Ticket Raised{' '}
                                <a href='#' className='text-primary'>
                                  #XF-2356
                                </a>
                                .
                              </div>
                            </div>

                            <div className='timeline-item'>
                              <div className='timeline-label fw-bold text-gray-800 fs-6'>16:50</div>

                              <div className='timeline-badge'>
                                <i className='fa fa-genderless text-info fs-1'></i>
                              </div>

                              <div className='fw-semibold text-gray-700 ps-3 fs-7'>
                                Ticket status updated
                              </div>
                            </div>

                            <div className='timeline-item'>
                              <div className='timeline-label fw-bold text-gray-800 fs-6'>14:37</div>

                              <div className='timeline-badge'>
                                <i className='fa fa-genderless text-danger fs-1'></i>
                              </div>

                              <div className='timeline-content fw-bold text-gray-800 ps-3'>
                                Ticket Closed -
                                <a href='#' className='text-primary'>
                                  Issue Resolved
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export {IncidentsPageCollaboration}
