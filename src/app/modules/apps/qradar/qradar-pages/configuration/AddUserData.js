import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchOrganizations, fetchRoles } from "../../../../../api/Api";
import axios from "axios";
import { fetchUserAddUrl } from "../../../../../api/ConfigurationApi";
import { notify, notifyFail } from "../components/notification/Notification";
import { useErrorBoundary } from "react-error-boundary";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { ToastContainer } from "react-toastify";

const AddUserData = () => {
  const handleError = useErrorBoundary();
  const orgId = Number(sessionStorage.getItem("orgId"));
  const roleID = Number(sessionStorage.getItem("roleID"));
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roleTypes, setRoleTypes] = useState([]);
  console.log(roleTypes, "roleTypes");
  const [organizationList, setOrganizationList] = useState([]);
  console.log(organizationList, "organizationList1111");
  const userName = useRef();
  const userEmail = useRef();
  const orgID = useRef();
  const roleType = useRef();
  const errors = {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const organizationsResponse = await fetchOrganizations();
        setOrganizationList(organizationsResponse);
      } catch (error) {
        handleError(error);
      }
    };

    fetchData();
  }, []);
  const handleSubmit = async (event) => {
    setLoading(true);

    if (!userName.current.value) {
      errors.userName = "Enter username";
      setLoading(false);
      return errors;
    }
    if (!userEmail.current.value) {
      errors.passWord = "Enter Email";
      setLoading(false);
      return errors;
    }
    if (!orgID.current.value) {
      errors.passWord = "Enter Organization";
      setLoading(false);
      return errors;
    }

    if (!roleType.current.value) {
      errors.roleType = "Select Role Type";
      setLoading(false);
      return errors;
    }

    event.preventDefault();
    const createdUserId = Number(sessionStorage.getItem("userId"));
    const createdDete = new Date().toISOString();
    // const orgId = sessionStorage.getItem('orgId')
    var data = {
      name: userName.current.value,
      emailId: userEmail.current.value,
      roleID: roleType.current.value,
      orgId: Number(orgID.current.value),
      sysUser: 0,
      createdUserId,
      createdDete,
    };
    try {
      const responseData = await fetchUserAddUrl(data);
      const { isSuccess, message } = responseData;

      if (isSuccess) {
        notify("User Saved");
        setTimeout(() => {
          navigate("/qradar/users-data/list");
        }, 2000);
      } else {
        notifyFail("Failed to save User");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRoles(orgId);
        setRoleTypes(data);
      } catch (error) {
        handleError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="config card">
    <ToastContainer />
      {loading && <UsersListLoading />}
      <div className="card-header bg-heading mb-5">
        <h3 className="card-title">
          <span className="card-label white">Add New User</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <Link
              to="/qradar/users-data/list"
              className="white fs-15 text-underline"
            >
              <i className="fa fa-chevron-left white mg-right-5" />
              Back
            </Link>
          </div>
        </div>
      </div>
      <form className="table-filter" action="" method="post">
        <div className="card-body pad-10">
          <div className="row mb-6">
            <div className="col-lg-3 mb-4 mb-lg-0">
              <div className="fv-row mb-0">
                <label
                  htmlFor="userName"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  User Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid"
                  required
                  aria-required="true"
                  id="userName"
                  ref={userName}
                  placeholder="Ex: username"
                />
              </div>
            </div>
            <div className="col-lg-3 mb-4 mb-lg-0">
              <div className="fv-row mb-0">
                <label
                  htmlFor="userName"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  User Email
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg form-control-solid"
                  required
                  aria-required="true"
                  id="userEmail"
                  ref={userEmail}
                  placeholder="Ex: UserEmail"
                />
              </div>
            </div>

            <div className="col-lg-3 mb-4 mb-lg-0">
              <div className="fv-row mb-0">
                <label
                  htmlFor="orgID"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Organization
                </label>
                <select
                  className="form-select form-select-solid"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-allow-clear="true"
                  id="orgID"
                  ref={orgID}
                  required
                >
                  <option value="">Select</option>
                  {roleID === 1 &&
                    organizationList?.length > 0 &&
                    organizationList.map((item, index) => (
                      <option key={index} value={item.orgID}>
                        {item.orgName}
                      </option>
                    ))}

                  {roleID !== 1 &&
                    organizationList?.length > 0 &&
                    organizationList
                      .filter((item) => item.orgID === orgId)
                      .map((item, index) => (
                        <option key={index} value={item.orgID}>
                          {item.orgName}
                        </option>
                      ))}
                </select>
              </div>
            </div>
            <div className="col-lg-3 mb-4 mb-lg-0">
              <div className="fv-row mb-0">
                <label
                  htmlFor="toolType"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Select Role Type
                </label>
                <select
                  className="form-select form-select-solid"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-allow-clear="true"
                  id="roleType"
                  ref={roleType}
                  required
                >
                  <option value="">Select Role Type</option>
                  {roleTypes.map((item, index) => (
                    <option value={item.roleID} key={index}>
                      {item.roleName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer text-right pad-10">
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-new btn-small"
            disabled={loading}
          >
            {!loading && "Save Changes"}
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

export { AddUserData };
