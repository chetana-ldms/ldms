import { useEffect, useState } from "react";
import {
  fetchBlokckedListUrl,
  fetchblockedListItemDeleteUrl,
} from "../../../../../api/SentinalApi";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import Pagination from "../../../../../../utils/Pagination";
import { getCurrentTimeZone } from "../../../../../../utils/helper";
import BlockListPopUp from "./BlockListPopUp";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { renderSortIcon, sortedItems } from "../../../../../../utils/Sorting";
import { notify, notifyFail } from "../components/notification/Notification";
import { ToastContainer } from "react-toastify";
import BlockListEditPopup from "./BlockListEditPopup";

function BlockList() {
  const orgId = Number(sessionStorage.getItem("orgId"));
  const [loading, setLoading] = useState(false);
  const [blockList, setBlockList] = useState([]);
  console.log(blockList, "blockList111");
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupEdit, setShowPopupEdit] = useState(false);
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [includeChildren, setIncludeChildren] = useState(true);
  const [includeParents, setIncludeParents] = useState(true);
  const [selectedAlert, setselectedAlert] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const fetchData = async () => {
    const data = {
      orgID: orgId,
      includeChildren: includeChildren,
      includeParents: includeParents,
    };
    try {
      setLoading(true);
      const response = await fetchBlokckedListUrl(data);
      setBlockList(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [includeChildren, includeParents]);

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    blockList !== null
      ? sortedItems(
          blockList.filter((item) =>
            item.osType.toLowerCase().includes(filterValue.toLowerCase())
          ),
          sortConfig
        ).slice(indexOfFirstItem, indexOfLastItem)
      : null;

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key, direction });
  };

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected);
  };
  const openPopup = () => {
    setShowPopup(true);
  };
  const closePopup = () => {
    setShowPopup(false);
  };

  const openPopupEdit = () => {
    setShowPopupEdit(true);
  };

  const closePopupEdit = () => {
    setShowPopupEdit(false);
  };
  const handleCheckboxChange = (event) => {
    const checkboxName = event.target.name;
    const isChecked = event.target.checked;

    if (checkboxName === "thisScopeAndItsAncestors") {
      setIncludeParents(isChecked);
    } else if (checkboxName === "thisScopeAndItsDescendants") {
      setIncludeChildren(isChecked);
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown toggle
  // Function to extract table data
  const extractTableData = (items) => {
    return items.map((item) => ({
      OS: item.osType,
      Description: item.description,
      Hash: item.value,
      "Scope Path": item.scopePath,
      User: item.UserName,
      Warning: item.notRecommended,
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
    const tableData = extractTableData(blockList);
    exportToCSV(tableData);
  };

  // Function to extract current pagination table data
  const exportCurrentTableToCSV = () => {
    const tableData = extractTableData(currentItems);
    exportToCSV(tableData);
  };
  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };
  const handleselectedAlert = (item, e) => {
    const { value, checked } = e.target;
    if (checked) {
      setselectedAlert([...selectedAlert, value]);
      setIsCheckboxSelected(true);
    } else {
      const updatedAlert = selectedAlert.filter((e) => e !== value);
      setselectedAlert(updatedAlert);
      setIsCheckboxSelected(updatedAlert.length > 0);
    }
  };
  const handleDelete = async () => {
    const deletedUserId = Number(sessionStorage.getItem("userId"));
    const deletedDate = new Date().toISOString();
    const data = {
      orgId: orgId,
      ids: selectedAlert,
      type: "",
      deletedDate: deletedDate,
      deletedUserId: deletedUserId,
    };
    try {
      const responce = await fetchblockedListItemDeleteUrl(data);
      const { isSuccess, message } = responce;
      if (isSuccess) {
        notify(message);
        await fetchData();
      } else {
        notifyFail(message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRefreshActions = () => {
    setRefreshFlag(!refreshFlag);
    fetchData();
  };
  const handleTableRowClick = (item) => {
    setSelectedItem(item);
    setShowPopupEdit(true);
  };
  return (
    <div>
      <ToastContainer />
      {loading ? (
        <UsersListLoading />
      ) : (
        <div className="card pad-10">
          <div className="row mb-5">
            <div className="col-lg-6">
              <Dropdown
                isOpen={dropdown}
                toggle={() => setDropdown(!dropdown)}
                className="float-left mg-right-10"
              >
                <DropdownToggle className="no-pad btn btn-small btn-border">
                  <div className="fs-12 normal">
                    All Related Scopes{" "}
                    <i className="fa fa-chevron-down link mg-left-5" />
                  </div>
                </DropdownToggle>
                <DropdownMenu className="w-auto px-5">
                  <label className="dropdown-checkbox">
                    <input
                      type="checkbox"
                      name="thisScopeAndItsAncestors"
                      onChange={handleCheckboxChange}
                      checked={includeParents}
                    />
                    <span>
                      <i className="link mg-right-5" /> This scope and its
                      ancestors
                    </span>
                  </label>{" "}
                  <br />
                  <label className="dropdown-checkbox">
                    <input
                      type="checkbox"
                      name="thisScopeAndItsDescendants"
                      onChange={handleCheckboxChange}
                      checked={includeChildren} //
                    />
                    <span>
                      <i className="link mg-right-5" /> This scope and its
                      descendants
                    </span>
                  </label>
                </DropdownMenu>
              </Dropdown>

              <button
                className="btn btn-green btn-small float-left"
                onClick={openPopup}
              >
                Add New
              </button>
              {showPopup && (
                <BlockListPopUp
                  show={openPopup}
                  onClose={closePopup}
                  refreshParent={handleRefreshActions}
                />
              )}
              <div className="float-left mg-left-10">
                {/* <button className='btn btn-new btn-small float-left'>Delete selection</button> */}
                <button
                  className={`btn btn-green btn-small float-left ${
                    !isCheckboxSelected && "disabled"
                  }`}
                  onClick={handleDelete}
                >
                  Delete selection
                </button>
              </div>
            </div>
            <div className="col-lg-6 text-right">
              {/* <span className="gray inline-block mg-righ-20">530 Items</span> */}
              <Dropdown
                isOpen={dropdownOpen}
                toggle={() => setDropdownOpen(!dropdownOpen)}
              >
                <DropdownToggle className="no-pad">
                  <div className="btn btn-border btn-small">
                    Export <i className="fa fa-file-export link mg-left-5" />
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
          <div className="header-filter mg-btm-20 row">
            <div className="col-lg-12">
              <input
                type="text"
                placeholder="Search..."
                className="form-control"
                value={filterValue}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          {currentItems !== null && (
            <>
              <table className="table alert-table scroll-x">
                <thead>
                  <tr>
                    <th className="checkbox-th"></th>
                    <th onClick={() => handleSort("osType")}>
                      OS {renderSortIcon(sortConfig, "osType")}
                    </th>
                    <th onClick={() => handleSort("description")}>
                      Description {renderSortIcon(sortConfig, "description")}
                    </th>
                    <th onClick={() => handleSort("value")}>
                      Hash {renderSortIcon(sortConfig, "value")}
                    </th>
                    <th onClick={() => handleSort("scopePath")}>
                      Scope Path {renderSortIcon(sortConfig, "scopePath")}
                    </th>
                    <th onClick={() => handleSort("userName")}>
                      User {renderSortIcon(sortConfig, "userName")}
                    </th>
                    <th onClick={() => handleSort("notRecommended")}>
                      warning {renderSortIcon(sortConfig, "notRecommended")}
                    </th>
                    <th onClick={() => handleSort("updatedAt")}>
                      Last Update {renderSortIcon(sortConfig, "updatedAt")}
                    </th>
                    <th onClick={() => handleSort("source")}>
                      Source {renderSortIcon(sortConfig, "source")}
                    </th>
                    <th onClick={() => handleSort("scopeName")}>
                      Scope {renderSortIcon(sortConfig, "scopeName")}
                    </th>
                    <th onClick={() => handleSort("imported")}>
                      Imported {renderSortIcon(sortConfig, "imported")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems !== null ? (
                    currentItems?.map((item) => (
                      <tr
                        className="table-row"
                        key={item.id}
                        onClick={() => handleTableRowClick(item)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>
                          <input
                            className="form-check-input widget-13-check"
                            type="checkbox"
                            value={item.id}
                            name={item.id}
                            onChange={(e) => handleselectedAlert(item, e)}
                            autoComplete="off"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td>{item.osType}</td>
                        <td title={item.description}>{item.description}</td>
                        <td title={item.value}>{item.value}</td>
                        <td title={item.scopePath}>{item.scopePath}</td>
                        <td>{item.userName}</td>
                        <td>{item.notRecommended}</td>
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
                pageCount={Math.ceil(blockList.length / itemsPerPage)}
                handlePageClick={handlePageClick}
                itemsPerPage={itemsPerPage}
                handlePageSelect={handlePageSelect}
              />
              {showPopupEdit && selectedItem && (
                <BlockListEditPopup
                  show={openPopupEdit}
                  onClose={closePopupEdit}
                  refreshParent={handleRefreshActions}
                  selectedItem={selectedItem}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default BlockList;
