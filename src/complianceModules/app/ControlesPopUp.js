import React from "react";
import { Modal, Button } from "react-bootstrap";

const ControlesPopUp = ({ showModal, setShowModal, selectedItem }) => {
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
            {/* <p>Description: {selectedItem.description}</p>
            <p>Icons: {selectedItem.icons.join(", ")}</p> */}
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
