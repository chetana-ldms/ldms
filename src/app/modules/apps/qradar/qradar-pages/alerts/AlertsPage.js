import {useMemo, useEffect, useState} from 'react'
import axios from 'axios'
import {Link, useNavigate, useParams} from 'react-router-dom'
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
import 'react-toastify/dist/ReactToastify.css'
import {FloatingLabel, Form} from 'react-bootstrap'
import {useFormik} from 'formik'

const AlertsPage = () => {
  const [inputValue, setInputValue] = useState('')
  const [selectedAlert, setselectedAlert] = useState([])
  const handleselectedAlert = (e) => {
    const {value, checked} = e.target
    if (checked) {
      setselectedAlert([...selectedAlert, value])
    } else {
      setselectedAlert(selectedAlert.filter((e) => e !== value))
    }
  }
  console.log(selectedAlert, 'selectedAlert')
  const [actionsValue, setActionValue] = useState('')
  function createIncidentSubmit(e) {
    setActionValue(e.target.value)
    var data = JSON.stringify({
      description: 'Log source Microsoft SQL Server',
      priority: 39,
      severity: 42,
      type: 'Alert ',
      eventID: '1230987',
      destinationUser: 'User 1',
      sourceIP: '192.168.0.1',
      vendor: 'i',
      owner: 0,
      incidentStatus: 32,
      createdDate: '1999-06-25T02:00:56.703Z',
      createdUser: 'admin',
    })

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
      .finally(() => {
        console.log(actionsValue, 'actionsValue')
      })
  }

  const navigate = useNavigate()
  const [selectValue, setSelectValue] = useState()
  const onChange = (event) => {
    const value = event.target.value
    setSelectValue(value)
  }

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
  const [filteredAlertData, setFilteredAlertDate] = useState([])
  const [ldp_security_user, setldp_security_user] = useState([])
  const [delay, setDelay] = useState(1)
  const isLoading = true
  const [alertsCount, setAlertsCount] = useState(0)
  const {values, handleChange: handleEscalate, handleSubmit} = useFormik({
    initialValues: {
      owner: '',
      comments: '',
    },
    onSubmit: (values) => {
      axios
        .post('http://115.110.192.133:502/api/Alerts/v1/SetAlertEscalationStatus', {
          modifiedUser: 'Global Admin',
          modifiedDate: '2023-04-13T08:20:40.025Z',
          modifiedUserId: 1,
          orgId: 1,
          alertIDs: selectedAlert,
          ownerID: 2,
          ownerName: values.owner,
          notes: values.comments,
        })
        .then(({data, status}) => {
          console.log(data)
          if (status === 200) {
            qradaralerts()
          }
        })
        .catch((err) => {
          console.log(err, 'error')
        })
    },
  })
  let data2 = JSON.stringify({
    orgID: '1',
    toolID: '1',
    toolTypeID: '1',
    paging: {
      rangeStart: '1',
      rangeEnd: '20',
    },
    loggedInUserId: '1',
  })
  const data = JSON.stringify({
    clientID: 0,
    clientName: 'string',
    paging: {
      rangeStart: 0,
      rangeEnd: 49,
    },
  })

  const config = {
    method: 'post',
    url: GET_RECENT_OFFENSES,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data2,
  }
  // console.log('GET_RECENT_OFFENSES', GET_RECENT_OFFENSES)
  const qradaralerts = () => {
    axios(config)
      .then(function (response) {
        var newalertData = [...alertData, ...response.data.alertsList]
        setAlertsCount(response.data.totalOffenseCount)
        setAlertDate(response.data.alertsList)
        setFilteredAlertDate(response.data.alertsList)
        // setRangeStart((rangeStart) => rangeEnd + 1)
        // setRangeEnd((rangeEnd) => rangeEnd + 2)
        // console.log('rangeStart', rangeStart)
        // console.log('rangeEnd', rangeEnd)
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }
  useEffect(() => {
    qradaralerts()
    setTimeout(() => {
      setDelay((delay) => delay + 1)
    }, 60000)
    axios
      .post('http://115.110.192.133:502/api/LDPSecurity/v1/Users?OrgId=1')
      .then(({data}) => {
        setldp_security_user(data?.usersList)
      })
      .catch((err) => {
        console.log(err, 'error')
      })
  }, [delay])
  useEffect(() => {
    if (actionsValue === '1') {
      notify('Incident Created')
      setTimeout(() => {
        navigate('/qradar/incidents')
      }, 3000)
    }
  }, [actionsValue])
  console.log(filteredAlertData, 'filteredAlertData')
  const notify = (e) =>
    toast.success(e, {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    })
  const handleChange = (e, field) => {
    console.log(e.target.value)
    console.log(alertData)
    console.log(field)
    console.log(alertData.filter((it) => it[field] === e.target.value))
    let data = alertData.filter((it) => it[field] === e.target.value)
    setFilteredAlertDate(data.length > 0 ? data : alertData)
  }
  const handleSort = (e, field) => {
    let temp = [...alertData]
    let data =
      e.target.value === 'Dec'
        ? temp.sort((a, b) => Number(b[field]) - Number(a[field]))
        : temp.sort((a, b) => Number(a[field]) - Number(b[field]))
    setFilteredAlertDate(data)
  }
  const handleSortDates = (e, field) => {
    console.log(field)
    let temp = [...alertData]
    let data =
      e.target.value === 'New'
        ? temp.sort((a, b) => new Date(b[field]) - new Date(a[field]))
        : temp.sort((a, b) => new Date(a[field]) - new Date(b[field]))
    setFilteredAlertDate(data)
  }
  const handleSearch = (e) => {
    setInputValue(e.target.value)
    if (!e.target.value) return setFilteredAlertDate(alertData)
    let data = alertData.filter((it) =>
      it.name.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setFilteredAlertDate(data)
  }

  return (
    <KTCardBody className='alert-page'>
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
                  className='menu menu-sub menu-sub-dropdown w-250px w-md-300px alert-action'
                  data-kt-menu='true'
                  id='kt_menu_637dc6f8a1c15'
                >
                  {/* <div className='px-7 py-5'>
                    <div className='fs-5 text-dark fw-bold'>Status</div>
                  </div> */}

                  <div className='px-7 py-5'>
                    <div className='mb-5'>
                      <label className='form-label fw-bolder'>Select:</label>
                      <div>
                        <select
                          onChange={createIncidentSubmit}
                          className='form-select form-select-solid'
                          data-kt-select2='true'
                          data-control='select2'
                          data-placeholder='Select option'
                          data-dropdown-parent='#kt_menu_637dc6f8a1c15'
                          data-allow-clear='true'
                        >
                          <option>--</option>
                          <option value='1' onClick={createIncidentSubmit}>
                            Create Incident
                          </option>
                          <option value='2'>Escalate</option>
                          <option value='3'>Irrelevant / Ignore</option>
                          <option value='4'>Generate Report</option>
                        </select>
                      </div>
                    </div>
                    {actionsValue === '2' && (
                      <form onSubmit={handleSubmit}>
                        <div className='mb-5'>
                          <label className='form-label fw-bolder' htmlFor='ownerName'>
                            Owner:
                          </label>
                          <div>
                            <select
                              id='ownerName'
                              className='form-select form-select-solid'
                              data-placeholder='Select option'
                              data-allow-clear='true'
                              value={values.owner}
                              name='owner'
                              onChange={handleEscalate}
                            >
                              <option>--</option>
                              {ldp_security_user.length > 0 &&
                                ldp_security_user.map((item, index) => {
                                  return (
                                    <option key={index} value={item?.name}>
                                      {item?.name}
                                    </option>
                                  )
                                })}
                            </select>
                          </div>
                        </div>
                        <div className='mb-5'>
                          <label className='form-label fw-bolder' htmlFor='excalatecomments'>
                            Comments:
                          </label>
                          <Form.Control
                            as='textarea'
                            placeholder='Leave a comment here'
                            value={values.comments}
                            id='excalatecomments'
                            name='comments'
                            onChange={handleEscalate}
                            style={{height: '100px'}}
                          />
                        </div>
                        <div className='d-flex justify-content-end'>
                          <button type='submit' className='btn btn-primary btn-small btn-new'>
                            Escalate
                          </button>
                        </div>
                      </form>
                    )}

                    {/* <div className='d-flex justify-content-end'>
                      <button
                        type='submit'
                        className='btn btn-sm btn-primary'
                        data-kt-menu-dismiss='true'
                      >
                        Submit
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>
              {/* <a
                href='#'
                onClick={createIncidentSubmit}
                className='btn btn-sm fw-bold btn-primary fs-14'
              >
                Create Incident
              </a> */}
            </div>
          </div>
        </div>

        <div className='card-body py-3' id='kt_accordion_1'>
          <div className='table-responsive alert-table'>
            <table className='table align-middle gs-0 gy-4'>
              <thead>
                <tr className='fw-bold bg-light'>
                  <th className='w-25px'>
                    <div className='form-check form-check-sm form-check-custom form-check-solid'>
                      <input className='form-check-input' type='checkbox' value='1' />
                    </div>
                  </th>
                  <th className='min-w-90px'>
                    Severity
                    <div className='m-0 float-right table-filter'>
                      <a
                        href='#'
                        className=''
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
                      </a>
                      <div
                        className='menu menu-sub menu-sub-dropdown w-250px w-md-250px'
                        data-kt-menu='true'
                        id='kt_menu_637dc885a14bb'
                      >
                        <div className='px-2 py-5'>
                          <div>
                            <div>
                              <select
                                className='form-select form-select-solid'
                                data-kt-select2='true'
                                data-placeholder='Select option'
                                data-dropdown-parent='#kt_menu_637dc885a14bb'
                                data-allow-clear='true'
                                onChange={(e) => handleChange(e, 'severityName')}
                              >
                                <option>Select</option>
                                <option value='High'>High</option>
                                <option value='Medium'>Medium</option>
                                <option value='Low'>Low</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className='min-wd-60px'>
                    SLA
                    <div className='m-0 float-right table-filter'>
                      <a
                        href='#'
                        className=''
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
                      </a>
                      <div
                        className='menu menu-sub menu-sub-dropdown w-250px w-md-250px'
                        data-kt-menu='true'
                        id='kt_menu_637dc885a14bb'
                      >
                        <div className='px-2 py-5'>
                          <div>
                            <div>
                              <select
                                className='form-select form-select-solid'
                                data-kt-select2='true'
                                data-placeholder='Select option'
                                data-dropdown-parent='#kt_menu_637dc885a14bb'
                                data-allow-clear='true'
                                onChange={(e) => handleSortDates(e, 'detectedtime')}
                              >
                                <option>Select</option>
                                <option value='New'>Desc</option>
                                <option value='Old'>Asc</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className='min-w-80px'>
                    Score
                    <div className='m-0 float-right table-filter'>
                      <a
                        href='#'
                        className=''
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
                      </a>
                      <div
                        className='menu menu-sub menu-sub-dropdown w-250px w-md-250px'
                        data-kt-menu='true'
                        id='kt_menu_637dc885a14bb'
                      >
                        <div className='px-2 py-5'>
                          <div>
                            <div>
                              <select
                                className='form-select form-select-solid'
                                data-kt-select2='true'
                                data-placeholder='Select option'
                                data-dropdown-parent='#kt_menu_637dc885a14bb'
                                data-allow-clear='true'
                                onChange={(e) => handleSort(e, 'severity')}
                              >
                                <option>Select</option>
                                <option value='Dec'>Desc</option>
                                <option value='Asc'>Asc</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className='min-w-90px'>
                    Status
                    <div className='m-0 float-right table-filter'>
                      <a
                        href='#'
                        className=''
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
                      </a>
                      <div
                        className='menu menu-sub menu-sub-dropdown w-250px w-md-250px'
                        data-kt-menu='true'
                        id='kt_menu_637dc885a14bb'
                      >
                        <div className='px-2 py-5'>
                          <div>
                            <div>
                              <select
                                className='form-select form-select-solid'
                                data-kt-select2='true'
                                data-placeholder='Select option'
                                data-dropdown-parent='#kt_menu_637dc885a14bb'
                                data-allow-clear='true'
                                onChange={(e) => handleChange(e, 'status')}
                              >
                                <option>Select</option>
                                <option value='New'>New</option>
                                {/* <option value='Pending'>Pending</option> */}
                                <option value='In Progress'>In Progress</option>
                                <option value='Resolved'>Resolved</option>
                                <option value='Escalate'>Escalate</option>
                                <option value='Closed'>Closed</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className='min-w-120px'>
                    Detected time
                    <div className='m-0 float-right table-filter'>
                      <a
                        href='#'
                        className=''
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
                      </a>
                      <div
                        className='menu menu-sub menu-sub-dropdown w-250px w-md-250px'
                        data-kt-menu='true'
                        id='kt_menu_637dc885a14bb'
                      >
                        <div className='px-2 py-5'>
                          <div>
                            <div>
                              <select
                                className='form-select form-select-solid'
                                data-kt-select2='true'
                                data-placeholder='Select option'
                                data-dropdown-parent='#kt_menu_637dc885a14bb'
                                data-allow-clear='true'
                                onChange={(e) => handleSortDates(e, 'detectedtime')}
                              >
                                <option>Select</option>
                                <option value='New'>Desc</option>
                                <option value='Old'>Asc</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className='min-w-50px'>
                    Name
                    <div className='m-0 float-right table-filter'>
                      <a
                        href='#'
                        className=''
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
                      </a>
                      <div
                        className='menu menu-sub menu-sub-dropdown w-250px w-md-250px'
                        data-kt-menu='true'
                        id='kt_menu_637dc885a14bb'
                      >
                        <div className='px-2 py-5'>
                          <div>
                            <div>
                              <input value={inputValue} onChange={(e) => handleSearch(e)} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className='min-w-130px'>
                    Observables tags
                    <div className='m-0 float-right table-filter'>
                      <a
                        href='#'
                        className=''
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
                      </a>
                      <div
                        className='menu menu-sub menu-sub-dropdown w-250px w-md-250px'
                        data-kt-menu='true'
                        id='kt_menu_637dc885a14bb'
                      >
                        <div className='px-2 py-5'>
                          <div>
                            <div>
                              <select
                                className='form-select form-select-solid'
                                data-kt-select2='true'
                                data-placeholder='Select option'
                                data-dropdown-parent='#kt_menu_637dc885a14bb'
                                data-allow-clear='true'
                                onChange={(e) => handleChange(e, 'observableTag')}
                              >
                                <option>Select</option>
                                <option value='Credential Access'>Credential Access</option>
                                <option value='BruteForce'>BruteForce</option>
                                <option value='Authentication'>Authentication</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className='min-w-80px'>
                    Owner
                    <div className='m-0 float-right table-filter'>
                      <a
                        href='#'
                        className=''
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
                      </a>
                      <div
                        className='menu menu-sub menu-sub-dropdown w-250px w-md-250px'
                        data-kt-menu='true'
                        id='kt_menu_637dc885a14bb'
                      >
                        <div className='px-2 py-5'>
                          <div>
                            <div>
                              <select
                                className='form-select form-select-solid'
                                data-kt-select2='true'
                                data-placeholder='Select option'
                                data-dropdown-parent='#kt_menu_637dc885a14bb'
                                data-allow-clear='true'
                                onChange={(e) => handleChange(e, 'ownerusername')}
                              >
                                <option>Select</option>
                                {ldp_security_user.length > 0 &&
                                  ldp_security_user.map((item, index) => {
                                    return (
                                      <option key={index} value={item?.name}>
                                        {item?.name}
                                      </option>
                                    )
                                  })}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className='min-w-80px'>
                    Source{' '}
                    <div className='m-0 float-right table-filter'>
                      <a
                        href='#'
                        className=''
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
                      </a>
                      <div
                        className='menu menu-sub menu-sub-dropdown w-250px w-md-250px'
                        data-kt-menu='true'
                        id='kt_menu_637dc885a14bb'
                      >
                        <div className='px-2 py-5'>
                          <div>
                            <div>
                              <select
                                className='form-select form-select-solid'
                                data-kt-select2='true'
                                data-placeholder='Select option'
                                data-dropdown-parent='#kt_menu_637dc885a14bb'
                                data-allow-clear='true'
                                onChange={(e) => handleChange(e, 'source')}
                              >
                                <option>Select</option>
                                <option value='QRadar'>QRadar</option>
                                <option value='Microsoft Sentinel'>Microsoft Sentinel</option>
                                <option value='Splunk'>Splunk</option>
                                <option value='LogRhythm'>LogRhythm</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
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
                {filteredAlertData.map((item, index) => (
                  <>
                    <tr key={item.alertID}>
                      <td>
                        <div className='form-check form-check-sm form-check-custom form-check-solid'>
                          <input
                            className='form-check-input widget-13-check'
                            type='checkbox'
                            value={item.alertID}
                            name={item.alertID}
                            onChange={handleselectedAlert}
                            autocomplete='false'
                          />
                        </div>
                      </td>
                      <td
                        key={index}
                        id={'kt_accordion_1_header_' + index}
                        data-bs-toggle='collapse'
                        data-bs-target={'#kt_accordion_1_body_' + index}
                        aria-expanded='false'
                        aria-controls={'kt_accordion_1_body_' + index}
                      >
                        {/* <KTSVG
                        path='/media/icons/duotune/arrows/arr067.svg'
                        className='svg-icon-3 svg-icon-success'
                      /> */}
                        {item.severityName}
                      </td>
                      <td>
                        <span className='text-dark text-hover-primary d-block mb-1'>
                          {item.sla}
                        </span>
                      </td>
                      {/* <td className='border border-2'>
                      <span className='text-dark text-hover-primary d-block mb-1'>
                        {item.severity}
                      </span>
                    </td> */}
                      <td>
                        <span className='text-dark text-center text-hover-primary d-block mb-1'>
                          {item.score}
                        </span>
                      </td>
                      <td>
                        {/* <i className={'fa fa-exclamation-circle text-danger fs-2'}></i> */}
                        {item.status}
                      </td>
                      <td>
                        <span className='text-dark text-hover-primary d-block mb-1'>
                          {item.detectedtime}
                        </span>
                      </td>
                      <td className='text-dark text-hover-primary fs-8 alert-name'>
                        <span title={item.name}>{item.name}</span>
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
                          <div className='col-md-9'>
                            <b>Alert Name : </b>
                            {item.name}
                            <br />
                            <b>Score : </b>
                            {item.score}
                            <br />
                            <b>SLA : </b>
                            {item.sla}
                            <br />
                            <b>Severity : </b>
                            {item.severityName}
                            <br />
                            <b>Status : </b>
                            {item.status}
                            <br />
                            <b>Detected Date/Time : </b>
                            {item.detectedtime}
                            <br />
                            <b>Observable Tag : </b>
                            {item.observableTag} <br />
                            <b>Owner Name : </b>
                            {item.ownerusername} <br />
                            <b>Source Name : </b>
                            {item.source} <br />
                          </div>
                          <div className='col-md-2'>
                            <div className='btn btn-primary btn-new btn-small'>
                              Edit {''}
                              {/* <i className='fa fa-pencil' /> */}
                            </div>
                          </div>
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

export {AlertsPage}
