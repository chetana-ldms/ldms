import React, { useState, useEffect } from "react";
import CanvasJSReact from "./assets/canvasjs.react";
import { fetchSignificantsIncidentsSummeryUrl } from "../../../../../api/ReportApi";
import { useErrorBoundary } from "react-error-boundary";
import jsPDF from "jspdf";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

function SignificantIncident() {
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

  //Pie chart color code
  CanvasJS.addColorSet("colorShades", [
    //colorSet Array
    "#f0e68c",
    "#ffb700",
    "#008080",
    "#cc99ff",
    "#acddde",
    "#b4f0a7",
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
        const response = await fetchSignificantsIncidentsSummeryUrl(
          requestData
        );

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
  //Date range
  const today = new Date();
  const lastYear = new Date();
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  const startDate = lastYear.toLocaleDateString("en-GB");
  const endDate = today.toLocaleDateString("en-GB");

  //Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["Status Name", "Percentage", "Alert Count"]],
      body: alertData.map((alert) => [
        alert.statusName,
        alert.percentageValue.toFixed(2) + "%",
        alert.alertCount,
      ]),
    });
    doc.save("significant_incident_summary.pdf");
  };

  //Export to CSV

  const exportToExcel = () => {
    const csvContent = [
      ["Status Name", "Percentage", "Alert Count"],
      ...alertData.map((alert) =>
        [
          alert.statusName,
          alert.percentageValue.toFixed(2) + "%",
          alert.alertCount,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "significant_incident_summary.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
            Significant Incident for the last year ({startDate} to {endDate})
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

export default SignificantIncident;
