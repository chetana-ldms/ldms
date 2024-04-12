import { useMemo, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { UsersListPagination } from "../components/pagination/UsersListPagination";
import { KTCardBody } from "../../../../../../_metronic/helpers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Dropdown, FloatingLabel, Form, Modal } from "react-bootstrap";
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
  fetchSentinelOneAlert,
  fetchAnalystVerdictUpdateUrl,
  fetchConnectToNetworkUrl,
  fetchDisConnectFromNetworkUrl,
  fetchThreatsActionUrl,
  fetchAlertsStatusUpdateUrl,
} from "../../../../../api/AlertsApi";
import MitigationModal from "./MitigationModal";
import ReactPaginate from "react-paginate";
import { fetchCreateIncident } from "../../../../../api/IncidentsApi";
import { getCurrentTimeZone } from "../../../../../../utils/helper";
import "./Alerts.css";
import { useErrorBoundary } from "react-error-boundary";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AddToBlockListModal from "./AddToBlockListModal";
import AddToExclusionsModal from "./AddToExclusionsModal";
import AddANoteModal from "./AddANoteModal";

const AlertsPage = () => {
  const handleError = useErrorBoundary();
  const [inputValue, setInputValue] = useState("");
  const [selectedAlert, setselectedAlert] = useState([]);
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const globalAdminRole = Number(sessionStorage.getItem("globalAdminRole"));
  const clientAdminRole = Number(sessionStorage.getItem("clientAdminRole"));
  const [dropdownData, setDropdownData] = useState({
    severityNameDropDownData: [],
    statusDropDown: [],
    observableTagDropDown: [],
    analystVerdictDropDown: [],
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
    analystVerdictDropDown,
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
      fetchMasterData("analyst_verdict"),
    ])
      .then(([severityData, statusData, tagsData, verdictData]) => {
        setDropdownData((prevDropdownData) => ({
          ...prevDropdownData,
          severityNameDropDownData: severityData,
          statusDropDown: statusData,
          observableTagDropDown: tagsData,
          analystVerdictDropDown: verdictData,
        }));
      })
      .catch((error) => {
        handleError(error);
      });
  }, []);

  const handleselectedAlert = (item, e) => {
    setSelectCheckBox(item);
    // setIsCheckboxSelected(e.target.checked);
    const { value, checked } = e.target;
    if (checked) {
      setselectedAlert([...selectedAlert, value]);
      setIsCheckboxSelected(true);
    } else {
      setselectedAlert(selectedAlert.filter((e) => e !== value));
      // const updatedAlert = selectedAlert.filter((e) => e !== value);
      //   setselectedAlert(updatedAlert);
      //   setIsCheckboxSelected(updatedAlert.length > 0);
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
  const [generateReport, setGenerateReport] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [limit, setLimit] = useState(20);
  const [pageCount, setpageCount] = useState(0);
  const [source, setSource] = useState([]);
  const [showMoreActionsModal, setShowMoreActionsModal] = useState(false);
  const [addToBlockListModal, setAddToBlockListModal] = useState(false);
  const [addToExclusionsModal, setAddToExclusionsModal] = useState(false);
  const [addANoteModal, setAddANoteModal] = useState(false);
  const [sentinalOne, setSentinalOne] = useState([]);
  console.log(sentinalOne, "sentinalOne");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedAlertId, setSelectedAlertId] = useState(null);
  console.log(selectedAlertId, "selectedAlertId");
  const [AnalystVerdictDropDown, setAnalystVerdictDropDown] = useState(false);
  const [selectedVerdict, setSelectedVerdict] = useState("");
  const [StatusDropDown, setStatusDropDown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [endpointInfo, setEndpointInfo] = useState([]);
  console.log(endpointInfo, "endpointInfo");
  const [networkHistory, setNetworkHistory] = useState([]);
  console.log(networkHistory, "networkHistory");
  const [threatHeaderDtls, setThreatHeaderDtls] = useState([]);
  console.log(threatHeaderDtls, "threatHeaderDtls");
  const [threatInfo, setThreatInfo] = useState([]);
  console.log(threatInfo, "threatInfo");
  const [alertHistory, setAlertHistory] = useState([]);
  console.log(alertHistory, "alertHistory");
  const reloadHistory = () => {
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
  const reloadNotes = async () => {
    try {
      if (selectedAlertId !== null && selectedAlertId !== undefined) {
        const data = { alertID: selectedAlertId };
        const alertNotesList = await fetchGetAlertNotesByAlertID(data);
        const alertNoteSort = alertNotesList.sort((a, b) => {
          return b.alertsNotesId - a.alertsNotesId;
        });
        setAlertNotesList(alertNoteSort);
      }
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    reloadNotes();
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
        // ownerID: ownerUserID,
        modifiedUserId,
        modifiedDate,
        notes: "",
      };
      const response = await fetchUpdatSetAlertIrrelavantStatuseAlert(data);
      if (response.isSuccess) {
        notify(response.message);
        setIgnorVisible(false);
        setShowForm(false);
        qradaralerts();
        reloadHistory();
        reloadNotes();
      } else {
        notifyFail(response.message);
      }
    } catch (error) {
      handleError(error);
    }
  };
  const handleTableRefresh = () => {
    qradaralerts();
    reloadHistory();
    reloadNotes();
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
        ownerUserId: values.owner,
        notes: values.comments,
      };
      const response = await fetchSetAlertEscalationStatus(data);
      if (response.isSuccess) {
        qradaralerts();
        reloadHistory();
        reloadNotes();
        notify(response.message);
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
    if (data !== null) {
      data.map((item) => {
        let resolvedTime = item.resolvedtime
          ? getCurrentTimeZone(item.resolvedtime)
          : new Date();
        let detectedTime = item.detectedtime
          ? getCurrentTimeZone(item.detectedtime)
          : null;
        if (resolvedTime && detectedTime) {
          let timeDifferenceMs =
            new Date(resolvedTime) - new Date(detectedTime);
          // Convert milliseconds to days, hours, and minutes
          let days = Math.floor(timeDifferenceMs / (24 * 60 * 60 * 1000));
          let hours = Math.floor(
            (timeDifferenceMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
          );
          let minutes = Math.floor(
            (timeDifferenceMs % (60 * 60 * 1000)) / (60 * 1000)
          );
          // Format the time difference
          let formattedTimeDifference = `${days}D ${hours}H : ${minutes}M`;
          item.sla = formattedTimeDifference;
        }
      });
    } else {
      console.log("No data available");
    }
  };
  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setLoading(true);
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
    setLoading(false);
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
    setLoading(true);
    const response = await fetchAlertData(data2);
    setAlertsCount(response.totalOffenseCount);
    setSource(response.source);
    setAlertDate(response.alertsList != null ? response.alertsList : []);
    const total = response.totalOffenseCount;
    setpageCount(Math.ceil(total / limit));
    slaCal(response?.alertsList);
    setFilteredAlertDate(response?.alertsList);
    setLoading(false);
    // {
    //   if (globalAdminRole === 1) {
    //     setFilteredAlertDate(response.alertsList);
    //   }
    //    else {
    //     let result =
    //       response.alertsList != null
    //         ? response.alertsList.filter((item) => item.ownerUserID === userID)
    //         : [];
    //     setFilteredAlertDate(result);
    //   }
    // }
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
    setGenerateReport(true);
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
    reloadNotes();
    reloadHistory();
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
      if (orgId === 2) {
        const sentinalOneDetails = await fetchSentinelOneAlert(itemId);
        setSentinalOne(sentinalOneDetails);
        const endpoint_Info = sentinalOneDetails.endpoint_Info;
        setEndpointInfo(endpoint_Info);
        const networkHistory = sentinalOneDetails.networkHistory;
        setNetworkHistory(networkHistory);
        const threatHeaderDtls = sentinalOneDetails.threatHeaderDtls;
        setThreatHeaderDtls(threatHeaderDtls);
        const threatInfo = sentinalOneDetails.threatInfo;
        setThreatInfo(threatInfo);
      } else {
        console.log("No data found");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleGenerateReport = () => {
    const tableData = [selectCheckBox];
    generatePDFFromTable(tableData);
    notify("Generated Report Successfully");
    setGenerateReport(false);
    setShowForm(false);
  };
  const generatePDFFromTable = (tableData) => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "Severity",
          "SLA",
          "Score",
          "Status",
          "Detected time",
          "Name",
          "Observables tags",
          "Owner",
          "Source",
        ],
      ],
      body: tableData.map((item) => [
        item.severityName,
        item.sla,
        item.score === null ? "0" : item.score,
        item.status,
        item.detectedtime,
        item.name,
        item.observableTag,
        item.ownerusername,
        item.source,
      ]),
    });
    doc.save("Report.pdf");
  };
  const handleMoreActionsClick = () => {
    setShowMoreActionsModal(false);
  };
  const handleThreatActions = () => {
    setShowDropdown(true);
  };
  const handleDropdownSelect = async (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    if (value === "MitigationAction") {
      setShowMoreActionsModal(true);
    } else if (value === "AddToBlockList") {
      setAddToBlockListModal(true);
    } else if (value === "AddToExclusions") {
      setAddToExclusionsModal(true);
    } else if (value === "AddANote") {
      setAddANoteModal(true);
    } else if (value === "ConnectToNetwork") {
      const data = {
        orgID: orgId,
        alertIds: selectedAlert,
      };
      try {
        const responseData = await fetchConnectToNetworkUrl(data);
        const { isSuccess } = responseData;
        if (isSuccess) {
          notify("Add to network");
        } else {
          notifyFail("Connect To Network Failed");
        }
      } catch (error) {
        console.error(error);
      }
      setShowDropdown(false);
    } else if (value === "DisconnectFromNetwork") {
      const data = {
        orgID: orgId,
        alertIds: selectedAlert,
      };
      try {
        const responseData = await fetchDisConnectFromNetworkUrl(data);
        const { isSuccess } = responseData;
        if (isSuccess) {
          notify("Disconnect from network");
        } else {
          notifyFail("Disconnect from network Failed");
        }
      } catch (error) {
        console.error(error);
      }
      setShowDropdown(false);
    } else if (value === "Unquarantine") {
      const data = {
        orgID: orgId,
        alertIds: selectedAlert,
        kill: false,
        quarantine: false,
        remediate: false,
        rollback: false,
        unQuarantine: true,
        networkQuarantine: false,
      };
      try {
        const responseData = await fetchThreatsActionUrl(data);
        const { isSuccess } = responseData;
        if (isSuccess) {
          notify("UnQuarantine Succesfull");
        } else {
          notifyFail("UnQuarantine Failed");
        }
      } catch (error) {
        console.error(error);
      }
      setShowDropdown(false);
    } else {
      setShowDropdown(false);
    }
  };
  const handleShowDropdown = () => {
    setShowDropdown(false);
  };
  const handleCloseMoreActionsModal = () => {
    setShowMoreActionsModal(false);
    setShowDropdown(false);
  };
  const handleAction = () => {
    handleCloseMoreActionsModal();
  };
  const handleCloseAddToBlockList = () => {
    setAddToBlockListModal(false);
    setShowDropdown(false);
  };
  const handleActionAddToBlockList = () => {
    setAddToBlockListModal(false);
  };
  const handleCloseAddToExclusions = () => {
    setAddToExclusionsModal(false);
    setShowDropdown(false);
  };
  const handleActionAddToExclusions = () => {
    setAddToExclusionsModal(false);
  };
  const handleCloseAddANote = () => {
    setAddANoteModal(false);
    setShowDropdown(false);
  };
  const handleActionAddANote = () => {
    setAddANoteModal(false);
  };
  const handleAnalystsVerdict = () => {
    setAnalystVerdictDropDown(true);
  };
  const handleAnalystsVerdictClose = () => {
    setAnalystVerdictDropDown(false);
  };
  const handleAnalystsVerdictDropDown = (event) => {
    setSelectedVerdict(event.target.value);
  };
  const handleSubmitAnalystVerdict = async () => {
    try {
      const modifiedUserId = Number(sessionStorage.getItem("userId"));
      const data = {
        orgID: orgId,
        alertIds: selectedAlert,
        analystVerdictId: selectedVerdict,
        modifiedDate,
        modifiedUserId,
      };
      const responseData = await fetchAnalystVerdictUpdateUrl(data);
      const { isSuccess, message } = responseData;
      if (isSuccess) {
        notify(message);
        qradaralerts();
        reloadHistory();
        reloadNotes();
      } else {
        notifyFail(message);
      }
      setAnalystVerdictDropDown(false);
    } catch (error) {
      console.error(error);
    }
  };
  const handleStatus = () => {
    setStatusDropDown(!AnalystVerdictDropDown);
  };
  const handleStatusClose = () => {
    setStatusDropDown(false);
  };
  const handleStatusDropDown = (event) => {
    setSelectedStatus(event.target.value);
  };
  const handleSubmitStatus = async () => {
    try {
      const modifiedUserId = Number(sessionStorage.getItem("userId"));
      const data = {
        orgID: orgId,
        alertIds: selectedAlert,
        statusId: selectedStatus,
        modifiedDate,
        modifiedUserId,
      };
      const responseData = await fetchAlertsStatusUpdateUrl(data);
      const { isSuccess, message } = responseData;
      if (isSuccess) {
        notify(message);
        qradaralerts();
        reloadHistory();
        reloadNotes();
      } else {
        notifyFail(message);
      }
      setStatusDropDown(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <KTCardBody className="alert-page">
      <ToastContainer />

      <div className="mb-5 pad-10">
        <div className="d-flex justify-content-between border-0">
          <h3 className="align-items-start flex-column">
            <span className="fw-bold fs-3">
              Alerts{" "}
              {"( " +
                (filteredAlertData !== null && filteredAlertData.length !== null
                  ? filteredAlertData.length
                  : 0) +
                " / " +
                alertsCount +
                ")"}
            </span>
          </h3>

          <div className="card-toolbar">
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              <div className="m-0">
                <a
                  href="#"
                  className={`btn btn-small btn-flex btn-primary fw-bold fs-14 btn-new ${
                    !isCheckboxSelected && "disabled"
                  }`}
                  data-kt-menu-trigger="click"
                  data-kt-menu-placement="bottom-end"
                  onClick={handleStatus}
                >
                  Status
                </a>

                <div
                  className="menu menu-sub menu-sub-dropdown w-250px w-md-300px alert-action"
                  data-kt-menu="true"
                >
                  {StatusDropDown && (
                    <div className="px-5 py-5">
                      <div className="mb-5">
                        <div className="d-flex justify-content-end mb-5">
                          <div>
                            <div
                              className="close fs-20 text-muted pointer"
                              aria-label="Close"
                              onClick={handleStatusClose}
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
                        <select
                          className="form-select form-select-solid"
                          data-kt-select2="true"
                          data-placeholder="Select option"
                          data-dropdown-parent="#kt_menu_637dc885a14bb"
                          data-allow-clear="true"
                          onChange={handleStatusDropDown}
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
                      <div className="text-right">
                        <button
                          className="btn btn-primary"
                          onClick={handleSubmitStatus}
                        >
                          {" "}
                          Submit{" "}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="m-0">
                <a
                  href="#"
                  className={`btn btn-small btn-flex btn-primary fw-bold fs-14 btn-new ${
                    !isCheckboxSelected && "disabled"
                  }`}
                  data-kt-menu-trigger="click"
                  data-kt-menu-placement="bottom-end"
                  onClick={handleAnalystsVerdict}
                >
                  Analyst Verdict
                </a>

                <div
                  className="menu menu-sub menu-sub-dropdown w-250px w-md-300px alert-action"
                  data-kt-menu="true"
                >
                  {AnalystVerdictDropDown && (
                    <div className="px-5 py-5">
                      <div className="mb-5">
                        <div className="d-flex justify-content-end mb-5">
                          <div>
                            <div
                              className="close fs-20 text-muted pointer"
                              aria-label="Close"
                              onClick={handleAnalystsVerdictClose}
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
                        <select
                          className="form-select form-select-solid"
                          data-kt-select2="true"
                          data-placeholder="Select option"
                          data-dropdown-parent="#kt_menu_637dc885a14bb"
                          data-allow-clear="true"
                          onChange={handleAnalystsVerdictDropDown}
                        >
                          <option>Select</option>
                          {analystVerdictDropDown.length > 0 &&
                            analystVerdictDropDown.map((item) => (
                              <option key={item.dataID} value={item.dataID}>
                                {item.dataValue}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="text-right">
                        <button
                          className="btn btn-new btn-small"
                          onClick={handleSubmitAnalystVerdict}
                        >
                          {" "}
                          Submit{" "}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {orgId === 2 && (
                <>
                  <div className="m-0">
                    <a
                      href="#"
                      className={`btn btn-small btn-flex btn-primary fw-bold fs-14 btn-new ${
                        !isCheckboxSelected && "disabled"
                      }`}
                      data-kt-menu-trigger="click"
                      data-kt-menu-placement="bottom-end"
                      onClick={handleThreatActions}
                    >
                      Other Action
                    </a>
                    <div
                      className="menu menu-sub menu-sub-dropdown w-250px w-md-300px alert-action"
                      data-kt-menu="true"
                    >
                      {showDropdown && (
                        <div className="px-5 py-5">
                          <div className="mb-5">
                            <div className="d-flex justify-content-end mb-5">
                              <div>
                                <div
                                  className="close fs-20 text-muted pointer"
                                  aria-label="Close"
                                  onClick={handleShowDropdown}
                                >
                                  <span
                                    aria-hidden="true"
                                    style={{
                                      color: "inherit",
                                      textShadow: "none",
                                    }}
                                  >
                                    &times;
                                  </span>
                                </div>
                              </div>
                            </div>
                            <select
                              onChange={handleDropdownSelect}
                              className="form-select form-select-solid"
                              data-kt-select2="true"
                              data-control="select2"
                              data-placeholder="Select option"
                              data-allow-clear="true"
                            >
                              <option value="" className="p-2">
                                Select
                              </option>
                              <option value="MitigationAction" className="mb-2">
                                Mitigation Action
                              </option>
                              <option value="AddToBlockList" className="mb-2">
                                Add To Blocklist
                              </option>
                              <option value="AddToExclusions" className="p-2">
                                Add To Exclusions
                              </option>
                              <option value="Unquarantine" className="p-2">
                                Unquarantine
                              </option>
                              <option value="AddANote" className="p-2">
                                Add A Note
                              </option>
                              <option value="ConnectToNetwork" className="p-2">
                                Connect To Network
                              </option>
                              <option
                                value="DisconnectFromNetwork"
                                className="p-2"
                              >
                                Disconnect From Network
                              </option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                    {showMoreActionsModal && (
                      <MitigationModal
                        show={showMoreActionsModal}
                        handleClose={handleCloseMoreActionsModal}
                        handleAction={handleAction}
                        selectedValue={selectedValue}
                        selectedAlert={selectedAlert}
                      />
                    )}
                    {addToBlockListModal && (
                      <AddToBlockListModal
                        show={addToBlockListModal}
                        handleClose={handleCloseAddToBlockList}
                        handleAction={handleActionAddToBlockList}
                        selectedValue={selectedValue}
                        selectedAlert={selectedAlert}
                      />
                    )}
                    {addToExclusionsModal && (
                      <AddToExclusionsModal
                        show={addToExclusionsModal}
                        handleClose={handleCloseAddToExclusions}
                        handleAction={handleActionAddToExclusions}
                        selectedValue={selectedValue}
                        selectedAlert={selectedAlert}
                      />
                    )}
                    {addANoteModal && (
                      <AddANoteModal
                        show={addANoteModal}
                        handleClose={handleCloseAddANote}
                        handleAction={handleActionAddANote}
                        selectedValue={selectedValue}
                        selectedAlert={selectedAlert}
                      />
                    )}
                  </div>
                </>
              )}
              <div className="m-0">
                <a
                  href="#"
                  className={`btn btn-small btn-flex btn-primary fw-bold fs-14 btn-new ${
                    !isCheckboxSelected && "disabled"
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
                  className="menu-sub menu-sub-dropdown w-250px w-md-300px alert-action"
                  data-kt-menu="true"
                  id="kt_menu_637dc6f8a1c15"
                >
                  {showForm && (
                    <div className="px-5 py-5">
                      <div className="mb-5">
                        <div className="d-flex justify-content-end mb-5">
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
                              Owner <sup className="red">*</sup>
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
                              Comments <sup className="red">*</sup>
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
      </div>
      <div className="clearfix" />
      <div className="card pad-10">
        <div>
          <div className="d-flex justify-content-end align-items-center pagination-bar">
            {/* <ReactPaginate
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
            </div> */}
          </div>
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
          <div className="table-responsive alert-table scroll-x">
            <table className="table align-middle gs-0 gy-4">
              <thead>
                <tr className="fw-bold bg-light">
                  <th className="w-25px"></th>
                  <th>
                    Severity
                    <span className="m-0 table-filter">
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
                    </span>
                  </th>
                  <th>
                    SLA
                    <span className="m-0 table-filter">
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
                    </span>
                  </th>
                  <th>
                    Score
                    <span className="m-0 table-filter">
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
                    </span>
                  </th>
                  <th>
                    Status
                    <span className="m-0 table-filter">
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
                    </span>
                  </th>
                  <th style={{ width: 140 }}>
                    Detected Time
                    <span className="m-0 table-filter">
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
                    </span>
                  </th>
                  <th>
                    Name
                    <span className="m-0 table-filter">
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
                    </span>
                  </th>
                  <th>
                    Observables Tags
                    <span className="m-0 table-filter">
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
                    </span>
                  </th>
                  <th>
                    Owner
                    <span className="m-0 table-filter">
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
                    </span>
                  </th>
                  <th>
                    Source{" "}
                    <span className="m-0 table-filter">
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
                              {source == null ? (
                                <select
                                  className="form-select form-select-solid"
                                  data-kt-select2="true"
                                  data-placeholder="Select option"
                                  data-dropdown-parent="#kt_menu_637dc885a14bb"
                                  data-allow-clear="true"
                                  onChange={(e) => handleChange(e, "source")}
                                >
                                  <option>Select</option>
                                </select>
                              ) : (
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
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody id="kt_accordion_1">
                {loading && <UsersListLoading />}
                {filteredAlertData !== null ? (
                  filteredAlertData.map((item, index) => (
                    <>
                      <tr className="table-row" key={item.alertID}>
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
                            <span>
                              {item.status === "New" &&
                              item.alertIncidentMappingId === 0 ? (
                                <i
                                  className="fa fa-circle-exclamation incident-icon red"
                                  title="No Action Innitiated"
                                />
                              ) : item.status !== "New" &&
                                item.alertIncidentMappingId === 0 ? (
                                <i
                                  className="fa fa-circle-exclamation incident-icon orange"
                                  title="Incident not created"
                                />
                              ) : (
                                <i
                                  className="fa fa-circle-exclamation incident-icon green"
                                  title="Incident created"
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
                          <span className="link underline">
                            {item.severityName}
                          </span>
                        </td>
                        <td>
                          <span className="text-dark d-block mb-1">
                            {item.sla}
                          </span>
                        </td>
                        <td>
                          <span className="text-dark text-center d-block mb-1">
                            {item.score === null || item.score === ""
                              ? "0"
                              : item.score}
                          </span>
                        </td>
                        <td>{item.status}</td>
                        <td>
                          <span className="text-dark d-block mb-1">
                            <span>
                              {item.detectedtime &&
                                getCurrentTimeZone(item.detectedtime)}
                            </span>
                          </span>
                        </td>
                        <td className="text-dark fs-8 alert-name">
                          <span title={item.name}>{item.name}</span>
                        </td>
                        <td className="text-dark fs-8">{item.observableTag}</td>
                        <td className="text-dark fs-8">
                          {" "}
                          {item.ownerusername}
                        </td>
                        <td className="text-dark fw-bold fs-8">
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
                            <div className="col-md-12">
                              <div className="card pad-10">
                                {/* Tab Navigation */}
                                <ul
                                  className="nav nav-tabs"
                                  id={`alertTabs_${index}`}
                                  role="tablist"
                                >
                                  <li className="nav-item" role="presentation">
                                    <a
                                      className="nav-link active"
                                      id={`detailsTab_${index}`}
                                      data-bs-toggle="tab"
                                      href={`#details_${index}`}
                                      role="tab"
                                      aria-controls={`details_${index}`}
                                      aria-selected="true"
                                    >
                                      Details
                                    </a>
                                  </li>
                                  {orgId == 2 && (
                                    <li
                                      className="nav-item"
                                      role="presentation"
                                    >
                                      <a
                                        className="nav-link"
                                        id={`moreDetailsTab_${index}`}
                                        data-bs-toggle="tab"
                                        href={`#moreDetails_${index}`}
                                        role="tab"
                                        aria-controls={`moreDetails_${index}`}
                                        aria-selected="false"
                                      >
                                        More Details
                                      </a>
                                    </li>
                                  )}
                                  <li className="nav-item" role="presentation">
                                    <a
                                      className="nav-link"
                                      id={`notesTab_${index}`}
                                      data-bs-toggle="tab"
                                      href={`#notes_${index}`}
                                      role="tab"
                                      aria-controls={`notes_${index}`}
                                      aria-selected="false"
                                    >
                                      Notes
                                    </a>
                                  </li>
                                  <li className="nav-item" role="presentation">
                                    <a
                                      className="nav-link"
                                      id={`timelineTab_${index}`}
                                      data-bs-toggle="tab"
                                      href={`#timeline_${index}`}
                                      role="tab"
                                      aria-controls={`timeline_${index}`}
                                      aria-selected="false"
                                    >
                                      Timeline
                                    </a>
                                  </li>
                                  {/* {orgId === 2 && (
                                      <li
                                        className="nav-item"
                                        role="presentation"
                                      >
                                        <a
                                          className="nav-link"
                                          id={`otherActionsTab_${index}`}
                                          data-bs-toggle="tab"
                                          href={`#otherActions_${index}`}
                                          role="tab"
                                          aria-controls={`otherActions_${index}`}
                                          aria-selected="false"
                                        >
                                          Other Action
                                        </a>
                                      </li>
                                    )} */}
                                </ul>
                                <div className="tab-content pt-4">
                                  <div
                                    className="tab-pane fade show active"
                                    id={`details_${index}`}
                                    role="tabpanel"
                                    aria-labelledby={`detailsTab_${index}`}
                                  >
                                    <div className="row alert-accordion">
                                      <div className="col-md-10">
                                        <div className="alert-details">
                                          <b>Alert Name </b>
                                          <span>{item.name}</span>
                                        </div>
                                        <div className="alert-details">
                                          <b>Score</b>
                                          <span>
                                            {item.score === null ||
                                            item.score === ""
                                              ? "0"
                                              : item.score}
                                          </span>
                                        </div>
                                        <div className="alert-details">
                                          <b>SLA </b>
                                          <span>{item.sla}</span>
                                        </div>
                                        <div className="alert-details">
                                          <b>Severity </b>
                                          <span>{item.severityName}</span>
                                        </div>
                                        <div className="alert-details">
                                          <b>Status </b>
                                          <span>{item.status}</span>
                                        </div>
                                        <div className="alert-details">
                                          <b>Detected Date/Time </b>
                                          <span>
                                            {item.detectedtime &&
                                              getCurrentTimeZone(
                                                item.detectedtime
                                              )}
                                          </span>
                                        </div>
                                        <div className="alert-details">
                                          <b>Observable Tag </b>
                                          <span>{item.observableTag} </span>
                                        </div>
                                        <div className="alert-details">
                                          <b>Owner Name </b>
                                          <span>{item.ownerusername}</span>
                                        </div>
                                        <div className="alert-details">
                                          <b>Analysts Verdict </b>
                                          <span>{item.positiveAnalysis} </span>
                                        </div>
                                        <div className="alert-details">
                                          <b>Source Name </b>
                                          <span>{item.source}</span>{" "}
                                        </div>
                                      </div>
                                      <div className="col-md-2">
                                        <div
                                          className="btn btn-primary btn-new btn-small"
                                          onClick={() => openEditPopUp(item)}
                                        >
                                          Edit
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className="tab-pane fade"
                                    id={`moreDetails_${index}`}
                                    role="tabpanel"
                                    aria-labelledby={`moreDetailsTab_${index}`}
                                  >
                                    {orgId == 2 ? (
                                      <div className="h-300px scroll-y">
                                        <div className="row">
                                          {/* <div className="col-md-1 py-4 text-center">
                                            <i
                                              className="bi bi-check-square text-success"
                                              style={{
                                                fontSize: "2rem",
                                                width: "2em",
                                                height: "2em",
                                              }}
                                            ></i>
                                          </div> */}
                                          <div className="col-md-9">
                                            <div className="d-flex ">
                                              <div className="border-right">
                                                {" "}
                                                <span className="semi-bold">
                                                  Threat status :
                                                </span>{" "}
                                                {threatHeaderDtls.threatStatus}
                                              </div>
                                              <div className="border-right px-1">
                                                <span className="semi-bold">
                                                  AI Confidence level :{" "}
                                                </span>
                                                {
                                                  threatHeaderDtls.aiConfidenceLevel
                                                }
                                              </div>
                                              <div className="border-right px-1 d-flex align-items-center">
                                                <span className="semi-bold">
                                                  Analyst Verdict:
                                                </span>
                                                {/* <input
                                                  type="text"
                                                  className="ml-2"
                                                  style={{ width: "110px" }}
                                                  value={
                                                    threatHeaderDtls.analysisVerdict
                                                  }
                                                /> */}
                                                {
                                                  threatHeaderDtls.analysisVerdict
                                                }
                                              </div>
                                              <div className="px-1 d-flex align-items-center">
                                                <span className="semi-bold">
                                                  Incident Status:
                                                </span>
                                                {/* <input
                                                  type="text"
                                                  style={{ width: "110px" }}
                                                  className="ml-2"
                                                  value={
                                                    threatHeaderDtls.incidentStatus
                                                  }
                                                /> */}
                                                {
                                                  threatHeaderDtls.incidentStatus
                                                }
                                              </div>
                                            </div>
                                            {/* <hr /> */}
                                            <div className="mt-3">
                                              <span className="semi-bold">
                                                Mitigation Actions Taken :
                                              </span>
                                              {threatHeaderDtls?.miticationActions ? (
                                                threatHeaderDtls?.miticationActions.map(
                                                  (item, index) => (
                                                    <span
                                                      key={index}
                                                      className="m-2"
                                                    >
                                                      {item}{" "}
                                                      <i className="bi bi-check green fs-20 v-middle"></i>
                                                    </span>
                                                  )
                                                )
                                              ) : (
                                                <span>
                                                  No mitigation actions
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          <div className="col-md-3">
                                            <div className="row">
                                              <div className="col-md-2 text-center py-3">
                                                <i className="bi bi-stopwatch fs-20"></i>
                                              </div>
                                              <div className="col-md-10">
                                                <p className="mb-2">
                                                  <span className="semi-bold">
                                                    Identified Time :{" "}
                                                  </span>
                                                  <span>
                                                    {getCurrentTimeZone(
                                                      threatHeaderDtls.identifiedTime
                                                    )}
                                                  </span>
                                                </p>
                                                <p className="mb-2">
                                                  <span className="semi-bold">
                                                    Reporting Time :{" "}
                                                  </span>
                                                  <span>
                                                    {getCurrentTimeZone(
                                                      threatHeaderDtls.reportingTime
                                                    )}
                                                  </span>
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        {/* <div className="fs-12">NETWORK HISTORY</div>
                                  <hr className="my-2" />
                                  <div className="row">
                                    <div className="col-md-4 border-right">
                                      <div className="row  p-3">
                                        <div className="col-md-3">
                                          <i className="bi bi-clock" style={{ fontSize: '3em', lineHeight: 1 }}></i>
                                        </div>
                                        <div className="col-md-9">
                                          <p>First seen <span>Oct 30, 2023 08:41:36</span></p>
                                          <p>Last seen <span>Oct 30, 2023 08:41:36</span></p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-4 border-right">
                                      <div className="row p-3">
                                        <div className="col-md-3">
                                          <i className="bi bi-circle" style={{ fontSize: '3em', lineHeight: 1 }}></i>
                                        </div>
                                        <div className="col-md-9">
                                          <p>Only 1 time on the current endpoint</p>
                                          <p>1 Account / 1 Set / 1 Group</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="row p-3">
                                        <div className="col-md-3">
                                          <i className="bi bi-search" style={{ fontSize: '3em', lineHeight: 1 }}></i>
                                        </div>
                                        <div className="col-md-9">
                                          <p>Find this Hash on Deep Visibality</p>
                                          <button className="btn btn-dark btn-sm">Hunt Now</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div> */}
                                        <hr />
                                        <div className="row">
                                          <div className="fs-12 col-md-6">
                                            THREAT FILE NAME {threatInfo.name}
                                          </div>
                                          <div className="fs-14 mt-5 text-primary col-md-6 text-end">
                                            {/* <span className="mx-5"><i className="fas fa-copy mx-3"></i> Copy Details</span>
                                        <span className="mx-5"><i className="fas fa-file mx-3"></i> Download Threat Files</span> */}
                                          </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                          <div className="col-md-7">
                                            <div className="row">
                                              <div className="col-md-3 ">
                                                <p className="semi-bold">
                                                  Path:{" "}
                                                </p>
                                                {/* <p>Command Line Arguments</p> */}
                                                <p className="semi-bold">
                                                  Process User:
                                                </p>
                                                {/* <p>Publisher Name</p> */}
                                                {/* <p> Signer Identity</p> */}
                                                {/* <p>Signature Verification</p> */}
                                                <p className="semi-bold">
                                                  Original Process:
                                                </p>
                                                <p className="semi-bold">
                                                  SHA1:
                                                </p>
                                              </div>
                                              <div className="col-md-9">
                                                <p>{threatInfo.path}</p>
                                                {/* <p>NA</p> */}
                                                <p>{threatInfo.processUser}</p>
                                                {/* <p>FH Manager</p> */}
                                                {/* <p>FH Manager</p> */}
                                                {/* <p>Signature varified</p> */}
                                                <p>
                                                  {
                                                    threatInfo.originatingProcess
                                                  }
                                                </p>
                                                <p>{threatInfo.shA1}</p>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-md-5">
                                            <div className="row">
                                              <div className="col-md-4 ">
                                                <p className="semi-bold">
                                                  Initiated By
                                                </p>
                                                {/* <p>Engine</p> */}
                                                <p className="semi-bold">
                                                  Detection Type
                                                </p>
                                                <p className="semi-bold">
                                                  Classification
                                                </p>
                                                <p className="semi-bold">
                                                  {" "}
                                                  File Size
                                                </p>
                                                <p className="semi-bold">
                                                  Storyline
                                                </p>
                                                <p className="semi-bold">
                                                  Threat id
                                                </p>
                                              </div>
                                              <div className="col-md-6">
                                                <p>{threatInfo.initiatedBy}</p>
                                                {/* <p>SentinalOne Cloud</p> */}
                                                <p>
                                                  {threatInfo.detectionType}
                                                </p>
                                                <p>
                                                  {threatInfo.classification}
                                                </p>
                                                <p>{threatInfo.fileSize}</p>
                                                <p>{threatInfo.storyline}</p>
                                                <p>{threatInfo.threatId}</p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <hr />
                                        <h4>END POINT</h4>
                                        {/* <hr className="my-2" /> */}

                                        <div className="row">
                                          <div className="col-md-5">
                                            <div className="row">
                                              <p className="semi-bold">
                                                Real Time Data about the end
                                                point:
                                              </p>
                                              <div className="row">
                                                <div className="col-md-3">
                                                  <span>
                                                    <i
                                                      className="fab fa-windows"
                                                      style={{
                                                        fontSize: "6em",
                                                        width: "2em",
                                                      }}
                                                    ></i>
                                                  </span>
                                                </div>
                                                <div className="col-md-9">
                                                  <h6>DESCTOP-UPU1TUD</h6>
                                                  <p className="fs-12">
                                                    LANCESOFT INDIA PRIVATE
                                                    LIMITE / Defoult site
                                                  </p>
                                                  <p className="fs-10">
                                                    (Connect Homes/ Defoult)
                                                    Group
                                                  </p>
                                                </div>
                                              </div>
                                              <hr />
                                              <div className="col-md-4 ">
                                                {/* <p>Console connectivity</p> */}
                                                <p className="mb-2 semi-bold">
                                                  Full Disc scan:
                                                </p>
                                                <p className="semi-bold">
                                                  Pending Reboot:
                                                </p>
                                                {/* <p>Number of not Mitigated Threats</p> */}
                                                <p className="semi-bold">
                                                  {" "}
                                                  Network status:
                                                </p>
                                              </div>
                                              <div className="col-md-8">
                                                {/* <p>{endpointInfo.consoleConnectivity}</p> */}
                                                <p>
                                                  {endpointInfo.fullDiskScan}
                                                </p>
                                                <p>
                                                  {endpointInfo.pendinRreboot}
                                                </p>
                                                {/* <p>0</p> */}
                                                <p>
                                                  {endpointInfo.networkStatus}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-md-7">
                                            <div className="row">
                                              <div className="col-md-3 ">
                                                {/* <p>At Detection time :</p> */}
                                                <p className="semi-bold">
                                                  Scope:
                                                </p>
                                                <p className="semi-bold">
                                                  OS Version:
                                                </p>
                                                <p className="semi-bold">
                                                  Agent Version:
                                                </p>
                                                <p className="semi-bold">
                                                  {" "}
                                                  Policy:
                                                </p>
                                                <p className="semi-bold">
                                                  Logged in user:
                                                </p>
                                                <p className="semi-bold">
                                                  UUID:
                                                </p>
                                                <p className="semi-bold">
                                                  Domain:
                                                </p>
                                                <p className="semi-bold">
                                                  IP v4 Address:
                                                </p>
                                                <p className="semi-bold">
                                                  IP v6 Address:
                                                </p>
                                                <p className="semi-bold">
                                                  Console Visible adress:
                                                </p>
                                                <p className="semi-bold">
                                                  Subscription Time:
                                                </p>
                                              </div>
                                              <div className="col-md-9">
                                                {/* <p>.</p> */}
                                                <p>{endpointInfo.scope}</p>
                                                <p>{endpointInfo.osVersion}</p>
                                                <p>
                                                  {endpointInfo.agentVersion}
                                                </p>
                                                <p>{endpointInfo.policy}</p>
                                                <p>
                                                  {endpointInfo.loggedInUser}
                                                </p>
                                                <p>{endpointInfo.uuid}</p>
                                                <p>{endpointInfo.domain}</p>
                                                <p>
                                                  {endpointInfo.ipV4Address}
                                                </p>
                                                <p>
                                                  {endpointInfo.ipV6Address}
                                                </p>
                                                <p>
                                                  {
                                                    endpointInfo.consoleVisibleIPAddress
                                                  }
                                                </p>
                                                <p>
                                                  {
                                                    endpointInfo.subscriptionTime
                                                  }
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <span>No Data found</span>
                                    )}
                                  </div>
                                  <div
                                    className="tab-pane fade"
                                    id={`notes_${index}`}
                                    role="tabpanel"
                                    aria-labelledby={`notesTab_${index}`}
                                  >
                                    {alertNotesList.length > 0 ? (
                                      <div className="notes-container alert-table">
                                        <div className="float-right fs-13 fc-gray text-right ds-reload">
                                          <a href="#" onClick={handleRefresh}>
                                            <i
                                              className={`fa fa-refresh link ${
                                                isRefreshing ? "rotate" : ""
                                              }`}
                                              title="Auto refresh every 2 minutes"
                                            />
                                          </a>
                                        </div>
                                        <table className="table">
                                          <thead>
                                            <tr>
                                              <th className="custom-th">
                                                User
                                              </th>
                                              <th className="custom-th">
                                                Date
                                              </th>
                                              <th className="custom-th">
                                                Note
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {alertNotesList.map((note) => (
                                              <tr key={note.alertsNotesId}>
                                                <td>{note.createdUser}</td>
                                                <td>
                                                  {getCurrentTimeZone(
                                                    note.createdDate
                                                  )}
                                                </td>
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
                                  <div
                                    className="tab-pane fade"
                                    id={`timeline_${index}`}
                                    role="tabpanel"
                                    aria-labelledby={`timelineTab_${index}`}
                                  >
                                    <div className="row">
                                      <div className="row">
                                        <div className="col-md-1"></div>
                                        <div className="col-md-11">
                                          <div className="timeline-section h-300px scroll-y">
                                            <div className="pt-6 h-600px">
                                              <div className="timeline-label">
                                                <div className="float-right fs-13 fc-gray text-right ds-reload">
                                                  <a
                                                    href="#"
                                                    onClick={handleRefresh}
                                                  >
                                                    <i
                                                      className={`fa fa-refresh link ${
                                                        isRefreshing
                                                          ? "rotate"
                                                          : ""
                                                      }`}
                                                      title="Auto refresh every 2 minutes"
                                                    />
                                                  </a>
                                                </div>
                                                {alertHistory &&
                                                alertHistory.length > 0 ? (
                                                  alertHistory
                                                    .sort(
                                                      (a, b) =>
                                                        b.alertHistoryId -
                                                        a.alertHistoryId
                                                    )
                                                    .map((item) => {
                                                      const formattedDateTime = getCurrentTimeZone(
                                                        item.historyDate
                                                      );

                                                      return (
                                                        <div
                                                          className="timeline-item"
                                                          key={item.id}
                                                        >
                                                          <div className="timeline-label fw-bold text-gray-800 fs-6">
                                                            <p className="semi-bold">
                                                              {
                                                                formattedDateTime
                                                              }
                                                            </p>
                                                            <p className="text-muted normal">
                                                              {item.createdUser}
                                                            </p>
                                                          </div>

                                                          <div className="timeline-badge">
                                                            <i
                                                              className={`fa fa-genderless ${getRandomClass()} fs-1`}
                                                            ></i>
                                                          </div>
                                                          <div className="fw-semibold text-gray-700 ps-3 fs-7">
                                                            {
                                                              item.historyDescription
                                                            }
                                                          </div>
                                                        </div>
                                                      );
                                                    })
                                                ) : (
                                                  <div className="text-gray-500 text-center">
                                                    No data found
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* <div className="tab-content">
                                    {orgId === 2 && (
                                      <div
                                        className="tab-pane"
                                        id={`otherActions_${index}`}
                                        role="tabpanel"
                                        aria-labelledby={`otherActionsTab_${index}`}
                                      >
                                        <>
                                          <div className="m-0 text-center">
                                            <a
                                              href="#"
                                              className="btn btn-small btn-flex btn-primary fw-bold fs-14 btn-new "
                                              data-kt-menu-trigger="click"
                                              data-kt-menu-placement="bottom-end"
                                              onClick={handleThreatActions}
                                            >
                                              Other Action
                                            </a>
                                            <div
                                              className="menu menu-sub menu-sub-dropdown w-250px w-md-300px alert-action"
                                              data-kt-menu="true"
                                            >
                                              {showDropdown && (
                                                <div className="px-5 py-5">
                                                  <div className="mb-5">
                                                    <div className="d-flex justify-content-end mb-5">
                                                      <div>
                                                        <div
                                                          className="close fs-20 text-muted pointer"
                                                          aria-label="Close"
                                                          onClick={
                                                            handleShowDropdown
                                                          }
                                                        >
                                                          <span
                                                            aria-hidden="true"
                                                            style={{
                                                              color: "inherit",
                                                              textShadow:
                                                                "none",
                                                            }}
                                                          >
                                                            &times;
                                                          </span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <select
                                                      onChange={
                                                        handleDropdownSelect
                                                      }
                                                      className="form-select form-select-solid"
                                                      data-kt-select2="true"
                                                      data-control="select2"
                                                      data-placeholder="Select option"
                                                      data-allow-clear="true"
                                                    >
                                                      <option
                                                        value=""
                                                        className="p-2"
                                                      >
                                                        Select
                                                      </option>
                                                      <option
                                                        value="MitigationAction"
                                                        className="mb-2"
                                                      >
                                                        Mitigation Action
                                                      </option>
                                                      <option
                                                        value="AddToBlockList"
                                                        className="mb-2"
                                                      >
                                                        Add To Blocklist
                                                      </option>
                                                      <option
                                                        value="AddToExclusions"
                                                        className="p-2"
                                                      >
                                                        Add To Exclusions
                                                      </option>
                                                      <option
                                                        value="Unquarantine"
                                                        className="p-2"
                                                      >
                                                        Unquarantine
                                                      </option>
                                                      <option
                                                        value="AddANote"
                                                        className="p-2"
                                                      >
                                                        Add a Note
                                                      </option>
                                                      <option
                                                        value="ConnectToNetwork"
                                                        className="p-2"
                                                      >
                                                        Connect To Network
                                                      </option>
                                                      <option
                                                        value="DisconnectFromNetwork"
                                                        className="p-2"
                                                      >
                                                        Disconnect From Network
                                                      </option>
                                                    </select>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                            {showMoreActionsModal && (
                                              <MitigationModal
                                                show={showMoreActionsModal}
                                                handleClose={
                                                  handleCloseMoreActionsModal
                                                }
                                                handleAction={handleAction}
                                                selectedValue={selectedValue}
                                                selectedAlert={[
                                                  selectedAlertId,
                                                ]}
                                              />
                                            )}
                                            {addToBlockListModal && (
                                              <AddToBlockListModal
                                                show={addToBlockListModal}
                                                handleClose={
                                                  handleCloseAddToBlockList
                                                }
                                                handleAction={
                                                  handleActionAddToBlockList
                                                }
                                                selectedValue={selectedValue}
                                                selectedAlert={[
                                                  selectedAlertId,
                                                ]}
                                              />
                                            )}
                                            {addToExclusionsModal && (
                                              <AddToExclusionsModal
                                                show={addToExclusionsModal}
                                                handleClose={
                                                  handleCloseAddToExclusions
                                                }
                                                handleAction={
                                                  handleActionAddToExclusions
                                                }
                                                selectedValue={selectedValue}
                                                selectedAlert={[
                                                  selectedAlertId,
                                                ]}
                                              />
                                            )}
                                            {addANoteModal && (
                                              <AddANoteModal
                                                show={addANoteModal}
                                                handleClose={
                                                  handleCloseAddANote
                                                }
                                                handleAction={
                                                  handleActionAddANote
                                                }
                                                selectedValue={selectedValue}
                                                selectedAlert={[
                                                  selectedAlertId,
                                                ]}
                                              />
                                            )}
                                          </div>
                                        </>
                                      </div>
                                    )}

                                    <div
                                      className="tab-pane"
                                      id={`actions_${index}`}
                                      role="tabpanel"
                                      aria-labelledby={`actionsTab_${index}`}
                                    ></div>
                                  </div> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      Data not found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end align-items-center pagination-bar mt-5">
            <ReactPaginate
              previousLabel={<i className="fa fa-chevron-left" />}
              nextLabel={<i className="fa fa-chevron-right" />}
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
