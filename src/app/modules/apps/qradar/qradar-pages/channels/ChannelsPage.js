import React, { useState, useEffect, useRef } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Reports from "./Reports";
import Document from "./Document";
import QA from "./QA";
import UnderConstruction from "./UnderConstruction";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { ToastContainer } from 'react-toastify'
import { notify, notifyFail } from '../components/notification/Notification'
import 'react-toastify/dist/ReactToastify.css'
import UnderReview from "./UnderReview";
import { fetchChannelDetails, fetchChannels, fetchChannelsAdd, fetchChannelsDelete, fetchChannelsUpdate } from "../../../../../api/ChannelApi";
import { fetchMasterData } from "../../../../../api/Api";

//Modal
const NewChannelModal = ({ show, onClose, onAdd }) => {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const createdUserId = Number(sessionStorage.getItem('userId'));
  const createdDate = new Date().toISOString();
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const channelNames = useRef()
  const channelDescriptions = useRef()
  const [channels, setChannels] = useState([]);
  const fetchData = async () => {
    try {
      const data = await fetchChannels(orgId);
      setChannels(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async () => {
    const data = {
      channelName: channelNames.current.value,
      channelDescription: channelDescriptions.current.value,
      displayOrder: 0,
      orgId,
      // "msTeamsTeamsId": "string",
      // "msTeamsChannelId": "string",
      createdDate,
      createdUserId
    };

    await fetchChannelsAdd(data);
    // const newChannel = { channelName: channelName, channelDescription: channelDescription };
    try {
      const result = await fetchChannels(orgId);
      // setChannels(data);
      onAdd(result[result.length-1]);
    } catch (error) {
      console.log(error);
    }
    
    onClose();
    setShowSuccessMessage(true);
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
              ref={channelNames}
              onChange={(e) => setChannelName(e.target.value)}
              required
            />
          </Form.Group>
          <br />

          <Form.Group controlId="channelDescription">
            <Form.Label>Channel description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              ref={channelDescriptions}
              onChange={(e) => setChannelDescription(e.target.value)}
              required
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
  const deletedUserId = Number(sessionStorage.getItem('userId'));
  const deletedDate = new Date().toISOString();
  const [showEditChannel, setShowEditChannel] = useState(false);
  const [dropdownData, setDropdownData] = useState([])
  const [accordionOpen, setAccordionOpen] = useState(false);
  const channelNames = useRef()
  const channelDescriptions = useRef()
  const channelTypes = useRef()
  const [selectedChannel, setSelectedChannel] = useState(null);

  const fetchData = async () => {
    try {
      const data = await fetchChannels(orgId);
      setChannels(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchMasterData("Channel_Type")
      .then((typeData) => {
        setDropdownData({
          dropdownData: typeData,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    fetchData();
  }, []);
  const handleDelete = async (channel) => {
    const deletedUserId = Number(sessionStorage.getItem('userId'));
    const deletedDate = new Date().toISOString();
    const data = {
      channelId: channel.channelId,
      deletedDate,
      deletedUserId
    }
    try {
      const responce = await fetchChannelsDelete(data);
      if (responce.isSuccess) {
        notify('Data Deleted');
      } else {
        notifyFail("Data not Deleted")
      }
      await fetchData();
    } catch (error) {
      console.log(error);
    }
  }
  // useEffect(() => {
  //   // const orgId = 1;
  //   const apiUrl = `http://115.110.192.133:502/api/LDCChannels/v1/Channels?orgId=${orgId}`;

  //   fetch(apiUrl)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("API response:", data);
  //       if (Array.isArray(data.channelsData)) {
  //         setChannels(data.channelsData);
  //       } else {
  //         console.log("Invalid response format:", data);
  //       }
  //     })
  //     .catch((error) => console.log(error));
  // }, []);

  //show modal
  const handleAccordionToggle = async (channelId) => {
    try {
      const channelData = await fetchChannelDetails(channelId); // Call the API to fetch channel data
      setChannels((prevChannels) => {
        return prevChannels.map((channel) => {
          if (channel.channelId === channelId) {
            setSelectedChannel(channelData); // Set the selected channel with the fetched data
            return {
              ...channel,
              isAccordionOpen: !channel.isAccordionOpen
            };
          }
          return channel;
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  
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
  const handleSave = async (channelId) => {

    const data = {
      channelId: channelId,
      channelName: channelNames.current.value,
      channelDescription: channelDescriptions.current.value,
      channelTypeId:channelTypes.current.value,
      displayOrder:0,
      orgId,
      modifiedDate:deletedDate,
      modifiedUserId:deletedUserId,
    };

    try {
      const response = await fetchChannelsUpdate(data);
      handleAccordionToggle(channelId);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="channel-list channels-page">
      <ToastContainer />
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
                {channels.map((channel) => (
                  <React.Fragment key={channel.channelId}>
                    <tr>
                      <td>{channel.channelName}</td>
                      <td>{channel.channelTypeName}</td>
                      <td>
                        <button
                          className="btn btn-small btn-primary"
                          onClick={() => handleAccordionToggle(channel.channelId)}
                        >
                          Edit
                        </button>
                        <button className="btn btn-small btn-danger ml-10" onClick={() => { handleDelete(channel) }}> Delete</button>

                      </td>
                    </tr>
                    {channel.isAccordionOpen && (
                      <tr className="accordion-content channel-accordion">
                        <td colSpan="3">
                          <div className="accordion-header">
                            <button
                              className="close-button"
                              onClick={() => handleAccordionToggle(channel.channelId)}
                            >
                              x
                            </button>
                          </div>
                          <Form>
                            <Form.Group controlId="channelName">
                              <Form.Label>Channel name</Form.Label>
                              <Form.Control type="text" 
                                ref={channelNames}
                                defaultValue={selectedChannel.channelName}
                                />
                            </Form.Group>
                            <br />
                            <Form.Group>
                              <Form.Label>Channel Type</Form.Label>
                              <select
                                className='form-select form-select-solid'
                                data-kt-select2='true'
                                data-placeholder='Select option'
                                data-allow-clear='true'
                                ref={channelTypes}
                                required
                              >
                                <option value="">Select</option>
                                {dropdownData && dropdownData.dropdownData && dropdownData.dropdownData.length > 0 &&
                                  dropdownData.dropdownData.map((item) => (
                                    <option
                                      key={item.dataID}
                                      value={item.dataID}
                                    >
                                      {item.dataValue}
                                    </option>
                                  ))}
                              </select>
                            </Form.Group>
                            <br />
                            <Form.Group controlId="channelDescription">
                              <Form.Label>Channel description</Form.Label>
                              <Form.Control as="textarea"
                                ref={channelDescriptions}
                                rows={3}
                                defaultValue={selectedChannel.channelDescription}
                                />
                            </Form.Group>
                            <Form.Group className="mt-5">
                              <Button
                                variant="secondary"
                                className="btn-small"
                                onClick={() => handleAccordionToggle(channel.channelId)}
                              >
                                Close
                              </Button>
                              <Button
                                variant="primary"
                                className="btn-small"
                                onClick={() => handleSave(channel.channelId)}
                              >
                                Save
                              </Button>

                            </Form.Group>
                          </Form>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>

            </table>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export { ChannelsPage };
