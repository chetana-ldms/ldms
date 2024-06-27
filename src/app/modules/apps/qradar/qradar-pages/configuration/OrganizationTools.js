import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { notify, notifyFail } from "../components/notification/Notification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchOrganizationToolsDelete } from "../../../../../api/Api";
import axios from "axios";
import { fetchOrganizationToolsUrl } from "../../../../../api/ConfigurationApi";
import { useErrorBoundary } from "react-error-boundary";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import DeleteConfirmation from "../../../../../../utils/DeleteConfirmation";
import Pagination from "../../../../../../utils/Pagination";
import { truncateText } from "../../../../../../utils/TruncateText";

const OrganizationTools = () => {
  const handleError = useErrorBoundary();
  const userID = Number(sessionStorage.getItem("userId"));
  const orgId = Number(sessionStorage.getItem("orgId"));
  const globalAdminRole = Number(sessionStorage.getItem("globalAdminRole"));
  const clientAdminRole = Number(sessionStorage.getItem("clientAdminRole"));
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterValue, setFilterValue] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activePage, setActivePage] = useState(0); 
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      const data = {
        orgToolID: itemToDelete.orgToolID,
        deletedDate: new Date().toISOString(),
        deletedUserId: Number(sessionStorage.getItem("userId")),
      };

      try {
        const response = await fetchOrganizationToolsDelete(data);
        const {isSuccess, message} = response
        if (isSuccess) {
          notify(message);
          await reload();
        } else {
          notifyFail(message);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setShowConfirmation(false);
        setItemToDelete(null);
      }
    }
  };
  const cancelDelete = () => {
    setShowConfirmation(false);
    setItemToDelete(null);
  };
  const reload = async () => {
    try {
      setLoading(true);
      const response = await fetchOrganizationToolsUrl();
      setTools(response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };

  useEffect(() => {
    reload()
  }, [itemsPerPage])
  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = tools
    ? tools
        .filter((item) => item.toolName.toLowerCase().includes(filterValue.toLowerCase()))
        .slice(indexOfFirstItem, indexOfLastItem)
    : null
    const filteredList = filterValue
    ? tools.filter((item) => item.toolName.toLowerCase().includes(filterValue.toLowerCase()))
    : tools;

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(0)
    setActivePage(0)
  }
  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected)
    setActivePage(selected.selected);
  }
  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
    setCurrentPage(0)
    setActivePage(0);
  }

  return (
    <div className="config card pad-10">
      <ToastContainer />
      <div className="card-header no-pad">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">
            Organizations Tools ({currentItems.length} / {filteredList.length})
          </span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            {globalAdminRole === 1 || clientAdminRole === 1 ? (
              <Link
                to="/qradar/organization-tools/add"
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
      <div className='row mb-5 mt-2'>
        <div className='col-lg-12 header-filter'>
          <input
            type='text'
            placeholder='Search...'
            className='form-control'
            value={filterValue}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      <div className="card-body no-pad">
        <table className="table align-middle gs-0 gy-4 dash-table alert-table">
          <thead>
            <tr className="fw-bold text-muted bg-blue">
              <th>S.No</th>
              <th>Tool Name</th>
              <th>Organization</th>
              <th>Auth Key</th>
              {/* <th className='min-w-50px fs-12'>API URL</th> */}
              {globalAdminRole === 1 || clientAdminRole === 1 ? (
                <th>Actions</th>
              ) : (
                <></>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <UsersListLoading />
            ) : currentItems === null ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No data found.
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => {
                const shouldDisplay =
                  globalAdminRole === 1 || item.orgID === orgId;

                if (shouldDisplay) {
                  return (
                    <tr key={index} className="fs-12">
                      <td>{index + 1}</td>
                      <td>{item.toolName}</td>
                      <td>{item.orgName}</td>
                      <td style={{ maxWidth: "250px" }} title={item.authKey}> {truncateText(item.authKey, 100)}</td>
                    
                      {globalAdminRole === 1 || clientAdminRole === 1 ? (
                        <td>
                          <span>
                            <Link
                              className="text-white"
                              to={`/qradar/organization-tools/update/${item.orgToolID}`}
                              title="Edit"
                            >
                              <i className="fa fa-pencil cursor link" />
                            </Link>
                          </span>

                          <span
                            className="ms-8"
                            onClick={() => {
                              handleDelete(item);
                            }}
                            title="Delete"
                          >
                            <i className="fa fa-trash cursor red" />
                          </span>
                        </td>
                      ) : (
                        <></>
                      )}
                    </tr>
                  );
                }

                return null;
              })
            )}
          </tbody>
        </table>
        {showConfirmation && (
          <DeleteConfirmation
            show={showConfirmation}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
         {tools && (
          <Pagination
            pageCount={Math.ceil(filteredList.length / itemsPerPage)}
            handlePageClick={handlePageClick}
            itemsPerPage={itemsPerPage}
            handlePageSelect={handlePageSelect}
            forcePage={activePage}
          />
        )}
      </div>
    </div>
  );
};

export { OrganizationTools };
