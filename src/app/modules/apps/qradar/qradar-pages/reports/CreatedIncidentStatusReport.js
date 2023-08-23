import React, { useState, useEffect } from "react";
import CanvasJSReact from "./assets/canvasjs.react";
import { fetchAllIncidentsSummeryUrl } from "../../../../../api/ReportApi";
import { useErrorBoundary } from "react-error-boundary";
 

function CreatedIncidentStatusReport() {
  const handleError = useErrorBoundary();
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [alertData, setAlertData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const statusNames = alertData.map((alert) => alert.statusName);
  const alertCounts = alertData.map((alert) => alert.percentageValue); 

  //Pie chart for Open incident status
  const allstatusoption = {
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
        toolTipContent: "<b>{label}</b>: {y}% ({alertCount})", // Include alertCount in tooltip
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 13,
        indexLabel: "{label} - {y}% ({alertCount})", // Include alertCount in label
        dataPoints: statusNames.map((statusName, index) => {
          return {
            y: alertCounts[index].toFixed(2),
            label: statusName,
            alertCount: alertData[index].alertCount, // Access the alertCount from alertData
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
        orgId: 1,
        incidentFromDate: fromDateISO,
        incidentToDate: toDate,
      };
      try {
        const response = await fetchAllIncidentsSummeryUrl(requestData)

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

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <h2>
            Status of all created incidents for the last year ({startDate} to{" "}
            {endDate})
          </h2>
          <CanvasJSChart options={allstatusoption} />
        </>
      )}
    </div>
  );
}

export default CreatedIncidentStatusReport;
