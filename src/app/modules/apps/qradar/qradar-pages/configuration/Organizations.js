import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { ToastContainer } from "react-toastify";
import { notify, notifyFail } from "../components/notification/Notification";
import "react-toastify/dist/ReactToastify.css";
import { fetchOrganizationDelete } from "../../../../../api/Api";
import axios from "axios";
import { fetchOrganizationsUrl } from "../../../../../api/ConfigurationApi";
import { useErrorBoundary } from "react-error-boundary";

const Organizations = () => {
  const handleError = useErrorBoundary();
  const [loading, setLoading] = useState(false);
  const [tools, setTools] = useState([]);
  console.log(tools, "tools222");
  const userID = Number(sessionStorage.getItem("userId"));
  const orgId = Number(sessionStorage.getItem("orgId"));
  const globalAdminRole = Number(sessionStorage.getItem("globalAdminRole"));
  const clientAdminRole = Number(sessionStorage.getItem("clientAdminRole"));
  const handleDelete = async (item) => {
    const deletedUserId = Number(sessionStorage.getItem("userId"));
    const deletedDate = new Date().toISOString();
    const data = {
      orgID: item.orgID,
      deletedDate,
      deletedUserId,
    };
    try {
      const responce = await fetchOrganizationDelete(data);
      if (responce.isSuccess) {
        notify("Organization Deleted");
      } else {
        notifyFail("Organization not Deleted");
      }
      await reload();
    } catch (error) {
      handleError(error);
    }
  };

  const reload = async () => {
    try {
      setLoading(true);
      const response = await fetchOrganizationsUrl();
      setTools(
        userID === 1
          ? response
          : response.filter((item) => item.orgID === orgId)
      );
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    reload();
  }, []);
  return (
    <div className="card">
      <ToastContainer />
      <div className="card-header no-pad">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Organizations</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            {userID === 1 ? (
              <Link
                to="/qradar/organizations/add"
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
      <div className="card-body pad-10">
        <table className="table align-middle gs-0 gy-4 dash-table alert-table">
          <thead>
            <tr className="fw-bold text-muted bg-blue">
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Mobile No.</th>
              <th>Email</th>
              {globalAdminRole === 1 || clientAdminRole === 1 ? (
                <th>Actions</th>
              ) : (
                <></>
              )}
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}

            {tools.length > 0 ? (
              tools.map((item, index) => (
                <tr key={index} className="fs-12">
                  <td>{item.orgID}</td>
                  <td>{item.orgName}</td>
                  <td>{item.address}</td>
                  <td>{item.mobileNo}</td>
                  <td>{item.email}</td>

                  {globalAdminRole === 1 || clientAdminRole === 1 ? (
                    <td>
                      <button className="btn btn-circle btn-primary">
                        <Link
                          className="text-white"
                          to={`/qradar/organizations/update/${item.orgID}`}
                          title="Edit"
                        >
                          <i className="fa fa-pencil cursor white" />
                        </Link>
                      </button>

                      <button
                        className="btn btn-danger btn-circle ms-5"
                        onClick={() => {
                          handleDelete(item);
                        }}
                        title="Delete"
                      >
                        <i className="fa fa-trash cursor white" />
                      </button>
                    </td>
                  ) : (
                    <></>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { Organizations };
