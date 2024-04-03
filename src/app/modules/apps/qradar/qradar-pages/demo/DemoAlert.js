import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { GET_RECENT_OFFENSES } from "../../../../../../utils";
import { ToastContainer, toast } from "react-toastify";
import { KTCardBody } from "../../../../../../_metronic/helpers";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { UsersListPagination } from "../components/pagination/UsersListPagination";

const DemoAlert = () => {
  const { status } = useParams();
  const navigate = useNavigate();

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

  const [alertData, setAlertData] = useState([]);
  const [newAlertAdded, setNewAlertAdded] = useState(""); // Fix variable name
  const [delay, setDelay] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [alertsCount, setAlertsCount] = useState(0);
  const [isAlertSelected, setIsAlertSelected] = useState(false);

  const handleCreateIncident = () => {
    // const alertData = "add failed login";
    notify("Alert Identified as Threat");
    notify("Incident Created");
    setTimeout(() => {
      navigate("/qradar/incidentsDemo");
    }, 5000);
    // navigate("/qradar/incidents", { state: { alertData: [alertData] } });
  };

  const notify = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(GET_RECENT_OFFENSES, {
          clientID: 0,
          clientName: "string",
          paging: {
            rangeStart: 0,
            rangeEnd: 10,
          },
        });
        const { alertsList } = response.data;
        localStorage.setItem("alertData", JSON.stringify(alertsList));
        setAlertsCount(alertsList.length);
        setAlertData(alertsList);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    const localAlertData = JSON.parse(localStorage.getItem("alertData"));
    if (status === "updated") {
      notify("Alert updated, few seconds ago");
    }

    if (!localAlertData || localAlertData.length === 0) {
      fetchData();
    } else {
      localAlertData.sort((a, b) => b.alertID - a.alertID);
      setAlertsCount(localAlertData.length);
      setAlertData(localAlertData);
    }

    const timeoutId = setTimeout(() => {
      setDelay((prevDelay) => prevDelay + 1);
    }, 60000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [status]);

  const handleCheckboxChange = (event) => {
    setIsAlertSelected(event.target.checked);
  };

  return (
    <KTCardBody className="demo-alert alert-page">
      <ToastContainer />
      <div className="mb-5 mb-xl-8">
        <div className="card-header border-0 no-pad d-flex justify-content-between mb-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1">
              Alerts {"( " + alertData.length + " / " + alertsCount + ")"}
            </span>
          </h3>
          <div className="card-toolbar">
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              <div className="m-0">
                <a
                  href="#"
                  className={`btn btn-sm btn-flex btn-new btn-small fw-bold fs-14 ${
                    !isAlertSelected ? "disabled" : ""
                  }`}
                  data-kt-menu-trigger="click"
                  data-kt-menu-placement="bottom-end"
                >
                  <span className="svg-icon svg-icon-6  white me-1">
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
                  className="menu menu-sub menu-sub-dropdown w-250px w-md-300px"
                  data-kt-menu="true"
                  id="kt_menu_637dc885a14bb"
                >
                  <div className="separator border-gray-200"></div>
                  <div className="px-7 py-5 header-filter">
                    <div className="mb-10">
                      <label className="form-label fw-semibold">Actions:</label>
                      <div>
                        <select
                          onChange={handleCreateIncident}
                          className="form-select form-select-solid"
                          data-kt-select2="true"
                          data-placeholder="Select option"
                          data-dropdown-parent="#kt_menu_637dc885a14bb"
                          data-allow-clear="true"
                        >
                          <option>--</option>
                          <option value="1">Create Incident</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card no-pad alert-table" id="kt_accordion_1">
          <div className="table-responsive alert-table">
            <table className="table align-middle gs-0 gy-4">
              <thead>
                <tr className="fw-bold bg-light">
                  <th className="w-25px"></th>
                  <th className="min-w-50px">Severity</th>
                  <th className="min-w-50px">SLA</th>
                  <th className="min-w-50px">Score</th>
                  <th className="min-w-50px">Status</th>
                  <th className="min-w-50px">Detected Time</th>
                  <th className="min-w-50px">Name</th>
                  <th className="min-w-50px">Observables Tags</th>
                  <th className="min-w-50px">Owner</th>
                  <th className="min-w-50px">Source</th>
                </tr>
              </thead>

              <tbody id="kt_accordion_1">
                {alertData.length == 0 ? (
                  <>
                    <tr>
                      <td>
                        <UsersListLoading />
                      </td>
                    </tr>
                  </>
                ) : (
                  ""
                )}

                {alertData.map((item, index) => (
                  <>
                    <tr>
                      <td>
                        <div className="form-check form-check-sm form-check-custom form-check-solid">
                          <input
                            onChange={handleCheckboxChange}
                            className="form-check-input widget-13-check"
                            type="checkbox"
                            value="1"
                          />
                        </div>
                      </td>
                      <td>{item.severity}</td>
                      <td
                        key={index}
                        id={"kt_accordion_1_header_" + index}
                        data-bs-toggle="collapse"
                        data-bs-target={"#kt_accordion_1_body_" + index}
                        aria-expanded="false"
                        aria-controls={"kt_accordion_1_body_" + index}
                      >
                        <span className="text-hover-primary d-block mb-1">
                          {item.sla}
                        </span>
                      </td>
                      <td>
                        <span className="text-dark text-hover-primary d-block mb-1">
                          {item.score}
                        </span>
                      </td>
                      <td>
                        {/* <i className={'fa fa-exclamation-circle text-danger fs-2'}></i> */}
                        {item.status}
                      </td>
                      <td>
                        <span className="text-dark text-hover-primary d-block mb-1">
                          {convertDate(item.last_persisted_time)}
                        </span>
                      </td>
                      <td
                        className={
                          `text-dark text-hover-primary` + newAlertAdded
                        }
                      >
                        {item.name}
                      </td>
                      <td className="text-dark text-hover-primary">
                        {item.observableTag}
                      </td>
                      <td className="text-dark text-hover-primary">
                        {" "}
                        {item.ownerusername}
                      </td>
                      <td className="text-dark fw-bold text-hover-primary">
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
                          <div className="col-md-1"></div>
                          <div className="col-md-10">
                            <b>Alert Name :</b>
                            {item.name}
                            <br />
                            <b>Organization :</b>
                            {item.orgID}
                            <br />
                            <b>Detected Date :</b>
                            {convertDate(item.last_persisted_time)}
                            <br />
                            <b>Description :</b>
                            <br />
                            Customer Name : {item.createdUser} <br />
                            Alert Name : {item.name} <br />
                            Source Address : {item.source} <br />
                            Source Host Name : {item.alertData} <br />
                          </div>
                          <div className="col-md-1"></div>
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <UsersListPagination />
    </KTCardBody>
  );
};

export { DemoAlert };
