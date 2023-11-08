import React, {useState, useEffect} from 'react'
import CanvasJSReact from './assets/canvasjs.react'
import { fetchClosedIncidentsSummeryUrl } from '../../../../../api/ReportApi'
import { useErrorBoundary } from "react-error-boundary";

function ClosedIncidentReport() {
  const handleError = useErrorBoundary();
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [alertData, setAlertData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const CanvasJS = CanvasJSReact.CanvasJS
  const CanvasJSChart = CanvasJSReact.CanvasJSChart

  //Pie chart color code
  CanvasJS.addColorSet('colorShades', [
    //colorSet Array
    '#008080',
    '#f0e68c',
    '#ffb700',
  ])

  let statusNames = null
  let alertCounts = null

  if (alertData && alertData.length > 0) {
    statusNames = alertData.map((alert) => alert.statusName)
    alertCounts = alertData.map((alert) => alert.alertCount)
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
    colorSet: 'colorShades',
    title: {
      text: '',
    },
    data: [
      {
        type: 'pie',
        startAngle: 220,
        toolTipContent: '<b>{label}</b>: {y}% ({alertCount})',
        showInLegend: 'true',
        legendText: '{label}',
        indexLabelFontSize: 13,
        indexLabel: '{label} - {y}% ({alertCount})',
        dataPoints: dataPoints,
      },
    ],
  }
  useEffect(() => {
    const fetchData = async () => {
      const toDate = new Date().toISOString(); // Get the current date and time
      const fromDate = new Date();
      fromDate.setFullYear(fromDate.getFullYear() - 1); // Subtract 1 year from the current year
      const fromDateISO = fromDate.toISOString(); // Convert the fromDate to ISO string format

      const requestData = {
        orgId,
        incidentFromDate: fromDateISO,
        incidentToDate: toDate,
      };
      try {
        const response = await fetchClosedIncidentsSummeryUrl(requestData)

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
    ) : alertData !== null ? (
      <>
        <h2>
          Closed Incident for the last year ({startDate} to {endDate})
        </h2>
        <CanvasJSChart options={closedoptions} />
      </>
    ) : (
      <p>No data found</p>
    )}
  </div>
);

}

export default ClosedIncidentReport
