import React, { useState, useEffect, useRef } from "react";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import Modal from "react-bootstrap/Modal";

const IncidentChat = () => {
  //Chat fullscreen
  const [show, setShow] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const ref = useRef(null);
  const message_1 = useRef(null);
  const message_2 = useRef(null);
  const message_3 = useRef(null);
  const message_4 = useRef(null);
  const message_5 = useRef(null);

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

  const ChatHeader = () => {
    return (
      <>
        <div className="mt-2 float-left">
          <p>
            DC -20210728-00056
            {/* <i className='far fa-copy'></i> */}
          </p>
          <p className="fs-12">User | Multiple failed login</p>
        </div>
        <div className="badge text-black fw-normal icon-right float-right">
          <a href="#" onClick={handleShow}>
            <i className="far fa-window-restore"></i>
          </a>
          <a
            href={toAbsoluteUrl("/media/reports/Report.docx")}
            download="myFile"
          >
            <i className="fas fa-download"></i>
          </a>
        </div>
      </>
    );
  };

  const [showChat, setShowChat] = useState(1);

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

    setTimeout(() => {
      setShowChat((showChat) => showChat + 1);
    }, 3000);
  }, [showChat]);

  /* chat bot boxs */
  const Message_1 = () => {
    return (
      <div className="d-flex flex-stack py-4" ref={message_1} id="message_1">
        <div className="d-flex">
          <div className="symbol symbol-45px symbol-circle">
            <img
              alt="Pic"
              src={toAbsoluteUrl("/media/avatars/bot.png")}
              width="32px"
            />
          </div>
          <div className="ms-5">
            <p class="fs-5 fw-bolder text-blue mb-2">
              Pluto{" "}
              <span className="sub-txt text-gray float-right">2:02:17 PM</span>
            </p>
            <p className="fs-14 text-gray-900 mb-2">
              A failed login attempt was detected at Wed Jul 28 2022 21:02:17
              GMT +0000 (UTC)
            </p>
            {/* Alert Description Table*/}
            <table className="table-bordered chat-table mb-5">
              <tr className="text-center dark">
                <td colspan="3">Threat level</td>
              </tr>
              <tr className="text-center yellow">
                <td colspan="3">High</td>
              </tr>
              <tr className="text-center dark">
                <td colspan="2">Targeted Asset</td>
                <td colspan="2">Threat Actor</td>
              </tr>
              <tr className="text-center">
                <td colspan="2">Windows</td>
                <td colspan="2">N/A</td>
              </tr>
              <tr className="text-center dark">
                <td colspan="1">Tactic</td>
                <td colspan="1">Technique</td>
                <td colspan="1">Credibility</td>
              </tr>
              <tr className="text-center">
                <td colspan="1">Credential Access</td>
                <td colspan="1">Brute Force</td>
                <td colspan="1">A1 Reliable</td>
              </tr>
            </table>
            <p className="fs-14">Performing key Information extraction...</p>
            <p className="mt-5 fs-14">
              Performing enrichment of extracted data...
            </p>
          </div>
        </div>
      </div>
    );
  };
  const Message_2 = () => {
    return (
      <div className="d-flex flex-stack py-4" ref={message_2} id="message_2">
        <div className="d-flex">
          <div className="symbol symbol-45px symbol-circle">
            <img alt="Pic" src={toAbsoluteUrl("/media/avatars/bot.png")} />
          </div>
          <div className="ms-5">
            <p class="fs-5 fw-bolder text-blue mb-2">
              System message{" "}
              <span className="sub-txt text-gray float-right">2:02:20 PM</span>
            </p>
            <p className="fs-14">
              Completed task "New Alert" from "Active Directory Account Failed
              to logon (manual)".
            </p>
          </div>
        </div>
      </div>
    );
  };
  const Message_3 = () => {
    return (
      <div className="d-flex flex-stack py-4" ref={message_3} id="message_3">
        <div className="d-flex">
          <div className="symbol symbol-45px symbol-circle">
            <img alt="Pic" src={toAbsoluteUrl("/media/avatars/bot.png")} />
          </div>

          <div className="ms-5">
            <p class="fs-5 fw-bolder text-blue mb-2">
              Pluto{" "}
              <span className="sub-txt text-gray float-right">2:02:20 PM</span>
            </p>
            <p className="fw-bold fs-20">User details</p>
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
                  Max Smith
                </a>
                <div className="fw-normal text-gray">
                  Cyber Defense Head Operation IT
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 mt-5">
              <span className="fw-bold">Member of :</span> Users, IT
            </div>
            <div className="d-flex align-items-center gap-2">
              {/* <span className="fw-bold">Manager :</span> */}
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold">Accout Locked :</span> False
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold">Account Disabled :</span> False
            </div>
            <h5 className="mt-4">Contact Details</h5>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-phone"></i>
                <a href="#" className="text-black">
                  +6141 234 567
                </a>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="fas fa-envelope"></i>
              <a href="#" className="text-black">
                smith@kpmg.com
              </a>
            </div>
            {/* <div className='d-flex align-items-right mt-3 mb-5 expand'>
              <a href='#' className='btn btn-dark btn-sm'>
                Expand
              </a>
              <span className='hor-line'></span>
            </div> */}
          </div>
        </div>
      </div>
    );
  };
  const Message_4 = () => {
    return (
      <div className="d-flex flex-stack py-4" ref={message_4} id="message_4">
        <div className="d-flex">
          <div className="symbol symbol-45px symbol-circle">
            <img alt="Pic" src={toAbsoluteUrl("/media/avatars/bot.png")} />
          </div>
          <div className="ms-5">
            <p class="fs-5 fw-bolder text-blue mb-2">
              System message{" "}
              <span className="sub-txt text-gray float-right">2:02:20 PM</span>
            </p>
            <p className="fs-14">
              Completed task "Collect Information" from "Active Directory
              Account Failed to logon (manual)".
            </p>

            <p className="fs-14">
              Completed task "Closed Approved Action" from "Active Directory
              Account Failed to logon (manual)".
            </p>
          </div>
        </div>
      </div>
    );
  };

  const Message_5 = () => {
    return (
      <div className="text-center mb-5">
        <p className="fw-bolder">Completed task in 2mins 2secs </p>
      </div>
    );
  };

  return (
    <>
      <div>
        <div
          className="mx-ht chat-ht"
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
            {/* chat bot msg */}
            {showChat > 1 ? <Message_1 /> : null}
            {showChat > 2 ? <Message_2 /> : null}
            {showChat > 3 ? <Message_3 /> : null}
            {showChat > 4 ? <Message_4 /> : null}
            {showChat > 4 ? <Message_5 /> : null}
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
      {/* Chat fullscreen */}
      <Modal show={show} onHide={handleClose} className="chat-fullscreen">
        <Modal.Header closeButton></Modal.Header>
        <div className="col-md-12 border-1 border-gray-300 border-end chat-section">
          <div
            className="mx-ht chat-ht"
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
              <Message_1 />
              <Message_2 />
              <Message_3 />
              <Message_4 />
              <Message_5 />
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
    </>
  );
};

export default IncidentChat;
