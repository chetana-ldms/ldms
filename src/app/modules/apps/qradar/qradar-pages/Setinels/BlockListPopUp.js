import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { notify, notifyFail } from "../components/notification/Notification";
import { fetchAddToblockListUrl } from "../../../../../api/SentinalApi";

const BlockListPopUp = ({ show, onClose, refreshParent }) => {
  const osDropdownRef = useRef(null);
  const descriptionTextareaRef = useRef(null);
  const sha1InputRef = useRef(null);
  const orgId = Number(sessionStorage.getItem("orgId"));
  const createdDate = new Date().toISOString();
  const createdUserId = Number(sessionStorage.getItem('userId'));
  const accountId =sessionStorage.getItem('accountId');
  const siteId = sessionStorage.getItem('siteId');
  const groupId = sessionStorage.getItem('groupId');

  const handleSubmit = async () => {
    try {
      if (!osDropdownRef.current.value || !sha1InputRef.current.value) {
        notifyFail("Please fill out all mandatory fields.");
        return;
      }

      const data = {
        orgID: orgId,
        osType: osDropdownRef.current.value,
        value: sha1InputRef.current.value,
        description: descriptionTextareaRef.current.value,
        source: "",
        createdDate: createdDate,
        createdUserId: createdUserId,
        groupId: groupId,
        siteId: siteId,
        accountId: accountId
      };
      const responseData = await fetchAddToblockListUrl(data);
      const { isSuccess, message } = responseData;

      if (isSuccess) {
        notify(message);
        onClose();
        refreshParent();
      } else {
        notifyFail(message);
      }
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
          <b>Blocklist Type : </b> Hash
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="osInput" className="form-label">
              OS*
            </label>
            <select className="form-select" id="osInput" ref={osDropdownRef} required>
              <option value="">Select</option>
              <option value="windows">Windows</option>
              <option value="macos">MacOS</option>
              <option value="linux">Linux</option>
            </select>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-6">
            <div>
              <label className="form-label" htmlFor="sha1Input">
                SHA1*
              </label>
              <input type="text" className="form-control" ref={sha1InputRef} required />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <label className="form-label">Description</label>
          <textarea
            ref={descriptionTextareaRef}
            rows="1"
            className="form-control"
            maxLength={4000}
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
