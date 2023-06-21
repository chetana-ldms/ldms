import React, { useState, useEffect, useRef } from "react";
import IncidentChat from "./IncidentChat";
import IncidentDetails from "./IncidentDetails";
import { useLocation } from "react-router-dom";
import "./chat.css";
import {
  fetchGetIncidentSearchResult,
  fetchIncidents,
} from "../../../../../api/IncidentsApi";
import { fetchMasterData } from "../../../../../api/Api";
import ChatApp from "./ChatApp";

const IncidentsPage = () => {
  const userID = Number(sessionStorage.getItem("userId"));
  const orgId = Number(sessionStorage.getItem("orgId"));
  const date = new Date().toISOString();
  const location = useLocation();
  const alertData = JSON.parse(localStorage.getItem("alertData"));
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [incident, setIncident] = useState([]);
  console.log(incident, "incident");
  const [statusDropDown, setStatusDropDown] = useState([]);
  const [incidentSortOptions, setIncidentSortOptions] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const status = useRef();
  const sortOption = useRef();
  const [selectedIncident, setSelectedIncident] = useState({});
  console.log(selectedIncident, "selectedIncident");
  useEffect(() => {
    Promise.all([
      fetchMasterData("incident_status"),
      fetchMasterData("IncidentSortOptions"),
    ])
      .then(([statusData, sortOptionsData]) => {
        setStatusDropDown(statusData);
        setIncidentSortOptions(sortOptionsData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const incidents = async () => {
    const data = {
      orgID: orgId,
      paging: {
        rangeStart: 1,
        rangeEnd: 20,
      },
      loggedInUserId: userID,
    };
    try {
      const response = await fetchIncidents(data);
      setIncident(response);
    } catch (error) {
      console.log(error);
    }
  };

  fetchIncidents();
  useEffect(() => {
    incidents();
  }, []);
  const handleSearch = async () => {
    const data = {
      orgID: orgId,
      paging: {
        rangeStart: 1,
        rangeEnd: 100,
      },
      loggedInUserId: userID,
      statusId: status.current?.value,
      searchText: searchValue,
      sortOptionId: sortOption.current?.value,
      // toolID:
      // toolTypeID
    };
    try {
      const response = await fetchGetIncidentSearchResult(data);
      setIncident(response);
      // incidents();
    } catch (error) {
      console.log(error);
    }
  };
  const handleIncidentClick = (item) => {
    setSelectedIncident(item);
    console.log("Clicked incident:", item);
  };

  return (
    <>
      <div className="card mb-5 mb-xl-8 bg-red incident-page">
        <div className="card-body1 py-3">
          <div className="row">
            <div className="col-md-4 border-1 border-gray-300 border-end">
              <div className="card">
                <div className="d-flex justify-content-between bd-highlight mb-3">
                  <div className="p-1 bd-highlight">
                    <h6 className="card-title align-items-start flex-column pt-2">
                      <span className="card-label fw-bold fs-5 mb-1">
                        Incidents <span className="text-black-50">(2)</span>
                      </span>
                    </h6>
                  </div>
                  <div className="p-1 bd-highlight"></div>
                </div>

                <div className="card-title">
                  {/* begin::Search */}
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Search Incident"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={handleSearch}
                    >
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                  {/* end::Search */}
                  <div className="d-flex justify-content-between bd-highlight mb-3">
                    <div className="mt-2 bd-highlight">
                      <div className="w-110px me-2">
                        <div>
                          <select
                            className="form-select"
                            data-kt-select2="true"
                            data-placeholder="Select option"
                            data-dropdown-parent="#kt_menu_637dc885a14bb"
                            data-allow-clear="true"
                            ref={status}
                            // onChange={handleStatusChange}
                          >
                            <option value="">Select</option>
                            {statusDropDown.length > 0 &&
                              statusDropDown.map((item) => (
                                <option key={item.dataID} value={item.dataID}>
                                  {item.dataValue}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 bd-highlight mt-4">Sort by</div>
                    <div className="mt-2 bd-highlight">
                      <div className="w-120px me-0">
                        <select
                          className="form-select"
                          data-kt-select2="true"
                          data-placeholder="Select option"
                          data-dropdown-parent="#kt_menu_637dc885a14bb"
                          data-allow-clear="true"
                          ref={sortOption}
                          // onChange={handleSortOptionChange}
                        >
                          <option value="">Select</option>
                          {incidentSortOptions.length > 0 &&
                            incidentSortOptions.map((item) => (
                              <option key={item.dataID} value={item.dataID}>
                                {item.dataValue}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="scroll-y h-400px">
                    <div className="incident-list">
                      <>
                        {incident && incident.length > 0 ? (
                          incident.map((item) => (
                            <div
                              className={`incident-section${
                                item.isSelected === "true" ? " selected" : ""
                              }`}
                              key={item.id}
                              onClick={() => handleIncidentClick(item)}
                            >
                              <div className="row">
                                <div className="text-dark col-md-9">
                                  <a href="#" className="text-dark">
                                    <span className="fw-bold">
                                      {item.subject}
                                    </span>
                                  </a>
                                </div>
                              </div>
                              <div className="row">
                                <div className="d-flex justify-content-between">
                                  <div className="p-2 bd-highlight">
                                    <div className="badge text-black fw-normal">
                                      {item.incidentStatusName}
                                      <div className="badge text-black fw-normal">
                                        {/* <i className="fas fa-copy"></i> */}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="pt-3 bd-highlight">
                                    <div className="badge text-black fw-normal">
                                      {item.createdDate}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr className="my-0" />
                              <div className="d-flex justify-content-between bd-highlight mt-2">
                                {item.ownerName ? (
                                  <div className="p-1 bd-highlight fs-14">
                                    {item.ownerName}
                                  </div>
                                ) : (
                                  <div className="p-1 bd-highlight fs-14">
                                    {item.createdUser}
                                  </div>
                                )}
                                <div className="p-1 bd-highlight">
                                  <div className="badge badge-light-primary mx-1">
                                  {item.priorityName}
                                  </div>
                                  <div className="badge badge-light-danger">
                                  {item.severityName}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center">Data not found.</div>
                        )}
                      </>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 border-1 border-gray-300 border-end chat-section border-top border-start">
              <ChatApp
                userId={sessionStorage.getItem("userId")}
                userName={sessionStorage.getItem("userName")}
                orgId={sessionStorage.getItem("orgId")}
              />
            </div>

            <IncidentDetails incident={selectedIncident} />
          </div>
        </div>
      </div>
    </>
  );
};

export { IncidentsPage };
