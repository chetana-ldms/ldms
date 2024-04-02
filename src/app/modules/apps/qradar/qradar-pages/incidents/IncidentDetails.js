import React, { useState, useEffect, useRef } from "react";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { fetchMasterData } from "../../../../../api/Api";
import { fetchUsers } from "../../../../../api/AlertsApi";
import { notify, notifyFail } from "../components/notification/Notification";
import {
  fetchAlertsByAlertIds,
  fetchGetIncidentHistory,
  fetchIncidentDetails,
  fetchIncidents,
  fetchUpdateIncident,
} from "../../../../../api/IncidentsApi";
import { getCurrentTimeZone } from "../../../../../../utils/helper";
import { useErrorBoundary } from "react-error-boundary";

const IncidentDetails = ({ incident, onRefreshIncidents }) => {
  console.log("incident11111", incident);
  const handleError = useErrorBoundary();
  const {
    subject,
    createdDate,
    incidentID,
    modifiedDate,
    eventID,
    destinationUser,
    sourceIP,
    vendor,
  } = incident;
  const id = incidentID;
  console.log(id, "id");
  const [activeTab, setActiveTab] = useState("general");
  const userID = Number(sessionStorage.getItem("userId"));
  const orgId = Number(sessionStorage.getItem("orgId"));
  const date = new Date().toISOString();
  const [dropdownData, setDropdownData] = useState({
    severityNameDropDownData: [],
    statusDropDown: [],
    priorityDropDown: [],
    typeDropDown: [],
  });
  const checkboxRef = useRef(null);
  const [incidentHistory, setIncidentHistory] = useState([]);
  console.log(incidentHistory, "incidentHistory");
  const [alertsList, setAlertsList] = useState({});
  const [ldp_security_user, setldp_security_user] = useState([]);
  const [incidentData, setIncidentData] = useState({
    incidentStatus: "",
    incidentStatusName: "",
    priority: "",
    priorityName: "",
    severity: "",
    severityName: "",
    typeId: "",
    type: "",
    owner: "",
    ownerName: "",
    alertId: "",
  });

  const alertId = incidentData.alertId;
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchUsers(orgId);
      setldp_security_user(
        response?.usersList != undefined ? response?.usersList : []
      );
    };

    fetchData();
  }, []);
  useEffect(() => {
    Promise.all([
      fetchMasterData("incident_severity"),
      fetchMasterData("incident_status"),
      fetchMasterData("incident_priority"),
      fetchMasterData("Incident_Type"),
    ])
      .then(([severityData, statusData, priorityData, typeData]) => {
        setDropdownData((prevDropdownData) => ({
          ...prevDropdownData,
          severityNameDropDownData: severityData,
          statusDropDown: statusData,
          priorityDropDown: priorityData,
          typeDropDown: typeData,
        }));
      })
      .catch((error) => {
        handleError(error);
      });
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchIncidentDetails(id);
        if (data !== undefined) {
          const { alertIncidentMapping } = data;
          const alertId =
            alertIncidentMapping.alertIncidentMappingDtl[0].alertid;

          setIncidentData((prevIncidentData) => ({
            ...prevIncidentData,
            incidentStatus: data.incidentStatus,
            incidentStatusName: data.incidentStatusName,
            priority: data.priority,
            priorityName: data.priorityName,
            severity: data.severity,
            severityName: data.severityName,
            typeId: data.typeId,
            type: data.type,
            owner: data.owner,
            ownerName: data.ownerName,
            alertId: alertId, // Add alertId to the state
          }));
        }
      } catch (error) {
        handleError(error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (event, field) => {
    const selectedId = event.target.options[
      event.target.selectedIndex
    ].getAttribute("data-id");

    if (field === "status") {
      setIncidentData({
        ...incidentData,
        incidentStatus: selectedId,
        incidentStatusName: event.target.value,
      });
    } else if (field === "priority") {
      setIncidentData({
        ...incidentData,
        priority: selectedId,
        priorityName: event.target.value,
      });
    } else if (field === "severity") {
      setIncidentData({
        ...incidentData,
        severity: selectedId,
        severityName: event.target.value,
      });
    } else if (field === "type") {
      setIncidentData({
        ...incidentData,
        typeId: selectedId,
        type: event.target.value,
      });
    } else if (field === "owner") {
      setIncidentData({
        ...incidentData,
        owner: selectedId,
        ownerName: event.target.value,
      });
    }
  };
  const handleSubmit = async (event, incidentData) => {
    event.preventDefault();
    const data = {
      incidentId: Number(id),
      statusId: incidentData.incidentStatus,
      priorityId: incidentData.priority,
      severityId: incidentData.severity,
      // "score": "string",
      typeId: incidentData.typeId,
      ownerUserId: incidentData.owner,
      significantIncident: checkboxRef.current.checked,
      modifiedUserId: userID,
      modifiedDate: date,
    };

    try {
      await fetchUpdateIncident(data);
      notify("Incident updated");
      onRefreshIncidents();
      reloadHistory();
    } catch (error) {
      notifyFail("Failed to update Incident");
      handleError(error);
    }
  };
  const reloadHistory = () => {
    const data = {
      orgId,
      incidentId: Number(id),
    };
    fetchGetIncidentHistory(data)
      .then((res) => {
        setIncidentHistory(res);
      })
      .catch((error) => {
        handleError(error);
      });
  };
  useEffect(() => {
    reloadHistory();
  }, [id]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [alertId];
        const alertsList = await fetchAlertsByAlertIds(data);
        console.log(alertsList, "alertsList1111");
        setAlertsList(alertsList);
      } catch (error) {
        handleError(error);
      }
    };

    fetchData();
  }, [alertId]);

  //To add Randam colors to the timeline Bullet
  const css_classes = [
    "text-primary",
    "text-secondary",
    "text-success",
    "text-danger",
    "text-warning",
    "text-info",
    "text-dark",
    "text-muted",
  ];

  const getRandomClass = () => {
    const randomIndex = Math.floor(Math.random() * css_classes.length);
    return css_classes[randomIndex];
  };

  return (
    <div className="col-md-4 border-1 border-gray-600 incident-details">
      <div className="card">
        <div className="bg-heading">
          <h4 className="no-margin no-pad">
            <span className="white fw-bold block pt-3 pb-3">
              Incidents Details
            </span>
          </h4>
        </div>
        <div className="mb-3 incident-tabs">
          <div className="p-2 bd-highlight">
            <ul className="nav nav-tabs nav-line-tabs mb-5 fs-8 no-pad">
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    activeTab === "general" ? "active" : ""
                  }`}
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_1"
                  onClick={() => setActiveTab("general")}
                >
                  General
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    activeTab === "alerts" ? "active" : ""
                  }`}
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_2"
                  onClick={() => setActiveTab("alerts")}
                >
                  Alerts
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    activeTab === "playbooks" ? "active" : ""
                  }`}
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_3"
                  onClick={() => setActiveTab("playbooks")}
                >
                  Playbooks
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    activeTab === "observables" ? "active" : ""
                  }`}
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_4"
                  onClick={() => setActiveTab("observables")}
                >
                  Observables
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    activeTab === "timeline" ? "active" : ""
                  }`}
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_5"
                  onClick={() => setActiveTab("timeline")}
                >
                  Timeline
                </a>
              </li>
            </ul>

            <div className="tab-content h-auto" id="myTabContent">
              <div
                className="tab-pane fade show active me-n5 pe-5 h-500px"
                id="kt_tab_pane_1"
                role="tabpanel"
              >
                <div className="row bd-highlight mb-3">
                  <div className="col-md-3 bd-highlight mt-2">Status</div>
                  <div className="col-md-9 bd-highlight">
                    <div className="w-120px">
                      <select
                        name="incidentStatusName"
                        data-control="select2"
                        data-hide-search="true"
                        className="form-select form-control form-select-white form-select-sm fw-bold"
                        value={incidentData.incidentStatusName}
                        onChange={(event) => handleChange(event, "status")}
                      >
                        <option value="">Select</option>
                        {dropdownData.statusDropDown.map((status) => (
                          <option
                            key={status.dataID}
                            value={status.dataValue}
                            data-id={status.dataID}
                          >
                            {status.dataValue}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                {/* Priority */}
                <div className="row bd-highlight mb-3">
                  <div className="col-md-3 bd-highlight mt-2">Priority</div>
                  <div className="col-md-9 bd-highlight">
                    <div className="w-120px">
                      <select
                        name="priorityName"
                        data-control="select2"
                        data-hide-search="true"
                        className="form-select form-control form-select-white form-select-sm fw-bold"
                        value={incidentData.priorityName}
                        onChange={(event) => handleChange(event, "priority")}
                      >
                        <option value="">Select</option>
                        {dropdownData.priorityDropDown.map((priority) => (
                          <option
                            key={priority.dataID}
                            value={priority.dataValue}
                            data-id={priority.dataID}
                          >
                            {priority.dataValue}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                {/* Severity */}
                <div className="row bd-highlight mb-3">
                  <div className="col-md-3 bd-highlight mt-2">Severity</div>
                  <div className="col-md-9 bd-highlight">
                    <div className="w-120px">
                      <select
                        name="severityName"
                        data-control="select2"
                        data-hide-search="true"
                        className="form-select form-select-sm"
                        value={incidentData.severityName}
                        onChange={(event) => handleChange(event, "severity")}
                      >
                        <option value="">Select</option>
                        {dropdownData.severityNameDropDownData.map(
                          (severity) => (
                            <option
                              key={severity.dataID}
                              value={severity.dataValue}
                              data-id={severity.dataID}
                            >
                              {severity.dataValue}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Type */}
                <div className="row bd-highlight mb-3">
                  <div className="col-md-3 bd-highlight mt-2">Type</div>
                  <div className="col-md-9 bd-highlight">
                    <div className="w-120px">
                      <select
                        name="type"
                        data-control="select2"
                        data-hide-search="true"
                        className="form-select form-control form-select-white form-select-sm fw-bold"
                        value={incidentData.type}
                        onChange={(event) => handleChange(event, "type")}
                      >
                        <option value="">Select</option>
                        {dropdownData.typeDropDown.map((type) => (
                          <option
                            key={type.dataID}
                            value={type.dataValue}
                            data-id={type.dataID}
                          >
                            {type.dataValue}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                {/* Text */}
                <div className="bd-highlight mb-3 bdr-top pt-5 mt-5">
                  <div className="bd-highlight mb-3">
                    <div className="d-flex align-items-top gap-2">
                      <span className="fw-bold">Incident Name : </span>{" "}
                      {subject}
                    </div>
                  </div>
                  <div className="bd-highlight mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold">Event ID : </span> {eventID}
                    </div>
                  </div>
                  <div className="bd-highlight mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold"> Destination User : </span>{" "}
                      {destinationUser}
                    </div>
                  </div>
                  <div className="bd-highlight mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold">Source IP : </span> {sourceIP}
                    </div>
                  </div>
                  <div className="bd-highlight mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold">Vendor : </span> {vendor}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between bd-highlight bdr-top pt-2">
                  <div className="p-2 bd-highlight">
                    <div className="fs-13">Incident ID</div>
                  </div>
                  <div className="p-2 bd-highlight">
                    <div className="badge text-black fs-13">{incidentID} </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between bd-highlight">
                  <div className="p-2 bd-highlight">
                    <div className="fs-13">Owner</div>
                  </div>
                  <div className="p-2 bd-highlight">
                    <div className="">
                      <select
                        name="ownerName"
                        className="form-select form-select-solid"
                        data-kt-select2="true"
                        data-placeholder="Select option"
                        data-dropdown-parent="#kt_menu_637dc885a14bb"
                        data-allow-clear="true"
                        value={incidentData.ownerName}
                        onChange={(event) => handleChange(event, "owner")}
                      >
                        <option>Select</option>
                        {ldp_security_user.length > 0 &&
                          ldp_security_user.map((item, index) => {
                            return (
                              <option
                                key={index}
                                value={item?.name}
                                data-id={item.userID}
                              >
                                {item?.name}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="checkbox-wrapper">
                  <input
                    className="p-2 v-middle"
                    type="checkbox"
                    ref={checkboxRef}
                  />
                  <label style={{ marginLeft: "8px" }}>
                    Significant Incident
                  </label>
                </div>

                <div className="d-flex justify-content-between bd-highlight">
                  <div className="p-2 bd-highlight">
                    <div className="fs-13">Created</div>
                  </div>
                  <div className="p-2 bd-highlight">
                    <div className="badge text-black fw-bold">
                      {createdDate && getCurrentTimeZone(createdDate)}
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between bd-highlight">
                  <div className="p-2 bd-highlight">
                    <div className="fs-13">Updated</div>
                  </div>
                  <div className="p-2 bd-highlight">
                    <div className="badge text-black fw-bold">
                      {modifiedDate && getCurrentTimeZone(modifiedDate)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="tab-pane fade" id="kt_tab_pane_2" role="tabpanel">
                <table
                  className="me-n5 pe-5 table table-hover table-row-dashed fs-6 gy-5 my-0 dataTable no-footer"
                  id="kt_inbox_listing"
                >
                  <tbody>
                    <tr className="bg-gray-100 mb-3">
                      <td className="p-2 pb-8">
                        <div className="d-flex justify-content-between bd-highlight">
                          <div
                            className="p-1 fs-12"
                            style={{ width: "190px", textAlign: "left" }}
                          >
                            <div className="text-dark mb-1">
                              <a href="#" className="text-dark">
                                <span className="">{alertsList?.name}</span>
                              </a>
                            </div>
                          </div>
                          <div className="p-1 bd-highlight">
                            <a
                              href="#"
                              className="btn btn-sm btn-icon btn-light btn-secondary mx-1"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </a>
                            <a
                              href="#"
                              className="btn btn-sm btn-icon btn-light btn-secondary mx-1"
                            >
                              <i className="fa-solid fa-arrow-up"></i>
                            </a>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-text-left bd-highlight">
                          <div className="p-1 bd-highlight fw-bold fs-12">
                            Suspicious Rate
                          </div>
                          <div className="p-1 bd-highlight fw-bold fs-12">
                            <i className="fa-solid fa-circle-check text-success"></i>{" "}
                            1
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-text-left bd-highlight">
                          <div className="p-1 bd-highlight fs-12">
                            Detected date
                          </div>
                          <div className="p-1 fs-12">
                            {alertsList?.detectedtime && (
                              <div className="gray">
                                {getCurrentTimeZone(alertsList.detectedtime)}
                              </div>
                            )}
                          </div>
                        </div>
                        <hr className="my-0" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="tab-pane fade" id="kt_tab_pane_3" role="tabpanel">
                <table className="table align-middle gs-0 gy-4 dash-table">
                  <thead>
                    <tr className="fw-bold text-muted bg-blue">
                      <th className="min-w-50px">PlayBook Name</th>
                      <th className="min-w-50px">Description</th>
                      <th className="min-w-50px">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="fs-12">
                      <td>Login Failure</td>
                      <td>Failed Login</td>
                      <td>
                        <span className="badge badge-success">Active</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="tab-pane fade" id="kt_tab_pane_4" role="tabpanel">
                Observables data
              </div>
              <div
                className="tab-pane fade timeline-section"
                id="kt_tab_pane_5"
                role="tabpanel"
              >
                <div className="pt-6 h-600px">
                  <div className="timeline-label">
                    {incidentHistory && incidentHistory.length > 0 ? (
                      incidentHistory.map((item) => {
                        const formattedDateTime = getCurrentTimeZone(
                          item.historyDate
                        );

                        return (
                          <div className="timeline-item mb-5" key={item.id}>
                            <div className="timeline-label fw-bold text-gray-800 fs-6">
                              <p>{formattedDateTime}</p>
                              {/* <p className="time">{formattedDateTime}</p> */}
                              <p className="text-muted">{item.createdUser}</p>
                            </div>

                            <div className="timeline-badge">
                              <i
                                className={`fa fa-genderless ${getRandomClass()} fs-1`}
                              ></i>
                            </div>
                            <div className="fw-semibold text-gray-700 ps-3 fs-7">
                              {item.historyDescription}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-gray-500">No data found</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="">
                {activeTab === "general" && (
                  <div className="text-end mt-10">
                    <button
                      type="submit"
                      onClick={(event) => handleSubmit(event, incidentData)}
                      className="btn btn-primary btn-new btn-small"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;
