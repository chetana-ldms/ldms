import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { fetchInventoryApplicationsEndpointsUrl } from "../../../../../api/ApplicationSectionApi";
import EndpointPopup from "./EndpointPopup";
import { getCurrentTimeZone } from "../../../../../../utils/helper";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const InventoryEndpointPopUp = ({ showModal, setShowModal, selectedItem }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown toggle
  // Function to extract table data
  const extractTableData = (items) => {
    return items.map((item) => ({
      "Endpoint Name": item.endpointName,
      "Endpoint Type": item.endpointType,
      OS: item.osType,
      "OS Version": item.osVersion,
      Account: item.accountName,
      Site: item.siteName,
      Group: item.groupName,
      version: item.version,
      Size: item.fileSize,
      "First Detected": getCurrentTimeZone(item.detectionDate),
      "Installation Path": item.applicationInstallationPath,
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

  console.log(selectedItem, "selectedItem");
  const name = selectedItem?.applicationName;
  const vendor = selectedItem?.applicationVendor;
  const orgId = Number(sessionStorage.getItem("orgId"));
  const [loading, setLoading] = useState(false);
  const [endpoints, setEndpoints] = useState([]);
  console.log(endpoints, "endpoints");
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const fetchData = async () => {
    const data = {
      orgID: orgId,
      applicationName: name,
      applicationVendor: vendor,
    };
    try {
      setLoading(true);
      const response = await fetchInventoryApplicationsEndpointsUrl(data);
      setEndpoints(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [name, vendor]);

  const handleEndpointClick = (item) => {
    setSelectedEndpoint(item);
    setShowPopup(true);
  };
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      className="fullscreen-modal"
    >
      <Modal.Header closeButton>
        <h1>Inventory Details</h1>
        <div className="back btn btn-small btn-border">
          <i className="fa fa-chevron-left link" /> Back
        </div>
      </Modal.Header>
      <Modal.Body>
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
                  Generate Report{" "}
                  <i className="fa fa-file-excel link float-right report-icon" />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <table className="table alert-table scroll-x mg-top-20">
          <thead>
            <tr>
              <th>Endpoint Name</th>
              <th>Endpoint Type</th>
              <th>OS</th>
              <th>OS Version</th>
              <th>Account</th>
              <th>Site</th>
              <th>Group</th>
              <th>Vesion</th>
              <th>Size</th>
              <th>First Detected</th>
              <th>Installation Date</th>
              <th>Installation Path</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {endpoints !== null &&
            endpoints !== undefined &&
            endpoints.length > 0 ? (
              endpoints?.map((item) => (
                <tr key={item.id}>
                  <td
                    onClick={() => handleEndpointClick(item)}
                    className="link-txt"
                  >
                    {item.endpointName}
                  </td>
                  <td>{item.endpointType}</td>
                  <td>{item.osType}</td>
                  <td>{item.osVersion}</td>
                  <td>{item.accountName}</td>
                  <td>{item.siteName}</td>
                  <td>{item.groupName}</td>
                  <td>{item.version}</td>
                  <td>{item.fileSize}</td>
                  <td>{getCurrentTimeZone(item.detectionDate)}</td>
                  <td>
                    {getCurrentTimeZone(item.applicationInstallationDate)}
                  </td>
                  <td>{item.applicationInstallationPath}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
        <EndpointPopup
          selectedEndpoint={selectedEndpoint}
          showModal={showPopup}
          setShowModal={setShowPopup}
        />
      </Modal.Body>
    </Modal>
  );
};

export default InventoryEndpointPopUp;
