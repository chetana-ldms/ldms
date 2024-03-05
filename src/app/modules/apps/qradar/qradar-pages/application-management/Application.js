import React, { useState } from "react";
import RisksComponent from "./RisksComponent";
import InventoryComponent from "./InventoryComponent";
import CanvasJSReact from "../reports/assets/canvasjs.react";

function Application() {
  const [activeTab, setActiveTab] = useState("risks");

  //severities chart
  const CanvasJS = CanvasJSReact.CanvasJS;
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const severities = {
    animationEnabled: true,

    subtitles: [
      {
        verticalAlign: "center",
        fontSize: 24,
        dockInsidePlotArea: true,
      },
    ],
    height: 150,
    data: [
      {
        type: "doughnut",
        showInLegend: true,
        indexLabel: "{name}: {y}",
        yValueFormatString: "#,###'%'",
        dataPoints: [{ name: "Medium", y: 100 }],
      },
    ],
  };

  //Impactfull application bar chart
  //Pie chart color code
  CanvasJS.addColorSet("colorShades", [
    //colorSet Array
    "#f0e68c",
    "#ffb700",
    "#008080",
  ]);

  const options = {
    animationEnabled: true,
    // title: {
    //   text: 'Monthly Sales - 2017',
    // },
    axisX: {
      valueFormatString: "HH",
      title: "",
    },
    axisY: {
      title: "",
      prefix: "",
      scaleBreaks: {
        customBreaks: [
          {
            spacing: "10",
          },
        ],
      },
    },
    height: 140,
    borderColor: "#ccc",
    data: [
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: "column",
        dataPoints: [
          { label: "Adobe Acrobat", y: 10 },
          { label: "MySQL Server", y: 15 },
          { label: "Splunk", y: 25 },
        ],
      },
    ],
  };

  return (
    <div className="ldc-application">
      <div className="row">
        <div className="col-md-12">
          <h1>Application Management</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="d-flex border-btm mg-btm-10 mg-top-10">
            <ul className="nav nav-tabs p-0 border-0 fs-12">
              <li className="nav-item">
                <a
                  className={`nav-link normal pointer ${
                    activeTab === "risks" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("risks")}
                >
                  RISKS
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link normal pointer ${
                    activeTab === "inventory" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("inventory")}
                >
                  INVENTORY
                </a>
              </li>
            </ul>
          </div>
          <div className="application-section mg-top-20 mg-btm-20">
            <div className="header-filter mg-btm-20">
              <form>
                <select className="form-select">
                  <option>Select filter</option>
                </select>
              </form>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-body">
                    <h4 className="uppercase normal">severities</h4>
                    <CanvasJSChart
                      style={{ height: "150px" }}
                      options={severities}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-body">
                    <h4 className="uppercase normal">exploitation</h4>
                    <div className="mg-top-30 text-center">
                      <i className="fa fa-info-circle green fs-30 mg-btm-10" />
                      <br />
                      <p className="fs-15 gray">No notifications found</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-body">
                    <h4 className="uppercase normal">
                      most impactful applications
                    </h4>
                    <CanvasJSChart options={options} style="height:140px" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {activeTab === "risks" && <RisksComponent />}
          {activeTab === "inventory" && <InventoryComponent />}
        </div>
      </div>
    </div>
  );
}

export default Application;
