// EndpointPopup.js
import React, { useState } from 'react';
import { Modal, Button, Nav, Tab } from 'react-bootstrap';
import General from './General';
import App from './App';
import Inventory from './Inventory';
import TasksApplication from './TasksApplication';
import Updates from './Updates';
import Tags from './Tags';
import RisksComponent from './RisksComponent';
import InventoryComponent from './InventoryComponent';

const EndpointPopup = ({ endpointName, showModal, setShowModal }) => {
    const [activeTab, setActiveTab] = useState("general");

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{endpointName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="row">
        <div className="col-md-12">
          <div className="d-flex border-btm mg-btm-10 mg-top-10">
            <ul className="nav nav-tabs p-0 border-0 fs-12">
              <li className="nav-item text-center">
                <a
                  className={`nav-link normal pointer ${
                    activeTab === "general" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("general")}
                >
                  General
                </a>
              </li>
              <li className="nav-item text-center">
                <a
                  className={`nav-link normal pointer ${
                    activeTab === "app" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("app")}
                >
                  App
                </a>
              </li>
              <li className="nav-item text-center">
                <a
                  className={`nav-link normal pointer ${
                    activeTab === "inventory" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("inventory")}
                >
                 Inventory
                </a>
              </li>
              <li className="nav-item text-center">
                <a
                  className={`nav-link normal pointer ${
                    activeTab === "tasks" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("tasks")}
                >
                  Tasks
                </a>
              </li>
              <li className="nav-item text-center">
                <a
                  className={`nav-link normal pointer ${
                    activeTab === "updates" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("updates")}
                >
                  Updates
                </a>
              </li>
              <li className="nav-item text-center">
                <a
                  className={`nav-link normal pointer ${
                    activeTab === "tags" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("tags")}
                >
                  Tags
                </a>
              </li>
            </ul>
          </div>
          {activeTab === "general" && <General />}
          {activeTab === "app" &&  <App />}
          {activeTab === "inventory" && <Inventory/>}
          {activeTab === "tasks" && <TasksApplication/>} 
          {activeTab === "updates" && <Updates/>}
          {activeTab === "tags" && <Tags/>}
        </div>
      </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EndpointPopup;
