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
  const signerInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const pathInputRef = useRef(null);
  const orgId = Number(sessionStorage.getItem("orgId"));
  const createdDate = new Date().toISOString();
  const createdUserId = Number(sessionStorage.getItem("userId"));
  const accountId = sessionStorage.getItem("accountId");
  const siteId = sessionStorage.getItem("siteId");
  const groupId = sessionStorage.getItem("groupId");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isCustomDropdownOpen, setIsCustomDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Hash");
  const [customSelectedValue, setCustomSelectedValue] = useState("All engines");
  const [includeSubfolders, setIncludeSubfolders] = useState(false);
  const [changeEnabled, setChangeEnabled] = useState(false);
  const [excludeAlerts, setExcludeAlerts] = useState(false);
  const [excludeBinaryVault, setExcludeBinaryVault] = useState(false);
  const [excludeAlertsFile, setExcludeAlertsFile] = useState(false);
  const [excludeBinaryVaultFile, setExcludeBinaryVaultFile] = useState(false);
  const [error, setError] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("suppressAlerts");
  const [actions, setActions] = useState([]);
  const browserDropdownRef = useRef(null);

  const handleSubmit = async () => {
    try {
      if (selectedValue === "Path") {
        if (!pathInputRef.current.value) {
          notifyFail("Please fill Path.");
          return;
        }
      }
      if (selectedValue === "Hash") {
        if (!sha1InputRef.current.value) {
          notifyFail("Please fill Sha1.");
          return;
        }
      }
      if (selectedValue === "Certificate") {
        if (!signerInputRef.current.value) {
          notifyFail("Please fill Signer Identity.");
          return;
        }
      }
      if (selectedValue === "File Type") {
        if (!fileInputRef.current.value) {
          setError(true);
          notifyFail("Please fill File Type.");
          return;
        }
      }
      if (selectedValue === "File Type") {
        if (!excludeAlertsFile && !excludeBinaryVaultFile) {
          notifyFail("You must select one or more Exclusion Function");
          return;
        }
      }
      if (selectedValue === "Path") {
        if (!excludeAlerts && !excludeBinaryVault) {
          notifyFail("You must select one or more Exclusion Function");
          setError(true);
          return;
        }
      }
      if (!osDropdownRef.current.value) {
        setError(false);
        notifyFail("Please fill out all mandatory fields.");
        return;
      }
      let data = null;
      if (selectedValue === "Hash") {
        data = {
          orgID: orgId,
          osType: osDropdownRef.current.value,
          value: sha1InputRef.current.value,
          description: descriptionTextareaRef.current.value,
          createdDate: createdDate,
          createdUserId: createdUserId,
          type: "white_hash",
          groupId: groupId || "",
          siteId: siteId || "",
          accountId: accountId || "",
        };
      } else if (selectedValue === "Certificate") {
        data = {
          orgID: orgId,
          osType: osDropdownRef.current.value,
          value: signerInputRef.current.value,
          description: descriptionTextareaRef.current.value,
          createdDate: createdDate,
          createdUserId: createdUserId,
          type: "certificate",
          groupId: groupId || "",
          siteId: siteId || "",
          accountId: accountId || "",
        };
      } else if (selectedValue === "File Type") {
        data = {
          orgID: orgId,
          osType: osDropdownRef.current.value,
          value: fileInputRef.current.value,
          description: descriptionTextareaRef.current.value,
          createdDate: createdDate,
          createdUserId: createdUserId,
          type: "file_type",
          groupId: groupId || "",
          siteId: siteId || "",
          accountId: accountId || "",
          actions: actions,
        };
      } else if (selectedValue === "Browser") {
        data = {
          orgID: orgId,
          osType: osDropdownRef.current.value,
          value: browserDropdownRef.current.value,
          description: descriptionTextareaRef.current.value,
          createdDate: createdDate,
          createdUserId: createdUserId,
          type: "browser",
          groupId: groupId || "",
          siteId: siteId || "",
          accountId: accountId || "",
        };
      } else if (selectedValue === "Path") {
        let pathExclusionType = "file";
        if (changeEnabled && includeSubfolders) {
          pathExclusionType = "subfolders";
        } else if (changeEnabled) {
          pathExclusionType = "folder";
        }
        let mode;
        switch (selectedOption) {
          case "suppressAlerts":
            mode = "suppress";
            break;
          case "interoperability":
            mode = "disable_all_monitors";
            break;
          case "interoperabilityExtended":
            mode = "disable_all_monitors_deep";
            break;
          case "performanceFocus":
            mode = "disable_in_process_monitor";
            break;
          case "performanceFocusExtended":
            mode = "disable_in_process_monitor_deep";
            break;
          default:
            mode = "suppress";
        }
        data = {
          orgID: orgId,
          osType: osDropdownRef.current.value,
          value: pathInputRef.current.value,
          description: descriptionTextareaRef.current.value,
          createdDate: createdDate,
          createdUserId: createdUserId,
          type: "path",
          groupId: groupId || "",
          siteId: siteId || "",
          accountId: accountId || "",
          actions: actions,
          pathExclusionType,
          // mode,
        };
      } else {
        return;
      }
      if (data) {
        const responseData = await fetchAddToExclusionListUrl(data);
        const { isSuccess, message } = responseData;

        if (isSuccess) {
          notify(message);
          onClose();
          refreshParent();
        } else {
          notifyFail(message);
        }
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

  const handleToggleChange = (e) => {
    setIncludeSubfolders(e.target.checked);
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
    setActions((prevActions) => {
      let updatedActions = new Set(prevActions);

      if (isChecked) {
        if (checkboxType === "excludeAlerts") {
          updatedActions.add("upload");
        } else if (checkboxType === "excludeBinaryVault") {
          updatedActions.add("detect");
        }
      } else {
        if (checkboxType === "excludeAlerts") {
          updatedActions.delete("upload");
        } else if (checkboxType === "excludeBinaryVault") {
          updatedActions.delete("detect");
        }
      }
      return Array.from(updatedActions);
      setError(!(isChecked || excludeBinaryVault));
    });
  };
  const handleCheckboxChangeFile = (e, checkboxType) => {
    const isChecked = e.target.checked;

    if (checkboxType === "excludeAlertsFile") {
      setExcludeAlertsFile(isChecked);
    } else if (checkboxType === "excludeBinaryVaultFile") {
      setExcludeBinaryVaultFile(isChecked);
    }
    setActions((prevActions) => {
      let updatedActions = new Set(prevActions);

      if (isChecked) {
        if (checkboxType === "excludeAlertsFile") {
          updatedActions.add("upload");
        } else if (checkboxType === "excludeBinaryVaultFile") {
          updatedActions.add("detect");
        }
      } else {
        if (checkboxType === "excludeAlertsFile") {
          updatedActions.delete("upload");
        } else if (checkboxType === "excludeBinaryVaultFile") {
          updatedActions.delete("detect");
        }
      }
      return Array.from(updatedActions);
      setError(!(isChecked || excludeBinaryVault));
    });
  };

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleCustomDropdownItemClick = (value) => {
    setCustomSelectedValue(value);
    setIsCustomDropdownOpen(false);
  };
  const toggleCustomDropdown = () => {
    setIsCustomDropdownOpen(!isCustomDropdownOpen);
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

        {selectedValue == "Browser" && (
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
              </select>
            </div>
          </div>
        )}

        {selectedValue !== "Browser" && (
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
        )}

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
                  ref={pathInputRef}
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
                {!changeEnabled ? (
                  <span>As File </span>
                ) : (
                  <span>As Folder </span>
                )}
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
            </div>
            <div className="border-top pt-5">
              <div className="d-flex justify-content-between mb-5">
                <div>Exclusions Mode : {selectedOption}</div>
                <div className="pointer link" onClick={toggleAccordion}>
                  More Options <i className="fa fa-chevron-down link" />
                </div>
              </div>
              {isAccordionOpen && (
                <div className="accordion-content">
                  <div>
                    <div className="clearfix">
                      <div className="float-left">
                        <input
                          type="radio"
                          id="suppressAlerts"
                          name="exclusionMode"
                          value="suppressAlerts"
                          checked={selectedOption === "suppressAlerts"}
                          onChange={handleOptionChange}
                          className="v-middle me-2"
                        />
                        <label
                          htmlFor="suppressAlerts"
                          className="semi-bold no-margin"
                        >
                          Suppress Alerts
                        </label>
                        <span> | </span>
                      </div>
                      {selectedOption === "suppressAlerts" && (
                        <div className="float-left">
                          <label className="me-2 float-left ps-2">
                            {" "}
                            Engines:
                          </label>
                          <Dropdown
                            isOpen={isCustomDropdownOpen}
                            toggle={toggleCustomDropdown}
                            className="float-left"
                          >
                            <DropdownToggle className="no-btn no-pad no-bg link mb-1">
                              {customSelectedValue}{" "}
                              <i className="fa fa-chevron-down" />
                            </DropdownToggle>
                            <DropdownMenu className="w-auto">
                              <DropdownItem
                                onClick={() =>
                                  handleCustomDropdownItemClick("Static AI")
                                }
                                className="border-btm"
                              >
                                <h6>Static AI</h6>
                                <div>
                                  Suppress alerts from the Deep File Inspection
                                  engines
                                </div>
                              </DropdownItem>
                              <DropdownItem
                                onClick={() =>
                                  handleCustomDropdownItemClick("Dynamic AI")
                                }
                              >
                                <h6>Dynamic AI</h6>
                                <div className="wrap-txt">
                                  Suppress alerts raised by: Behavioral AI,
                                  Documents, Scripts, Lateral Movement, Anti
                                  Exploitation/Fileless, Potentially Unwanted
                                  Applications, Application Control.
                                </div>
                              </DropdownItem>
                              <DropdownItem
                                onClick={() =>
                                  handleCustomDropdownItemClick("All engines")
                                }
                              >
                                <h6>All engines</h6>
                                <div>Suppress all alerts</div>
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      )}
                      <div className="clearfix" />
                      <p className="gray fs-12 ms-6">
                        Do not display alerts on processes.
                      </p>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="interoperability"
                        name="exclusionMode"
                        value="interoperability"
                        checked={selectedOption === "interoperability"}
                        onChange={handleOptionChange}
                        className="v-middle me-2"
                      />
                      <label
                        htmlFor="interoperability"
                        className="no-margin semi-bold"
                      >
                        Interoperability
                      </label>
                      <p className="gray fs-12 ms-6">
                        Reduce the monitoring level on the processes. Usage
                        example: to solve interoperability. Important: lowers
                        protection.
                      </p>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="interoperabilityExtended"
                        name="exclusionMode"
                        value="interoperabilityExtended"
                        checked={selectedOption === "interoperabilityExtended"}
                        onChange={handleOptionChange}
                        className="v-middle me-2"
                      />
                      <label
                        htmlFor="interoperabilityExtended"
                        className="no-margin semi-bold"
                      >
                        Interoperability - extended
                      </label>
                      <p className="gray fs-12 ms-6">
                        Reduce the monitoring level of the processes, and their
                        child-processes. Usage example: to solve
                        interoperability. Important: lowers protection.
                      </p>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="performanceFocus"
                        name="exclusionMode"
                        value="performanceFocus"
                        checked={selectedOption === "performanceFocus"}
                        onChange={handleOptionChange}
                        className="v-middle me-2"
                      />
                      <label
                        htmlFor="performanceFocus"
                        className="no-margin semi-bold"
                      >
                        Performance Focus
                      </label>
                      <p className="gray fs-12 ms-6 no-margin">
                        Disable monitoring of the processes.
                      </p>
                      <p className="gray fs-12 ms-6">
                        Usage example: to solve performance issues related to
                        these processes. Important: Significantly lowers
                        protection.
                      </p>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="performanceFocusExtended"
                        name="exclusionMode"
                        value="performanceFocusExtended"
                        checked={selectedOption === "performanceFocusExtended"}
                        onChange={handleOptionChange}
                        className="v-middle me-2"
                      />
                      <label
                        htmlFor="performanceFocusExtended"
                        className="no-margin semi-bold"
                      >
                        Performance Focus - extended
                      </label>
                      <p className="gray fs-12 ms-6 no-margin">
                        Disable monitoring of the processes, and their
                        child-processes.
                      </p>
                      <p className="gray fs-12 ms-6">
                        Usage example: to solve performance issues related to
                        these processes. Important: Significantly lowers
                        protection.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <hr />
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
                  ref={signerInputRef}
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
                  File Type*
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Example: txt"
                  ref={fileInputRef}
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
                  checked={excludeAlertsFile}
                  onChange={(e) =>
                    handleCheckboxChangeFile(e, "excludeAlertsFile")
                  }
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
                  checked={excludeBinaryVaultFile}
                  onChange={(e) =>
                    handleCheckboxChangeFile(e, "excludeBinaryVaultFile")
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
            </div>
          </div>
        )}
        {selectedValue === "Browser" && (
          <div className="row mt-5 mb-5">
            <label htmlFor="browserInput" className="form-label">
              Browser*
            </label>
            <select
              className="form-select"
              id="browserInput"
              ref={browserDropdownRef}
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
