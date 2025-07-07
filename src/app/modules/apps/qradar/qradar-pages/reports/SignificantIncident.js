import React, {useState, useEffect} from 'react'
import CanvasJSReact from './assets/canvasjs.react'
import {fetchSignificantsIncidentsSummeryUrl} from '../../../../../api/ReportApi'
import {useErrorBoundary} from 'react-error-boundary'
import jsPDF from 'jspdf'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import {fetchExportDataAddUrl} from '../../../../../api/Api'
import { fetchOrganizationToolsDetailsUrl } from '../../../../../api/IncidentsApi'

function SignificantIncident({ fromDate, toDate, toolID: parentToolID }) {
  const handleError = useErrorBoundary()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const [alertData, setAlertData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tools, setTools] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const today = new Date()
  const lastYear = new Date()
  lastYear.setFullYear(lastYear.getFullYear() - 1)

  // Local state for tool and date selection
  const [incidentData, setIncidentData] = useState({
    toolID: parentToolID || toolId || '',
  })
  const [startDate, setStartDate] = useState(fromDate || lastYear.toISOString().slice(0, 10))
  const [endDate, setEndDate] = useState(toDate || today.toISOString().slice(0, 10))

  // Sync with parent props if they change
  useEffect(() => {
    if (fromDate) setStartDate(fromDate)
    if (toDate) setEndDate(toDate)
    if (parentToolID !== undefined) setIncidentData((prev) => ({ ...prev, toolID: parentToolID }))
  }, [fromDate, toDate, parentToolID])

  const handleChange = (event, field) => {
    const { value, checked, type } = event.target
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

  const CanvasJS = CanvasJSReact.CanvasJS
  const CanvasJSChart = CanvasJSReact.CanvasJSChart

  //Pie chart color code
  CanvasJS.addColorSet('colorShades', [
    '#f0e68c',
    '#ffb700',
    '#008080',
    '#cc99ff',
    '#acddde',
    '#b4f0a7',
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
      ? alertData.map((alert, index) => {
          return {
            y: alert.percentageValue.toFixed(2),
            label: alert.statusName,
            alertCount: alertCounts[index],
          }
        })
      : []

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

  // Fetch data whenever tool, startDate, or endDate changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const fromDateISO = new Date(startDate).toISOString()
      const toDateISO = new Date(endDate).toISOString()

      const requestData = {
        orgId,
        toolId: incidentData.toolID ? Number(incidentData.toolID) : 0,
        incidentFromDate: fromDateISO,
        incidentToDate: toDateISO,
        orgAccountStructureLevel: [
          {
            levelName: 'AccountId',
            levelValue: accountId || '',
          },
          {
            levelName: 'SiteId',
            levelValue: siteId || '',
          },
          {
            levelName: 'GroupId',
            levelValue: groupId || '',
          },
        ],
      }
      try {
        const response = await fetchSignificantsIncidentsSummeryUrl(requestData)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Network response was not ok: ${response.status} - ${errorData.message}`)
        }

        const { data } = await response.json()
        setAlertData(data)
        setLoading(false)
      } catch (error) {
        handleError(error)
        setError(error.message)
        setLoading(false)
      }
    }

    fetchData()
    // eslint-disable-next-line
  }, [incidentData.toolID, startDate, endDate])

  //Export to PDF
  const exportToPDF = async () => {
    const doc = new jsPDF()
    doc.autoTable({
      head: [['Status Name', 'Percentage', 'Alert Count']],
      body: alertData.map((alert) => [
        alert.statusName,
        alert.percentageValue.toFixed(2) + '%',
        alert.alertCount,
      ]),
    })
    doc.save('significant_incident_summary.pdf')
    const data = {
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: 'Significant incident Report',
    }
    try {
      await fetchExportDataAddUrl(data)
    } catch (error) {
      console.error(error)
    }
  }

  //Export to CSV
  const exportToExcel = async () => {
    const csvContent = [
      ['Status Name', 'Percentage', 'Alert Count'],
      ...alertData.map((alert) =>
        [alert.statusName, alert.percentageValue.toFixed(2) + '%', alert.alertCount].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'significant_incident_summary.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    const data = {
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: 'Significant incident Report',
    }
    try {
      await fetchExportDataAddUrl(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <div className='row bg-heading m-0 align-items-center'>
        <div className='col-md-6 fs-15 pt-1'>
          Significant Incident 
        </div>
       <div className='col-md-2 d-flex align-items-center'>
              <label className='me-2 mb-0'>From:</label>
              <input
                type='date'
                className='form-control form-control-sm'
                style={{ width: '150px' }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
              />
            </div>
            <div className='col-md-2 d-flex align-items-center'>
              <label className='me-2 mb-0'>To:</label>
              <input
                type='date'
                className='form-control form-control-sm'
                style={{ width: '150px' }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={today.toISOString().slice(0, 10)}
              />
            </div>
            <div className='col-md-2 d-flex align-items-center'>
              <label className='me-2 mb-0'>Tool:</label>
              <select
                className='form-select form-select-sm'
                style={{ width: '180px', display: 'inline-block' }}
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
      <div className='export-report mt-5 me-5'>
        <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
          <DropdownToggle caret>
            Export <i className='fa fa-file-export link mg-left-10' />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={exportToExcel}>
              Export to CSV <i className='fa fa-file-excel link float-right' />
            </DropdownItem>
            <DropdownItem onClick={exportToPDF}>
              Export to PDF <i className='fa fa-file-pdf red float-right' />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : alertData !== null ? (
        <CanvasJSChart options={openstatusoptions} />
      ) : (
        <p>No data found</p>
      )}
    </div>
  )
}

export default SignificantIncident
