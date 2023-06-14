import React, { useState } from "react";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import { KTSVG, toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import DailyReports from "./Reports";
import ThreatIntelReport from "./Pdf";
import QA from "./QA";
import Documentation from "./Document";
import WeeklyReport from "./WeeklyReport";
import SIEM from "./InProgress";
import WeeklyActionItem from "./WeeklyActionItem";
import EDRConfig from "./EDRConfig";
import USCert from "./USCert";
import TeamsIntegration from "./Teams";

//Modal

const NewChannelModal = ({ show, onClose, onAdd }) => {
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleChannelNameChange = (e) => {
    setChannelName(e.target.value);
  };

  const handleChannelDescriptionChange = (e) => {
    setChannelDescription(e.target.value);
  };

  const handleSubmit = () => {
    // Add new channel to the channel list and close the modal
    const newChannel = { name: channelName, description: channelDescription };
    onAdd(newChannel);
    // onClose()
    setShowSuccessMessage(true); // set the success message to true
  };

  const handleModalClose = () => {
    setChannelName("");
    setChannelDescription("");
    onClose();
    setShowSuccessMessage(false);
  };

  return (
    <Modal show={show} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add new channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          showSuccessMessage && (
            <Alert variant="primary" className="fs-14">
              Your request to add new channel will be processed within 24Hrs.
            </Alert>
          ) // show success message if the showSuccessMessage is true
        }
        <Form>
          <Form.Group controlId="channelName">
            <Form.Label>Channel name</Form.Label>
            <Form.Control
              type="text"
              value={channelName}
              onChange={handleChannelNameChange}
            />
          </Form.Group>
          <br />
          <Form.Group controlId="channelDescription">
            <Form.Label>Channel description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={channelDescription}
              onChange={handleChannelDescriptionChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Add Channel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ChannelsPage = () => {
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [channels, setChannels] = useState([]);

  //show modal
  const [showModal, setShowModal] = useState(false);

  const handleTabSelect = (index) => {
    setShowChatWindow(true);
    setSelectedTab(index);
  };

  const handleAddChannel = (channel) => {
    setChannels([...channels, channel]);
  };

  const tabNames = channels.map((channel) => channel.name).filter(Boolean);

  const tabData = [
    {
      title: "Daily reports",
      content: "",
    },
    {
      title: "Threat intel report",
      content: "",
    },
    {
      title: "Q&A",
      content: "",
    },
    {
      title: "Documentation",
      content: "",
    },
    {
      title: "Weekly report",
      content: "",
    },
    {
      title: "SIEM update",
      content: "",
    },
    {
      title: "Weekly action items",
      content: "",
    },
    {
      title: "EDR configuration",
      content: "",
    },
    {
      title: "US-CERT",
      content: "",
    },
    {
      title: "Microsoft Teams",
      content: "",
    },
  ];

  const ChatHeader = () => {
    const channelTitle = tabData[selectedTab]?.title || "";
    return (
      <>
        <div className="mt-2 float-left">
          <p>{channelTitle}</p>
        </div>
        {/* <div className='badge text-black fw-normal icon-right float-right'>
          <a href='#'>
            <i className='far fa-window-restore'></i>
          </a>
          <a href={toAbsoluteUrl('/media/reports/Report.docx')} download='myFile'>
            <i className='fas fa-download'></i>
          </a>
        </div> */}
      </>
    );
  };

  const addedChannels = channels.slice(1);

  return (
    <div className="row channels-page">
      {/* Begin Col */}
      <div className="col-lg-12">
        <div className="card mb-5 mb-xl-12">
          <div className="">
            {/* <h2>Channels</h2> */}
            <div className="demo-block">
              <Tabs onSelect={handleTabSelect} selectedIndex={selectedTab}>
                <div className="channel-title">
                  <h4 className="float-left">
                    Channels <span>(12)</span>
                  </h4>
                  <span
                    className="float-right add-btn"
                    onClick={() => setShowModal(true)}
                  >
                    Add new
                  </span>
                </div>

                <TabList className="inner-tablist channels-tab">
                  {/* {tabNames.map((name, index) => (
                    <Tab key={index}>
                      {name} <i className='fas fa-sitemap float-right' />
                    </Tab>
                  ))} */}
                  {tabData.map((tab, index) => (
                    <Tab key={tab.title}>{tab.title}</Tab>
                  ))}
                </TabList>

                {/* {tabNames.map((name, index) => (
                  <TabPanel key={index} className='channel-chat'>
                    <>
                      <div className='chat-header'>
                        <ChatHeader />
                      </div>
                      {name && (
                        <>
                          <div className='chat-body'>
                            <div className='row'>
                              <div className='col'>
                                <div className='date'>
                                  <p className='fw-bold mt-10'>
                                    <span>April 20, 2023</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col-md-1'>
                                <div className='symbol symbol-35px symbol-circle'>
                                  <img alt='Pic' src={toAbsoluteUrl('/media/avatars/bot.png')} />
                                </div>
                              </div>
                              <div className='col-md-10'>
                                <a
                                  href='#'
                                  className='fs-5 fw-bolder text-blue text-hover-primary mb-2'
                                >
                                  System Message
                                </a>
                                <p>
                                  Channel <b className='text-blue'>{name}</b> was created by{' '}
                                  <b className='text-blue'>Vinu J</b>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className='chat-input'>
                            <ChatWindow defaultMessage='' />
                          </div>
                        </>
                      )}
                    </>
                  </TabPanel>
                ))} */}
                {tabData.map((tab, index) => (
                  <TabPanel key={tab.title} className="channel-chat">
                    <>
                      <div className="chat-header">
                        <ChatHeader />
                      </div>
                      <div className="chat-body">
                        <div className="row">
                          <div className="col">
                            <div className="date">
                              <p className="fw-bold mt-10">
                                <span className="text-blue">
                                  {new Date().toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        {tab.title === "Daily reports" && (
                          <>
                            <div className="row hidden">
                              <div className="col-md-1">
                                <div className="symbol symbol-35px symbol-circle">
                                  <img
                                    alt="Pic"
                                    src={toAbsoluteUrl(
                                      "/media/avatars/bot.png"
                                    )}
                                  />
                                </div>
                              </div>
                              <div className="col-md-10">
                                <a
                                  href="#"
                                  className="fs-5 fw-bolder text-blue text-hover-primary mb-2"
                                >
                                  System Message
                                </a>
                                <p>
                                  Channel{" "}
                                  <b className="text-blue">{tab.title}</b> was
                                  created by <b className="text-blue">Vinu J</b>
                                </p>
                              </div>
                            </div>
                            <div className="row mb-10">
                              <div className="col">
                                <DailyReports />
                              </div>
                            </div>
                          </>
                        )}
                        {tab.title === "Threat intel report" && (
                          <>
                            <div className="row mb-10">
                              <div className="col">
                                <ThreatIntelReport />
                              </div>
                            </div>
                          </>
                        )}
                        {tab.title === "Q&A" && (
                          <>
                            <div className="row mb-10">
                              <div className="col">
                                <QA />
                              </div>
                            </div>
                          </>
                        )}
                        {tab.title === "Documentation" && (
                          <>
                            <div className="row mb-10">
                              <div className="col">
                                <Documentation />
                              </div>
                            </div>
                          </>
                        )}
                        {tab.title === "Weekly report" && (
                          <>
                            <div className="row mb-10">
                              <div className="col">
                                <WeeklyReport />
                              </div>
                            </div>
                          </>
                        )}
                        {tab.title === "SIEM update" && (
                          <>
                            <div className="row mb-10">
                              <div className="col">
                                <SIEM />
                              </div>
                            </div>
                          </>
                        )}
                        {tab.title === "Weekly action items" && (
                          <>
                            <div className="row mb-10">
                              <div className="col">
                                <WeeklyActionItem />
                              </div>
                            </div>
                          </>
                        )}
                        {tab.title === "EDR configuration" && (
                          <>
                            <div className="row mb-10">
                              <div className="col">
                                <EDRConfig />
                              </div>
                            </div>
                          </>
                        )}
                        {tab.title === "US-CERT" && (
                          <>
                            <div className="row mb-10">
                              <div className="col">
                                <USCert />
                              </div>
                            </div>
                          </>
                        )}
                        {tab.title === "Microsoft Teams" && (
                          <>
                            <div className="row mb-10">
                              <div className="col">
                                <TeamsIntegration />
                              </div>
                            </div>
                          </>
                        )}
                        <div className="chat-input">
                          <ChatWindow defaultMessage="" />
                        </div>
                      </div>
                    </>
                  </TabPanel>
                ))}
              </Tabs>
              <NewChannelModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onAdd={handleAddChannel}
              />
            </div>
          </div>
        </div>
      </div>
      {/* End Col */}
    </div>
  );
};

const ChatWindow = ({ defaultMessage }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([defaultMessage]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputValue) {
      setMessages([...messages, inputValue]);
      setInputValue("");
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((message, index) => {
          const isUserMessage = index === messages.length - 1;
          return (
            <div className="row" key={index}>
              <div className="col-md-1">
                {!isUserMessage && (
                  <div className="symbol symbol-35px symbol-circle">
                    <img
                      alt="Pic"
                      src={toAbsoluteUrl("/media/avatars/300-1.jpg")}
                    />
                  </div>
                )}
              </div>

              <div className="col-md-10">
                {!isUserMessage && (
                  <>
                    <a
                      href="#"
                      className="fs-5 fw-bolder text-blue text-hover-primary mb-2"
                    >
                      vinu@lancesoft.com Senior Analyst
                    </a>

                    <span className="sub-txt"> 2:09:18 PM</span>
                  </>
                )}
                <p>
                  <div key={index}>{message}</div>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            className="form-control"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button type="submit" className="btn-chat">
            <span className="input-group-text">
              <i className="fas fa-paper-plane"></i>
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export { ChannelsPage };
