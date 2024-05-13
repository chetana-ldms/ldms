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
import Pagination from "../../../../../../utils/Pagination";

function Cves({ id }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [endpoints, setEndpoints] = useState([]);
  console.log(endpoints, "endpoints1111111111");
  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = endpoints
    ? endpoints.slice(indexOfFirstItem, indexOfLastItem)
    : null;

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handlePageSelect = (event) => {
    // setItemsPerPage(Number(event.target.value))
    setItemsPerPage(5)
    setCurrentPage(0)
  }

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected)
  }
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
              <div className="btn btn-border btn-small">
                Export <i className="fa fa-file-export link mg-left-5" />
              </div>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={exportTableToCSV}>
                Export Report{" "}
                <i className="fa fa-file-excel link float-right report-icon" />
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <table className="table alert-table scroll-x mg-top-20">
        <thead>
          <tr>
            <th>CVE ID</th>
            <th>Severity</th>
            <th>NDV Base Score</th>
            <th>Published Date</th>
            <th>Description</th>
            <th>Links</th>
          </tr>
        </thead>
        <tbody>
          {loading && <UsersListLoading />}
          {currentItems !== undefined ? (
            currentItems?.map((item) => (
              <tr key={item.cveId}>
                <td>{item.cveId}</td>
                <td>{item.severity}</td>
                <td>{item.nvdBaseScore}</td>
                <td>{getCurrentTimeZone(item.publishedDate)}</td>
                <td title={item.description}>{item.description}</td>
                <td title={`${item.mitreUrl} ${item.nvdUrl}`}>
                  <a
                    href={item.mitreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.mitreUrl.length > 20
                      ? `${item.mitreUrl.substring(0, 25)}...`
                      : item.mitreUrl}
                  </a>{" "}
                  &nbsp;&nbsp;&nbsp;
                  <a
                    href={item.nvdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.nvdUrl.length > 25
                      ? `${item.nvdUrl.substring(0, 25)}...`
                      : item.nvdUrl}
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12">No data found</td>
            </tr>
          )}
        </tbody>
      </table>
      {currentItems && (
            <Pagination
              pageCount={Math.ceil(endpoints.length / itemsPerPage)}
              handlePageClick={handlePageClick}
              itemsPerPage={itemsPerPage}
              handlePageSelect={handlePageSelect}
            />
          )}
    </div>
  );
}

export default Cves;
