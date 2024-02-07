import React, { useState } from "react";

const DashboardWrapper = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="dashboard-wrapper">
      <div>
        {/* begin::Row */}
        <div className="row py-lg-3 incident-box">
          <h4>Readiness Overview</h4>
          <div className="col-lg-9">
            <div className="row">
              <div className="col-xl-4">
                <div className="card bg-default py-5 text-center bg-secondary">
                  <h6 className="text-gray-800 text-hover-primary mb-1 fs-12 uppercase">
                    Unhandeled Incidents
                  </h6>
                  <span className="fc-gray fw-bold fs-40 mt-5 mb-5">10</span>
                  <span className="span-red">
                    {/* <i className="fa fa-arrow-down"></i> 67% */}
                  </span>
                </div>
              </div>

              <div className="col-xl-4">
                <div className="card bg-default py-5 text-center bg-light-warning">
                  <h6 className="text-gray-800 text-hover-primary mb-1 fs-12 uppercase">
                    Unhandeled Alerts
                  </h6>
                  <span className="fc-gray fw-bold fs-40 mt-5 mb-5">10</span>
                  <span className="span-red">
                    {/* <i className="fa fa-arrow-down"></i> 100% */}
                  </span>
                </div>
              </div>

              <div className="col-xl-4">
                <div className="card bg-default py-5 text-center bg-light-success">
                  <h6 className="text-gray-800 text-hover-primary mb-1 fs-12 uppercase">
                    False Positive Alerts
                  </h6>
                  <span className="fc-gray fw-bold fs-40 mt-5 mb-5">10</span>
                  <span className="span-red">
                    <i className="v-hidden fa fa-arrow-down"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card bg-default alert-chart">test</div>
          </div>
        </div>
        {/* end::Row */}
      </div>
    </div>
  );
};

export default DashboardWrapper;
