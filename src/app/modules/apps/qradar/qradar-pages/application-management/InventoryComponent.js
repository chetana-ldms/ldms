import React, { useEffect, useState } from "react";
import { fetchApplicationInventoryUrl } from "../../../../../api/ApplicationSectionApi";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import ReactPaginate from "react-paginate";
import InventoryEndpointPopUp from "./InventoryEndpointPopUp";

function InventoryComponent() {
  const [loading, setLoading] = useState(false);
  const [risk, setRisk] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [filterValue, setFilterValue] = useState("");
  const orgId = Number(sessionStorage.getItem("orgId"));

  const fetchData = async () => {
    const data = {
      orgID: orgId,
      siteId: "",
    };
    try {
      setLoading(true);
      const response = await fetchApplicationInventoryUrl(data);
      setRisk(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = risk
    .filter((item) =>
      item.applicationName.toLowerCase().includes(filterValue.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const sortTable = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = () => {
    if (sortConfig.key !== null) {
      return [...currentItems].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return currentItems;
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <i className="bi bi-caret-up-fill"></i>
      ) : (
        <i className="bi bi-caret-down-fill"></i>
      );
    }
    return null;
  };

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
  };

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };
  if (loading) {
    return <UsersListLoading />; 
  }

  return (
    <div className="application-section mg-top-20 mg-btm-20">
      <div className="header-filter mg-btm-20 row">
        <div className="col-lg-4">
          <input
            type="text"
            placeholder="Enter filter"
            className="form-control"
            value={filterValue}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      <div className="actions">
        <table className="table alert-table">
          <thead>
            <tr>
              <th onClick={() => sortTable("applicationName")}>
                Name{" "}
                {sortConfig.key === "applicationName" &&
                  renderSortIcon("applicationName")}
              </th>
              <th onClick={() => sortTable("applicationVendor")}>
                Vendor{" "}
                {sortConfig.key === "applicationVendor" &&
                  renderSortIcon("applicationVendor")}
              </th>
              <th onClick={() => sortTable("applicationVersionsCount")}>
                Number of Versions{" "}
                {sortConfig.key === "applicationVersionsCount" &&
                  renderSortIcon("applicationVersionsCount")}
              </th>
              <th onClick={() => sortTable("endpointsCount")}>
                Number of Endpoints{" "}
                {sortConfig.key === "endpointsCount" &&
                  renderSortIcon("endpointsCount")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedItems().length > 0 ? (
              sortedItems().map((item, index) => (
                <tr className="table-row" key={index}>
                  <td
                    onClick={() => handleItemClick(item)}
                    className="link-txt"
                  >
                    {item.applicationName}
                  </td>
                  <td>{item.applicationVendor}</td>
                  <td>{item.applicationVersionsCount}</td>
                  <td>{item.endpointsCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
        <InventoryEndpointPopUp
          selectedItem={selectedItem}
          showModal={showPopup}
          setShowModal={setShowPopup}
        />
      </div>
      <hr />
      <div className="d-flex justify-content-end align-items-center pagination-bar">
        <ReactPaginate
          previousLabel={<i className="fa fa-chevron-left" />}
          nextLabel={<i className="fa fa-chevron-right" />}
          pageCount={Math.ceil(risk.length / itemsPerPage)}
          marginPagesDisplayed={1}
          pageRangeDisplayed={8}
          onPageChange={handlePageClick}
          containerClassName={"pagination justify-content-end"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item custom-previous"}
          previousLinkClassName={"page-link custom-previous-link"}
          nextClassName={"page-item custom-next"}
          nextLinkClassName={"page-link custom-next-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
        <div className="col-md-3 d-flex justify-content-end align-items-center">
          <span className="col-md-4">Count: </span>
          <select
            className="form-select form-select-sm col-md-4"
            value={itemsPerPage}
            onChange={handlePageSelect}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default InventoryComponent;
