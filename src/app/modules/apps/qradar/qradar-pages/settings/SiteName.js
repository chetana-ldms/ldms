import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { notifyFail } from '../components/notification/Notification';

const SiteName = ({ setActiveStep }) => {
  const siteName = useRef();
  const siteDescription = useRef();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = (event) => {
    event.preventDefault();

    if (!siteName.current.value) {
      notifyFail('Please enter the site name.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setActiveStep('site-type');
    }, 2000);
  };

  const handleQuit = () => {
    navigate('/qradar/sites/list'); 
  };

  return (
    <div className="config card">
      <ToastContainer />
      <form>
        <div className="form-group">
          <div className="row justify-content-center mb-3">
            <div className="col-md-6">
              <label htmlFor="siteName" className="form-label fs-6 fw-bolder d-flex justify-content-start">
                Site Name *
              </label>
              <input
                type="text"
                className="form-control form-control-lg "
                required
                maxLength={200}
                id="siteName"
                ref={siteName}
                placeholder="Enter Site Name..."
              />
            </div>
          </div>
          <div className="row justify-content-center mb-3">
            <div className="col-md-6">
              <label htmlFor="siteDescription" className="form-label fs-6 fw-bolder d-flex justify-content-start">
                Site Description
              </label>
              <textarea
                className=""
                id="siteDescription"
                ref={siteDescription}
                placeholder="Enter Site Description..."
                maxLength={500}
                required
                rows={6} 
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        <div className="card-footer d-flex justify-content-end pad-10">
          <button
            type="submit"
            onClick={handleNext}
            className="btn btn-new btn-small"
            disabled={loading}
          >
            {!loading && 'Next'}
            {loading && (
              <span className="indicator-progress" style={{ display: 'block' }}>
                Please wait...{' '}
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={handleQuit}
            className="btn btn-secondary btn-small ms-3"
          >
            Quit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiteName;
