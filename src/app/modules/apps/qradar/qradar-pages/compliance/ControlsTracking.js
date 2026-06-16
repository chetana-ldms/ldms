import React, {useState, useEffect, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import {useErrorBoundary} from 'react-error-boundary'
import Pagination from '../../../../../../utils/Pagination'
import useFeatureActions from '../configuration/useFeatureActions'
import {
  fetchControlsTrackingUrl,
  fetchControlsUpdateStatusUrl,
} from '../../../../../api/ComplianceApi'
import {fetchMasterData} from '../../../../../api/Api'
import ControlsAssignmentModal from './ControlsAssignmentModal'

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
  const [statusDropDown, setStatusDropDown] = useState([])
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)

  const [initialAssignmentsForModal, setInitialAssignmentsForModal] = useState([]) // New state for initial assignments
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))
  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const reload = async () => {
    try {
      setLoading(true)
      const payload = {
        orgId,
        projectId : 1,
      }
      const res = await fetchControlsTrackingUrl(payload)
      setControls(Array.isArray(res?.data) ? res.data : [])
    } catch (e) {
      handleError(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const data = await fetchMasterData({
          maserDataType: 'compliance_control_status',
          orgId,
          toolId,
        })
        setStatusDropDown(data || [])
      } catch (error) {
        console.error('Error fetching status master data:', error)
      }
    }
    fetchStatusData()
  }, [orgId, toolId])

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
    const currentPageIds = currentItems.map((item) => item.trackingId)
    if (e.target.checked) {
      setSelectedTrackingIds((prev) => Array.from(new Set([...prev, ...currentPageIds])))
    } else {
      setSelectedTrackingIds((prev) => prev.filter((id) => !currentPageIds.includes(id)))
    }
  }

  const handleSubmitStatus = async () => {
    if (!selectedStatus) {
      notifyFail('Please select a status')
      return
    }
    try {
      setLoading(true)
      const userId = Number(sessionStorage.getItem('userId'))

      const response = await fetchControlsUpdateStatusUrl({
        trackingIds: selectedTrackingIds.map(Number),
        statusId: Number(selectedStatus),
        userId: userId,
      })

      if (response?.isSuccess) {
        notify('Status updated successfully')
        setSelectedTrackingIds([])
        setShowStatusDropdown(false)
        setSelectedStatus('')
        reload()
      } else {
        notifyFail('Update failed')
      }
    } catch (e) {
      handleError(e)
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    if (filteredControls.length === 0) return
    const headers = [
      'Control Code',
      'Control Name',
      'Domain',
      'Status',
      'Modified Date',
      'Modified User',
    ]
    const rows = filteredControls.map((item) => [
      item.controlCode,
      `"${item.controlName}"`,
      item.domainName,
      item.statusName,
      item.modifiedDate,
      item.modifiedUser,
    ])

    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n')
    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'})
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'controls_tracking.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredControls = controls.filter((item) =>
    item.searchText?.toLowerCase().includes(searchValue.toLowerCase())
  )

  const currentItems = filteredControls.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  return (
    <div className='config card pad-10'>
      <ToastContainer />
      <div className='row align-items-center mb-5'>
        <div className='col-md-3'>
          <h3 className='card-label fw-bold fs-3 mb-0 text-nowrap'>
            Controls Tracking ({filteredControls.length})
          </h3>
        </div>
        <div className='col-md-3 d-flex gap-2 justify-content-start align-items-center'>
          <button
            className='btn btn-small fw-bold fs-14 btn-green'
            disabled={selectedTrackingIds.length === 0}
            onClick={async () => {
              if (selectedTrackingIds.length === 1) {
                setLoading(true)
                try {
                  const res = await fetchControlsTrackingUrl({
                    orgId,
                    projectId: 1,
                    trackingId: selectedTrackingIds[0],
                  })
                  setInitialAssignmentsForModal(res?.data?.[0]?.assignments || [])
                } catch (error) {
                  console.error('Error fetching assignment details:', error)
                } finally {
                  setLoading(false)
                }
              } else {
                setInitialAssignmentsForModal([])
              }
              setShowAssignmentModal(true)
            }}
          >
            Assign To
          </button>
          <ControlsAssignmentModal
            show={showAssignmentModal}
            handleClose={() => setShowAssignmentModal(false)}
            selectedTrackingIds={selectedTrackingIds}
            orgId={orgId}
            initialAssignments={initialAssignmentsForModal} // Pass initial assignments
            onSuccess={() => {
              setInitialAssignmentsForModal([]) // Clear initial assignments after success
              setSelectedTrackingIds([])
              reload()
            }}
          />
          <div className='dropdown-wrapper position-relative'>
            <button
              className='btn btn-small fw-bold fs-14 btn-green'
              disabled={selectedTrackingIds.length === 0}
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              Status
            </button>
            {showStatusDropdown && (
              <div
                className='alert-action shadow'
                style={{
                  position: 'absolute',
                  right: 0,
                  zIndex: 1050,
                  background: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginTop: '5px',
                  padding: '10px',
                  width: '250px',
                }}
              >
                <div className='d-flex justify-content-end mb-2'>
                  <button
                    type='button'
                    className='btn-close'
                    onClick={() => setShowStatusDropdown(false)}
                  />
                </div>
                <select
                  className='form-select form-select-sm mb-3'
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value=''>Select Status</option>
                  {statusDropDown.map((item) => (
                    <option key={item.dataID} value={item.dataID}>
                      {item.dataValue}
                    </option>
                  ))}
                </select>
                <button className='btn btn-sm btn-primary w-100' onClick={handleSubmitStatus}>
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
        <div className='col-md-5 d-flex gap-2 justify-content-end align-items-center'>
          <div className='input-group'>
            <input
              type='text'
              className='form-control form-control-sm border-end-0'
              placeholder='Search by Control Name...'
              value={searchValue}
              onChange={handleSearchChange}
            />
            <button className='btn btn-sm btn-primary' onClick={reload}>
              <i className='fas fa-search' />
            </button>
          </div>
        </div>
        <div className='col-md-1 d-flex gap-2 justify-content-end align-items-center'>
          <button className='btn btn-sm btn-secondary' onClick={handleExportCSV}>
            Export
          </button>
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
                    checked={
                      currentItems.length > 0 &&
                      currentItems.every((item) => selectedTrackingIds.includes(item.trackingId))
                    }
                  />
                </div>
              </th>
              <th>Control Code</th>
              <th>Control Name</th>
              <th>Domain</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {currentItems.map((item) => (
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
                  <td>
                    <span
                      className='me-5'
                      title='Details'
                      onClick={() => toggleRow(item.trackingId)}
                    >
                      <i
                        className={`fa ${
                          expandedId === item.trackingId ? 'fa-chevron-up' : 'fa-chevron-down'
                        } cursor`}
                      />
                    </span>
                    
                    <span
                      className='me-2'
                      title='Edit Assignment'
                      onClick={() => {
                        const fetchSingle = async () => {
                          setLoading(true)
                          try {
                            const res = await fetchControlsTrackingUrl({
                              orgId,
                              projectId: 1,
                              trackingId: item.trackingId,
                            })
                            setInitialAssignmentsForModal(res?.data?.[0]?.assignments || [])
                            setSelectedTrackingIds([item.trackingId])
                            setShowAssignmentModal(true)
                          } catch (error) {
                            console.error('Error fetching assignment details:', error)
                          } finally {
                            setLoading(false)
                          }
                        }
                        fetchSingle()
                      }}
                    >
                      <i className='fa fa-edit text-primary cursor' />
                    </span>
                  </td>
                </tr>
                {expandedId === item.trackingId && (
                  <tr className='bg-light fs-12'>
                    <td colSpan={6}>
                      <div className='p-5'>
                        <div className='mb-2'>
                          <strong>Control Description:</strong> {item.controlDescription || '-'}
                        </div>

                        <div className='mt-4'>
                          <strong className='d-block mb-2'>Assignments:</strong>
                          {item.assignments && item.assignments.length > 0 ? (
                            <div className='table-responsive'>
                              <table className='table table-sm table-bordered mb-0'>
                                <thead>
                                  <tr className='bg-light text-muted fw-bold fs-11'>
                                    <th className='ps-2'>User Name</th>
                                    <th className='ps-2'>Role</th>
                                    <th className='ps-2'>Primary</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.assignments.map((assign) => (
                                    <tr key={assign.assignmentId} className='fs-11'>
                                      <td className='ps-2'>{assign.userName}</td>
                                      <td className='ps-2'>{assign.roleTypeName}</td>
                                      <td className='ps-2'>{assign.isPrimary ? 'Yes' : 'No'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className='text-muted fs-11 ms-2'>No assignments found.</div>
                          )}
                        </div>
                        {/* <div><strong>Remarks:</strong> {item.remarks || '-'}</div> */}
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
            handlePageClick={(p) => {
              setCurrentPage(p.selected)
              setActivePage(p.selected)
              setExpandedId(null)
            }}
            itemsPerPage={itemsPerPage}
            handlePageSelect={(e) => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(0)
              setExpandedId(null)
            }}
            forcePage={activePage}
          />
        )}
      </div>
    </div>
  )
}

export default ControlsTracking
