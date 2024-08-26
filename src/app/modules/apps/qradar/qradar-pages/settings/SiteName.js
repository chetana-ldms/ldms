import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { notifyFail } from '../components/notification/Notification';

const SiteName = ({ setActiveStep, siteNameData, setSiteNameData }) => {
  const navigate = useNavigate();

  const handleNext = (event) => {
    event.preventDefault();
    if (!siteNameData.siteName) {
      notifyFail('Please enter the site name.');
      return;
    }
    setActiveStep('site-type');
  };

  const handleQuit = () => {
    navigate('/qradar/sites/list');
  };

  return (
    <div className="config card">
      <ToastContainer />
      <form>
        <div className="form-group">
          {/* Site Name Input */}
          <div className="row justify-content-center mb-3">
            <div className="col-md-6">
              <label htmlFor="siteName" className="form-label fs-6 fw-bolder d-flex justify-content-start">
                Site Name *
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                required
                maxLength={200}
                id="siteName"
                placeholder="Enter Site Name..."
                value={siteNameData.siteName}
                onChange={(e) => setSiteNameData({ ...siteNameData, siteName: e.target.value })}
              />
            </div>
          </div>

          {/* Site Description Input */}
          <div className="row justify-content-center mb-3">
            <div className="col-md-6">
              <label htmlFor="siteDescription" className="form-label fs-6 fw-bolder d-flex justify-content-start">
                Site Description
              </label>
              <textarea
                id="siteDescription"
                placeholder="Enter Site Description..."
                maxLength={500}
                required
                rows={6}
                style={{ width: '100%' }}
                value={siteNameData.siteDescription}
                onChange={(e) => setSiteNameData({ ...siteNameData, siteDescription: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="card-footer d-flex justify-content-end pad-10">
          <button
            type="submit"
            onClick={handleNext}
            className="btn btn-new btn-small"
          >
            Next
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
