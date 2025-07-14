import React, {useState, useEffect} from 'react'
import {
  fetchOrganizationToolsDetailsUrl,
  fetchMasterData,
  fetchUsersByOrgTool,
  fetchIncidentReportTypesUrl,
  fetchIncidentReportDataUrl,
} from '../../../../../api/IncidentsApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {truncateText} from '../../../../../../utils/TruncateText'
import Pagination from '../../../../../../utils/Pagination'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import {fetchExportDataAddUrl} from '../../../../../api/Api'
import jsPDF from 'jspdf'
import formatDateWithCurrentUtcTime from '../../../../../../utils/formatDateWithCurrentUtcTime'

export default function IncidentReport() {
  const [filterValue, setFilterValue] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activePage, setActivePage] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const today = new Date()
  const lastYear = new Date()
  lastYear.setFullYear(lastYear.getFullYear() - 1)
  const [startDate, setStartDate] = useState(lastYear.toISOString().slice(0, 10))
  const [endDate, setEndDate] = useState(today.toISOString().slice(0, 10))
  const [tools, setTools] = useState([])
  const [toolID, setToolID] = useState(sessionStorage.getItem('toolID') || '')
  const [statusList, setStatusList] = useState([])
  const [status, setStatus] = useState('')
  const [priorityList, setPriorityList] = useState([])
  const [priority, setPriority] = useState('')
  const [ownerList, setOwnerList] = useState([])
  const [owner, setOwner] = useState('')
  const [reportTypes, setReportTypes] = useState([])
  const [reportType, setReportType] = useState('')
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchOrganizationToolsDetailsUrl(Number(sessionStorage.getItem('orgId')))
      .then((data) => setTools(data))
      .catch(() => setTools([]))
  }, [])

  useEffect(() => {
    fetchIncidentReportTypesUrl()
      .then((data) => setReportTypes(data || []))
      .catch(() => setReportTypes([]))
  }, [])
  useEffect(() => {
    if (!toolID) {
      setStatusList([])
      setPriorityList([])
      setOwnerList([])
      setStatus('')
      setPriority('')
      setOwner('')
      return
    }
    const orgId = Number(sessionStorage.getItem('orgId'))
    const userID = Number(sessionStorage.getItem('userId'))
    fetchMasterData({maserDataType: 'incident_status', orgId, toolId: toolID})
      .then((data) => setStatusList(data || []))
      .catch(() => setStatusList([]))
    fetchMasterData({maserDataType: 'incident_priority', orgId, toolId: toolID})
      .then((data) => setPriorityList(data || []))
      .catch(() => setPriorityList([]))
    fetchUsersByOrgTool(orgId, toolID, userID)
      .then((res) => setOwnerList(res?.usersList || []))
      .catch(() => setOwnerList([]))
  }, [toolID])
  const handleToolChange = (e) => {
    const newToolID = e.target.value
    setToolID(newToolID)
    setStatus('')
    setPriority('')
    setOwner('')
  }

  const fetchTableData = async () => {
    if (!reportType) {
      setTableData([])
      return
    }

    const payload = {
      fromDate: new Date(startDate).toISOString(),
      toDate: formatDateWithCurrentUtcTime(endDate),
      orgId: Number(sessionStorage.getItem('orgId')),
      toolId: Number(toolID) || 0,
      reportTypeId: Number(reportType),
      statusId: Number(status) || 0,
      ownerUserId: Number(owner) || 0,
      priorityId: Number(priority) || 0,
    }

    setLoading(true)
    try {
      const data = await fetchIncidentReportDataUrl(payload)
      setTableData(data?.data || [])
      setCurrentPage(0)
      setActivePage(0)
    } catch (error) {
      setTableData([])
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchTableData()
  }, [startDate, endDate, toolID, status, priority, owner, reportType, itemsPerPage])
  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = tableData
    ? tableData
        .filter((item) => item.subject.toLowerCase().includes(filterValue.toLowerCase()))
        .slice(indexOfFirstItem, indexOfLastItem)
    : null
  const filteredList = filterValue
    ? tableData.filter((item) => item.subject.toLowerCase().includes(filterValue.toLowerCase()))
    : tableData

  useEffect(() => {
    fetchIncidentReportTypesUrl()
      .then((data) => {
        const types = data || []
        setReportTypes(types)
        if (types.length > 0) {
          setReportType(types[0].reportId.toString())
        }
      })
      .catch(() => setReportTypes([]))
  }, [])
  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected)
    setActivePage(selected.selected)
  }

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
    setCurrentPage(0)
    setActivePage(0)
  }
  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(0)
    setActivePage(0)
  }
  const exportHeaders = [
    {label: 'Incident ID', key: 'incidentID'},
    {label: 'Subject', key: 'subject'},
    {label: 'Status', key: 'incidentStatusName'},
    {label: 'Priority', key: 'priorityName'},
    {label: 'Owner', key: 'ownerName'},
    {label: 'Created Date', key: 'createdDate'},
    {label: 'Resolution Due', key: 'resolutionDueDatetime'},
    {label: 'Resolved Date', key: 'resolvedDatetime'},
    {label: 'Closed Date', key: 'closedDatetime'},
    {label: 'Created By', key: 'createdUser'},
  ]

  const exportToExcel = async () => {
    if (!currentItems || currentItems.length === 0) return

    const csvRows = []

    // Add headers
    csvRows.push(exportHeaders.map((header) => header.label).join(','))

    // Add data rows
    currentItems.forEach((row) => {
      const rowData = exportHeaders.map((header) => {
        const value = row[header.key]
        if (!value) return 'N/A'
        if (header.key.toLowerCase().includes('date')) {
          return getCurrentTimeZone(value)
        }
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      })
      csvRows.push(rowData.join(','))
    })

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'incident_report.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    try {
      await fetchExportDataAddUrl({
        createdDate: new Date().toISOString(),
        createdUserId: Number(sessionStorage.getItem('userId')),
        orgId: Number(sessionStorage.getItem('orgId')),
        exportDataType: 'Report',
      })
    } catch (error) {
      console.error(error)
    }
  }

  // Function to export data to PDF
  const exportToPDF = async () => {
    if (!currentItems || currentItems.length === 0) return

    const doc = new jsPDF()

    const head = [exportHeaders.map((header) => header.label)]
    const body = currentItems.map((row) =>
      exportHeaders.map((header) => {
        const value = row[header.key]
        if (!value) return 'N/A'
        if (header.key.toLowerCase().includes('date')) {
          return getCurrentTimeZone(value)
        }
        return value
      })
    )

    doc.autoTable({
      head,
      body,
      styles: {fontSize: 8},
      theme: 'grid',
    })

    doc.save('incident_report.pdf')

    try {
      await fetchExportDataAddUrl({
        createdDate: new Date().toISOString(),
        createdUserId: Number(sessionStorage.getItem('userId')),
        orgId: Number(sessionStorage.getItem('orgId')),
        exportDataType: 'Report',
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='card p-2'>
      <div className='row g-3 align-items-center'>
        <div className='col-md-2'>
          <label className='form-label'>From Date</label>
          <input
            type='date'
            className='form-control form-control-sm'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate}
          />
        </div>
        <div className='col-md-2'>
          <label className='form-label'>To Date</label>
          <input
            type='date'
            className='form-control form-control-sm'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            max={today.toISOString().slice(0, 10)}
          />
        </div>
        <div className='col-md-2'>
          <label className='form-label'>Tool</label>
          <select className='form-select form-select-sm' value={toolID} onChange={handleToolChange}>
            <option value=''>Select</option>
            {tools.map((tool) => (
              <option key={tool.toolID} value={tool.toolID}>
                {tool.toolName}
              </option>
            ))}
          </select>
        </div>
        <div className='col-md-2'>
          <label className='form-label'>Status</label>
          <select
            className='form-select form-select-sm'
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={!toolID}
          >
            <option value=''>Select</option>
            {statusList.map((item) => (
              <option key={item.dataID} value={item.dataID}>
                {item.dataValue}
              </option>
            ))}
          </select>
        </div>
        <div className='col-md-2'>
          <label className='form-label'>Priority</label>
          <select
            className='form-select form-select-sm'
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={!toolID}
          >
            <option value=''>Select</option>
            {priorityList.map((item) => (
              <option key={item.dataID} value={item.dataID}>
                {item.dataValue}
              </option>
            ))}
          </select>
        </div>
        <div className='col-md-2'>
          <label className='form-label'>Owner</label>
          <select
            className='form-select form-select-sm'
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            disabled={!toolID}
          >
            <option value=''>Select</option>
            {ownerList.map((item) => (
              <option key={item.userID} value={item.userID}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className='col-md-3'>
          <label className='form-label'>Report Type</label>
          <select
            className='form-select form-select-sm'
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            {reportTypes.map((item) => (
              <option key={item.reportId} value={item.reportId}>
                {item.reportTitle}
              </option>
            ))}
          </select>
        </div>
        <div className='col-md-5'>
          <label className='form-label'>Search Text</label>
          <input
            type='text'
            placeholder='Search...'
            className='form-control'
            value={filterValue}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      <div className='row'>
        <div className='col-md-4 mt-5 fw-bold fs-3'>
          Reports ({currentItems ? currentItems.length : 0} /{' '}
          {filteredList ? filteredList.length : 0})
        </div>
        <div className='col-md-8'>
          <div className=' d-flex justify-content-end align-items-center'>
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
        </div>
      </div>
      <div className='card pad-10 config'>
        {loading ? (
          <UsersListLoading />
        ) : (
          <div className='card-body no-pad'>
            <table className='table alert-table fixed-table scroll-x'>
              <thead>
                <tr className='fw-bold text-muted bg-blue'>
                  <th>Incident ID</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Owner</th>
                  <th>Created Date</th>
                  <th>Resolution Due</th>
                  <th>Resolved Date</th>
                  <th>Closed Date</th>
                  <th>Created By</th>
                </tr>
              </thead>
              <tbody>
                {currentItems && currentItems.length > 0 ? (
                  currentItems.map((row, idx) => (
                    <tr key={idx} className='table-row'>
                      <td>{row.incidentID}</td>
                      <td title={row.subject}>{truncateText(row.subject, 40)}</td>
                      <td>{row.incidentStatusName}</td>
                      <td>{row.priorityName}</td>
                      <td>{row.ownerName}</td>
                      <td>{getCurrentTimeZone(row.createdDate)}</td>
                      <td>
                        {row.resolutionDueDatetime
                          ? getCurrentTimeZone(row.resolutionDueDatetime)
                          : 'N/A'}
                      </td>
                      <td>
                        {row.resolvedDatetime ? getCurrentTimeZone(row.resolvedDatetime) : 'N/A'}
                      </td>
                      <td>{row.closedDatetime ? getCurrentTimeZone(row.closedDatetime) : 'N/A'}</td>
                      <td>{row.createdUser}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='10' className='text-center text-muted'>
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {currentItems && currentItems.length > 0 && (
              <Pagination
                pageCount={Math.ceil(filteredList.length / itemsPerPage)}
                handlePageClick={handlePageClick}
                itemsPerPage={itemsPerPage}
                handlePageSelect={handlePageSelect}
                forcePage={activePage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
