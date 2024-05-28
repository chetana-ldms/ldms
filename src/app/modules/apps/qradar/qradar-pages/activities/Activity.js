import React, { useEffect, useState } from 'react';
import {
  fetchActivitiesUrl,
  fetchActivityTypesUrl,
} from '../../../../../api/ActivityApi';
import { UsersListLoading } from '../components/loading/UsersListLoading';
import { getCurrentTimeZone } from '../../../../../../utils/helper';
import ReactPaginate from 'react-paginate';
import { fetchUsersUrl } from '../../../../../api/ConfigurationApi';
import Select from 'react-select';
import { ToastContainer } from 'react-toastify';
import { notifyFail } from '../components/notification/Notification';

function Activity() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedActivityTypes, setSelectedActivityTypes] = useState([]);
  const [activityType, setActivityType] = useState([]);
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const orgId = Number(sessionStorage.getItem('orgId'));
  const userID = Number(sessionStorage.getItem('userId'));
  const [limit, setLimit] = useState(20);
  const [pageCount, setPageCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activePage, setActivePage] = useState(1);

  const [filters, setFilters] = useState({
    userId: 0,
    activityTypeIds: [],
    fromDate: null,
    toDate: null,
  });

  useEffect(() => {
    const reload = async () => {
      try {
        setLoading(true);
        const data = await fetchUsersUrl(orgId, userID);
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    reload();
  }, [orgId, userID]);

  useEffect(() => {
    const reloadActivityType = async () => {
      try {
        setLoading(true);
        const data = await fetchActivityTypesUrl(null);
        setActivityType(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    reloadActivityType();
  }, []);

  const fetchActivityData = async (page, userID, activityTypeIDs, fromDate, toDate, limit) => {
    const rangeStart = (page - 1) * limit + 1;
    const rangeEnd = page * limit;
    const data = {
      orgId: orgId,
      userId: userID,
      activityTypeIds: activityTypeIDs,
      fromDateTime: fromDate ? fromDate.toISOString() : null,
      toDateTime: toDate ? toDate.toISOString() : null,
      paging: {
        rangeStart: rangeStart,
        rangeEnd: rangeEnd,
      },
    };

    try {
      setLoading(true);
      const response = await fetchActivitiesUrl(data);
      setActivity(response.activitiesList);
      const total = response.totalActivitiesCount;
      setPageCount(Math.ceil(total / limit));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityData(1, filters.userId, filters.activityTypeIds, filters.fromDate, filters.toDate, limit);
  }, [limit, filters]);

  const handlePageSelect = (event) => {
    const selectedPerPage = event.target.value;
    setLimit(selectedPerPage);
    setActivePage(1);
  };

  const handlePageClick = async (data) => {
    let currentPage = data?.selected + 1 || 1;
    const { userId, activityTypeIds, fromDate, toDate } = filters;
    fetchActivityData(currentPage, userId, activityTypeIds, fromDate, toDate, limit);
    setCurrentPage(currentPage);
    setActivePage(currentPage);
  };

  const handleFromDateChange = (e) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setSelectedFromDate(date);
  };

  const handleToDateChange = (e) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setSelectedToDate(date);
  };

  const handleUserChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions);
  };

  const handleActivityTypeChange = (selectedOptions) => {
    setSelectedActivityTypes(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedToDate < selectedFromDate) {
      notifyFail('From date should be less then to Date');
      return;
    }

    const selectedUserIDs = selectedUsers?.value?.userID ? selectedUsers.value.userID : 0;
    const selectedActivityTypeIDs = selectedActivityTypes?.map(activityType => activityType?.value?.activityTypeId) || [];

    setFilters({
      userId: selectedUserIDs,
      activityTypeIds: selectedActivityTypeIDs,
      fromDate: selectedFromDate,
      toDate: selectedToDate,
    });

    fetchActivityData(1, selectedUserIDs, selectedActivityTypeIDs, selectedFromDate, selectedToDate, limit);
  };

  const handleRefresh = (event) => {
    event.preventDefault();
    setIsRefreshing(true);
    setCurrentPage(1);
    fetchActivityData(1, filters.userId, filters.activityTypeIds, filters.fromDate, filters.toDate, limit);
    setActivePage(1);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const handleReset = () => {
    setSelectedUsers([]);
    setSelectedActivityTypes([]);
    setSelectedFromDate(null);
    setSelectedToDate(null);
    setFilters({
      userId: 0,
      activityTypeIds: [],
      fromDate: null,
      toDate: null,
    });
    fetchActivityData(1, 0, [], null, null, limit);
  };

  const userOptions = users?.map(user => ({ label: user.name, value: user }));
  const activityTypeOptions = activityType?.map(type => ({
    label: type.typeName,
    value: type,
  }));

  const css_classes = [
    'text-primary',
    'text-secondary',
    'text-success',
    'text-danger',
    'text-warning',
    'text-info',
    'text-dark',
    'text-muted',
  ];

  const getRandomClass = () => {
    const randomIndex = Math.floor(Math.random() * css_classes.length);
    return css_classes[randomIndex];
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '40px',
      width: '180px',
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
  };
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
  };

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
              placeholder='Users'
              styles={customStyle}
            />
          </div>

          <div className='d-flex align-items-center ps-2'>
            <label className='no-margin pr-2 semi-bold'>Activity Types:</label>
            <Select
              options={activityTypeOptions}
              isMulti
              value={selectedActivityTypes}
              onChange={handleActivityTypeChange}
              placeholder='Select Activity Types'
              styles={customStyles}
            />
          </div>

          <div className='ps-2'>
            <label className='no-margin pr-2 semi-bold'>From Date: </label>
            <input
              className='date'
              type='date'
              value={selectedFromDate ? selectedFromDate.toISOString().split('T')[0] : ''}
              onChange={handleFromDateChange}
            />
          </div>
          <div className='ps-2'>
            <label className='no-margin pr-2 semi-bold'>To Date: </label>
            <input
              className='date'
              type='date'
              value={selectedToDate ? selectedToDate.toISOString().split('T')[0] : ''}
              onChange={handleToDateChange}
            />
          </div>

          <button className='btn btn-primary btn-small ms-1' onClick={handleSubmit}>
            <i className='fa fa-search white' />
          </button>
          <button className='btn btn-primary btn-small ms-1 ' onClick={handleReset}>
            Reset
          </button>
          <div className='ds-reload mt-2 ms-3 float-right'>
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
            {activity && activity.length > 0 ? (
              activity
                .sort((a, b) => b.activityId - a.activityId)
                .map((item) => {
                  const formattedDateTime = getCurrentTimeZone(item.activityDate);

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
                  );
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
  );
}

export default Activity;
