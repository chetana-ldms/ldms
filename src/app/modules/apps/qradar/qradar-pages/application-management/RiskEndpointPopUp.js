import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import EndpointPopup from "./EndpointPopup";
import { fetchApplicationEndPointsUrl } from "../../../../../api/ApplicationSectionApi";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { getCurrentTimeZone } from "../../../../../../utils/helper";
import Endpoints from "./Endpoints";
import Cves from "./Cves";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const RiskEndpointPopUp = ({ showModal, setShowModal, selectedItem }) => {
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
      "Day from Detection": getCurrentTimeZone(item.applicationDaysDetected),
      "Last successful scan": item.lastScanDate,
      "Last scan result": item.lastScanResult,
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

  const id = selectedItem?.applicationId;
  console.log(id, "id1111");
  const [loading, setLoading] = useState(false);
  const [endpoints, setEndpoints] = useState([]);
  console.log(endpoints, "endpoints");
  const [points, setPoints] = useState("endpoints");
  const orgId = Number(sessionStorage.getItem("orgId"));
  const [showRiskComponent, setShowRiskComponent] = useState(true);
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
    fetchData();
  }, [id]);
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      className="fullscreen-modal"
    >
      <Modal.Header closeButton>
        <h1>Risk Details</h1>
        <div className="back btn btn-small btn-border">
          <i className="fa fa-chevron-left link" /> Back
        </div>
      </Modal.Header>
      <Modal.Body>
        {showRiskComponent && (
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex mg-btm-10 mg-top-10">
                <ul className="nav nav-tabs p-0 border-0 fs-12">
                  <li className="nav-item">
                    <a
                      className={`btn btn-small btn-border mg-right-10 ${
                        points === "endpoints" ? "btn-new active" : ""
                      }`}
                      onClick={() => setPoints("endpoints")}
                    >
                      Endpoints
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`btn btn-small btn-border pointer ${
                        points === "cves" ? "btn-new active" : ""
                      }`}
                      onClick={() => setPoints("cves")}
                    >
                      CVEs
                    </a>
                  </li>
                  <li className="float-right">
                    <div className="export-report border-0">
                      <Dropdown
                        isOpen={dropdownOpen}
                        toggle={() => setDropdownOpen(!dropdownOpen)}
                      >
                        <DropdownToggle className="no-pad">
                          <div className="btn btn-new btn-small">Actions</div>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={exportTableToCSV}>
                            Export to Excel{" "}
                            <i className="fa fa-file-excel link float-right" />
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </li>
                </ul>
              </div>
              {points === "endpoints" && (
                <Endpoints id={id} shouldRender={true} />
              )}
              {points === "cves" && <Cves id={id} />}
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default RiskEndpointPopUp;
