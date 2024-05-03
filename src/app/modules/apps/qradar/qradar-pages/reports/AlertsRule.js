import React, { useState, useEffect } from "react";
import CanvasJSReact from "./assets/canvasjs.react";
import { fetchAlertsRuleUrl } from "../../../../../api/ReportApi";
import { useErrorBoundary } from "react-error-boundary";
import jsPDF from "jspdf";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

function AlertsRule() {
  const handleError = useErrorBoundary();
  const orgId = Number(sessionStorage.getItem("orgId"));
  const [alertData, setAlertData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')

  const CanvasJS = CanvasJSReact.CanvasJS;
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  CanvasJS.addColorSet("barColorSet", ["#f0e68c", "#ffb700", "#008080"]);

  const baroptions = {
    dataPointWidth: 40,
    axisY: {
      minimum: 0,
      maximum: 100,
      interval: 50,
      title: "alertCount",
      titleFontSize: 14,
    },
    axisX: {
      labelMaxWidth: 70,
      labelWrap: true,
      interval: 1,
      labelFontSize: 11,
      labelFontWeight: "normal",
      labelTextAlign: "center",
      labelAngle: 180,
      title: "alertRule",
      titleFontSize: 14,
    },
    data: [
      {
        type: "column",
        dataPoints: alertData,
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
        const response = await fetchAlertsRuleUrl(requestData);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Network response was not ok: ${response.status} - ${errorData.message}`
          );
        }

        const contentType = response.headers.get("Content-Type");
        if (contentType.includes("application/json")) {
          const responseData = await response.json();
          const dataPoints = responseData.data.map((item) => ({
            label: item.alertRule,
            y: item.alertCount,
          }));
          baroptions.data[0].dataPoints = dataPoints;
          setAlertData(dataPoints);
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

  const today = new Date();
  const lastYear = new Date();
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  const startDate = lastYear.toLocaleDateString("en-GB");
  const endDate = today.toLocaleDateString("en-GB");

  // Function to handle CSV export
  const handleExportCSV = () => {
    // Generate CSV content
    const csvContent =
      "Alert Rule, Alert Count\n" +
      alertData.map((item) => item.label + "," + item.y).join("\n");

    // Create a blob
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "alerts_report.csv");

    // Trigger the click event to download the file
    link.click();
  };

  // Function to handle PDF export
  const handleExportPDF = () => {
    // Generate PDF file here
    const doc = new jsPDF();
    doc.autoTable({
      head: [["Alert Rule", "Alert Count"]],
      body: alertData.map((item) => [item.label, item.y]),
    });
    doc.save("alerts_report.pdf");
  };

  return (
    <div>
      <h4 className="bg-heading mb-15">
        Alerts Rule for the last year ({startDate} to {endDate})
      </h4>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : alertData && alertData.length > 0 ? (
        <CanvasJSChart options={baroptions} />
      ) : (
        <p>No data available.</p>
      )}
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
              Export to CSV <i className="fa fa-file-excel link float-right" />
            </DropdownItem>
            <hr className="no-margin" />
            <DropdownItem onClick={handleExportPDF}>
              Export to PDF <i className="fa fa-file-pdf red float-right" />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}

export default AlertsRule;
