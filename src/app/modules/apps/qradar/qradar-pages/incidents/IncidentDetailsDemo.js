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
                <div className="col-md-3 bd-highlight mt-2 semi-bold">Type</div>
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
              <div className="row bd-highlight mb-3">
                <div className="col-md-3 bd-highlight mt-2 semi-bold">
                  Owner:
                </div>
                <div className="col-md-9 bd-highlight">
                  <div className="w-120px">
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
              <div className="bd-highlight mb-3 mt-5 pt-5 bdr-top">
                <div className="bd-highlight mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold m-width">Alert Name </span>{" "}
                    <b>:</b>
                    Multiple failed login for same IP
                  </div>
                </div>
                <div className="bd-highlight mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold m-width">Event ID </span> <b>:</b>
                    4625
                  </div>
                </div>
                <div className="bd-highlight mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold m-width"> Destination User </span>{" "}
                    <b>:</b> James James
                  </div>
                </div>
                <div className="bd-highlight mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold m-width">Source IP </span> <b>:</b>{" "}
                    192.168.0.1
                  </div>
                </div>
                <div className="bd-highlight mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold m-width">Vendor </span> <b>:</b>{" "}
                    Microsoft
                  </div>
                </div>
              </div>
              <div className="bd-highlight">
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold m-width">Incident ID </span> <b>:</b>{" "}
                  20210728
                </div>{" "}
              </div>

              <div className="bd-highlight">
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold m-width">Created</span>
                  <b>:</b> Jul 28, 2022 02:02:02 PM
                </div>
              </div>
              <div className="bd-highlight">
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold m-width">Updated</span>
                  <b>:</b> Jul 29, 2022 01:12:32 AM
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
