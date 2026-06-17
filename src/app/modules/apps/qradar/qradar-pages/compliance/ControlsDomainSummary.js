import React, {useState, useEffect} from 'react'
import CanvasJSReact from '../reports/assets/canvasjs.react'
import {fetchControlsDomainSummaryUrl} from '../../../../../api/ComplianceApi'
import {useErrorBoundary} from 'react-error-boundary'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import {fetchExportDataAddUrl} from '../../../../../api/Api'

const CanvasJS = CanvasJSReact.CanvasJS
const CanvasJSChart = CanvasJSReact.CanvasJSChart

function ControlsDomainSummary() {
  const handleError = useErrorBoundary()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [viewType, setViewType] = useState('pie')

  useEffect(() => {
    if (CanvasJS && typeof CanvasJS.getColorSet === 'function') {
      if (!CanvasJS.getColorSet('complianceShades')) {
        CanvasJS.addColorSet('complianceShades', [
          '#f0e68c',
          '#ffb700',
          '#008080',
          '#cc99ff',
          '#acddde',
          '#b4f0a7',
          '#ffb1b0',
        ])
      }
    }
  }, []) // Run once after initial render

  useEffect(() => {
    const fetchData = async () => {
      const payload = {
        orgId: Number(sessionStorage.getItem('orgId')),
        projectId: 1,
      }
      try {
        const response = await fetchControlsDomainSummaryUrl(payload)
        if (response?.isSuccess) {
          setData(response.data || [])
        }
      } catch (error) {
        handleError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [handleError])

  const exportToExcel = async () => {
    const headerRow = ['Domain Name', 'Percentage', 'Control Count']
    const content = [headerRow]
      .concat(
        data.map((item) => [
          item.domainName,
          `${item.percentage.toFixed(2)}%`,
          item.pendingControls,
        ])
      )
      .map((row) => row.join(','))
      .join('\n')

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(content)
    const link = document.createElement('a')
    link.href = csvContent
    link.setAttribute('download', 'controls_domain_summary.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    await fetchExportDataAddUrl({
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: 'Controls Domain Summary Report',
    })
  }

  const exportToPDF = async () => {
    const doc = new jsPDF()
    doc.text('Compliance Controls by Domain', 10, 10)
    const tableData = data.map((item) => [
      item.domainName,
      `${item.percentage.toFixed(2)}%`,
      item.pendingControls,
    ])

    doc.autoTable({
      startY: 20,
      head: [['Domain Name', 'Percentage', 'Control Count']],
      body: tableData,
    })

    doc.save('controls_domain_summary.pdf')
    await fetchExportDataAddUrl({
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: 'Controls Domain Summary Report',
    })
  }

  const handleExport = (format) => {
    if (format === 'excel') exportToExcel()
    else if (format === 'pdf') exportToPDF()
  }

  // Logic to group items beyond the top 5 into "Miscellaneous" for the Pie Chart
  const getProcessedPieData = () => {
    if (data.length <= 5) return data
    const sortedData = [...data].sort((a, b) => b.pendingControls - a.pendingControls)
    const topFive = sortedData.slice(0, 5)
    const remaining = sortedData.slice(5)
    const miscCount = remaining.reduce((sum, item) => sum + item.pendingControls, 0)
    const miscPercentage = remaining.reduce((sum, item) => sum + item.percentage, 0)

    return [
      ...topFive,
      {domainName: 'Miscellaneous', pendingControls: miscCount, percentage: miscPercentage},
    ]
  }

  const processedPieData = getProcessedPieData()

  const options = {
    exportEnabled: true,
    animationEnabled: true,
    colorSet: 'complianceShades',
    title: {
      text: 'Compliance Controls by Domain',
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
          y: item.percentage,
          label: item.domainName,
          count: item.pendingControls,
        })),
      },
    ],
  }

  const barOptions = {
    animationEnabled: true,
    colorSet: 'complianceShades',
    title: {
      text: 'Compliance Controls by Domain',
      fontSize: 20,
    },
    axisX: {
      title: 'Domains',
      labelFontSize: 12,
      interval: 1,
    },
    axisY: {
      title: 'Control Count',
    },
    data: [
      {
        type: 'column',
        dataPoints: data.map((item) => ({
          label: item.domainName,
          y: item.pendingControls,
        })),
      },
    ],
  }

  return (
    <div className='' id='controlsDomainSummary'>
      {loading ? (
        <p>Loading...</p>
      ) : data.length > 0 ? (
        <>
          <div className='d-flex justify-content-between align-items-center mb-2 bg-heading'>
            <h4 className='text-white mb-0'>Compliance Controls by Domain</h4>
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

          {viewType === 'pie' && <CanvasJSChart options={options} />}
          {viewType === 'bar' && <CanvasJSChart options={barOptions} />}
          {viewType === 'table' && (
            <div className='table-responsive mt-5'>
              <table className='table table-row-bordered table-row-gray-300 align-middle gs-0 gy-4'>
                <thead>
                  <tr className='fw-bold text-muted'>
                    <th>Domain Name</th>
                    <th>Control Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.domainName}</td>
                      <td>{item.pendingControls}</td>
                      <td>{item.percentage.toFixed(2)}%</td>
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

export default ControlsDomainSummary
