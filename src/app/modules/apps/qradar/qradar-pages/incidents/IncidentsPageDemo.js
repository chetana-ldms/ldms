import React, { useState, useEffect } from "react";
import IncidentChat from "./IncidentChat";
import IncidentDetailsDemo from "./IncidentDetailsDemo";
import { useLocation } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import Chat from "./Chat";
import ChatBox, { ChatFrame } from "react-chat-plugin";
import { IncidentsPageCollaboration } from "./IncidentsPageCollaboration";

const IncidentsPageDemo = () => {
  const location = useLocation();
  const alertData = JSON.parse(localStorage.getItem("alertData"));
  const [demoAlertData, setDemoAlertData] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (Array.isArray(alertData)) {
      setDemoAlertData(
        alertData.reverse().map((alert) => ({ ...alert, isSelected: false }))
      );
    }
  }, [alertData]);

  const handleIncSecClick = () => {
    setShowChat(true);
  };

  const handleAlertClick = (selectedAlert) => {
    const updatedAlerts = demoAlertData.map((alert) => {
      if (alert.id === selectedAlert.id) {
        return { ...alert, isSelected: true };
      } else {
        return { ...alert, isSelected: false };
      }
    });

    console.log(updatedAlerts); // Check the updatedAlerts in the console

    setSelectedAlert(selectedAlert);
    setDemoAlertData(updatedAlerts);
    // Show the chat only when the "Demo: Add Failed Login Alert" incident is selected
    setShowChat(selectedAlert.name === "Demo : Add Failed Login Alert");
  };

  //Chat window
  const [messages, setMessages] = useState([
    {
      // text: "user2 has joined the conversation",
      timestamp: 1578366389250,
      type: "notification",
      // text: 'Cyber Defense Head Operation IT',
    },
    {
      author: {
        username: "Smith Cyber Defense Head",
        id: 1,
        avatarUrl: "/media/avatars/avatar.png",
      },
    },
  ]);

  const shouldShowCollaboration =
    selectedAlert && selectedAlert.name === "Suspecious mail";

  const handleOnSendMessage = (message) => {
    setMessages(
      messages.concat({
        author: {
          username: "Smith Cyber Defense Head",
          id: 1,
          avatarUrl: "/ldms/media/avatars/avatar.png",
          html: "<span>Cyber Defense Head Operation IT</span>",
        },
        timestamp: +new Date(),
        text: message,
        type: "text",
      })
    );
  };

  const ChatHeader = ({ selectedAlert }) => {
    return (
      <>
        <div className="mt-2 float-left">
          <p>
            DC -20210728-00056
            {/* <i className='far fa-copy'></i> */}
          </p>
          {selectedAlert ? (
            <p className="fs-12">User | {selectedAlert.name}</p>
          ) : (
            <p>User</p>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="card mb-5 mb-xl-8 bg-red incident-page">
        <div className="card-body1 py-3">
          <div className="row">
            <div className="col-md-4 border-1 border-gray-300 border-end">
              <div className="card">
                <div className="d-flex justify-content-between bd-highlight mb-3">
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
                  <div className="scroll-y h-500px">
                    <div className="incident-list">
                      <>
                        {Array.isArray(demoAlertData) ? (
                          demoAlertData.map((incident) => (
                            <>
                              <div
                                className={`incident-section${
                                  incident.isSelected == "true"
                                    ? "selected"
                                    : ""
                                }`}
                                key={incident.id}
                                onClick={() => {
                                  console.log("Clicked incident:", incident);
                                  handleAlertClick(incident);
                                }}
                              >
                                <div className="select">
                                  <div className="row">
                                    <div className="col-md-1">
                                      <i className="fa-solid fa-arrow-up text-danger"></i>
                                    </div>
                                    <div className="text-dark col-md-9">
                                      <a href="#" className="text-dark">
                                        <span className="fw-bold">
                                          {incident.name}
                                        </span>
                                      </a>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="d-flex justify-content-between">
                                      <div className="p-2 bd-highlight">
                                        <div className="badge text-black fw-normal">
                                          2
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
                                      Admin
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
                              </div>
                            </>
                          ))
                        ) : (
                          <p>No demo alert data available.</p>
                        )}
                        <div
                          className="incident-section inc-sec"
                          onClick={handleIncSecClick}
                        >
                          <div className="row">
                            <div className="col-md-1">
                              <i className="fa-solid fa-arrow-up text-danger"></i>
                            </div>
                            <div className="text-dark col-md-9">
                              <a href="#" className="text-dark">
                                <span className="fw-bold">
                                  Demo : Failed Login Alert
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
                      </>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 border-1 border-gray-300 border-end chat-section">
              {shouldShowCollaboration ? (
                <IncidentsPageCollaboration />
              ) : (
                <div>
                  {showChat ||
                  (selectedAlert &&
                    selectedAlert.name === "Demo : Add Failed Login Alert") ? (
                    <IncidentChat />
                  ) : (
                    <p>
                      {selectedAlert ? (
                        <>
                          <div className="chat-header">
                            <ChatHeader selectedAlert={selectedAlert} />
                          </div>
                          <div className="chat-box scroll-y me-n5">
                            <div className="date">
                              <p className="fw-bold mt-10">
                                <span>Today</span>
                              </p>
                            </div>
                            {/* <Chat /> */}
                            <ChatBox
                              messages={messages}
                              userId={1}
                              onSendMessage={handleOnSendMessage}
                              width={"500px"}
                              height={"500px"}
                            />

                            <div className="separator separator-dashed"></div>
                          </div>
                        </>
                      ) : (
                        <div className="chat-header">
                          <ChatHeader selectedAlert={selectedAlert} />
                        </div>
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>

            <IncidentDetailsDemo />
          </div>
        </div>
      </div>
    </>
  );
};

export { IncidentsPageDemo };
