import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchApplicationEndPointsUrl } from "../../../../../api/ApplicationSectionApi";
import { getCurrentTimeZone } from "../../../../../../utils/helper";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import EndpointPopup from "./EndpointPopup";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

function Endpoints({ shouldRender, id }) {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown toggle
  // Function to extract table data
  const extractTableData = (items) => {
    return items.map((item) => ({
      "Endpoint Name": item.endpointName,
      OS: item.osType,
      "OS Version": item.osVersion,
      Account: item.accountName,
      Site: item.siteName,
      Group: item.groupName,
      Domain: item.domain,
      "Application Detection Date": getCurrentTimeZone(item.detectionDate),
      "Day From Detection": getCurrentTimeZone(item.applicationDaysDetected),
      "Last Successful Scan": item.lastScanDate,
      "Last Successful Result": item.lastScanResult,
    }));
  };
  // Function to convert data to CSV format
  const convertToCSV = (data) => {
    const header = Object.keys(data[0]).join(",") + "\n";
    const body = data.map((item) => Object.values(item).join(",")).join("\n");
    return header + body;
  };

  const exportToCSV = (data) => {
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const fileName = "risk_data.csv";
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const exportTableToCSV = () => {
    const tableData = extractTableData(endpoints);
    exportToCSV(tableData);
  };

  const [loading, setLoading] = useState(false);
  const [endpoints, setEndpoints] = useState([]);
  console.log(endpoints, "endpoints");
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const orgId = Number(sessionStorage.getItem("orgId"));

  const fetchData = async () => {
    const data = {
      orgID: orgId,
      applicationId: id,
    };
    try {
      setLoading(true);
      const response = await fetchApplicationEndPointsUrl(data);
      setEndpoints(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldRender) {
      fetchData();
    }
  }, [shouldRender]);
  const handleEndpointClick = (item) => {
    setSelectedEndpoint(item);
    setShowPopup(true);
  };
  return (
    <>
      <div className="header-filter">
        <div className="border-0 float-right mb-5">
          <Dropdown
            isOpen={dropdownOpen}
            toggle={() => setDropdownOpen(!dropdownOpen)}
          >
            <DropdownToggle className="no-pad">
              <div className="btn btn-new btn-small">
                Export <i className="fa fa-file-export white mg-left-5" />
              </div>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={exportTableToCSV}>
                <i className="fa fa-file-excel link float-right report-icon" />{" "}
                Export Report
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      {shouldRender && (
        <table className="table alert-table scroll-x mg-top-20">
          <thead>
            <tr>
              <th>Endpoint Name</th>
              {/* <th className='fs-12'>Status</th> */}
              {/* <th className='fs-12'>Version</th> */}
              <th>OS</th>
              <th>OS Version</th>
              <th>Account</th>
              <th>Site</th>
              <th>Group</th>
              <th>Domain</th>
              <th>Application Detection Date</th>
              <th>Day from Detection</th>
              <th>Last successful scan</th>
              <th>Last scan result</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {endpoints !== undefined ? (
              endpoints?.map((item) => (
                <tr key={item.applicationId}>
                  <td
                    onClick={() => handleEndpointClick(item)}
                    className="link-txt"
                  >
                    {item.endpointName}
                  </td>
                  {/* <td>{item.status}</td> */}
                  {/* <td>{item.version}</td> */}
                  <td>{item.osType}</td>
                  <td>{item.osVersion}</td>
                  <td>{item.accountName}</td>
                  <td>{item.siteName}</td>
                  <td>{item.groupName}</td>
                  <td>{item.domain}</td>
                  <td>{getCurrentTimeZone(item.detectionDate)}</td>
                  <td>{getCurrentTimeZone(item.applicationDaysDetected)}</td>
                  <td>{item.lastScanDate}</td>
                  <td>{item.lastScanResult}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <EndpointPopup
        selectedEndpoint={selectedEndpoint}
        showModal={showPopup}
        setShowModal={setShowPopup}
      />
    </>
  );
}

export default Endpoints;
