import React from "react";
import CanvasJSReact from "./assets/canvasjs.react";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import AlertsSummary from "./AlertsSummary";
import SlaMeasurement from "./SlaMeasurement";
import ClosedIncidentReport from "./ClosedIncidentReport";
import OpenIncidentSummary from "./OpenIncidentSummary";
import SignificantIncident from "./SignificantIncident";
import CreatedIncidentStatusReport from "./CreatedIncidentStatusReport";
import AlertsRule from "./AlertsRule";

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

//Pie chart color code
CanvasJS.addColorSet("colorShades", [
  //colorSet Array
  "#f0e68c",
  "#ffb700",
  "#008080",
]);

const Reports = () => {
  //Pie chart for status of created incidents
  const options = {
    exportEnabled: true,
    animationEnabled: true,
    zoomEnabled: true,
    colorSet: "colorShades",
    title: {
      text: "",
    },
    data: [
      {
        type: "pie",
        startAngle: 220,
        toolTipContent: "<b>{label}</b>: {y}%",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 13,
        indexLabel: "{label} - {y}%",
        dataPoints: [
          { y: 10.91, label: "New" },
          { y: 1.87, label: "Open" },
          { y: 87.27, label: "Closed" },
        ],
      },
    ],
  };

  //Pie chart for Open incident status
  const openstatusoptions = {
    exportEnabled: true,
    animationEnabled: true,
    zoomEnabled: true,
    colorSet: "colorShades",
    title: {
      text: "",
    },
    data: [
      {
        type: "pie",
        startAngle: 220,
        toolTipContent: "<b>{label}</b>: {y}%",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 13,
        indexLabel: "{label} - {y}%",
        dataPoints: [
          { y: 10.91, label: "New" },
          { y: 1.87, label: "Open" },
          { y: 87.27, label: "Closed" },
        ],
      },
    ],
  };

   const today = new Date();
   const lastYear = new Date();
   lastYear.setFullYear(lastYear.getFullYear() - 1);
   const startDate = lastYear.toLocaleDateString("en-GB");
   const endDate = today.toLocaleDateString("en-GB");

  return (
    <div className="row reports-page">
      <div className="col-lg-12">
        <div className="mb-5 mb-xl-12">
          <h2>Reports</h2>
          <div className="demo-block">
            <Tabs className="report-tabs">
              <div className="card">
                <div className="card-body">
                  <TabPanel className="main-tab">
                    <AlertsSummary />
                  </TabPanel>
                   <TabPanel className="main-tab">
                    <AlertsRule />
                  </TabPanel>
                  <TabPanel className="main-tab">
                    <SlaMeasurement />
                  </TabPanel>
                  <TabPanel className="main-tab">
                    <div>
                      <CreatedIncidentStatusReport />
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <ClosedIncidentReport />
                  </TabPanel>
                  <TabPanel>
                    <OpenIncidentSummary />
                  </TabPanel>
                  <TabPanel>
                    <SignificantIncident />
                  </TabPanel>
                </div>
              </div>
              <TabList className="tab-list">
                <Tab>Alert summary</Tab>
                <Tab>Alerts rule</Tab>
                <Tab>SLA measurement</Tab>
                <Tab>Status of all created incidents</Tab>
                <Tab>Closed incidents</Tab>
                <Tab>Open incident status</Tab>
                <Tab>Significant incidents</Tab>
              </TabList>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Reports };
