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

function ControlsDomainStatusSummary() {
  const handleError = useErrorBoundary()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)

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
        const response = await fetchControlsDomainStatusSummaryUrl()
        if (response?.data) {
          setData(response.data)
        }
      } catch (error) {
        handleError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [handleError])

  // Transform data for stacked column chart
  const allStatuses = new Set()
  data.forEach((domain) => {
    domain.statusSummary.forEach((s) => allStatuses.add(s.status))
  });

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
          <h4 className='mb-10 bg-heading'>Domain wise Status Breakdown</h4>
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

export default ControlsDomainStatusSummary