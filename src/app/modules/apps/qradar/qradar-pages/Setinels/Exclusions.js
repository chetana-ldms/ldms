import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { fetchAEndPointDetailsUrl } from "../../../../../api/ApplicationSectionApi";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import Pagination from "../../../../../../utils/Pagination";
import { getCurrentTimeZone } from "../../../../../../utils/helper";
import {
  fetchExcludedListItemDeleteUrl,
  fetchExclusionListUrl,
} from "../../../../../api/SentinalApi";
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
import { renderSortIcon, sortedItems } from "../../../../../../utils/Sorting";
import { notify, notifyFail } from "../components/notification/Notification";
import { ToastContainer } from "react-toastify";
import CreateExclusionModalEdit from "./CreateExclusionModalEdit";
import DeleteConfirmation from "../../../../../../utils/DeleteConfirmation";

function Exclusions() {
  const orgId = Number(sessionStorage.getItem("orgId"));
  const [loading, setLoading] = useState(false);
  const [exlusions, setExlusions] = useState([]);
  console.log(exlusions, "exlusions111");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMoreActionsModal, setShowMoreActionsModal] = useState(false);
  const [addToBlockListModal, setAddToBlockListModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  console.log(exlusions, "exlusions111");
  const [dropdown, setDropdown] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [includeChildren, setIncludeChildren] = useState(true);
  const [includeParents, setIncludeParents] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(20)
  const [filterValue, setFilterValue] = useState("");
  const [selectedAlert, setselectedAlert] = useState([]);
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPopupEdit, setShowPopupEdit] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const [cursor, setCursor] = useState(null) 
  console.log(cursor, "cursor")
  const fetchData = async () => {
    const data = {
      orgID: orgId,
      includeChildren: includeChildren,
      includeParents: includeParents,
      orgAccountStructureLevel: [
        {
          levelName: "AccountId",
          levelValue: accountId || ""
        },
     {
          levelName: "SiteId",
          levelValue:  siteId || ""
        },
    {
          levelName: "GroupId",
          levelValue: groupId || ""
        }
      ],
      nextCursor: cursor || '',
      pageSize: limit,
    };
    try {
      setLoading(true);
      const response = await fetchExclusionListUrl(data);
      if (response !== null) {  
      setExlusions(response.exclusionList) 
      setCursor(response.pagination.nextCursor) 
      } else {
        setExlusions([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [limit]);
  useEffect(() => {
    fetchData();
  }, [includeChildren, includeParents]);
  const handleLoadMore = () => {
    fetchData()
  }
  const handleClickFirstPage = async () =>{
    const data = {
      orgID: orgId,
      includeChildren: includeChildren,
      includeParents: includeParents,
      orgAccountStructureLevel: [
        {
          levelName: 'AccountId',
          levelValue: accountId || '',
        },
        {
          levelName: 'SiteId',
          levelValue: siteId || '',
        },
        {
          levelName: 'GroupId',
          levelValue: groupId || '',
        },
      ],
      nextCursor:'',
      pageSize: limit,
    }

    try {
      setLoading(true)
      const response = await fetchExclusionListUrl(data)
      setExlusions(response.exclusionList) 
      setCursor(response.pagination.nextCursor) 
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
 
  const currentItems =
    exlusions !== null
      ? sortedItems(
          exlusions.filter((item) =>
            item.osType.toLowerCase().includes(filterValue.toLowerCase())
          ),
          sortConfig
        )
      : null;
      const filteredList = filterValue
      ? exlusions.filter((item) => item.osType.toLowerCase().includes(filterValue.toLowerCase()))
      : exlusions;

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key, direction });
  };
  const handleThreatActions = () => {
    setDropdownOpenExclusion(!dropdownOpenExclusion);
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
  const handleCheckboxChange = (event) => {
    const checkboxName = event.target.name;
    const isChecked = event.target.checked;

    if (checkboxName === "thisScopeAndItsAncestors") {
      setIncludeParents(isChecked);
    } else if (checkboxName === "thisScopeAndItsDescendants") {
      setIncludeChildren(isChecked);
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenExclusion, setDropdownOpenExclusion] = useState(false);

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
    const fileName = "exclusions.csv";
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
    const tableData = extractTableData(filteredList);
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
  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (selectedAlert) {
      const data = {
        orgId: orgId,
        ids: selectedAlert,
        type: "",
        deletedDate: new Date().toISOString(),
        deletedUserId: Number(sessionStorage.getItem("userId")),
      };

      try {
        const response = await fetchExcludedListItemDeleteUrl(data);
        const {isSuccess, message} = response
        if (isSuccess) {
          notify(message);
          await fetchData();
          setIsCheckboxSelected(false);
          setselectedAlert([]);
        } else {
          notifyFail(message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setShowConfirmation(false);
      }
    }
  };
  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleRefreshActions = () => {
    setRefreshFlag(!refreshFlag);
    fetchData();
  };
  const openPopupEdit = () => {
    setShowPopupEdit(true);
  };

  const closePopupEdit = () => {
    setShowPopupEdit(false);
  };
  const handleTableRowClick = (item) => {
    setSelectedItem(item);
    setShowPopupEdit(true);
  };
  const handlePageSelect = (event) => {
    const selectedPerPage = event.target.value
    setLimit(selectedPerPage)
  }

  return (
    <div>
      <ToastContainer />
      {loading ? (
        <UsersListLoading />
      ) : (
        <div className="card pad-10">
          <div className="row">
            <div className="col-lg-6 d-flex">
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
              <div className="mb-3">
                <Dropdown
                  isOpen={dropdownOpenExclusion}
                  toggle={handleThreatActions}
                >
                  <DropdownToggle className="no-pad btn btn-border btn-small">
                    <div className="normal">
                      New Exclusion{" "}
                      <i className="fa fa-chevron-down link mg-left-5" />
                    </div>
                  </DropdownToggle>
                  <DropdownMenu className="w-auto">
                    <DropdownItem
                      onClick={() => setShowMoreActionsModal(true)}
                      className="border-btm"
                    >
                      Create Exclusion
                    </DropdownItem>
                    {/* <DropdownItem onClick={() => setAddToBlockListModal(true)}>
                      Add From Exclusions Catalog
                    </DropdownItem> */}
                  </DropdownMenu>
                </Dropdown>
              </div>
              {showMoreActionsModal && (
                <CreateExclusionModal
                  show={showMoreActionsModal}
                  onClose={handleCloseMoreActionsModal}
                  handleAction={handleAction}
                  refreshParent={handleRefreshActions}
                />
              )}
              {addToBlockListModal && (
                <AddFromExclusionsCatalogModal
                  show={addToBlockListModal}
                  onClose={handleCloseAddToBlockList}
                  handleAction={handleActionAddToBlockList}
                  refreshParent={handleRefreshActions}
                />
              )}
              <div className="float-left mg-left-10">
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
              {/* <span className="gray inline-block mg-righ-20">
                {exlusions.length} Items
              </span> */}
              <Dropdown
                isOpen={dropdownOpen}
                toggle={() => setDropdownOpen(!dropdownOpen)}
              >
                <DropdownToggle className="no-pad btn btn-border btn-small">
                  <div>
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
          <table className="table alert-table fixed-table scroll-x">
            <thead>
              <tr>
                <th className="checkbox-th">
                  {/* <input type="checkbox" name="selectAll" /> */}
                </th>

                <th onClick={() => handleSort("osType")}>
                  OS {renderSortIcon(sortConfig, "osType")}
                </th>
                <th onClick={() => handleSort("applicationName")}>
                  Application Name{" "}
                  {renderSortIcon(sortConfig, "applicationName")}
                </th>
                <th onClick={() => handleSort("description")}>
                  Description {renderSortIcon(sortConfig, "description")}
                </th>
                <th onClick={() => handleSort("value")}>
                  Value {renderSortIcon(sortConfig, "value")}
                </th>
                <th onClick={() => handleSort("scopePath")}>
                  Scope Path {renderSortIcon(sortConfig, "scopePath")}
                </th>
                <th onClick={() => handleSort("userName")}>
                  User {renderSortIcon(sortConfig, "userName")}
                </th>
                <th onClick={() => handleSort("mode")}>
                  Mode {renderSortIcon(sortConfig, "mode")}
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
                currentItems?.map((item, index) => (
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
                    <td>{item.applicationName}</td>
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
          <div className=' d-flex justify-content-end  '>
                <button className='btn btn-primary btn-small me-5 ' onClick={handleClickFirstPage}>
                 Go to page 1
                </button>
                <button className='btn btn-primary btn-small' onClick={handleLoadMore} disabled={cursor === null}>
                  Load More
                </button>
                <div className='col-md-3 d-flex justify-content-end align-items-center'>
              <span className='col-md-4'>Count: </span>
              <select
                className='form-select form-select-sm col-md-4'
                value={limit}
                onChange={handlePageSelect}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
              </div>
          {showConfirmation && (
          <DeleteConfirmation
            show={showConfirmation}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
          {showPopupEdit && selectedItem && (
            <CreateExclusionModalEdit
              show={openPopupEdit}
              onClose={closePopupEdit}
              refreshParent={handleRefreshActions}
              selectedItem={selectedItem}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Exclusions;
