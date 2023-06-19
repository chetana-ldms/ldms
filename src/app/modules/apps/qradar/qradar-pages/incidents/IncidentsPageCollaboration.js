import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { KTSVG, toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
const IncidentsPageCollaboration = () => {
  //Chat fullscreen
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isChat, setIsChat] = useState(false);
  const showincidentdetails = () => {
    setIsChat(true);
    setIsShown(false);
  };

  const [isShown, setIsShown] = useState(false);

  const handleClick1 = () => {
    setIsShown(true);
    setIsChat(false);
  };

  const [chatMessages, setChatMessages] = useState([]);
  const handleSend = (event) => {
    event.preventDefault();
    const message = event.target.elements.message.value.trim();
    if (message !== "") {
      setChatMessages([
        ...chatMessages,
        { text: message, time: new Date().toLocaleTimeString() },
      ]);
      event.target.reset();
    }
  };

  const ref = useRef(null);
  const message_1 = useRef(null);
  const message_2 = useRef(null);
  const message_3 = useRef(null);
  const message_4 = useRef(null);
  const message_5 = useRef(null);
  const message_6 = useRef(null);
  // Playbooks Code ///
  const [loading, setLoading] = useState(false);
  const [playbooks, setPlaybooks] = useState([]);
  const [incidentdata, setIncidentData] = useState([]);
  const { status } = useParams();
  const [showChat, setShowChat] = useState(1);

  const handleClick = () => {
    message_3.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  };
  // function showincidentdetails() {
  //   setShowChat(0)
  // }
  // const inputRef = useRef(null)
  // const [input, setInput] = useState('')

  useEffect(() => {
    if (showChat === 2) {
      message_1.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    }
    if (showChat === 3) {
      message_2.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    }
    if (showChat === 4) {
      message_3.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    }
    if (showChat === 5) {
      message_4.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    }
    if (showChat === 6) {
      message_5.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    }
    if (showChat === 7) {
      message_6.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    }
    setTimeout(() => {
      setShowChat((showChat) => showChat + 1);
    }, 3000);
  }, [showChat]);

  /* chat bot boxs */
  const Message_1 = () => {
    return (
      <div className="d-flex flex-stack py-4" ref={message_1} id="message_1">
        <div className="d-flex">
          <div className="ms-5">
            <div className="row">
              <div className="col-md-2">
                <div className="symbol symbol-45px symbol-circle">
                  <img
                    alt="Pic"
                    src={toAbsoluteUrl("/media/avatars/300-4.jpg")}
                  />
                </div>
              </div>
              <div className="col-md-10">
                <a
                  href="#"
                  className="fs-5 fw-bolder text-blue text-hover-primary mb-5"
                >
                  kim@lancesoft.com Senior Security Analyst
                </a>
                <span className="sub-txt float-right">2:08:59 PM</span>
                <p>
                  @John @Dave @Stuart it seems that we are dealing with WannaCry
                </p>
                <p>
                  I'll start to contain the spread, @Dave please update the CISO
                  about this incident
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const Message_2 = () => {
    return (
      <div className="d-flex flex-stack py-4" ref={message_2} id="message_2">
        <div className="d-flex">
          <div className="ms-5">
            <div className="row">
              <div className="col-md-2">
                <div className="symbol symbol-45px symbol-circle">
                  <img
                    alt="Pic"
                    src={toAbsoluteUrl("/media/avatars/300-5.jpg")}
                  />
                </div>
              </div>
              <div className="col-md-10">
                <a
                  href="#"
                  className="fs-5 fw-bolder text-blue text-hover-primary mb-2"
                >
                  dave@lancesoft.com Security Analyst
                </a>
                <span className="sub-txt float-right">2:09:07 PM</span>
                <p>I'm on it</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const Message_3 = () => {
    return (
      <div className="d-flex flex-stack py-4" ref={message_3} id="message_3">
        <div className="d-flex">
          <div className="ms-5">
            <div className="row">
              <div className="col-md-2">
                <div className="symbol symbol-45px symbol-circle">
                  <img
                    alt="Pic"
                    src={toAbsoluteUrl("/media/avatars/300-7.jpg")}
                  />
                </div>
              </div>
              <div className="col-md-10">
                <a
                  href="#"
                  className="fs-5 fw-bolder text-blue text-hover-primary mb-2"
                >
                  john@lancesoft.com Senior Threat Analyst
                </a>
                <span className="sub-txt float-right">2:09:13 PM</span>
                <p>
                  I found that <b>Shadow Broker</b> leaked an SMB exploid named
                  *EternalBlue*. SMB is the transport protocol used by Windows
                  machines for a wide variety of purposes such a file sharing,
                  printer sharing and access to remote Windows services. SMB
                  operates over TCP ports 137, 139 and 445. This vulnerability
                  exists because the SMB version 1 (SMBv1) server in various
                  versions of Microsoft Windows mishandles specially crafted
                  packets from remote attackers, allowing them to execute
                  arbitrary code on the target's computer. As a mitigation I
                  suggest blocking any outbound traffic on TCP prots 137, 139
                  and 445.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const Message_4 = () => {
    return (
      <div className="d-flex flex-stack py-4" ref={message_4} id="message_4">
        <div className="d-flex">
          <div className="ms-5">
            <div className="row">
              <div className="col-md-2">
                <div className="symbol symbol-45px symbol-circle">
                  <img
                    alt="Pic"
                    src={toAbsoluteUrl("/media/avatars/300-4.jpg")}
                  />
                </div>
              </div>
              <div className="col-md-10">
                <a
                  href="#"
                  className="fs-5 fw-bolder text-blue text-hover-primary mb-2"
                >
                  kim@lancesoft.com Senior Security Analyst
                </a>
                <span className="sub-txt float-right">2:09:18 PM</span>
                <p>@John can you create an IOC list?</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Message_5 = () => {
    return (
      <div className="d-flex flex-stack py-4" ref={message_5} id="message_5">
        <div className="d-flex">
          <div className="ms-5">
            <div className="row">
              <div className="col-md-2">
                <div className="symbol symbol-45px symbol-circle">
                  <img
                    alt="Pic"
                    src={toAbsoluteUrl("/media/avatars/300-7.jpg")}
                  />
                </div>
              </div>
              <div className="col-md-10">
                <a
                  href="#"
                  className="fs-5 fw-bolder text-blue text-hover-primary mb-2"
                >
                  john@lancesoft.com Senior Threat Intelligence Analyst
                </a>
                <span className="sub-txt float-right">2:09:259 PM</span>
                <p>On it!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Message_6 = () => {
    return (
      <div className="text-center mb-5">
        <p className="fw-bolder">Completed task in 2mins 2secs </p>
      </div>
    );
  };

  const ChatHeader = () => {
    return (
      <>
        <div className="mt-2 float-left">
          <p>
            DC -20210728-00056
            {/* <i className='far fa-copy'></i> */}
          </p>
          <p className="fs-12">User | Suspecious Mail</p>
        </div>
        <div className="badge text-black fw-normal icon-right float-right">
          <a href="#" onClick={handleShow}>
            <i className="far fa-window-restore"></i>
          </a>
          <a
            href={toAbsoluteUrl("/media/reports/collabreport.docx")}
            download="myFile"
          >
            <i className="fas fa-download"></i>
          </a>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="card mb-5 mb-xl-8 bg-red incident-page">
        <div className="">
          {/* <UsersListLoading /> */}
          <div className="row">
            {/* ------------------------------------------------------- */}

            <div className="">
              <div
                className="mx-ht"
                data-kt-scroll="true"
                data-kt-scroll-activate="{default: false, lg: true}"
                data-kt-scroll-max-height="auto"
                data-kt-scroll-dependencies="#kt_header, #kt_toolbar, #kt_footer, #kt_chat_contacts_header"
                data-kt-scroll-wrappers="#kt_content, #kt_chat_contacts_body"
                data-kt-scroll-offset="0px"
              >
                <div className="chat-header">
                  <ChatHeader />
                </div>
                <div className="chat-box scroll-y me-n5 h-500px">
                  <div className="date">
                    <p className="fw-bold mt-10">
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
                    <div className="row">
                      <div className="col-md-2">
                        <div className="symbol symbol-45px symbol-circle">
                          <img
                            alt="Pic"
                            src={toAbsoluteUrl("/media/avatars/300-1.jpg")}
                          />
                        </div>
                      </div>
                      <div className="col-md-10">
                        <a
                          href="#"
                          className="fs-5 fw-bolder text-blue text-hover-primary mb-2"
                        >
                          vinu@lancesoft.com Senior Analyst
                        </a>
                        <span className="sub-txt float-right">2:09:18 PM</span>
                        <p>{message.text}</p>
                      </div>
                    </div>
                  ))}
                  <div className="separator separator-dashed"></div>
                </div>
              </div>
              <form onSubmit={handleSend} className="chat-form">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    name="message"
                    placeholder="Type your message here..."
                  />
                  <button type="submit" className="btn-chat">
                    <span className="input-group-text">
                      <i className="fas fa-paper-plane"></i>
                    </span>
                  </button>
                </div>
              </form>
            </div>
            {/* ------------------------------------------------------- */}

            {/* Chat fullscreen */}
            <Modal show={show} onHide={handleClose} className="chat-fullscreen">
              <Modal.Header closeButton></Modal.Header>
              <div className="col-md-12 border-1 border-gray-300 border-end chat-section">
                <div
                  className="mx-ht"
                  data-kt-scroll="true"
                  data-kt-scroll-activate="{default: false, lg: true}"
                  data-kt-scroll-max-height="auto"
                  data-kt-scroll-dependencies="#kt_header, #kt_toolbar, #kt_footer, #kt_chat_contacts_header"
                  data-kt-scroll-wrappers="#kt_content, #kt_chat_contacts_body"
                  data-kt-scroll-offset="0px"
                >
                  <div className="chat-header">
                    <ChatHeader />
                  </div>
                  <div className="chat-box scroll-y me-n5 h-600px">
                    <div className="date">
                      <p className="fw-bold mt-10">
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
                    <div className="separator separator-dashed"></div>
                  </div>
                </div>
                <div className="input-group mb-5">
                  <span className="input-group-text" id="basic-addon1">
                    <i className="fas fa-plus"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Message or Command"
                    aria-label="message"
                    aria-describedby="basic-addon1"
                  />
                  <span className="input-group-text">
                    <i className="fas fa-face-smile"></i>
                  </span>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export { IncidentsPageCollaboration };
