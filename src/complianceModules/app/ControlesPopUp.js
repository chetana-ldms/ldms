import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import AddRequirementsPopUp from "./AddRequirementsPopUp";

const ControlesPopUp = ({ showModal, setShowModal, selectedItem }) => {
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleOpenSecondModal = () => {
    setShowSecondModal(true);
  };
  const handleAccordionToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const mappedRequirementsData = [
    {
      logo: "logo1",
      version: "CCM v4",
      count: 2,
      items: [
        {
          name: "STA-08",
          description: "Incident Responce plan: Breaches",
        },
        {
          name: "UEM-09",
          description: "Incident Reporting : Supply Chain coordination",
        },
      ],
    },
    {
      logo: "logo2",
      version: "CCM v5",
      count: 3,
      items: [
        {
          name: "STA-07",
          description: "Incident Responce plan: Breaches",
        },
        {
          name: "UEM-08",
          description: "Incident Reporting : Supply Chain coordination",
        },
      ],
    },
  ];

  return (
    <Modal
      className="compliance-modal"
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>3rd Party Remote-Access Usage</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedItem && (
          <>
            <div>
              <div className="card">
                <h2>CONTROL INFO</h2>
                <p className="bold no-margin">Name</p>
                <p>3rd Party Remote-Access Usage</p>
                <p className="bold no-margin">Code</p>
                <p>LDC-489</p>
                <p className="bold no-margin">Control Owner(s)</p>
                <p>
                  <span>AB</span> <span>Assurance lab</span>
                </p>
                <p className="bold no-margin">Control Readiness</p>
                <p>
                  <i className="fa fa-close" /> Not Ready
                </p>
                <p className="bold no-margin">Linked Workspaces</p>
                <p className="no-margin">
                  This is used to link control info and evidence across
                  workspaces.
                  <button className="btn btn-border btn-small mg-left-10">
                    Link workspaces
                  </button>
                </p>
                <p>No workspaces linked</p>
                <p className="bold no-margin">Description</p>
                <p>{selectedItem.description}</p>
                <p className="bold no-margin">Question</p>
                <p>Question Text goes here...</p>
              </div>
              <hr />
              <div className="card">
                <h2>
                  REQUIRED APPROVALS
                  <button className="float-right btn btn-border btn-small">
                    Set up
                  </button>
                </h2>
                <p>
                  Set up a process so readiness for this control will require
                  specific people to approve it.{" "}
                  <a href="">Learn about required approvals</a>
                </p>
              </div>
              <hr />
              <div className="card">
                <h2>
                  TASKS{" "}
                  <button className="float-right btn btn-border btn-small">
                    Create task
                  </button>
                </h2>

                <span>Showing 2 of 2</span>
              </div>
            </div>
            <hr />
            <div className="mt-5">
              <h2>MAPPED REQUIREMENTS</h2>
              {mappedRequirementsData.map((item, index) => (
                <div key={index} className="card mg-btm-10">
                  <div className="card-body">
                    <div
                      className="d-flex justify-content-between"
                      onClick={() => handleAccordionToggle(index)}
                      style={{ cursor: "pointer" }}
                    >
                      <div>
                        <p>
                          <span className="me-3">{item.logo}</span>
                          {item.version}{" "}
                          <span
                            className="ms-4 text-white initial"
                            style={{ lineHeight: "normal" }}
                          >
                            {" "}
                            {item.count}
                          </span>
                        </p>
                        <div>
                          {item.items.map((subItem, subIndex) => (
                            <span
                              key={subIndex}
                              className="bg-secondary p-2 me-2"
                            >
                              {subItem.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="">
                        <button
                          className="btn btn-small btn-primary"
                          onClick={handleOpenSecondModal}
                        >
                          add
                        </button>{" "}
                        <span>
                          {" "}
                          <i
                            className={`fas ${
                              activeIndex === index
                                ? "fa-chevron-down"
                                : "fa-chevron-right"
                            }`}
                          ></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  {activeIndex === index && (
                    <div
                      id={`kt_accordion_1_body_${index}`}
                      className="accordion-collapse collapse show"
                    >
                      <div className="accordion-body">
                        {item.items.map((subItem, subIndex) => (
                          <div key={subIndex} className="border-bottom">
                            <p>{subItem.name}</p>
                            <p>{subItem.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <AddRequirementsPopUp
              showSecondModal={showSecondModal}
              setShowSecondModal={setShowSecondModal}
            />
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ControlesPopUp;
