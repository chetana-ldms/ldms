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

function Endpoint() {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown toggle
  // Function to extract table data
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
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);

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
  const currentItems = endpoints.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected);
  };

  return (
    <div>
      {loading ? (
        <UsersListLoading />
      ) : (
        <>
          <div className="header-filter mg-btm-20 row">
            <div className="col-lg-10">
              <input
                type="text"
                placeholder="Enter filter"
                className="form-control"
              />
            </div>
            <div className="col-lg-2">
              <div className="export-report border-0">
                <Dropdown
                  isOpen={dropdownOpen}
                  toggle={() => setDropdownOpen(!dropdownOpen)}
                >
                  <DropdownToggle className="no-pad">
                    <div className="btn btn-new btn-small">Actions</div>
                  </DropdownToggle>
                  <DropdownMenu className="w-auto">
                    <DropdownItem
                      onClick={exportTableToCSV}
                      className="border-btm"
                    >
                      <i className="fa fa-file-excel link mg-right-5" /> Export
                      full report
                    </DropdownItem>
                    <DropdownItem onClick={exportCurrentTableToCSV}>
                      <i className="fa fa-file-excel link mg-right-5" /> Export
                      current page report
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </div>
          <table className="table alert-table scroll-x">
            <thead>
              <tr>
                <th>Endpoint Name</th>
                <th>Account </th>
                <th>Site</th>
                <th>Last Logged in user</th>
                <th>Group</th>
                <th>Domain</th>
                <th>Console Visible Ip</th>
                <th>Agent Version</th>
                <th>Last Active</th>
                <th>Register on</th>
                <th>Device Type</th>
                <th>Os</th>
                <th>Os Version</th>
                <th>Architecture</th>
                <th>CPU Count</th>
                <th>Core count</th>
                <th>Network Status</th>
                <th>Full Disk Scan</th>
                <th>IP Adress</th>
                <th>Installer type</th>
                <th>Storage name</th>
                <th>Storage type</th>
                <th>Last successful scan time</th>
                <th>Locations</th>
              </tr>
            </thead>
            <tbody>
              {currentItems !== null ? (
                currentItems?.map((item, index) => (
                  <tr className="table-row" key={index}>
                    <td>{item.computerName}</td>
                    <td>{item.accountName}</td>
                    <td>{item.siteName}</td>
                    <td>{item.lastLoggedInUserName}</td>
                    <td>{item.groupName}</td>
                    <td>{item.domain}</td>
                    <td>{item.externalIp}</td>
                    <td>{item.agentVersion}</td>
                    <td>{getCurrentTimeZone(item.lastActiveDate)}</td>
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
          <Pagination
            pageCount={Math.ceil(endpoints.length / itemsPerPage)}
            handlePageClick={handlePageClick}
            itemsPerPage={itemsPerPage}
            handlePageSelect={handlePageSelect}
          />
        </>
      )}
    </div>
  );
}

export default Endpoint;
