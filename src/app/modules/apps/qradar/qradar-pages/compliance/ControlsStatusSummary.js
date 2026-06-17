import React, {useState, useEffect} from 'react'
import CanvasJSReact from '../reports/assets/canvasjs.react'
import {fetchControlsStatusSummaryUrl} from '../../../../../api/ComplianceApi'
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

function ControlsStatusSummary() {
  const handleError = useErrorBoundary()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
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
          orgId: Number(sessionStorage.getItem('orgId')),
          projectId: 1,
        }
        const response = await fetchControlsStatusSummaryUrl(payload)
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
    const headerRow = ['Status Name', 'Percentage', 'Control Count']
    const content = [headerRow]
      .concat(
        data.map((item) => [
          item.statusName,
          `${item.percentage.toFixed(2)}%`,
          item.controlCount,
        ])
      )
      .map((row) => row.join(','))
      .join('\n')

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(content)
    const link = document.createElement('a')
    link.href = csvContent
    link.setAttribute('download', 'controls_status_summary.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    await fetchExportDataAddUrl({
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: 'Controls Status Summary Report',
    })
  }

  const exportToPDF = async () => {
    const doc = new jsPDF()
    doc.text('Compliance Controls by Status', 10, 10)
    const tableData = data.map((item) => [
      item.statusName,
      `${item.percentage.toFixed(2)}%`,
      item.controlCount,
    ])

    doc.autoTable({
      startY: 20,
      head: [['Status Name', 'Percentage', 'Control Count']],
      body: tableData,
    })

    doc.save('controls_status_summary.pdf')
    await fetchExportDataAddUrl({
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: 'Controls Status Summary Report',
    })
  }

  const handleExport = (format) => {
    if (format === 'excel') exportToExcel()
    else if (format === 'pdf') exportToPDF()
  }

  const options = {
    exportEnabled: true,
    animationEnabled: true,
    colorSet: 'complianceShades',
    title: {
      text: 'Compliance Controls by Status',
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
        dataPoints: data.map((item) => ({
          y: item.percentage,
          label: item.statusName,
          count: item.controlCount,
        })),
      },
    ],
  }

  return (
    <div className='' id='controlsStatusSummary'>
      {loading ? (
        <p>Loading...</p>
      ) : data.length > 0 ? (
        <>
          <h4 className='mb-10 bg-heading'>Compliance Controls by Status</h4>
          <CanvasJSChart options={options} />
        </>
      ) : (
        <p className='text-center'>No data found</p>
      )}
      <div className='export-report mt-5 me-5'>
        <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
          <DropdownToggle caret>
            Export <i className='fa fa-file-export link mg-left-10' />
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
  )
}

export default ControlsStatusSummary