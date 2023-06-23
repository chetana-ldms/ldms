import React, {useState, useEffect} from 'react'
import CanvasJSReact from './assets/canvasjs.react'

function AlertsSummary() {
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
    statusNames = alertData.map((alert) => alert.statusName)
    alertCounts = alertData.map((alert) => alert.alertCount)
  }

  const dataPoints =
    alertData && alertData.length > 0
      ? alertData.map((alert) => {
          return {
            y: alert.alertCount,
            label: alert.statusName,
          }
        })
      : []

  //Pie chart for Open incident status
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
        toolTipContent: '<b>{label}</b>: {y}%',
        showInLegend: 'true',
        legendText: '{label}',
        indexLabelFontSize: 13,
        indexLabel: '{label} - {y}%',
        dataPoints: dataPoints,
      },
    ],
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://182.71.241.246:502/api/Reports/v1/AlertsSummery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orgId: 1,
            alertFromDate: '2022-04-20T14:43:26.643Z',
            alertToDate: '2023-04-20T14:43:26.643Z',
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Network response was not ok: ${response.status} - ${errorData.message}`)
        }

        const {data} = await response.json() // destructure the 'data' property from the response object
        setAlertData(data)
        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  console.log(alertData) // Log the alertData to the console

  return (
    <div>
      <h1>Alerts Summary</h1>
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
