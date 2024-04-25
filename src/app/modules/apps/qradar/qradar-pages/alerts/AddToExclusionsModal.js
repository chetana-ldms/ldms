import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { notify, notifyFail } from "../components/notification/Notification";
import {
  fetchAddToExclusionListUrl,
  fetchSentinelOneAlert,
} from "../../../../../api/AlertsApi";

const AddToExclusionsModal = ({
  show,
  handleClose,
  handleAction,
  selectedValue,
  selectedAlert,
  refreshParent,
}) => {
  const data = { selectedValue, selectedAlert };
  const value = data.selectedValue;
  const AlertId = data.selectedAlert;
  console.log(data, "data");
  const osDropdownRef = useRef(null);
  const scopeDropdownRef = useRef(null);
  const sha1InputRef = useRef(null);
  const descriptionTextareaRef = useRef(null);
  const orgId = Number(sessionStorage.getItem("orgId"));
  const [sentinalOne, setSentinalOne] = useState([]);
  console.log(sentinalOne, "sentinalOne");
  const [endpointInfo, setEndpointInfo] = useState([
    {
      osVersion: "",
    },
  ]);
  console.log(endpointInfo, "endpointInfo");
  const [threatInfo, setThreatInfo] = useState([]);
  console.log(threatInfo, "threatInfo");
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (AlertId.length > 0 && AlertId.length < 2) {
          const sentinalOneDetails = await fetchSentinelOneAlert(AlertId);
          setSentinalOne(sentinalOneDetails);
          const endpoint_Info = sentinalOneDetails.endpoint_Info;
          setEndpointInfo(endpoint_Info);
          const threatInfo = sentinalOneDetails.threatInfo;
          setThreatInfo(threatInfo);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [AlertId]);
  const handleSubmit = async () => {
    try {
      const data = {
        orgID: orgId,
        alertIds: selectedAlert,
        targetScope: scopeDropdownRef.current.value,
        // externalTicketId: "string",
        description: descriptionTextareaRef.current.value,
        // note: descriptionTextareaRef.current.value
      };
      const responseData = await fetchAddToExclusionListUrl(data);
      const { isSuccess, message } = responseData;

      if (isSuccess) {
        notify(message);
        handleClose();
        refreshParent();
      } else {
        notifyFail(message);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };
  return (
    <Modal show={show} onHide={handleClose} className="AddToExclusionsModal">
      <Modal.Header closeButton>
        <Modal.Title>Add To Exclusions</Modal.Title>
        <button
          type="button"
          class="application-modal-close"
          aria-label="Close"
        >
          <i className="fa fa-close" />
        </button>
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
            {AlertId.length > 1 ? (
              <p className="p-3">According to selected Threats</p>
            ) : (
              <select
                className="form-select"
                id="osInput"
                value={endpointInfo?.osVersion}
                disabled
              >
                <option value={endpointInfo?.osVersion}>
                  {endpointInfo?.osVersion}
                </option>
              </select>
            )}
          </div>
          <div className="col-md-4">
            <label htmlFor="osDropdown" className="form-label">
              {" "}
              Scope
            </label>
            <select
              ref={scopeDropdownRef}
              className="form-select"
              id="scopeDropdown"
            >
              <option value="group">Group</option>
              <option value="account">Account</option>
              <option value="site">Site</option>
            </select>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-6">
            <div>
              <label className="form-label" htmlFor="sha1Input">
                SHA1:
              </label>
              {AlertId.length > 1 ? (
                <p className="pt-5">According to selected Threats</p>
              ) : (
                <input
                  type="text"
                  className="form-control"
                  // ref={sha1InputRef}
                  value={threatInfo?.shA1}
                  disabled
                />
              )}
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
        <div className="mt-5">
          <span className="semi-bold">Analyst Verdict:</span> False Positive
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} className="btn-small">
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          className="btn-small btn-new"
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddToExclusionsModal;
