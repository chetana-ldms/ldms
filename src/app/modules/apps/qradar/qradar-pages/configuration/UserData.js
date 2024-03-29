import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { ToastContainer, toast } from "react-toastify";
import { notify, notifyFail } from "../components/notification/Notification";
import "react-toastify/dist/ReactToastify.css";
import { fetchOrganizations, fetchUserDelete } from "../../../../../api/Api";
import { fetchUsersUrl } from "../../../../../api/ConfigurationApi";
import { useErrorBoundary } from "react-error-boundary";

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
  const handleDelete = async (item) => {
    const userID = item.userID;
    const deletedUserId = Number(sessionStorage.getItem("userId"));
    const deletedDate = new Date().toISOString();
    const data = {
      deletedUserId,
      deletedDate,
      userID,
    };
    try {
      setLoading(true);
      await fetchUserDelete(data);
      notify("User Deleted");
      await reload();
      setLoading(false);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const reload = async () => {
    try {
      setLoading(true);
      // const orgId = Number(sessionStorage.getItem('orgId'));
      const data = await fetchUsersUrl(selectedOrganization);
      setUsers(data);
      setLoading(false);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, [selectedOrganization]);
  const handleOrganizationChange = (e) => {
    const newOrganizationId = Number(e.target.value);
    setSelectedOrganization(newOrganizationId);
    reload();
  };

  return (
    <div className="card pad-10">
      <ToastContainer />

      <div className="header-filter row">
        <div className="col-lg-7">
          <h3 className="uppercase lh-40">Users</h3>
        </div>

        <div className="col-lg-3">
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
              users.map((item, index) => {
                if (
                  globalAdminRole === 1 ||
                  clientAdminRole === 1 ||
                  userID === item.userID
                ) {
                  return (
                    <tr key={index} className="fs-12">
                      <td>{item.userID}</td>
                      <td>{item.name}</td>
                      <td>{item.emailId}</td>
                      <td>{item.roleName}</td>

                      {globalAdminRole === 1 || clientAdminRole === 1 ? (
                        <td>
                          <Link
                            className="text-white"
                            to={`/qradar/users-data/update/${item.userID}`}
                            title="Update"
                          >
                            <button className="btn btn-new btn-circle">
                              <i className="fa fa-pencil" />
                            </button>
                          </Link>
                          ) : (
                          <button className="btn btn-new btn-circle" disabled>
                            <i className="fa fa-pencil" />
                          </button>
                          <button
                            className="btn btn-danger btn-circle ms-5"
                            onClick={() => {
                              handleDelete(item);
                            }}
                            title="Delete"
                          >
                            <i className="fa fa-trash" />
                          </button>
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
      </div>
    </div>
  );
};

export { UserData };
