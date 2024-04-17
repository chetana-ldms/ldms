import React, { useEffect, useState } from "react";
import { fetchPolicyDetailsUrl } from "../../../../../api/SentinalApi";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { getCurrentTimeZone } from "../../../../../../utils/helper";

function Policy() {
  const orgId = Number(sessionStorage.getItem("orgId"));

  const [policy, setPolicy] = useState({
    mitigationMode: "",
    mitigationModeSuspicious: "",
    removeMacros: false,
    containment: false,
    engines: {
      reputation: false,
      staticAi: false,
      staticAiSuspicious: false,
      executables: false,
      documentScript: false,
      lateralMovement: false,
      exploits: false,
      applicationControl: false,
      alternativeThreats: false,
    },
    snapshotsOn: false,
    antiTamperingOn: false,
    scanNewAgents: false,
    signedDriverBlockingOn: false,
    agentLoggingOn: false,
    agentUi: {
      agentUiOn: false,
      threatPopUpNotifications: false,
      devicePopUpNotifications: false,
      showSuspicious: false,
      showAgentWarnings: false,
      maxEventAgeDays: false,
      showDeviceTab: false,
      showQuarantineTab: false,
      showSupport: false,
    },
    iocAttributes: {
      process: false,
      file: false,
      url: false,
      dns: false,
      ip: false,
      windowsEventLogs: false,
      registry: false,
      scheduledTask: false,
      behavioralIndicators: false,
      commandScripts: false,
      crossProcess: false,
      driver: false,
      dataMasking: false,
      smartFileMonitoring: false,
      autoInstallBrowserExtensions: false,
    },
    autoFileUpload: {
      enabled: false,
    },
    autoDecommissionOn: false,
    autoDecommissionDays: 0,
    removeMacros: false,
  });
  console.log(policy, "policy");
  const [loading, setLoading] = useState(false);

  const [deepVisibilityEnabled, setDeepVisibilityEnabled] = useState(false);

  const [autoDecommissionEnabled, setAutoDecommissionEnabled] = useState(false);

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setPolicy((prevPolicy) => ({
      ...prevPolicy,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPolicy((prevPolicy) => ({
      ...prevPolicy,
      [name]: checked,
    }));
  };
  const handleDetectionEngineChange = (engine) => {
    setPolicy((prevPolicy) => ({
      ...prevPolicy,
      engines: {
        ...prevPolicy.engines,
        [engine]: !prevPolicy.engines[engine],
      },
    }));
  };
  const handleAgentUiChange = (key) => {
    setPolicy((prevPolicy) => ({
      ...prevPolicy,
      agentUi: {
        ...prevPolicy.agentUi,
        [key]: !prevPolicy.agentUi[key],
      },
    }));
  };
  const handleIoCAttributeChange = (key) => {
    setPolicy((prevPolicy) => ({
      ...prevPolicy,
      iocAttributes: {
        ...prevPolicy.iocAttributes,
        [key]: !prevPolicy.iocAttributes[key],
      },
    }));
  };
  const handleAutoFileUploadChange = () => {
    setPolicy((prevPolicy) => ({
      ...prevPolicy,
      autoFileUpload: {
        ...prevPolicy.autoFileUpload,
        enabled: !prevPolicy.autoFileUpload.enabled,
      },
    }));
  };
  const handleAutoDecommissionChange = () => {
    setPolicy((prevPolicy) => ({
      ...prevPolicy,
      autoDecommissionOn: !prevPolicy.autoDecommissionOn,
    }));
  };

  const handleRemoteShellChange = () => {
    setPolicy((prevPolicy) => ({
      ...prevPolicy,
      removeMacros: !prevPolicy.removeMacros,
    }));
  };

  const fetchData = async () => {
    const data = {
      orgID: orgId,
      tenantPolicyScope: false,
      accountPolicyScope: true,
      sitePolicyScope: false,
      groupPolicyScope: false,
      scopeId: "1665272541043650534",
    };
    try {
      setLoading(true);
      const response = await fetchPolicyDetailsUrl(data);
      setPolicy(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="account-policy">
      {loading ? (
        <UsersListLoading />
      ) : (
        <>
          <div className="row">
            <div className="col-md-6">
              <p>
                <i className="fa fa-circle-exclamation incident-icon blue mg0right-5" />{" "}
                Last Modified at {getCurrentTimeZone(policy?.updatedAt)}
              </p>
            </div>
            <div className="col-md-6 d-flex justify-content-end">
              <p>Revert to default inherited policy</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-7">
              <div className="card">
                <div className="bg-heading">
                  <h6 className="white pad-10">Protection Mode</h6>
                </div>
                <div className="card-body pad-10">
                  <div className="d-flex">
                    <h6 className="mr-3">Malicious Threats</h6>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="detect"
                        name="mitigationMode"
                        value="detect"
                        checked={policy?.mitigationMode === "detect"}
                        onChange={handleRadioChange}
                      />
                      <label className="form-check-label mr-3" htmlFor="detect">
                        Detect
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="protect"
                        name="mitigationMode"
                        value="protect"
                        checked={policy?.mitigationMode === "protect"}
                        onChange={handleRadioChange}
                      />
                      <label
                        className="form-check-label mr-3"
                        htmlFor="protect"
                      >
                        Protect
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="quarantine"
                        name="mitigationMode"
                        value="Kill & Quarantine"
                        checked={policy?.mitigationMode === "Kill & Quarantine"}
                        onChange={handleRadioChange}
                      />
                      <label className="form-check-label" htmlFor="quarantine">
                        Kill & Quarantine
                      </label>
                    </div>
                  </div>

                  <div className="d-flex my-5">
                    <h6 className="mr-3">Suspicious Threat</h6>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="detectSuspicious"
                        name="mitigationModeSuspicious"
                        value="detect"
                        checked={policy?.mitigationModeSuspicious === "detect"}
                        onChange={handleRadioChange}
                      />
                      <label
                        className="form-check-label mr-3"
                        htmlFor="detectSuspicious"
                      >
                        Detect
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="protectSuspicious"
                        name="mitigationModeSuspicious"
                        value="protect"
                        checked={policy?.mitigationModeSuspicious === "protect"}
                        onChange={handleRadioChange}
                      />
                      <label
                        className="form-check-label mr-3"
                        htmlFor="protectSuspicious"
                      >
                        Protect
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="alerts"
                        name="mitigationModeSuspicious"
                        value="alerts"
                        checked={policy?.mitigationModeSuspicious === "alerts"}
                        onChange={handleRadioChange}
                      />
                      <label className="form-check-label" htmlFor="alerts">
                        Alerts Only
                      </label>
                    </div>
                  </div>

                  <h4>Malicious Macros Mitigation</h4>
                  <p>
                    This only applies when the static AI detection engine is on.
                    Protection mode from malicious threat.{" "}
                  </p>
                  <input
                    className=""
                    type="checkbox"
                    name="removeMacros"
                    checked={policy?.removeMacros}
                    onChange={handleCheckboxChange}
                  />
                  <label>
                    Remove malicious Macros from the office file instead of
                    placing the files in quarantine
                  </label>
                  <hr />
                  <div>
                    <span>
                      {" "}
                      <strong>Containment</strong>{" "}
                    </span>
                    <span className="mg-left-5">
                      {" "}
                      <input
                        className=""
                        type="checkbox"
                        name="containment"
                        checked={policy?.containment}
                        onChange={handleCheckboxChange}
                      />
                      <label>Disconnect from the network</label>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="card">
                <div className="card-header bg-heading">
                  <h6 className="pad-10 white">Detection Engine</h6>
                </div>
                <div className="card-body pad-10">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="reputation"
                      checked={policy?.engines?.reputation}
                      onChange={() => handleDetectionEngineChange("reputation")}
                    />
                    <label className="form-check-label" htmlFor="reputation">
                      Reputation
                    </label>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="staticAi"
                      checked={policy?.engines?.staticAi}
                      onChange={() => handleDetectionEngineChange("staticAi")}
                    />
                    <label className="form-check-label" htmlFor="staticAi">
                      Static AI
                    </label>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="staticAiSuspicious"
                      checked={policy?.engines?.staticAiSuspicious}
                      onChange={() =>
                        handleDetectionEngineChange("staticAiSuspicious")
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="staticAiSuspicious"
                    >
                      Static AI - Suspicious
                    </label>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="behavioralAi"
                      checked={policy?.engines?.executables}
                      onChange={() =>
                        handleDetectionEngineChange("executables")
                      }
                    />
                    <label className="form-check-label" htmlFor="behavioralAi">
                      Behavioral AI - Executable
                    </label>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="documentScript"
                      checked={policy?.engines?.documentScript}
                      onChange={() =>
                        handleDetectionEngineChange("documentScript")
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="documentScript"
                    >
                      Document, Script
                    </label>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="lateralMovements"
                      checked={policy?.engines?.lateralMovement}
                      onChange={() =>
                        handleDetectionEngineChange("lateralMovement")
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="lateralMovements"
                    >
                      Lateral Movements
                    </label>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="antiExploitation"
                      checked={policy?.engines?.exploits}
                      onChange={() => handleDetectionEngineChange("exploits")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="antiExploitation"
                    >
                      Anti Exploitation / Fileless
                    </label>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="unwantedApplications"
                      checked={policy?.engines?.unwantedApplications}
                      onChange={() =>
                        handleDetectionEngineChange("unwantedApplications")
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="unwantedApplications"
                    >
                      Potential Unwanted Applications
                    </label>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="applicationControls"
                      checked={policy?.engines?.applicationControl}
                      onChange={() =>
                        handleDetectionEngineChange("applicationControl")
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="applicationControls"
                    >
                      Application Controls
                    </label>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="alternativeThreats"
                      checked={policy?.engines?.alternativeThreats}
                      onChange={() =>
                        handleDetectionEngineChange("alternativeThreats")
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="alternativeThreats"
                    >
                      Detect Alternative Threats
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header bg-heading">
                  <h6 className="white pad-10">Agent</h6>
                </div>
                <div className="card-body row pad-10 mt-3">
                  <div className="col-md-2">
                    <p className="semi-bold">Security Settings :</p>
                  </div>
                  <div className="col-md-10">
                    <ul>
                      <li className="form-check form-switch inline-block">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="snapshots"
                          name="snapshotsOn"
                          checked={policy?.snapshotsOn}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor="snapshots">
                          Snapshots
                        </label>
                      </li>
                      <li className="form-check form-switch inline-block">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="antiTamper"
                          name="antiTamperingOn"
                          checked={policy?.antiTamperingOn}
                          onChange={handleCheckboxChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="antiTamper"
                        >
                          Anti Tamper
                        </label>
                      </li>
                      <li className="form-check form-switch inline-block">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="scanNewAgents"
                          name="scanNewAgents"
                          checked={policy?.scanNewAgents}
                          onChange={handleCheckboxChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="scanNewAgents"
                        >
                          Scan new agents
                        </label>
                      </li>
                      <li className="form-check form-switch inline-block">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="suspiciousDriveBlocking"
                          name="signedDriverBlockingOn"
                          checked={policy?.signedDriverBlockingOn}
                          onChange={handleCheckboxChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="suspiciousDriveBlocking"
                        >
                          Suspicious Drive Blocking
                        </label>
                      </li>
                      <li className="form-check form-switch inline-block">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="logging"
                          name="agentLoggingOn"
                          checked={policy?.agentLoggingOn}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor="logging">
                          Logging
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-lg-12">
              <div className="card">
                <div className="bg-heading">
                  <h6 className="white pad-10">Agent UI</h6>
                </div>
                <div className="mt-5 card-body pad-10">
                  <input
                    className=""
                    type="checkbox"
                    id="agentUi"
                    name="agentUiOn"
                    checked={policy?.agentUi?.agentUiOn}
                    onChange={() => handleAgentUiChange("agentUiOn")}
                  />
                  <label htmlFor="agentUi">
                    Show Agent UI & tray icon on endpoints
                  </label>

                  <p className="semi-bold">
                    Set which information and notification to show for end-user
                  </p>
                  <div className="d-flex justify-align-center">
                    <span className="inline-block w-250px">
                      Show pop-up notification for:
                    </span>
                    <div className="form-check-inline form-switch inline-block ms-10">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="threatMitigation"
                        name="threatPopUpNotifications"
                        checked={policy?.agentUi?.threatPopUpNotifications}
                        onChange={() =>
                          handleAgentUiChange("threatPopUpNotifications")
                        }
                      />
                      <label
                        className="form-check-label w-150px"
                        htmlFor="threatMitigation"
                      >
                        Threat and Mitigation
                      </label>
                    </div>
                    <div className="form-check-inline form-switch inline-block ms-10">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="blockedDevices"
                        name="devicePopUpNotifications"
                        checked={policy?.agentUi?.devicePopUpNotifications}
                        onChange={() =>
                          handleAgentUiChange("devicePopUpNotifications")
                        }
                      />
                      <label
                        className="form-check-label w-150px"
                        htmlFor="blockedDevices"
                      >
                        Blocked Devices
                      </label>
                    </div>
                  </div>
                  <div>
                    <p className="inline-block w-250px">
                      show Suspicious event in the UI:
                    </p>
                    <div className="form-check form-switch inline-block ms-10">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="includeSuspicious"
                        name="showSuspicious"
                        checked={policy?.agentUi?.showSuspicious}
                        onChange={() => handleAgentUiChange("showSuspicious")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="includeSuspicious"
                      >
                        Include Suspicious
                      </label>
                    </div>
                  </div>
                  <div>
                    <p className="inline-block w-250px">
                      show warning in case of Agent errors:
                    </p>
                    <div className="form-check form-switch inline-block ms-10">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="includeWarning"
                        name="showAgentWarnings"
                        checked={policy?.agentUi?.showAgentWarnings}
                        onChange={() =>
                          handleAgentUiChange("showAgentWarnings")
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="includeWarning"
                      >
                        Include warning
                      </label>
                    </div>
                  </div>
                  <div>
                    <p className="inline-block w-250px">
                      show in the UI events from the last:
                    </p>
                    <div className="form-check inline-block ms-10">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="showLast30Days"
                        name="maxEventAgeDays"
                        checked={policy?.agentUi?.maxEventAgeDays}
                        onChange={() => handleAgentUiChange("maxEventAgeDays")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="showLast30Days"
                      >
                        30 days
                      </label>
                    </div>
                  </div>
                  <div>
                    <p className="inline-block w-250px">
                      show these menu item in the UI:
                    </p>
                    <div className="form-check form-switch inline-block ms-10">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="threatMitigationMenu"
                        name="showDeviceTab"
                        checked={policy?.agentUi?.showDeviceTab}
                        onChange={() => handleAgentUiChange("showDeviceTab")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="threatMitigationMenu"
                      >
                        Blocked Devices
                      </label>
                    </div>
                    <div className="form-check form-switch inline-block ms-10">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="blockedDevicesMenu"
                        name="showQuarantineTab"
                        checked={policy?.agentUi?.showQuarantineTab}
                        onChange={() =>
                          handleAgentUiChange("showQuarantineTab")
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="blockedDevicesMenu"
                      >
                        Quarantined Files
                      </label>
                    </div>
                    <div className="form-check form-switch inline-block ms-10">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="contactSupportMenu"
                        name="showSupport"
                        checked={policy?.agentUi?.showSupport}
                        onChange={() => handleAgentUiChange("showSupport")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="contactSupportMenu"
                      >
                        Contact Support
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-lg-12">
              <div className="card">
                <p className="pad-10">
                  <i className="fa fa-circle-exclamation incident-icon blue mg0right-5" />{" "}
                  Some agent Ui settings are supported for the agent version
                  21.7+
                </p>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-lg-12">
              <div className="card deep-visibility">
                <div className="card-header bg-heading">
                  <h6 className="white pad-10">Deep Visibality</h6>
                </div>
                <div className="card-body pad-10">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6>Deep Visibality configuration</h6>
                      <p>collect this deep Visibality data</p>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="deepVisibility"
                        checked={deepVisibilityEnabled}
                        onChange={() =>
                          setDeepVisibilityEnabled(!deepVisibilityEnabled)
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="deepVisibility"
                      >
                        Enable deep Visibility
                      </label>
                    </div>
                    <div className="float-right">
                      <span>icon</span> <span>Event type configuration</span>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="process"
                        checked={policy?.iocAttributes?.process}
                        onChange={() => handleIoCAttributeChange("process")}
                      />
                      <label className="form-check-label" htmlFor="process">
                        Process
                      </label>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="file"
                        checked={policy?.iocAttributes?.file}
                        onChange={() => handleIoCAttributeChange("file")}
                      />
                      <label className="form-check-label" htmlFor="file">
                        File
                      </label>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="url"
                        checked={policy?.iocAttributes?.url}
                        onChange={() => handleIoCAttributeChange("url")}
                      />
                      <label className="form-check-label" htmlFor="url">
                        URL
                      </label>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="dns"
                        checked={policy?.iocAttributes?.dns}
                        onChange={() => handleIoCAttributeChange("dns")}
                      />
                      <label className="form-check-label" htmlFor="dns">
                        DNS
                      </label>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="ip"
                        checked={policy?.iocAttributes?.ip}
                        onChange={() => handleIoCAttributeChange("ip")}
                      />
                      <label className="form-check-label" htmlFor="ip">
                        IP
                      </label>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="login"
                        checked={policy?.iocAttributes?.windowsEventLogs}
                        onChange={() =>
                          handleIoCAttributeChange("windowsEventLogs")
                        }
                      />
                      <label className="form-check-label" htmlFor="login">
                        Login
                      </label>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="registryKeys"
                        checked={policy?.iocAttributes?.registry}
                        onChange={() => handleIoCAttributeChange("registry")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="registryKeys"
                      >
                        Registry Keys
                      </label>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="scheduledTasks"
                        checked={policy?.iocAttributes?.scheduledTask}
                        onChange={() =>
                          handleIoCAttributeChange("scheduledTask")
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="scheduledTasks"
                      >
                        Scheduled Tasks
                      </label>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="behavioralIndicators"
                        checked={policy?.iocAttributes?.behavioralIndicators}
                        onChange={() =>
                          handleIoCAttributeChange("behavioralIndicators")
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="behavioralIndicators"
                      >
                        Behavioral Indicators
                      </label>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="commandScripts"
                        checked={policy?.iocAttributes?.commandScripts}
                        onChange={() =>
                          handleIoCAttributeChange("commandScripts")
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="commandScripts"
                      >
                        Command Scripts
                      </label>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="crossProcess"
                        checked={policy?.iocAttributes?.crossProcess}
                        onChange={() =>
                          handleIoCAttributeChange("crossProcess")
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="crossProcess"
                      >
                        Cross Process
                      </label>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="driverLoad"
                        checked={policy?.iocAttributes?.driver}
                        onChange={() => handleIoCAttributeChange("driver")}
                      />
                      <label className="form-check-label" htmlFor="driverLoad">
                        Driver Load
                      </label>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="dataMasking"
                        checked={policy?.iocAttributes?.dataMasking}
                        onChange={() => handleIoCAttributeChange("dataMasking")}
                      />
                      <label className="form-check-label" htmlFor="dataMasking">
                        Data Masking
                      </label>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="fileMonitoring"
                        checked={policy?.iocAttributes?.smartFileMonitoring}
                        onChange={() =>
                          handleIoCAttributeChange("smartFileMonitoring")
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="fileMonitoring"
                      >
                        Focused File Monitoring
                      </label>
                    </div>
                  </div>
                  <div>
                    <input
                      className=""
                      type="checkbox"
                      checked={
                        policy?.iocAttributes?.autoInstallBrowserExtensions
                      }
                      onChange={() =>
                        setPolicy((prevPolicy) => ({
                          ...prevPolicy,
                          iocAttributes: {
                            ...prevPolicy.iocAttributes,
                            autoInstallBrowserExtensions: !prevPolicy
                              .iocAttributes.autoInstallBrowserExtensions,
                          },
                        }))
                      }
                    />
                    <label>
                      Automatically install Deep Visibility browser extensions
                    </label>
                    <p>
                      <i className="fa fa-circle-exclamation incident-icon blue mg0right-5" />{" "}
                      Last Do not search if your organization uses Google
                      Workspace(formerly G Suite) to manage browser extensions
                    </p>
                    <p>
                      This overrides other browser extensions deployed Google
                      Workspace. if your organization uses Google Workspace to
                      deploy browser extensions, This option requires Windows
                      Agent 4.7+{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header bg-heading">
                  <h6 className="white pad-10">Binary Vault</h6>
                </div>
                <div className="card-body row pad-10">
                  <div>
                    <span>
                      {" "}
                      <strong>Enable automatic File Upload</strong>
                    </span>
                    <span>
                      {" "}
                      <input
                        className=""
                        type="checkbox"
                        checked={policy?.autoFileUpload?.enabled}
                        onChange={handleAutoFileUploadChange}
                      />
                      <label>Enable automatic File Upload</label>
                    </span>
                  </div>
                  <div className="row">
                    <div className="col-md-5">
                      <p>Exclude Path</p>
                      <p>Exclude File Type</p>
                      <p>Maximum file size Upload(Max 250MB)</p>
                      <p>Total Upload per agent per day(Max 500MB)</p>
                      <p>offline cache size(Max 2048MB)</p>
                    </div>
                    <div className="col-md-7">
                      <p>
                        {" "}
                        <input type="text" placeholder="New Path" />
                      </p>
                      <p>
                        {" "}
                        <input type="text" placeholder="New File Type" />
                      </p>
                      <p>
                        {" "}
                        <input
                          type="text"
                          value={
                            policy?.autoFileUpload?.maxFileSizeLimit /
                              (1024 * 1024) +
                            " " +
                            "MB"
                          }
                          placeholder="250 MB"
                        />
                      </p>
                      <p>
                        {" "}
                        <input
                          type="text"
                          value={
                            policy?.autoFileUpload?.maxDailyFileUploadLimit /
                              (1024 * 1024) +
                            " " +
                            "MB"
                          }
                          placeholder="500 MB"
                        />
                      </p>
                      <p>
                        {" "}
                        <input
                          type="text"
                          value={
                            policy?.autoFileUpload?.maxLocalDiskUsageLimit /
                              (1024 * 1024) +
                            " " +
                            "MB"
                          }
                          placeholder="2048 MB"
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header bg-heading">
                  <h6 className="white pad-10">More Options</h6>
                </div>
                <div className="card-body row pad-10">
                  <div className="d-flex justify-content-start">
                    <strong>Decommissioning</strong>
                    <div className="form-check form-switch px-5">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="autoDecommission"
                        checked={policy?.autoDecommissionOn}
                        onChange={handleAutoDecommissionChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="autoDecommission"
                      >
                        Auto Decommission after {policy?.autoDecommissionDays}{" "}
                        days offline
                      </label>
                    </div>
                  </div>
                  <div className="d-flex justify-content-start">
                    <strong>Remote Shell</strong>
                    <div className="px-3">
                      <input
                        className=""
                        type="checkbox"
                        checked={policy?.removeMacros}
                        onChange={handleRemoteShellChange}
                      />
                      <label>Enable Remote Shell</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Policy;
