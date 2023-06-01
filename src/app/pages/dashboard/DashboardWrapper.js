import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UsersListLoading } from '../../modules/apps/qradar/qradar-pages/components/loading/UsersListLoading'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { ChartsWidget9 } from '../../../_metronic/partials/widgets'
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

const DashboardWrapper = () => {
  const userID = Number(sessionStorage.getItem('userId'));
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [unattendedIcount, setUnattendedIncidentcount] = useState({})
  const [unattendedAcount, setUnattendedAlertcount] = useState({})
  const [falsePAcount, setFalsePAcount] = useState({}) //GetFalsePositiveAlertsCount
  const [alertsResolvedMeanTime, setAlertsResolvedMeanTime] = useState({}) //GetFalsePositiveAlertsCount
  const [organizations, setOrganizations] = useState([]) //Get Organizations
  const [alertstatus, setAlertstatus] = useState([]) //Get Master Alert Status
  const [UserActions, setUseractions] = useState([])
  console.log(UserActions, "UserActions")
  const [error, setError] = useState(null)
  const [recentIncidents, setrecentIncidents] = useState([])
  console.log(recentIncidents, "recentIncidents")
  const [isLoaded, setIsLoaded] = useState(false)
  const [users, setUsers] = useState([])
  const [selectedFilter, setSelectedFilter] = useState(30);
  const [selectedOrganization, setSelectedOrganization] = useState(1);
  function formatDateDiff(date) {
    const diffMs = new Date() - date
    const diffMins = Math.floor(diffMs / 60000)
    const days = Math.floor(diffMins / 1440)
    const hours = Math.floor((diffMins % 1440) / 60)
    const minutes = diffMins % 60
    return `${days}d ${hours}h ${minutes}m`
  }

  console.log(selectedFilter, "selectedFilter")
  useEffect(() => {
    axios
      .post('http://115.110.192.133:502/api/Alerts/v1/GetAlertsMostUsedTages', {
        orgID: selectedOrganization,
        toolID: 0,
        toolTypeID: 0,
        userID: userID,
        // numberofDays: 90,
        numberofDays: selectedFilter,
      })
      .then(({ data }) => {
        setIsLoaded(true)
        setUsers(data?.mostUsedTags)

      })
      .catch((err) => {
        setIsLoaded(true)
        setError(error)
      })

    axios
      .post('http://115.110.192.133:502/api/UserActions/v1/UserActionsByUser', {
        userId: userID,
        numberofDays: selectedFilter,
      })
      .then(({ data }) => {
        console.log(data, 'UserActions')
        setUseractions(data?.userActionsData)
      })

    axios
      .post('http://115.110.192.133:502/api/IncidentManagement/v1/GetMyInternalIncidents', {
        userID: userID,
        orgID: selectedOrganization,
        numberofDays: selectedFilter,
      })
      .then(({ data }) => {
        console.log(data, 'getinter aci')
        setrecentIncidents(data?.incidentList)
      })
    const unattendedincidentdata = JSON.stringify({
      orgID: selectedOrganization,
      toolID: 1,
      toolTypeID: 1,
      userID: userID,
      // numberofDays: 30,
      numberofDays: selectedFilter,
    })
    const incidentconfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://115.110.192.133:502/api/IncidentManagement/v1/GetUnAttendedIncidentsCount',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      },
      data: unattendedincidentdata,
    }
    // Un attended Alerts Data
    const attendedalertsdata = JSON.stringify({
      orgID: selectedOrganization,
      toolID: 1,
      toolTypeID: 1,
      userID: userID,
      // numberofDays: 60,
      numberofDays: selectedFilter,
    })
    const attendedalertsconfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://115.110.192.133:502/api/Alerts/v1/GetUnAttendedAletsCount',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      },
      data: attendedalertsdata,
    }

    // GetFalsePositiveAlertsCount
    const falsepositivealertscountdata = JSON.stringify({
      orgID: selectedOrganization,
      toolID: 1,
      toolTypeID: 1,
      userID: userID,
      // numberofDays: 60,
      numberofDays: selectedFilter,
      positiveAnalysisID: 1,
    })
    const falsepositivealertsconfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://115.110.192.133:502/api/Alerts/v1/GetFalsePositiveAlertsCount',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      },
      data: falsepositivealertscountdata,
    }
    // GetAlertsResolvedMeanTime
    const AlertsResolvedMeanTimedata = JSON.stringify({
      orgID: selectedOrganization,
      toolID: 1,
      toolTypeID: 1,
      userID: userID,
      // numberofDays: 90,
      numberofDays: selectedFilter,
    })
    const AlertsResolvedMeanTimeconfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://115.110.192.133:502/api/Alerts/v1/GetAlertsResolvedMeanTime',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      },
      data: AlertsResolvedMeanTimedata,
    }
    // Organizations
    const organizationsconfig = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://115.110.192.133:502/api/LDPlattform/v1/Organizations',
      headers: {
        Accept: 'text/plain',
      },
    }

    // Get Alert Status Master data
    const alertstatusdata = JSON.stringify({
      maserDataType: 'alert_status',
    })
    const alertstatusconfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://115.110.192.133:502/api/LDPlattform/v1/MasterData',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      },
      data: alertstatusdata,
    }

    const GetUnAttendedIncidentsCount = () => {
      // U Incidents Count
      axios(incidentconfig)
        .then(function (response) {
          setUnattendedIncidentcount(response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
      // U Alerts Count
      axios(attendedalertsconfig)
        .then(function (response) {
          setUnattendedAlertcount(response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
      axios(falsepositivealertsconfig)
        .then(function (response) {
          setFalsePAcount(response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
      axios(AlertsResolvedMeanTimeconfig)
        .then(function (response) {
          setAlertsResolvedMeanTime(response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
      axios(organizationsconfig)
        .then(function (response) {
          setOrganizations(response.data.organizationList)
        })
        .catch(function (error) {
          console.log(error)
        })

      axios(alertstatusconfig)
        .then(function (response) {
          setAlertstatus(response.data.masterData)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
    GetUnAttendedIncidentsCount()
  }, [selectedFilter, selectedOrganization])
  return (
    <div className='dashboard-wrapper'>
      {/* Header filter section */}
      <div className='header-filter row'>
        <div className='col-lg-3'>
          <div className='row'>
            <label className='form-label fw-normal col-lg-7 fs-12 lh-40 fc-gray fs-14'>
              <span>Show info for last:</span>
            </label>
            <div className='col-lg-5'>
              <select
                className='form-select form-select-solid bg-blue-light'
                data-kt-select2='true'
                data-placeholder='Select option'
                data-allow-clear='true'
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value=''>Days</option>
                <option value='30'>30</option>
                <option value='60'>60</option>
                <option value='90'>90</option>
                <option value='120'>120</option>
              </select>
            </div>
          </div>
        </div>
        <div className='col-lg-4'>
          <div className='row'>
            <label className='form-label fw-normal fs-12 col-lg-4 lh-40 fc-gray fs-14'>
              <span>Organization:</span>
            </label>
            <div className='col-lg-7'>
              <select
                className='form-select form-select-solid bg-blue-light'
                data-kt-select2='true'
                data-placeholder='Select option'
                data-allow-clear='true'
              // defaultValue={'1'}
              value={selectedOrganization}
              onChange={(e) => setSelectedOrganization(Number(e.target.value))}
              >
                {userID === 1 && organizations?.length > 0 && (
                  organizations.map((item, index) => (
                    <option key={index} value={item.orgID}>
                      {item.orgName}
                    </option>
                  ))
                )}

                {userID !== 1 && organizations?.length > 0 && (
                  organizations
                    .filter((item) => item.orgID === orgId)
                    .map((item, index) => (
                      <option key={index} value={item.orgID}>
                        {item.orgName}
                      </option>
                    ))
                )}
              </select>
            </div>

          </div>
        </div>
        <div className='col-lg-5 fs-11 lh-40 fc-gray text-right ds-reload'>
          Dashboard is automatically refreshing every 5 minutes{' '}
          <a href=''>
            <i className='fa fa-refresh' />
          </a>
        </div>
      </div>

      {/* begin::Row */}
      <div className='row py-lg-3 incident-box'>
        <div className='col-lg-6'>
          <div className='row'>
            <div className='col-xl-3'>
              <div className='card bg-default py-5 text-center bg-secondary'>
                <h6 className='text-gray-800 text-hover-primary mb-1 fs-12 uppercase'>
                  Unhandeled Incidents
                </h6>
                <span className='fc-gray fw-bold fs-40 mt-5 mb-5'>
                  {unattendedIcount.unattendedIncidentCount
                    ? unattendedIcount.unattendedIncidentCount
                    : '0'}
                </span>
                <span className='span-red'>
                  <i className='fa fa-arrow-down'></i> 67%
                </span>
              </div>
            </div>

            <div className='col-xl-3'>
              <div className='card bg-default py-5 text-center bg-light-warning'>
                <h6 className='text-gray-800 text-hover-primary mb-1 fs-12 uppercase'>
                  Unhandeled Alerts
                </h6>
                <span className='fc-gray fw-bold fs-40 mt-5 mb-5'>
                  {unattendedAcount.unattendedAlertsCount
                    ? unattendedAcount.unattendedAlertsCount
                    : '0'}
                </span>
                <span className='span-red'>
                  <i className='fa fa-arrow-down'></i> 100%
                </span>
              </div>
            </div>

            <div className='col-xl-3'>
              <div className='card bg-default py-5 text-center bg-light-success'>
                <h6 className='text-gray-800 text-hover-primary mb-1 fs-12 uppercase'>
                  False Positive Alerts
                </h6>
                <span className='fc-gray fw-bold fs-40 mt-5 mb-5'>
                  {falsePAcount.alertsCount ? falsePAcount.alertsCount : '0'}
                </span>
                <span className='span-red'>
                  <i className='v-hidden fa fa-arrow-down'></i>
                </span>
              </div>
            </div>

            <div className='col-xl-3'>
              <div className='card bg-default py-5 text-center bg-light-danger'>
                <h6 className='text-gray-800 text-hover-primary mb-1 fs-12 uppercase'>
                  Mean Time to Resolve
                </h6>
                <span className='fc-gray fw-bold fs-22 mt-10 mb-8'>
                  {alertsResolvedMeanTime.alertsResolvedMeanTime
                    ? alertsResolvedMeanTime.alertsResolvedMeanTime
                    : '0'}
                </span>
                <span className='span-red'>
                  <i className='fa fa-arrow-down'></i> 100%
                </span>
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
            <div className='card-body'>
              <h6 className='uppercase text-center'>Most used tags</h6>
              <div className='text-center'>
                {users?.length > 0 &&
                  users.map((tag, index) => {
                    return (
                      <p key={index} className='mb-2 mt-3 tags'>
                        {tag}
                      </p>
                    )
                  })}
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
            <div className='card-body'>
              <h6 className='uppercase text-center'>Actions assigned to me</h6>
              <div className='table-responsive'>
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
                    {UserActions?.length > 0 &&
                      UserActions.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item?.severity}</td>
                            <td>
                              <span className='red'>
                                {' '}
                                {formatDateDiff(new Date(item?.actionDate))}
                              </span>
                            </td>
                            <td>{item.score}</td>
                            <td>
                              <span>New</span>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className='col-lg-6'>
          <div className='card bg-default'>
            <div className='card-body'>
              <h6 className='uppercase text-center'>My recent Incidents</h6>
              <div className='table-responsive'>
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
                    {recentIncidents?.length > 0 &&
                      recentIncidents.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item?.severity}</td>
                            <td>
                              <span className='red'>
                                {formatDateDiff(new Date(item?.createdDate))}
                              </span>
                            </td>
                            <td>{item.score ?? 0}</td>
                            <td>
                              <span>New</span>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end::Row */}
    </div>
  )
}

export default DashboardWrapper
