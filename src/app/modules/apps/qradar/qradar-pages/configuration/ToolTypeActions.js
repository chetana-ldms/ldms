import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { ToastContainer, toast } from "react-toastify";
import { notify, notifyFail } from "../components/notification/Notification";
import "react-toastify/dist/ReactToastify.css";
import { fetchToolTypeActionDelete } from "../../../../../api/Api";
import axios from "axios";
import { fetchToolTypeActions } from "../../../../../api/ConfigurationApi";
import { useErrorBoundary } from "react-error-boundary";
import Pagination from "../../../../../../utils/Pagination";
import { sortedItems } from "../../../../../../utils/Sorting";

const ToolTypeActions = () => {
  const handleError = useErrorBoundary();
  const globalAdminRole = Number(sessionStorage.getItem("globalAdminRole"));
  const clientAdminRole = Number(sessionStorage.getItem("clientAdminRole"));
  const [loading, setLoading] = useState(false);
  const [toolTypeActions, setToolTypeActions] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [updateData, setUpdateData] = useState({});
  const { status } = useParams();

  const handleDelete = async (item) => {
    const deletedUserId = Number(sessionStorage.getItem("userId"));
    const deletedDate = new Date().toISOString();
    const data = {
      toolTypeActionID: item.toolTypeActionID,
      deletedDate,
      deletedUserId,
    };
    try {
      const responce = await fetchToolTypeActionDelete(data);
      if (responce.isSuccess) {
        notify("Tool Type Action Deleted");
      } else {
        notifyFail("Tool Type Action not Deleted");
      }
      await reload();
    } catch (error) {
      handleError(error);
    }
  };
  const reload = async () => {
    try {
      setLoading(true);
      const response = await fetchToolTypeActions();
      setToolTypeActions(response);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = toolTypeActions
    ? toolTypeActions
        .filter((item) =>
          item.toolAction.toLowerCase().includes(filterValue.toLowerCase())
        )
        .slice(indexOfFirstItem, indexOfLastItem)
    : null;

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };
  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected);
  };
  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  return (
    <div className="config card pad-10">
      <ToastContainer />

      <div className="card-header no-pad">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">
            Tool Type Actions
          </span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            {globalAdminRole === 1 || clientAdminRole === 1 ? (
              <Link
                to="/qradar/tool-type-actions/add"
                className="btn btn-new btn-small"
              >
                Add
              </Link>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div className="row mb-5">
        <div className="col-lg-12 header-filter">
          <input
            type="text"
            placeholder="Search..."
            className="form-control"
            value={filterValue}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      <div className="card-body no-pad">
        <table className="table align-middle gs-0 gy-4 dash-table alert-table">
          <thead>
            <tr className="fw-bold text-muted bg-blue">
              <th>Tool Action Type</th>
              <th>Tool Type</th>
              {globalAdminRole === 1 || clientAdminRole === 1 ? (
                <th>Action</th>
              ) : (
                <></>
              )}
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={index} className="fs-12">
                  <td>{item.toolAction}</td>
                  <td>{item.toolTypeName}</td>

                  {globalAdminRole === 1 || clientAdminRole === 1 ? (
                    <td>
                      <span>
                        <Link
                          className="text-white"
                          to={`/qradar/tool-type-actions/update/${item.toolTypeActionID}`}
                        >
                          <i className="fa fa-pencil link" />
                        </Link>
                      </span>

                      <span
                        className="ms-8"
                        onClick={() => {
                          handleDelete(item);
                        }}
                      >
                        <i className="fa fa-trash red" />
                      </span>
                    </td>
                  ) : (
                    <></>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          pageCount={Math.ceil(toolTypeActions.length / itemsPerPage)}
          handlePageClick={handlePageClick}
          itemsPerPage={itemsPerPage}
          handlePageSelect={handlePageSelect}
        />
      </div>
    </div>
  );
};

export { ToolTypeActions };
