import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchApplicationCVSUrl } from "../../../../../api/ApplicationSectionApi";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { getCurrentTimeZone } from "../../../../../../utils/helper";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

function Cves({ id }) {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown toggle
  // Function to extract table data
  const extractTableData = (items) => {
    return items.map((item) => ({
      "CVE ID": item.cveId,
      Severity: item.severity,
      "NDV Base Score": item.nvdBaseScore,
      "Published Date": getCurrentTimeZone(item.publishedDate),
      Description: item.description,
      Links: item.mitreUr,
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

  // let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [endpoints, setEndpoints] = useState([]);
  const orgId = Number(sessionStorage.getItem("orgId"));

  const fetchData = async () => {
    const data = {
      orgID: orgId,
      applicationId: id,
    };
    try {
      setLoading(true);
      const response = await fetchApplicationCVSUrl(data);
      setEndpoints(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="header-filter">
        <div className="border-0 float-right mb-5">
          <Dropdown
            isOpen={dropdownOpen}
            toggle={() => setDropdownOpen(!dropdownOpen)}
          >
            <DropdownToggle className="no-pad">
              <div className="btn btn-new btn-small">Actions</div>
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
            <th>
              <input type="checkbox" />
            </th>
            <th>CVE ID</th>
            <th>Severity</th>
            <th>NDV Base Score</th>
            <th>Published Date</th>
            <th>Discription</th>
            <th>Links</th>
          </tr>
        </thead>
        <tbody>
          {loading && <UsersListLoading />}
          {endpoints !== undefined ? (
            endpoints?.map((item) => (
              <tr key={item.cveId}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{item.cveId}</td>
                <td>{item.severity}</td>
                <td>{item.nvdBaseScore}</td>
                <td>{getCurrentTimeZone(item.publishedDate)}</td>
                <td className="w-200px">{item.description}</td>
                <td>{item.mitreUrl}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12">No data found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Cves;
