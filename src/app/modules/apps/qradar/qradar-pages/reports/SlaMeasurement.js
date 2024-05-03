import React, { useState, useEffect } from "react";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import CanvasJSReact from "./assets/canvasjs.react";
import { fetchSLAMeasurementSummeryUrl } from "../../../../../api/ReportApi";
import { useErrorBoundary } from "react-error-boundary";
import jsPDF from "jspdf";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

function SlaMeasurement() {
  const handleError = useErrorBoundary();
  const orgId = Number(sessionStorage.getItem("orgId"));
  const [alertData, setAlertData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [error, setError] = useState(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')

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
    alertCount365 = filteredData365.map(
      (alert) => alert.sevirityWisePercentageValue
    );

    // Add custom value at index 0
    severityName365.unshift(" "); // Replace "Custom Value" with your desired value
    alertCount365.unshift(0); // Replace 0 with your desired value
  }

  if (filteredData7) {
    severityName7 = filteredData7.map((alert) => alert.sevirityName);
    alertCount7 = filteredData7.map(
      (alert) => alert.sevirityWisePercentageValue
    );
    severityName7.unshift(" ");
    alertCount7.unshift(0);
  }

  if (filteredData30) {
    severityName30 = filteredData30.map((alert) => alert.sevirityName);
    alertCount30 = filteredData30.map(
      (alert) => alert.sevirityWisePercentageValue
    );
    severityName30.unshift(" ");
    alertCount30.unshift(0);
  }

  //SLA measurement Bar chart

  const chartOptions = [
    // For last 7 days
    {
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
        minimum: 0,
        maximum: 100,
        interval: [20, 40, 60, 80, 100],
      },
      width: 500,
      data: [
        {
          toolTipContent: "{y}%",
          legendText: "{label}",
          indexLabelFontColor: "white",
          type: "bar",
          dataPoints: severityName7.map((severityName7, index) => {
            return {
              y: alertCount7[index],
              label: severityName7,
            };
          }),
        },
      ],
    },
    // For last month
    {
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
        minimum: 0,
        maximum: 100,
        interval: [20, 40, 60, 80, 100],
      },
      width: 500,
      data: [
        {
          toolTipContent: "{y}%",
          legendText: "{label}",
          indexLabelFontColor: "white",
          type: "bar",
          dataPoints: severityName30.map((severityName30, index) => {
            return {
              y: alertCount30[index],
              label: severityName30,
            };
          }),
        },
      ],
    },
    // For last year
    {
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
        minimum: 0,
        maximum: 100,
        interval: [20, 40, 60, 80, 100],
      },
      width: 500,
      data: [
        {
          toolTipContent: "{y}%",
          legendText: "{label}",
          indexLabelFontColor: "white",
          type: "bar",
          dataPoints: severityName365.map((severityName365, index) => {
            return {
              y: alertCount365[index],
              label: severityName365,
            };
          }),
        },
      ],
    },
  ];

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
        orgAccountStructureLevel: [
          {
            levelName: "AccountId",
            levelValue: accountId || ""
          },
       {
            levelName: "SiteId",
            levelValue:  siteId || ""
          },
      {
            levelName: "GroupId",
            levelValue: groupId || ""
          }
        ]
      };
      try {
        const response = await fetchSLAMeasurementSummeryUrl(requestData);

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
        handleError(error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const today = new Date();
    let startDate, endDate;
    switch (selectedTab) {
      case 0:
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        endDate = today;
        break;
      case 1:
        startDate = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          today.getDate()
        );
        endDate = today;
        break;
      case 2:
        startDate = new Date(
          today.getFullYear() - 1,
          today.getMonth(),
          today.getDate()
        );
        endDate = today;
        break;
      default:
        break;
    }

    setStartDate(startDate.toLocaleDateString("en-GB"));
    setEndDate(endDate.toLocaleDateString("en-GB"));
  }, [selectedTab]);

  // Function to handle CSV export
  const handleExportCSV = () => {
    const currentChartData = chartOptions[selectedTab];
    const csvData = []; // Array to store CSV data
    csvData.push(["Severity", "Alert Number"]);
    currentChartData.data[0].dataPoints.forEach((dataPoint) => {
      csvData.push([dataPoint.label, dataPoint.y]);
    });
    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvData.map((row) => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sla_measurement_${selectedTab}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  // Function to handle PDF export
  const handleExportPDF = () => {
    const currentChartData = chartOptions[selectedTab];
    const doc = new jsPDF();
    doc.text(
      `SLA Measurement (${
        selectedTab === 0
          ? "Last 7 days"
          : selectedTab === 1
          ? "Last month"
          : "Last year"
      })`,
      10,
      10
    );
    doc.autoTable({
      head: [["Severity", "Alert Number"]],
      body: currentChartData.data[0].dataPoints.map((dataPoint) => [
        dataPoint.label,
        dataPoint.y,
      ]),
    });
    doc.save(`sla_measurement_${selectedTab}.pdf`);
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <h4 className="mb-2 bg-heading">
            {selectedTab === 0
              ? `SLA measurement for the last week (${startDate} to ${endDate})`
              : selectedTab === 1
              ? `SLA measurement for the last month (${startDate} to ${endDate})`
              : `SLA measurement for the last year (${startDate} to ${endDate})`}
          </h4>
          <Tabs
            selectedIndex={selectedTab}
            onSelect={(index) => setSelectedTab(index)}
          >
            <TabList className="inner-tablist ms-5">
              <Tab className="semi-bold">Last 7 days</Tab>
              <Tab className="semi-bold">Last month</Tab>
              <Tab className="semi-bold">Last year</Tab>
            </TabList>

            {chartOptions.map((options, index) => (
              <TabPanel key={index}>
                <CanvasJSChart options={options} />
              </TabPanel>
            ))}
          </Tabs>
          <div className="export-report mt-5 me-5">
            <Dropdown
              isOpen={dropdownOpen}
              toggle={() => setDropdownOpen(!dropdownOpen)}
            >
              <DropdownToggle caret>
                Export <i className="fa fa-file-export link mg-left-10" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={handleExportCSV}>
                  Export to CSV{" "}
                  <i className="fa fa-file-csv link float-right" />
                </DropdownItem>
                <hr className="no-margin" />
                <DropdownItem onClick={handleExportPDF}>
                  Export to PDF <i className="fa fa-file-pdf red float-right" />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </>
      )}
    </div>
  );
}

export default SlaMeasurement;
