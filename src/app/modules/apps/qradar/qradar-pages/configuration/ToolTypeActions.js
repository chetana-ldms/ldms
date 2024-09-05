import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import DeleteConfirmation from "../../../../../../utils/DeleteConfirmation";
import useFeatureActions from "./useFeatureActions";

const ToolTypeActions = () => {
  const handleError = useErrorBoundary();
  const globalAdminRole = Number(sessionStorage.getItem("globalAdminRole"));
  const clientAdminRole = Number(sessionStorage.getItem("clientAdminRole"));
  const [loading, setLoading] = useState(false);
  const [toolTypeActions, setToolTypeActions] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(0); 
  const [updateData, setUpdateData] = useState({});
  const { status } = useParams();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))

  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)
  
   const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }
  const handleNavigateToUpdate = (id) => {
    navigate(`/qradar/tool-type-actions/update/${id}`, {state: {save: true}})
  }

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      const data = {
        toolTypeActionID: itemToDelete.toolTypeActionID,
        deletedDate: new Date().toISOString(),
        deletedUserId: Number(sessionStorage.getItem("userId")),
      };

      try {
        const response = await fetchToolTypeActionDelete(data);
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
  }, [itemsPerPage]);
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = toolTypeActions
    ? toolTypeActions
        .filter((item) =>
          item.toolAction.toLowerCase().includes(filterValue.toLowerCase())
        )
        .slice(indexOfFirstItem, indexOfLastItem)
    : null;
    const filteredList = filterValue
    ? toolTypeActions.filter((item) => item.toolAction.toLowerCase().includes(filterValue.toLowerCase()))
    : toolTypeActions;
  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
    setActivePage(0)
  };
  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected);
    setActivePage(selected.selected);
  };
  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
    setCurrentPage(0);
    setActivePage(0);
  };

  return (
    <div className="config card pad-10">
      <ToastContainer />

      <div className="card-header no-pad">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">
            Tool Type Actions ({currentItems?currentItems.length:0} / {filteredList?filteredList.length:0})
          </span>
        </h3> 
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
              <Link
            to='/qradar/tool-type-actions/add'
            className={`btn btn-new btn-small ${!isActionAuthorized('Create') ? 'disabled' : ''}`}
          >
            Add
          </Link>
          </div>
        </div>
      </div>
      <div className="row mb-5 mt-2">
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
        <table className="table alert-table fixed-table">
          <thead>
            <tr className="fw-bold text-muted bg-blue">
              <th className="w-500px">Tool Action Type</th>
              <th className="w-400px">Tool Type</th>
                <th className="w-200px">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={index} className="fs-12">
                  <td>{item.toolAction}</td>
                  <td>{item.toolTypeName}</td>
                   <td>
                        {isActionAuthorized('View') ? (
                          <span className='me-8' title='View'>
                            <i
                              className='fa fa-eye cursor'
                              onClick={() => handleNavigateToUpdate(item.toolTypeActionID)}
                            />
                          </span>
                        ) : (
                          <span className='me-8' title='View'>
                            <i className='fa fa-eye disabled' />
                          </span>
                        )}

                        {isActionAuthorized('Update') ? (
                          <span>
                            <Link
                              className='text-white'
                              to={`/qradar/tool-type-actions/update/${item.toolTypeActionID}`}
                              title='Edit'
                            >
                              <i className='fa fa-pencil cursor link' />
                            </Link>
                          </span>
                        ) : (
                          <span className='' title='Edit'>
                            <i className='fa fa-pencil disabled' />
                          </span>
                        )}

                        {isActionAuthorized('Delete') ? (
                          <span className='ms-8' onClick={() => handleDelete(item)} title='Delete'>
                            <i className='fa fa-trash cursor red' />
                          </span>
                        ) : (
                          <span className='ms-8' title='Delete'>
                            <i className='fa fa-trash disabled' />
                          </span>
                        )}
                      </td>
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
        {showConfirmation && (
          <DeleteConfirmation
            show={showConfirmation}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
        <Pagination
          pageCount={Math.ceil(filteredList.length / itemsPerPage)}
          handlePageClick={handlePageClick}
          itemsPerPage={itemsPerPage}
          handlePageSelect={handlePageSelect}
          forcePage={activePage}
        />
      </div>
    </div>
  );
};

export { ToolTypeActions };
