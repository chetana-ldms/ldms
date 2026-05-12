import React, {useState, useRef, useEffect, Fragment} from 'react'
import RiskDetailsModal from './RiskDetailsModal'
import RiskWaiverEdit from './RiskWaiverEdit'
import {
  fetchfetchWaiversRequestSearchUrl,
  fetchApproveOrRejectUrl,
  fetchWaiverRequestDeleteUrl,
} from '../../../../../api/BreachRiskApi'
import useFeatureActions from '../configuration/useFeatureActions'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {truncateText} from '../../../../../../utils/TruncateText'
import {renderSortIcon, sortedItems} from '../../../../../../utils/Sorting'
import {notify, notifyFail} from '../components/notification/Notification'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import {fetchExportDataAddUrl, fetchMasterData} from '../../../../../api/Api'
import './RiskProfile.css'
import Pagination from '../../../../../../utils/Pagination'
import DeleteConfirmation2 from './DeleteConfirmation2'
import WaiverApprovalModal from './WaiverApprovalModal'

function RiskWaiver() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState({key: '', direction: 'ascending'})
  const [currentPage, setCurrentPage] = useState(0)
  const [activePage, setActivePage] = useState(0)
  const [loading, setLoading] = useState(false)
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [selectedAlert, setselectedAlert] = useState([])
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false)
  const [note, setNote] = useState('')
  const [selectedDays, setSelectedDays] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilterValue, setSelectedFilterValue] = useState(1)
  const status = useRef()
  const [showActionsDropdown, setShowActionsDropdown] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editRisk, setEditRisk] = useState(null)
  const [allWaiverRisks, setAllWaiverRisks] = useState([]) // State to hold all fetched risks
  const [expandedRows, setExpandedRows] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [deleteRisk, setDeleteRisk] = useState(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)

  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const [actionsValue, setActionValue] = useState('')
  const userID = Number(sessionStorage.getItem('userId'))
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const [dropdownData, setDropdownData] = useState({
    statusDropDown: [],
  })
  const {statusDropDown} = dropdownData

  useEffect(() => {
    const fetchNumberOfDays = async () => {
      try {
        const data = {maserDataType: 'Waived_reuest_duration_day', orgId, toolId}
        const response = await fetchMasterData(data)
        setSelectedDays(response)
      } catch (error) {
        console.log(error)
      }
    }
    fetchNumberOfDays()
  }, [])

  useEffect(() => {
    const fetchAllMasterData = async () => {
      const statusDataRequest = {maserDataType: 'Risk_Waiver_Request_Status', orgId, toolId}
      try {
        const statusData = await fetchMasterData(statusDataRequest)
        setDropdownData({
          statusDropDown: statusData,
        })
      } catch (error) {
        console.log(error)
      }
    }
    fetchAllMasterData()
  }, [])

  const getWaivers = async () => {
    const payload = {
      toolId: toolId,
      userId: userID,
      searchDurationInDays: selectedFilterValue || 0,
      orgId: orgId,
    }

    if (searchValue.trim()) {
      payload.searchText = searchValue.trim()
    }

    const statusId = status.current?.value
    if (statusId) {
      payload.statusId = Number(statusId)
    }

    try {
      setLoading(true)
      const response = await fetchfetchWaiversRequestSearchUrl(payload)
      setAllWaiverRisks(response.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getWaivers()
  }, [selectedFilterValue, refreshTrigger, itemsPerPage])

  // ─── Derived list ─────────────────────────────────────────────────────────

  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  const filteredList = sortedItems(allWaiverRisks || [], sortConfig)

  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem)

  // ─── Pagination handlers ──────────────────────────────────────────────────

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(0)
    setActivePage(0)
  }

  const handlePageClick = (data) => {
    setCurrentPage(data.selected)
    setActivePage(data.selected)
  }

  const handleFilterChange = (e) => {
    setSelectedFilterValue(Number(e.target.value))
    setCurrentPage(0)
    setActivePage(0)
  }

  // ─── Dropdown toggle helpers ──────────────────────────────────────────────

  const handleCloseAll = () => {
    setShowActionsDropdown(false)
  }

  const handleActions = () => {
    setShowActionsDropdown((prev) => !prev)
  }

  const handleToggleRow = (waiverId) => {
    setExpandedRows((prev) =>
      prev.includes(waiverId) ? prev.filter((id) => id !== waiverId) : [...prev, waiverId]
    )
  }

  // ─── Misc handlers ────────────────────────────────────────────────────────

  const isActionAuthorized = (actionName) =>
    featureActions?.some((a) => a.actionName === actionName && a.is_authorized === true)

  const handleRowClick = (risk) => {
    setSelectedRisk(risk)
    setShowModal(true)
  }

  // Opens the edit modal for a specific risk row
  const handleEditClick = (e, risk) => {
    e.stopPropagation() // prevent row-click / view modal from firing
    setEditRisk(risk)
    setShowEditModal(true)
  }

  const handleDelete = (risk) => {
    setDeleteRisk(risk)
    setShowDeleteConfirmation(true)
  }

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending',
    }))
  }
  const handleselectedAlert = (risk, e) => {
    const {value, checked} = e.target
    setselectedAlert((prev) => {
      const updated = checked ? [...prev, value] : prev.filter((id) => id !== value)
      setIsCheckboxSelected(updated.length > 0)
      return updated
    })
  }

  const handleNoteChange = (e) => setNote(e.target.value)

  const handleActionSelection = (e) => {
    const value = e.target.value
    setActionValue(value)
    if (value === 'Approve') {
      if (selectedAlert.length === 0) {
        notifyFail('Please select at least one waiver request.')
        setActionValue('')
        return
      }
      setShowApprovalModal(true)
      handleCloseAll()
      setActionValue('')
    } else if (value === 'Delete') {
      if (selectedAlert.length === 0) {
        notifyFail('Please select at least one waiver request to delete.')
        setActionValue('')
        return
      }
      setDeleteRisk(null)
      setShowDeleteConfirmation(true)
      handleCloseAll()
    }
  }

  // This function is called when the "Delete" button in DeleteConfirmation2 is clicked
  const handleDeleteConfirm = async (reason) => {
    try {
      setLoading(true)
      const idsToDelete = deleteRisk ? [Number(deleteRisk.waiverId)] : selectedAlert.map(Number)

      const payload = {
        toolId: toolId,
        waiverRequestIds: idsToDelete,
        userId: userID,
        reason: reason,
        deletedDate: new Date().toISOString(),
      }

      const response = await fetchWaiverRequestDeleteUrl(payload)
      if (response?.isSuccess) {
        notify(response.message)
        setShowDeleteConfirmation(false)
        setDeleteRisk(null)
        setActionValue('')
        setselectedAlert([])
        setIsCheckboxSelected(false)
        setRefreshTrigger((prev) => !prev)
      } else {
        notifyFail(response?.message || 'Failed to delete waiver requests.')
      }
    } catch (error) {
      console.error('Bulk delete failed:', error)
      notifyFail('An error occurred while deleting waiver requests.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchAlert = () => {
    setCurrentPage(0)
    setActivePage(0)
    getWaivers()
  }

  const exportToExcel = async () => {
    const dataToExport = filteredList || []
    let csvContent = 'Risk Report\n'
    csvContent +=
      'Severity,Finding,Risk Title,Category,First Detected,Assets,Status,Owner,Source\n' +
      dataToExport
        .map(
          (item) =>
            `${item.severityName},${item.finding},${item.riskTitle},${item.category},` +
            `${item.firstDetected},${item.assetCount},${item.statusName},${item.ownerName},${item.source}`
        )
        .join('\n')

    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'})
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'risk_report.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    try {
      await fetchExportDataAddUrl({
        createdDate: new Date().toISOString(),
        createdUserId: Number(sessionStorage.getItem('userId')),
        orgId: Number(sessionStorage.getItem('orgId')),
        exportDataType: 'Risks',
      })
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className='alert-page'>
      <ToastContainer />
      <div className='mb-1'>
        <div className='d-flex justify-content-between border-0'>
          <h3 className='align-items-start flex-column'>
            <span className='fw-bold fs-3'>
              Risk Waivers Request ({currentItems ? currentItems.length : 0} /{' '}
              {filteredList ? filteredList.length : 0})
            </span>
          </h3>
        </div>
      </div>

      <div className='clearfix' />

      <div className='card p-2'>
        <div className='row'>
          {/* ── Left controls ── */}
          <div className='col-md-7'>
            <div className='row'>
              <div className='card-toolbar float-left'>
                <div className='d-flex align-items-center gap-2 gap-lg-3'>
                  {/* ACTIONS */}
                  <div className='dropdown-wrapper'>
                    <button
                      className='btn btn-small fs-14 btn-green'
                      onClick={handleActions}
                      disabled={!isCheckboxSelected}
                    >
                      Actions
                    </button>
                    {showActionsDropdown && selectedAlert.length > 0 && (
                      <div className='alert-action'>
                        <div className='p-3'>
                          <div className='d-flex justify-content-end mb-2'>
                            <button
                              type='button'
                              className='btn-close'
                              aria-label='Close'
                              onClick={handleCloseAll}
                            />
                          </div>
                          <select onChange={handleActionSelection} className='form-select mb-2'>
                            <option value=''>Select</option>
                            <option value='Approve'>Approve</option>
                            <option value='Delete'>Delete</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Duration filter */}
                  <div className='mt-2 bd-highlight'>
                    <div className='w-100px me-0'>
                      <select
                        className='form-select form-select-sm'
                        value={selectedFilterValue}
                        onChange={handleFilterChange}
                      >
                        {selectedDays?.map((day, index) => (
                          <option key={index} value={day.dataValue}>
                            {day.dataName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='row mt-2'>
              <div className='d-flex'>
                <div className='export-report ms-2'>
                  <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
                    <DropdownToggle caret>
                      Export <i className='fa fa-file-export link mg-left-10' />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={exportToExcel}>
                        Export to CSV <i className='fa fa-file-excel link float-right' />
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right controls ── */}
          <div className='col-md-5'>
            <div className='card-title header-filter'>
              <div className='input-group'>
                <input
                  type='text'
                  className='form-control form-control-sm'
                  placeholder='Search Alert'
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button className='btn btn-sm btn-primary' onClick={handleSearchAlert}>
                  <i className='fas fa-search' />
                </button>
              </div>

              <div className='d-flex align-items-center gap-3 mb-1 mt-2'>
                <div className='w-150px'>
                  <select className='form-select form-select-sm' ref={status}>
                    <option value=''>Select Status</option>
                    {statusDropDown.map((item) => (
                      <option key={item.dataID} value={item.dataID}>
                        {item.dataValue}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th className='checkbox-th' />
              <th onClick={() => handleSort('waiverId')}>
                Waiver Id {renderSortIcon(sortConfig, 'waiverId')}
              </th>
              <th onClick={() => handleSort('reason')}>
                Reason {renderSortIcon(sortConfig, 'reason')}
              </th>
              <th onClick={() => handleSort('expiryDate')}>
                Expiry Date {renderSortIcon(sortConfig, 'expiryDate')}
              </th>
              <th onClick={() => handleSort('statusName')}>
                Status {renderSortIcon(sortConfig, 'statusName')}
              </th>
               <th onClick={() => handleSort('requestedByUserName')}>
                Requested By {renderSortIcon(sortConfig, 'requestedByUserName')}
              </th>
               <th onClick={() => handleSort('assignedApproverUserName')}>
                Assigned Approver {renderSortIcon(sortConfig, 'assignedApproverUserName')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {currentItems?.map((risk) => (
              <Fragment key={risk.waiverId}>
                <tr
                  className='fs-12 table-row'
                  style={{cursor: 'pointer'}}
                  onClick={() => handleRowClick(risk)}
                >
                <td>
                  <div className='form-check form-check-sm form-check-custom form-check-solid px-3'>
                    <input
                      className='form-check-input widget-13-check'
                      type='checkbox'
                      value={risk.waiverId}
                      name={risk.waiverId}
                      checked={selectedAlert.includes(String(risk.waiverId))}
                      onChange={(e) => handleselectedAlert(risk, e)}
                      disabled={risk.active !== 1 || risk.statusName !== 'Pending'}
                      onClick={(e) => e.stopPropagation()}
                      autoComplete='off'
                    />
                  </div>
                </td>
                <td>
                  <div className='sev-icon'>{risk.waiverId}</div>
                </td>
                <td>
                  <div title={risk.reason} className='fw-semibold'>
                    {truncateText(risk.reason, 30)}
                  </div>
                  <div title={risk.riskTitle} className='text-muted small'>
                    {truncateText(risk.riskTitle, 15)}
                  </div>
                </td>
                <td>{getCurrentTimeZone(risk.expiryDate)}</td>
                <td>{risk.statusName}</td>
                <td>{risk.requestedByUserName}</td>
                <td>{risk.assignedApproverUserName}</td>
                <td>
                  {/* ── Edit ── */}
                  {isActionAuthorized('Update') && !(risk.active !== 1 || risk.statusName !== 'Pending') ? (
                    <span
                      title='Edit'
                      onClick={(e) => handleEditClick(e, risk)}
                      style={{cursor: 'pointer'}}
                    >
                      <i className='fa fa-pencil cursor link' />
                    </span>
                  ) : (
                    <span title='Edit'>
                      <i className='fa fa-pencil disabled' />
                    </span>
                  )}

                  {/* ── Delete ── */}
                  {isActionAuthorized('Delete') && !(risk.active !== 1 || risk.statusName !== 'Pending') ? (
                    <span
                      className='ms-8'
                      title='Delete'
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(risk)
                      }}
                    >
                      <i className='fa fa-trash cursor red' />
                    </span>
                  ) : (
                    <span className='ms-8' title='Delete'>
                      <i className='fa fa-trash disabled' />
                    </span>
                  )}

                  {/* Accordion Toggle Icon */}
                  <i
                    className={`fa fa-chevron-${expandedRows.includes(risk.waiverId) ? 'down' : 'right'} ms-8 cursor-pointer text-primary`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleRow(risk.waiverId)
                    }}
                  />
                </td>
                </tr>
                {/* Accordion Detail Row */}
                {expandedRows.includes(risk.waiverId) && (
                  <tr className='bg-light'>
                    <td colSpan='8' className='ps-15'>
                      <div className='p-4 border-start border-primary border-4'>
                        <h6 className='fw-bold fs-7 mb-3 text-dark'>Waiver Items Details</h6>
                        {risk.items && risk.items.length > 0 ? (
                          <div className='table-responsive'>
                            <table className='table table-bordered table-sm fs-7 bg-white mb-0'>
                              <thead className='table-light'>
                                <tr>
                                  <th>Risk ID</th>
                                  <th>Risk Title</th>
                                  <th>Asset Name</th>
                                </tr>
                              </thead>
                              <tbody>
                                {risk.items.map((item) => (
                                  <tr key={item.waiverItemId}>
                                    <td>{item.riskId}</td>
                                    <td style={{width: '60%'}}>{item.riskTitle}</td>
                                    <td>{item.assetName}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <span className='text-muted fs-7 fst-italic'>No items found in this request.</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        <RiskWaiverEdit
          show={showEditModal}
          onHide={() => {
            setShowEditModal(false)
            setEditRisk(null)
          }}
          risk={editRisk}
          onSuccess={() => getWaivers()}
        />

        <WaiverApprovalModal
          show={showApprovalModal}
          onHide={() => setShowApprovalModal(false)}
          waiverRequestIds={selectedAlert}
          onSuccess={() => {
            setselectedAlert([])
            setIsCheckboxSelected(false)
            setRefreshTrigger((prev) => !prev)
          }}
        />

        <DeleteConfirmation2
          show={showDeleteConfirmation}
          message={`Are you sure you want to delete ${selectedAlert.length} waiver request(s)?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteConfirmation(false)
            setDeleteRisk(null)
          }}
        />

        {allWaiverRisks && (
          <Pagination
            pageCount={Math.ceil(filteredList.length / itemsPerPage)}
            handlePageClick={handlePageClick}
            itemsPerPage={itemsPerPage}
            handlePageSelect={handlePageSelect}
            forcePage={activePage}
          />
        )}
      </div>
    </div>
  )
}

export default RiskWaiver
