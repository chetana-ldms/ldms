import React, {useState, useRef, useEffect} from 'react'
import RiskDetailsModal from './RiskDetailsModal'
import {fetchRisks, fetchSyncRisksUrl} from '../../../../../api/BreachRiskApi'
import useFeatureActions from '../configuration/useFeatureActions'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Pagination from '../../../../../../utils/Pagination'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {truncateText} from '../../../../../../utils/TruncateText'
import {renderSortIcon, sortedItems} from '../../../../../../utils/Sorting'
import {notify, notifyFail} from '../components/notification/Notification'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {fetchAlertsStatusUpdateUrl} from '../../../../../api/AlertsApi'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form} from 'reactstrap'
import { fetchExportDataAddUrl } from '../../../../../api/Api'

function RiskDetailsPage() {
    const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null)
  const dropdownRef = useRef(null)
  const [tools, setTools] = useState([])
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: 'ascending',
  })
  const [filterValue, setFilterValue] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activePage, setActivePage] = useState(0)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [selectedAlert, setselectedAlert] = useState([])
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false)
  const [note, setNote] = useState('')
  const [selectedDays, setSelectedDays] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilterValue, setSelectedFilterValue] = useState(1)
  const status = useRef()
  const analystVerdict = useRef()
  const [StatusDropDown, setStatusDropDown] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState(null)
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const dropdownRefSatus = useRef(null)
  const [actionsValue, setActionValue] = useState('')
  const [selectCheckBox, setSelectCheckBox] = useState(null)
  const [checkboxStates, setCheckboxStates] = useState({})
  const [escalate, setEscalate] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [ignorVisible, setIgnorVisible] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  const [dropdownData, setDropdownData] = useState({
    severityNameDropDownData: [],
    statusDropDown: [],
    observableTagDropDown: [],
    analystVerdictDropDown: [],
  })
  const {severityNameDropDownData, statusDropDown, observableTagDropDown, analystVerdictDropDown} =
    dropdownData
  const reload = async () => {
    const payload = {
      orgId: orgId,
      toolId: toolId,
    }
    try {
      setLoading(true)
      const response = await fetchRisks(payload)
      setTools(response?.data || [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [itemsPerPage])
  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems =
    tools !== null
      ? sortedItems(
          tools.filter((item) => item.finding.toLowerCase().includes(filterValue.toLowerCase())),
          sortConfig
        ).slice(currentPage * itemsPerPage, currentPage * itemsPerPage + itemsPerPage)
      : null

  const filteredList = filterValue
    ? sortedItems(
        tools.filter((item) => item.finding.toLowerCase().includes(filterValue.toLowerCase())),
        sortConfig
      )
    : sortedItems(tools || [], sortConfig)

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(0)
    setActivePage(0)
  }

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected)
    setActivePage(selected.selected)
  }

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
    setCurrentPage(0)
    setActivePage(0)
  }

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }
  const handleRowClick = (risk) => {
    setSelectedRisk(risk)
    setShowModal(true)
  }
  const handleSort = (key) => {
    let direction = 'ascending'

    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }

    setSortConfig({key, direction})
  }
  const handleSync = async () => {
    try {
      setLoading(true)

      const payload = {
        orgId,
        toolId,
      }

      const response = await fetchSyncRisksUrl(payload)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        await reload()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  const handleselectedAlert = (item, e) => {
    const {value, checked} = e.target
    if (checked) {
      setselectedAlert([...selectedAlert, value])
      setIsCheckboxSelected(true)
    } else {
      const updatedAlert = selectedAlert.filter((e) => e !== value)
      setselectedAlert(updatedAlert)
      setIsCheckboxSelected(updatedAlert.length > 0)
    }
  }
  const handleStatus = () => {
    setStatusDropDown(true)
  }
  const handleStatusClose = () => {
    setStatusDropDown(false)
  }
  const handleStatusDropDown = (event) => {
    setSelectedStatus(event.target.value)
  }
  const handleSubmitStatus = async () => {
    if (!selectedStatus) {
      notifyFail('Please select a status option.')
      return
    }
    try {
      const modifiedUserId = Number(sessionStorage.getItem('userId'))
      const data = {
        orgID: orgId,
        alertIds: selectedAlert,
        statusId: selectedStatus,
        notes: note,
        modifiedDate: new Date().toISOString(),
        modifiedUserId,
      }
      const responseData = await fetchAlertsStatusUpdateUrl(data)
      const {isSuccess, message} = responseData
      if (isSuccess) {
        handleStatusClose()
        reload()
        if (dropdownRefSatus.current) {
          dropdownRefSatus.current.classList.remove('show')
        }
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const handleNoteChange = (event) => {
    setNote(event.target.value)
  }
  const onActionsClick = () => {
    if (isCheckboxSelected) {
      setIsCheckboxSelected(true)
    }
    setShowForm(true)
    setEscalate(true)
    setIgnorVisible(true)
  }
  const handleCloseForm = () => {
    setShowForm(false)
  }
   function createIncidentSubmit(e) {
    setActionValue(e.target.value)
  }
   const handleIgnoreSubmit = () => {}
   const exportToExcel = async () => {
  // ✅ Use same data as table
  const dataToExport = currentItems || []

  // ✅ Header
  let csvContent = 'Risk Report\n'

  csvContent +=
    'Severity,Finding,Risk Title,Category,First Detected,Assets,Status,Owner,Source\n' +
    dataToExport
      .map(
        (item) =>
          `${item.severityName},
           ${item.finding},
           ${item.riskTitle},
           ${item.category},
           ${item.firstDetected},
           ${item.assetCount},
           ${item.statusName},
           ${item.ownerName},
           ${item.source}`
      )
      .join('\n')

  // ✅ Create file
  const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'})
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', 'risk_report.csv')

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  // ✅ API logging (optional)
  const payload = {
    createdDate: new Date().toISOString(),
    createdUserId: Number(sessionStorage.getItem('userId')),
    orgId: Number(sessionStorage.getItem('orgId')),
    exportDataType: 'Risks',
  }

  try {
    await fetchExportDataAddUrl(payload)
  } catch (error) {
    console.error(error)
  }
}
      const handleSearchAlert = async () => {}
  
  return (
    <div className='alert-page'>
      <ToastContainer />
      
      <div className='mb-1'>
        <div className='d-flex justify-content-between border-0'>
          <h3 className='align-items-start flex-column'>
            <span className='fw-bold fs-3'>
              Risks({currentItems ? currentItems.length : 0} /{' '}
              {filteredList ? filteredList.length : 0})
            </span>
          </h3>
        </div>
      </div>
       <div className='clearfix' />
      <div className='card p-2'>
      <div className='row ps-3'>
        <div className='col-md-7'>
          <div className='row'>
            <div className='card-toolbar float-left'>
              <div className='d-flex align-items-center gap-2 gap-lg-3'>
                <div className='m-0'>
                  {isActionAuthorized('UpdateStatus') && (
                    <>
                      <a
                        href='#'
                        className={`btn btn-small fw-bold fs-14 btn-green ${
                          !isCheckboxSelected && 'disabled'
                        }`}
                        data-kt-menu-trigger='click'
                        data-kt-menu-placement='bottom-end'
                        onClick={handleStatus}
                      >
                        Status
                      </a>

                      <div
                        ref={dropdownRefSatus}
                        className='menu menu-sub menu-sub-dropdown w-250px w-md-300px alert-action'
                        data-kt-menu='true'
                      >
                        {StatusDropDown && (
                          <div className='px-3 py-3'>
                            <div className='mb-5'>
                              <div className='d-flex justify-content-end mb-5'>
                                <div>
                                  <div
                                    className='close fs-20 text-muted pointer'
                                    aria-label='Close'
                                    onClick={handleStatusClose}
                                  >
                                    <span
                                      aria-hidden='true'
                                      style={{color: 'inherit', textShadow: 'none'}}
                                    >
                                      &times;
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <select
                                className='form-select form-select-solid'
                                data-kt-select2='true'
                                data-placeholder='Select option'
                                data-dropdown-parent='#kt_menu_637dc885a14bb'
                                data-allow-clear='true'
                                onChange={handleStatusDropDown}
                              >
                                <option value=''>Select</option>
                                {statusDropDown.length > 0 &&
                                  statusDropDown.map((item) => (
                                    <option key={item.dataID} value={item.dataID}>
                                      {item.dataValue}
                                    </option>
                                  ))}
                              </select>
                            </div>
                            <div className='mb-5'>
                              <textarea
                                className='form-control'
                                rows='1'
                                placeholder='Write your note here...'
                                onChange={handleNoteChange}
                              ></textarea>
                            </div>

                            <div className='text-right'>
                              <button
                                className='btn btn-new btn-small'
                                onClick={handleSubmitStatus}
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className='m-0'>
                  <a
                    href='#'
                    className={`btn btn-small fs-14 btn-green ${!isCheckboxSelected && 'disabled'}`}
                    data-kt-menu-trigger='click'
                    data-kt-menu-placement='bottom-end'
                    onClick={onActionsClick}
                  >
                    Actions
                  </a>

                  <div
                    className='menu-sub menu-sub-dropdown w-250px w-md-300px alert-action'
                    data-kt-menu='true'
                    id='kt_menu_637dc6f8a1c15'
                  >
                    {showForm && selectedAlert.length > 0 && (
                      <div className='px-3 py-3'>
                        <div className='mb-5'>
                          <div className='d-flex justify-content-end mb-5'>
                            <div>
                              <div
                                className='close fs-20 text-muted pointer'
                                aria-label='Close'
                                onClick={handleCloseForm}
                              >
                                <span
                                  aria-hidden='true'
                                  style={{color: 'inherit', textShadow: 'none'}}
                                >
                                  &times;
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className='header-filter'>
                            <select
                              onChange={createIncidentSubmit}
                              className='form-select form-select-solid'
                              data-kt-select2='true'
                              data-control='select2'
                              data-placeholder='Select option'
                              data-dropdown-parent='#kt_menu_637dc6f8a1c15'
                              data-allow-clear='true'
                            >
                              <option>Select</option>
                              {isActionAuthorized('CreateIncident') && (
                                <option
                                  value='1'
                                  disabled={
                                    selectCheckBox.alertIncidentMappingId > 0 ||
                                    selectCheckBox.positiveAnalysis === 'False Positive'
                                  }
                                >
                                  Create Incident
                                </option>
                              )}
                              {isActionAuthorized('Escalate') && (
                                <option value='2'>Escalate</option>
                              )}
                              {isActionAuthorized('IrrelevantIgnore') && (
                                <option value='3'>Irrelevant / Ignore</option>
                              )}
                            </select>
                          </div>
                        </div>

                        

                        {actionsValue === '3' && ignorVisible && (
                          <div>
                            <div className='mb-5'>
                              <label className='form-label fw-bolder' htmlFor='noteField'>
                                Note <sup className='red'>*</sup>:
                              </label>
                              <textarea
                                id='noteField'
                                className='form-control'
                                rows='1'
                                placeholder='Write your note here...'
                                value={note}
                                onChange={handleNoteChange}
                                required
                              ></textarea>
                            </div>
                            <div className='d-flex justify-content-end'>
                              <button
                                type='button'
                                className='btn btn-small btn-new'
                                onClick={handleIgnoreSubmit}
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className='mt-2 bd-highlight'>
                  <div className='w-100px me-0'>
                    <select
                      className='form-select form-select-sm'
                      data-kt-select2='true'
                      data-placeholder='Select option'
                      data-dropdown-parent='#kt_menu_637dc885a14bb'
                      data-allow-clear='true'
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
              <div className='export-report ms-2 '>
                <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
                  <DropdownToggle caret>
                    Export <i className='fa fa-file-export link mg-left-10' />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={exportToExcel}>
                      Export to CSV <i className='fa fa-file-excel link float-right' />
                    </DropdownItem>
                    {/* <DropdownItem onClick={exportToPDF}>
                  Export to PDF <i className='fa fa-file-pdf red float-right' />
                </DropdownItem> */}
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-5'>
          <div className='card-title header-filter'>
            {/* begin::Search */}
            <div className='input-group'>
              <input
                type='text'
                className='form-control form-control-sm'
                placeholder='Search Alert'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button className='btn btn-sm btn-primary' onClick={handleSearchAlert}>
                <i className='fas fa-search'></i>
              </button>
            </div>
            <div className='d-flex justify-content-between bd-highlight mb-3'>
              <div className='mt-2 bd-highlight'>
                <div className='w-150px me-2'>
                  <div>
                    <select
                      className='form-select form-select-sm'
                      data-kt-select2='true'
                      data-placeholder='Select option'
                      data-dropdown-parent='#kt_menu_637dc885a14bb'
                      data-allow-clear='true'
                      ref={status}
                      // onChange={handleStatusChange}
                    >
                      <option value=''>Select</option>
                      {statusDropDown.length > 0 &&
                        statusDropDown.map((item) => (
                          <option key={item.dataID} value={item.dataID}>
                            {item.dataValue}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className='w-150px mt-2'>
                <div>
                  <select
                    className='form-select form-select-sm'
                    data-kt-select2='true'
                    data-placeholder='Select option'
                    data-dropdown-parent='#kt_menu_637dc885a14bb'
                    data-allow-clear='true'
                    ref={analystVerdict}
                  >
                    <option value=''>Select</option>
                    {analystVerdictDropDown.length > 0 &&
                      analystVerdictDropDown.map((item) => (
                        <option key={item.dataID} value={item.dataID}>
                          {item.dataValue}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className='mt-2 ms-1 btn btn-primary btn-sm ' onClick={handleSync}>
                Sync
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className='card-header no-pad'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='fw-bold fs-3'>
            Risks({currentItems ? currentItems.length : 0} /{' '}
            {filteredList ? filteredList.length : 0})
          </span>
        </h3>

        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <div className='card-header bg-white d-flex justify-content-between align-items-center py-2 position-relative'>
              <div className='position-relative' ref={dropdownRef}>
                <button
                  className='btn btn-green btn-small px-4'
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  Manage risks {showDropdown ? '▲' : '▾'}
                </button>

                {showDropdown && (
                  <div
                    className='position-absolute end-0 mt-2 bg-white shadow rounded-3 py-2'
                    style={{width: '200px', zIndex: 1000}}
                  >
                    <div
                      className={`px-3 py-2 ${
                        selectedAction === 'remediate' ? 'bg-primary text-white' : ''
                      }`}
                      style={{cursor: 'pointer'}}
                      onClick={() => setSelectedAction('remediate')}
                    >
                      <div>
                        <strong>Request remediation</strong>
                      </div>
                      <div>Address risks</div>
                    </div>

                    <div
                      className={`px-3 py-2 ${
                        selectedAction === 'waive' ? 'bg-primary text-white' : ''
                      }`}
                      style={{cursor: 'pointer'}}
                      onClick={() => setSelectedAction('waive')}
                    >
                      <div>
                        <strong>Waive a risk</strong>
                      </div>
                      <div>Dismiss a risk</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div> */}
        {/* ================= TABLE ================= */}
        <div className='card-body no-pad'>
          <table className='table align-middle no-pad gs-0 gy-4 dash-table alert-table'>
            <thead>
              <tr className='fw-bold text-muted bg-blue'>
                <th className='checkbox-th'>{/* <input type="checkbox" name="selectAll" /> */}</th>
                <th onClick={() => handleSort('severityName')}>
                  Sev. {renderSortIcon(sortConfig, 'severityName')}
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
                <th onClick={() => handleSort('source')}>
                  Source {renderSortIcon(sortConfig, 'source')}
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && <UsersListLoading />}
              {currentItems?.map((risk) => (
                <tr
                  key={risk.riskId}
                  className='fs-12 table-row'
                  style={{cursor: 'pointer'}}
                  onClick={() => handleRowClick(risk)}
                >
                  <td>
                    <div className='form-check form-check-sm form-check-custom form-check-solid px-3'>
                      <input
                        className='form-check-input widget-13-check'
                        type='checkbox'
                        value={risk.riskId}
                        name={risk.riskId}
                        onChange={(e) => handleselectedAlert(risk, e)}
                        autoComplete='off'
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </td>
                  <td>
                    <div className='sev-icon'>{risk.severityName}</div>
                  </td>

                  <td>
                    <div title={risk.finding} className='fw-semibold'>
                      {truncateText(risk.finding, 40)}
                    </div>
                    <div title={risk.riskTitle} className='text-muted small'>
                      {truncateText(risk.riskTitle, 40)}
                    </div>
                  </td>

                  <td>
                    <span className='badge bg-light text-dark border px-3 py-2'>
                      {risk.category}
                    </span>
                  </td>
                  <td>{getCurrentTimeZone(risk.firstDetected)}</td>
                  <td>{risk.assetCount}</td>

                  <td>{risk.statusName}</td>
                  <td>{risk.ownerName}</td>
                  <td>{risk.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= CHILD MODAL ================= */}
        <RiskDetailsModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          risk={selectedRisk}
        />
        {tools && (
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

export default RiskDetailsPage
