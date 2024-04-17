import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { fetchAEndPointDetailsUrl } from "../../../../../api/ApplicationSectionApi";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import Pagination from "../../../../../../utils/Pagination";
import { getCurrentTimeZone } from "../../../../../../utils/helper";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { renderSortIcon, sortedItems } from "../../../../../../utils/Sorting";
import EndpointPopupSentinal from "./EndpointPopupSentinal";

function Endpoint() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const extractTableData = (items) => {
    return items.map((item) => ({
      "Endpoint Name": item.computerName,
      Account: item.accountName,
      Site: item.siteName,
      "Last loged in user": item.lastLoggedInUserName,
      Group: item.groupName,
      Domain: item.domain,
      "Console Visible Ip": item.externalIp,
      "Agent Version": item.agentVersion,
      "Last Active": getCurrentTimeZone(item.lastActiveDate),
      "Register on": getCurrentTimeZone(item.registeredAt),
      "Device Type": item.machineType,
      OS: item.osName,
      "OS Version": item.osRevision,
      Architecture: item.osArch,
      "CPU Count": item.cpuCount,
      "Core Count": item.coreCount,
      "Network Status": item.networkStatus,
      "Full Disk Scan": getCurrentTimeZone(item.lastSuccessfulScanDate),
      "IP Address": item.lastIpToMgmt,
      "Installer Type": item.installerType,
      "Storage Name": item.storageName ?? null,
      "Storage Type": item.storageType ?? null,
      "Last successfull scan time": getCurrentTimeZone(
        item.lastSuccessfulScanDate
      ),
      Locations: item.locations[0].name,
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

  // Function to extract full table data
  const exportTableToCSV = () => {
    const tableData = extractTableData(endpoints);
    exportToCSV(tableData);
  };

  // Function to extract current pagination table data
  const exportCurrentTableToCSV = () => {
    const tableData = extractTableData(currentItems);
    exportToCSV(tableData);
  };

  const orgId = Number(sessionStorage.getItem("orgId"));
  const [loading, setLoading] = useState(false);
  const [endpoints, setEndpoints] = useState([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const fetchData = async () => {
    const data = {
      orgID: orgId,
      endPiontId: "",
    };
    try {
      setLoading(true);
      const response = await fetchAEndPointDetailsUrl(data);
      //   const [firstEndpoint] = response;
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

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = endpoints
    ? sortedItems(
        endpoints.filter((item) =>
          item.computerName.toLowerCase().includes(filterValue.toLowerCase())
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
  const handleEndpointClick = (item) => {
    setSelectedEndpoint(item);
    setShowPopup(true);
  };
  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  return (
    <div>
      {loading ? (
        <UsersListLoading />
      ) : (
        <div className="card pad-10">
          <div className="header-filter mg-btm-20 row">
            <div className="col-lg-10">
              <input
                type="text"
                placeholder="Search..."
                className="form-control"
                value={filterValue}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-lg-2">
              <div className="export-report border-0 float-right">
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
          </div>
          <table className="table alert-table scroll-x">
            <thead>
              <tr>
                <th onClick={() => handleSort("computerName")}>
                  Endpoint Name {renderSortIcon(sortConfig, "computerName")}
                </th>
                <th onClick={() => handleSort("accountName")}>
                  Account {renderSortIcon(sortConfig, "accountName")}
                </th>
                <th onClick={() => handleSort("siteName")}>
                  Site {renderSortIcon(sortConfig, "siteName")}
                </th>
                <th onClick={() => handleSort("lastLoggedInUserName")}>
                  User Name {renderSortIcon(sortConfig, "lastLoggedInUserName")}
                </th>
                <th onClick={() => handleSort("lastActiveDate")}>
                  Last Active {renderSortIcon(sortConfig, "lastActiveDate")}
                </th>
                <th onClick={() => handleSort("groupName")}>
                  Group {renderSortIcon(sortConfig, "groupName")}
                </th>
                <th onClick={() => handleSort("domain")}>
                  Domain {renderSortIcon(sortConfig, "domain")}
                </th>
                <th onClick={() => handleSort("externalIp")}>
                  Console Visible Ip {renderSortIcon(sortConfig, "externalIp")}
                </th>
                <th onClick={() => handleSort("agentVersion")}>
                  Agent Version {renderSortIcon(sortConfig, "agentVersion")}
                </th>
                <th onClick={() => handleSort("registeredAt")}>
                  Registered Date {renderSortIcon(sortConfig, "registeredAt")}
                </th>
                <th onClick={() => handleSort("machineType")}>
                  Device Type {renderSortIcon(sortConfig, "machineType")}
                </th>
                <th onClick={() => handleSort("osName")}>
                  Os {renderSortIcon(sortConfig, "osName")}
                </th>
                <th onClick={() => handleSort("osRevision")}>
                  Os Version {renderSortIcon(sortConfig, "osRevision")}
                </th>
                <th onClick={() => handleSort("osArch")}>
                  Architecture {renderSortIcon(sortConfig, "osArch")}
                </th>
                <th onClick={() => handleSort("cpuCount")}>
                  CPU Count {renderSortIcon(sortConfig, "cpuCount")}
                </th>
                <th onClick={() => handleSort("coreCount")}>
                  Core Count {renderSortIcon(sortConfig, "coreCount")}
                </th>
                <th onClick={() => handleSort("networkStatus")}>
                  Network Status {renderSortIcon(sortConfig, "networkStatus")}
                </th>
                <th onClick={() => handleSort("lastSuccessfulScanDate")}>
                  Full Disk Scan{" "}
                  {renderSortIcon(sortConfig, "lastSuccessfulScanDate")}
                </th>
                <th onClick={() => handleSort("lastIpToMgmt")}>
                  IP Address {renderSortIcon(sortConfig, "lastIpToMgmt")}
                </th>
                <th onClick={() => handleSort("installerType")}>
                  Installer Type {renderSortIcon(sortConfig, "installerType")}
                </th>
                <th onClick={() => handleSort("storageName")}>
                  Storage Name {renderSortIcon(sortConfig, "storageName")}
                </th>
                <th onClick={() => handleSort("storageType")}>
                  Storage Type {renderSortIcon(sortConfig, "storageType")}
                </th>
                <th onClick={() => handleSort("lastSuccessfulScanDate")}>
                  Last Successful Scan Time{" "}
                  {renderSortIcon(sortConfig, "lastSuccessfulScanDate")}
                </th>
                <th onClick={() => handleSort("locations")}>
                  Locations {renderSortIcon(sortConfig, "locations")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems !== null ? (
                currentItems?.map((item, index) => (
                  <tr className="table-row" key={index}>
                    <td
                      onClick={() => handleEndpointClick(item)}
                      className="link-txt"
                    >
                      {item.computerName}
                    </td>
                    <td>{item.accountName}</td>
                    <td>{item.siteName}</td>
                    <td>{item.lastLoggedInUserName}</td>
                    <td>{getCurrentTimeZone(item.lastActiveDate)}</td>
                    <td>{item.groupName}</td>
                    <td>{item.domain}</td>
                    <td>{item.externalIp}</td>
                    <td>{item.agentVersion}</td>
                    <td>{getCurrentTimeZone(item.registeredAt)}</td>
                    <td>{item.machineType}</td>
                    <td>{item.osName}</td>
                    <td>{item.osRevision}</td>
                    <td>{item.osArch}</td>
                    <td>{item.cpuCount}</td>
                    <td>{item.coreCount}</td>
                    <td>{item.networkStatus}</td>
                    <td>{getCurrentTimeZone(item.lastSuccessfulScanDate)}</td>
                    <td>{item.lastIpToMgmt}</td>
                    <td>{item.installerType}</td>
                    <td>{item.storageName ?? null}</td>
                    <td>{item.storageType ?? null}</td>
                    <td>{getCurrentTimeZone(item.lastSuccessfulScanDate)}</td>
                    <td>{item.locations[0].name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="24">No data found</td>
                </tr>
              )}
            </tbody>
          </table>
          {endpoints && (
            <Pagination
              pageCount={Math.ceil(endpoints.length / itemsPerPage)}
              handlePageClick={handlePageClick}
              itemsPerPage={itemsPerPage}
              handlePageSelect={handlePageSelect}
            />
          )}
        </div>
      )}
      <EndpointPopupSentinal
        selectedEndpoint={selectedEndpoint}
        showModal={showPopup}
        setShowModal={setShowPopup}
      />
    </div>
  );
}

export default Endpoint;
