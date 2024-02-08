import React, { useState } from "react";
import { KTSVG, toAbsoluteUrl } from "../../../_metronic/helpers";
import CanvasJSReact from "./assets/canvasjs.react";

const DashboardCompliance = () => {
  const [loading, setLoading] = useState(true);

  const CanvasJS = CanvasJSReact.CanvasJS;
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const options = {
    animationEnabled: true,
    // title: {
    //   text: "Customer Satisfaction",
    // },
    subtitles: [
      {
        // text: "71% Positive",
        verticalAlign: "center",
        fontSize: 24,
        dockInsidePlotArea: true,
      },
    ],
    height: 200,
    data: [
      {
        type: "doughnut",
        showInLegend: true,
        indexLabel: "{name}: {y}",
        yValueFormatString: "#,###'%'",
        dataPoints: [
          { name: "Active", y: 5 },
          { name: "Renews soon", y: 31 },
          { name: "Needs approval", y: 40 },
        ],
      },
    ],
  };

  const options1 = {
    title: {
      // text: "Basic Column Chart",
    },
    data: [
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: "column",
        height: 200,
        width: 200,
        dataPoints: [
          { label: "Feb", y: 10 },
          { label: "March", y: 15 },
          { label: "April", y: 25 },
          { label: "May", y: 30 },
          { label: "June", y: 28 },
        ],
      },
    ],
  };

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
              <div className="table">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Total failing tests</th>
                      <th className="red bold fs-15">48</th>
                      <th className="red fs-12">9%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="inner-table">
                      <td>Category</td>
                      <td>Failing tests</td>
                      <td>info</td>
                    </tr>
                    <tr>
                      <td>
                        <i className="fa fa-file" /> Policy
                      </td>
                      <td className="red bold fs-15">16</td>
                      <td className="red fs-12">
                        33%{" "}
                        <span>
                          <i className="fa fa-chevron-right" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <i className="fa fa-cube" /> In Drata
                      </td>
                      <td className="red bold fs-15">13</td>
                      <td className="red fs-12">
                        0%{" "}
                        <span>
                          <i className="fa fa-chevron-right" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <i className="fa fa-file" /> Policy
                      </td>
                      <td className="red bold fs-15">16</td>
                      <td className="red fs-12">
                        33%{" "}
                        <span>
                          <i className="fa fa-chevron-right" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <i className="fa fa-cube" /> In Drata
                      </td>
                      <td className="red bold fs-15">13</td>
                      <td className="red fs-12">
                        0%{" "}
                        <span>
                          <i className="fa fa-chevron-right" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <i className="fa fa-file" /> Policy
                      </td>
                      <td className="red bold fs-15">16</td>
                      <td className="red fs-12">
                        33%{" "}
                        <span>
                          <i className="fa fa-chevron-right" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <i className="fa fa-cube" /> In Drata
                      </td>
                      <td className="red bold fs-15">13</td>
                      <td className="red fs-12">
                        0%{" "}
                        <span>
                          <i className="fa fa-chevron-right" />
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="row">
              <div className="col-lg-6">
                <div className="card">
                  <h4>Policy status</h4> <CanvasJSChart options={options} />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card">
                  <h4>Vendor risks</h4>
                  <CanvasJSChart
                    options={options}
                    /* onRef={ref => this.chart = ref} */
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="card">
                  <h4>Connections</h4>
                  <p>Errors</p>
                  <p>
                    <span className="red bold fs-20">3</span>
                  </p>
                  <hr />
                  <p>Out of 9 total</p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card">
                  <h4>Personnel</h4>
                  <p>Non compliant</p>
                  <p>
                    <span className="red bold fs-20">321</span>
                  </p>
                  <hr />
                  <p>Out of 321 total</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card">
              <h4>Task forecast</h4>
              <CanvasJSChart options={options1} style="height:140px" />
              <hr />
              <div className="task-list">
                <h4>Task list</h4>
                <ul>
                  <li>Content</li>
                  <li>Content</li>
                  <li>Content</li>
                  <li>Content</li>
                  <li>Content</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCompliance;
