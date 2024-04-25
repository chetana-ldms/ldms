import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notify, notifyFail } from "../components/notification/Notification";
import { fetchOrganizationAddUrl } from "../../../../../api/ConfigurationApi";
import { useErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";

const AddOrganizations = () => {
  const handleError = useErrorBoundary();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const orgName = useRef();
  const address = useRef();
  const mobileNo = useRef();
  const email = useRef();
  const errors = {};

  const handleSubmit = async (event) => {
    setLoading(true);

    if (!orgName.current.value) {
      errors.orgName = "Enter Organization Name";
      setLoading(false);
      return errors;
    }
    if (!mobileNo.current.value) {
      errors.mobileNo = "Enter Organization Mobile No.";
      setLoading(false);
      return errors;
    }
    if (!email.current.value) {
      errors.email = "Enter Organization Mobile No.";
      setLoading(false);
      return errors;
    }
    if (!address.current.value) {
      errors.address = "Enter Organization Mobile No.";
      setLoading(false);
      return errors;
    }

    event.preventDefault();
    const createdUserId = Number(sessionStorage.getItem("userId"));
    const createdDate = new Date().toISOString();
    var data = {
      orgName: orgName.current.value,
      address: address.current.value,
      mobileNo: mobileNo.current.value,
      email: email.current.value,
      createdUserId,
      createdDate,
    };
    try {
      const responseData = await fetchOrganizationAddUrl(data);
      const { isSuccess } = responseData;

      if (isSuccess) {
        notify("Organizations Saved");
        setTimeout(() => {
          navigate("/qradar/organizations/updated");
        }, 2000);
      } else {
        notifyFail("Failed to save Organizations");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="config card">
      <ToastContainer />
      <div className="card-header bg-heading">
        <h3 className="card-title align-items-start flex-column">
          <span className="white">Add New Organization</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <Link
              to="/qradar/organizations/list"
              className="white fs-15 text-underline"
            >
              <i className="fa fa-chevron-left white mg-right-5" />
              Back
            </Link>
          </div>
        </div>
      </div>
      <form>
        <div className="card-body pad-10 mt-5">
          <div className="row mb-6 table-filter">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="fv-row mb-0">
                <label
                  htmlFor="orgName"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Organization Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid"
                  required
                  id="orgName"
                  ref={orgName}
                  placeholder="Ex: lancesoft"
                />
              </div>
            </div>
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="fv-row mb-0">
                <label
                  htmlFor="mobileNo"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Organization Mobile
                </label>
                <input
                  type="tel"
                  pattern="[0-9]"
                  required
                  className="form-control form-control-lg form-control-solid"
                  id="mobileNo"
                  ref={mobileNo}
                  placeholder="Ex: 01 0102030405"
                />
              </div>
            </div>
            <div className="col-lg-6 mb-4 mt-5 mb-lg-0">
              <div className="fv-row mb-0">
                <label
                  htmlFor="email"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Organization Email
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg form-control-solid"
                  id="email"
                  ref={email}
                  placeholder="email@organization.com"
                  required
                />
              </div>
            </div>
            <div className="col-lg-6 mb-4 mb-lg-0 mt-5">
              <div className="fv-row mb-0">
                <label
                  htmlFor="address"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Organization Address
                </label>
                <input
                  type="text"
                  required
                  className="form-control form-control-lg form-control-solid"
                  id="address"
                  ref={address}
                  placeholder="Address : "
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
      </form>
    </div>
  );
};

export { AddOrganizations };
