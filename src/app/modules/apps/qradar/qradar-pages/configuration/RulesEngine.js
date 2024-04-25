import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { notify, notifyFail } from "../components/notification/Notification";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchRulesDelete } from "../../../../../api/Api";
import axios from "axios";
import { fetchRules } from "../../../../../api/ConfigurationApi";
import { useErrorBoundary } from "react-error-boundary";

const RulesEngine = () => {
  const handleError = useErrorBoundary();
  const globalAdminRole = Number(sessionStorage.getItem("globalAdminRole"));
  const clientAdminRole = Number(sessionStorage.getItem("clientAdminRole"));
  const orgId = Number(sessionStorage.getItem("orgId"));
  const [loading, setLoading] = useState(false);
  const [tools, setTools] = useState([]);

  const handleDelete = async (item) => {
    console.log(item, "item");
    const deletedUserId = Number(sessionStorage.getItem("userId"));
    const deletedDate = new Date().toISOString();
    const data = {
      ruleID: item.ruleID,
      deletedDate,
      deletedUserId,
    };
    try {
      const responce = await fetchRulesDelete(data);
      if (responce.isSuccess) {
        notify("Rule Deleted");
      } else {
        notifyFail("Rule not Deleted");
      }
      await reload();
    } catch (error) {
      handleError(error);
    }
  };
  const reload = async () => {
    try {
      setLoading(true);
      const data = await fetchRules(orgId);
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
    <div className="config card pad-10">
      <ToastContainer />
      <div className="card-header no-pad">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Rule Engine</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            {globalAdminRole === 1 || clientAdminRole === 1 ? (
              <Link
                to="/qradar/rules-engine/add"
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
              <th>Rule Name</th>
              {/* <th className='min-w-50px'>Rule Conditions</th> */}
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
                  <td>{item.ruleName}</td>
                  {/* <td>{item.ruleCatagoryID}</td> */}

                  {globalAdminRole === 1 || clientAdminRole === 1 ? (
                    <td>
                      <span className="btn btn-new btn-circle">
                        <Link
                          className="text-white"
                          to={`/qradar/rules-engine/update/${item.ruleID}`}
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

export { RulesEngine };
