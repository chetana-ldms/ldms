import React, { useState, useEffect } from "react";
import CanvasJSReact from "./assets/canvasjs.react";
import { fetchAlertsSummeryUrl } from "../../../../../api/ReportApi";
import { useErrorBoundary } from "react-error-boundary";
import jsPDF from "jspdf";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

function AlertsSummary() {
  const handleError = useErrorBoundary();
  const orgId = Number(sessionStorage.getItem("orgId"));
  const [alertData, setAlertData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown toggle

  const CanvasJS = CanvasJSReact.CanvasJS;
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  //Pie chart color code
  CanvasJS.addColorSet("colorShades", [
    "#f0e68c",
    "#ffb700",
    "#008080",
    "#ffb1b0",
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
      const toDate = new Date().toISOString();
      const fromDate = new Date();
      fromDate.setFullYear(fromDate.getFullYear() - 1);
      const fromDateISO = fromDate.toISOString();

      const requestData = {
        orgId,
        alertFromDate: fromDateISO,
        alertToDate: toDate,
      };
      try {
        const response = await fetchAlertsSummeryUrl(requestData);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Network response was not ok: ${response.status} - ${errorData.message}`
          );
        }

        const contentType = response.headers.get("Content-Type");
        if (contentType.includes("application/json")) {
          const responseData = await response.json();
          setAlertData(responseData.data);
          setLoading(false);
        } else {
          throw new Error("Response is not in JSON format");
        }
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

  // Function to handle export to Excel
  const exportToExcel = () => {
    // Define header text
    const headerText = `Alerts Summary for the last year (${startDate} to ${endDate})`;

    // Define header row
    const headerRow = ["Status Name", "Percentage Value", "Alert Count"];

    // Format data into CSV content
    const content = [headerText]
      .concat([""]) // Add an empty line for separation
      .concat([headerRow])
      .concat(
        alertData
          .map((alert) => [
            alert.statusName,
            `${alert.percentageValue.toFixed(2)}%`,
            alert.alertCount,
          ])
          .map((row) => row.join(","))
      )
      .join("\n");

    // Create CSV file
    const csvContent =
      "data:text/csv;charset=utf-8," + encodeURIComponent(content);

    // Create link and trigger download
    const link = document.createElement("a");
    link.href = csvContent;
    link.setAttribute("download", "alerts_summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to handle export to PDF
  const exportToPDF = () => {
    const content = document.getElementById("alertsSummary");
    if (!content) {
      console.error("Element with ID 'alertsSummary' not found.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Alerts Summary Report", 10, 10);
    doc.text(`Date Range: ${startDate} to ${endDate}`, 10, 20);

    // Format data into a table
    const tableData = alertData.map(
      ({ statusName, percentageValue, alertCount }) => [
        statusName,
        `${percentageValue.toFixed(2)}%`,
        alertCount,
      ]
    );

    // Add table to PDF
    doc.autoTable({
      startY: 30, // Start position (y-coordinate)
      head: [["Status Name", "Percentage Value", "Alert Count"]], // Table header
      body: tableData, // Table body
    });

    doc.save("alerts_summary.pdf");
  };

  // Function to handle export based on selected format
  const handleExport = (format) => {
    if (format === "excel") {
      exportToExcel();
    } else if (format === "pdf") {
      exportToPDF();
    } else {
      console.error("Invalid export format");
    }
  };

  return (
    <div id="alertsSummary">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : alertData !== null ? (
        <>
          <h4>
            Alerts Summary for the last year ({startDate} to {endDate})
          </h4>
          <CanvasJSChart options={openstatusoptions} />
        </>
      ) : (
        <p>No data found</p>
      )}
      <div className="export-report mt-5 me-5">
        <Dropdown
          isOpen={dropdownOpen}
          toggle={() => setDropdownOpen(!dropdownOpen)}
        >
          <DropdownToggle caret>
            Export Report <i className="fa fa-file-export link mg-left-10" />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => handleExport("excel")}>
              Export to Excel{" "}
              <i className="fa fa-file-excel link float-right" />
            </DropdownItem>
            <hr className="no-margin" />
            <DropdownItem onClick={() => handleExport("pdf")}>
              Export to PDF <i className="fa fa-file-pdf red float-right" />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}

export default AlertsSummary;
