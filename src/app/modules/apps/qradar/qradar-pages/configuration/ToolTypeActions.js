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

const ToolTypeActions = () => {
  const handleError = useErrorBoundary();
  const globalAdminRole = Number(sessionStorage.getItem("globalAdminRole"));
  const clientAdminRole = Number(sessionStorage.getItem("clientAdminRole"));
  const [loading, setLoading] = useState(false);
  const [toolTypeActions, setToolTypeActions] = useState([]);
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

  return (
    <div className="card pad-10">
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
            {toolTypeActions.length > 0 ? (
              toolTypeActions.map((item, index) => (
                <tr key={index} className="fs-12">
                  <td>{item.toolAction}</td>
                  <td>{item.toolTypeName}</td>

                  {globalAdminRole === 1 || clientAdminRole === 1 ? (
                    <td>
                      <button className="btn btn-new btn-circle">
                        <Link
                          className="text-white"
                          to={`/qradar/tool-type-actions/update/${item.toolTypeActionID}`}
                        >
                          <i className="fa fa-pencil white" />
                        </Link>
                      </button>

                      <button
                        className="btn btn-danger btn-circle ms-5"
                        style={{ fontSize: "14px" }}
                        onClick={() => {
                          handleDelete(item);
                        }}
                      >
                        <i className="fa fa-trash white" />
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

export { ToolTypeActions };
