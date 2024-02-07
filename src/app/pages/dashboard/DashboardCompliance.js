import React, { useState } from "react";
import { KTSVG, toAbsoluteUrl } from "../../../_metronic/helpers";

const DashboardWrapper = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="dashboard-wrapper compliance incident-box">
      <div>
        {/* begin::Row */}
        <div className="row py-lg-3">
          <div className="col-lg-9">
            <div className="card">
              <h4>Readiness Overview</h4>
              <div className="row">
                <div className="col-xl-4">
                  <div className="card readiness">
                    <div className="readiness-top">
                      <img
                        alt="Logo"
                        src={toAbsoluteUrl("/media/icons/misc.png")}
                        className="h-40px w-40px"
                      />
                      <p className="blue-txt">FedRAMP</p>
                      <p>Progress bar</p>
                      <p>26% ready</p>
                    </div>
                    <div className="rediness-btm">
                      <p>Remaining controls</p>
                      <p>
                        <span className="highlight-txt">218</span> out of 319
                        total
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-xl-4">
                  <div className="card readiness">
                    <div className="readiness-top">
                      <img
                        alt="Logo"
                        src={toAbsoluteUrl("/media/icons/misc.png")}
                        className="h-40px w-40px"
                      />
                      <p className="blue-txt">NIST SP 800-53</p>
                      <p>Progress bar</p>
                      <p>24% ready</p>
                    </div>
                    <div className="rediness-btm">
                      <p>Remaining controls</p>
                      <p>
                        <span className="highlight-txt">131</span> out of 190
                        total
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-xl-4">
                  <div className="card readiness">
                    <div className="readiness-top">
                      <img
                        alt="Logo"
                        src={toAbsoluteUrl("/media/icons/misc.png")}
                        className="h-40px w-40px"
                      />
                      <p className="blue-txt">NIST CSF</p>
                      <p>Progress bar</p>
                      <p>22% ready</p>
                    </div>
                    <div className="rediness-btm">
                      <p>Remaining controls</p>
                      <p>
                        <span className="highlight-txt">117</span> out of 170
                        total
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card">
              <div className="bg-default alert-chart">
                <h4>Notifications</h4>
                <div className="notification">
                  <div className="not-section">
                    <div className="float-left">
                      <p className="blue-txt">SOC 2 Type 2</p>
                      <p>Active Audit</p>
                    </div>
                    <div className="float-right">
                      <span className="not-red">6</span>
                    </div>
                  </div>
                  <div className="not-section">
                    <div className="float-left">
                      <p className="blue-txt">PCI DSS</p>
                      <p>Active Audit</p>
                    </div>
                    <div className="float-right">
                      <span className="not-red">5</span>
                    </div>
                  </div>
                  <div className="not-section">
                    <div className="float-left">
                      <p className="blue-txt">SOC 2 Type 2</p>
                      <p>Active Audit</p>
                    </div>
                    <div className="float-right">
                      <span className="not-red">3</span>
                    </div>
                  </div>
                  <div className="not-section">
                    <div className="float-left">
                      <p className="blue-txt">SOC 2 Type 2</p>
                      <p>Active Audit</p>
                    </div>
                    <div className="float-right">
                      <span className="not-red">6</span>
                    </div>
                  </div>
                  <div className="not-section">
                    <div className="float-left">
                      <p className="blue-txt">PCI DSS</p>
                      <p>Active Audit</p>
                    </div>
                    <div className="float-right">
                      <span className="not-red">5</span>
                    </div>
                  </div>
                  <div className="not-section">
                    <div className="float-left">
                      <p className="blue-txt">SOC 2 Type 2</p>
                      <p>Active Audit</p>
                    </div>
                    <div className="float-right">
                      <span className="not-red">3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end::Row */}
        {/* Row starts */}
        <div className="row">
          <div className="col-lg-4">
            <div className="card">
              <h4>Test trend</h4>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="row">
              <div className="col-lg-6">
                <div className="card">
                  <h4>Policy status</h4> 1
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card">
                  <h4>Vendor risks</h4>2
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="card">
                  <h4>Connections</h4>3
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card">
                  <h4>Personnel</h4>4
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card">
              <h4>Task forecast</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWrapper;
