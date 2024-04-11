import React, { useEffect, useState } from "react";
import {
  fetchActivitiesUrl,
  fetchActivityTypesUrl,
  fetchSetOfActivity,
} from "../../../../../api/ActivityApi";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { getCurrentTimeZone } from "../../../../../../utils/helper";
import ReactPaginate from "react-paginate";
import { fetchUsersUrl } from "../../../../../api/ConfigurationApi";
import Select from "react-select";

function Activity() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedActivityTypes, setSelectedActivityTypes] = useState([]);
  const [activityType, setActivityType] = useState([]);
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const orgId = Number(sessionStorage.getItem("orgId"));
  const [limit, setLimit] = useState(20);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  console.log(currentPage, "currentPage");

  const reload = async () => {
    try {
      setLoading(true);
      const data = await fetchUsersUrl(orgId);
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

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

  useEffect(() => {
    reloadActivityType();
  }, []);

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
    fetchData();
  }, []);

  const handlePageSelect = (event) => {
    const selectedPerPage = event.target.value;
    setLimit(selectedPerPage);
  };

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setLoading(true);
    try {
      const setOfAlertsData = await fetchSetOfActivity(
        currentPage,
        orgId,
        0,
        selectedFromDate,
        selectedToDate,
        limit
      );
      setActivity(setOfAlertsData);
      setCurrentPage(currentPage);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [limit]);

  const handleFromDateChange = (date) => {
    setSelectedFromDate(date);
  };

  const handleToDateChange = (date) => {
    setSelectedToDate(date);
  };

  const handleUserChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions);
  };

  const handleActivityTypeChange = (selectedOptions) => {
    setSelectedActivityTypes(selectedOptions);
  };

  const userOptions = users.map((user) => ({ label: user.name, value: user }));
  const activityTypeOptions = activityType.map((type) => ({
    label: type.typeName,
    value: type,
  }));
  const css_classes = [
    "text-primary",
    "text-secondary",
    "text-success",
    "text-danger",
    "text-warning",
    "text-info",
    "text-dark",
    "text-muted",
  ];

  const getRandomClass = () => {
    const randomIndex = Math.floor(Math.random() * css_classes.length);
    return css_classes[randomIndex];
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedUserIDs = selectedUsers?.value?.userID
      ? selectedUsers.value.userID
      : 0;
    const selectedActivityTypeIDs = selectedActivityTypes.map(
      (activityType) => activityType.value.activityTypeId
    );

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
      setSelectedUsers([]);
      setSelectedActivityTypes([]);
      setSelectedFromDate(null);
      setSelectedToDate(null);
    }
  };

  return (
    <div className="activity-timeline">
      <h1 className="mb-5">Activity</h1>
      <div className="card header-filter mb-5 pad-10">
        <div className="d-flex">
          <div className="d-flex align-items-center">
            <label className="no-margin pr-2 semi-bold">Users:</label>
            <Select
              options={userOptions}
              isMulti={false}
              value={selectedUsers}
              onChange={handleUserChange}
              placeholder="Select Users"
            />
          </div>

          <div className="d-flex align-items-center ps-5">
            <label className="no-margin pr-2 semi-bold">Activity Types:</label>
            <Select
              options={activityTypeOptions}
              isMulti
              value={selectedActivityTypes}
              onChange={handleActivityTypeChange}
              placeholder="Select Activity Types"
            />
          </div>

          <div className="ps-5">
            <label className="no-margin pr-2 semi-bold">From Date: </label>
            <input
              className="date"
              type="date"
              value={
                selectedFromDate
                  ? selectedFromDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => handleFromDateChange(new Date(e.target.value))}
            />
          </div>
          <div className="ps-5">
            <label className="no-margin pr-2 semi-bold">To Date: </label>
            <input
              className="date"
              type="date"
              value={
                selectedToDate ? selectedToDate.toISOString().split("T")[0] : ""
              }
              onChange={(e) => handleToDateChange(new Date(e.target.value))}
            />
          </div>

          <button
            className="btn btn-circle btn-new ms-5 pad-10 mt-1"
            onClick={handleSubmit}
          >
            <i className="fa fa-search white" />
          </button>
        </div>
      </div>
      {loading ? (
        <UsersListLoading />
      ) : (
        <div className="card">
          <div className="timeline-label mt-10 mb-10 ps-20">
            {activity !== null && activity !== undefined ? (
              activity
                .sort((a, b) => b.activityId - a.activityId)
                .map((item) => {
                  const formattedDateTime = getCurrentTimeZone(
                    item.activityDate
                  );

                  return (
                    <div className="timeline-item" key={item.activityId}>
                      <div className="timeline-label fw-bold text-gray-800 fs-6">
                        <p className="semi-bold">{formattedDateTime}</p>
                        <p className="text-muted normal">{item.createedUser}</p>
                      </div>

                      <div className="timeline-badge">
                        <i
                          className={`fa fa-genderless ${getRandomClass()} fs-1`}
                        ></i>
                      </div>
                      <div className="fw-semibold text-gray-700 ps-3 fs-7">
                        {item.primaryDescription}
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="text-gray-500 text-center">No data found</div>
            )}
          </div>
        </div>
      )}

      <div className="card mt-5">
        <div className="d-flex justify-content-end align-items-center pagination-bar pt-3 pb-3">
          <ReactPaginate
            previousLabel={<i className="fa fa-chevron-left" />}
            nextLabel={<i className="fa fa-chevron-right" />}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={8}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-end"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item custom-previous"}
            previousLinkClassName={"page-link custom-previous-link"}
            nextClassName={"page-item custom-next"}
            nextLinkClassName={"page-link custom-next-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
          <div className="col-md-3 d-flex justify-content-end align-items-center">
            <span className="col-md-4">Count: </span>
            <select
              className="form-select form-select-sm col-md-4"
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
