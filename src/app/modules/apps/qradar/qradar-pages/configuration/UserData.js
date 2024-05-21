import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { ToastContainer, toast } from "react-toastify";
import { notify, notifyFail } from "../components/notification/Notification";
import "react-toastify/dist/ReactToastify.css";
import { fetchOrganizations, fetchUserDelete } from "../../../../../api/Api";
import { fetchUsersUrl } from "../../../../../api/ConfigurationApi";
import { useErrorBoundary } from "react-error-boundary";
import DeleteConfirmation from "../../../../../../utils/DeleteConfirmation";

const UserData = () => {
  const handleError = useErrorBoundary();
  const userID = Number(sessionStorage.getItem("userId"));
  const roleID = Number(sessionStorage.getItem("roleID"));
  const globalAdminRole = Number(sessionStorage.getItem("globalAdminRole"));
  const clientAdminRole = Number(sessionStorage.getItem("clientAdminRole"));
  const orgId = Number(sessionStorage.getItem("orgId"));
  const orgIdFromSession = Number(sessionStorage.getItem("orgId"));
  const [selectedOrganization, setSelectedOrganization] = useState(
    orgIdFromSession
  );
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const organizationsResponse = await fetchOrganizations();
        setOrganizations(organizationsResponse);
      } catch (error) {
        handleError(error);
      }
    };
    fetchData();
  }, []);
  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmation(true);
  };
  const confirmDelete = async () => {
    if (itemToDelete) {
      const data = {
        userID: itemToDelete.userID,
        deletedDate: new Date().toISOString(),
        deletedUserId: Number(sessionStorage.getItem("userId")),
      };

      try {
        const response = await fetchUserDelete(data);
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
      // const orgId = Number(sessionStorage.getItem('orgId'));
      const data = await fetchUsersUrl(selectedOrganization, userID);
      console.log(data, "data111")
      setUsers(data);
      setLoading(false);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      reload();
    }, 300); 
    return () => clearTimeout(timer);
  }, [selectedOrganization]);
  const handleOrganizationChange = (e) => {
    const newOrganizationId = Number(e.target.value);
    setSelectedOrganization(newOrganizationId);
    reload();
  };

  return (
    <div className="config card pad-10">
      <ToastContainer />

      <div className="header-filter row">
        <div className="col-lg-4">
          <h3 className="lh-40">Users</h3>
        </div>

        <div className="col-lg-6">
          <label className="form-label fw-normal fc-gray fs-14 lh-40 float-left">
            <span>Organization: </span>
          </label>
          <span className="float-left">
            <select
              className="form-select form-select-solid bg-blue-light mg-left-10"
              data-kt-select2="true"
              data-placeholder="Select option"
              data-allow-clear="true"
              value={selectedOrganization}
              onChange={handleOrganizationChange}
            >
              {globalAdminRole === 1 &&
                organizations?.length > 0 &&
                organizations.map((item, index) => (
                  <option key={index} value={item.orgID}>
                    {item.orgName}
                  </option>
                ))}

              {globalAdminRole !== 1 &&
                organizations?.length > 0 &&
                organizations
                  .filter((item) => item.orgID === orgId)
                  .map((item, index) => (
                    <option key={index} value={item.orgID}>
                      {item.orgName}
                    </option>
                  ))}
            </select>
          </span>
        </div>

        {globalAdminRole === 1 || clientAdminRole === 1 ? (
          <div className="col-lg-2 fs-11 text-right">
            <Link to="/qradar/users-data/add" className="btn btn-new btn-small">
              Add New User
            </Link>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="card-body no-pad mt-5">
        <table className="table align-middle gs-0 gy-4 dash-table alert-table">
          <thead>
            <tr className="fw-bold text-muted bg-blue">
              <th className="min-w-50px">User ID</th>
              <th className="min-w-50px">User Name</th>
              <th className="min-w-50px">User Email</th>
              <th className="min-w-50px">User Role</th>
              {globalAdminRole === 1 || clientAdminRole === 1 ? (
                <th className="min-w-50px">Action</th>
              ) : (
                <></>
              )}
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {users !== null && users !== undefined ? (
              users?.map((item, index) => {
                if (
                  globalAdminRole === 1 ||
                  clientAdminRole === 1 ||
                  userID === item.userID
                ) {
                  return (
                    <tr key={index} className="fs-12">
                      <td>{item?.userID}</td>
                      <td>{item?.name}</td>
                      <td>{item?.emailId}</td>
                      <td>{item?.roleName}</td>

                      {globalAdminRole === 1 || clientAdminRole === 1 ? (
                        <td>
                          <Link
                            className="text-white"
                            to={`/qradar/users-data/update/${item.userID}`}
                            title="Update"
                          >
                            <span>
                              <i className="fa fa-pencil link" />
                            </span>
                          </Link>
                          <span
                            className="ms-8"
                            onClick={() => {
                              handleDelete(item);
                            }}
                            title="Delete"
                          >
                            <i className="fa fa-trash red" />
                          </span>
                        </td>
                      ) : (
                        <></>
                      )}
                    </tr>
                  );
                }
              })
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
      </div>
    </div>
  );
};

export { UserData };
