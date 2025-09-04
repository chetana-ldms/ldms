import React, {useState, useEffect} from 'react'
import {Tabs, Tab, TabList, TabPanel} from 'react-tabs'
import CanvasJSReact from './assets/canvasjs.react'
import {
  fetchIncidentsSLAMeasurementSummeryUrl,
  fetchSLAMeasurementSummeryUrl,
} from '../../../../../api/ReportApi'
import {useErrorBoundary} from 'react-error-boundary'
import {fetchOrganizationToolsDetailsUrl} from '../../../../../api/IncidentsApi'

function IncidentSlaMeasurement() {
  const handleError = useErrorBoundary()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  // const [incidentData, setIncidentData] = useState({
  //   toolID: toolId || '',
  // })
  const [incidentData, setIncidentData] = useState({
    toolID: sessionStorage.getItem('incidentToolId'),
  })
  const [tools, setTools] = useState([])
  const [alertData, setAlertData] = useState([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [selectedTab, setSelectedTab] = useState(0)
  const [error, setError] = useState(null)
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')

  const CanvasJS = CanvasJSReact.CanvasJS
  const CanvasJSChart = CanvasJSReact.CanvasJSChart

  //Pie chart color code
  CanvasJS.addColorSet('colorShades', [
    //colorSet Array
    '#f0e68c',
    '#ffb700',
    '#008080',
  ])

  //SLA Bar chart color code
  CanvasJS.addColorSet('slacolorShades', [
    //colorSet Array
    '#f9a602',
  ])

  // Group data based on summeryPeriodType
  const filtered7Day = alertData.filter((item) => item.summeryPeriodType === '7DayTotal')
  const filtered30Day = alertData.filter((item) => item.summeryPeriodType === '30DayTotal')
  const filtered365Day = alertData.filter((item) => item.summeryPeriodType === '365DayTotal')

  // Function to prepare chart data
  const prepareChartData = (data) => {
    if (!data || data.length === 0) return []

    return data.map((item) => ({
      y: item.slaMetPercentageValue,
      label: `${item.priorityName} (${item.totalIncidents})`,
      toolTipContent: `SLA Met Count: ${item.slaMetCount} - SLA UnMet Count: ${item.slaUnmetCount} -  SLA Met %: ${item.slaMetPercentageValue}%`,
    }))
  }

  const chartOptions = [
    {
      animationEnabled: true,
      theme: 'light2',
      colorSet: 'slacolorShades',
      axisX: {
        title: 'Priority',
        labelFontSize: 14,
        labelWrap: true,
        labelMaxWidth: 150,
        interval: 1,
        reversed: true,
      },
      axisY: {
        title: 'Incidents SLA Met (%)',
        maximum: 100,
        includeZero: true,
        suffix: '%',
        minimum: 0,
        maximum: 100,
        interval: 10,
      },
      data: [
        {
          type: 'bar',
          indexLabel: '{y}%',
          toolTipContent: '{label}: {y}%',
          dataPoints: prepareChartData(filtered7Day),
        },
      ],
    },
    {
      animationEnabled: true,
      theme: 'light2',
      colorSet: 'slacolorShades',
      axisX: {
        title: 'Priority',
        labelFontSize: 14,
        labelWrap: true,
        labelMaxWidth: 150,
        interval: 1,
        reversed: true,
      },
      axisY: {
        title: 'Incidents SLA Met (%)',
        maximum: 100,
        includeZero: true,
        suffix: '%',
        minimum: 0,
        maximum: 100,
        interval: 10,
      },
      data: [
        {
          type: 'bar',
          indexLabel: '{y}%',
          toolTipContent: '{label}: {y}%',
          dataPoints: prepareChartData(filtered30Day),
        },
      ],
    },
    {
      animationEnabled: true,
      theme: 'light2',
      colorSet: 'slacolorShades',
      axisX: {
        title: 'Priority',
        labelFontSize: 14,
        labelWrap: true,
        labelMaxWidth: 150,
        interval: 1,
        reversed: true,
      },
      axisY: {
        title: 'Incidents SLA Met (%)',
        maximum: 100,
        includeZero: true,
        suffix: '%',
        minimum: 0,
        maximum: 100,
        interval: 10,
      },
      data: [
        {
          type: 'bar',
          indexLabel: '{y}%',
          toolTipContent: '{label}: {y}%',
          dataPoints: prepareChartData(filtered365Day),
        },
      ],
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      let duration
      if (selectedTab === 0) duration = [7]
      else if (selectedTab === 1) duration = [30]
      else if (selectedTab === 2) duration = [365]

      const requestData = {
        orgId,
        toolId: incidentData.toolID ? Number(incidentData.toolID) : 0,
        durationInDays: duration,
      }

      try {
        const response = await fetchIncidentsSLAMeasurementSummeryUrl(requestData)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Network response was not ok: ${response.status} - ${errorData.message}`)
        }
        const {data} = await response.json()
        setAlertData(data)
        setLoading(false)
      } catch (error) {
        handleError(error)
        setError(error.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [incidentData.toolID, selectedTab])

  useEffect(() => {
    const today = new Date()
    let startDate, endDate
    switch (selectedTab) {
      case 0:
        startDate = new Date(today)
        startDate.setDate(today.getDate() - 7)
        endDate = today
        break
      case 1:
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
        endDate = today
        break
      case 2:
        startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
        endDate = today
        break
      default:
        break
    }
    setStartDate(startDate.toLocaleDateString('en-GB'))
    setEndDate(endDate.toLocaleDateString('en-GB'))
  }, [selectedTab])
  const handleChange = (event, field) => {
    const {value, checked, type} = event.target
    setIncidentData((prev) => ({
      ...prev,
      [field]: type === 'checkbox' ? checked : value,
    }))
  }
  useEffect(() => {
    const reload = async () => {
      try {
        setLoading(true)
        const data = await fetchOrganizationToolsDetailsUrl(orgId)
        setTools(data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    reload()
  }, [orgId])
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <div className='row mb-2 bg-heading m-0 p-0 align-items-center'>
            <div className='col-md-6'>
              <h4 className=' text-white'>
                {selectedTab === 0
                  ? `SLA measurement for the last week (${startDate} to ${endDate})`
                  : selectedTab === 1
                  ? `SLA measurement for the last month (${startDate} to ${endDate})`
                  : `SLA measurement for the last year (${startDate} to ${endDate})`}
              </h4>
            </div>
            <div className='col-md-6 d-flex align-items-center justify-content-end'>
              <label className='me-2 mb-0'>Tool:</label>
              <select
                className='form-select form-select-sm'
                style={{width: '180px', display: 'inline-block'}}
                value={incidentData.toolID}
                onChange={(e) => handleChange(e, 'toolID')}
              >
                {tools !== null &&
                  tools?.map((item, index) => (
                    <option key={index} value={item.toolID}>
                      {item.toolName}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <Tabs selectedIndex={selectedTab} onSelect={(index) => setSelectedTab(index)}>
            <TabList className='inner-tablist ms-5'>
              <Tab className='semi-bold'>Last 7 days</Tab>
              <Tab className='semi-bold'>Last 30 days</Tab>
              <Tab className='semi-bold'>Last 1 year</Tab>
            </TabList>

            {chartOptions.map((options, index) => (
              <TabPanel key={index}>
                <CanvasJSChart options={options} />
              </TabPanel>
            ))}
          </Tabs>
        </>
      )}
    </div>
  )
}
export default IncidentSlaMeasurement
