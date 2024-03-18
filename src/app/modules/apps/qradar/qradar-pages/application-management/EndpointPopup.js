// EndpointPopup.js
import React, { useState } from "react";
import { Modal, Button, Nav, Tab } from "react-bootstrap";
import General from "./General";
import Inventory from "./Inventory";
import TasksApplication from "./TasksApplication";
import Updates from "./Updates";
import Tags from "./Tags";

const EndpointPopup = ({ selectedEndpoint, showModal, setShowModal }) => {
  const [activeTab, setActiveTab] = useState("general");
  console.log(selectedEndpoint, "selectedEndpoint");
  const id = selectedEndpoint?.endpointId;

  return (
    <Modal
      className="application-modal"
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      <Modal.Header closeButton className="pad-10">
        <Modal.Title>{selectedEndpoint?.endpointName}</Modal.Title>
        <button
          type="button"
          class="application-modal-close"
          aria-label="Close"
        >
          <i className="fa fa-close" />
        </button>
      </Modal.Header>
      <Modal.Body className="pad-10">
        <div className="row">
          <div className="col-md-12">
            <div className="d-flex border-btm mg-btm-10 mg-top-10">
              <ul className="nav nav-tabs p-0 border-0 fs-14">
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
                      activeTab === "inventory" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("inventory")}
                  >
                    App Inventory
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
            {activeTab === "general" && <General id={id} />}
            {activeTab === "inventory" && <Inventory id={id} />}
            {activeTab === "tasks" && <TasksApplication id={id} />}
            {activeTab === "updates" && <Updates id={id} />}
            {activeTab === "tags" && <Tags id={id} />}
          </div>
        </div>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default EndpointPopup;
