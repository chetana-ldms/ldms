import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { notify, notifyFail } from "../components/notification/Notification";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { fetchAddToExclusionListUrl } from "../../../../../api/SentinalApi";

const CreateExclusionModal = ({ show, onClose, refreshParent }) => {
  const osDropdownRef = useRef(null);
  const descriptionTextareaRef = useRef(null);
  const sha1InputRef = useRef(null);
  const orgId = Number(sessionStorage.getItem("orgId"));
  const createdDate = new Date().toISOString();
  const createdUserId = Number(sessionStorage.getItem("userId"));
  const accountId = sessionStorage.getItem("accountId");
  const siteId = sessionStorage.getItem("siteId");
  const groupId = sessionStorage.getItem("groupId");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Hash");
  const [includeSubfolders, setIncludeSubfolders] = useState(false);
  const [changeEnabled, setChangeEnabled] = useState(false);
  const [excludeAlerts, setExcludeAlerts] = useState(true);
  const [excludeBinaryVault, setExcludeBinaryVault] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!excludeAlerts && !excludeBinaryVault) {
        setError(true);
        notifyFail("You must select one or more Exclusion Function");
        return;
      }

      if (!osDropdownRef.current.value || !sha1InputRef.current.value) {
        setError(false);
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
        note: "string",
        targetScope: "Group",
        pathExclusionType: "",
        externelTicketId: "string",
        mode: "string",
        type: "string",
      };

      const responseData = await fetchAddToExclusionListUrl(data);
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

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDropdownItemClick = (value) => {
    setSelectedValue(value);
    setDropdownOpen(false);
  };

  const handleToggleChange = () => {
    if (changeEnabled) {
      setIncludeSubfolders(!includeSubfolders);
    }
  };

  const handleToggleEnabled = () => {
    setChangeEnabled(!changeEnabled);
  };

  const handleCheckboxChange = (e, checkboxType) => {
    const isChecked = e.target.checked;
    if (checkboxType === "excludeAlerts") {
      setExcludeAlerts(isChecked);
    } else if (checkboxType === "excludeBinaryVault") {
      setExcludeBinaryVault(isChecked);
    }
    setError(!(isChecked || excludeBinaryVault));
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      className="AddToExclusionsModal application-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>New Exclusions</Modal.Title>
        <button
          type="button"
          class="application-modal-close"
          aria-label="Close"
        >
          <i className="fa fa-close" />
        </button>
      </Modal.Header>
      <Modal.Body className="header-filter">
        <div className="mb-2 fs-12 d-flex align-items-center">
          <label className="semi-bold me-2">Exclusions Type:</label>
          <Dropdown isOpen={dropdownOpen} toggle={handleDropdownToggle}>
            <DropdownToggle className="btn btn-small btn-border">
              {selectedValue} <i className="fa fa-chevron-down" />
            </DropdownToggle>
            <DropdownMenu className="w-auto">
              <DropdownItem
                onClick={() => handleDropdownItemClick("Hash")}
                className="border-btm"
              >
                Hash
              </DropdownItem>
              <DropdownItem onClick={() => handleDropdownItemClick("Path")}>
                Path
              </DropdownItem>
              <DropdownItem
                onClick={() => handleDropdownItemClick("Certificate")}
              >
                Certificate
              </DropdownItem>
              <DropdownItem
                onClick={() => handleDropdownItemClick("File Type")}
              >
                File Type
              </DropdownItem>
              <DropdownItem onClick={() => handleDropdownItemClick("Browser")}>
                Browser
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="row">
          <div className="col-md-4">
            <label htmlFor="osInput" className="form-label">
              OS*
            </label>
            <select
              className="form-select"
              id="osInput"
              ref={osDropdownRef}
              required
            >
              <option value="">Select</option>
              <option value="windows">Windows</option>
              <option value="macos">MacOS</option>
              <option value="linux">Linux</option>
            </select>
          </div>
        </div>
        {selectedValue == "Hash" && (
          <div className="row mt-5 mb-5">
            <div className="col-md-10">
              <div>
                <label className="form-label" htmlFor="sha1Input">
                  SHA1*
                </label>
                <input
                  type="text"
                  className="form-control"
                  ref={sha1InputRef}
                  required
                />
              </div>
            </div>
            <div className="link col-md-2">
              <span className="inline-block threat-search float-right">
                <i className="bi bi-search text-primary mr-2"></i> Threat
              </span>
            </div>
          </div>
        )}
        {selectedValue == "Path" && (
          <div className="row mt-5">
            <div className="col-md-10">
              <div>
                <label className="form-label" htmlFor="sha1Input">
                  Path*
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Example: /bin/file or /bin/"
                  ref={sha1InputRef}
                  required
                />
              </div>
            </div>
            <div className="link col-md-2">
              <span className="inline-block threat-search">
                <i className="bi bi-search text-primary mr-2"></i> Threat
              </span>
            </div>

            <div>
              <div className="mt-2 mb-2">
                <span>As File</span>{" "}
                <span onClick={handleToggleEnabled} className="link">
                  Change
                </span>
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={includeSubfolders}
                  onChange={handleToggleChange}
                  disabled={!changeEnabled}
                  className="me-2 v-middle"
                />
                <label>Include Subfolders</label>
              </div>
            </div>
            <hr />
            <div>
              <p>Exclusion Function</p>
              <div>
                <input
                  type="checkbox"
                  checked={excludeAlerts}
                  onChange={(e) => handleCheckboxChange(e, "excludeAlerts")}
                  className="me-2 v-middle"
                />
                <label>Exclude path for alerts and mitigation</label>
              </div>
              <p>
                The selected Exclusion Mode (Suppress Alerts, Interoperability,
                or Performance Focus) applies to files in the path
              </p>
              <div>
                <input
                  type="checkbox"
                  checked={excludeBinaryVault}
                  onChange={(e) =>
                    handleCheckboxChange(e, "excludeBinaryVault")
                  }
                  className="me-2 v-middle"
                />
                <label>Exclude path for Binary Vault</label>
              </div>
              <p>Files in the path are not uploaded automatically</p>
              {error && (
                <p className="no-margin red">
                  You must select one or more Exclusion Function
                </p>
              )}
            </div>
          </div>
        )}
        {selectedValue == "Certificate" && (
          <div className="row mt-5">
            <div className="col-md-9">
              <div>
                <label className="form-label" htmlFor="sha1Input">
                  Signer Identity*
                </label>
                <input
                  type="text"
                  className="form-control"
                  ref={sha1InputRef}
                  required
                />
              </div>
            </div>
            <div className="link col-md-2">
              <span className="inline-block threat-search">
                <i className="bi bi-search text-primary mr-2"></i> Threat
              </span>
            </div>
            <div className="mt-5">
              <h5>About Signer Identity:</h5>
              <p>1. Go to the Incidents page and select the relevant threat</p>
              <p>2. Copy the Signer Identity value</p>
              <p>3. Paste in the Signer Identity field in the exclusion</p>
            </div>
          </div>
        )}
        {selectedValue == "File Type" && (
          <div className="row mt-5">
            <div className="col-md-9">
              <div>
                <label className="form-label" htmlFor="sha1Input">
                  File Type
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Example: txt"
                  ref={sha1InputRef}
                  required
                />
              </div>
            </div>
            <div className="link col-md-2">
              <span className="inline-block threat-search">
                <i className="bi bi-search text-primary mr-2"></i> Threat
              </span>
            </div>
            <div className="mt-5">
              <p>Exclusion Function</p>
              <div>
                <input
                  type="checkbox"
                  checked={excludeAlerts}
                  onChange={(e) => handleCheckboxChange(e, "excludeAlerts")}
                  className="me-2 v-middle"
                />
                <label className="mb-0">
                  Exclude file type for alerts and mitigation
                </label>
                <p className="px-5 gray">
                  Alerts and mitigation are suppressed for files of this type
                </p>
              </div>

              <div>
                <input
                  type="checkbox"
                  checked={excludeBinaryVault}
                  onChange={(e) =>
                    handleCheckboxChange(e, "excludeBinaryVault")
                  }
                  className="me-2 v-middle"
                />
                <label className="mb-0">
                  Exclude file type for Binary Vault
                </label>
                <p className="px-5 gray">
                  Files of this type are not uploaded automatically
                </p>
              </div>

              {error && (
                <p className="no-margin red">
                  You must select one or more Exclusion Function
                </p>
              )}
            </div>
          </div>
        )}
        {selectedValue == "Browser" && (
          <div className="row mt-5 mb-5">
            <label htmlFor="browserInput" className="form-label">
              Browser*
            </label>
            <select
              className="form-select"
              id="browserInput"
              ref={osDropdownRef}
              required
            >
              <option value="">Select</option>
              <option value="firefox">Firefox</option>
              <option value="edge">Edge</option>
              <option value="internet explorer">Internet Explorer</option>
              <option value="chrome">Chrome</option>
            </select>
          </div>
        )}
        <div className="mt-1">
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

export default CreateExclusionModal;
