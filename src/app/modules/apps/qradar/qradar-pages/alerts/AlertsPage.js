import React from "react";
import { useMemo, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { KTSVG } from "../../../../../../_metronic/helpers";
import { GET_RECENT_OFFENSES } from "../../../../../../utils";
import { useTable, ColumnInstance, Row } from "react-table";
import { CustomHeaderColumn } from "../table/columns/CustomHeaderColumn";
import { CustomRow } from "../table/columns/CustomRow";
import {
  useQueryResponseData,
  useQueryResponseLoading,
} from "../core/QueryResponseProvider";
// import {usersColumns} from './columns/_columns'
import { User } from "../core/_models";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { UsersListPagination } from "../components/pagination/UsersListPagination";
import { KTCardBody } from "../../../../../../_metronic/helpers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FloatingLabel, Form } from "react-bootstrap";
import { useFormik } from "formik";
import EditAlertsPopUp from "./EditAlertsPopUp";
import { notify, notifyFail } from "../components/notification/Notification";
import {
  fetchMasterData,
  fetchUpdatSetAlertIrrelavantStatuseAlert,
} from "../../../../../api/Api";
import {
  fetchAlertData,
  fetchGetAlertNotesByAlertID,
  fetchSetAlertEscalationStatus,
  fetchSetOfAlerts,
  fetchUsers,
  fetchGetalertHistory,
} from "../../../../../api/AlertsApi";
import ReactPaginate from "react-paginate";
import { fetchCreateIncident} from "../../../../../api/IncidentsApi";
import { getCurrentTimeZone } from "../../../../../../utils/helper";
import "./Alerts.css";
import { useErrorBoundary } from "react-error-boundary";
import jsPDF from 'jspdf';
import 'jspdf-autotable';



const AlertsPage = () => {
  const handleError = useErrorBoundary();
  const [inputValue, setInputValue] = useState("");
  const [selectedAlert, setselectedAlert] = useState([]);
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownData, setDropdownData] = useState({
    severityNameDropDownData: [],
    statusDropDown: [],
    observableTagDropDown: [],
  });
  const [openEditPage, setOpenEditPage] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [selectCheckBox, setSelectCheckBox] = useState(null);
  console.log(selectCheckBox, "selectCheckBox");
  const {
    severityNameDropDownData,
    statusDropDown,
    observableTagDropDown,
  } = dropdownData;
  const handleFormSubmit = () => {
    setShowPopup(false);
  };
  const openEditPopUp = (item) => {
    setSelectedRow(item);
    setOpenEditPage(true);
  };
  const handleClose = () => {
    setOpenEditPage(false);
  };
  useEffect(() => {
    Promise.all([
      fetchMasterData("alert_Sevirity"),
      fetchMasterData("alert_status"),
      fetchMasterData("alert_Tags"),
    ])
      .then(([severityData, statusData, tagsData]) => {
        setDropdownData((prevDropdownData) => ({
          ...prevDropdownData,
          severityNameDropDownData: severityData,
          statusDropDown: statusData,
          observableTagDropDown: tagsData,
        }));
      })
      .catch((error) => {
        handleError(error);
      });
  }, []);
  const handleselectedAlert = (item, e) => {
    setSelectCheckBox(item);
    setIsCheckboxSelected(e.target.checked);
    const { value, checked } = e.target;
    if (checked) {
      setselectedAlert([...selectedAlert, value]);
    } else {
      setselectedAlert(selectedAlert.filter((e) => e !== value));
    }
  };
  const [actionsValue, setActionValue] = useState("");
  function createIncidentSubmit(e) {
    setActionValue(e.target.value);
  }
  const navigate = useNavigate();
  const [selectValue, setSelectValue] = useState();
  const onChange = (event) => {
    const value = event.target.value;
    setSelectValue(value);
  };
  const convertDate = (timestamp) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(timestamp);
  };
  const userID = Number(sessionStorage.getItem("userId"));
  const orgId = Number(sessionStorage.getItem("orgId"));
  const modifiedDate = new Date().toISOString();
  const [alertData, setAlertDate] = useState([]);
  const [filteredAlertData, setFilteredAlertDate] = useState([]);
  const [ldp_security_user, setldp_security_user] = useState([]);
  const [alertNotesList, setAlertNotesList] = useState([]);
  const [escalate, setEscalate] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [ignorVisible, setIgnorVisible] = useState(true);
  const [generateReport, setGenerateReport] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [limit, setLimit] = useState(20);
  const [pageCount, setpageCount] = useState(0);
  const [source, setSource] = useState([])
  const [selectedAlertId, setSelectedAlertId] = useState(null);
  console.log(selectedAlertId, "selectedAlertId")

  const [alertHistory, setAlertHistory] = useState([]);
  console.log(alertHistory, "alertHistory");
  const reloadHistory = () => {
    // Ensure that selectedAlertId is not null or undefined before making the API call
    if (selectedAlertId !== null && selectedAlertId !== undefined) {
      const data = {
        orgId,
        alertId: Number(selectedAlertId),
      };
      fetchGetalertHistory(data)
        .then((res) => {
          setAlertHistory(res);
        })
        .catch((error) => {
          handleError(error);
        });
    }
  };
  
  useEffect(() => {
    reloadHistory();
  }, [selectedAlertId]);
  useEffect(() => {
    reloadHistory()
  }, [selectedAlertId]);
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

  const handleCloseForm = () => {
    // notifyFail("Data not Updated");
    setShowForm(false);
  };
  const handleIgnoreSubmit = async () => {
    try {
      const { ownerUserID, modifiedDate } = selectCheckBox;
      const modifiedUserId = Number(sessionStorage.getItem("userId"));
      const orgId = Number(sessionStorage.getItem("orgId"));
      const data = {
        orgId,
        alertIDs: selectedAlert,
        ownerID: ownerUserID,
        modifiedUserId,
        modifiedDate,
      };
      const response = await fetchUpdatSetAlertIrrelavantStatuseAlert(data);
      notify("Alert marked as Irrelevant/Ignore");
      setIgnorVisible(false);
      setShowForm(false);
      qradaralerts();
    } catch (error) {
      handleError(error);
    }
  };
  const handleTableRefresh = () => {
    qradaralerts();
  };

  const handlePageSelect = (event) => {
    const selectedPerPage = event.target.value;
    setLimit(selectedPerPage);
  };
  const [delay, setDelay] = useState(1);
  const isLoading = true;
  const [alertsCount, setAlertsCount] = useState(0);
  const { values, handleChange: handleEscalate, handleSubmit } = useFormik({
    initialValues: {
      owner: "",
      comments: "",
    },
    onSubmit: async (values) => {
      const orgId = Number(sessionStorage.getItem("orgId"));
      const modifiedUserId = Number(sessionStorage.getItem("userId"));
      const modifiedDate = new Date().toISOString();
      const data = {
        modifiedDate,
        modifiedUserId,
        orgId,
        alertIDs: selectedAlert,
        ownerID: values.owner,
        notes: values.comments,
      };
      const response = await fetchSetAlertEscalationStatus(data);
      if (response.isSuccess) {
        qradaralerts();
        notify("Alert Escalated");
        setEscalate(false);
        setShowForm(false);
      }
      handleEscalate({
        target: {
          name: "owner",
          value: "",
        },
      });
      handleEscalate({
        target: {
          name: "comments",
          value: "",
        },
      }).catch((error) => {
        handleError(error);
      });
    },
  });
  const slaCal = (data) => {
    data.map((item) => {
      let resolvedTime = item.resolvedtime ? getCurrentTimeZone(item.resolvedtime) : new Date();
      let detectedTime = item.detectedtime ? getCurrentTimeZone(item.detectedtime) : null;

      if (resolvedTime && detectedTime) {
        let timeDifferenceMs = new Date(resolvedTime) - new Date(detectedTime);

        // Convert milliseconds to days, hours, and minutes
        let days = Math.floor(timeDifferenceMs / (24 * 60 * 60 * 1000));
        let hours = Math.floor((timeDifferenceMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        let minutes = Math.floor((timeDifferenceMs % (60 * 60 * 1000)) / (60 * 1000));

        // Format the time difference
        let formattedTimeDifference = `${days}d${hours}h${minutes}m`;
        item.sla = formattedTimeDifference;
      }
    });
  }

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setLoading(true)
    const setOfAlertsData = await fetchSetOfAlerts(
      currentPage,
      orgId,
      userID,
      limit
    );
    slaCal(setOfAlertsData);
    setFilteredAlertDate(
      setOfAlertsData.filter((item) => item.ownerUserID === userID)
    );
    setFilteredAlertDate(setOfAlertsData);
    setCurrentPage(currentPage);
    setLoading(false)
  };


  const qradaralerts = async () => {
    let data2 = {
      orgID: orgId,
      toolID: "1",
      toolTypeID: "1",
      paging: {
        rangeStart: 1,
        rangeEnd: limit,
      },
      loggedInUserId: userID,
    };
    setLoading(true)
    const response = await fetchAlertData(data2);

    setAlertsCount(response.totalOffenseCount);
    setSource(response.source)
    setAlertDate(response.alertsList != null ? response.alertsList : []);
    const total = response.totalOffenseCount;
    setpageCount(Math.ceil(total / limit));
    slaCal(response?.alertsList);
    setLoading(false)
    {
      if (userID === 1) {
        setFilteredAlertDate(response.alertsList);
      } else {
        let result =
          response.alertsList != null
            ? response.alertsList.filter((item) => item.ownerUserID === userID)
            : [];
        setFilteredAlertDate(result);
      }
    }

  };
  useEffect(() => {
    qradaralerts();
  }, [limit]);
  useEffect(() => {
    const fetchData = async () => {
      // qradaralerts();
      // setTimeout(() => {
      //   setDelay((delay) => delay + 1);
      // }, 60000);
      const response = await fetchUsers(orgId);
      setldp_security_user(
        response?.usersList != undefined ? response?.usersList : []
      );
    };

    fetchData();
  }, [delay]);
  useEffect(() => {
    if (actionsValue === "1") {
      const data = {
        orgId,
        createDate: modifiedDate,
        createUserId: userID,
        alertIDs: selectedAlert,
      };

      fetchCreateIncident(data).then((response) => {
        if (response.isSuccess) {
          notify("Incident Created");
          setTimeout(() => {
            navigate("/qradar/incidents");
          }, 2000);
        } else {
          setShowForm(false);
          notifyFail("Incident Creation Failed");
        }
      });
    }
  }, [actionsValue]);

  console.log(filteredAlertData, "filteredAlertData");
  const handleChange = (e, field) => {
    console.log(e.target.value);
    console.log(alertData);
    console.log(field);
    console.log(alertData.filter((it) => it[field] === e.target.value));
    let data = alertData.filter((it) => it[field] === e.target.value);
    setFilteredAlertDate(data.length > 0 ? data : alertData);
  };
  const onActionsClick = () => {
    if (isCheckboxSelected) {
      setIsCheckboxSelected(true);
    }
    setShowForm(true);
    setEscalate(true);
    setIgnorVisible(true);
    setGenerateReport(true)
  };
  const handleSort = (e, field) => {
    let temp = [...alertData];
    let data =
      e.target.value === "Dec"
        ? temp.sort((a, b) => Number(b[field]) - Number(a[field]))
        : temp.sort((a, b) => Number(a[field]) - Number(b[field]));
    setFilteredAlertDate(data);
  };
  const handleSortDates = (e, field) => {
    console.log(field);
    let temp = [...alertData];
    let data =
      e.target.value === "New"
        ? temp.sort((a, b) => new Date(b[field]) - new Date(a[field]))
        : temp.sort((a, b) => new Date(a[field]) - new Date(b[field]));
    setFilteredAlertDate(data);
  };
  const handleSearch = (e) => {
    setInputValue(e.target.value);
    if (!e.target.value) return setFilteredAlertDate(alertData);
    let data = alertData.filter((it) =>
      it.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredAlertDate(data);
  };
  const handleRefresh = (event) => {
    event.preventDefault();
    setIsRefreshing(true);
    qradaralerts();
    setTimeout(() => setIsRefreshing(false), 2000);
  };
  const RefreshInterval = 2 * 60 * 1000;

  useEffect(() => {
    let isActive = true;

    const refreshIntervalId = setInterval(() => {
      if (isActive && currentPage === 1) {
        setIsRefreshing(true);
        qradaralerts();
        setTimeout(() => {
          setIsRefreshing(false);
        }, 2000);
      } else {
        setIsRefreshing(false);
      }
    }, RefreshInterval);

    return () => {
      isActive = false;
      clearInterval(refreshIntervalId);
    };
  }, [currentPage]);
  const handleTdClick = async (itemId) => {
    setSelectedAlertId(itemId);
    try {
      const data = { alertID: itemId };
      const alertNotesList = await fetchGetAlertNotesByAlertID(data);
      setAlertNotesList(alertNotesList);
      // reloadHistory();
    } catch (error) {
      handleError(error);
    }
  };
  const handleGenerateReport = () => {
    const tableData = [selectCheckBox];
    generatePDFFromTable(tableData);
    notify('Generated Report Successfully')
    setGenerateReport(false)
    setShowForm(false)
  };

  const generatePDFFromTable = (tableData) => {
    const doc = new jsPDF();

    doc.autoTable({
      head: [['Severity', 'SLA', 'Score', 'Status', 'Detected time', 'Name', 'Observables tags', 'Owner', 'Source']],
      body: tableData.map((item) => [item.severityName, item.sla, item.score === null ? "0" : item.score, item.status, item.detectedtime, item.name, item.observableTag, item.ownerusername, item.source]),
    });

    doc.save('Report.pdf');
  };

  return (
    <KTCardBody className="alert-page">
      <ToastContainer />

      <div className="card mb-5 mb-xl-8">
        <div className="card-header border-0">
          <h3 className="card-title align-items-start flex-column">
            {/* <span className='card-label fw-bold fs-3 mb-1'>
              Alerts {'( ' + alertData.length + ' / ' + alertsCount + ')'}
            </span> */}
            <span className="card-label fw-bold fs-3">
              Alerts{" "}
              {"( " + filteredAlertData.length + " / " + alertsCount + ")"}
            </span>
          </h3>

          <div className="card-toolbar">
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              <div className="m-0">
                <a
                  href="#"
                  className={`btn btn-sm btn-flex btn-primary fw-bold fs-14 btn-new ${!isCheckboxSelected && "disabled"
                    }`}
                  data-kt-menu-trigger="click"
                  data-kt-menu-placement="bottom-end"
                  onClick={onActionsClick}
                >
                  <span className="svg-icon svg-icon-6 svg-icon-muted me-1">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  Actions
                </a>
                <div
                  className="menu menu-sub menu-sub-dropdown w-250px w-md-300px alert-action"
                  data-kt-menu="true"
                  id="kt_menu_637dc6f8a1c15"
                >
                  {showForm && (
                    <div className="px-5 py-5">
                      <div className="mb-5">
                        <div className="d-flex justify-content-end mb-5">
                          {/* <div>
                            <label className="form-label fw-bolder">
                              Select:
                            </label>
                          </div> */}
                          <div>
                            <div
                              className="close fs-20 text-muted pointer"
                              aria-label="Close"
                              onClick={handleCloseForm}
                            >
                              <span
                                aria-hidden="true"
                                style={{ color: "inherit", textShadow: "none" }}
                              >
                                &times;
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <select
                            onChange={createIncidentSubmit}
                            className="form-select form-select-solid"
                            data-kt-select2="true"
                            data-control="select2"
                            data-placeholder="Select option"
                            data-dropdown-parent="#kt_menu_637dc6f8a1c15"
                            data-allow-clear="true"
                          >
                            <option>Select</option>
                            <option
                              value="1"
                              onClick={createIncidentSubmit}
                              disabled={
                                selectCheckBox.alertIncidentMappingId > 0
                              }
                            >
                              Create Incident
                            </option>
                            <option value="2">Escalate</option>
                            <option value="3">Irrelevant / Ignore</option>
                            <option value="4">Generate Report</option>
                          </select>
                        </div>
                      </div>
                      {actionsValue === "2" && escalate && (
                        <form onSubmit={handleSubmit}>
                          <div className="mb-5">
                            <label
                              className="form-label fw-bolder"
                              htmlFor="ownerName"
                            >
                              Owner <sup className="red">*</sup>:
                            </label>
                            <div>
                              <select
                                id="ownerName"
                                className="form-select form-select-solid"
                                data-placeholder="Select option"
                                data-allow-clear="true"
                                value={values.owner}
                                name="owner"
                                onChange={handleEscalate}
                                required
                              >
                                <option value="">Select</option>
                                {ldp_security_user.length > 0 &&
                                  ldp_security_user.map((item, index) => {
                                    return (
                                      <option key={index} value={item?.userID}>
                                        {item?.name}
                                      </option>
                                    );
                                  })}
                              </select>
                            </div>
                          </div>
                          <div className="mb-5">
                            <label
                              className="form-label fw-bolder"
                              htmlFor="excalatecomments"
                            >
                              Comments <sup className="red">*</sup>:
                            </label>
                            <Form.Control
                              as="textarea"
                              placeholder="Leave a comment here"
                              value={values.comments}
                              id="excalatecomments"
                              name="comments"
                              onChange={handleEscalate}
                              style={{ height: "100px" }}
                              required
                            />
                          </div>
                          <div className="d-flex justify-content-end">
                            <button
                              type="submit"
                              className="btn btn-primary btn-small btn-new"
                            >
                              Submit
                            </button>
                            &nbsp;&nbsp;
                            <button
                              className="btn btn-secondary btn-small ml-10"
                              onClick={handleCloseForm}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                      {actionsValue === "3" && ignorVisible && (
                        <div className="d-flex justify-content-end">
                          <button
                            type="button"
                            className="btn btn-primary btn-small btn-new"
                            onClick={handleIgnoreSubmit}
                          >
                            Submit
                          </button>
                        </div>
                      )}
                      {actionsValue === "4" && generateReport && (
                        <div className="d-flex justify-content-end">
                          <button
                            type="button"
                            className="btn btn-primary btn-small btn-new"
                            onClick={handleGenerateReport}
                          >
                            Download Report
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="clearfix" />
        <div className="float-right fs-15 lh-40 fc-gray text-right ds-reload">
          Alerts is automatically refreshing every 2 minutes{" "}
          <a href="#" onClick={handleRefresh}>
            <i className={`fa fa-refresh ${isRefreshing ? "rotate" : ""}`} />
          </a>
        </div>
        {openEditPage ? (
          <EditAlertsPopUp
            show={openEditPage}
            onClose={handleClose}
            onAdd={openEditPopUp}
            row={selectedRow}
            ldp_security_user={ldp_security_user}
            onSubmit={handleFormSubmit}
            dropdownData={dropdownData}
            onTableRefresh={handleTableRefresh}
          />
        ) : null}
        <div className="card-body1 py-3" id="kt_accordion_1">
          <div className="table-responsive alert-table">
            <table className="table align-middle gs-0 gy-4">
              <thead>
                <tr className="fw-bold bg-light">
                  <th className="w-25px">
                    {/* <div className="form-check form-check-sm form-check-custom form-check-solid">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="1"
                      />
                    </div> */}
                  </th>
                  <th className="min-w-90px">
                    Severity
                    <div className="m-0 float-right table-filter">
                      <a
                        href="#"
                        className=""
                        data-kt-menu-trigger="click"
                        data-kt-menu-placement="bottom-end"
                      >
                        <span className="svg-icon svg-icon-6 svg-icon-muted me-1">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </a>
                      <div
                        className="menu menu-sub menu-sub-dropdown w-250px w-md-250px"
                        data-kt-menu="true"
                        id="kt_menu_637dc885a14bb"
                      >
                        <div className="px-2 py-5">
                          <div>
                            <div>
                              <select
                                className="form-select form-select-solid"
                                data-kt-select2="true"
                                data-placeholder="Select option"
                                data-dropdown-parent="#kt_menu_637dc885a14bb"
                                data-allow-clear="true"
                                onChange={(e) =>
                                  handleChange(e, "severityName")
                                }
                              >
                                <option value="">Select</option>
                                {severityNameDropDownData.length > 0 &&
                                  severityNameDropDownData.map((item) => (
                                    <option
                                      key={item.dataID}
                                      value={item.dataValue}
                                    >
                                      {item.dataValue}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className="min-wd-60px">
                    SLA
                    <div className="m-0 float-right table-filter">
                      <a
                        href="#"
                        className=""
                        data-kt-menu-trigger="click"
                        data-kt-menu-placement="bottom-end"
                      >
                        <span className="svg-icon svg-icon-6 svg-icon-muted me-1">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </a>
                      <div
                        className="menu menu-sub menu-sub-dropdown w-250px w-md-250px"
                        data-kt-menu="true"
                        id="kt_menu_637dc885a14bb"
                      >
                        <div className="px-2 py-5">
                          <div>
                            <div>
                              <select
                                className="form-select form-select-solid"
                                data-kt-select2="true"
                                data-placeholder="Select option"
                                data-dropdown-parent="#kt_menu_637dc885a14bb"
                                data-allow-clear="true"
                                onChange={(e) =>
                                  handleSortDates(e, "detectedtime")
                                }
                              >
                                <option>Select</option>
                                <option value="New">Desc</option>
                                <option value="Old">Asc</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className="min-w-70px">
                    Score
                    <div className="m-0 float-right table-filter">
                      <a
                        href="#"
                        className=""
                        data-kt-menu-trigger="click"
                        data-kt-menu-placement="bottom-end"
                      >
                        <span className="svg-icon svg-icon-6 svg-icon-muted me-1">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </a>
                      <div
                        className="menu menu-sub menu-sub-dropdown w-250px w-md-250px"
                        data-kt-menu="true"
                        id="kt_menu_637dc885a14bb"
                      >
                        <div className="px-2 py-5">
                          <div>
                            <div>
                              <select
                                className="form-select form-select-solid"
                                data-kt-select2="true"
                                data-placeholder="Select option"
                                data-dropdown-parent="#kt_menu_637dc885a14bb"
                                data-allow-clear="true"
                                onChange={(e) => handleSort(e, "severity")}
                              >
                                <option>Select</option>
                                <option value="Dec">Desc</option>
                                <option value="Asc">Asc</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className="min-w-90px">
                    Status
                    <div className="m-0 float-right table-filter">
                      <a
                        href="#"
                        className=""
                        data-kt-menu-trigger="click"
                        data-kt-menu-placement="bottom-end"
                      >
                        <span className="svg-icon svg-icon-6 svg-icon-muted me-1">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </a>
                      <div
                        className="menu menu-sub menu-sub-dropdown w-250px w-md-250px"
                        data-kt-menu="true"
                        id="kt_menu_637dc885a14bb"
                      >
                        <div className="px-2 py-5">
                          <div>
                            <div>
                              <select
                                className="form-select form-select-solid"
                                data-kt-select2="true"
                                data-placeholder="Select option"
                                data-dropdown-parent="#kt_menu_637dc885a14bb"
                                data-allow-clear="true"
                                onChange={(e) => handleChange(e, "status")}
                              >
                                <option value="">Select</option>
                                {statusDropDown.length > 0 &&
                                  statusDropDown.map((item) => (
                                    <option
                                      key={item.dataID}
                                      value={item.dataValue}
                                    >
                                      {item.dataValue}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className="min-w-120px" style={{ width: 140 }}>
                    Detected time
                    <div className="m-0 float-right table-filter">
                      <a
                        href="#"
                        className=""
                        data-kt-menu-trigger="click"
                        data-kt-menu-placement="bottom-end"
                      >
                        <span className="svg-icon svg-icon-6 svg-icon-muted me-1">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </a>
                      <div
                        className="menu menu-sub menu-sub-dropdown w-250px w-md-250px"
                        data-kt-menu="true"
                        id="kt_menu_637dc885a14bb"
                      >
                        <div className="px-2 py-5">
                          <div>
                            <div>
                              <select
                                className="form-select form-select-solid"
                                data-kt-select2="true"
                                data-placeholder="Select option"
                                data-dropdown-parent="#kt_menu_637dc885a14bb"
                                data-allow-clear="true"
                                onChange={(e) =>
                                  handleSortDates(e, "detectedtime")
                                }
                              >
                                <option>Select</option>
                                <option value="New">Desc</option>
                                <option value="Old">Asc</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className="min-w-50px">
                    Name
                    <div className="m-0 float-right table-filter">
                      <a
                        href="#"
                        className=""
                        data-kt-menu-trigger="click"
                        data-kt-menu-placement="bottom-end"
                      >
                        <span className="svg-icon svg-icon-6 svg-icon-muted me-1">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </a>
                      <div
                        className="menu menu-sub menu-sub-dropdown w-250px w-md-250px"
                        data-kt-menu="true"
                        id="kt_menu_637dc885a14bb"
                      >
                        <div className="px-2 py-5">
                          <div>
                            <div>
                              <input
                                value={inputValue}
                                onChange={(e) => handleSearch(e)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className="min-w-130px">
                    Observables tags
                    <div className="m-0 float-right table-filter">
                      <a
                        href="#"
                        className=""
                        data-kt-menu-trigger="click"
                        data-kt-menu-placement="bottom-end"
                      >
                        <span className="svg-icon svg-icon-6 svg-icon-muted me-1">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </a>
                      <div
                        className="menu menu-sub menu-sub-dropdown w-250px w-md-250px"
                        data-kt-menu="true"
                        id="kt_menu_637dc885a14bb"
                      >
                        <div className="px-2 py-5">
                          <div>
                            <div>
                              <select
                                className="form-select form-select-solid"
                                data-kt-select2="true"
                                data-placeholder="Select option"
                                data-dropdown-parent="#kt_menu_637dc885a14bb"
                                data-allow-clear="true"
                                onChange={(e) =>
                                  handleChange(e, "observableTag")
                                }
                              >
                                <option>Select</option>
                                {observableTagDropDown.length > 0 &&
                                  observableTagDropDown.map((item) => (
                                    <option
                                      key={item.dataID}
                                      value={item.dataValue}
                                    >
                                      {item.dataValue}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className="min-w-80px">
                    Owner
                    <div className="m-0 float-right table-filter">
                      <a
                        href="#"
                        className=""
                        data-kt-menu-trigger="click"
                        data-kt-menu-placement="bottom-end"
                      >
                        <span className="svg-icon svg-icon-6 svg-icon-muted me-1">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </a>
                      <div
                        className="menu menu-sub menu-sub-dropdown w-250px w-md-250px"
                        data-kt-menu="true"
                        id="kt_menu_637dc885a14bb"
                      >
                        <div className="px-2 py-5">
                          <div>
                            <div>
                              <select
                                className="form-select form-select-solid"
                                data-kt-select2="true"
                                data-placeholder="Select option"
                                data-dropdown-parent="#kt_menu_637dc885a14bb"
                                data-allow-clear="true"
                                onChange={(e) =>
                                  handleChange(e, "ownerusername")
                                }
                              >
                                <option>Select</option>
                                {ldp_security_user.length > 0 &&
                                  ldp_security_user.map((item, index) => {
                                    return (
                                      <option key={index} value={item?.name}>
                                        {item?.name}
                                      </option>
                                    );
                                  })}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className="min-w-80px">
                    Source{" "}
                    <div className="m-0 float-right table-filter">
                      <a
                        href="#"
                        className=""
                        data-kt-menu-trigger="click"
                        data-kt-menu-placement="bottom-end"
                      >
                        <span className="svg-icon svg-icon-6 svg-icon-muted me-1">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </a>
                      <div
                        className="menu menu-sub menu-sub-dropdown w-250px w-md-250px"
                        data-kt-menu="true"
                        id="kt_menu_637dc885a14bb"
                      >
                        <div className="px-2 py-5">
                          <div>
                            <div>
                              <select
                                className="form-select form-select-solid"
                                data-kt-select2="true"
                                data-placeholder="Select option"
                                data-dropdown-parent="#kt_menu_637dc885a14bb"
                                data-allow-clear="true"
                                onChange={(e) => handleChange(e, "source")}
                              >
                                <option>Select</option>
                                {source.length > 0 &&
                                  source.map((item, index) => (
                                    <option key={index} value={item}>
                                      {item}
                                    </option>
                                  ))}
                              </select>


                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody id="kt_accordion_1">
                {loading && <UsersListLoading />}
                {filteredAlertData.length > 0 &&
                  filteredAlertData.map((item, index) => (
                    <>
                      <tr key={item.alertID}>
                        <td>
                          <div className="form-check form-check-sm form-check-custom form-check-solid">
                            <input
                              className="form-check-input widget-13-check"
                              type="checkbox"
                              value={item.alertID}
                              name={item.alertID}
                              onChange={(e) => handleselectedAlert(item, e)}
                              autoComplete="off"
                            />
                            {/* check incident creation */}
                            <span>
                              {item.status === "New" && item.alertIncidentMappingId === 0 ? (
                                <i
                                  className="fa fa-circle-exclamation incident-icon red"
                                  title="Alert"
                                />
                              ) : (
                                <i
                                  className="fa fa-circle-exclamation incident-icon green"
                                  title="Incident created"
                                />
                              )}

                              {item.status !== "New" && item.alertIncidentMappingId === 0 && (
                                <i
                                  className="fa fa-circle-exclamation incident-icon orange"
                                  title="Incident not created"
                                />
                              )}
                            </span>

                          </div>
                        </td>
                        <td
                          key={index}
                          id={"kt_accordion_1_header_" + index}
                          data-bs-toggle="collapse"
                          data-bs-target={"#kt_accordion_1_body_" + index}
                          aria-expanded="false"
                          aria-controls={"kt_accordion_1_body_" + index}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleTdClick(item.alertID)}
                        >
                          {item.severityName}
                        </td>
                        <td>
                          <span className="text-dark text-hover-primary d-block mb-1">
                            {item.sla}
                          </span>
                        </td>
                        <td>
                          <span className="text-dark text-center text-hover-primary d-block mb-1">
                            {item.score === null || item.score === "" ? "0" : item.score}
                          </span>
                        </td>
                        <td>{item.status}</td>
                        <td>
                          <span className="text-dark text-hover-primary d-block mb-1">
                            <span>
                              {item.detectedtime &&
                                getCurrentTimeZone(item.detectedtime)
                              }
                            </span>
                          </span>
                        </td>
                        <td className="text-dark text-hover-primary fs-8 alert-name">
                          <span title={item.name}>{item.name}</span>
                        </td>
                        <td className="text-dark text-hover-primary fs-8">
                          {item.observableTag}
                        </td>
                        <td className="text-dark text-hover-primary fs-8">
                          {" "}
                          {item.ownerusername}
                        </td>
                        <td className="text-dark fw-bold text-hover-primary fs-8">
                          {item.source}
                        </td>
                      </tr>
                      <tr
                        id={"kt_accordion_1_body_" + index}
                        className="accordion-collapse collapse"
                        aria-labelledby={"kt_accordion_1_header_" + index}
                        data-bs-parent="#kt_accordion_1"
                      >
                        <td colSpan="10">
                          <div className="row">
                            <div className="col-md-7">
                              <div className="row">
                                <div className="col-md-1"></div>
                                <div className="col-md-9">
                                  <b>Alert Name : </b>
                                  {item.name}
                                  <br />
                                  <b>Score : </b>
                                  {item.score === null || item.score === "" ? "0" : item.score}
                                  <br />
                                  <b>SLA : </b>
                                  {item.sla}
                                  <br />
                                  <b>Severity : </b>
                                  {item.severityName}
                                  <br />
                                  <b>Status : </b>
                                  {item.status}
                                  <br />
                                  <b>Detected Date/Time : </b>
                                  {item.detectedtime &&
                                    getCurrentTimeZone(item.detectedtime)
                                  }
                                  {/* {new Date(item.detectedtime).toLocaleString()} */}
                                  <br />
                                  <b>Observable Tag : </b>
                                  {item.observableTag} <br />
                                  <b>Owner Name : </b>
                                  {item.ownerusername} <br />
                                  <b>Source Name : </b>
                                  {item.source} <br />
                                  {/* Notes Section */}
                                  {alertNotesList.length > 0 ? (
                                    <div className="notes-container mt-5 pt-5">
                                      <b>Notes:</b>
                                      <table className="table">
                                        <thead>
                                          <tr>
                                            <th className="custom-th">
                                              Created User
                                            </th>
                                            <th className="custom-th">
                                              Created Date
                                            </th>
                                            <th className="custom-th">Note</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {alertNotesList
                                            .sort(
                                              (a, b) =>
                                                getCurrentTimeZone(b.createdDate) -
                                                getCurrentTimeZone(a.createdDate)
                                            ) // Sort the notes based on createdDate
                                            .map((note) => (
                                              <tr key={note.alertsNotesId}>
                                                <td>{note.createdUser}</td>
                                                <td>{getCurrentTimeZone(note.createdDate)}</td>
                                                <td>{note.notes}</td>
                                              </tr>
                                            ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <div>No notes available.</div>
                                  )}
                                </div>
                                <div className="col-md-2">
                                  <div
                                    className="btn btn-primary btn-new btn-small"
                                    onClick={() => openEditPopUp(item)}
                                  >
                                    Edit {""}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-5">
                              <div className="row">
                                <div className="text-center">
                                  <h4>Timeline</h4>
                                </div>
                                <div className="timeline-section" style={{ maxHeight: '300px', overflowY: 'auto', width:'99%' }}>

                                  <div className="pt-6 h-600px">
                                    <div className="timeline-label">
                                      {alertHistory && alertHistory.length > 0 ? (
                                        alertHistory.map((item) => {
                                          const formattedDateTime = getCurrentTimeZone(item.historyDate);

                                          return (
                                            <div className="timeline-item" key={item.id}>
                                              <div className="timeline-label fw-bold text-gray-800 fs-6">
                                                <p>{formattedDateTime}</p>
                                                <p className="text-muted">{item.createdUser}</p>
                                              </div>

                                              <div className="timeline-badge">
                                                <i className={`fa fa-genderless ${getRandomClass()} fs-1`}></i>
                                              </div>
                                              <div className="fw-semibold text-gray-700 ps-3 fs-7">
                                                {item.historyDescription}
                                              </div>
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <div className="text-gray-500 text-center">No data found</div>
                                      )}


                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    </>
                  ))}
                {filteredAlertData.length === 0 && (
                  <tr>
                    <td colSpan="10" className="text-center">
                      Data not found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end align-items-center pagination-bar">
            <ReactPaginate
              previousLabel=<i className="fa fa-chevron-left" />
              nextLabel=<i className="fa fa-chevron-right" />
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={8}
              onPageChange={handlePageClick}
              containerClassName={"pagination justify-content-end"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item custom-previous"}
              previousLinkClassName={"page-link custom-previous-link"}
              nextClassName={"page-item custom-next"}
              nextLinkClassName={"page-link custom-next-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              activeClassName={"active"}
            />
            <div className="col-md-3 d-flex justify-content-end align-items-center">
              <span className="col-md-4">Count: </span>
              <select
                className="form-select form-select-sm col-md-4"
                value={limit}
                onChange={handlePageSelect}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <UsersListPagination />
    </KTCardBody>
  );
};
export { AlertsPage };
