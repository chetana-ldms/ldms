import React, {useState, useRef, useEffect, Fragment} from 'react'
import RiskDetailsModal from './RiskDetailsModal'
import RiskEditModal from './RiskEditModal'
import RiskDeleteModal from './RiskDeleteModal'
import {
  fetchcreateRemediateRequestUrl,
  fetchRisks,
  fetchSyncRisksUrl,
  fetchupdateRisksUrl,
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
import ReactPaginate from 'react-paginate'
import './RiskProfile.css'
import {fetchUsersByOrgTool} from '../../../../../api/IncidentsApi'
import {useNavigate} from 'react-router-dom'
import RiskWaiverModal from './RiskWaiverModal'
import RiskRevokeModel from './RiskRevokeModel'

function RiskProfile() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [tools, setTools] = useState([])
  const [sortConfig, setSortConfig] = useState({key: '', direction: 'ascending'})
  const [showUsersDropdown, setShowUsersDropdown] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [activePage, setActivePage] = useState(1)
  const [loading, setLoading] = useState(false)
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [selectedAlert, setselectedAlert] = useState([])
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false)
  const [note, setNote] = useState('')
  const [selectedDays, setSelectedDays] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilterValue, setSelectedFilterValue] = useState(1)
  const status = useRef()
  const severity = useRef()
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showSeverityDropdown, setShowSeverityDropdown] = useState(false)
  const [showActionsDropdown, setShowActionsDropdown] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editRisk, setEditRisk] = useState(null)
  const [showWaiverModal, setShowWaiverModal] = useState(false)
  const [isWaived, setIsWaived] = useState(false)
  const [expandedRows, setExpandedRows] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAssignedToDropdown, setShowAssignedToDropdown] = useState(false)
  const [showRevokeModal, setShowRevokeModal] = useState(false)
  const [deleteRisk, setDeleteRisk] = useState(null)

  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const [actionsValue, setActionValue] = useState('')
  const userID = Number(sessionStorage.getItem('userId'))

  const [ldp_security_user, setldp_security_user] = useState([])
  const [pageCount, setpageCount] = useState(0)
  const [alertsCount, setAlertsCount] = useState(0)
  const [limit, setLimit] = useState(10)
  const [selectedSeverity, setSelectedSeverity] = useState('')
  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const [dropdownData, setDropdownData] = useState({
    severityNameDropDownData: [],
    statusDropDown: [],
  })
  const {severityNameDropDownData, statusDropDown} = dropdownData
  const navigate = useNavigate()
  useEffect(() => {
    const fetchNumberOfDays = async () => {
      try {
        const data = {maserDataType: 'Risk_Searchdata_duration', orgId, toolId}
        const response = await fetchMasterData(data)
        setSelectedDays(response)
      } catch (error) {
        console.log(error)
      }
    }
    fetchNumberOfDays()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchUsersByOrgTool(orgId, toolId, userID)
        setldp_security_user(response?.usersList ?? [])
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchAllMasterData = async () => {
      const severityDataRequest = {maserDataType: 'Risk_Severity', orgId, toolId}
      const statusDataRequest = {maserDataType: 'Risk_Status', orgId, toolId}
      try {
        const [severityData, statusData] = await Promise.all([
          fetchMasterData(severityDataRequest),
          fetchMasterData(statusDataRequest),
        ])
        setDropdownData({
          severityNameDropDownData: severityData,
          statusDropDown: statusData,
        })
      } catch (error) {
        console.log(error)
      }
    }
    fetchAllMasterData()
  }, [])

  const getRisks = async (page = 1, duration = selectedFilterValue, search = searchValue) => {
    const safePage = page <= 0 ? 1 : page
    const payload = {
      orgId,
      toolId,
      paging: {
        rangeStart: (safePage - 1) * limit + 1,
        rangeEnd: safePage * limit,
      },
      statusId: status.current?.value || 0,
      severityId: severity.current?.value || 0,
      userId: userID || 0,
      searchDurationInDays: duration || 0,
      searchText: search || '',
    }
    if (isWaived) {
      payload.isWaived = isWaived || false
    }

    try {
      setLoading(true)
      const response = await fetchRisks(payload)
      setAlertsCount(response.riskCount)
      setTools(response.data || [])
      setpageCount(Math.ceil(response.riskCount / limit))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getRisks(currentPage + 1, selectedFilterValue, searchValue)
  }, [currentPage, limit, selectedFilterValue])

  // ─── Derived list ─────────────────────────────────────────────────────────

  const filteredList = sortedItems(tools || [], sortConfig)

  // ─── Pagination handlers ──────────────────────────────────────────────────

  const handlePageSelect = (event) => {
    setLimit(Number(event.target.value))
    setCurrentPage(0)
    setActivePage(1)
  }

  const handlePageClick = (data) => {
    setCurrentPage(data.selected)
    setActivePage(data.selected + 1)
  }

  const handleFilterChange = (e) => {
    setSelectedFilterValue(Number(e.target.value))
    setCurrentPage(0)
    setActivePage(1)
  }

  // ─── Dropdown toggle helpers ──────────────────────────────────────────────

  const handleCloseAll = () => {
    setShowUsersDropdown(false)
    setShowStatusDropdown(false)
    setShowSeverityDropdown(false)
    setShowActionsDropdown(false)
    setShowAssignedToDropdown(false)
  }

  const handleStatus = () => {
    setShowStatusDropdown((prev) => !prev)
    setShowSeverityDropdown(false)
    setShowUsersDropdown(false)
    setShowActionsDropdown(false)
    setShowAssignedToDropdown(false)
  }

  const handleSeverity = () => {
    setShowSeverityDropdown((prev) => !prev)
    setShowStatusDropdown(false)
    setShowUsersDropdown(false)
    setShowActionsDropdown(false)
    setShowAssignedToDropdown(false)
  }

  const handleActions = () => {
    setShowActionsDropdown((prev) => !prev)
    setShowUsersDropdown(false)
    setShowStatusDropdown(false)
    setShowSeverityDropdown(false)
    setShowAssignedToDropdown(false)
  }

  const handleUsers = () => {
    setShowUsersDropdown((prev) => !prev)
    setShowStatusDropdown(false)
    setShowSeverityDropdown(false)
    setShowActionsDropdown(false)
    setShowAssignedToDropdown(false)
  }

  const handleAssignedTo = () => {
    setShowAssignedToDropdown((prev) => !prev)
    setShowUsersDropdown(false)
    setShowStatusDropdown(false)
    setShowSeverityDropdown(false)
    setShowActionsDropdown(false)
  }

  const handleToggleRow = (riskId) => {
    setExpandedRows((prev) =>
      prev.includes(riskId) ? prev.filter((id) => id !== riskId) : [...prev, riskId]
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
    setShowDeleteModal(true)
  }

  const handleActionDelete = () => {
    if (selectedAlert.length === 0) {
      notifyFail('Please select at least one risk to delete.')
      return
    }
    setShowDeleteModal(true)
    handleCloseAll()
  }

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending',
    }))
  }

  const handleSync = async () => {
    try {
      setLoading(true)
      const response = await fetchSyncRisksUrl({orgId, toolId})
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        await getRisks(currentPage + 1, selectedFilterValue, searchValue)
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleselectedAlert = (risk, e) => {
    const {value, checked} = e.target
    setselectedAlert((prev) => {
      const updated = checked ? [...prev, value] : prev.filter((id) => id !== value)
      setIsCheckboxSelected(updated.length > 0)
      return updated
    })
  }

  const handleUserChange = (e) => setSelectedUser(e.target.value)

  const handleStatusDropDown = (e) => setSelectedStatus(e.target.value)

  const handleNoteChange = (e) => setNote(e.target.value)

  const createIncidentSubmit = (e) => {
    const value = e.target.value
    setActionValue(value)
    if (value === '4') {
      if (selectedAlert.length === 0) {
        notifyFail('Please select at least one risk to delete.')
        return
      }
      handleCloseAll()
      setDeleteRisk(null)
      setShowDeleteModal(true)
    } else if (value === '5') {
      if (selectedAlert.length === 0) {
        notifyFail('Please select at least one risk to waive.')
        return
      }
      handleCloseAll()
      setShowWaiverModal(true)
    } else if (value === '6') {
      if (selectedAlert.length === 0) {
        notifyFail('Please select at least one risk to revoke.')
        return
      }
      handleCloseAll()
      setShowRevokeModal(true)
    }
  }

  const handleSubmitUpdate = async ({statusId, severityId, ownerUserId, assignedToUserId}) => {
    try {
      const modifiedUserId = Number(sessionStorage.getItem('userId'))
      const payload = {
        orgId,
        toolId,
        modifiedUserId,
        riskIds: selectedAlert.map(Number),
        comment: note || '',
        modifiedDate: new Date().toISOString(),
      }
      if (statusId) payload.statusId = Number(statusId)
      if (severityId) payload.severityId = Number(severityId)
      if (ownerUserId) payload.ownerUserId = Number(ownerUserId)
      if (assignedToUserId) payload.assignedToUserId = Number(assignedToUserId)

      const response = await fetchupdateRisksUrl(payload)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        handleCloseAll()
        setNote('')
        setSelectedStatus('')
        setSelectedUser('')
        setIsCheckboxSelected(false)
        setselectedAlert([])
        getRisks(currentPage + 1, selectedFilterValue, searchValue)
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSearchAlert = () => {
    setCurrentPage(0)
    setActivePage(1)
    getRisks(1, selectedFilterValue, searchValue)
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
  useEffect(() => {
    if (actionsValue === '1' && selectedAlert.length > 0) {
      const data = {
        riskIds: selectedAlert.map(Number),
        toolId: toolId,
        orgId: orgId,
        createdDate: new Date().toISOString(),
        createdUserId: userID,
      }
      fetchcreateRemediateRequestUrl(data).then((response) => {
        if (response.isSuccess) {
          notify('Remediate Request Created')
          setActionValue('')
          setTimeout(() => {
            navigate('/qradar/incidents', {state: {toolId: toolId}})
          }, 2000)
        } else {
          notifyFail('Failed to Create Remediate Request')
          setActionValue('')
        }
      })
    }
  }, [actionsValue])
  return (
    <div className='alert-page'>
      <ToastContainer />
      <div className='mb-1'>
        <div className='d-flex justify-content-between border-0'>
          <h3 className='align-items-start flex-column'>
            <span className='fw-bold fs-3'>
              Risks({filteredList ? filteredList.length : 0} / {alertsCount || 0})
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
                  {/* STATUS */}
                  <div className='dropdown-wrapper'>
                    <button
                      className='btn btn-small fw-bold fs-14 btn-green'
                      onClick={handleStatus}
                      disabled={!isCheckboxSelected}
                    >
                      Status
                    </button>
                    {showStatusDropdown && (
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
                          <select className='form-select mb-2' onChange={handleStatusDropDown}>
                            <option value=''>Select</option>
                            {statusDropDown.map((item) => (
                              <option key={item.dataID} value={item.dataID}>
                                {item.dataValue}
                              </option>
                            ))}
                          </select>
                          <textarea
                            className='form-control mb-2'
                            placeholder='Write note...'
                            onChange={handleNoteChange}
                          />
                          <button
                            className='btn btn-sm btn-primary w-100'
                            onClick={() => handleSubmitUpdate({statusId: selectedStatus})}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SEVERITY */}
                  <div className='dropdown-wrapper'>
                    <button
                      className='btn btn-small fw-bold fs-14 btn-green'
                      onClick={handleSeverity}
                      disabled={!isCheckboxSelected}
                    >
                      Severity
                    </button>
                    {showSeverityDropdown && (
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
                          <select
                            className='form-select mb-2'
                            value={selectedSeverity}
                            onChange={(e) => setSelectedSeverity(e.target.value)}
                          >
                            <option value=''>Select</option>
                            {severityNameDropDownData.map((item) => (
                              <option key={item.dataID} value={item.dataID}>
                                {item.dataValue}
                              </option>
                            ))}
                          </select>
                          <textarea
                            className='form-control mb-2'
                            placeholder='Write note...'
                            onChange={handleNoteChange}
                          />
                          <button
                            className='btn btn-sm btn-primary w-100'
                            onClick={() => handleSubmitUpdate({severityId: selectedSeverity})}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* OWNER */}
                  <div className='dropdown-wrapper'>
                    <button
                      className='btn btn-small fw-bold fs-14 btn-green'
                      onClick={handleUsers}
                      disabled={!isCheckboxSelected}
                    >
                      Owner
                    </button>
                    {showUsersDropdown && (
                      <div className='alert-action'>
                        <div className='p-3'>
                          <div className='d-flex justify-content-end mb-2'>
                            <button type='button' className='btn-close' onClick={handleCloseAll} />
                          </div>
                          <select
                            className='form-select mb-2'
                            value={selectedUser}
                            onChange={handleUserChange}
                          >
                            <option value=''>Select</option>
                            {ldp_security_user?.map((user, index) => (
                              <option key={index} value={user.userID}>
                                {user.name}
                              </option>
                            ))}
                          </select>
                          <textarea
                            className='form-control mb-2'
                            placeholder='Write note...'
                            onChange={handleNoteChange}
                          />
                          <button
                            className='btn btn-sm btn-primary w-100'
                            onClick={() => handleSubmitUpdate({ownerUserId: selectedUser})}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                    <div className='dropdown-wrapper'>
                    <button
                      className='btn btn-small fw-bold fs-14 btn-green'
                      onClick={handleAssignedTo}
                      disabled={!isCheckboxSelected}
                    >
                      Assigned To
                    </button>
                    {showAssignedToDropdown && (
                      <div className='alert-action'>
                        <div className='p-3'>
                          <div className='d-flex justify-content-end mb-2'>
                            <button type='button' className='btn-close' onClick={handleCloseAll} />
                          </div>
                          <select
                            className='form-select mb-2'
                            value={selectedUser}
                            onChange={handleUserChange}
                          >
                            <option value=''>Select</option>
                            {ldp_security_user?.map((user, index) => (
                              <option key={index} value={user.userID}>
                                {user.name}
                              </option>
                            ))}
                          </select>
                          <textarea
                            className='form-control mb-2'
                            placeholder='Write note...'
                            onChange={handleNoteChange}
                          />
                          <button
                            className='btn btn-sm btn-primary w-100'
                            onClick={() => handleSubmitUpdate({assignedToUserId: selectedUser})}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

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
                          <select onChange={createIncidentSubmit} className='form-select mb-2'>
                            <option value=''>Select</option>
                            <option value='1'>Create Remediate Request</option>
                            <option value='5'>Create waiver risks Request</option>
                            <option value='6'>Waiver Revoke</option>
                            <option value='4'>Delete</option>
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
                  placeholder='Search Risk'
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button className='btn btn-sm btn-primary' onClick={handleSearchAlert}>
                  <i className='fas fa-search' />
                </button>
              </div>

              <div className='d-flex align-items-center gap-3 mb-1 mt-2'>
                {/* Status */}
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

                {/* Severity */}
                <div className='w-150px me-4'>
                  <select className='form-select form-select-sm' ref={severity}>
                    <option value=''>Select Severity</option>
                    {severityNameDropDownData.map((item) => (
                      <option key={item.dataID} value={item.dataID}>
                        {item.dataValue}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Waived Checkbox */}
                <div className='d-flex align-items-center gap-1'>
                  <input
                    type='checkbox'
                    id='waived'
                    className='form-check-input mt-0'
                    checked={isWaived}
                    onChange={(e) => setIsWaived(e.target.checked)}
                  />
                  <label
                    htmlFor='waived'
                    className='form-check-label ms-3'
                    style={{cursor: 'pointer'}}
                  >
                    Waived
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <table className='table alert-table fixed-table scroll-x'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th className='checkbox-th' />
              <th onClick={() => handleSort('severityName')}>
                Severity {renderSortIcon(sortConfig, 'severityName')}
              </th>
              <th onClick={() => handleSort('finding')}>
                Finding / Risk {renderSortIcon(sortConfig, 'finding')}
              </th>
              <th onClick={() => handleSort('category')}>
                Category {renderSortIcon(sortConfig, 'category')}
              </th>
              <th onClick={() => handleSort('firstDetected')}>
                First detected {renderSortIcon(sortConfig, 'firstDetected')}
              </th>
              <th onClick={() => handleSort('hostnameCount')}>
                Assets affected {renderSortIcon(sortConfig, 'hostnameCount')}
              </th>
              <th onClick={() => handleSort('statusName')}>
                Status {renderSortIcon(sortConfig, 'statusName')}
              </th>
              <th onClick={() => handleSort('ownerName')}>
                Owner {renderSortIcon(sortConfig, 'ownerName')}
              </th>
               <th onClick={() => handleSort('assignedToUserName')}>
                Assigned To {renderSortIcon(sortConfig, 'assignedToUserName')}
              </th>
              <th onClick={() => handleSort('source')}>
                Source {renderSortIcon(sortConfig, 'source')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {filteredList?.map((risk) => (
              <Fragment key={risk.riskId}>
                <tr
                  className='fs-12 table-row'
                  style={{cursor: 'pointer'}}
                  onClick={() => handleRowClick(risk)}
                >
                <td>
                  <div className='form-check form-check-sm form-check-custom form-check-solid px-3 d-flex align-items-center'>
                    <input
                      className='form-check-input widget-13-check'
                      type='checkbox'
                      value={risk.riskId}
                      name={risk.riskId}
                      checked={selectedAlert.includes(String(risk.riskId))}
                      onChange={(e) => handleselectedAlert(risk, e)}
                      onClick={(e) => e.stopPropagation()}
                      autoComplete='off'
                    />
                  </div>
                </td>
                <td>
                  <div className='sev-icon'>{risk.severityName}</div>
                </td>
                <td>
                  <div title={risk.finding} className='fw-semibold'>
                    {truncateText(risk.finding, 30)}
                  </div>
                  <div title={risk.riskTitle} className='text-muted small'>
                    {truncateText(risk.riskTitle, 15)}
                  </div>
                </td>
                <td>
                  <span title={risk.category} className='badge bg-light text-dark border px-3 py-2'>
                    {truncateText(risk.category, 30)}
                  </span>
                </td>
                <td>{getCurrentTimeZone(risk.firstDetectedDate)}</td>
                <td>{risk.assetCount}</td>
                <td>{risk.statusName}</td>
                <td>{risk.ownerName}</td>
                <td>{risk.assignedToUserName}</td>
                <td>{risk.source}</td>
                <td>
                  {/* ── Edit ── */}
                  {isActionAuthorized('Update') ? (
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
                  {isActionAuthorized('Delete') ? (
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
                    className={`fa fa-chevron-${expandedRows.includes(risk.riskId) ? 'down' : 'right'} ms-8 cursor-pointer text-primary`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleRow(risk.riskId)
                    }}
                  />
                </td>
                </tr>
                {/* Accordion Detail Row */}
                {expandedRows.includes(risk.riskId) && (
                  <tr className='bg-light'>
                    <td colSpan='11' className='ps-15'>
                      <div className='p-4 border-start border-primary border-4'>
                        <h6 className='fw-bold fs-7 mb-3 text-dark'>Associated Assets Details</h6>
                        {risk.riskAssets && risk.riskAssets.length > 0 ? (
                          <div className='table-responsive'>
                            <table className='table table-bordered table-sm fs-7 bg-white mb-0'>
                              <thead className='table-light'>
                                <tr>
                                  <th>Assets</th>
                                  <th>First detected</th>
                                  <th>Status</th>
                                  <th>Waived</th>
                                  <th>Waiver Expiry Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {risk.riskAssets.map((asset) => (
                                  <tr key={asset.assetId}>
                                    <td>{asset.assetName}</td>
                                    <td>{getCurrentTimeZone(asset.firstDetectedDate || asset.firstDetected) || '—'}</td>
                                    <td>{asset.statusName || '—'}</td>
                                    <td>{asset.isWaived ? 'Yes' : 'No'}</td>
                                    <td>{getCurrentTimeZone(asset.waiverExpiryDate) || '—'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <span className='text-muted fs-7 fst-italic'>No asset data available for this risk.</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>

        {/* View details modal (row click) */}
        <RiskDetailsModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          risk={selectedRisk}
        />

        {/* Edit modal (pencil icon) */}
        <RiskEditModal
          show={showEditModal}
          onHide={() => {
            setShowEditModal(false)
            setEditRisk(null)
          }}
          risk={editRisk}
          onSuccess={() => getRisks(currentPage + 1, selectedFilterValue, searchValue)}
        />

        {/* Delete modal component */}
        <RiskDeleteModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false)
            setDeleteRisk(null)
          }}
          risk={deleteRisk}
          onSuccess={() => getRisks(currentPage + 1, selectedFilterValue, searchValue)}
        />

        {/* Delete modal component for bulk delete */}
        <RiskDeleteModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false)
            setDeleteRisk(null)
          }}
          risk={deleteRisk}
          riskIds={selectedAlert}
          isBulkDelete={selectedAlert.length > 1}
          onSuccess={() => {
            setselectedAlert([])
            setIsCheckboxSelected(false)
            getRisks(currentPage + 1, selectedFilterValue, searchValue)
          }}
        />

        <RiskWaiverModal
          show={showWaiverModal}
          onHide={() => setShowWaiverModal(false)}
          selectedAlertIds={selectedAlert}
          onSuccess={() => {
            setselectedAlert([])
            setIsCheckboxSelected(false)
            getRisks(currentPage + 1, selectedFilterValue, searchValue)
          }}
        />

        <RiskRevokeModel
          show={showRevokeModal}
          onHide={() => setShowRevokeModal(false)}
          selectedAlertIds={selectedAlert}
          onSuccess={() => {
            setselectedAlert([])
            setIsCheckboxSelected(false)
            getRisks(currentPage + 1, selectedFilterValue, searchValue)
          }}
        />

        {tools && (
          <div className='d-flex justify-content-end align-items-center pagination-bar mt-5'>
            <ReactPaginate
              previousLabel={<i className='fa fa-chevron-left' />}
              nextLabel={<i className='fa fa-chevron-right' />}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={8}
              onPageChange={handlePageClick}
              containerClassName={'pagination justify-content-end'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item custom-previous'}
              previousLinkClassName={'page-link custom-previous-link'}
              nextClassName={'page-item custom-next'}
              nextLinkClassName={'page-link custom-next-link'}
              breakClassName={'page-item'}
              breakLinkClassName={'page-link'}
              activeClassName={'active'}
              forcePage={activePage - 1}
            />
            <div className='col-md-3 d-flex justify-content-end align-items-center'>
              <span className='col-md-4'>Count: </span>
              <select
                className='form-select form-select-sm col-md-4'
                value={limit}
                onChange={handlePageSelect}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RiskProfile
