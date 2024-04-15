import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { ToastContainer, toast } from "react-toastify";
import { notify, notifyFail } from "../components/notification/Notification";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useErrorBoundary } from "react-error-boundary";
import {
  fetchRolesDeleteUrl,
  fetchRolesUrl,
} from "../../../../../api/ConfigurationApi";
import { fetchLDPToolsDelete } from "../../../../../api/Api";

const RoleData = () => {
  const handleError = useErrorBoundary();
  const globalAdminRole = Number(sessionStorage.getItem("globalAdminRole"));
  const clientAdminRole = Number(sessionStorage.getItem("clientAdminRole"));
  const orgId = Number(sessionStorage.getItem("orgId"));
  const orgIdFromSession = Number(sessionStorage.getItem("orgId"));
  const [selectedOrganization, setSelectedOrganization] = useState(
    orgIdFromSession
  );
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  console.log(roles, "roles111");

  const reload = async () => {
    try {
      setLoading(true);
      // const orgId = Number(sessionStorage.getItem('orgId'));
      const data = await fetchRolesUrl(orgId);
      setRoles(data);
      setLoading(false);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);
  const handleDelete = async (item) => {
    console.log(item, "item");
    const deletedUserId = Number(sessionStorage.getItem("userId"));
    const deletedDate = new Date().toISOString();
    const data = {
      roleID: item.roleID,
      deletedDate,
      deletedUserId,
    };
    try {
      setLoading(true);
      const responce = await fetchRolesDeleteUrl(data);
      if (responce.isSuccess) {
        notify("Role Deleted");
      } else {
        notifyFail("You cannot delete the system roles");
      }
      await reload();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };
  return (
    <div className="config card pad-10">
      <ToastContainer />
      <div className="card-header no-pad">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Roles</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            {globalAdminRole === 1 || clientAdminRole === 1 ? (
              <Link
                to="/qradar/roles-data/add"
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
      <div className="card-body no-pad">
        <table className="table align-middle gs-0 gy-4 dash-table alert-table">
          <thead>
            <tr className="fw-bold text-muted bg-blue">
              <th>Role ID</th>
              <th>Role Name</th>
              {globalAdminRole === 1 || clientAdminRole === 1 ? (
                <th>Actions</th>
              ) : (
                <></>
              )}
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {roles.length > 0 ? (
              roles.map((item, index) => (
                <tr key={index} className="fs-12">
                  <td>{item.roleID}</td>
                  <td>{item.roleName}</td>
                  {globalAdminRole === 1 || clientAdminRole === 1 ? (
                    <td>
                      <span>
                        <Link
                          className="text-white"
                          to={`/qradar/roles-data/update/${item.roleID}`}
                          title="Edit"
                        >
                          <i className="fa fa-pencil link pointer fs-15" />
                        </Link>
                      </span>

                      <span
                        className="ms-8"
                        style={{ fontSize: "14px" }}
                        onClick={() => {
                          handleDelete(item);
                        }}
                      >
                        <i className="fa fa-trash red pointer fs-15" />
                      </span>
                    </td>
                  ) : (
                    <></>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { RoleData };
