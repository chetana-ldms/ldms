import React, {useState, useEffect, useRef} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'

import {ChartsWidget9} from '../../../_metronic/partials/widgets'
import {
  ListsWidget2,
  ListsWidget3,
  ListsWidget4,
  ListsWidget6,
  TablesWidget5,
  TablesWidget10,
  MixedWidget8,
  CardsWidget7,
  CardsWidget17,
  CardsWidget20,
  ListsWidget26,
  EngageWidget10,
  StatisticsWidget5,
} from '../../../_metronic/partials/widgets'
import AlertsTrends from './AlertsTrend'
import IncidentStatus from './IncidentStatus'
import {
  fetchGetAlertsMostUsedTags,
  fetchGetAlertsResolvedMeanTime,
  fetchGetFalsePositiveAlertsCount,
  fetchGetMyInternalIncidents,
  fetchGetUnAttendedAletsCount,
  fetchGetUnAttendedIncidentsCount,
  fetchMasterData,
  fetchNumberofDaysUrl,
  fetchOrganizations,
  fetchUserActionsByUser,
} from '../../api/dashBoardApi'
import './Dashboard.css'
import moment from 'moment-timezone'
import {useErrorBoundary} from 'react-error-boundary'
import {UsersListLoading} from '../../modules/apps/qradar/qradar-pages/components/loading/UsersListLoading'
import TasksPopUp from '../../modules/auth/components/TasksPopUp'

