import React, {useState, useEffect} from 'react'
import CanvasJSReact from '../reports/assets/canvasjs.react'
import {fetchControlsDomainStatusSummaryUrl} from '../../../../../api/ComplianceApi'
import {useErrorBoundary} from 'react-error-boundary'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import {fetchExportDataAddUrl} from '../../../../../api/Api'

const CanvasJS = CanvasJSReact.CanvasJS
const CanvasJSChart = CanvasJSReact.CanvasJSChart

function ControlsTrackingAssignmentSummary() {
  const handleError = useErrorBoundary()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [viewType, setViewType] = useState('bar')
  const orgId = Number(sessionStorage.getItem('orgId'))

  useEffect(() => {
    if (CanvasJS && typeof CanvasJS.getColorSet === 'function') {
      if (!CanvasJS.getColorSet('complianceShades')) {
        CanvasJS.addColorSet('complianceShades', [
          '#f0e68c', '#ffb700', '#008080', '#cc99ff',
          '#acddde', '#b4f0a7', '#ffb1b0',
        ]);
      }
    }
  }, []); // Run once after initial render

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          orgId,
          projectId: 1,
        }
        const response = await fetchControlsDomainStatusSummaryUrl(payload)
        if (response?.data) {
          setData(response.data)
        }
      } catch (error) {
        handleError(error)
      } finally {
        setLoading(false)
      }
    }
    if (orgId) fetchData()
  }, [handleError, orgId])

  // Transform data for stacked column chart
  const allStatuses = new Set()
  data.forEach((domain) => {
    domain.statusSummary.forEach((s) => allStatuses.add(s.status))
  });

  // Logic to group items beyond the top 5 into "Miscellaneous" for the Pie Chart
  const getProcessedPieData = () => {
    const totalAllDomains = data.reduce((sum, item) => sum + item.totalControls, 0)
    
    const mappedData = data.map(item => ({
      ...item,
      percentage: totalAllDomains > 0 ? (item.totalControls / totalAllDomains) * 100 : 0
    }))

    if (mappedData.length <= 5) return mappedData
    
    const sortedData = [...mappedData].sort((a, b) => b.totalControls - a.totalControls)
    const topFive = sortedData.slice(0, 5)
    const remaining = sortedData.slice(5)
    const miscCount = remaining.reduce((sum, item) => sum + item.totalControls, 0)
    const miscPercentage = remaining.reduce((sum, item) => sum + item.percentage, 0)

    return [
      ...topFive,
      {domainName: 'Miscellaneous', totalControls: miscCount, percentage: miscPercentage},
    ]
  }

  const processedPieData = getProcessedPieData()

  const dataSeries = Array.from(allStatuses).map((statusName) => ({
    type: 'stackedColumn',
    name: statusName,
    showInLegend: true,
    dataPoints: data.map((domain) => {
      const statusItem = domain.statusSummary.find((s) => s.status === statusName)
      return {
        label: domain.domainName,
        y: statusItem ? statusItem.count : 0,
      }
    }),
  }))

  const exportToExcel = async () => {
    const statusList = Array.from(allStatuses)
    const headerRow = ['Domain', 'Total Controls', ...statusList]
    const content = [headerRow]
      .concat(
        data.map((domain) => [
          domain.domainName,
          domain.totalControls,
          ...statusList.map((s) => {
            const found = domain.statusSummary.find((item) => item.status === s)
            return found ? found.count : 0
          }),
        ])
      )
      .map((row) => row.join(','))
      .join('\n')

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(content)
    const link = document.createElement('a')
    link.href = csvContent
    link.setAttribute('download', 'domain_status_summary.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    await fetchExportDataAddUrl({
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: 'Domain Status Summary Report',
    })
  }

  const exportToPDF = async () => {
    const doc = new jsPDF('landscape')
    doc.text('Domain wise Status Breakdown', 10, 10)

    const statusList = Array.from(allStatuses)
    const tableHead = [['Domain', 'Total', ...statusList]]
    const tableBody = data.map((domain) => [
      domain.domainName,
      domain.totalControls,
      ...statusList.map((s) => {
        const found = domain.statusSummary.find((item) => item.status === s)
        return found ? found.count : 0
      }),
    ])

    doc.autoTable({
      startY: 20,
      head: tableHead,
      body: tableBody,
      styles: {fontSize: 8},
    })

    doc.save('domain_status_summary.pdf')
    await fetchExportDataAddUrl({
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: 'Domain Status Summary Report',
    })
  }

  const handleExport = (format) => {
    if (format === 'excel') exportToExcel()
    else if (format === 'pdf') exportToPDF()
  }

  const pieOptions = {
    exportEnabled: true,
    animationEnabled: true,
    colorSet: 'complianceShades',
    title: {
      text: 'Total Controls by Domain',
      fontSize: 20,
    },
    data: [
      {
        type: 'pie',
        startAngle: 240,
        toolTipContent: '<b>{label}</b>: {y}% ({count})',
        showInLegend: 'true',
        legendText: '{label}',
        indexLabelFontSize: 13,
        indexLabel: '{label} - {y}% ({count})',
        dataPoints: processedPieData.map((item) => ({
          y: Number(item.percentage.toFixed(2)),
          label: item.domainName,
          count: item.totalControls,
        })),
      },
    ],
  }

  const options = {
    animationEnabled: true,
    exportEnabled: true,
    colorSet: 'complianceShades',
    title: {
      text: 'Domain wise Status Breakdown',
      fontSize: 20,
    },
    axisX: {
      title: 'Domains',
      labelFontSize: 12,
    },
    axisY: {
      title: 'Control Count',
    },
    toolTip: {
      shared: true,
      content: '<strong>{label}</strong><br/>{name}: {y}',
    },
    data: dataSeries,
  }

  return (
    <div className='' id='controlsDomainStatusSummary'>
      {loading ? (
        <p>Loading...</p>
      ) : data.length > 0 ? (
        <>
          <div className='d-flex justify-content-between align-items-center mb-2 bg-heading'>
            <h4 className='text-white mb-0'>Domain wise Status Breakdown</h4>
            <div className='btn-group'>
              <button
                className={`btn btn-sm btn-light-primary ${viewType === 'pie' ? 'active' : ''}`}
                onClick={() => setViewType('pie')}
              >
                Pie
              </button>
              <button
                className={`btn btn-sm btn-light-primary ${viewType === 'bar' ? 'active' : ''}`}
                onClick={() => setViewType('bar')}
              >
                Bar
              </button>
              <button
                className={`btn btn-sm btn-light-primary ${viewType === 'table' ? 'active' : ''}`}
                onClick={() => setViewType('table')}
              >
                Table
              </button>
            </div>
            <div className=''>
              <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
                <DropdownToggle caret className='p-0 m-0 px-5 py-2'>
                  Export <i className='fa fa-file-export link mg-left-10 p-0 m-0' />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => handleExport('excel')}>
                    Export to CSV <i className='fa fa-file-excel link float-right' />
                  </DropdownItem>
                  <hr className='no-margin' />
                  <DropdownItem onClick={() => handleExport('pdf')}>
                    Export to PDF <i className='fa fa-file-pdf red float-right' />
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          {viewType === 'pie' && <CanvasJSChart options={pieOptions} />}
          {viewType === 'bar' && <CanvasJSChart options={options} />}
          {viewType === 'table' && (
            <div className='table-responsive mt-5'>
              <table className='table table-row-bordered table-row-gray-300 align-middle gs-0 gy-4'>
                <thead>
                  <tr className='fw-bold text-muted bg-blue'>
                    <th>Domain Name</th>
                    <th>Total Controls</th>
                    {Array.from(allStatuses).map((status, idx) => (
                      <th key={idx}>{status}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((domain, index) => (
                    <tr key={index}>
                      <td>{domain.domainName}</td>
                      <td>{domain.totalControls}</td>
                      {Array.from(allStatuses).map((status, sIdx) => {
                        const found = domain.statusSummary.find((s) => s.status === status)
                        return <td key={sIdx}>{found ? found.count : 0}</td>
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <p className='text-center'>No data found</p>
      )}
    </div>
  )
}

export default ControlsTrackingAssignmentSummary