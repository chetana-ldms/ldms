import {useMemo, useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import axios from 'axios'
import {KTSVG} from '../../../../../../_metronic/helpers'
import {GET_RECENT_OFFENSES} from '../../../../../../utils'
import {useTable, ColumnInstance, Row} from 'react-table'
import {CustomHeaderColumn} from '../table/columns/CustomHeaderColumn'
import {CustomRow} from '../table/columns/CustomRow'
import {useQueryResponseData, useQueryResponseLoading} from '../core/QueryResponseProvider'
// import {usersColumns} from './columns/_columns'
import {User} from '../core/_models'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {UsersListPagination} from '../components/pagination/UsersListPagination'
import {KTCardBody} from '../../../../../../_metronic/helpers'
import {ToastContainer, toast} from 'react-toastify'

const DemoAlert = () => {
  const {status} = useParams()
  const navigate = useNavigate()

  const convertDate = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(timestamp)
  }
  const [alertData, setAlertDate] = useState([])
  const [newalertadded, setNewalertadded] = useState('')
  const [delay, setDelay] = useState(1)
  const isLoading = true
  const [alertsCount, setAlertsCount] = useState(0)

  const localAlert = JSON.parse(localStorage.getItem('alertData'))
  if (localStorage.getItem('alertData') === null) {
    localStorage.setItem('alertData', JSON.stringify([]))
    // alert('alertData is initialised')
  }

  const [message, setMessage] = useState('')
  const [storedMessage, setStoredMessage] = useState('')
  const [replyMessage, setReplyMessage] = useState('')

  const createIncidentSubmit = async (e) => {
    // e.preventDefault()

    // try {
    //   const response = await fetch('http://115.110.192.133:502/api/Notification/v1/SMS/Send', {
    //     method: 'POST',
    //     headers: {
    //       accept: 'text/plain',
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       smsMessage: 'Failed login detected',
    //       fromPhoneNumber: '+15855172328',
    //       toPhoneNumber: '+917829646629',
    //     }),
    //   })

    //   if (!response.ok) {
    //     throw new Error('Network response was not ok')
    //   }

    //   const data = await response.json()
    //   setMessage('Message sent successfully.')
    //   setStoredMessage(data.message)
    //   console.log('storedMessage:', data.message)
    // } catch (error) {
    //   console.error('There was a problem with the fetch operation:', error)
    //   setMessage('Enter fields')
    // }
    // }

    // function createIncidentSubmit() {
    notify('Incident Created')
    var data = JSON.stringify({
      description: 'Log source Microsoft SQL Server',
      priority: 39,
      severity: 42,
      type: 'Alert ',
      eventID: '1230987',
      destinationUser: 'User 1',
      sourceIP: '192.168.0.1',
      vendor: 'i',
      owner: -24797743,
      incidentStatus: 3444809,
      createdDate: '1999-06-25T02:00:56.703Z',
      createdUser: 'admin',
    })
    // Get the alert name
    const alertName = alertData[0]?.name

    if (alertName !== 'Demo : Add Failed Login Alert') {
      setTimeout(() => {
        navigate('/qradar/incidentsv1')
      }, 5000)
    } else {
      setTimeout(() => {
        navigate('/qradar/incidents')
      }, 5000)
    }

    var config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://115.110.192.133:502/api/IncidentManagement/CreateInternalIncident',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      },
      data: data,
    }

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data))
        alert('Demo Incident Created')
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  // JSON.stringify
  useEffect(() => {
    const data = JSON.stringify({
      clientID: 0,
      clientName: 'string',
      paging: {
        rangeStart: 0,
        rangeEnd: 10,
      },
    })
    const config = {
      method: 'post',
      url: GET_RECENT_OFFENSES,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    }
    // console.log('GET_RECENT_OFFENSES', GET_RECENT_OFFENSES)
    const qradaralerts = () => {
      const localalertData = JSON.parse(localStorage.getItem('alertData'))
      const alertLength = localalertData.length
      const updated = localStorage.getItem('alertadded')
      console.log('Alert length', alertLength)
      if (status === 'updated') {
        notify('Alert updated, few seconds ago')
      }
      // if (status === 'alertupdated') {
      //     notify('Alert added from demo page')
      //     setTimeout(() => {
      //       notify('Alert identified as threat')
      //       notify('Incident created')
      //     }, 5000)
      //     setTimeout(() => {
      //       navigate('/qradar/incidents')
      //     }, 10000)
      //   setTimeout(() => {
      //     navigate('/qradar/incidents')
      //   }, 10000)
      // } else {
      // }
      if (alertLength === 0) {
        // alert('Alert from server')
        axios(config)
          .then(function (response) {
            var newalertData = [...alertData, ...response.data.alertsList]
            localStorage.setItem('alertData', JSON.stringify(response.data.alertsList))
            setAlertsCount('10')
            setAlertDate(response.data.alertsList)
          })
          .catch(function (error) {
            console.log('error', error)
          })
      } else {
        // alert('Alert from local')
        let localdata = JSON.parse(localStorage.getItem('alertData'))
        localdata.sort(function (a, b) {
          return b.alertID - a.alertID
        })
        setAlertsCount(localdata.length)
        setAlertDate(localdata)
      }
    }
    qradaralerts()

    setTimeout(() => {
      setDelay((delay) => delay + 1)
    }, 60000)
  }, [delay])
  function notify(e) {
    toast.success(e, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    })
  }

  return (
    <KTCardBody className='demo-alert'>
      <ToastContainer />
      <div className='card mb-5 mb-xl-8'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>
              Alerts {'( ' + alertData.length + ' / ' + alertsCount + ')'}
            </span>
          </h3>
          <div className='card-toolbar'>
            <div className='d-flex align-items-center gap-2 gap-lg-3'>
              {/* <a
                href='#'
                onClick={createIncidentSubmit}
                className='btn btn-sm fw-bold btn-primary fs-14'
              >
                Create Incident
              </a> */}
              <div className='m-0'>
                <a
                  href='#'
                  className='btn btn-sm btn-flex btn-primary fw-bold fs-14 btn-new'
                  data-kt-menu-trigger='click'
                  data-kt-menu-placement='bottom-end'
                >
                  <span className='svg-icon svg-icon-6 svg-icon-muted me-1'>
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z'
                        fill='currentColor'
                      />
                    </svg>
                  </span>
                  Actions
                </a>
                <div
                  className='menu menu-sub menu-sub-dropdown w-250px w-md-300px'
                  data-kt-menu='true'
                  id='kt_menu_637dc885a14bb'
                >
                  {/* <div className='px-7 py-5'>
                    <div className='fs-14 text-dark fw-bold'>Filter Options</div>
                  </div> */}
                  <div className='separator border-gray-200'></div>
                  <div className='px-7 py-5'>
                    <div className='mb-10'>
                      <label className='form-label fw-semibold'>Actions:</label>
                      <div>
                        <select
                          onChange={createIncidentSubmit}
                          className='form-select form-select-solid'
                          data-kt-select2='true'
                          data-placeholder='Select option'
                          data-dropdown-parent='#kt_menu_637dc885a14bb'
                          data-allow-clear='true'
                        >
                          <option>--</option>
                          <option value='1' onChange={createIncidentSubmit}>
                            Create Incident
                          </option>
                          <option value='2'>Escalate</option>
                          <option value='2'>Irrelevant / Ignore</option>
                          <option value='2'>Generate Report</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <a href='' className='btn btn-sm fw-bold btn-secondary'>
                <i className='fa fa-refresh'></i>
              </a> */}
            </div>
          </div>
        </div>

        <div className='card-body py-3 alert-table' id='kt_accordion_1'>
          <div className='table-responsive alert-table'>
            <table className='table align-middle gs-0 gy-4'>
              <thead>
                <tr className='fw-bold bg-light'>
                  <th className='w-25px'>
                    <div className='form-check form-check-sm form-check-custom form-check-solid'>
                      <input className='form-check-input' type='checkbox' value='1' />
                    </div>
                  </th>
                  <th className='min-w-50px'>Ser</th>
                  <th className='min-w-50px'>SLA</th>
                  <th className='min-w-50px'>Score</th>
                  <th className='min-w-50px'>Status</th>
                  <th className='min-w-50px'>Detected time</th>
                  <th className='min-w-50px'>Name</th>
                  <th className='min-w-50px'>Observables tags</th>
                  <th className='min-w-50px'>Owner</th>
                  <th className='min-w-50px'>Source</th>
                </tr>
              </thead>

              <tbody id='kt_accordion_1'>
                {alertData.length == 0 ? (
                  <>
                    <tr>
                      <td>
                        <UsersListLoading />
                      </td>
                    </tr>
                  </>
                ) : (
                  ''
                )}

                {alertData.map((item, index) => (
                  <>
                    <tr>
                      <td>
                        <div className='form-check form-check-sm form-check-custom form-check-solid'>
                          <input
                            className='form-check-input widget-13-check'
                            type='checkbox'
                            value='1'
                          />
                        </div>
                      </td>
                      <td>
                        {/* <KTSVG
                          path='/media/icons/duotune/arrows/arr067.svg'
                          className='svg-icon-3 svg-icon-success'
                        /> */}
                        {item.severity}
                      </td>
                      <td
                        key={index}
                        id={'kt_accordion_1_header_' + index}
                        data-bs-toggle='collapse'
                        data-bs-target={'#kt_accordion_1_body_' + index}
                        aria-expanded='false'
                        aria-controls={'kt_accordion_1_body_' + index}
                      >
                        <span className='text-hover-primary d-block mb-1 fs-8'>{item.sla}</span>
                      </td>
                      <td>
                        <span className='text-dark text-hover-primary d-block mb-1 fs-8'>
                          {item.score}
                        </span>
                      </td>
                      <td>
                        {/* <i className={'fa fa-exclamation-circle text-danger fs-2'}></i> */}
                        {item.status}
                      </td>
                      <td>
                        <span className='text-dark text-hover-primary d-block mb-1 fs-8'>
                          {convertDate(item.last_persisted_time)}
                        </span>
                      </td>
                      <td className={`text-dark text-hover-primary fs-8` + newalertadded}>
                        {item.name}
                      </td>
                      <td className='text-dark text-hover-primary fs-8'>{item.observableTag}</td>
                      <td className='text-dark text-hover-primary fs-8'> {item.ownerusername}</td>
                      <td className='text-dark fw-bold text-hover-primary fs-8'>{item.source}</td>
                    </tr>

                    <tr
                      id={'kt_accordion_1_body_' + index}
                      className='accordion-collapse collapse'
                      aria-labelledby={'kt_accordion_1_header_' + index}
                      data-bs-parent='#kt_accordion_1'
                    >
                      <td colSpan='10'>
                        <div className='row'>
                          <div className='col-md-1'></div>
                          <div className='col-md-10'>
                            <b>Alert Name :</b>
                            {item.name}
                            <br />
                            <b>Organization :</b>
                            {item.orgID}
                            <br />
                            <b>Detected Date :</b>
                            {convertDate(item.last_persisted_time)}
                            <br />
                            <b>Description :</b>
                            <br />
                            Customer Name : {item.createdUser} <br />
                            Alert Name : {item.name} <br />
                            Source Address : {item.source} <br />
                            Source Host Name : {item.alertData} <br />
                          </div>
                          <div className='col-md-1'></div>
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <UsersListPagination />
    </KTCardBody>
  )
}

export {DemoAlert}
