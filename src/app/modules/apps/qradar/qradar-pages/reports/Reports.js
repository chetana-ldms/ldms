import React from "react";
import CanvasJSReact from "./assets/canvasjs.react";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import AlertsSummary from "./AlertsSummary";
import SlaMeasurement from "./SlaMeasurement";
import ClosedIncidentReport from "./ClosedIncidentReport";
import OpenIncidentSummary from "./OpenIncidentSummary";
import SignificantIncident from "./SignificantIncident";
import CreatedIncidentStatusReport from "./CreatedIncidentStatusReport";

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

  //Bar chart
  const baroptions = {
    dataPointWidth: 40,
    axisY: {
      minimum: 0,
      maximum: 15,
      interval: 5,
    },
    axisX: {
      labelMaxWidth: 70,
      labelWrap: true, // change it to false
      interval: 1,
      labelFontSize: 11,
      labelFontWeight: "normal",
      labelTextAlign: "center",
      labelAngle: 180,
    },
    data: [
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: "column",
        dataPoints: [
          { label: "Customer Name - Smith Co Alert Name - Windows...", y: 17 },
          { label: "Customer Name - Smith Co Alert Name - Windows...", y: 14 },
          { label: "Customer Name - Smith Co Alert Name - Windows...", y: 13 },
          { label: "Customer Name - Smith Co Alert Name - Windows...", y: 10 },
          { label: "Customer Name - Smith Co Alert Name - Windows...", y: 8 },
          { label: "Customer Name - Smith Co Alert Name - Windows...", y: 8 },
          { label: "Customer Name - Smith Co Alert Name - Windows...", y: 7 },
          { label: "Customer Name - Smith Co Alert Name - Windows...", y: 4 },
          { label: "Customer Name - Smith Co Alert Name - Windows...", y: 4 },
          { label: "SMB Port Scanning Device Vendor - Checkpoint...", y: 5 },
          {
            label:
              'Today, Apr 26,2018 it was found that "Shadow Brokers" le...',
            y: 5,
          },
        ],
      },
    ],
  };

  return (
    <div className="row reports-page">
      {/* Begin Col */}
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
                    <h2 className="mb-10">
                      Top 10 alerts by rule name for the last year (2/20/2020
                      and 7/28/2021)
                    </h2>
                    <Tabs>
                      <TabList className="inner-tablist">
                        {/* <Tab>Last day</Tab>
                          <Tab>Last 7 days</Tab>
                          <Tab>Last month</Tab> */}
                        <Tab>Last year</Tab>
                      </TabList>

                      {/* <TabPanel className='inner-tab'>1</TabPanel>
                        <TabPanel>2</TabPanel>
                        <TabPanel>3</TabPanel> */}
                      <TabPanel className="inner-tab">
                        <CanvasJSChart options={baroptions} />
                      </TabPanel>
                    </Tabs>
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

      {/* End Col */}
    </div>
  );
};

export { Reports };
