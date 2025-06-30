import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { notify, notifyFail } from "../components/notification/Notification";
import axios from "axios";
import {
  fetchRolesDetailUrl,
  fetchRolesUpdateUrl,
} from "../../../../../api/ConfigurationApi";
import { fetchOrganizations } from "../../../../../api/Api"; // Make sure this import is present
import { ToastContainer } from "react-toastify";

const UpdateRoleData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState({
    roleName: "",
    orgId: "", // Add orgId here
  });
  const [organizations, setOrganizations] = useState([]); // <-- Add this line
  const { id } = useParams();
  const roleName = useRef();
  const errors = {};
  const location = useLocation();
  const [save, setSave] = useState(location.state?.save || "");
  useEffect(() => {
    setSave(location.state?.save || "");
  }, [location.state]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const Response = await fetchRolesDetailUrl(id);
        setRole(Response); // Response should be an object with roleName and orgId
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);
  useEffect(() => {
    const getOrganizations = async () => {
      try {
        const orgs = await fetchOrganizations();
        setOrganizations(orgs);
      } catch (error) {
        console.log(error);
      }
    };
    getOrganizations();
  }, []);
  const handleChange = (e) => {
    setRole({
      ...role,
      roleName: e.target.value,
    });
  };
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const modifiedUserId = Number(sessionStorage.getItem("userId"));
    const modifieddate = new Date().toISOString();
    const orgId = Number(sessionStorage.getItem("orgId"));
    var data = {
      roleName: roleName.current.value,
      sysrole: 0,
      orgId: role.orgId, // Use orgId from role object
      globalAdminRole: 0,
      clientAdminRole: 0,
      modifieddate,
      modifiedUserId,
      roleID: Number(id),
    };
    console.log("data", data);
    try {
      const responseData = await fetchRolesUpdateUrl(data);
      const { isSuccess } = responseData;

      if (isSuccess) {
        notify("Role Updated");
        setTimeout(() => {
          navigate("/qradar/roles-data/list");
        }, 2000);
      } else {
        notifyFail("Role Update Failed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="config card">
      <ToastContainer />
      <div className="card-header bg-heading">
        <h3 className="card-title align-items-start flex-column">
          {save ? (
            <span className="white">View User Role</span>
          ) : (
            <span className="white">Update User Role</span>
          )}
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <Link
              to="/qradar/roles-data/list"
              className="white fs-15 text-underline"
            >
              <i className="fa fa-chevron-left white mg-right-5" />
              Back
            </Link>
          </div>
        </div>
      </div>
      <form>
        <div className="card-body pad-10">
          <div className="row mb-6 table-filter">
            <div className="col-lg-4 mb-4 mb-lg-0">
              <div className="fv-row mb-0">
                <label
                  htmlFor="userName"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Enter Role
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid"
                  id="role"
                  ref={roleName}
                  maxLength={200}
                  value={role?.roleName || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-lg-4 mb-4 mb-lg-0">
              <div className="fv-row mb-0">
                <label className="form-label fs-6 fw-bolder mb-3">
                  Select Organization
                </label>
                <select
                  className="form-select form-select-lg form-select-solid"
                  value={role.orgId || ""}
                  onChange={(e) =>
                    setRole({ ...role, orgId: Number(e.target.value) })
                  }
                  disabled={!!save}
                >
                  <option value="">Select Organization</option>
                  {Number(sessionStorage.getItem('globalAdminRole')) === 1 && organizations.length > 0
                    ? organizations.map(org => (
                        <option key={org.orgID} value={org.orgID}>
                          {org.orgName}
                        </option>
                      ))
                    : organizations
                        .filter(org => org.orgID === Number(sessionStorage.getItem('orgId')))
                        .map(org => (
                          <option key={org.orgID} value={org.orgID}>
                            {org.orgName}
                          </option>
                        ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end pad-10">
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-new btn-small"
            style={{ display: loading || save ? "none" : "inline-block" }}
          >
            {!loading && "Update Changes"}
            {loading && (
              <span className="indicator-progress" style={{ display: "block" }}>
                Please wait...{" "}
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export { UpdateRoleData };
