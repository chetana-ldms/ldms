import React, {useEffect, useState} from 'react'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import ReactPaginate from 'react-paginate'
import {fetchUsersUrl} from '../../../../../api/ConfigurationApi'
import Select from 'react-select'
import {ToastContainer} from 'react-toastify'
import {notifyFail} from '../components/notification/Notification'
import {fetchApplicationLogsUrl} from '../../../../../api/ApplicationLogsApi'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {truncateText} from '../../../../../../utils/TruncateText'
import EndpointPopupSentinal from '../Setinels/EndpointPopupSentinal'
import ApplicationLogsModel from './ApplicationLogsModel'

function ApplicationLogs() {
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState({label: 'Select', value: 0})
  const [selectedActivityTypes, setSelectedActivityTypes] = useState([])
  const [activityType, setActivityType] = useState([])
  const [selectedEndpoint, setSelectedEndpoint] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [ipAddress, setIpAddress] = useState('')
  const [traceId, setTraceId] = useState('')
  const [severity, setSeverity] = useState('')
  const [searchText, setSearchText] = useState('')
  const [selectedFromDate, setSelectedFromDate] = useState(null)
  const [selectedToDate, setSelectedToDate] = useState(null)
  console.log(selectedToDate, 'selectedToDate')
  const orgId = Number(sessionStorage.getItem('orgId'))
  const userID = Number(sessionStorage.getItem('userId'))
  const [limit, setLimit] = useState(20)
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  console.log(currentPage, 'currentPage')
  const [activePage, setActivePage] = useState(1)
  const [filters, setFilters] = useState({
    userId: Number(sessionStorage.getItem('userId')),
    fromDate: null,
    toDate: null,
    severity: '',
    ipAddress: '',
    traceId: '',
    searchText: '',
  })
  useEffect(() => {
    const reload = async () => {
      try {
        setLoading(true)
        const data = await fetchUsersUrl(orgId, userID)
        setUsers(data)
        const loggedInUser = data.find((user) => user.userID === userID)
        if (loggedInUser) {
          setSelectedUsers({value: loggedInUser.userID, label: loggedInUser.name})
        }
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    reload()
  }, [orgId, userID])

  const fetchActivityData = async (page, userID, fromDate, toDate, limit) => {
    const rangeStart = (page - 1) * limit + 1
    const rangeEnd = page * limit

    const data = {
      orgId: orgId,
      userId: userID,
      severity: filters.severity || '',
      ipAddress: filters.ipAddress || '',
      traceId: filters.traceId || '',
      searchText: filters.searchText || '',
      appLogsFromDate: fromDate ? fromDate.toISOString() : null,
      appLogsToDate: toDate ? toDate.toISOString() : null,
      paging: {
        rangeStart: rangeStart,
        rangeEnd: rangeEnd,
      },
    }

    try {
      setLoading(true)
      const response = await fetchApplicationLogsUrl(data)
      setActivity(response?.getApplicationLogs)
      const total = response?.totalRecords
      setPageCount(Math.ceil(total / limit))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchActivityData(1, filters.userId, filters.fromDate, filters.toDate, limit)
  }, [limit, filters])

  const handlePageSelect = (event) => {
    const selectedPerPage = event.target.value
    setLimit(selectedPerPage)
    setActivePage(1)
  }

  const handlePageClick = async (data) => {
    let currentPage = data?.selected + 1 || 1
    const {userId, fromDate, toDate} = filters
    fetchActivityData(currentPage, userId, fromDate, toDate, limit)
    setCurrentPage(currentPage)
    setActivePage(currentPage)
  }

  const handleFromDateChange = (e) => {
    const date = e.target.value ? new Date(e.target.value) : null
    setSelectedFromDate(date)
  }
  const handleToDateChange = (e) => {
    const date = e.target.value ? new Date(e.target.value) : null
    if (date) {
      const currentDate = new Date()
      date.setUTCHours(currentDate.getUTCHours())
      date.setUTCMinutes(currentDate.getUTCMinutes())
      date.setUTCSeconds(currentDate.getUTCSeconds())
      date.setUTCMilliseconds(currentDate.getUTCMilliseconds())
    }
    setSelectedToDate(date)
  }

  const handleUserChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions)
  }
  const handleSubmit = (e) => {
    e.preventDefault()

    if (selectedToDate < selectedFromDate) {
      notifyFail('From date should be less than To date')
      return
    }

    const selectedUserIDs = selectedUsers?.value?.userID
      ? selectedUsers.value.userID
      : Number(sessionStorage.getItem('userId'))

    setFilters({
      userId: selectedUserIDs,
      fromDate: selectedFromDate,
      toDate: selectedToDate,
      severity: severity,
      ipAddress: ipAddress,
      traceId: traceId,
      searchText: searchText,
    })

    setCurrentPage(1)
    setActivePage(1)
  }

  const handleReset = () => {
    setSelectedFromDate(null)
    setSelectedToDate(null)
    setCurrentPage(1)
    setActivePage(1)
    setSeverity('')
    setIpAddress('')
    setTraceId('')
    setSearchText('')
    setFilters({
      userId: Number(sessionStorage.getItem('userId')),
      fromDate: null,
      toDate: null,
      severity: '',
      ipAddress: '',
      traceId: '',
      searchText: '',
    })
  }

  const userOptions = users?.map((user) => ({label: user.name, value: user}))
  const customStyle = {
    control: (base, state) => ({
      ...base,
      minHeight: '40px',
      width: '120px',
    }),
    valueContainer: (base) => ({
      ...base,
      height: '40px',
      overflow: 'hidden',
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: 'lightgray',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: 'black',
    }),
  }
  const handleEndpointClick = (item) => {
    setSelectedEndpoint(item)
    setShowPopup(true)
  }

  return (
    <div className='activity-timeline'>
      <ToastContainer />
      <h2 className='mb-2'>Application Logs</h2>
      <div className='card header-filter mb-2 pad-10'>
        <div className='d-flex'>
          <div className='mr-1'>
            <label className='no-margin semi-bold'>Users :</label>
            <Select
              options={userOptions}
              isMulti={false}
              value={selectedUsers}
              onChange={handleUserChange}
              placeholder='Users'
              styles={customStyle}
            />
          </div>
          <div className='mr-1'>
            <label className='no-margin semi-bold'>Severity :</label>
            <select
              className='form-control p-0 px-5'
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              style={{height: 40}}
            >
              <option value=''>Select Severity</option>
              <option value='Information'>Information</option>
              <option value='Error'>Error</option>
              <option value='Warning'>Warning</option>
              <option value='Debug'>Debug</option>
            </select>
          </div>
          <div className='mr-1'>
            <label className='no-margin semi-bold'>IP Address : </label>
            <input
              className='form-control'
              style={{height: 40}}
              type='text'
              placeholder='Enter IP Address'
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
          </div>
          <div className='mr-1'>
            <label className='no-margin semi-bold'>Trace ID : </label>
            <input
              className='form-control'
              style={{height: 40}}
              type='text'
              placeholder='Enter Trace ID'
              value={traceId}
              onChange={(e) => setTraceId(e.target.value)}
            />
          </div>
          <div className='mr-1'>
            <label className='no-margin semi-bold'>Search Text: </label>
            <input
              className='form-control'
              style={{height: 40}}
              type='text'
              placeholder='Enter search text'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className='mr-1' style={{width: 125}}>
            <label className='no-margin semi-bold'>From Date : </label>
            <input
              className='date'
              type='date'
              value={selectedFromDate ? selectedFromDate.toISOString().split('T')[0] : ''}
              onChange={handleFromDateChange}
            />
          </div>
          <div className='mr-1'>
            <label className='no-margin semi-bold'>To Date : </label>
            <input
              className='date'
              type='date'
              value={selectedToDate ? selectedToDate.toISOString().split('T')[0] : ''}
              onChange={handleToDateChange}
            />
          </div>

          <button
            className='btn btn-primary btn-small'
            style={{height: 40, marginTop: 15}}
            onClick={handleSubmit}
          >
            <i className='fa fa-search white' />
          </button>
          <button
            className='btn btn-primary btn-small ms-1'
            style={{height: 40, marginTop: 15}}
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
      {loading ? (
        <UsersListLoading />
      ) : (
        <div className='card-body no-pad'>
          <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
            <thead>
              <tr className='fw-bold text-muted bg-blue'>
                <th>Severity</th>
                <th>Message</th>
                <th>User Name</th>
                <th>Time stamp</th>
                <th>Ip Address</th>
                <th>Log Source</th>
                <th>TraceId</th>
              </tr>
            </thead>
            <tbody>
              {loading && <UsersListLoading />}

              {activity !== null ? (
                activity.map((item, index) => (
                  <tr
                    key={index}
                    className='fs-12 table-row'
                    onClick={() => handleEndpointClick(item)}
                  >
                    <td
                      style={{
                        color: item.severity === 'Error' ? 'red' : 'inherit',
                      }}
                    >
                      {item.severity}
                    </td>

                    <td title={item.message}>{truncateText(item.message, 20)}</td>
                    <td>{item.username}</td>
                    <td>{getCurrentTimeZone(item.timestamp)}</td>
                    <td>{item.ipAddress}</td>
                    <td title={item.logSource}>{truncateText(item.logSource, 20)}</td>
                    <td>{item.traceId}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='6' className='text-center'>
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <ApplicationLogsModel
            selectedEndpoint={selectedEndpoint}
            showModal={showPopup}
            setShowModal={setShowPopup}
          />
        </div>
      )}

      <div className='card mt-2'>
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

export default ApplicationLogs
