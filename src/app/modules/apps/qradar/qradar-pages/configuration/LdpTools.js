import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { ToastContainer, toast } from "react-toastify";
import { notify, notifyFail } from "../components/notification/Notification";
import "react-toastify/dist/ReactToastify.css";
import { fetchLDPToolsDelete } from "../../../../../api/Api";
import axios from "axios";
import { fetchLDPToolsUrl } from "../../../../../api/ConfigurationApi";
import { useErrorBoundary } from "react-error-boundary";

const LdpTools = () => {
  const handleError = useErrorBoundary();
  const globalAdminRole = Number(sessionStorage.getItem("globalAdminRole"));
  const clientAdminRole = Number(sessionStorage.getItem("clientAdminRole"));
  const [loading, setLoading] = useState(false);
  const [tools, setTools] = useState([]);

  const handleDelete = async (item) => {
    console.log(item, "item");
    const deletedUserId = Number(sessionStorage.getItem("userId"));
    const deletedDate = new Date().toISOString();
    const data = {
      toolId: item.toolId,
      deletedDate,
      deletedUserId,
    };
    try {
      setLoading(true);
      const responce = await fetchLDPToolsDelete(data);
      if (responce.isSuccess) {
        notify("LDP Tool Deleted");
      } else {
        notifyFail("LDP Tool not Deleted");
      }
      await reload();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };
  const reload = async () => {
    setLoading(true);
    const response = await fetchLDPToolsUrl();
    setTools(response);
    setLoading(false);
  };
  useEffect(() => {
    reload();
  }, []);

  return (
    <div className="card pad-10">
      <ToastContainer />
      <div className="card-header no-pad mb-5 border-0">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1 uppercase">
            LDP Tools
          </span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            {globalAdminRole === 1 || clientAdminRole === 1 ? (
              <Link
                to="/qradar/ldp-tools/add"
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
              <th>Tool ID</th>
              <th>Tool Name</th>
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
            {tools !== null ? (
              tools.map((item, index) => (
                <tr key={index} className="fs-12">
                  <td>{item.toolId}</td>
                  <td>{item.toolName}</td>
                  <td>{item.toolType}</td>
                  {/* <td>{item.createdDate}</td> */}

                  {globalAdminRole === 1 || clientAdminRole === 1 ? (
                    <td>
                      <button className="btn btn-new btn-circle" title="Edit">
                        <Link
                          className="text-white"
                          to={`/qradar/ldp-tools/update/${item.toolId}`}
                        >
                          <i className="fa fa-pencil white pointer fs-15" />
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
                        <i className="fa fa-trash pointer white fs-15" />
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

export { LdpTools };
