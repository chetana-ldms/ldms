import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {notify, notifyFail} from '../components/notification/Notification'
import {useErrorBoundary} from 'react-error-boundary'
import useFeatureActions from '../configuration/useFeatureActions'
import {fetchEmaillogsOutboundUrl} from '../../../../../api/EmailLogsApi'
import {truncateText} from '../../../../../../utils/TruncateText'
import ReactPaginate from 'react-paginate'

const EmailLogs = () => {
  const [limit, setLimit] = useState(20)
  const [alertsCount, setAlertsCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setpageCount] = useState(0)
  const [filteredAlertData, setFilteredAlertDate] = useState([])
  console.log(filteredAlertData, 'filteredAlertData')
  const [activePage, setActivePage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedFilterValue, setSelectedFilterValue] = useState(1)
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))

  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const qradaralerts = async (page = currentPage) => {
    const rangeStart = (page - 1) * limit + 1
    const rangeEnd = page * limit
    let data2 = {
      orgId: orgId,
      toolId: toolId,
      paging: {
        rangeStart: rangeStart,
        rangeEnd: rangeEnd,
      },
      fromDateTime: '2025-02-01T05:10:47.534Z',
      toDateTime: '2025-02-10T05:10:47.534Z',
    }
    setLoading(true)
    const response = await fetchEmaillogsOutboundUrl(data2)
    setAlertsCount(response.totalAlerts)
    const total = response.totalAlerts
    setpageCount(Math.ceil(total / limit))
    setFilteredAlertDate(response?.emailLogs)
    setLoading(false)
  }
  useEffect(() => {
    qradaralerts(currentPage)
  }, [limit])
  const handleFilterChange = async (e) => {
    const value = e.target.value
    setSelectedFilterValue(value)
    setActivePage(1)
    const data2 = {
      orgId: orgId,
      toolId: toolId,
      paging: {
        rangeStart: 1,
        rangeEnd: limit,
      },
      searchDurationInDays: Number(value) || 0,
    }
    try {
      setLoading(true)
      const response = await fetchEmaillogsOutboundUrl(data2)
      setAlertsCount(response.totalAlerts)
      const total = response.totalAlerts
      setpageCount(Math.ceil(total / limit))
      setFilteredAlertDate(response?.emailLogs)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
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

  return (
    <div className='card pad-10 config'>
      <ToastContainer />
      <div className='card-header no-pad'>
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
              <option value='1'>1 Day</option>
              <option value='2'>2 Day</option>
              <option value='3'>3 Day</option>
              <option value='4'>4 Day</option>
              <option value='5'>5 Day</option>
            </select>
          </div>
        </div>

        <div className='card-toolbar'></div>
      </div>
      <div className='card-body no-pad'>
        <table className='table alert-table fixed-table scroll-x'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th>Date and Time</th>
              <th>Message Id</th>
              <th>Sender Address</th>
              <th>Recipient Address</th>
              <th>Message Subject</th>
              <th>Delivary Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {filteredAlertData !== null ? (
              filteredAlertData.map((item, index) => (
                <tr key={index} className='fs-12 table-row'>
                  <td>{item.createdDate}</td>
                  <td title={item.messageId}>{truncateText(item.messageId, 30)}</td>
                  <td title={item.senderAddress}>{item.senderAddress}</td>
                  <td title={item.recipientAddress}>{truncateText(item.recipientAddress, 30)}</td>
                  <td title={item.messageSubject}>{truncateText(item.messageSubject, 30)}</td>
                  <td>{item.deliveryStatus}</td>
                  <td>{item.messageAction}</td>
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
      </div>
    </div>
  )
}

export default EmailLogs
