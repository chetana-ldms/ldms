import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Reports from "./Reports";
import Document from "./Document";
import QA from "./QA";
import UnderConstruction from "./UnderConstruction";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import UnderReview from "./UnderReview";

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
          <Form.Group>
            <Form.Label>Channel Type</Form.Label>
            <Form.Select>
              <option>Report</option>
              <option>Document</option>
              <option>Q&A</option>
              <option>Other</option>
            </Form.Select>
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
  const [channels, setChannels] = useState([]);
  const orgId = Number(sessionStorage.getItem("orgId"));
  const [showEditChannel, setShowEditChannel] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(false);

  useEffect(() => {
    // const orgId = 1;
    const apiUrl = `http://115.110.192.133:502/api/LDCChannels/v1/Channels?orgId=${orgId}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("API response:", data);
        if (Array.isArray(data.channelsData)) {
          setChannels(data.channelsData);
        } else {
          console.log("Invalid response format:", data);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  //show modal
  const [showModal, setShowModal] = useState(false);
  const handleAddChannel = (channel) => {
    setChannels([...channels, channel]);
  };

  // Render different templates based on channelTypeName
  const renderChannelTemplate = (channel) => {
    switch (channel.channelTypeName) {
      case "Report":
        return (
          <Reports
            channelId={channel.channelId}
            channelName={channel.channelName}
          />
        );
      case "Document":
        return (
          <Document
            channelId={channel.channelId}
            channelName={channel.channelName}
          />
        );
      case "QuestionAndAnswer":
        return (
          <QA channelId={channel.channelId} channelName={channel.channelName} />
        );
      case "UnderConstruction":
        return (
          <UnderConstruction
            channelId={channel.channelId}
            channelName={channel.channelName}
          />
        );
      case "UnderReview":
        return (
          <UnderReview
            channelId={channel.channelId}
            channelName={channel.channelName}
          />
        );
      default:
        return (
          <div>
            <p>This is a default channel template.</p>
            {/* Add more content for the default template */}
          </div>
        );
    }
  };

  return (
    <div className="channel-list channels-page">
      <div className="channel-title">
        <h4 className="float-left">
          Channels <span>(12)</span>
        </h4>
        <span
          className="float-right add-btn"
          onClick={() => setShowModal(true)}
        >
          Add Channel
        </span>
        {"  "}
        <span
          className="float-right add-btn ml-5"
          onClick={() => setShowEditChannel(true)}
        >
          Edit Channel
        </span>
      </div>
      <div className="demo-block">
        <Tabs className="vertical-tabs">
          <TabList className="inner-tablist channels-tab">
            {channels.map((channel) => (
              <Tab key={channel.channelId}>{channel.channelName}</Tab>
            ))}
          </TabList>

          {channels.map((channel) => (
            <TabPanel key={channel.channelId} className="channel-chat">
              <div className="tab-content pt-5">
                {renderChannelTemplate(channel)}
              </div>
            </TabPanel>
          ))}
        </Tabs>
        <NewChannelModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onAdd={handleAddChannel}
        />
      </div>
      <Modal
        className="channel-edit"
        show={showEditChannel}
        onHide={() => setShowEditChannel(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Channel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Channel Name</th>
                  <th>Channel Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Daily Reports</td>
                  <td>Report</td>
                  <td>
                    <button
                      className="btn btn-small btn-primary"
                      onClick={() => setAccordionOpen(!accordionOpen)}
                    >
                      Edit
                    </button>
                    <button className="btn btn-small btn-danger ml-10">
                      Delete
                    </button>
                  </td>
                </tr>
                {accordionOpen && (
                  <tr className="accordion-content channel-accordion">
                    <td colSpan="3">
                      <div className="accordion-header">
                        <button
                          className="close-button"
                          onClick={() => setAccordionOpen(false)}
                        >
                          x
                        </button>
                      </div>
                      <Form>
                        <Form.Group controlId="channelName">
                          <Form.Label>Channel name</Form.Label>
                          <Form.Control type="text" />
                        </Form.Group>
                        <br />
                        <Form.Group>
                          <Form.Label>Channel Type</Form.Label>
                          <Form.Select>
                            <option>Report</option>
                            <option>Document</option>
                            <option>Q&A</option>
                            <option>Other</option>
                          </Form.Select>
                        </Form.Group>
                        <br />
                        <Form.Group controlId="channelDescription">
                          <Form.Label>Channel description</Form.Label>
                          <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                      </Form>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export { ChannelsPage };
