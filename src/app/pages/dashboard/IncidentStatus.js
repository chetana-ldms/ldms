import { useState, useEffect } from "react";
import axios from "axios";
import { fetchMasterData } from "../../api/Api";

function IncidentStatus(props) {
  const { days, orgId } = props;
  const [incidentCount, setIncidentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [dropdownData, setDropdownData] = useState({
    severityNameDropDownData: [],
    statusDropDown: [],
    priorityDropDown: [],
    typeDropDown: [],
  });

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

        // Store the first status ID and priority ID
        if (statusData.length > 0) {
          setSelectedStatus(statusData[0].dataID);
        }
        if (priorityData.length > 0) {
          setSelectedPriority(priorityData[0].dataID);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (selectedStatus && selectedPriority) {
      fetchAlertCount();
    }
  }, [selectedStatus, selectedPriority]);

  const handleSelectStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleSelectPriorityChange = (event) => {
    setSelectedPriority(event.target.value);
  };

  const fetchAlertCount = async () => {
    try {
      setLoading(true);
      const apiUrl =
        "http://115.110.192.133:502/api/IncidentManagement/v1/GetIncidentCountByPriorityAndStatus";
      const requestData = {
        statusID: selectedStatus,
        priorityID: selectedPriority,
        orgId: orgId,
      };
      const response = await axios.post(apiUrl, requestData);
      const { incidentCount } = response.data;
      setIncidentCount(incidentCount);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (!orgId) {
    return <div>Organization ID is missing.</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  // if (incidentCount === 0) {
  //   return <div>No Data Found</div>;
  // }

  return (
    <div className="card-body">
      <div className="row">
        <label className="form-label fw-bold fs-12 col-lg-5 lh-40 fs-14">
          <span>Incident by Status & Priority:</span>
        </label>
        <div className="col-lg-4 header-filter">
          {dropdownData.statusDropDown !== null ? (
            <select
              name="incidentStatusName"
              data-control="select2"
              data-hide-search="true"
              className="form-select form-control form-select-white form-select-sm mt-2"
              value={selectedStatus}
              onChange={handleSelectStatusChange}
            >
              <option value="">Select</option>
              {dropdownData.statusDropDown.map((status) => (
                <option
                  key={status.dataID}
                  value={status.dataID}
                  data-id={status.dataID}
                >
                  {status.dataValue}
                </option>
              ))}
            </select>
          ) : (
            <select
              name="incidentStatusName"
              data-control="select2"
              data-hide-search="true"
              className="form-select form-control form-select-white form-select-sm mt-2"
              value={selectedStatus}
              onChange={handleSelectStatusChange}
            >
              <option value="">Select</option>
            </select>
          )}
        </div>

        <div className="col-lg-3 header-filter">
          {dropdownData.priorityDropDown !== null ? (
            <select
              name="priorityName"
              data-control="select2"
              data-hide-search="true"
              className="form-select form-control form-select-white form-select-sm mt-2"
              value={selectedPriority}
              onChange={handleSelectPriorityChange}
            >
              <option value="">Select</option>
              {dropdownData.priorityDropDown.map((priority) => (
                <option
                  key={priority.dataID}
                  value={priority.dataID}
                  data-id={priority.dataID}
                >
                  {priority.dataValue}
                </option>
              ))}
            </select>
          ) : (
            <select
              name="priorityName"
              data-control="select2"
              data-hide-search="true"
              className="form-select form-control form-select-white form-select-sm mt-2"
              value={selectedPriority}
              onChange={handleSelectPriorityChange}
            >
              <option value="">Select</option>
            </select>
          )}
        </div>

        <div className="row bar-chart mt-10">
          {incidentCount !== null ? (
            <>
              <div className="col-lg-2 fw-bold">Count:</div>
              <div className="col-lg-7">
                <span className="bar">{incidentCount}</span>
              </div>
              <div className="col-lg-2">
                <span>Total</span> <span>{incidentCount}</span>
              </div>
            </>
          ) : (
            <>
            <div className="col-lg-2 fw-bold">Count:</div>
              <div className="col-lg-7">
                <span className="bar">{incidentCount ?? 0}</span>
              </div>
              <div className="col-lg-2">
                <span>Total</span> <span>{incidentCount ?? 0}</span>
              </div>
              </>
          )}
        </div>

      </div>
    </div>
  );
}

export default IncidentStatus;
