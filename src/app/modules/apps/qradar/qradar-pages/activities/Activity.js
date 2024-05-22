import React, {useEffect, useState} from 'react'
import {
  fetchActivitiesUrl,
  fetchActivityTypesUrl,
  fetchSetOfActivity,
} from '../../../../../api/ActivityApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import ReactPaginate from 'react-paginate'
import {fetchUsersUrl} from '../../../../../api/ConfigurationApi'
import Select from 'react-select'
import {ToastContainer} from 'react-toastify'
import {notifyFail} from '../components/notification/Notification'

function Activity() {
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedActivityTypes, setSelectedActivityTypes] = useState([])
  const [activityType, setActivityType] = useState([])
  const [selectedFromDate, setSelectedFromDate] = useState(null)
  const [selectedToDate, setSelectedToDate] = useState(null)
  const orgId = Number(sessionStorage.getItem('orgId'))
  const userID = Number(sessionStorage.getItem('userId'))
  const [limit, setLimit] = useState(20)
  const [pageCount, setPageCount] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [activePage, setActivePage] = useState(1)
  console.log(currentPage, 'currentPage')

  const reload = async () => {
    try {
      setLoading(true)
      const data = await fetchUsersUrl(orgId, userID)
      setUsers(data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  const reloadActivityType = async () => {
    try {
      setLoading(true)
      const data = await fetchActivityTypesUrl(null)
      setActivityType(data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    reloadActivityType()
  }, [])

  const fetchData = async () => {
    const data = {
      orgId: orgId,
      userId: 0,
      activityTypeIds: [],
      fromDateTime: selectedFromDate ? selectedFromDate.toISOString() : null,
      toDateTime: selectedToDate ? selectedToDate.toISOString() : null,
      paging: {
        rangeStart: 1,
        rangeEnd: limit,
      },
    }

    try {
      setLoading(true)
      const response = await fetchActivitiesUrl(data)
      setActivity(response.activitiesList)
      const total = response.totalActivitiesCount
      setPageCount(Math.ceil(total / limit))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handlePageSelect = (event) => {
    const selectedPerPage = event.target.value
    setLimit(selectedPerPage)
    setActivePage(1)
  }

  const handlePageClick = async (data) => {
    let currentPage = data?.selected + 1 || 1
    setLoading(true)
    try {
      const setOfAlertsData = await fetchSetOfActivity(
        currentPage,
        orgId,
        0,
        selectedFromDate,
        selectedToDate,
        limit
      )
      setActivity(setOfAlertsData)
      setCurrentPage(currentPage)
    setActivePage(currentPage);
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [limit])

  const handleFromDateChange = (e) => {
    const date = e.target.value ? new Date(e.target.value) : null
    setSelectedFromDate(date)
  }

  const handleToDateChange = (e) => {
    const date = e.target.value ? new Date(e.target.value) : null
    setSelectedToDate(date)
  }

  const handleUserChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions)
  }

  const handleActivityTypeChange = (selectedOptions) => {
    setSelectedActivityTypes(selectedOptions)
  }

  const userOptions = users?.map((user) => ({label: user.name, value: user}))
  const activityTypeOptions = activityType?.map((type) => ({
    label: type.typeName,
    value: type,
  }))
  const css_classes = [
    'text-primary',
    'text-secondary',
    'text-success',
    'text-danger',
    'text-warning',
    'text-info',
    'text-dark',
    'text-muted',
  ]

  const getRandomClass = () => {
    const randomIndex = Math.floor(Math.random() * css_classes.length)
    return css_classes[randomIndex]
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedToDate < selectedFromDate) {
      notifyFail('From date should be less then to Date')
      setLoading(false)
      return
    }

    const selectedUserIDs = selectedUsers?.value?.userID ? selectedUsers.value.userID : 0
    const selectedActivityTypeIDs = selectedActivityTypes?.map(
      (activityType) => activityType?.value?.activityTypeId
    )

    const data = {
      orgId: orgId,
      userId: selectedUserIDs,
      activityTypeIds: selectedActivityTypeIDs ? selectedActivityTypeIDs : [0],
      fromDateTime: selectedFromDate ? selectedFromDate.toISOString() : null,
      toDateTime: selectedToDate ? selectedToDate.toISOString() : null,
      paging: {
        rangeStart: 1,
        rangeEnd: limit,
      },
    }

    try {
      setLoading(true)
      const response = await fetchActivitiesUrl(data)
      setActivity(response.activitiesList)
      const total = response.totalActivitiesCount
      setPageCount(Math.ceil(total / limit))
      setActivePage(1);
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      // setSelectedUsers([]);
      // setSelectedActivityTypes([]);
      // setSelectedFromDate(null);
      // setSelectedToDate(null);
    }
  }

  const handleRefresh = (event) => {
    event.preventDefault()
    setIsRefreshing(true)
    setCurrentPage(1)
    fetchData(1)
    setActivePage(1);
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  return (
    <div className='activity-timeline'>
      <ToastContainer />
      <h1 className='mb-5'>Activity</h1>
      <div className='card header-filter mb-5 pad-10'>
        <div className='d-flex'>
          <div className='d-flex align-items-center'>
            <label className='no-margin pr-2 semi-bold'>Users:</label>
            <Select
              options={userOptions}
              isMulti={false}
              value={selectedUsers}
              onChange={handleUserChange}
              placeholder='Select Users'
            />
          </div>

          <div className='d-flex align-items-center ps-5'>
            <label className='no-margin pr-2 semi-bold'>Activity Types:</label>
            <Select
              options={activityTypeOptions}
              isMulti
              value={selectedActivityTypes}
              onChange={handleActivityTypeChange}
              placeholder='Select Activity Types'
            />
          </div>

          <div className='ps-5'>
            <label className='no-margin pr-2 semi-bold'>From Date: </label>
            <input
              className='date'
              type='date'
              value={selectedFromDate ? selectedFromDate.toISOString().split('T')[0] : ''}
              onChange={handleFromDateChange}
            />
          </div>
          <div className='ps-5'>
            <label className='no-margin pr-2 semi-bold'>To Date: </label>
            <input
              className='date'
              type='date'
              value={selectedToDate ? selectedToDate.toISOString().split('T')[0] : ''}
              onChange={handleToDateChange}
            />
          </div>

          <button className='btn btn-circle btn-new ms-5 pad-10 mt-1' onClick={handleSubmit}>
            <i className='fa fa-search white' />
          </button>
          <div className='ds-reload mt-2 ms-10 float-right'>
            <span className='fs-13 fc-gray' onClick={handleRefresh}>
              <i
                className={`fa fa-refresh link ${isRefreshing ? 'rotate' : ''}`}
                title='Auto refresh every 2 minutes'
              />
            </span>
          </div>
        </div>
      </div>
      {loading ? (
        <UsersListLoading />
      ) : (
        <div className='card'>
          <div className='timeline-label mt-10 mb-10 ps-20'>
            {activity !== null && activity !== undefined ? (
              activity
                .sort((a, b) => b.activityId - a.activityId)
                .map((item) => {
                  const formattedDateTime = getCurrentTimeZone(item.activityDate)

                  return (
                    <div className='timeline-item' key={item.activityId}>
                      <div className='timeline-label fw-bold text-gray-800 fs-6'>
                        <p className='semi-bold'>{formattedDateTime}</p>
                        <p className='text-muted normal'>{item.createedUser}</p>
                      </div>

                      <div className='timeline-badge'>
                        <i className={`fa fa-genderless ${getRandomClass()} fs-1`}></i>
                      </div>
                      <div className='fw-semibold text-gray-700 ps-3 fs-7'>
                        {item.primaryDescription}
                      </div>
                    </div>
                  )
                })
            ) : (
              <div className='text-gray-500 text-center'>No data found</div>
            )}
          </div>
        </div>
      )}

      <div className='card mt-5'>
        <div className='d-flex justify-content-end align-items-center pagination-bar pt-3 pb-3'>
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
      </div>
    </div>
  )
}

export default Activity
