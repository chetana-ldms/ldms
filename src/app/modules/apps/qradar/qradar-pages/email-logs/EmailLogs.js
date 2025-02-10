import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchEmaillogsOutboundUrl } from '../../../../../api/EmailLogsApi';
import ReactPaginate from 'react-paginate';
import { notifyFail } from '../components/notification/Notification';
import { truncateText } from '../../../../../../utils/TruncateText';

const EmailLogs = () => {
  const [limit, setLimit] = useState(20);
  const [activePage, setActivePage] = useState(1)
  const [alertsCount, setAlertsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [filteredAlertData, setFilteredAlertDate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDateTime, setFromDateTime] = useState('');
  const [toDateTime, setToDateTime] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(false);

  const orgId = Number(sessionStorage.getItem('orgId'));
  const toolId = Number(sessionStorage.getItem('toolID'));
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  const getTwoDaysAgoDateTime = () => {
    const now = new Date();
    now.setDate(now.getDate() - 10);
    return now.toISOString().slice(0, 16);
  };
  const toUTCFormat = (dateString) => {
    return dateString ? new Date(dateString).toISOString() : '';
  };
  const qradaralerts = async (page = currentPage) => {
    const rangeStart = (page - 1) * limit + 1;
    const rangeEnd = page * limit;

    let data2 = {
      orgId: orgId,
      toolId: toolId,
      paging: {
        rangeStart: rangeStart,
        rangeEnd: rangeEnd,
      },
      fromDateTime: toUTCFormat(fromDateTime),
      toDateTime: toUTCFormat(toDateTime),
    };

    setLoading(true);
    const response = await fetchEmaillogsOutboundUrl(data2);
    setAlertsCount(response.totalAlerts);
    setPageCount(Math.ceil(response.totalAlerts / limit));
    setFilteredAlertDate(response?.emailLogs);
    setLoading(false);
  };

  useEffect(() => {
    setFromDateTime(getTwoDaysAgoDateTime());
    setToDateTime(getCurrentDateTime());
    setIsInitialLoad(true);
  }, []);
  
  useEffect(() => {
    if (isInitialLoad && fromDateTime && toDateTime) {
      qradaralerts(currentPage);
    }
  }, [limit, isInitialLoad]); 
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
  const handleDateFilterChange = () => {
    if (new Date(fromDateTime) >= new Date(toDateTime)) {
      notifyFail('From Date must be less than To Date');
      return;
    }
    setCurrentPage(1);
    setActivePage(1)
    qradaralerts(1);
  };
  return (
    <div className='card pad-10 config'>
      <ToastContainer />
      <div className='card-header no-pad d-flex align-items-center'>
        <div className='d-flex mb-5'>
          <div className='d-flex'>
            <label className='form-label mt-2' style={{width:115}}>From Date :</label>
            <input
              type='datetime-local'
              className='form-control form-control-sm'
              value={fromDateTime}
              onChange={(e) => setFromDateTime(e.target.value)}
              max={toDateTime || getCurrentDateTime()} 
            />
          </div>
          <div className='d-flex'>
            <label className='form-label ms-5 mt-2'style={{width:94}}>To Date :</label>
            <input
              type='datetime-local'
              className='form-control form-control-sm'
              value={toDateTime}
              onChange={(e) => setToDateTime(e.target.value)}
              min={fromDateTime}
              max={getCurrentDateTime()}
            />
          </div>
          <button className='btn btn-primary btn-sm ms-2' onClick={handleDateFilterChange}>
            Search
          </button>
        </div>
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
              <th>Delivery Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan='7' className='text-center'>
                  Loading...
                </td>
              </tr>
            ) : filteredAlertData !== null ? (
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
                <td colSpan='7' className='text-center'>
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
  );
};

export default EmailLogs;
