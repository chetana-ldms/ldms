import React, { useState, useEffect } from "react";
import CanvasJSReact from "./assets/canvasjs.react";
import { fetchAllIncidentsSummeryUrl } from "../../../../../api/ReportApi";
import { useErrorBoundary } from "react-error-boundary";
import jsPDF from "jspdf";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

function CreatedIncidentStatusReport() {
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
    //colorSet Array
    "#008080",
    "#f0e68c",
    "#ffb700",
    "#b3c100",
    "#ea6a47",
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
        incidentFromDate: fromDateISO,
        incidentToDate: toDate,
      };
      try {
        const response = await fetchAllIncidentsSummeryUrl(requestData);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Network response was not ok: ${response.status} - ${errorData.message}`
          );
        }

        const { data } = await response.json();
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
  const today = new Date();
  const lastYear = new Date();
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  const startDate = lastYear.toLocaleDateString("en-GB");
  const endDate = today.toLocaleDateString("en-GB");

  // Function to export data to Excel
  const exportToExcel = () => {
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
    link.setAttribute("download", "incident_status_report.csv");
    document.body.appendChild(link);

    // Trigger the click event to initiate download
    link.click();

    // Clean up
    document.body.removeChild(link);
  };

  // Function to export data to PDF
  const exportToPDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();
    doc.autoTable({
      head: [Object.keys(alertData[0])],
      body: alertData.map((row) => Object.values(row)),
    });

    // Save the PDF
    doc.save("incident_status_report.pdf");
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
            Status of all created incidents for the last year ({startDate} to{" "}
            {endDate})
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
          <CanvasJSChart options={openstatusoptions} />
        </>
      ) : (
        <p>No data found</p>
      )}
    </div>
  );
}

export default CreatedIncidentStatusReport;
