import React, {useState, useEffect} from 'react'
import {
  fetchOrganizationToolsDetailsUrl,
  fetchMasterData,
  fetchUsersByOrgTool,
  fetchIncidentReportTypesUrl,
  fetchIncidentReportDataUrl,
} from '../../../../../api/IncidentsApi'

export default function IncidentReport() {
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
  console.log('tableData', tableData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchOrganizationToolsDetailsUrl(Number(sessionStorage.getItem('orgId')))
      .then((data) => setTools([{toolID: -1, toolName: 'Internal Incident'}, ...data]))
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
  useEffect(() => {
    if (!reportType) {
      setTableData([])
      return
    }
    const payload = {
      fromDate: new Date(startDate).toISOString(),
      toDate: new Date(endDate).toISOString(),
      orgId: Number(sessionStorage.getItem('orgId')),
      toolId: Number(toolID) || 0,
      reportTypeId: Number(reportType),
      statusId: Number(status) || 0,
      ownerUserId: Number(owner) || 0,
      priorityId: Number(priority) || 0,
    }
    setLoading(true)
    fetchIncidentReportDataUrl(payload)
      .then((data) => setTableData(data?.data || []))
      .catch(() => setTableData([]))
      .finally(() => setLoading(false))
  }, [startDate, endDate, toolID, status, priority, owner, reportType])
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
  return (
    <div className='card p-4'>
      <h4 className='mb-4'>Incident Report Filters</h4>
      <div className='row g-3 align-items-center'>
        <div className='col-md-2'>
          <label className='form-label'>From</label>
          <input
            type='date'
            className='form-control form-control-sm'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate}
          />
        </div>
        <div className='col-md-2'>
          <label className='form-label'>To</label>
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
          <select
            className='form-select form-select-sm'
            value={toolID}
            onChange={(e) => setToolID(e.target.value)}
          >
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
              <option key={item.dataID} value={item.dataValue}>
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
              <option key={item.dataID} value={item.dataValue}>
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
      </div>
      <div className='mt-4'>
        {loading ? (
          <div>Loading...</div>
        ) : tableData && tableData.length > 0 ? (
          <div className='table-responsive'>
            <table className='table table-bordered table-sm'>
              <thead>
                <tr>
                  <th>Incident ID</th>
                  <th>Title / Subject</th>
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
                {tableData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.incidentID}</td>
                    <td>{row.title || row.subject}</td>
                    <td>{row.incidentStatusName}</td>
                    <td>{row.priorityName}</td>
                    <td>{row.ownerName}</td>
                    <td>{row.createdDate}</td>
                    <td>{row.resolutionDueDatetime?row.resolutionDueDatetime:"N/A"}</td>
                    <td>{row.resolvedDatetime?row.resolvedDatetime:"N/A"}</td>
                    <td>{row.closedDatetime?row.closedDatetime:"N/A"}</td>
                    <td>{row.createdUser}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>No data found</div>
        )}
      </div>
    </div>
  )
}
