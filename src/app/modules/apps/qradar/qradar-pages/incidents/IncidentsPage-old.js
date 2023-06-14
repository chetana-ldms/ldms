import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { KTSVG, toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import axios from "axios";
import IncidentChat from "./IncidentChat";
const IncidentsPage = () => {
  const ref = useRef(null);

  // Playbooks Code ///
  const [loading, setLoading] = useState(false);
  const [playbooks, setPlaybooks] = useState([]);
  const [incidentdata, setIncidentData] = useState([]);
  const { status } = useParams();

  const [isChat, setIsChat] = useState(false);

  const showincidentdetails = () => {
    setIsChat(true);
    setIsShown(false);
  };

  const [message, setMessage] = useState("");
  const [storedMessageId, setStoredMessageId] = useState("");
  const [storedMessageContent, setStoredMessageContent] = useState("");

  const showIncident = useRef(null);

  useEffect(() => {
    showIncident.current.click();
  }, []);

  const accountSid = "AC706908ab1f90d8732aaa9ff965e693ba";
  const authToken = "843a69a7508fce85d89d75fb0c79b1d0";
  const apiUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const msgid = "SMe3b3275d73082506fa22fa8038c394fb";

  //Send SMS
  // const showincidentdetails = async () => {
  //   try {
  //     const response = await fetch(
  //       "http://115.110.192.133:502/api/Notification/v1/SMS/Send",
  //       {
  //         method: "POST",
  //         headers: {
  //           accept: "text/plain",
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           smsMessage: "Failed login detected",
  //           fromPhoneNumber: "+15855172328",
  //           toPhoneNumber: "+919611264017",
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }

  //     const data = await response.json();
  //     setMessage("Message sent successfully.");
  //     setStoredMessageId(msgid);
  //     console.log("storedMessageId:", msgid);
  //   } catch (error) {
  //     console.error("There was a problem with the fetch operation:", error);
  //     setMessage("Enter fields");
  //   }
  //   setIsChat(true);
  //   setIsShown(false);
  // };

  // Get reply message
  const getReplyMessage = async () => {
    try {
      const response = await fetch(
        "http://115.110.192.133:502/api/Notification/v1/SMS/GetReplyMessage",
        {
          method: "GET",
          headers: {
            accept: "text/plain",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const replyContent = await response.text();
      console.log("Reply content:", replyContent.content);

      // Display the reply content if it matches the message ID
      if (storedMessageId && replyContent === storedMessageId) {
        setStoredMessageContent(replyContent.content);
        console.log("Stored message content:", replyContent.content);

        // Show the div if reply content is 'Yes'
        if (
          replyContent.content.toLowerCase() ===
          "Received message and confirmed login attempt"
        ) {
          setIsShown(true);
        }
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  // Call sendSMS and getReplyMessage on component mount
  useEffect(() => {
    showincidentdetails();
    getReplyMessage();
  }, []);

  //Reply received
  // const msgid = 'SM27abbe8936f44cfa895e476804977c1f'

  // const onGetReply = async () => {
  //   try {
  //     const response = await fetch(
  //       `http://115.110.192.133:502/api/Notification/v1/SMS/GetReplyMessage`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           messageID: msgid,
  //         }),
  //       }
  //     )

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch reply message')
  //     }

  //     const data = await response.json()
  //     console.log('Reply:', data.content)
  //     if (data.content) {
  //       setReplyMessage(data.content)
  //     } else {
  //       setReplyMessage(data.message)
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch reply message:', error)
  //   }
  // }

  // function showincidentdetails() {
  //   setShowChat(0)
  // }

  const [isShown, setIsShown] = useState(false);

  const handleClick = () => {
    setIsShown(true);
    setIsChat(false);
  };

  const getPlaybooks = () => {
    setLoading(true);
    var config = {
      method: "get",
      url: "http://115.110.192.133:8011/api/PlayBook/v1/PlayBooks",
      headers: {
        Accept: "text/plain",
      },
    };

    axios(config)
      .then(function (response) {
        setPlaybooks(response.data.playbooks);
        console.log(response.data.playbooks);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    setLoading(true);
    let data2 = JSON.stringify({
      orgID: "1",
      toolID: "1",
      toolTypeID: "1",
      paging: {
        rangeStart: "1",
        rangeEnd: "10",
      },
      loggedInUserId: "1",
    });
    var data = JSON.stringify({
      orgID: 1,
      toolID: 1,
      toolTypeID: 1,
      paging: {
        rangeStart: 1,
        rangeEnd: 10,
      },
    });

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://115.110.192.133:502/api/IncidentManagement/v1/Incidents",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain",
      },
      data: data2,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setIncidentData(response.data.incidentList);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const ChatHeader = () => {
    return (
      <>
        <div className="mt-2 float-left">
          <p>
            DC -20210728-00056
            {/* <i className='far fa-copy'></i> */}
          </p>
          <p className="fs-12">User</p>
        </div>
        <div className="badge text-black fw-normal icon-right float-right">
          <a href="#">
            <i className="far fa-window-restore"></i>
          </a>
          {/* <a href={toAbsoluteUrl('/media/reports/Report.docx')} download='myFile'>
            <i className='fas fa-download'></i>
          </a> */}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="card mb-5 mb-xl-8 bg-red incident-page">
        <div className="card-body1 py-3">
          {/* <UsersListLoading /> */}
          <div className="row">
            <div className="col-md-4 border-1 border-gray-300 border-end">
              <div className="card">
                <div className="d-flex justify-content-between bd-highlight mb-3">
                  {/* <div className="p-1 bd-highlight">
                    <a
                      href="#"
                      className="btn btn-sm btn-icon btn-light btn-secondary mx-3"
                    >
                      <i className="fa-solid fa-arrows-rotate"></i>
                    </a>
                  </div> */}
                  {/* <input ref={inputRef} type='text' />
                  <button onClick={() => setInput(inputRef.current.value)}>Button</button>
                  <p>{input}</p> */}
                  <div className="p-1 bd-highlight">
                    <h6 className="card-title align-items-start flex-column pt-2">
                      <span className="card-label fw-bold fs-5 mb-1">
                        Incidents <span className="text-black-50">(2)</span>
                      </span>
                    </h6>
                  </div>
                  <div className="p-1 bd-highlight"></div>
                </div>

                <div className="card-title">
                  {/* begin::Search */}
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Search Incident"
                    />
                    <span className="input-group-text">
                      <i className="fas fa-magnifying-glass"></i>
                    </span>
                  </div>
                  {/* end::Search */}
                  <div className="d-flex justify-content-between bd-highlight mb-3">
                    <div className="mt-2 bd-highlight">
                      <div className="w-110px me-2">
                        <select
                          name="status"
                          data-control="select2"
                          data-hide-search="true"
                          className="form-select form-select-white form-select-sm fw-bold"
                        >
                          <option value="1">Status</option>
                          <option value="4">New</option>
                          <option value="4">In Progress</option>
                          <option value="4">Closed</option>
                          <option value="4">Escalate/Ignore</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-2 bd-highlight mt-4">Sort by</div>
                    <div className="mt-2 bd-highlight">
                      <div className="w-120px me-0">
                        <select
                          name="status"
                          data-control="select2"
                          data-hide-search="true"
                          className="form-select form-select-white form-select-sm fw-bold"
                        >
                          <option value="1">Modified</option>
                          <option value="4">Latest</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div className="incident-list">
                      <div>
                        {loading == true ? (
                          <>
                            <div>
                              <UsersListLoading />
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                        <div
                          className="incident-section"
                          ref={showIncident}
                          onClick={showincidentdetails}
                        >
                          <div className="row">
                            <div className="col-md-1">
                              <i className="fa-solid fa-arrow-up text-danger"></i>
                            </div>

                            <div className="text-dark col-md-9">
                              <a href="#" className="text-dark">
                                <span className="fw-bold">
                                  Multiple Failed login Alert
                                </span>
                              </a>
                            </div>
                          </div>
                          <div className="row">
                            <div className="d-flex justify-content-between">
                              <div className="p-2 bd-highlight">
                                <div className="badge text-black fw-normal">
                                  1
                                  <div className="badge text-black fw-normal">
                                    <i className="fas fa-copy"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="pt-3 bd-highlight">
                                <div className="badge text-black fw-normal">
                                  3 MIN
                                </div>
                              </div>
                            </div>
                          </div>
                          <hr className="my-0" />
                          <div className="d-flex justify-content-between bd-highlight mt-2">
                            <div className="p-1 bd-highlight fs-14">Admin</div>
                            <div className="p-1 bd-highlight">
                              <div className="badge badge-light-primary mx-1">
                                NEW
                              </div>
                              <div className="badge badge-light-danger">
                                HIGH
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* {incidentdata === null ? (
                          <UsersListLoading />
                        ) : (
                          incidentdata.map((item, index) => (
                            <>
                              <div
                                className="incident-section"
                                onClick={handleClick}
                              >
                                <div className="row">
                                  <div className="col-md-1">
                                    <i className="fa-solid fa-arrow-up text-danger"></i>
                                  </div>

                                  <div className="text-dark col-md-9">
                                    <a href="#" className="text-dark">
                                      <span className="fw-bold">
                                        {item.description}
                                      </span>
                                    </a>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="d-flex justify-content-between">
                                    <div className="p-2 bd-highlight">
                                      <div className="badge text-black fw-normal">
                                        {item.incidentID}
                                        <div className="badge text-black fw-normal">
                                          <i className="fas fa-copy"></i>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="pt-3 bd-highlight">
                                      <div className="badge text-black fw-normal">
                                        3 MIN
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr className="my-0" />
                                <div className="d-flex justify-content-between bd-highlight mt-2">
                                  <div className="p-1 bd-highlight fs-14">
                                    {item.destinationUser}
                                  </div>
                                  <div className="p-1 bd-highlight">
                                    <div className="badge badge-light-primary mx-1">
                                      NEW
                                    </div>
                                    <div className="badge badge-light-danger">
                                      HIGH
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ))
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isShown ? (
              <div className="col-md-4 border-1 border-gray-300 border-end chat-section">
                <div className="chat-header">
                  <ChatHeader />
                </div>
                <div className="chat-box scroll-y me-n5 h-600px"></div>
              </div>
            ) : (
              <>
                <IncidentChat />
                {isShown && (
                  <div>
                    <h2>Incident Details</h2>
                    <p>Details of the incident will be displayed here...</p>
                  </div>
                )}
              </>
            )}
            {isChat ? <IncidentChat /> : <></>}
            {/* <IncidentChat /> */}

            {/* -----------------------Chat Window Start-------------------------------- */}

            {/* -------------------------Chat Window End------------------------------ */}

            <div className="col-md-4 border-1 border-gray-600">
              <div className="card">
                <div className="d-flex justify-content-between bd-highlight mb-3">
                  <div className="p-2 bd-highlight">
                    <h6 className="card-title align-items-start flex-column pt-2">
                      <span className="card-label fw-bold fs-3 mb-1">
                        Incidents Details
                      </span>
                    </h6>
                  </div>
                </div>
                <div className="d-flex justify-content-between bd-highlight mb-3 incident-tabs">
                  <div className="p-2 bd-highlight">
                    <ul className="nav nav-tabs nav-line-tabs mb-5 fs-8">
                      <li className="nav-item">
                        <a
                          className="nav-link active"
                          data-bs-toggle="tab"
                          href="#kt_tab_pane_1"
                        >
                          General
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          data-bs-toggle="tab"
                          href="#kt_tab_pane_2"
                        >
                          Alerts
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          onClick={getPlaybooks}
                          data-bs-toggle="tab"
                          href="#kt_tab_pane_3"
                        >
                          Playbooks
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          data-bs-toggle="tab"
                          href="#kt_tab_pane_4"
                        >
                          Observables
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          data-bs-toggle="tab"
                          href="#kt_tab_pane_5"
                        >
                          Timeline
                        </a>
                      </li>
                    </ul>

                    <div className="tab-content" id="myTabContent">
                      <div
                        className="tab-pane fade show active me-n5 pe-5 h-500px"
                        id="kt_tab_pane_1"
                        role="tabpanel"
                      >
                        <div className="row bd-highlight mb-3">
                          <div className="col-md-3 bd-highlight mt-2">
                            Status
                          </div>
                          <div className="col-md-9 bd-highlight">
                            <div className="w-120px">
                              <select
                                name="status"
                                data-control="select2"
                                data-hide-search="true"
                                className="form-select form-control form-select-white form-select-sm fw-bold"
                              >
                                <option value="1">New</option>
                                <option value="1">Open</option>
                                <option value="1">Pending</option>
                                <option value="1">Closed</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        {/* Priority */}
                        <div className="row bd-highlight mb-3">
                          <div className="col-md-3 bd-highlight mt-2">
                            Priority
                          </div>
                          <div className="col-md-9 bd-highlight">
                            <div className="w-120px">
                              <select
                                name="status"
                                data-control="select2"
                                data-hide-search="true"
                                className="form-select form-control form-select-white form-select-sm fw-bold text-danger"
                              >
                                <option value="1" className="text-danger">
                                  High
                                </option>
                                <option value="1" className="text-warning">
                                  Medium
                                </option>
                                <option value="1" className="text-info">
                                  Low
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        {/* Severity */}
                        <div className="row bd-highlight mb-3">
                          <div className="col-md-3 bd-highlight mt-2">
                            Severity
                          </div>
                          <div className="col-md-9 bd-highlight">
                            <div className="w-120px">
                              <select
                                name="status"
                                data-control="select2"
                                data-hide-search="true"
                                className="form-select form-control form-select-white form-select-sm fw-bold text-danger"
                              >
                                <option value="1" className="text-danger">
                                  High
                                </option>
                                <option value="1" className="text-warning">
                                  Medium
                                </option>
                                <option value="1" className="text-info">
                                  Low
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Type */}
                        <div className="row bd-highlight mb-3">
                          <div className="col-md-3 bd-highlight mt-2">Type</div>
                          <div className="col-md-9 bd-highlight">
                            <div className="w-120px">
                              <select
                                name="status"
                                data-control="select2"
                                data-hide-search="true"
                                className="form-select form-control form-select-white form-select-sm fw-bold"
                              >
                                <option value="1">AD Failed Login</option>
                                <option value="1">AD Failed Login</option>
                                <option value="1">AD Failed Login</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        {/* Text */}
                        <div className="bd-highlight mb-3 bdr-top">
                          <div className="col-md-12 bd-highlight">
                            <div className="d-flex align-items-center gap-2">
                              <span className="fw-bold">Alert Name - </span>{" "}
                              Multiple failed login for same IP
                            </div>
                          </div>
                          <div className="col-md-12 bd-highlight">
                            <div className="d-flex align-items-center gap-2">
                              <span className="fw-bold">Event ID - </span> 4625
                            </div>
                          </div>
                          <div className="col-md-12 bd-highlight">
                            <div className="d-flex align-items-center gap-2">
                              <span className="fw-bold">
                                Destination User -{" "}
                              </span>{" "}
                              James James
                            </div>
                          </div>
                          <div className="col-md-12 bd-highlight">
                            <div className="d-flex align-items-center gap-2">
                              <span className="fw-bold">Source IP - </span>{" "}
                              192.168.0.1
                            </div>
                          </div>
                          <div className="col-md-12 bd-highlight">
                            <div className="d-flex align-items-center gap-2">
                              <span className="fw-bold">Vendor - </span>{" "}
                              Microsoft
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between bd-highlight">
                          <div className="p-2 bd-highlight">
                            <div className="fs-13">Incident ID</div>
                          </div>
                          <div className="p-2 bd-highlight">
                            <div className="badge text-black fs-13">
                              20210728-00056
                              {/* <div className="badge text-black fs-13">
                                <i className="fas fa-copy"></i>
                              </div> */}
                            </div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between bd-highlight">
                          <div className="p-2 bd-highlight">
                            <div className="fs-13">Owner</div>
                          </div>
                          <div className="p-2 bd-highlight">
                            <div className="">
                              <select
                                name="status"
                                data-control="select2"
                                data-hide-search="true"
                                className="form-select form-control form-select-white form-select-sm fw-bold"
                              >
                                <option value="1">User 1</option>
                                <option value="1">User 2</option>
                                <option value="1">User 3</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between bd-highlight">
                          <div className="p-2 bd-highlight">
                            <div className="fs-13">Created</div>
                          </div>
                          <div className="p-2 bd-highlight">
                            <div className="badge text-black fw-normal">
                              Jul 28, 2022 02:02:02 PM
                            </div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between bd-highlight">
                          <div className="p-2 bd-highlight">
                            <div className="fs-13">Updated</div>
                          </div>
                          <div className="p-2 bd-highlight">
                            <div className="badge text-black fw-normal">
                              Jul 29, 2022 01:12:32 AM
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="kt_tab_pane_2"
                        role="tabpanel"
                      >
                        {/* <div className="d-flex justify-content-between bd-highlight mb-3">
                          <div className="p-2 bd-highlight">
                            <h6 className="card-title align-items-start flex-column pt-2">
                              <span className="card-label fw-bold fs-7 mb-1">
                                Presented{" "}
                                <span className="text-black-50">(3/3)</span>
                              </span>
                            </h6>
                          </div>
                          <div className="p-2 bd-highlight">
                            <a href="#" className="btn btn-secondary btn-sm">
                              Show More
                            </a>
                          </div>
                        </div> */}
                        <table
                          className="scroll-y me-n5 pe-5 table table-hover table-row-dashed fs-6 gy-5 my-0 dataTable no-footer"
                          id="kt_inbox_listing"
                        >
                          <tbody>
                            <tr className="bg-gray-100 mb-3">
                              <td className="p-2 pb-8">
                                <div className="d-flex justify-content-between bd-highlight">
                                  <div className="p-1 bd-highlight fw-bold fs-12">
                                    <div className="text-dark mb-1">
                                      <a href="#" className="text-dark">
                                        <span className="fw-bold">
                                          Login Failure Alert
                                        </span>
                                      </a>
                                    </div>
                                  </div>
                                  <div className="p-1 bd-highlight">
                                    <a
                                      href="#"
                                      className="btn btn-sm btn-icon btn-light btn-secondary mx-1"
                                    >
                                      <i className="fa-solid fa-trash"></i>
                                    </a>
                                    <a
                                      href="#"
                                      className="btn btn-sm btn-icon btn-light btn-secondary mx-1"
                                    >
                                      <i className="fa-solid fa-arrow-up"></i>
                                    </a>
                                  </div>
                                </div>

                                <div className="d-flex justify-content-between align-text-left bd-highlight">
                                  <div className="p-1 bd-highlight fw-bold fs-12">
                                    Suspicious Rate
                                  </div>
                                  <div className="p-1 bd-highlight fw-bold fs-12">
                                    <i className="fa-solid fa-circle-check text-success"></i>{" "}
                                    1
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between align-text-left bd-highlight">
                                  <div className="p-1 bd-highlight fw-bold fs-12">
                                    Detected date
                                  </div>
                                  <div className="p-1 bd-highlight fs-12">
                                    7/01/2023, 02:20 PM
                                  </div>
                                </div>
                                <hr className="my-0" />
                              </td>
                            </tr>

                            <tr className="bg-gray-100">
                              <td className="min-w-80px p-2 pb-8">
                                <div className="d-flex justify-content-between bd-highlight">
                                  <div className="p-1 bd-highlight fw-bold fs-12">
                                    <div className="text-dark mb-1">
                                      <a href="#" className="text-dark">
                                        <span className="fw-bold">
                                          CheckPoint - Malware Traffic
                                        </span>
                                      </a>
                                    </div>
                                  </div>
                                  <div className="p-1 bd-highlight">
                                    <a
                                      href="#"
                                      className="btn btn-sm btn-icon btn-light btn-secondary mx-1"
                                    >
                                      <i className="fa-solid fa-trash"></i>
                                    </a>
                                    <a
                                      href="#"
                                      className="btn btn-sm btn-icon btn-light btn-secondary mx-1"
                                    >
                                      <i className="fa-solid fa-arrow-down"></i>
                                    </a>
                                  </div>
                                </div>

                                <div className="d-flex justify-content-between align-text-left bd-highlight">
                                  <div className="p-1 bd-highlight fw-bold fs-12">
                                    Suspicious Rate
                                  </div>
                                  <div className="p-1 bd-highlight fw-bold fs-12">
                                    <i className="fa-solid fa-circle-check text-success"></i>{" "}
                                    2
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between align-text-left bd-highlight">
                                  <div className="p-1 bd-highlight fw-bold fs-12">
                                    Detected date
                                  </div>
                                  <div className="p-1 bd-highlight fs-12">
                                    5/04/2023, 12:15 PM
                                  </div>
                                </div>
                                <hr className="my-0" />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="kt_tab_pane_3"
                        role="tabpanel"
                      >
                        <table className="table align-middle gs-0 gy-4 dash-table">
                          <thead>
                            <tr className="fw-bold text-muted bg-blue">
                              <th className="min-w-50px">PlayBook Name</th>
                              <th className="min-w-50px">Description</th>
                              <th className="min-w-50px">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="fs-12">
                              <td>Login Failure</td>
                              <td>Failed Login</td>
                              <td>
                                <span className="badge badge-success">
                                  Active
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="kt_tab_pane_4"
                        role="tabpanel"
                      >
                        Observables data
                      </div>
                      <div
                        className="tab-pane fade"
                        id="kt_tab_pane_5"
                        role="tabpanel"
                      >
                        <div className="card-body pt-6 h-600px">
                          <div className="timeline-label">
                            <div className="timeline-item">
                              <div className="timeline-label fw-bold text-gray-800 fs-6">
                                08:42
                              </div>

                              <div className="timeline-badge">
                                <i className="fa fa-genderless text-gray-600 fs-1"></i>
                              </div>

                              <div className="fw-semibold text-gray-700 ps-3 fs-7">
                                Information passed to Concern team.
                              </div>
                            </div>

                            <div className="timeline-item d-flex align-items-center">
                              <div className="timeline-label fw-bold text-gray-800 fs-6">
                                10:00
                              </div>

                              <div className="timeline-badge">
                                <i className="fa fa-genderless text-success fs-1"></i>
                              </div>

                              <div className="d-flex align-items-center">
                                <span className="fw-bold text-gray-800 px-3">
                                  Alert Reviewed by{" "}
                                </span>

                                <div className="symbol symbol-35px me-3">
                                  <img
                                    alt="Pic"
                                    src={toAbsoluteUrl(
                                      "/media/avatars/300-1.jpg"
                                    )}
                                  />
                                </div>

                                <div className="symbol symbol-35px">
                                  <img
                                    alt="Pic"
                                    src={toAbsoluteUrl(
                                      "/media/avatars/300-2.jpg"
                                    )}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="timeline-item">
                              <div className="timeline-label fw-bold text-gray-800 fs-6">
                                14:37
                              </div>

                              <div className="timeline-badge">
                                <i className="fa fa-genderless text-danger fs-1"></i>
                              </div>

                              <div className="timeline-content fw-bold text-gray-800 ps-3">
                                severity: notice message: undefined Rule:
                                <a href="#" className="text-primary">
                                  Count 9
                                </a>
                              </div>
                            </div>

                            <div className="timeline-item">
                              <div className="timeline-label fw-bold text-gray-800 fs-6">
                                16:50
                              </div>

                              <div className="timeline-badge">
                                <i className="fa fa-genderless text-primary fs-1"></i>
                              </div>

                              <div className="fw-semibold text-gray-700 ps-3 fs-7">
                                Alert : IP address need to be blocked
                              </div>
                            </div>

                            <div className="timeline-item">
                              <div className="timeline-label fw-bold text-gray-800 fs-6">
                                21:03
                              </div>

                              <div className="timeline-badge">
                                <i className="fa fa-genderless text-warning fs-1"></i>
                              </div>

                              <div className="timeline-content fw-semibold text-gray-800 ps-3">
                                New Ticket Raised{" "}
                                <a href="#" className="text-primary">
                                  #XF-2356
                                </a>
                                .
                              </div>
                            </div>

                            <div className="timeline-item">
                              <div className="timeline-label fw-bold text-gray-800 fs-6">
                                16:50
                              </div>

                              <div className="timeline-badge">
                                <i className="fa fa-genderless text-info fs-1"></i>
                              </div>

                              <div className="fw-semibold text-gray-700 ps-3 fs-7">
                                Ticket status updated
                              </div>
                            </div>

                            <div className="timeline-item">
                              <div className="timeline-label fw-bold text-gray-800 fs-6">
                                14:37
                              </div>

                              <div className="timeline-badge">
                                <i className="fa fa-genderless text-danger fs-1"></i>
                              </div>

                              <div className="timeline-content fw-bold text-gray-800 ps-3">
                                Ticket Closed -
                                <a href="#" className="text-primary">
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
  );
};

export { IncidentsPage };
