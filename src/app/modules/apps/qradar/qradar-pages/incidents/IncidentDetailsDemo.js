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

  return (
    <div className="col-md-4 border-1 border-gray-600  incident-details">
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
                  className="nav-link active"
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_1"
                >
                  General
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_2"
                >
                  Alerts
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_3"
                >
                  Playbooks
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_4"
                >
                  Observables
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_5"
                >
                  Timeline
                </a>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active me-n5 pe-5 h-500px header-filter"
                id="kt_tab_pane_1"
                role="tabpanel"
              >
                <div className="row bd-highlight mb-3">
                  <div className="col-md-3 bd-highlight mt-2 semi-bold">
                    Status
                  </div>
                  <div className="col-md-9 bd-highlight">
                    <div className="w-120px">
                      <select
                        name="status"
                        data-control="select2"
                        data-hide-search="true"
                        className="form-select form-control form-select-white form-select-sm fw-bold"
                      >
                        <option value="1">New</option>
                        <option value="1">Open</option>
                        <option value="1">Pending</option>
                        <option value="1">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row bd-highlight mb-3">
                  <div className="col-md-3 bd-highlight mt-2 semi-bold">
                    Priority
                  </div>
                  <div className="col-md-9 bd-highlight">
                    <div className="w-120px">
                      <select
                        name="status"
                        data-control="select2"
                        data-hide-search="true"
                        className="form-select form-control form-select-white form-select-sm fw-bold text-danger"
                      >
                        <option value="1" className="text-danger">
                          High
                        </option>
                        <option value="1" className="text-warning">
                          Medium
                        </option>
                        <option value="1" className="text-info">
                          Low
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row bd-highlight mb-3">
                  <div className="col-md-3 bd-highlight mt-2 semi-bold">
                    Severity
                  </div>
                  <div className="col-md-9 bd-highlight">
                    <div className="w-120px">
                      <select
                        name="status"
                        data-control="select2"
                        data-hide-search="true"
                        className="form-select form-control form-select-white form-select-sm fw-bold text-danger"
                      >
                        <option value="1" className="text-danger">
                          High
                        </option>
                        <option value="1" className="text-warning">
                          Medium
                        </option>
                        <option value="1" className="text-info">
                          Low
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row bd-highlight mb-3">
                  <div className="col-md-3 bd-highlight mt-2 semi-bold">
                    Type
                  </div>
                  <div className="col-md-9 bd-highlight">
                    <div className="w-120px">
                      <select
                        name="status"
                        data-control="select2"
                        data-hide-search="true"
                        className="form-select form-control form-select-white form-select-sm fw-bold"
                      >
                        <option value="1">AD Failed Login</option>
                        <option value="1">AD Failed Login</option>
                        <option value="1">AD Failed Login</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bd-highlight mb-3 mt-5 pt-5 bdr-top">
                  <div className="bd-highlight mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold">Alert Name - </span> Multiple
                      failed login for same IP
                    </div>
                  </div>
                  <div className="bd-highlight mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold">Event ID - </span> 4625
                    </div>
                  </div>
                  <div className="bd-highlight mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold"> Destination User - </span>{" "}
                      James James
                    </div>
                  </div>
                  <div className="bd-highlight mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold">Source IP - </span> 192.168.0.1
                    </div>
                  </div>
                  <div className="bd-highlight mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold">Vendor - </span> Microsoft
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between bd-highlight">
                  <div className="p-2 bd-highlight">
                    <div className="fs-13 semi-bold">Incident ID</div>
                  </div>
                  <div className="p-2 bd-highlight">
                    <div className="badge gray fs-13">20210728-00056 </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between bd-highlight">
                  <div className="p-2 bd-highlight">
                    <div className="fs-13 semi-bold">Owner</div>
                  </div>
                  <div className="p-2 bd-highlight">
                    <div className="">
                      <select
                        name="status"
                        data-control="select2"
                        data-hide-search="true"
                        className="form-select form-control form-select-white form-select-sm fw-bold"
                      >
                        <option value="1">User 1</option>
                        <option value="1">User 2</option>
                        <option value="1">User 3</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between bd-highlight">
                  <div className="p-2 bd-highlight">
                    <div className="fs-13 semi-bold">Created</div>
                  </div>
                  <div className="p-2 bd-highlight">
                    <div className="text-black fw-normal">
                      Jul 28, 2022 02:02:02 PM
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between bd-highlight">
                  <div className="p-2 bd-highlight">
                    <div className="fs-13 semi-bold">Updated</div>
                  </div>
                  <div className="p-2 bd-highlight">
                    <div className="text-black fw-normal">
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
                          <div className="p-1 bd-highlight fw-bold fs-12">
                            <div className="text-dark mb-1">
                              <a href="#" className="text-dark">
                                <span className="fw-bold">
                                  Login Failure Alert
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
                            7/01/2023, 02:20 PM
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
                    <div className="timeline-item mb-5">
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
                          <img alt="Pic" src="/ldms/media/avatars/300-1.jpg" />
                        </div>
                        <div className="symbol symbol-35px">
                          <img alt="Pic" src="/ldms/media/avatars/300-2.jpg" />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;
