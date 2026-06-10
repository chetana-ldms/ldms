
import React, {useState, useEffect, useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import {useErrorBoundary} from 'react-error-boundary'
import Pagination from '../../../../../../utils/Pagination'
import useFeatureActions from '../configuration/useFeatureActions'
import {fetchControlsTrackingUrl} from '../../../../../api/ComplianceApi'

const ControlsTracking = () => {
  const navigate = useNavigate()
  const handleError = useErrorBoundary()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))

  const [loading, setLoading] = useState(false)
  const [controls, setControls] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activePage, setActivePage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [selectedTrackingIds, setSelectedTrackingIds] = useState([])
  const [expandedId, setExpandedId] = useState(null)

  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))
  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const reload = async () => {
    try {
      setLoading(true)
      const res = await fetchControlsTrackingUrl()
      setControls(Array.isArray(res?.data) ? res.data : [])
    } catch (e) { handleError(e) } finally { setLoading(false) }
  }

  useEffect(() => { reload() }, [])

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value)
    setCurrentPage(0)
    setActivePage(0)
    setSelectedTrackingIds([])
  }

  const toggleRow = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleCheckboxChange = (id) => {
    setSelectedTrackingIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTrackingIds(currentItems.map((item) => item.trackingId))
    } else {
      setSelectedTrackingIds([])
    }
  }

  const handleExportCSV = () => {
    if (filteredControls.length === 0) return
    const headers = ['Control Code', 'Control Name', 'Domain', 'Status', 'Modified Date', 'Modified User']
    const rows = filteredControls.map(item => [
      item.controlCode,
      `"${item.controlName}"`,
      item.domainName,
      item.statusName,
      item.modifiedDate,
      item.modifiedUser
    ])

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "controls_tracking.csv")
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredControls = controls.filter((item) =>
    item.controlName?.toLowerCase().includes(searchValue.toLowerCase())
  )

  const currentItems = filteredControls.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  return (
    <div className='config card pad-10'>
      <ToastContainer />
      <div className='row align-items-center g-3'>
        <div className='col-md-4'>
          <h3 className='card-label fw-bold fs-3 mb-0 text-nowrap'>
            Controls Tracking ({filteredControls.length})
          </h3>
        </div>
        <div className='col-md-4 d-flex gap-2 justify-content-center'>
          <button
            className='btn btn-sm btn-primary'
            disabled={selectedTrackingIds.length === 0}
            onClick={() => console.log('Status Update for:', selectedTrackingIds)}
          >
            Status
          </button>
          <button
            className='btn btn-sm btn-secondary'
            onClick={handleExportCSV}
          >
            Export
          </button>
        </div>
        <div className='col-md-4'>
          <div className='input-group'>
            <input
              type='text'
              className='form-control form-control-sm'
              placeholder='Search by Control Name...'
              value={searchValue}
              onChange={handleSearchChange}
            />
            <button className='btn btn-sm btn-primary' onClick={reload}>
              <i className='fas fa-search' />
            </button>
          </div>
        </div>
      </div>

      <div className='card-body no-pad mt-3'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th className='w-25px'>
                <div className='form-check form-check-sm form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    onChange={handleSelectAll}
                    checked={currentItems.length > 0 && selectedTrackingIds.length === currentItems.length}
                  />
                </div>
              </th>
              <th>Control Code</th>
              <th>Control Name</th>
              <th>Domain</th>
              <th>Status</th>
              <th>Modified Date</th>
              <th>Modified User</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {currentItems.map(item => (
              <React.Fragment key={item.trackingId}>
                <tr className='fs-12'>
                  <td>
                    <div className='form-check form-check-sm form-check-custom form-check-solid'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        checked={selectedTrackingIds.includes(item.trackingId)}
                        onChange={() => handleCheckboxChange(item.trackingId)}
                      />
                    </div>
                  </td>
                  <td>{item.controlCode}</td>
                  <td>{item.controlName}</td>
                  <td>{item.domainName}</td>
                  <td>{item.statusName}</td>
                  <td>{item.modifiedDate}</td>
                  <td>{item.modifiedUser}</td>
                  <td>
                    <span className='me-5' title='Details' onClick={() => toggleRow(item.trackingId)}>
                      <i className={`fa ${expandedId === item.trackingId ? 'fa-chevron-up' : 'fa-chevron-down'} cursor`} />
                    </span>
                    <Link className='text-white me-5' to={`/qradar/compliance/controls-tracking/update/${item.trackingId}`} title='Edit'>
                      <i className='fa fa-pencil cursor link' />
                    </Link>
                  </td>
                </tr>
                {expandedId === item.trackingId && (
                  <tr className='bg-light fs-12'>
                    <td colSpan={8}>
                      <div className='p-5'>
                        <div className='mb-2'><strong>Control Description:</strong> {item.controlDescription || '-'}</div>
                        <div><strong>Remarks:</strong> {item.remarks || '-'}</div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {filteredControls.length > 0 && (
          <Pagination
            pageCount={Math.ceil(filteredControls.length / itemsPerPage)}
            handlePageClick={p => { setCurrentPage(p.selected); setActivePage(p.selected); setSelectedTrackingIds([]); setExpandedId(null); }}
            itemsPerPage={itemsPerPage}
            handlePageSelect={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(0); setSelectedTrackingIds([]); setExpandedId(null); }}
            forcePage={activePage}
          />
        )}
      </div>
    </div>
  )
}

export default ControlsTracking