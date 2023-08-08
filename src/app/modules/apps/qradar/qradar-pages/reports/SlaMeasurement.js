import React, { useState, useEffect } from "react";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import CanvasJSReact from "./assets/canvasjs.react";
import { fetchSLAMeasurementSummeryUrl } from "../../../../../api/ReportApi";

function SlaMeasurement() {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [alertData, setAlertData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
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
    (alert) => alert.summeryPeriod === "365"
  );
  const filteredData7 = alertData?.filter(
    (alert) => alert.summeryPeriod === "7"
  );
  const filteredData30 = alertData?.filter(
    (alert) => alert.summeryPeriod === "30"
  );

  let severityName365 = [],
    alertCount365 = [],
    severityName7 = [],
    alertCount7 = [],
    severityName30 = [],
    alertCount30 = [];

  if (filteredData365) {
    // Extract the data from the backend response
    severityName365 = filteredData365.map((alert) => alert.sevirityName);
    alertCount365 = filteredData365.map((alert) => alert.sevirityWisePercentageValue);

    // Add custom value at index 0
    severityName365.unshift(" "); // Replace "Custom Value" with your desired value
    alertCount365.unshift(0); // Replace 0 with your desired value
  }


  if (filteredData7) {
    severityName7 = filteredData7.map((alert) => alert.sevirityName);
    alertCount7 = filteredData7.map((alert) => alert.sevirityWisePercentageValue);
    severityName7.unshift(" ");
    alertCount7.unshift(0);
  }

  if (filteredData30) {
    severityName30 = filteredData30.map((alert) => alert.sevirityName);
    alertCount30 = filteredData30.map((alert) => alert.sevirityWisePercentageValue);
    severityName30.unshift(" ");
    alertCount30.unshift(0);
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
      minimum: 0,
      maximum: 4,
      labelFormatter: function (e) {
        const severityLabels = ["", "High", "Medium", "Low", ""];
        return severityLabels[e.value];
      },

    },

    axisY: {
      title: "Alert number",
      titleFontSize: 14,
      includeZero: true,
      // labelFormatter: this.addSymbols,
      minimum: 0,
      maximum: 100,
      interval: [20, 40, 60, 80, 100],
    },
    width: 500,
    data: [
      {
        toolTipContent: "{y}%",
        legendText: "{label}",
        // indexLabel: "{y}%",
        indexLabelFontColor: "white",
        // indexLabelBackgroundColor: "red",
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
      minimum: 0,
      maximum: 4,
      labelFormatter: function (e) {
        const severityLabels = ["", "High", "Medium", "Low", ""];
        return severityLabels[e.value];
      },

    },
    axisY: {
      title: "Alert number",
      titleFontSize: 14,
      includeZero: true,
      // labelFormatter: this.addSymbols,
      minimum: 0,
      maximum: 100,
      interval: [20, 40, 60, 80, 100],
    },
    width: 500,
    data: [
      {
        toolTipContent: "{y}%",
        legendText: "{label}",
        // indexLabel: "{y}%",
        indexLabelFontColor: "white",
        // indexLabelBackgroundColor: "red",
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
      minimum: 0,
      maximum: 4,
      labelFormatter: function (e) {
        const severityLabels = ["", "High", "Medium", "Low", ""];
        return severityLabels[e.value];
      },

    },
    axisY: {
      title: "Alert number",
      titleFontSize: 14,
      includeZero: true,
      // labelFormatter: this.addSymbols,
      minimum: 0,
      maximum: 100,
      interval: [20, 40, 60, 80, 100],
    },
    width: 500,
    data: [
      {
        toolTipContent: "{y}%",
        legendText: "{label}",
        // indexLabel: "{y}%",
        indexLabelFontColor: "white",
        // indexLabelBackgroundColor: "red",
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

  useEffect(() => {
    // ... Existing code ...

    // Declare today and endDate variables here
    const today = new Date();
    let startDate, endDate;
    switch (selectedTab) {
      case 0: // Last 7 days
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        endDate = today;
        break;
      case 1: // Last 1 month
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        endDate = today;
        break;
      case 2: // Last 1 year
        startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        endDate = today;
        break;
      default:
        break;
    }

    setStartDate(startDate.toLocaleDateString("en-GB"));
    setEndDate(endDate.toLocaleDateString("en-GB"));
  }, [selectedTab]);
  

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <h2 className="mb-10">
            {selectedTab === 0
              ? `SLA measurement for the last week (${startDate} to ${endDate})`
              : selectedTab === 1
                ? `SLA measurement for the last month (${startDate} to ${endDate})`
                : `SLA measurement for the last year (${startDate} to ${endDate})`}
          </h2>
          <Tabs selectedIndex={selectedTab} onSelect={(index) => setSelectedTab(index)}>
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
