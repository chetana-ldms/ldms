import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { ToastContainer, toast } from "react-toastify";
import { notify, notifyFail } from "../components/notification/Notification";
import "react-toastify/dist/ReactToastify.css";
import { fetchRuleActionDelete } from "../../../../../api/Api";
import axios from "axios";
import { fetchRuleActions } from "../../../../../api/ConfigurationApi";
import { useErrorBoundary } from "react-error-boundary";

const RulesActions = () => {
  const handleError = useErrorBoundary();
  const globalAdminRole = Number(sessionStorage.getItem("globalAdminRole"));
  const clientAdminRole = Number(sessionStorage.getItem("clientAdminRole"));
  const orgId = Number(sessionStorage.getItem("orgId"));
  const [loading, setLoading] = useState(false);
  const [tools, setTools] = useState([]);
  console.log(tools, "tools");
  const { status } = useParams();

  const handleDelete = async (item) => {
    console.log(item, "item");
    const deletedUserId = sessionStorage.getItem("userId");
    const deletedDate = new Date().toISOString();
    const data = {
      ruleActionID: item.ruleActionID,
      deletedDate,
      deletedUserId,
    };
    try {
      const responce = await fetchRuleActionDelete(data);
      if (responce.isSuccess) {
        notify("Rule Action Deleted");
      } else {
        notifyFail("Rule Action not Deleted");
      }
      await reload();
    } catch (error) {
      handleError(error);
    }
  };
  const reload = async () => {
    try {
      setLoading(true);
      const data = await fetchRuleActions(orgId);
      setTools(data);
      setLoading(false);
    } catch (error) {
      handleError(error);
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
          <span className="card-label fw-bold fs-3 mb-1">Rule Actions</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            {globalAdminRole === 1 || clientAdminRole === 1 ? (
              <Link
                to="/qradar/rules-actions/add"
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
              <th>Rule Action Name</th>
              <th>Tool Type</th>
              <th>Tool</th>
              {globalAdminRole === 1 || clientAdminRole === 1 ? (
                <th>Action</th>
              ) : (
                <></>
              )}
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {tools !== null && tools.length > 0 ? (
              tools.map((item, index) => (
                <tr key={index} className="fs-12">
                  <td>{item.ruleActionName}</td>
                  <td>{item.toolTypeName}</td>
                  <td>{item.toolName}</td>

                  {globalAdminRole === 1 || clientAdminRole === 1 ? (
                    <td>
                      <button className="btn btn-primary btn-circle">
                        <Link
                          className="text-white"
                          to={`/qradar/rules-actions/update/${item.ruleActionID}`}
                          title="Edit"
                        >
                          <i className="fa fa-pencil cursor white" />
                        </Link>
                      </button>

                      <button
                        className="btn btn-danger btn-circle ms-5"
                        style={{ fontSize: "14px" }}
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
                <td colSpan="4">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { RulesActions };
