import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { notify, notifyFail } from "../components/notification/Notification";
import {
  fetchAddToblockListUrl,
  fetchSentinelOneAlert,
} from "../../../../../api/AlertsApi";

const BlockListPopUp = ({ show, onClose }) => {
  const osDropdownRef = useRef(null);
  const descriptionTextareaRef = useRef(null);
  const sha1InputRef = useRef(null);
  const orgId = Number(sessionStorage.getItem("orgId"));
  const handleSubmit = async () => {
    try {
      const data = {
        orgID: orgId,
        os: osDropdownRef.current.value,
        sha1: sha1InputRef.current.value,
        description: descriptionTextareaRef.current.value,
      };
      const responseData = await fetchAddToblockListUrl(data);
      const { isSuccess } = responseData;

      if (isSuccess) {
        notify("File added to blocked list");
      } else {
        notifyFail("File added to blocked list Failed");
      }
      onClose();
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };
  return (
    <Modal
      show={show}
      onHide={onClose}
      className="addToBlockList application-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <div>
            {" "}
            <i className="bi bi-shield-slash mr-2 white"></i> Add To Blocklist
          </div>
        </Modal.Title>
        <button
          type="button"
          class="application-modal-close"
          aria-label="Close"
        >
          <i className="fa fa-close" />
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-5">
          <b>Blacklist Type : </b> Hash
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="osInput" className="form-label">
              OS
            </label>

            <select className="form-select" id="osInput" ref={osDropdownRef}>
              <option value="">Select</option>
              <option value="windows">windows</option>
              <option value="Mac">Mac</option>
              <option value="Linux">Linux</option>
            </select>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-6">
            <div>
              <label className="form-label" htmlFor="sha1Input">
                SHA1:
              </label>
              <input type="text" className="form-control" ref={sha1InputRef} />
            </div>
          </div>
          <div className="col-md-3  text-primary d-flex align-items-end justify-content-end pb-3 ">
            <i className="bi bi-search text-primary mr-2"></i> Threat |
          </div>
          <div className="col-md-3  text-primary d-flex align-items-end pb-3 justify-content-start">
            {" "}
            <i className="bi bi-search text-primary mr-2"></i>Deep Visibility
          </div>
        </div>
        <div className="mt-5">
          <label className="form-label">Description</label>
          <textarea
            ref={descriptionTextareaRef}
            rows="1"
            className="form-control"
            placeholder="Add Description or Leave empty"
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="btn btn-small btn-secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="btn btn-new btn-small" onClick={handleSubmit}>
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default BlockListPopUp;
