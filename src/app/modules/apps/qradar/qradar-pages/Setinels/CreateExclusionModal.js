import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { notify, notifyFail } from "../components/notification/Notification";
import {
  fetchAddToExclusionListUrl,
  fetchSentinelOneAlert,
} from "../../../../../api/AlertsApi";

const CreateExclusionModal = ({ show, handleClose }) => {
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
      const responseData = await fetchAddToExclusionListUrl(data);
      const { isSuccess } = responseData;

      if (isSuccess) {
        notify("Add To Exclusions Applied");
      } else {
        notifyFail("Add To Exclusions Applied");
      }
      handleClose();
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };
  return (
    <Modal show={show} onHide={handleClose} className="AddToExclusionsModal">
      <Modal.Header closeButton>
        <Modal.Title>New Exclusions</Modal.Title>
      </Modal.Header>
      <Modal.Body className="header-filter">
        <div className="mb-2 fs-12">
          <label className="semi-bold">Exclusions Type:</label> Hash
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
        <Button
          variant="secondary"
          className="btn btn-small"
          onClick={handleClose}
        >
          Close
        </Button>
        <Button
          variant="primary"
          className="btn btn-small btn-new"
          onClick={handleSubmit}
        >
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateExclusionModal;
