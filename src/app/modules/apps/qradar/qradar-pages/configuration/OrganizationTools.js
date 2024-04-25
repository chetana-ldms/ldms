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

const OrganizationTools = () => {
  const handleError = useErrorBoundary();
  const userID = Number(sessionStorage.getItem("userId"));
  const orgId = Number(sessionStorage.getItem("orgId"));
  const globalAdminRole = Number(sessionStorage.getItem("globalAdminRole"));
  const clientAdminRole = Number(sessionStorage.getItem("clientAdminRole"));
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (item) => {
    console.log(item, "item");
    const deletedUserId = Number(sessionStorage.getItem("userId"));
    const deletedDate = new Date().toISOString();
    const data = {
      orgToolID: item.orgToolID,
      deletedDate,
      deletedUserId,
    };
    try {
      setLoading(true);
      const responce = await fetchOrganizationToolsDelete(data);
      if (responce.isSuccess) {
        notify("Organizations Tool Deleted");
      } else {
        notifyFail("Organizations Tool not Deleted");
      }
      await reload();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
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
    reload();
  }, []);

  return (
    <div className="config card pad-10">
      <ToastContainer />
      <div className="card-header no-pad">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">
            Organizations Tools
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
            ) : tools === null ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No data found.
                </td>
              </tr>
            ) : (
              tools.map((item, index) => {
                const shouldDisplay =
                  globalAdminRole === 1 || item.orgID === orgId;

                if (shouldDisplay) {
                  return (
                    <tr key={index} className="fs-12">
                      <td>{index + 1}</td>
                      <td>{item.toolName}</td>
                      <td>{item.orgName}</td>
                      <td style={{ maxWidth: "200px" }}>{item.authKey}</td>

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
      </div>
    </div>
  );
};

export { OrganizationTools };
