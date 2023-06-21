import React, { useState, useEffect, useRef } from "react";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { fetchMasterData } from "../../../../../api/Api";
import { fetchUsers } from "../../../../../api/AlertsApi";
import { fetchGetIncidentHistory, fetchIncidentDetails, fetchUpdateIncident } from "../../../../../api/IncidentsApi";

const IncidentDetails = ({ incident }) => {
  const { subject, createdDate, description, incidentID } = incident;
  // const { incidentStatusName, priorityName, severityName, type, ownerName, subject, createdDate, description, incidentID } = incident;
  const id = incidentID;
  console.log(id, "id")
  const [activeTab, setActiveTab] = useState("general");
  const userID = Number(sessionStorage.getItem('userId'));
  const orgId = Number(sessionStorage.getItem('orgId'))
  const date = new Date().toISOString();
  const [dropdownData, setDropdownData] = useState({
    severityNameDropDownData: [],
    statusDropDown: [],
    priorityDropDown: [],
    typeDropDown: [],
  });
  const checkboxRef = useRef(null);
  const [incidentHistory, setIncidentHistory] = useState([]);
  console.log(incidentHistory, "incidentHistory")
  const [ldp_security_user, setldp_security_user] = useState([]);
  const [incidentData, setIncidentData] = useState(
    {
      incidentStatus: "",
      incidentStatusName: '',
      priority: '',
      priorityName: "",
      severity: "",
      severityName: "",
      typeId: "",
      type: "",
      owner: "",
      ownerName: "",
    }
  );
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
      fetchMasterData('incident_severity'),
      fetchMasterData('incident_status'),
      fetchMasterData('incident_priority'),
      fetchMasterData('Incident_Type'),
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
        console.log(error);
      });
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchIncidentDetails(id);
        data !== undefined &&
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
          }));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);
  const handleChange = (event, field) => {
    const selectedId = event.target.options[event.target.selectedIndex].getAttribute("data-id");

    if (field === "status") {
      setIncidentData({
        ...incidentData,
        incidentStatus: selectedId,
        incidentStatusName: event.target.value
      });
    } else if (field === "priority") {
      setIncidentData({
        ...incidentData,
        priority: selectedId,
        priorityName: event.target.value
      });
    } else if (field === "severity") {
      setIncidentData({
        ...incidentData,
        severity: selectedId,
        severityName: event.target.value
      });
    } else if (field === "type") {
      setIncidentData({
        ...incidentData,
        typeId: selectedId,
        type: event.target.value
      });
    } else if (field === "owner") {
      setIncidentData({
        ...incidentData,
        owner: selectedId,
        ownerName: event.target.value
      });
    }
  };
  const handleSubmit = (event, incidentData) => {
    event.preventDefault()
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
    }

    fetchUpdateIncident(data)

  }
  useEffect(() => {
    const data = {
      orgId,
      incidentId: Number(id),
    }
    fetchGetIncidentHistory(data).then((res) => {
      setIncidentHistory(res)
    }).catch((error) => {
      console.log(error)
    });

  }, [id])
  return (
    <div className="col-md-4 border-1 border-gray-600">
      <div className="card">
        <div className="d-flex justify-content-between bd-highlight mb-3">
          <div className="p-2 bd-highlight">
            <h6 className="card-title align-items-start flex-column pt-2">
              <span className="card-label fw-bold fs-3 mb-1">
                Incidents Details
              </span>
            </h6>
          </div>
        </div>
        <div className="d-flex justify-content-between bd-highlight mb-3 incident-tabs">
          <div className="p-2 bd-highlight">
            <ul className="nav nav-tabs nav-line-tabs mb-5 fs-8">
              <li className="nav-item">
                <a
                  className={`nav-link ${activeTab === "general" ? "active" : ""}`}
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_1"
                  onClick={() => setActiveTab("general")}
                >
                  General
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeTab === "alerts" ? "active" : ""}`}
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_2"
                  onClick={() => setActiveTab("alerts")}
                >
                  Alerts
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeTab === "playbooks" ? "active" : ""}`}
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_3"
                  onClick={() => setActiveTab("playbooks")}
                >
                  Playbooks
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeTab === "observables" ? "active" : ""}`}
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_4"
                  onClick={() => setActiveTab("observables")}
                >
                  Observables
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeTab === "timeline" ? "active" : ""}`}
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_5"
                  onClick={() => setActiveTab("timeline")}
                >
                  Timeline
                </a>
              </li>
            </ul>

            <div className="tab-content" id="myTabContent">
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
                          <option key={status.dataID} value={status.dataValue} data-id={status.dataID}>
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
                          <option key={priority.dataID} value={priority.dataValue} data-id={priority.dataID}>
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
                        className="form-select form-control form-select-white form-select-sm fw-bold"
                        value={incidentData.severityName}
                        onChange={(event) => handleChange(event, "severity")}
                      >
                        <option value="">Select</option>
                        {dropdownData.severityNameDropDownData.map((severity) => (
                          <option key={severity.dataID} value={severity.dataValue} data-id={severity.dataID}>
                            {severity.dataValue}
                          </option>
                        ))}
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
                          <option key={type.dataID} value={type.dataValue} data-id={type.dataID}>
                            {type.dataValue}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                {/* Text */}
                <div className="bd-highlight mb-3 bdr-top">
                  <div className="col-md-12 bd-highlight">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold">Incident Name - </span> {subject}
                    </div>
                  </div>
                  <div className="col-md-12 bd-highlight">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold">Event ID - </span> 4625
                    </div>
                  </div>
                  <div className="col-md-12 bd-highlight">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold"> Destination User - </span>{" "}
                      James James
                    </div>
                  </div>
                  <div className="col-md-12 bd-highlight">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold">Source IP - </span> 192.168.0.1
                    </div>
                  </div>
                  <div className="col-md-12 bd-highlight">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold">Vendor - </span> Microsoft
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between bd-highlight">
                  <div className="p-2 bd-highlight">
                    <div className="fs-13">Incident ID</div>
                  </div>
                  <div className="p-2 bd-highlight">
                    <div className="badge text-black fs-13">
                      20210728-00056{" "}
                    </div>
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
                              <option key={index} value={item?.name} data-id={item.userID}>
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
                    className="p-2"
                    type="checkbox"
                    ref={checkboxRef}
                  // checked={incidentData.significantIncident}
                  // onChange={(event) => handleChange(event, "significantIncident")}
                  />
                  <label style={{ marginLeft: '8px' }}>Significant Incident</label>
                </div>


                <div className="d-flex justify-content-between bd-highlight">
                  <div className="p-2 bd-highlight">
                    <div className="fs-13">Created</div>
                  </div>
                  <div className="p-2 bd-highlight">
                    <div className="badge text-black fw-normal">
                      {createdDate}
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between bd-highlight">
                  <div className="p-2 bd-highlight">
                    <div className="fs-13">Updated</div>
                  </div>
                  <div className="p-2 bd-highlight">
                    <div className="badge text-black fw-normal">
                      Jul 29, 2022 01:12:32 AM
                    </div>
                  </div>
                </div>
              </div>

              <div className="tab-pane fade" id="kt_tab_pane_2" role="tabpanel">
                <table
                  className="scroll-y me-n5 pe-5 table table-hover table-row-dashed fs-6 gy-5 my-0 dataTable no-footer"
                  id="kt_inbox_listing"
                >
                  <tbody>
                    <tr className="bg-gray-100 mb-3">
                      <td className="p-2 pb-8">
                        <div className="d-flex justify-content-between bd-highlight">
                          <div className="p-1 bd-highlight fw-bold fs-12"style={{ width: '200px', textAlign: 'left' }}>
                            <div className="text-dark mb-1">
                              <a href="#" className="text-dark">
                                <span className="fw-bold">
                                  {description}
                                </span>
                              </a>
                            </div>
                          </div>
                          <div className="p-1 bd-highlight" >
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
                          <div className="p-1 bd-highlight fw-bold fs-12">
                            Detected date
                          </div>
                          <div className="p-1 bd-highlight fs-12">
                            {createdDate}
                          </div>
                        </div>
                        <hr className="my-0" />
                      </td>
                    </tr>

                    <tr className="bg-gray-100">
                      <td className="min-w-80px p-2 pb-8">
                        <div className="d-flex justify-content-between bd-highlight">
                          <div className="p-1 bd-highlight fw-bold fs-12">
                            <div className="text-dark mb-1">
                              <a href="#" className="text-dark">
                                <span className="fw-bold">
                                  CheckPoint - Malware Traffic
                                </span>
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
                              <i className="fa-solid fa-arrow-down"></i>
                            </a>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-text-left bd-highlight">
                          <div className="p-1 bd-highlight fw-bold fs-12">
                            Suspicious Rate
                          </div>
                          <div className="p-1 bd-highlight fw-bold fs-12">
                            <i className="fa-solid fa-circle-check text-success"></i>{" "}
                            2
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-text-left bd-highlight">
                          <div className="p-1 bd-highlight fw-bold fs-12">
                            Detected date
                          </div>
                          <div className="p-1 bd-highlight fs-12">
                            5/04/2023, 12:15 PM
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
              <div className="tab-pane fade" id="kt_tab_pane_5" role="tabpanel">
                <div className="card-body pt-6 h-600px">
                  <div className="timeline-label">
                    <div className="timeline-item">
                      <div className="timeline-label fw-bold text-gray-800 fs-6">
                        08:42
                      </div>

                      <div className="timeline-badge">
                        <i className="fa fa-genderless text-gray-600 fs-1"></i>
                      </div>

                      <div className="fw-semibold text-gray-700 ps-3 fs-7">
                        Information passed to Concern team.
                      </div>
                    </div>

                    <div className="timeline-item d-flex align-items-center">
                      <div className="timeline-label fw-bold text-gray-800 fs-6">
                        10:00
                      </div>

                      <div className="timeline-badge">
                        <i className="fa fa-genderless text-success fs-1"></i>
                      </div>

                      <div className="d-flex align-items-center">
                        <span className="fw-bold text-gray-800 px-3">
                          Alert Reviewed by{" "}
                        </span>

                        <div className="symbol symbol-35px me-3">
                          <img
                            alt="Pic"
                            src={toAbsoluteUrl("/media/avatars/300-1.jpg")}
                          />
                        </div>

                        <div className="symbol symbol-35px">
                          <img
                            alt="Pic"
                            src={toAbsoluteUrl("/media/avatars/300-2.jpg")}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="timeline-item">
                      <div className="timeline-label fw-bold text-gray-800 fs-6">
                        14:37
                      </div>

                      <div className="timeline-badge">
                        <i className="fa fa-genderless text-danger fs-1"></i>
                      </div>

                      <div className="timeline-content fw-bold text-gray-800 ps-3">
                        severity: notice message: undefined Rule:
                        <a href="#" className="text-primary">
                          Count 9
                        </a>
                      </div>
                    </div>

                    <div className="timeline-item">
                      <div className="timeline-label fw-bold text-gray-800 fs-6">
                        16:50
                      </div>

                      <div className="timeline-badge">
                        <i className="fa fa-genderless text-primary fs-1"></i>
                      </div>

                      <div className="fw-semibold text-gray-700 ps-3 fs-7">
                        Alert : IP address need to be blocked
                      </div>
                    </div>

                    <div className="timeline-item">
                      <div className="timeline-label fw-bold text-gray-800 fs-6">
                        21:03
                      </div>

                      <div className="timeline-badge">
                        <i className="fa fa-genderless text-warning fs-1"></i>
                      </div>

                      <div className="timeline-content fw-semibold text-gray-800 ps-3">
                        New Ticket Raised{" "}
                        <a href="#" className="text-primary">
                          #XF-2356
                        </a>
                        .
                      </div>
                    </div>

                    <div className="timeline-item">
                      <div className="timeline-label fw-bold text-gray-800 fs-6">
                        16:50
                      </div>

                      <div className="timeline-badge">
                        <i className="fa fa-genderless text-info fs-1"></i>
                      </div>

                      <div className="fw-semibold text-gray-700 ps-3 fs-7">
                        Ticket status updated
                      </div>
                    </div>

                    <div className="timeline-item">
                      <div className="timeline-label fw-bold text-gray-800 fs-6">
                        14:37
                      </div>

                      <div className="timeline-badge">
                        <i className="fa fa-genderless text-danger fs-1"></i>
                      </div>

                      <div className="timeline-content fw-bold text-gray-800 ps-3">
                        Ticket Closed -
                        <a href="#" className="text-primary">
                          Issue Resolved
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='card-footer d-flex justify-content-end'>
                {activeTab === "general" && (
                  <div className="text-end mt-5">
                    <button
                      type='submit'
                      onClick={(event) => handleSubmit(event, incidentData)}
                      className="btn btn-primary">Save Changes</button>
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
