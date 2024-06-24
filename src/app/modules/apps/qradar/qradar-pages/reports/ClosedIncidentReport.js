import React, { useState, useEffect } from "react";
import CanvasJSReact from "./assets/canvasjs.react";
import { fetchClosedIncidentsSummeryUrl } from "../../../../../api/ReportApi";
import { useErrorBoundary } from "react-error-boundary";
import jsPDF from "jspdf";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { fetchExportDataAddUrl } from "../../../../../api/Api";

function ClosedIncidentReport() {
  const handleError = useErrorBoundary();
  const orgId = Number(sessionStorage.getItem("orgId"));
  const toolId = Number(sessionStorage.getItem('toolID'))
  const [alertData, setAlertData] = useState([]);
  const [loading, setLoading] = useState(true);
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
    "#008080",
    "#f0e68c",
    "#ffb700",
  ]);

  let statusNames = null;
  let alertCounts = null;

  if (alertData && alertData.length > 0) {
    statusNames = alertData.map((alert) => alert.statusName);
    alertCounts = alertData.map((alert) => alert.alertCount);
  }

  const dataPoints =
    alertData && alertData.length > 0
      ? alertData.map((alert, index) => {
          return {
            y: alert.percentageValue.toFixed(2),
            label: alert.statusName,
            alertCount: alertCounts[index],
          };
        })
      : [];

  const closedoptions = {
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
        toolTipContent: "<b>{label}</b>: {y}% ({alertCount})",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 13,
        indexLabel: "{label} - {y}% ({alertCount})",
        dataPoints: dataPoints,
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
        toolId:toolId,
        incidentFromDate: fromDateISO,
        incidentToDate: toDate,
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
        const response = await fetchClosedIncidentsSummeryUrl(requestData);

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
  //Date range
  const today = new Date();
  const lastYear = new Date();
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  const startDate = lastYear.toLocaleDateString("en-GB");
  const endDate = today.toLocaleDateString("en-GB");

  // Function to export data to Excel
  const exportToExcel = async () => {
    // Convert alertData to CSV format
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        Object.keys(alertData[0]).join(","),
        ...alertData.map((row) => Object.values(row).join(",")),
      ].join("\n");

    // Create a temporary anchor element
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "closed_incident_report.csv");
    document.body.appendChild(link);

    // Trigger the click event to initiate download
    link.click();

    // Clean up
    document.body.removeChild(link);
    const data = {
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem("userId")),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: "Closed incident Report"
    };
    try {
      const response = await fetchExportDataAddUrl(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to export data to PDF
  const exportToPDF = async () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();
    doc.autoTable({
      head: [Object.keys(alertData[0])],
      body: alertData.map((row) => Object.values(row)),
    });

    // Save the PDF
    doc.save("closed_incident_report.pdf");
    const data = {
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem("userId")),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: "Closed incident Report"
    };
    try {
      const response = await fetchExportDataAddUrl(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : alertData !== null ? (
        <>
          <h4 className="bg-heading">
            Closed Incident for the last year ({startDate} to {endDate})
          </h4>
          <div className="export-report mt-5 me-5">
            <Dropdown
              isOpen={dropdownOpen}
              toggle={() => setDropdownOpen(!dropdownOpen)}
            >
              <DropdownToggle caret>
                Export <i className="fa fa-file-export link mg-left-10" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={exportToExcel}>
                  Export to CSV{" "}
                  <i className="fa fa-file-excel link float-right" />
                </DropdownItem>
                <DropdownItem onClick={exportToPDF}>
                  Export to PDF <i className="fa fa-file-pdf red float-right" />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <CanvasJSChart options={closedoptions} />
        </>
      ) : (
        <p>No data found</p>
      )}
    </div>
  );
}

export default ClosedIncidentReport;