const DashboardWrapper = () => {
  const handleError = useErrorBoundary()
  const userID = Number(sessionStorage.getItem('userId'))
  const roleID = Number(sessionStorage.getItem('roleID'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const openTaskCount = Number(sessionStorage.getItem('openTaskCount'))
  const [unattendedIcount, setUnattendedIncidentcount] = useState({})
  const [unattendedAcount, setUnattendedAlertcount] = useState({})
  const [falsePAcount, setFalsePAcount] = useState({}) //GetFalsePositiveAlertsCount
  const [alertsResolvedMeanTime, setAlertsResolvedMeanTime] = useState({}) //GetFalsePositiveAlertsCount
  const [organizations, setOrganizations] = useState([])
  const [alertstatus, setAlertstatus] = useState([])
  const [UserActions, setUseractions] = useState([])
  console.log(UserActions, 'UserActions')
  const [error, setError] = useState(null)
  const [recentIncidents, setrecentIncidents] = useState([])
  console.log(recentIncidents, 'recentIncidents')
  const [isLoaded, setIsLoaded] = useState(false)
  const [users, setUsers] = useState([])
  console.log(users, 'users')
  const [selectedFilter, setSelectedFilter] = useState(1)
  const [selectedDays, setSelectedDays] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const orgIdFromSession = Number(sessionStorage.getItem('orgId'))
  const [selectedOrganization, setSelectedOrganization] = useState(orgIdFromSession || 1)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const navigate = useNavigate();
  const getCurrentTimeZoneDiff = (UTCDate) => {
    const inputTime = moment.tz(UTCDate, 'UTC')
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const localTime = inputTime.tz(userTimeZone)

    const now = moment() // Current moment in user's time zone
    const diffMs = now.diff(inputTime) // Calculate the difference in milliseconds
    const diffMins = Math.floor(diffMs / 60000)
    const days = Math.floor(diffMins / 1440)
    const hours = Math.floor((diffMins % 1440) / 60)
    const minutes = diffMins % 60

    const diffString = `${days}D ${hours}H : ${minutes}M`

    return diffString
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const organizationsResponse = await fetchOrganizations()
        setOrganizations(organizationsResponse)
      } catch (error) {
        handleError(error)
      }
    }
    fetchData()
  }, [])
  useEffect(() => {
    const fetchNumberOfDays = async () => {
      try {
        const response = await fetchNumberofDaysUrl(
          'Dashboard_showdata_duration',
          selectedOrganization
        )
        setSelectedDays(response)
        // setSelectedFilter(response);
      } catch (error) {
        handleError(error)
      }
    }
    fetchNumberOfDays()
  }, [selectedOrganization])

  const fetchData = async () => {
    try {
      // GetAlertsMostUsedTags
      setLoading(true)
      const mostUsedTagsResponse = await fetchGetAlertsMostUsedTags({
        orgID: selectedOrganization,
        toolID: 0,
        toolTypeID: 0,
        userID: userID,
        numberofDays: selectedFilter,
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
      })
      const mostUsedTagsData = mostUsedTagsResponse
      const mostUsedTags = mostUsedTagsData.mostUsedTags
      setUsers(mostUsedTags)

      // UserActionsByUser
      const userActionsResponse = await fetchUserActionsByUser({
        userId: userID,
        numberofDays: selectedFilter,
      })
      const userActionsData = userActionsResponse
      setUseractions(userActionsData)

      // GetMyInternalIncidents
      const myInternalIncidentsResponse = await fetchGetMyInternalIncidents({
        userID: userID,
        orgID: selectedOrganization,
        numberofDays: selectedFilter,
      })
      const myInternalIncidentsData = myInternalIncidentsResponse
      setrecentIncidents(myInternalIncidentsData)

      // GetUnAttendedIncidentsCount
      const unattendedIncidentsCountResponse = await fetchGetUnAttendedIncidentsCount({
        orgID: selectedOrganization,
        toolID: 1,
        toolTypeID: 1,
        userID: userID,
        numberofDays: selectedFilter,
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
      })
      const unattendedIncidentsCountData = unattendedIncidentsCountResponse
      setUnattendedIncidentcount(unattendedIncidentsCountData)

      // GetUnAttendedAletsCount
      const unattendedAlertsCountResponse = await fetchGetUnAttendedAletsCount({
        orgID: selectedOrganization,
        toolID: 1,
        toolTypeID: 1,
        userID: userID,
        numberofDays: selectedFilter,
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
      })
      const unattendedAlertsCountData = unattendedAlertsCountResponse
      setUnattendedAlertcount(unattendedAlertsCountData)

      // GetFalsePositiveAlertsCount
      const falsePositiveAlertsCountResponse = await fetchGetFalsePositiveAlertsCount({
        orgID: selectedOrganization,
        toolID: 1,
        toolTypeID: 1,
        userID: userID,
        numberofDays: selectedFilter,
        positiveAnalysisID: 1,
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
      })
      const falsePositiveAlertsCountData = falsePositiveAlertsCountResponse
      setFalsePAcount(falsePositiveAlertsCountData)

      // GetAlertsResolvedMeanTime
      const alertsResolvedMeanTimeResponse = await fetchGetAlertsResolvedMeanTime({
        orgID: selectedOrganization,
        toolID: 1,
        toolTypeID: 1,
        userID: userID,
        numberofDays: selectedFilter,
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
      })
      const alertsResolvedMeanTimeData = alertsResolvedMeanTimeResponse
      setAlertsResolvedMeanTime(alertsResolvedMeanTimeData)

      // MasterData
      const masterDataResponse = await fetchMasterData({
        maserDataType: 'alert_status',
      })
      const masterData = masterDataResponse.masterData
      setAlertstatus(masterData)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    const interval = setInterval(() => {
      fetchData()
    }, 5 * 60 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, [selectedFilter, selectedOrganization])

  const handleRefreshData = (e) => {
    e.preventDefault()
    setIsLoaded(false)
    setIsRefreshing(true)
    fetchData()
    setTimeout(() => setIsRefreshing(false), 2000)
  }
  useEffect(() => {
    if (openTaskCount > 0) {
      setShowModal(true)
    } else {
      setShowModal(false)
    }
  }, [])
  const handleUnhandaledIncident = () => {
    navigate('/qradar/incidents'); 
  };
  const handleUnhandaledAlert = () => {
    navigate('/qradar/alerts'); 
  };
  return (
    <div className='dashboard-wrapper'>
      {loading ? (
        <UsersListLoading />
      ) : (
        <div>
          <div className='header-filter'>
            <div className='card pad-10'>
              <div className='row'>
                <div className='col-lg-4'>
                  <div className='row'>
                    <label className='form-label fw-normal col-lg-5 fs-12 lh-40 fs-14'>
                      <span>Show info for last </span>
                    </label>
                    <div className='col-md-7'>
                      <select
                        className='form-select form-select-solid bg-blue-light'
                        data-kt-select2='true'
                        data-placeholder='Select option'
                        data-allow-clear='true'
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(Number(e.target.value))}
                      >
                        {selectedDays.map((day, index) => (
                          <option key={index} value={day.dataValue}>
                            {day.dataName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className='col-lg-4'>
                  <div className='row'>
                    <label className='form-label fw-normal fs-12 col-lg-4 lh-40 fs-14'>
                      <span>Organization:</span>
                    </label>
                    <div className='col-lg-7'>
                      <select
                        className='form-select form-select-solid bg-blue-light'
                        data-kt-select2='true'
                        data-placeholder='Select option'
                        data-allow-clear='true'
                        value={selectedOrganization}
                        onChange={(e) => setSelectedOrganization(Number(e.target.value))}
                      >
                        {roleID === 1 &&
                          organizations?.length > 0 &&
                          organizations.map((item, index) => (
                            <option key={index} value={item.orgID}>
                              {item.orgName}
                            </option>
                          ))}

                        {roleID !== 1 &&
                          organizations?.length > 0 &&
                          organizations
                            .filter((item) => item.orgID === orgId)
                            .map((item, index) => (
                              <option key={index} value={item.orgID}>
                                {item.orgName}
                              </option>
                            ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className='col-lg-4 fs-11 lh-40 fc-gray text-right ds-reload'>
                  Auto refresh every 5 minutes{' '}
                  <a href='' onClick={handleRefreshData}>
                    <i className={`fa fa-refresh link ${isRefreshing ? 'rotate' : ''}`} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* begin::Row */}
          <div className='row py-lg-3 incident-box'>
            <div className='col-lg-6'>
              <div className='card alert-boxes pad-10'>
                <div className='row'>
                  <div className='col-xl-3'>
                    <div className='card bg-default py-5 text-center bg-secondary link-txt' onClick={handleUnhandaledIncident}>
                      <h4 className='text-gray-800 text-hover-primary mb-1 fs-16'>
                        Unhandled Incidents
                      </h4>
                      <span className='fw-bold fs-40 mt-5 mb-5'>
                        {unattendedIcount.unattendedIncidentCount
                          ? unattendedIcount.unattendedIncidentCount
                          : '0'}
                      </span>
                      {/* <span className="span-red">
                        <i className="fa fa-arrow-down"></i> 67%
                      </span> */}
                    </div>
                  </div>

                  <div className='col-xl-3'>
                    <div className='card bg-default py-5 text-center bg-light-warning link-txt' onClick={handleUnhandaledAlert}>
                      <h4 className='text-gray-800 text-hover-primary mb-1 fs-16'>
                        Unhandled Alerts
                      </h4>
                      <span className='fw-bold fs-40 mt-5 mb-5'>
                        {unattendedAcount.unattendedAlertsCount
                          ? unattendedAcount.unattendedAlertsCount
                          : '0'}
                      </span>
                      {/* <span className="span-red">
                        <i className="fa fa-arrow-down"></i> 100%
                      </span> */}
                    </div>
                  </div>

                  <div className='col-xl-3'>
                    <div className='card bg-default py-5 text-center bg-light-success'>
                      <h4 className='text-gray-800 text-hover-primary mb-1 fs-16'>
                        False Positive Alerts
                      </h4>
                      <span className='fw-bold fs-40 mt-5 mb-5'>
                        {falsePAcount.alertsCount ? falsePAcount.alertsCount : '0'}
                      </span>
                    </div>
                  </div>

                  <div className='col-xl-3'>
                    <div className='card bg-default py-5 text-center bg-light-danger'>
                      <h4 className='text-gray-800 text-hover-primary mb-1 fs-16'>
                        Mean Time to Resolve
                      </h4>
                      <span className='fw-bold fs-18 mt-10 mb-10'>
                        {parseInt(alertsResolvedMeanTime.alertsResolvedMeanTime) === 0
                          ? '00:00:00'
                          : alertsResolvedMeanTime.alertsResolvedMeanTime}
                      </span>

                      {/* <span className="span-red">
                        <i className="fa fa-arrow-down"></i> 100%
                      </span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='card bg-default alert-chart'>
                <AlertsTrends days={selectedFilter} orgId={selectedOrganization} />
              </div>
            </div>
          </div>
          {/* end::Row */}

          {/* begin::Row */}
          <div className='row incident-box mb-5 mt-5'>
            <div className='col-lg-6'>
              <div className='card bg-default'>
                <IncidentStatus days={selectedFilter} orgId={selectedOrganization} />
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='card bg-default'>
                <div className='card-body no-pad'>
                  <h6 className='uppercase text-center'>Most used tags</h6>
                  <div className='text-center pad-10 overflow-hidden'>
                    {users?.length > 0 ? (
                      users.map((tag, index) => {
                        return (
                          <p key={index} className='mb-2 mt-3 tags'>
                            {tag}
                          </p>
                        )
                      })
                    ) : (
                      <p className='mb-5 mt-5'>
                        No data found. <br />
                        <br />
                        <br />
                        <br />
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end::Row */}

          {/* begin::Row */}
          <div className='row py-lg-3 incident-box'>
            <div className='col-lg-6'>
              <div className='card bg-default'>
                <div className='card-body no-pad'>
                  <h6 className='uppercase text-center'>Actions assigned to me</h6>
                  <div className='table-responsive alert-table1'>
                    {/* begin::Table */}
                    <table className='table align-middle gs-0 gy-5 ds-table mt-2'>
                      <thead>
                        <tr className='fw-bold text bg-light'>
                          <th>Severity</th>
                          <th>SLA</th>
                          <th>Score</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {UserActions?.length > 0 ? (
                          UserActions.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{item?.severity}</td>
                                <td>
                                  <span className='fw-normal'>
                                    {getCurrentTimeZoneDiff(item?.actionDate)}
                                  </span>
                                </td>
                                <td>{item.score ?? 0}</td>
                                <td>
                                  <span>{item?.actionStatusName}</span>
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td className='text-center' colSpan='4'>
                              No data found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='card bg-default'>
                <div className='card-body no-pad'>
                  <h6 className='uppercase text-center'>My recent Incidents</h6>
                  <div className='table-responsive alert-table1'>
                    {/* begin::Table */}
                    <table className='table align-middle gs-0 gy-5 ds-table mt-2'>
                      <thead>
                        <tr className='fw-bold text bg-light'>
                          <th>Severity</th>
                          <th>SLA</th>
                          <th>Score</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentIncidents?.length > 0 ? (
                          recentIncidents.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{item?.severityName}</td>
                                <td>
                                  <span className='fw-normal'>
                                    {/* {formatDateDiff(new Date(item?.createdDate))} */}
                                    {getCurrentTimeZoneDiff(item?.createdDate)}
                                  </span>
                                </td>
                                <td>{item.score ?? 0}</td>
                                <td>
                                  <span>{item?.incidentStatusName}</span>
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td className='text-center' colSpan='4'>
                              No data found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end::Row */}
        </div>
      )}
      <TasksPopUp showModal={showModal} setShowModal={setShowModal} />
    </div>
  )
}

export default DashboardWrapper
