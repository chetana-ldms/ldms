import React, {useState, useEffect} from 'react'
import CanvasJSReact from './assets/canvasjs.react'
import { fetchAlertsSummeryUrl } from '../../../../../api/ReportApi';
import { useErrorBoundary } from "react-error-boundary";


function AlertsSummary() {
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
    '#f0e68c',
    '#ffb700',
    '#008080',
    '#ffb1b0',
  ])

  let statusNames = null 
  let alertCounts = null

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
        const response = await fetchAlertsSummeryUrl(requestData)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Network response was not ok: ${response.status} - ${errorData.message}`)
        }
  
        const contentType = response.headers.get('Content-Type')
        if (contentType.includes('application/json')) {
          const responseData = await response.json()
          setAlertData(responseData.data)
          setLoading(false)
        } else {
          throw new Error('Response is not in JSON format')
        }
      } catch (error) {
        handleError(error);
        setError(error.message)
        setLoading(false)
      }
    }
  
    fetchData()
  }, [])
  

  
 //Date range
 const today = new Date();
 const lastYear = new Date();
 lastYear.setFullYear(lastYear.getFullYear() - 1);
 const startDate = lastYear.toLocaleDateString("en-GB");
 const endDate = today.toLocaleDateString("en-GB");

  return (
    <div>
      <h2>
      Alerts Summary for the last year ({startDate} to{" "}
            {endDate})
          </h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : alertData && alertData.length > 0 ? (
        <CanvasJSChart options={openstatusoptions} />
      ) : (
        <p>No data available.</p>
      )}
    </div>
  )
}

export default AlertsSummary
