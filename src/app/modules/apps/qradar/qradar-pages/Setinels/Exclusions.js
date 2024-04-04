import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { fetchAEndPointDetailsUrl } from "../../../../../api/ApplicationSectionApi";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import Pagination from "../../../../../../utils/Pagination";
import { getCurrentTimeZone } from "../../../../../../utils/helper";
import { fetchExclusionListUrl } from "../../../../../api/SentinalApi";
import { useAbsoluteLayout } from "react-table";
import MitigationModal from "../alerts/MitigationModal";
import AddToBlockListModal from "../alerts/AddToBlockListModal";
import CreateExclusionModal from "./CreateExclusionModal";
import AddFromExclusionsCatalogModal from "./AddFromExclusionsCatalogModal";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

function Exclusions() {
  const orgId = Number(sessionStorage.getItem("orgId"));
  const [loading, setLoading] = useState(false);
  const [exlusions, setExlusions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMoreActionsModal, setShowMoreActionsModal] = useState(false);
  const [addToBlockListModal, setAddToBlockListModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
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

  const handleThreatActions = () => {
    setShowDropdown(true);
    console.log(showDropdown, "showDropdown");
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
  const handleDropdownSelect = async (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    if (value === "CreateExclusion") {
      setShowMoreActionsModal(true);
    } else if (value === "AddFromExclusionsCatalog") {
      setAddToBlockListModal(true);
    } else {
      setShowDropdown(false);
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown toggle
  // Function to extract table data
  const extractTableData = (items) => {
    return items.map((item) => ({
      "Exclusion Type": "null",
      OS: item.osType,
      "Application Name": item.applicationName,
      "Inventory Listed": "null",
      Description: item.description,
      Value: item.value,
      Scope: item.scopePath,
      User: item.agentVersion,
      Mode: item.mode,
      "Last Updated": getCurrentTimeZone(item.updatedAt),
      Source: item.source,
      Scope: item.scopeName,
      Imported: item.imported ? "Yes" : "No",
    }));
  };
  // Function to convert data to CSV format
  const convertToCSV = (data) => {
    const csvRows = [];

    // Add header row
    const header = Object.keys(data[0]);
    csvRows.push(header.join(","));

    // Add data rows
    data.forEach((item) => {
      const values = header.map((key) => {
        let value = item[key];
        // Escape double quotes in values
        if (typeof value === "string") {
          value = value.replace(/"/g, '""');
        }
        // Enclose value in double quotes if it contains special characters
        if (/[",\n]/.test(value)) {
          value = `"${value}"`;
        }
        return value;
      });
      csvRows.push(values.join(","));
    });

    // Combine rows into a single string
    return csvRows.join("\n");
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

  // Function to extract full table data
  const exportTableToCSV = () => {
    const tableData = extractTableData(exlusions);
    exportToCSV(tableData);
  };

  // Function to extract current pagination table data
  const exportCurrentTableToCSV = () => {
    const tableData = extractTableData(currentItems);
    exportToCSV(tableData);
  };

  return (
    <div>
      {loading ? (
        <UsersListLoading />
      ) : (
        <div className="card pad-10">
          <div className="row">
            <div className="col-lg-6 d-flex">
              <div className="mb-3">
                <a
                  href="#"
                  className="btn btn-small btn-border "
                  data-kt-menu-trigger="click"
                  data-kt-menu-placement="bottom-end"
                  onClick={handleThreatActions}
                >
                  New Exclusion
                  <i className="fa fa-chevron-down fs-12 mg-left-5" />
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
                          <option value="CreateExclusion" className="mb-2">
                            Create Exclusion
                          </option>
                          <option
                            value="AddFromExclusionsCatalog"
                            className="mb-2"
                          >
                            Add From Exclusions Catalog
                          </option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
                {showMoreActionsModal && (
                  <CreateExclusionModal
                    show={showMoreActionsModal}
                    handleClose={handleCloseMoreActionsModal}
                    handleAction={handleAction}
                    selectedValue={selectedValue}
                  />
                )}
                {addToBlockListModal && (
                  <AddFromExclusionsCatalogModal
                    show={addToBlockListModal}
                    handleClose={handleCloseAddToBlockList}
                    handleAction={handleActionAddToBlockList}
                    selectedValue={selectedValue}
                  />
                )}
                <button className="btn btn-small btn-new ms-2 ">
                  Delete selection
                </button>
              </div>
            </div>
            <div className="col-lg-6 text-right">
              {/* <span className="gray inline-block mg-righ-20">
                {exlusions.length} Items
              </span> */}
              <Dropdown
                isOpen={dropdownOpen}
                toggle={() => setDropdownOpen(!dropdownOpen)}
              >
                <DropdownToggle className="no-pad">
                  <div className="btn btn-new btn-small">
                    Export <i className="fa fa-file-export white mg-left-5" />
                  </div>
                </DropdownToggle>
                <DropdownMenu className="w-auto">
                  <DropdownItem
                    onClick={exportTableToCSV}
                    className="border-btm"
                  >
                    <i className="fa fa-file-excel link mg-right-5" /> Export
                    Full Report
                  </DropdownItem>
                  <DropdownItem onClick={exportCurrentTableToCSV}>
                    <i className="fa fa-file-excel link mg-right-5" /> Export
                    Current Page Report
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <table className="table alert-table scroll-x">
            <thead>
              <tr>
                <th>
                  {/* <input type="checkbox" name="selectAll" /> */}
                </th>
                <th>Exclusion Type</th>
                <th>OS</th>
                <th>Application Name</th>
                <th>Inventory Listed</th>
                <th>Description</th>
                <th>Value</th>
                <th>Scope Path </th>
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
                    <td>
                      <input type="checkbox" name={`checkbox_${item.id}`} />
                    </td>
                    <td></td>
                    <td>{item.osType}</td>
                    <td>{item.applicationName}</td>
                    <td></td>
                    <td title={item.description}>{item.description}</td>
                    <td title={item.value}>{item.value}</td>
                    <td title={item.scopePath}>{item?.scopePath}</td>
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
        </div>
      )}
    </div>
  );
}

export default Exclusions;
