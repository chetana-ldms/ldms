import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { fetchAEndPointDetailsUrl } from "../../../../../api/ApplicationSectionApi";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import Pagination from "../../../../../../utils/Pagination";
import { getCurrentTimeZone } from "../../../../../../utils/helper";
import { fetchExclusionListUrl } from "../../../../../api/SentinalApi";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

function Exclusions() {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown toggle
  // Function to extract table data
  const extractTableData = (items) => {
    return items.map((item) => ({
      "Exclusion Type": null,
      OS: item.osType,
      "Application Type": item.applicationName,
      "Inventory Listed": null,
      Description: item.description,
      Value: item.value,
      "Scope Path": item.scopePath,
      User: item.userName,
      Mode: item.mode,
      "Last Updated": getCurrentTimeZone(item.updatedAt),
      Source: item.source,
      Scope: item.scopeName,
      Imported: item.imported ? "Yes" : "No",
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
    const tableData = extractTableData(currentItems);
    exportToCSV(tableData);
  };

  const orgId = Number(sessionStorage.getItem("orgId"));
  const [loading, setLoading] = useState(false);
  const [exlusions, setExlusions] = useState([]);
  console.log(exlusions, "exlusions111");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const fetchData = async () => {
    const data = {
      orgID: orgId,
    };
    try {
      setLoading(true);
      const response = await fetchExclusionListUrl(data);
      setExlusions(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = exlusions.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected);
  };

  return (
    <div>
      {loading ? (
        <UsersListLoading />
      ) : (
        <>
          <div className="row">
            <div className="col-lg-6">
              <button className="btn btn-new btn-small float-left mb-3">
                New Exclusion <i className="fa fa-chevron-down white" />
              </button>
            </div>
            <div className="col-lg-6 text-right">
              <span className="gray inline-block mg-righ-20">
                {exlusions.length} Items
              </span>
              <span className="inline-block mg-left-10 link">
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
                        Generate Report{" "}
                        <i className="fa fa-file-excel link float-right report-icon" />
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </span>
            </div>
          </div>
          <table className="table alert-table scroll-x">
            <thead>
              <tr>
                <th>Exclusion Type</th>
                <th>OS</th>
                <th>Application Name</th>
                <th>Inventory Listed</th>
                <th>Description</th>
                <th>Value</th>
                <th>Scope path </th>
                <th>User</th>
                <th>Mode</th>
                <th>Last Update</th>
                <th>Source</th>
                <th>Scope</th>
                <th>Imported</th>
              </tr>
            </thead>
            <tbody>
              {currentItems !== null ? (
                currentItems?.map((item, index) => (
                  <tr className="table-row" key={index}>
                    <td></td>
                    <td>{item.osType}</td>
                    <td>{item.applicationName}</td>
                    <td></td>
                    <td>{item.description}</td>
                    <td>{item.value}</td>
                    <td>{item?.scopePath}</td>
                    <td>{item.userName}</td>
                    <td>{item.mode}</td>
                    <td>{getCurrentTimeZone(item.updatedAt)}</td>
                    <td>{item.source}</td>
                    <td>{item.scopeName}</td>
                    <td>{item.imported ? "Yes" : "No"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="24">No data found</td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            pageCount={Math.ceil(exlusions.length / itemsPerPage)}
            handlePageClick={handlePageClick}
            itemsPerPage={itemsPerPage}
            handlePageSelect={handlePageSelect}
          />
        </>
      )}
    </div>
  );
}

export default Exclusions;
