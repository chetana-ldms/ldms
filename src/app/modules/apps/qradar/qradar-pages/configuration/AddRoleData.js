import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { notify, notifyFail } from "../components/notification/Notification";
import { fetchRolesAddUrl } from "../../../../../api/ConfigurationApi";
import { ToastContainer } from "react-toastify";

const AddRoleData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const userName = useRef();
  const roleName = useRef();
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    if (!roleName.current.value) {
      notifyFail('Enter role Name')
      setLoading(false)
      return
    }
    const createdUserId = Number(sessionStorage.getItem("userId"));
    const createdDate = new Date().toISOString();
    const orgId = Number(sessionStorage.getItem("orgId"));
    var data = {
      roleName: roleName.current.value,
      sysrole: 0,
      orgId,
      globalAdminRole: 0,
      clientAdminRole: 0,
      createdDate,
      createdUserId,
    };
    console.log("data", data);
    try {
      const responseData = await fetchRolesAddUrl(data);
      const { isSuccess, message } = responseData;

      if (isSuccess) {
        notify(message);
        navigate("/qradar/roles-data/list");
      } else {
        notifyFail(message);
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
          <span className="white">Add User Role </span>
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
      <div className="card-body pad-10">
        <div className="row mb-6 table-filter">
          {/* <div className='col-lg-4 mb-4 mb-lg-0'>
            <div className='fv-row mb-0'>
              <label htmlFor='userName' className='form-label fs-6 fw-bolder mb-3'>
              Enter User Name
              </label>
              <input
                type='text'
                className='form-control form-control-lg form-control-solid'
                id='userName'
                ref={userName}
                placeholder='Ex: username'
              />
            </div>
          </div> */}
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
                placeholder="Ex: Client Admin"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer d-flex justify-content-end pad-10">
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
    </div>
  );
};

export { AddRoleData };
