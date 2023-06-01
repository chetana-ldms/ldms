import React, {useState, useEffect} from 'react'
import CanvasJSReact from './assets/canvasjs.react'

function CreatedIncidentStatusReport() {
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
    '#b3c100',
    '#ea6a47',
  ])

  const statusNames = alertData.map((alert) => alert.statusName)
  const alertCounts = alertData.map((alert) => alert.alertCount)

  //Pie chart for Open incident status
  const allstatusoption = {
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
        dataPoints: statusNames.map((statusName, index) => {
          return {
            y: alertCounts[index],
            label: statusName,
          }
        }),
      },
    ],
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://115.110.192.133:502/api/Reports/v1/AllIncidentsSummery',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orgId: 1,
              incidentFromDate: '2022-04-13T05:43:48.828Z',
              incidentToDate: '2023-04-13T05:43:48.828Z',
            }),
          }
        )

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
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <CanvasJSChart options={allstatusoption} />
        </>
      )}
    </div>
  )
}

export default CreatedIncidentStatusReport
