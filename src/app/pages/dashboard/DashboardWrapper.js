import React, {useState, useEffect, useRef} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import AlertsTrends from './AlertsTrend'
import IncidentStatus from './IncidentStatus'
import {
  fetchGetAlertsMostUsedTags,
  fetchGetAlertsResolvedMeanTime,
  fetchGetFalsePositiveAlertsCount,
  fetchGetMyInternalIncidents,
  fetchGetUnAttendedAletsCount,
  fetchGetUnAttendedIncidentsCount,
  fetchMasterDataByOrganization,
  fetchNumberofDaysUrl,
  fetchOrganizations,
  fetchUserActionsByUser,
} from '../../api/dashBoardApi'
import './Dashboard.css'
import moment from 'moment-timezone'
import {useErrorBoundary} from 'react-error-boundary'
import {UsersListLoading} from '../../modules/apps/qradar/qradar-pages/components/loading/UsersListLoading'
import TasksPopUp from '../../modules/auth/components/TasksPopUp'
import useFeatureActions from '../../modules/apps/qradar/qradar-pages/configuration/useFeatureActions'
import {fetchOrganizationToolsSecurityUrl} from '../../api/securityApi'

const DashboardWrapper = () => {
  const handleError = useErrorBoundary()
  const userID = Number(sessionStorage.getItem('userId'))
  const roleID = Number(sessionStorage.getItem('roleID'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const openTaskCount = Number(sessionStorage.getItem('openTaskCount'))
  const [unattendedIcount, setUnattendedIncidentcount] = useState({})
  const [unattendedAcount, setUnattendedAlertcount] = useState({
    message: 'Unhandled Alerts',
    unattendedAlertsCount: 0,
  })
  const [falsePAcount, setFalsePAcount] = useState({
    message: 'False Positive Alerts',
    alertsCount: 0,
  })
  console.log('falsePAcount', falsePAcount)
  const [alertsResolvedMeanTime, setAlertsResolvedMeanTime] = useState('')
  const [organizations, setOrganizations] = useState([])
  const [alertstatus, setAlertstatus] = useState([])
  const [UserActions, setUseractions] = useState([])
  const [error, setError] = useState(null)
  const [recentIncidents, setrecentIncidents] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [users, setUsers] = useState([])
  const [selectedFilter, setSelectedFilter] = useState(1)
  const [selectedDays, setSelectedDays] = useState('')
  const [tools, setTools] = useState([])
  const [selectedToolId, setSelectedToolId] = useState(sessionStorage.getItem('toolID'))
  console.log('selectedToolId', selectedToolId)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const orgIdFromSession = Number(sessionStorage.getItem('orgId'))
  const [selectedOrganization, setSelectedOrganization] = useState(orgIdFromSession || 1)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))

  const {featureActions} = useFeatureActions(orgId, selectedToolId, roleId, featureId)

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }
  const navigate = useNavigate()
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
    const reload = async () => {
      try {
        setLoading(true)
        const data = await fetchOrganizationToolsSecurityUrl(selectedOrganization)
        setTools(data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    reload()
  }, [selectedOrganization])
  useEffect(() => {
    const fetchNumberOfDays = async () => {
      try {
        const data = {
          maserDataType: 'Dashboard_showdata_duration',
          orgId: selectedOrganization,
          toolId: selectedToolId || toolId,
        }
        const masterDataResponse = await fetchMasterDataByOrganization(data)
        const response = masterDataResponse
        setSelectedDays(response?.masterData)
      } catch (error) {
        handleError(error)
      }
    }
    fetchNumberOfDays()
  }, [selectedOrganization, selectedToolId])

  const fetchData = async () => {
    try {
      // GetAlertsMostUsedTags
      setLoading(true)
      const mostUsedTagsResponse = await fetchGetAlertsMostUsedTags({
        orgID: selectedOrganization,
        toolID: selectedToolId || toolId,
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
        toolID: selectedToolId || toolId,
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
      const myInternalIncidentsData = myInternalIncidentsResponse
      setrecentIncidents(myInternalIncidentsData)

      // GetUnAttendedIncidentsCount
      const unattendedIncidentsCountResponse = await fetchGetUnAttendedIncidentsCount({
        orgID: selectedOrganization,
        toolID: selectedToolId || toolId,
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
        toolID: selectedToolId || toolId,
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
        toolID: selectedToolId || toolId,
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
        toolID: selectedToolId || toolId,
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
  }, [selectedFilter, selectedOrganization, selectedToolId])

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
    if (unattendedIcount.unattendedIncidentCount > 0 && isActionAuthorized('AlertAccess')) {
      navigate('/qradar/incidents', {state: {status: 'New', days: selectedFilter}})
    }
  }
  const handleUnhandaledAlert = () => {
    if (unattendedAcount.unattendedAlertsCount > 0 && isActionAuthorized('IncidentAccess')) {
      navigate('/qradar/alerts', {state: {status: 'New', days: selectedFilter}})
    }
  }
  const handleFalsePositiveAlerts = () => {
    if (falsePAcount.alertsCount > 0 && isActionAuthorized('AlertAccess')) {
      navigate('/qradar/alerts', {state: {days: selectedFilter}})
    }
  }
  return (
    <div className='dashboard-wrapper'>
      {loading ? (
        <UsersListLoading />
      ) : (
        <div>
          <div className='header-filter'>
            <div className='card pad-10'>
              <div className='row'>
                <div className='col-md-3'>
                  <div className='row'>
                    <label className='form-label fw-normal col-md-6 fs-12 lh-40 fs-14'>
                      <span>Show info for last </span>
                    </label>
                    <div className='col-md-6'>
                      <select
                        className='form-select form-select-solid bg-blue-light'
                        data-kt-select2='true'
                        data-placeholder='Select option'
                        data-allow-clear='true'
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(Number(e.target.value))}
                      >
                        {Array.isArray(selectedDays) &&
                          selectedDays.map((day, index) => (
                            <option key={index} value={day.dataValue}>
                              {day.dataName}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className='col-md-3 m-0 p-0'>
                  <div className='row'>
                    <label className='form-label fw-normal fs-12 col-md-5 lh-40 fs-14'>
                      <span>Organization:</span>
                    </label>
                    <div className='col-md-7 m-0 p-0'>
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
                <div className='col-md-3'>
                  <div className='row ms-3'>
                    <label className='form-label fw-normal fs-12 col-md-4 lh-40 fs-14'>
                      <span>Tool:</span>
                    </label>
                    <div className='col-md-8'>
                      <select
                        className='form-select form-select-solid bg-blue-light'
                        value={selectedToolId || ''}
                        onChange={(e) => setSelectedToolId(e.target.value)}
                        disabled={!tools.length}
                      >
                        <option value=''>Select Tools</option>
                        {tools.map((tool) => (
                          <option key={tool.toolId} value={tool.toolId}>
                            {tool.toolName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className='col-md-3 fs-11 lh-40 fc-gray text-right ds-reload'>
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
                    <div
                      className='card bg-default py-5 text-center bg-secondary link-txt'
                      onClick={handleUnhandaledIncident}
                    >
                      <h4 className='text-gray-800 text-hover-primary mb-1 fs-16'>
                        Unhandled Incidents
                      </h4>
                      <span className='fw-bold fs-40 mt-5 mb-5'>
                        {unattendedIcount.unattendedIncidentCount
                          ? unattendedIcount.unattendedIncidentCount
                          : '0'}
                      </span>
                    </div>
                  </div>

                  <div className='col-xl-3'>
                    <div
                      className='card bg-default py-5 text-center bg-light-warning link-txt'
                      onClick={handleUnhandaledAlert}
                    >
                      <h4 className='text-gray-800 text-hover-primary mb-1 fs-16'>
                        {unattendedAcount?.message || 'Unhandled Alerts'}
                      </h4>
                      <span className='fw-bold fs-40 mt-5 mb-5'>
                        {unattendedAcount?.unattendedAlertsCount ?? '0'}
                      </span>
                    </div>
                  </div>

                  <div className='col-xl-3'>
                    <div
                      className='card bg-default py-5 text-center bg-light-success link-txt'
                      onClick={handleFalsePositiveAlerts}
                    >
                      <h4 className='text-gray-800 text-hover-primary mb-1 fs-16'>
                        {falsePAcount?.message || 'Unhandled Alerts'}
                      </h4>
                      <span className='fw-bold fs-40 mt-5 mb-5'>
                        {falsePAcount?.alertsCount ?? '0'}
                      </span>
                    </div>
                  </div>

                  <div className='col-xl-3'>
                    <div className='card bg-default py-5 text-center bg-light-danger'>
                      <h4 className='text-gray-800 text-hover-primary mb-1 fs-16'>
                        Mean Time to Resolve
                      </h4>
                      <span
                        className={
                          alertsResolvedMeanTime?.resolvedMeanTime !== '0'
                            ? 'fw-bold fs-18 mt-10 mb-10 text-gray-800 text-hover-primary'
                            : 'fw-bold fs-40 mt-5 mb-5 text-gray-800 text-hover-primary'
                        }
                      >
                        {alertsResolvedMeanTime?.resolvedMeanTime === '0'
                          ? '0'
                          : alertsResolvedMeanTime?.resolvedMeanTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='card bg-default alert-chart'>
                <AlertsTrends
                  days={selectedFilter}
                  toolID={selectedToolId}
                  orgId={selectedOrganization}
                />
              </div>
            </div>
          </div>
          {/* end::Row */}

          {/* begin::Row */}
          <div className='row incident-box mb-5 mt-5'>
            <div className='col-lg-6'>
              <div className='card bg-default'>
                <IncidentStatus
                  days={selectedFilter}
                  toolID={selectedToolId}
                  orgId={selectedOrganization}
                />
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='card bg-default'>
                <div className='card-body no-pad'>
                  <h6 className='uppercase text-center'>Most used tags</h6>
                  <div className='text-center pad-10 overflow-hidden'>
                    {users?.length > 0 ? (
                      users?.map((tag, index) => {
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
                          <th>Action</th>
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
                                <td>
                                  {item?.actionType} : {item?.actionId}
                                </td>
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
                          <th>ID</th>
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
                                <td>{item?.incidentID}</td>
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
