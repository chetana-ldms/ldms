import React, {useState, useEffect, useRef} from 'react'
import IncidentChat from './IncidentChat'
import IncidentDetails from './IncidentDetails'
import ReactPaginate from 'react-paginate'
import {useLocation} from 'react-router-dom'
import './chat.css'
import {
  fetchGetIncidentSearchResult,
  fetchIncidents,
  fetchSetOfIncidents,
  fetchIncidentDetails,
  fetchMasterData,
  fetchIncidentsHasChangesUrl,
  fetchDeleteIncidentsUrl, // Updated import
} from '../../../../../api/IncidentsApi'
import {ToastContainer} from 'react-toastify'
import {notify, notifyFail} from '../components/notification/Notification'
import 'react-toastify/dist/ReactToastify.css'
import ChatApp from './ChatApp'
import moment from 'moment-timezone'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import './IncidentPagination.css'
import {useErrorBoundary} from 'react-error-boundary'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {fetchOrganizationToolsSecurityUrl} from '../../../../../api/securityApi'
import TicketUpdateBadge from './TicketUpdateBadge'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import useFeatureActions from '../configuration/useFeatureActions'
import DeleteConfirmation from '../../../../../../utils/DeleteConfirmation'
import MergeModal from './MergeModal'

const IncidentsPage = () => {
  const handleError = useErrorBoundary()
  const userID = Number(sessionStorage.getItem('userId'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const location = useLocation()
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false)
  const [lastPulledDate, setLastPulledDate] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showMergeModal, setShowMergeModal] = useState(false)
  const [selectedIncidentIDs, setSelectedIncidentIDs] = useState([]) // for delete
  const [selectedItems, setSelectedItems] = useState([])
  const [incidentChangesCount, setIncidentChangesCount] = useState(0)
  const [showBadge, setShowBadge] = useState(false)
  const alertData = JSON.parse(localStorage.getItem('alertData'))
  const [selectedAlert, setselectedAlert] = useState([])
  const [showChat, setShowChat] = useState(false)
  const [incident, setIncident] = useState([])
  const [totalIncidentsCount, setTotalIncidentsCount] = useState(null)
  const [statusDropDown, setStatusDropDown] = useState([])
  const [incidentSortOptions, setIncidentSortOptions] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const status = useRef()
  const sortOption = useRef()
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const [selectedIncident, setSelectedIncident] = useState({})
  console.log(selectedIncident, 'selectedIncident')
  const [refreshParent, setRefreshParent] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [activePage, setActivePage] = useState(1)
  const [pageCount, setpageCount] = useState(0)
  const [limit, setLimit] = useState(5)
  const [loading, setLoading] = useState(false)
  const [statusFromDashBoard, setStatusFromDashBoard] = useState(location.state?.status || '')
  console.log(statusFromDashBoard, 'statusFromDashBoard')
  const [daysFromDashBoard, setDaysFromDashBoard] = useState(location.state?.days || '')
  const [selectedDays, setSelectedDays] = useState([])
  const [selectedFilterValue, setSelectedFilterValue] = useState(1)
  const [selectedToolId, setSelectedToolId] = useState(sessionStorage.getItem('toolID') || '')
  const [tools, setTools] = useState([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const toolRef = useRef()
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))
  const {featureActions} = useFeatureActions(orgId, selectedToolId, roleId, featureId)

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }
  useEffect(() => {
    const reload = async () => {
      try {
        setLoading(true)
        const data = await fetchOrganizationToolsSecurityUrl(orgId)
        setTools(data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    reload()
  }, [orgId])
  useEffect(() => {
    const fetchIncidentStatusAndSortOptions = async () => {
      const statusDataRequest = {
        maserDataType: 'incident_status',
        orgId: orgId,
        toolId: selectedToolId ? selectedToolId : 0,
      }
      const sortOptionsDataRequest = {
        maserDataType: 'IncidentSortOptions',
        orgId: orgId,
        toolId: selectedToolId ? selectedToolId : 0,
      }

      try {
        const [statusData, sortOptionsData] = await Promise.all([
          fetchMasterData(statusDataRequest),
          fetchMasterData(sortOptionsDataRequest),
        ])

        setStatusDropDown(statusData)
        setIncidentSortOptions(sortOptionsData)
      } catch (error) {
        handleError(error)
      }
    }

    fetchIncidentStatusAndSortOptions()
  }, [selectedToolId])

  useEffect(() => {
    setStatusFromDashBoard(location.state?.status || '')
    setDaysFromDashBoard(location.state?.days || '')
  }, [location.state])
  useEffect(() => {
    const fetchNumberOfDays = async () => {
      try {
        const data = {
          maserDataType: 'Incident_Searchdata_duration',
          orgId: orgId,
          toolId: toolId,
        }
        const masterDataResponse = await fetchMasterData(data)
        const response = masterDataResponse
        setSelectedDays(response)
      } catch (error) {
        handleError(error)
      }
    }
    fetchNumberOfDays()
  }, [])

  useEffect(() => {
    if (statusDropDown.length > 0) {
      fetchIncident()
    }
    if (daysFromDashBoard) {
      setSelectedFilterValue(daysFromDashBoard)
    }
  }, [statusDropDown, limit])

  const fetchIncident = async (page = currentPage) => {
    const data = {
      orgID: orgId,
      paging: {
        rangeStart: (page - 1) * limit + 1,
        rangeEnd: page * limit,
      },
      loggedInUserId: userID,
      lastDataPulledDate: new Date().toISOString(),
      orgAccountStructureLevel: [
        {levelName: 'AccountId', levelValue: accountId || ''},
        {levelName: 'SiteId', levelValue: siteId || ''},
        {levelName: 'GroupId', levelValue: groupId || ''},
      ],
    }

    if (selectedToolId) {
      data.toolId = selectedToolId
    }
    if (selectedFilterValue) {
      data.searchDurationInDays = selectedFilterValue || 0
    }

    if (statusFromDashBoard) {
      const statusItem = statusDropDown.find((item) => item.dataValue === statusFromDashBoard)
      if (statusItem) {
        data.statusId = statusItem.dataID
        data.searchDurationInDays = daysFromDashBoard
      }
    }

    try {
      setLoading(true)
      const response = await fetchGetIncidentSearchResult(data)
      setIncident(response.incidentList)
      setTotalIncidentsCount(response.totalIncidentsCount)
      setpageCount(Math.ceil(response.totalIncidentsCount / limit))
      setLastPulledDate(new Date().toISOString())
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const fetchSelectedIncident = async () => {
    if (selectedIncident.incidentID) {
      try {
        const incidentData = await fetchIncidentDetails(selectedIncident.incidentID)
        setSelectedIncident(incidentData)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleSearch = async () => {
    setSelectedIncident({})
    setActivePage(1)
    setStatusFromDashBoard('')
    const data = {
      orgID: orgId,
      paging: {
        rangeStart: 1,
        rangeEnd: limit,
      },
      loggedInUserId: userID,
      statusId: status.current?.value || 0,
      searchText: searchValue || '',
      sortOptionId: sortOption.current?.value || 0,
      searchDurationInDays: selectedFilterValue || 0,
      lastDataPulledDate: new Date().toISOString(),
      orgAccountStructureLevel: [
        {
          levelName: 'AccountId',
          levelValue: accountId || '',
        },
        {
          levelName: 'SiteId',
          levelValue: siteId || '',
        },
        {
          levelName: 'GroupId',
          levelValue: groupId || '',
        },
      ],
    }
    // Add selectedToolId if present
    if (selectedToolId) {
      data.toolId = selectedToolId
    }
    try {
      setLoading(true)
      const response = await fetchGetIncidentSearchResult(data)
      setIncident(response.incidentList)
      setTotalIncidentsCount(response.totalIncidentsCount)
      const total = response.totalIncidentsCount
      setpageCount(Math.ceil(total / limit))
      setLastPulledDate(new Date().toISOString())
      setLoading(false)
    } catch (error) {
      handleError(error)
      setLoading(false)
    }
  }
  const fetchFilteredIncidents = async (toolId, filterValue) => {
    setSelectedIncident({})
    setDaysFromDashBoard('')
    setActivePage(1)

    const data = {
      orgID: orgId,
      paging: {
        rangeStart: 1,
        rangeEnd: limit,
      },
      loggedInUserId: userID,
      statusId: status.current?.value || 0,
      searchText: searchValue || '',
      sortOptionId: sortOption.current?.value || 0,
      searchDurationInDays: filterValue || 0,
      lastDataPulledDate: new Date().toISOString(),
      orgAccountStructureLevel: [
        {
          levelName: 'AccountId',
          levelValue: accountId || '',
        },
        {
          levelName: 'SiteId',
          levelValue: siteId || '',
        },
        {
          levelName: 'GroupId',
          levelValue: groupId || '',
        },
      ],
    }
    if (toolId) {
      data.toolId = toolId
    }

    try {
      setLoading(true)
      const response = await fetchGetIncidentSearchResult(data)
      setIncident(response.incidentList)
      setTotalIncidentsCount(response.totalIncidentsCount)
      setpageCount(Math.ceil(response.totalIncidentsCount / limit))
      setLastPulledDate(new Date().toISOString())
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleToolChange = (e) => {
    const toolId = e.target.value
    setSelectedToolId(toolId)
    const filterValue = selectedFilterValue || ''
    fetchFilteredIncidents(toolId, filterValue)
  }
  const handleFilterChange = (e) => {
    const filterValue = e.target.value
    setSelectedFilterValue(filterValue)
    fetchFilteredIncidents(selectedToolId, filterValue)
  }

  const handleIncidentClick = (item) => {
    setSelectedIncident(item)
  }

  const handleReset = () => {
    setSelectedIncident({})
    setSearchValue('')
    if (status.current) {
      status.current.value = 0
    }
    setIncident([])
    setTotalIncidentsCount(0)
  }

  const refreshIncidents = () => {
    setSearchValue('')
    if (status.current) {
      status.current.value = 0
    }
    setShowBadge(false)
    setIncidentChangesCount(0)
    fetchIncident()
  }

  useEffect(() => {
    if (refreshParent) {
      fetchSelectedIncident()
      setRefreshParent(false)
    }
  }, [refreshParent])

  const handlePageClick = async (datas) => {
    const selectedPage = datas.selected + 1
    setCurrentPage(selectedPage)
    setActivePage(selectedPage)

    const data = {
      orgID: orgId,
      paging: {
        rangeStart: (selectedPage - 1) * limit + 1,
        rangeEnd: selectedPage * limit,
      },
      loggedInUserId: userID,
      lastDataPulledDate: lastPulledDate,
      orgAccountStructureLevel: [
        {
          levelName: 'AccountId',
          levelValue: accountId || '',
        },
        {
          levelName: 'SiteId',
          levelValue: siteId || '',
        },
        {
          levelName: 'GroupId',
          levelValue: groupId || '',
        },
      ],
    }

    // Add selectedToolId if present
    if (selectedToolId) {
      data.toolId = selectedToolId
    }

    // Add searchDurationInDays
    if (statusFromDashBoard) {
      const statusItem = statusDropDown.find((item) => item.dataValue === statusFromDashBoard)
      if (statusItem) {
        data.statusId = statusItem.dataID
        data.searchDurationInDays = daysFromDashBoard
      }
    }
    if (!statusFromDashBoard) {
      if (searchValue || status || sortOption || selectedFilterValue) {
        data.statusId = status.current?.value || 0
        data.searchText = searchValue || ''
        data.sortOptionId = sortOption.current?.value || 0
        data.searchDurationInDays = selectedFilterValue || 0
      }
    }

    try {
      setLoading(true)
      const response = await fetchGetIncidentSearchResult(data)
      setIncident(response.incidentList)
      setTotalIncidentsCount(response.totalIncidentsCount)
      setpageCount(Math.ceil(response.totalIncidentsCount / limit))
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const handlePageSelect = (event) => {
    const selectedPerPage = event.target.value
    setLimit(selectedPerPage)
  }

  useEffect(() => {
    setSelectedIncident(
      incident !== null && incident !== undefined && incident.length > 0 ? incident[0] : {}
    )
  }, [incident])

  useEffect(() => {
    const data = {
      orgId: Number(sessionStorage.getItem('orgId')),
      toolId: selectedToolId,
      lastPulledDate: lastPulledDate,
    }

    const intervalId = setInterval(async () => {
      try {
        const response = await fetchIncidentsHasChangesUrl(data)

        if (response?.incidentChangesCount > 0) {
          setIncidentChangesCount(response.incidentChangesCount)
          setShowBadge(true)
        }
      } catch (error) {
        console.error('Failed to fetch incident changes:', error)
      }
    }, 0.5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [selectedToolId, lastPulledDate])

  const handleManualRefresh = () => {
    setCurrentPage(1)
    setActivePage(1)
    fetchFilteredIncidents(selectedToolId, selectedFilterValue)
  }
  const handleTicketUpdateClick = () => {
    setCurrentPage(1)
    setActivePage(1)
    fetchFilteredIncidents(selectedToolId, selectedFilterValue)
    setShowBadge(false)
    setIncidentChangesCount(0)
  }
  const handleselectedAlert = (item, e) => {
    const {checked} = e.target
    if (checked) {
      setSelectedIncidentIDs((prev) => [...prev, item.incidentID])
      setSelectedItems((prev) => [...prev, item])
    } else {
      const updatedIDs = selectedIncidentIDs.filter((id) => id !== item.incidentID)
      const updatedItems = selectedItems.filter((i) => i.incidentID !== item.incidentID)

      setSelectedIncidentIDs(updatedIDs)
      setSelectedItems(updatedItems)
    }
    setIsCheckboxSelected(
      checked ? true : selectedIncidentIDs.length > 1 || selectedItems.length > 1
    )
  }

  const handleDelete = () => {
    setShowConfirmation(true)
  }

  const confirmDelete = async () => {
    if (selectedAlert) {
      const data = {
        orgId: orgId,
        deletedIncidentIds: selectedIncidentIDs,
        toolId: selectedToolId,
        deletedDate: new Date().toISOString(),
        deleteUserId: Number(sessionStorage.getItem('userId')),
      }

      try {
        const response = await fetchDeleteIncidentsUrl(data)
        const {isSuccess, message} = response
        if (isSuccess) {
          notify(message)
          setCurrentPage(1)
          setActivePage(1)
          fetchFilteredIncidents(selectedToolId, selectedFilterValue)
          setIsCheckboxSelected(false)
          setSelectedItems([])
          setSelectedIncidentIDs([])
        } else {
          notifyFail(message)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setShowConfirmation(false)
      }
    }
  }
  const cancelDelete = () => {
    setShowConfirmation(false)
  }
  const handleMerge = () => {
    setShowMergeModal(true)
  }
  const handleConfirmMerge = () => {
    setCurrentPage(1)
    setActivePage(1)
    fetchFilteredIncidents(selectedToolId, selectedFilterValue)
    setShowMergeModal(false)
    setIsCheckboxSelected(false)
    setselectedAlert([])
  }

  return (
    <>
      <div className='mb-5 mb-xl-8 bg-red incident-page'>
        <ToastContainer />
        <div className='card-body1'>
          <div className='row'>
            <div className='col-md-4 border-1 border-gray-300 border-end'>
              <div className='card'>
                <div className='bg-heading d-flex justify-content-between'>
                  <h4 className='no-margin no-pad'>
                    <span className='white fw-bold block pt-3 pb-3'>
                      Incidents <span className='white'>({totalIncidentsCount})</span>
                    </span>
                  </h4>
                  <div className='w-115px mt-1'>
                    <select
                      className='form-select form-select-sm ps-1 pe-0'
                      value={selectedToolId}
                      onChange={handleToolChange}
                    >
                      <option value=''>Select Tools</option>
                      {tools?.map((item, index) => (
                        <option key={index} value={item.toolId}>
                          {item.toolName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='w-86px mt-1'>
                    <select
                      className='form-select form-select-sm ps-1 pe-0'
                      value={selectedFilterValue}
                      onChange={handleFilterChange}
                    >
                      <option value=''>Select</option>
                      {selectedDays?.map((day, index) => (
                        <option key={index} value={day.dataValue}>
                          {day.dataName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className='bd-highlight'></div>

                <div className='card-title header-filter'>
                  {/* Auto Refresh and Manual Refresh Buttons */}

                  <div className='row my-1'>
                    <div className='col-md-6'>
                      <Dropdown
                        isOpen={dropdownOpen}
                        toggle={() => setDropdownOpen(!dropdownOpen)}
                        disabled={!isCheckboxSelected}
                      >
                        <DropdownToggle
                          className={`no-pad ${!isCheckboxSelected ? 'disabled' : ''}`}
                        >
                          <div className='btn btn-border btn-small'>
                            Action <i className='fa fa-angle-down mg-left-5' />
                          </div>
                        </DropdownToggle>

                        <DropdownMenu className='w-auto'>
                          <DropdownItem
                            onClick={handleDelete}
                            disabled={!isActionAuthorized('Delete')}
                          >
                            Delete
                          </DropdownItem>
                          <DropdownItem
                            onClick={handleMerge}
                            disabled={!isActionAuthorized('Merge')}
                          >
                            Merge
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>

                    <div className='col-md-4'></div>
                    <div className='col-md-2 d-flex justify-content-end'>
                      <button
                        className='btn btn-sm btn-outline-primary'
                        type='button'
                        onClick={handleManualRefresh}
                        title='Manual Refresh'
                      >
                        <i className='fa fa-refresh' />
                      </button>
                    </div>
                  </div>

                  {/* begin::Search */}
                  <div className='input-group'>
                    <input
                      type='text'
                      className='form-control form-control-sm'
                      placeholder='Search Incident'
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <button className='btn btn-sm btn-primary' onClick={handleSearch}>
                      <i className='fas fa-search'></i>
                    </button>
                  </div>
                  {/* end::Search */}
                  <div className='d-flex justify-content-between bd-highlight mb-3'>
                    <div className='mt-2 bd-highlight'>
                      <div className='w-100px me-2'>
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
                    <div className='mt-2 bd-highlight'>
                      <div className='w-150px me-0'>
                        <select
                          className='form-select form-select-sm'
                          data-kt-select2='true'
                          data-placeholder='Select option'
                          data-dropdown-parent='#kt_menu_637dc885a14bb'
                          data-allow-clear='true'
                          ref={sortOption}
                        >
                          {incidentSortOptions.length > 0 &&
                            incidentSortOptions.map((item) => (
                              <option key={item.dataID} value={item.dataID}>
                                {item.dataValue}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div className='mt-2 ms-1 btn btn-primary btn-sm ' onClick={handleReset}>
                      Reset
                    </div>
                  </div>
                  <div className='scroll-y h-500px'>
                    <div className='incident-list'>
                      <>
                        {loading && <UsersListLoading />}
                        {incident && incident.length > 0 ? (
                          incident.map((item, index) => (
                            <div
                              className={`incident-section${
                                selectedIncident === item ? ' selected' : ''
                              }`}
                              key={item.incidentID}
                              onClick={() => handleIncidentClick(item)}
                            >
                              {/* Row for Subject + Checkbox */}
                              <div className='row align-items-center'>
                                <div className='col-md-10'>
                                  <a href='#' className='text-dark'>
                                    <span className='incident-name' title={item.subject}>
                                      {item.subject}
                                    </span>
                                  </a>
                                </div>
                                <div className='col-md-2 d-flex justify-content-center'>
                                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                    <input
                                      className='form-check-input widget-13-check'
                                      type='checkbox'
                                      value={item.incidentID}
                                      name={item.incidentID}
                                      onChange={(e) => handleselectedAlert(item, e)}
                                      autoComplete='off'
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Status & Date */}
                              <div className='row'>
                                <div className='d-flex justify-content-between'>
                                  <div className='pt-2 bd-highlight'>
                                    <div className='fw-bold'>{item.incidentStatusName}</div>
                                  </div>
                                  <div className='pt-3 bd-highlight'>
                                    <div className='badge gray fw-normal'>
                                      {item.modifiedDate
                                        ? getCurrentTimeZone(item.modifiedDate)
                                        : getCurrentTimeZone(item.createdDate)}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <hr className='my-0' />

                              {/* Owner & Priority */}
                              <div className='d-flex justify-content-between bd-highlight mt-2'>
                                <div className='p-1 bd-highlight fs-12'>
                                  {item.ownerName || item.createdUser}
                                </div>
                                <div className='p-1 bd-highlight'>
                                  <div className='badge badge-light-primary mx-1'>
                                    {item.priorityName}
                                  </div>
                                  <div className='badge badge-light-danger'>
                                    {item.severityName}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className='text-center'>Data not found.</div>
                        )}
                      </>
                    </div>
                    <TicketUpdateBadge
                      count={incidentChangesCount}
                      onClick={() => {
                        handleTicketUpdateClick()
                        setShowBadge(false)
                      }}
                    />
                  </div>
                  <div className='d-flex flex-column align-items-start pagination-bar pagination-incident pt-5 border-top'>
                    {/* Pagination Controls */}
                    <div className='pagination-controls mb-2'>
                      <ReactPaginate
                        previousLabel={<i className='fa fa-chevron-left' />}
                        nextLabel={<i className='fa fa-chevron-right' />}
                        pageCount={pageCount}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={2}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination justify-content-start'}
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
                    </div>

                    {/* Page Size Dropdown */}
                    <div className='page-size-dropdown'>
                      <div className='d-flex justify-content-start align-items-center'>
                        <select
                          className='form-select form-select-sm'
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
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-4 chat-section'>
              <ChatApp
                userId={sessionStorage.getItem('userId')}
                userName={sessionStorage.getItem('userName')}
                orgId={sessionStorage.getItem('orgId')}
                selectedIncident={selectedIncident}
              />
            </div>
            <IncidentDetails incident={selectedIncident} onRefreshIncidents={refreshIncidents} />
          </div>
          {showConfirmation && (
            <DeleteConfirmation
              show={showConfirmation}
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
            />
          )}
          <MergeModal
            show={showMergeModal}
            onClose={() => setShowMergeModal(false)}
            onConfirm={handleConfirmMerge}
            selectedItems={selectedItems}
          />
        </div>
      </div>
    </>
  )
}

export {IncidentsPage}
