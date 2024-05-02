import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchOrganizationDetails } from "../../../../../api/Api";
import { notify, notifyFail } from "../components/notification/Notification";
import { fetchOrganizationUpdateUrl } from "../../../../../api/ConfigurationApi";
import { useErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";

const UpdateOrganizations = () => {
  const handleError = useErrorBoundary();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const orgName = useRef();
  const address = useRef();
  const mobileNo = useRef();
  const email = useRef();
  const [organizationData, setOrganizationData] = useState(null);
  const errors = {};
  const handleSubmit = async (event) => {
    setLoading(true);
    if (!orgName.current.value) {
      errors.orgName = "Enter Organization Name";
      setLoading(false);
      return errors;
    }
    if (!address.current.value) {
      errors.address = "Enter address";
      setLoading(false);
      return errors;
    }
    const mobileValue = mobileNo.current.value;
    const mobileRegex = /^[0-9]{10,15}$/;

    if (!mobileRegex.test(mobileValue)) {
        notifyFail('Phone number must contain only numeric characters and be between 10 and 15 digits long.');
        setLoading(false);
        return;
    }
    const emailValue = email.current.value
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(emailValue)) {
      notifyFail('Enter a valid Email')
      setLoading(false)
      return
    }
    event.preventDefault();
    const updatedUserId = Number(sessionStorage.getItem("userId"));
    const updatedDate = new Date().toISOString();
    var data = {
      orgName: orgName.current.value,
      address: address.current.value,
      mobileNo: mobileNo.current.value,
      orgID: id,
      email: email.current.value,
      updatedUserId,
      updatedDate,
    };
    try {
      const responseData = await fetchOrganizationUpdateUrl(data);
      const { isSuccess, message } = responseData;

      if (isSuccess) {
        notify(message);
        setTimeout(() => {
          navigate("/qradar/organizations/updated");
        }, 2000);
      } else {
        notifyFail(message);
      }
    } catch (error) {
      handleError(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOrganizationDetails(
          id,
          orgName,
          address,
          mobileNo,
          email
        );
        setOrganizationData(data);
      } catch (error) {
        handleError(error);
      }
    };

    fetchData();
  }, [id, orgName, address, mobileNo, email]);

  return (
    <div className="config card">
       <ToastContainer />
      <div className="card-header bg-heading">
        <h3 className="card-title align-items-start flex-column">
          <span className="white">Update Organization</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <Link to="/qradar/organizations/list" className="white fs-15">
              <i className="fa fa-chevron-left white mg-right-5" />
              Back
            </Link>
          </div>
        </div>
      </div>
      <form>
        <div className="card-body pad-10">
          <div className="row mb-6 table-filter">
            <div className="col-lg-6 mb-5">
              <div className="fv-row mb-0">
                <label
                  htmlFor="orgName"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Organization Name
                </label>
                <input
                  type="text"
                  required
                  className="form-control form-control-lg form-control"
                  id="orgName"
                  ref={orgName}
                  placeholder="Ex: lancesoft"
                />
              </div>
            </div>
            <div className='col-lg-6 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='mobileNo' className='form-label fs-6 fw-bolder mb-3'>
                  Organization Mobile
                </label>
                <input
                  type='tel'
                  required
                  className='form-control form-control-lg form-control-solid'
                  id='mobileNo'
                  ref={mobileNo}
                  placeholder='Ex: 01 0102030405'
                  minLength={10} 
                  maxLength={15} 
                  pattern='^[0-9]{10,15}$' 
                  title='Phone number must be between 10 and 15 digits.' 
                />
              </div>
            </div>
            <div className="col-lg-6 mb-4 mb-lg-0">
            <div className='fv-row mb-0'>
                <label htmlFor='email' className='form-label fs-6 fw-bolder mb-3'>
                  Organization Email
                </label>
                <input
                  type='email'
                  className='form-control form-control-lg form-control-solid'
                  id='email'
                  ref={email}
                  placeholder='email@organization.com'
                  required
                  pattern='^[^\s@]+@[^\s@]+\.[^\s@]+$'
                  title='Please enter a valid email address'
                />
              </div>
            </div>
            <div className="col-lg-6 mb-4 mb-lg-0">
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
                  placeholder="Address "
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

export { UpdateOrganizations };
