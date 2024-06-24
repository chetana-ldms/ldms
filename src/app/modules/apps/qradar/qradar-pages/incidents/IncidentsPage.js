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
  fetchIncidentDetails, // Updated import
} from '../../../../../api/IncidentsApi'
import {fetchMasterData} from '../../../../../api/Api'
import {ToastContainer} from 'react-toastify'
import {notify, notifyFail} from '../components/notification/Notification'
import 'react-toastify/dist/ReactToastify.css'
import ChatApp from './ChatApp'
import moment from 'moment-timezone'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import './IncidentPagination.css'
import {useErrorBoundary} from 'react-error-boundary'
import {UsersListLoading} from '../components/loading/UsersListLoading'

const IncidentsPage = () => {
  const handleError = useErrorBoundary()
  const userID = Number(sessionStorage.getItem('userId'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const location = useLocation()
  const alertData = JSON.parse(localStorage.getItem('alertData'))
  const [selectedAlert, setSelectedAlert] = useState(null)
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
  const [refreshParent, setRefreshParent] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [activePage, setActivePage] = useState(1)
  const [pageCount, setpageCount] = useState(0)
  const [limit, setLimit] = useState(20)
  const [loading, setLoading] = useState(false)
  const [statusFromDashBoard, setStatusFromDashBoard] = useState(location.state?.status || '')
  const [daysFromDashBoard, setDaysFromDashBoard] = useState(location.state?.days || '')

  useEffect(() => {
    const fetchIncidentStatusAndSortOptions = async () => {
      const statusDataRequest = {maserDataType: 'incident_status', orgId: orgId, toolId: toolId}
      const sortOptionsDataRequest = {
        maserDataType: 'IncidentSortOptions',
        orgId: orgId,
        toolId: toolId,
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
  }, [])

  useEffect(() => {
    setStatusFromDashBoard(location.state?.status || '')
    setDaysFromDashBoard(location.state?.days || '')
  }, [location.state])

  useEffect(() => {
    if (statusDropDown.length > 0) {
      fetchIncident()
    }
  }, [statusDropDown, limit])

  const fetchIncident = async () => {
    const data = {
      orgID: orgId,
      paging: {
        rangeStart: (currentPage - 1) * limit + 1,
        rangeEnd: currentPage * limit,
      },
      loggedInUserId: userID,
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
    setSelectedIncident({});
    setActivePage(1); // Set current page to 1 when searching
    setStatusFromDashBoard('');
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
    };
    try {
      setLoading(true);
      const response = await fetchGetIncidentSearchResult(data);
      setIncident(response.incidentList);
      setTotalIncidentsCount(response.totalIncidentsCount);
      const total = response.totalIncidentsCount;
      setpageCount(Math.ceil(total / limit));
      setLoading(false);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };
  

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
    fetchIncident()
  }

  useEffect(() => {
    if (refreshParent) {
      fetchSelectedIncident()
      setRefreshParent(false)
    }
  }, [refreshParent])

  const handlePageClick = async (datas) => {
    const selectedPage = datas.selected + 1;
    setCurrentPage(selectedPage);
    setActivePage(selectedPage);
  
    const data = {
      orgID: orgId,
      paging: {
        rangeStart: (selectedPage - 1) * limit + 1,
        rangeEnd: selectedPage * limit,
      },
      loggedInUserId: userID,
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
    };
  
    if (statusFromDashBoard) {
      const statusItem = statusDropDown.find(
        (item) => item.dataValue === statusFromDashBoard
      );
      if (statusItem) {
        data.statusId = statusItem.dataID;
        data.searchDurationInDays = daysFromDashBoard;
      }
    }
    if (!statusFromDashBoard) {
    if (searchValue || status || sortOption) {
      data.statusId= status.current?.value || 0;
      data.searchText= searchValue || '';
      data.sortOptionId= sortOption.current?.value || 0;
    }
  }
  
    try {
      setLoading(true);
      const response = await fetchGetIncidentSearchResult(data);
      setIncident(response.incidentList);
      setTotalIncidentsCount(response.totalIncidentsCount);
      setpageCount(Math.ceil(response.totalIncidentsCount / limit));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  

  const handlePageSelect = (event) => {
    const selectedPerPage = event.target.value
    setLimit(selectedPerPage)
  }

  useEffect(() => {
    setSelectedIncident(
      incident !== null && incident !== undefined && incident.length > 0 ? incident[0] : {}
    )
  }, [incident])

  return (
    <>
      <div className='mb-5 mb-xl-8 bg-red incident-page'>
        <ToastContainer />
        <div className='card-body1'>
          <div className='row'>
            <div className='col-md-4 border-1 border-gray-300 border-end'>
              <div className='card'>
                <div className='bg-heading'>
                  <h4 className='no-margin no-pad'>
                    <span className='white fw-bold block pt-3 pb-3'>
                      Incidents <span className='white'>({totalIncidentsCount})</span>
                    </span>
                  </h4>
                </div>
                <div className='p-1 bd-highlight'></div>

                <div className='card-title header-filter'>
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
                              <div className='row'>
                                <div className='text-dark'>
                                  <a href='#' className='text-dark'>
                                    <span className='incident-name' title={item.description}>
                                      {item.description}
                                    </span>
                                  </a>
                                </div>
                              </div>
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
                              <div className='d-flex justify-content-between bd-highlight mt-2'>
                                {item.ownerName ? (
                                  <div className='p-1 bd-highlight fs-12'>{item.ownerName}</div>
                                ) : (
                                  <div className='p-1 bd-highlight fs-12'>{item.createdUser}</div>
                                )}
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
        </div>
      </div>
    </>
  )
}

export {IncidentsPage}
