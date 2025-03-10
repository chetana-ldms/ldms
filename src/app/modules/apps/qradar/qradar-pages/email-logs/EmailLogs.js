import React, {useState, useEffect} from 'react'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  fetchEmaillogsOutboundStreamUrl,
  fetchEmaillogsOutboundUrl,
} from '../../../../../api/EmailLogsApi'
import ReactPaginate from 'react-paginate'
import {notifyFail} from '../components/notification/Notification'
import {truncateText} from '../../../../../../utils/TruncateText'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import EmailLogsDetailsPopUp from './EmailLogsDetailsPopUp'
import {fetchMasterData} from '../../../../../api/Api'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import useFeatureActions from '../configuration/useFeatureActions'

const EmailLogs = () => {
  const [limit, setLimit] = useState(20)
  const [activePage, setActivePage] = useState(1)
  const [alertsCount, setAlertsCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredAlertData, setFilteredAlertDate] = useState([])
  const [loading, setLoading] = useState(false)
  const [fromDateTime, setFromDateTime] = useState('')
  const [toDateTime, setToDateTime] = useState('')
  const [isInitialLoad, setIsInitialLoad] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  console.log(selectedItem, 'selectedItem')
  const [showPopupEdit, setShowPopupEdit] = useState(false)
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const [fullDay, setFullDay] = useState(false)
  const [dropdownData, setDropdownData] = useState({
    observableTagDropDown: [],
  })
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))
  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }
  const {observableTagDropDown} = dropdownData
  useEffect(() => {
    const fetchAllMasterData = async () => {
      const tagsDataRequest = {maserDataType: 'EmailLogs_Filters', orgId: orgId, toolId: toolId}
      try {
        const [tagsData] = await Promise.all([fetchMasterData(tagsDataRequest)])

        setDropdownData((prevDropdownData) => ({
          ...prevDropdownData,
          observableTagDropDown: tagsData,
          observableTag: tagsData.length > 0 ? tagsData[0].dataValue : '', // Set first item as selected
        }))
      } catch (error) {
        console.log(error)
      }
    }

    fetchAllMasterData()
  }, [])

  const openPopupEdit = () => {
    setShowPopupEdit(true)
  }

  const closePopupEdit = () => {
    setShowPopupEdit(false)
  }
  const getFormattedLocalDateTime = (date) => {
    const offset = date.getTimezoneOffset() * 60000
    const localDate = new Date(date - offset)
    return localDate.toISOString().slice(0, 16)
  }

  const getCurrentDateTime = () => {
    return getFormattedLocalDateTime(new Date())
  }

  const getTwoDaysAgoDateTime = () => {
    const now = new Date()
    now.setDate(now.getDate() - 20)
    return getFormattedLocalDateTime(now)
  }
  const toUTCFormat = (dateTime) => {
    if (!dateTime) return ''
    const localDate = new Date(dateTime)
    return localDate.toISOString() // Converts to UTC format
  }

  const qradaralerts = async (page = currentPage, selectedObservableTag = '') => {
    const rangeStart = (page - 1) * limit + 1
    const rangeEnd = page * limit

    let data2 = {
      orgId: orgId,
      toolId: toolId,
      paging: {
        rangeStart: rangeStart,
        rangeEnd: rangeEnd,
      },
      emaillogsFilterName: dropdownData?.observableTag || selectedObservableTag,
      searchText: searchValue || '',
      fromDateTime: toUTCFormat(fromDateTime),
      toDateTime: toUTCFormat(toDateTime),
    }

    setLoading(true)
    const response = await fetchEmaillogsOutboundUrl(data2)
    setAlertsCount(response.totalAlerts)
    setPageCount(Math.ceil(response.totalAlerts / limit))
    setFilteredAlertDate(response?.emailLogs)
    setLoading(false)
  }

  useEffect(() => {
    setFromDateTime(getTwoDaysAgoDateTime())
    setToDateTime(getCurrentDateTime())
    setIsInitialLoad(true)
  }, [])

  useEffect(() => {
    if (isInitialLoad && fromDateTime && toDateTime) {
      qradaralerts(currentPage)
    }
  }, [limit, isInitialLoad])
  const handlePageClick = async (data) => {
    const newPage = data.selected + 1
    setCurrentPage(newPage)
    setActivePage(newPage)
    qradaralerts(newPage)
  }
  const handlePageSelect = (event) => {
    const selectedPerPage = event.target.value
    setLimit(selectedPerPage)
    setCurrentPage(1)
    setActivePage(1)
  }
  const handleFullDayCheckboxChange = (e) => {
    const isChecked = e.target.checked
    setFullDay(isChecked)

    if (isChecked) {
      const currentDate = new Date()
      const past24HoursDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)

      // Convert local time to ISO format without changing the timezone
      const formatDateTimeLocal = (date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
      }

      setFromDateTime(formatDateTimeLocal(past24HoursDate))
      setToDateTime(formatDateTimeLocal(currentDate))
    }
  }

  const handleDateFilterChange = () => {
    if (new Date(fromDateTime) >= new Date(toDateTime)) {
      notifyFail('From Date must be less than To Date')
      return
    }
    const selectedObservableTag = dropdownData.observableTag || ''
    setCurrentPage(1)
    setActivePage(1)
    qradaralerts(1, selectedObservableTag)
  }

  const handleExport = async () => {
    try {
      const requestData = {
        orgId,
        toolId,
        fromDateTime,
        toDateTime,
      }
      const response = await fetchEmaillogsOutboundStreamUrl(requestData)
      const parsedData = response // Directly use response as JSON
      if (!Array.isArray(parsedData) || parsedData.length === 0) {
        console.error('No data available to export')
        return
      }
      const csv = convertJsonToCsv(parsedData)
      const csvBlob = new Blob([csv], {type: 'text/csv;charset=utf-8;'})
      const csvUrl = URL.createObjectURL(csvBlob)
      const link = document.createElement('a')
      link.href = csvUrl
      link.download = 'email_logs.csv' // CSV File
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading CSV file:', error)
    }
  }
  const convertJsonToCsv = (jsonData) => {
    if (!jsonData.length) return ''
    const excludedFields = [
      'Id',
      'OrgId',
      'ToolId',
      'CreatedUser',
      'ModifiedUser',
      'ModifiedDate',
      'MessageData',
      'CreatedDate',
    ]
    const headers = Object.keys(jsonData[0])
      .filter((key) => !excludedFields.includes(key)) // Remove unwanted fields
      .join(',')
    const rows = jsonData.map((obj) =>
      Object.entries(obj)
        .filter(([key]) => !excludedFields.includes(key)) // Remove unwanted fields
        .map(([_, value]) => `"${value}"`) // Wrap values in quotes to handle commas
        .join(',')
    )

    return `${headers}\n${rows.join('\n')}`
  }
  const handleTableRowClick = (item) => {
    setSelectedItem(item)
    setShowPopupEdit(true)
  }

  return (
    <div className='activity-timeline'>
      <ToastContainer />
      <div className='card header-filter mb-2 pad-10'>
        <div className='d-flex'>
          <div className='ms-5 d-flex align-items-center mt-5 mr-1'>
            <input
              type='checkbox'
              className='form-check-input me-5'
              id='fullDayCheckbox'
              checked={fullDay}
              onChange={handleFullDayCheckboxChange}
            />
            <label htmlFor='fullDayCheckbox' className='semi-bold ms-4'>
              Last 24 Hrs
            </label>
          </div>
          <div className='mr-1'>
            <label className='no-margin semi-bold'>From Date :</label>
            <input
              type='datetime-local'
              className='form-control form-control-sm'
              value={fromDateTime}
              onChange={(e) => setFromDateTime(e.target.value)}
              max={toDateTime || getCurrentDateTime()}
              disabled={fullDay}
            />
          </div>
          <div className='mr-1'>
            <label className='no-margin semi-bold'>To Date :</label>
            <input
              type='datetime-local'
              className='form-control form-control-sm'
              value={toDateTime}
              onChange={(e) => setToDateTime(e.target.value)}
              min={fromDateTime}
              max={getCurrentDateTime()}
              disabled={fullDay}
            />
          </div>
          <div className='mr-1'>
            <label className='no-margin semi-bold'>Email Type :</label>
            <select
              className='form-control form-control-sm'
              value={dropdownData.observableTag}
              onChange={(e) =>
                setDropdownData((prevData) => ({
                  ...prevData,
                  observableTag: e.target.value,
                }))
              }
            >
              <option value=''>Select</option>
              {observableTagDropDown.length > 0 &&
                observableTagDropDown.map((item) => (
                  <option key={item.dataID} value={item.dataValue}>
                    {item.dataValue}
                  </option>
                ))}
            </select>
          </div>
          <div className='mr-1'>
            <label className='no-margin semi-bold'>Search Text :</label>
            <input
              type='text'
              className='form-control form-control-sm'
              placeholder='Search Custom Alerts'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          <button
            className='btn btn-primary btn-sm me-2'
            style={{height: 40, marginTop: 15}}
            onClick={handleDateFilterChange}
          >
            <i className='fa fa-search white' />
          </button>
          <div
            className='btn btn-border btn-small'
            style={{height: 40, marginTop: 15, width: 110}}
            onClick={handleExport}
          >
            Export <i className='fa fa-file-export link mg-left-5' />
          </div>
        </div>
      </div>
      <div className='card-body no-pad'>
        <table className='table alert-table fixed-table scroll-x'>
          {filteredAlertData !== null && (
            <thead>
              <tr className='fw-bold text-muted bg-blue'>
                <th>Date and Time</th>
                <th>Message Subject</th>
                <th>Sender Address</th>
                <th>Recipient Address</th>
                <th>Message Id</th>
              </tr>
            </thead>
          )}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan='5' className='text-center'>
                  <UsersListLoading />
                </td>
              </tr>
            ) : filteredAlertData !== null && filteredAlertData.length > 0 ? (
              filteredAlertData.map((item, index) => (
                <tr
                  key={index}
                  className='fs-12 table-row'
                  onClick={() => handleTableRowClick(item)}
                  style={{cursor: 'pointer'}}
                >
                  <td>{getCurrentTimeZone(item.createdDate)}</td>
                  <td title={item.messageSubject}>{truncateText(item.messageSubject, 30)}</td>
                  <td title={item.senderAddress}>{item.senderAddress}</td>
                  <td title={item.recipientAddress}>{truncateText(item.recipientAddress, 30)}</td>
                  <td title={item.messageId}>{truncateText(item.messageId, 40)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='5' className='text-center'>
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showPopupEdit && selectedItem && (
          <EmailLogsDetailsPopUp
            show={openPopupEdit}
            onClose={closePopupEdit}
            selectedItem={selectedItem}
          />
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
    </div>
  )
}

export default EmailLogs
