import React, { useState, useEffect } from "react";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import CanvasJSReact from "./assets/canvasjs.react";
import { fetchSLAMeasurementSummeryUrl } from "../../../../../api/ReportApi";

function SlaMeasurement() {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [alertData, setAlertData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CanvasJS = CanvasJSReact.CanvasJS;
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  //Pie chart color code
  CanvasJS.addColorSet("colorShades", [
    //colorSet Array
    "#f0e68c",
    "#ffb700",
    "#008080",
  ]);

  //SLA Bar chart color code
  CanvasJS.addColorSet("slacolorShades", [
    //colorSet Array
    "#f9a602",
  ]);

  const filteredData365 = alertData?.filter(
    (alert) => alert.summeryPeriod === "365-Days"
  );
  const filteredData7 = alertData?.filter(
    (alert) => alert.summeryPeriod === "7-Days"
  );
  const filteredData30 = alertData?.filter(
    (alert) => alert.summeryPeriod === "30-Days"
  );

  let severityName365 = [],
    alertCount365 = [],
    severityName7 = [],
    alertCount7 = [],
    severityName30 = [],
    alertCount30 = [];

  if (filteredData365) {
    severityName365 = filteredData365.map((alert) => alert.severityName);
    alertCount365 = filteredData365.map(
      (alert) => alert.sevirityWisePercentageValue
    );
  }

  if (filteredData7) {
    severityName7 = filteredData7.map((alert) => alert.severityName);
    alertCount7 = filteredData7.map((alert) => alert.sevirityWisePercentageValue);
  }

  if (filteredData30) {
    severityName30 = filteredData30.map((alert) => alert.severityName);
    alertCount30 = filteredData30.map((alert) => alert.sevirityWisePercentageValue);
  }

  //SLA measurement Bar chart

  //7days
  const slaoptions = {
    animationEnabled: true,
    theme: "light2",
    colorSet: "slacolorShades",
    labelTextAlign: "center",

    axisX: {
      title: "Severity",
      titleFontSize: 14,
      reversed: true,
      minimum: -1,
      maximum: 3,
    },
    axisY: {
      title: "Alert number",
      titleFontSize: 14,
      includeZero: true,
      // labelFormatter: this.addSymbols,
      minimum: 0,
      maximum: 100,
      interval: 50,
    },
    width: 500,
    data: [
      {
        toolTipContent: "{y}",
        legendText: "{label}",
        indexLabel: "{y}",
        indexLabelFontColor: "white",
        indexLabelBackgroundColor: "red",
        type: "bar",
        dataPoints: severityName7.map((severityName7, index) => {
          return {
            y: alertCount7[index],
            label: severityName7,
          };
        }),
      },
    ],
  };

  //30 Days
  const slaoptions30 = {
    animationEnabled: true,
    theme: "light2",
    colorSet: "slacolorShades",
    labelTextAlign: "center",

    axisX: {
      title: "Severity",
      titleFontSize: 14,
      reversed: true,
      minimum: -1,
      maximum: 3,
    },
    axisY: {
      title: "Alert number",
      titleFontSize: 14,
      includeZero: true,
      // labelFormatter: this.addSymbols,
      minimum: 0,
      maximum: 100,
      interval: 50,
    },
    width: 500,
    data: [
      {
        toolTipContent: "{y}",
        legendText: "{label}",
        indexLabel: "{y}",
        indexLabelFontColor: "white",
        indexLabelBackgroundColor: "red",
        type: "bar",
        dataPoints: severityName30.map((severityName30, index) => {
          return {
            y: alertCount30[index],
            label: severityName30,
          };
        }),
      },
    ],
  };

  //365 Days
  const slaoptions365 = {
    animationEnabled: true,
    theme: "light2",
    colorSet: "slacolorShades",
    labelTextAlign: "center",

    axisX: {
      title: "Severity",
      titleFontSize: 14,
      reversed: true,
      minimum: -1,
      maximum: 3,
    },
    axisY: {
      title: "Alert number",
      titleFontSize: 14,
      includeZero: true,
      // labelFormatter: this.addSymbols,
      minimum: 0,
      maximum: 100,
      interval: 50,
    },
    width: 500,
    data: [
      {
        toolTipContent: "{y}",
        legendText: "{label}",
        indexLabel: "{y}",
        indexLabelFontColor: "white",
        indexLabelBackgroundColor: "red",
        type: "bar",
        dataPoints: severityName365.map((severityName365, index) => {
          return {
            y: alertCount365[index],
            label: severityName365,
          };
        }),
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      const toDate = new Date().toISOString(); // Get the current date and time
      const fromDate = new Date();
      fromDate.setFullYear(fromDate.getFullYear() - 1); // Subtract 1 year from the current year
      const fromDateISO = fromDate.toISOString(); // Convert the fromDate to ISO string format
  
      const requestData = {
        orgId,
        alertFromDate: fromDateISO,
        alertToDate: toDate,
      };
      try {
        const response = await fetchSLAMeasurementSummeryUrl(requestData)

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Network response was not ok: ${response.status} - ${errorData.message}`
          );
        }

        const { data } = await response.json(); // destructure the 'data' property from the response object
        setAlertData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //Date range
  const today = new Date();
  const lastYear = new Date();
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  const startDate = lastYear.toLocaleDateString("en-GB");
  const endDate = today.toLocaleDateString("en-GB");

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <h2 className="mb-10">
            SLA measurement for the last year ({startDate} to {endDate})
          </h2>
          <Tabs>
            <TabList className="inner-tablist">
              <Tab>Last 7 days</Tab>
              <Tab>Last month</Tab>
              <Tab>Last year</Tab>
            </TabList>

            <TabPanel>
              <CanvasJSChart options={slaoptions} />
            </TabPanel>
            <TabPanel>
              <CanvasJSChart options={slaoptions30} />
            </TabPanel>
            <TabPanel className="inner-tab">
              <CanvasJSChart options={slaoptions365} />
            </TabPanel>
          </Tabs>
        </>
      )}
    </div>
  );
}

export default SlaMeasurement;
