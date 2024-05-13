import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { notify, notifyFail } from "../components/notification/Notification";
import {
  fetchAddToblockListUrl,
  fetchSentinelOneAlert,
} from "../../../../../api/AlertsApi";

const AddToBlockListModal = ({
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
  console.log(AlertId, "AlertId");
  const osDropdownRef = useRef(null);
  const scopeDropdownRef = useRef(null);
  const sha1InputRef = useRef(null);
  const descriptionTextareaRef = useRef(null);
  const orgId = Number(sessionStorage.getItem("orgId"));
  const userID = Number(sessionStorage.getItem("userId"));
  const modifiedDate = new Date().toISOString();
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
        modifiedDate: modifiedDate,
        modifiedUserId: userID,
        orgID: orgId,
        alertIds: selectedAlert,
        targetScope: scopeDropdownRef.current.value,
        description: descriptionTextareaRef.current.value,
        note: descriptionTextareaRef.current.value,
        analystVerdict_TruePositive: true
      };
      const responseData = await fetchAddToblockListUrl(data);
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
    <Modal
      show={show}
      onHide={handleClose}
      className="addToBlockList application-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <button
            type="button"
            class="application-modal-close"
            aria-label="Close"
          >
            <i className="fa fa-close" />
          </button>
          <div>
            {" "}
            <i className="bi bi-shield-slash mr-2"></i> Add To Blocklist
          </div>
          <div className="white fs-11 ms-8">Blocklist Type: Hash</div>
        </Modal.Title>
        <br />
      </Modal.Header>
      <Modal.Body className="header-filter">
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
        <div className="mt-5">Analyst Verdict: True Positive</div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          className=" btn-small"
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          className="btn-new btn-small"
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default AddToBlockListModal;
