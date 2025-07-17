import React, {useState, useEffect, useRef} from 'react'
import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {notify, notifyFail} from '../components/notification/Notification'
import {
  fetchAlertsByAlertIds,
  fetchGetIncidentHistory,
  fetchIncidentDetails,
  fetchIncidentNotesListUrl,
  fetchIncidents,
  fetchMasterData,
  fetchUpdateIncident,
  fetchUsersByOrgTool,
  fetchUsersForIncidentCreatorRoleUrl,
  fetchUsersForIncidentOwnerRoleUrl,
} from '../../../../../api/IncidentsApi'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {useErrorBoundary} from 'react-error-boundary'
import {fetchActivitiesUrl} from '../../../../../api/ActivityApi'
import IncidentAlertPopUp from './IncidentAlertPopUp'
import useFeatureActions from '../configuration/useFeatureActions'
import AddIncidentModal from './AddIncidentModal'
import NotesModalComponent from './NotesModalComponent'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import './Incident.css'
import ReplyModal from './ReplyModal'

const IncidentDetails = ({incident, onRefreshIncidents}) => {
  console.log('incident11111', incident)
  const handleError = useErrorBoundary()
  const {
    description,
    createdDate,
    incidentID,
    modifiedDate,
    eventID,
    destinationUser,
    sourceIP,
    vendor,
    toolId,
    subject,
  } = incident
  const id = incidentID
  console.log(id, 'id')
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const userID = Number(sessionStorage.getItem('userId'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolID = Number(sessionStorage.getItem('toolID'))
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))

  const {featureActions} = useFeatureActions(orgId, toolID, roleId, featureId)

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }
  const date = new Date().toISOString()
  const [dropdownData, setDropdownData] = useState({
    severityNameDropDownData: [],
    statusDropDown: [],
    priorityDropDown: [],
    typeDropDown: [],
  })
  const checkboxRef = useRef(null)
  const [incidentHistory, setIncidentHistory] = useState([])
  const [alertsList, setAlertsList] = useState({})
  const [ldp_security_user, setldp_security_user] = useState([])
  const [incidentCreatorRole, setIncidentCreatorRole] = useState([])
  const [notes, setNotes] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [selectedNote, setSelectedNote] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [incidentData, setIncidentData] = useState({
    incidentStatus: '',
    incidentStatusName: '',
    priority: '',
    priorityName: '',
    severity: '',
    severityName: '',
    typeId: '',
    type: '',
    owner: '',
    incidentEmail: '',
    ownerName: '',
    alertId: [],
    significantIncident: 0,
    subject: '',
    description: '',
    orgId: '',
    toolId: '',
    incidentID: '',
    // SLA fields
    resolvedDatetime: null,
    closedDatetime: null,
    resolutionTime: '',
    slaMet: null,
    isEscalated: null,
    sentimentScore: null,
    initialSentimentScore: null,
    resolutionDueDatetime: null,
    createdDate: null,
  })
  console.log(incidentData, 'incidentData')
  const [selectedAlertId, setSelectedAlertId] = useState(null)
  const [selectedAlertPopUp, setSelectedAlertPopUp] = useState(false)
  const handleShowModal = () => setSelectedAlertPopUp(true)
  const handleCloseModal = () => setSelectedAlertPopUp(false)
  const [showModal, setShowModal] = useState(false)
  const handleAddClick = () => {
    setShowModal(true)
  }
  const alertId = incidentData.alertId
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetchUsersByOrgTool(orgId, toolId, userID)
  //     setldp_security_user(response?.usersList != undefined ? response?.usersList : [])
  //   }

  //   fetchData()
  // }, [toolId])
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchUsersForIncidentOwnerRoleUrl(orgId, toolId)
      setldp_security_user(response?.usersList != undefined ? response?.usersList : [])
    }

    fetchData()
  }, [orgId, toolId])
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchUsersForIncidentCreatorRoleUrl(orgId, toolId)
      setIncidentCreatorRole(response?.usersList != undefined ? response?.usersList : [])
    }

    fetchData()
  }, [orgId, toolId])
  useEffect(() => {
    const fetchAllIncidentMasterData = async () => {
      const severityDataRequest = {maserDataType: 'incident_severity', orgId: orgId, toolId: toolId}
      const statusDataRequest = {maserDataType: 'incident_status', orgId: orgId, toolId: toolId}
      const priorityDataRequest = {maserDataType: 'incident_priority', orgId: orgId, toolId: toolId}
      const typeDataRequest = {maserDataType: 'Incident_Type', orgId: orgId, toolId: toolId}

      try {
        const [severityData, statusData, priorityData, typeData] = await Promise.all([
          fetchMasterData(severityDataRequest),
          fetchMasterData(statusDataRequest),
          fetchMasterData(priorityDataRequest),
          fetchMasterData(typeDataRequest),
        ])

        setDropdownData((prevDropdownData) => ({
          ...prevDropdownData,
          severityNameDropDownData: severityData,
          statusDropDown: statusData,
          priorityDropDown: priorityData,
          typeDropDown: typeData,
        }))
      } catch (error) {
        handleError(error)
      }
    }

    fetchAllIncidentMasterData()
  }, [toolId])

  const fetchData = async (resolvedId) => {
    try {
      const data = await fetchIncidentDetails(resolvedId)
      if (data == null) {
        setIncidentData({
          incidentStatus: '',
          incidentStatusName: '',
          priority: '',
          priorityName: '',
          severity: '',
          severityName: '',
          typeId: '',
          type: '',
          owner: '',
          incidentEmail: '',
          ownerName: '',
          alertId: [],
          significantIncident: 0,
          subject: '',
          description: '',
          requestorUserName: '',
        })
        return // Exit the function early
      }

      const {alertIncidentMapping} = data
      const alertIds = alertIncidentMapping?.alertIncidentMappingDtl?.map(
        (mapping) => mapping.alertid
      )

      setIncidentData({
        incidentStatus: data?.incidentStatus,
        incidentStatusName: data?.incidentStatusName,
        priority: data?.priority,
        priorityName: data?.priorityName,
        severity: data?.severity,
        severityName: data?.severityName,
        typeId: data?.typeId,
        type: data?.type,
        incidentEmail: data.incidentEmail,
        owner: data?.owner,
        ownerName: data?.ownerName,
        alertId: alertIds,
        significantIncident: data?.significantIncident,
        subject: data?.subject,
        description: data?.description,
        orgId: data?.orgId,
        toolId: data?.toolId,
        incidentID: data?.incidentID,
        // SLA fields
        resolvedDatetime: data?.resolvedDatetime,
        closedDatetime: data?.closedDatetime,
        resolutionTime: data?.resolutionTime,
        slaMet: data?.slaMet,
        isEscalated: data?.isEscalated,
        sentimentScore: data?.sentimentScore,
        initialSentimentScore: data?.initialSentimentScore,
        resolutionDueDatetime: data?.resolutionDueDatetime,
        createdDate: data?.createdDate,
        requestorUserName: data?.requestorUserName,
      })
    } catch (error) {
      handleError(error)
    }
  }

  useEffect(() => {
    const resolvedId = id !== undefined && id !== null ? id : 0
    fetchData(resolvedId)
  }, [id])
  const fetchNotes = async (id) => {
    if (!id) {
      setNotes([]) // Clear notes if no id
      return
    }
    try {
      const result = await fetchIncidentNotesListUrl(id)
      setNotes(Array.isArray(result) ? result : []) // Always set notes, even if empty
    } catch (error) {
      setNotes([]) // Clear notes on error
      handleError(error)
    }
  }

  useEffect(() => {
    setNotes([]) // Clear notes when incident changes
    if (id) {
      fetchNotes(id)
    }
  }, [id])

  const handleChange = (event, field) => {
    const selectedId = event.target.options
      ? event.target.options[event.target.selectedIndex].getAttribute('data-id')
      : null

    if (field === 'status') {
      setIncidentData({
        ...incidentData,
        incidentStatus: selectedId,
        incidentStatusName: event.target.value,
      })
    } else if (field === 'priority') {
      setIncidentData({
        ...incidentData,
        priority: selectedId,
        priorityName: event.target.value,
      })
    } else if (field === 'severity') {
      setIncidentData({
        ...incidentData,
        severity: selectedId,
        severityName: event.target.value,
      })
    } else if (field === 'type') {
      setIncidentData({
        ...incidentData,
        typeId: selectedId,
        type: event.target.value,
      })
    } else if (field === 'owner') {
      setIncidentData({
        ...incidentData,
        owner: selectedId, // This is the userID from data-id attribute
        ownerName: event.target.value,
      })
    } else if (field === 'incidentEmail') {
      setIncidentData((prevState) => ({
        ...prevState,
        incidentEmail: event.target.value,
      }))
    } else if (field === 'significantIncident') {
      setIncidentData({
        ...incidentData,
        significantIncident: event.target.checked ? 1 : 0,
      })
    } else if (field === 'subject') {
      setIncidentData({
        ...incidentData,
        subject: event.target.value,
      })
    } else if (field === 'description') {
      setIncidentData({
        ...incidentData,
        description: event.target.value,
      })
    }
  }

  const handleSubmit = async (event, incidentData) => {
    event.preventDefault()
    const data = {
      incidentId: Number(id),
      statusId: incidentData.incidentStatus,
      priorityId: incidentData.priority,
      severityId: incidentData.severity,
      typeId: incidentData.typeId,
      ownerUserId: incidentData?.owner,
      incidentEmail: incidentData.incidentEmail,
      significantIncident: incidentData.significantIncident,
      modifiedUserId: userID,
      modifiedDate: date,
      subject: incidentData.subject,
      description: incidentData.description,
      orgId: orgId,
      toolId: toolId,
    }
    try {
      const response = await fetchUpdateIncident(data)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        onRefreshIncidents()
        reloadHistory()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const reloadHistory = () => {
    if (id !== null && id !== undefined) {
      const data = {
        orgId,
        incidentIds: [Number(id)],
      }

      fetchActivitiesUrl(data)
        .then((res) => {
          setIncidentHistory(res.activitiesList)
        })
        .catch((error) => {
          handleError(error)
        })
    }
  }

  useEffect(() => {
    if (id !== null && id !== undefined) {
      reloadHistory()
    }
  }, [id])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = alertId
        const alertsList = await fetchAlertsByAlertIds(data)
        setAlertsList(alertsList)
      } catch (error) {
        handleError(error)
      }
    }

    fetchData()
  }, [alertId])

  //To add Randam colors to the timeline Bullet
  const css_classes = [
    'text-primary',
    'text-secondary',
    'text-success',
    'text-danger',
    'text-warning',
    'text-info',
    'text-dark',
    'text-muted',
  ]

  const getRandomClass = () => {
    const randomIndex = Math.floor(Math.random() * css_classes.length)
    return css_classes[randomIndex]
  }
  const handleAlert = (alertId) => {
    setSelectedAlertId(alertId)
    setSelectedAlertPopUp(true)
  }
  const handleAddNotesClick = () => {
    setModalMode('add')
    setSelectedNote(null)
    setModalVisible(true)
  }

  const handleViewClick = (note) => {
    setModalMode('view')
    setSelectedNote(note)
    setModalVisible(true)
  }

  const handleEditClick = (note) => {
    setModalMode('edit')
    setSelectedNote(note)
    setModalVisible(true)
  }
  const handleReply = () => {
    setShowReplyModal(true)
  }

  const handleSendReply = () => {
    const resolvedId = id !== undefined && id !== null ? id : 0
    fetchData(resolvedId)
    setShowReplyModal(false)
  }

  const handleForward = () => {}

  return (
    <div className='col-md-4 border-1 border-gray-600 incident-details'>
      <div className='card'>
        <div className='bg-heading'>
          <div className='d-flex justify-content-between '>
            <h4 className=''>
              <span className='white fw-bold block pt-3 pb-3'>Incidents Details</span>
            </h4>
            <div>
              <div className='mt-2'>
                <Dropdown isOpen={dropdownOpen} disabled={!id} toggle={() => setDropdownOpen(!dropdownOpen)}>
                  <DropdownToggle className='no-pad'>
                    <div className='btn btn-border btn-small no-horizontal-padding' >
                      Action <i className='fa fa-angle-down' />
                    </div>
                  </DropdownToggle>
                  <DropdownMenu className='w-auto'>
                    <DropdownItem onClick={handleAddClick} disabled={!isActionAuthorized('Create')}>
                      Add
                    </DropdownItem>
                    <DropdownItem onClick={handleReply} disabled={!isActionAuthorized('Reply')}>
                      Reply
                    </DropdownItem>
                    <DropdownItem onClick={handleForward} disabled={!isActionAuthorized('Forward')}>
                      Forward
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <AddIncidentModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onRefreshIncidents={onRefreshIncidents}
              />
              <ReplyModal
                show={showReplyModal}
                onHide={() => setShowReplyModal(false)}
                onSend={handleSendReply}
                incidentData={incidentData || ''}
              />
            </div>
            {activeTab === 'general' && isActionAuthorized('Update') && (
              <div className='mt-2'>
                <button
                  type='submit'
                  onClick={(event) => handleSubmit(event, incidentData)}
                  className='btn btn-primary btn-new btn-small no-horizontal-padding'
                  disabled={!id}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
        <div className='mb-3 incident-tabs'>
          <div className='p-2 bd-highlight'>
            <ul className='nav nav-tabs nav-line-tabs mb-5 fs-8 no-pad'>
              {/* 1. General */}
              <li className='nav-item'>
                <a
                  className={`nav-link ${activeTab === 'general' ? 'active' : ''}`}
                  data-bs-toggle='tab'
                  href='#kt_tab_pane_1'
                  onClick={() => setActiveTab('general')}
                >
                  General
                </a>
              </li>
              {/* 2. SLA Details */}
              <li className='nav-item'>
                <a
                  className={`nav-link ${activeTab === 'sla' ? 'active' : ''}`}
                  data-bs-toggle='tab'
                  href='#kt_tab_pane_sla'
                  onClick={() => setActiveTab('sla')}
                >
                  SLA Details
                </a>
              </li>
              {/* 3. Notes */}
              <li className='nav-item'>
                <a
                  className={`nav-link ${activeTab === 'notes' ? 'active' : ''}`}
                  data-bs-toggle='tab'
                  href='#kt_tab_pane_6'
                  onClick={() => setActiveTab('notes')}
                >
                  Notes
                </a>
              </li>
              {/* 4. Timeline */}
              <li className='nav-item'>
                <a
                  className={`nav-link ${activeTab === 'timeline' ? 'active' : ''}`}
                  data-bs-toggle='tab'
                  href='#kt_tab_pane_5'
                  onClick={() => setActiveTab('timeline')}
                >
                  Timeline
                </a>
              </li>
              {/* 5. Alerts (if present) */}
              {Array.isArray(incidentData?.alertId) && incidentData.alertId.length > 0 && (
                <li className='nav-item'>
                  <a
                    className={`nav-link ${activeTab === 'alerts' ? 'active' : ''}`}
                    data-bs-toggle='tab'
                    href='#kt_tab_pane_2'
                    onClick={() => setActiveTab('alerts')}
                  >
                    Alerts
                  </a>
                </li>
              )}
            </ul>

            <div className='tab-content scroll-y' id='myTabContent'>
              <div
                className='tab-pane fade show active me-n5 pe-5 h-600px header-filter'
                id='kt_tab_pane_1'
                role='tabpanel'
              >
                <div className='row bd-highlight mb-3'>
                  <div className='col-md-3 bd-highlight mt-2'>Requester</div>
                  <div className='col-md-9 bd-highlight'>
                    <div className='w-120px'>
                      <select
                        name='ownerName'
                        className='form-select form-select-solid'
                        data-kt-select2='true'
                        data-placeholder='Select option'
                        data-dropdown-parent='#kt_menu_637dc885a14bb'
                        data-allow-clear='true'
                        value={incidentData?.requestorUserName || ''}
                        onChange={(event) => handleChange(event, 'requestorUserName')}
                      >
                        <option>Select</option>
                        {incidentCreatorRole?.length > 0 &&
                          incidentCreatorRole?.map((item, index) => {
                            return (
                              <option key={index} value={item?.name} data-id={item.userID}>
                                {item?.name}
                              </option>
                            )
                          })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className='row bd-highlight mb-3'>
                  <div className='col-md-3 bd-highlight mt-2'>Email</div>
                  <div className='col-md-9 bd-highlight'>
                    <input
                      type='incidentEmail'
                      className='form-control form-control-sm'
                      placeholder='Enter Email'
                      value={incidentData?.incidentEmail || ''}
                      onChange={(e) => handleChange(e, 'incidentEmail')}
                    />
                  </div>
                </div>
                <div className='row bd-highlight mb-1'>
                  <div className='col-md-3 bd-highlight mt-2'>Subject</div>
                  <div className='col-md-9 bd-highlight'>
                    <div className='w-100'>
                      <input
                        type='text'
                        name='subject'
                        className='form-control form-control-sm'
                        placeholder='Enter Subject'
                        value={incidentData?.subject}
                        onChange={(event) => handleChange(event, 'subject')}
                      />
                    </div>
                  </div>
                </div>

                <div className='row bd-highlight mb-1'>
                  <div className='col-md-3 bd-highlight mt-2'>Status</div>
                  <div className='col-md-9 bd-highlight'>
                    <div className='w-120px'>
                      <select
                        name='incidentStatusName'
                        data-control='select2'
                        data-hide-search='true'
                        className='form-select form-control form-select-white form-select-sm fw-bold'
                        value={incidentData.incidentStatusName}
                        onChange={(event) => handleChange(event, 'status')}
                      >
                        <option value=''>Select</option>
                        {dropdownData.statusDropDown.map((status) => (
                          <option
                            key={status.dataID}
                            value={status.dataValue}
                            data-id={status.dataID}
                          >
                            {status.dataValue}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                {/* Priority */}
                <div className='row bd-highlight mb-1'>
                  <div className='col-md-3 bd-highlight mt-2'>Priority</div>
                  <div className='col-md-9 bd-highlight'>
                    <div className='w-120px'>
                      <select
                        name='priorityName'
                        data-control='select2'
                        data-hide-search='true'
                        className='form-select form-control form-select-white form-select-sm fw-bold'
                        value={incidentData?.priorityName || ''}
                        onChange={(event) => handleChange(event, 'priority')}
                      >
                        <option value=''>Select</option>
                        {dropdownData?.priorityDropDown?.map((priority) => (
                          <option
                            key={priority?.dataID}
                            value={priority?.dataValue}
                            data-id={priority?.dataID}
                          >
                            {priority?.dataValue}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                {/* Severity */}
                <div className='row bd-highlight mb-1'>
                  <div className='col-md-3 bd-highlight mt-2'>Severity</div>
                  <div className='col-md-9 bd-highlight'>
                    <div className='w-120px'>
                      <select
                        name='severityName'
                        data-control='select2'
                        data-hide-search='true'
                        className='form-select form-select-sm'
                        value={incidentData?.severityName || ''}
                        onChange={(event) => handleChange(event, 'severity')}
                      >
                        <option value=''>Select</option>
                        {dropdownData?.severityNameDropDownData.map((severity) => (
                          <option
                            key={severity.dataID}
                            value={severity.dataValue}
                            data-id={severity.dataID}
                          >
                            {severity.dataValue}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Type */}
                <div className='row bd-highlight mb-1'>
                  <div className='col-md-3 bd-highlight mt-2'>Type</div>
                  <div className='col-md-9 bd-highlight'>
                    <div className='w-120px'>
                      <select
                        name='type'
                        data-control='select2'
                        data-hide-search='true'
                        className='form-select form-control form-select-white form-select-sm fw-bold'
                        value={incidentData?.type || ''}
                        onChange={(event) => handleChange(event, 'type')}
                      >
                        <option value=''>Select</option>
                        {dropdownData?.typeDropDown.map((type) => (
                          <option key={type.dataID} value={type.dataValue} data-id={type.dataID}>
                            {type.dataValue}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className='row bd-highlight mb-3'>
                  <div className='col-md-3 bd-highlight mt-2'>Owner</div>
                  <div className='col-md-9 bd-highlight'>
                    <div className='w-120px'>
                      <select
                        name='ownerName'
                        className='form-select form-select-solid'
                        data-kt-select2='true'
                        data-placeholder='Select option'
                        data-dropdown-parent='#kt_menu_637dc885a14bb'
                        data-allow-clear='true'
                        value={incidentData?.ownerName || ''}
                        onChange={(event) => handleChange(event, 'owner')}
                      >
                        <option>Select</option>
                        {ldp_security_user?.length > 0 &&
                          ldp_security_user?.map((item, index) => {
                            return (
                              <option key={index} value={item?.name} data-id={item.userID}>
                                {item?.name}
                              </option>
                            )
                          })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className='row bd-highlight mb-1'>
                  <div className='col-md-3 bd-highlight mt-2'>Description</div>
                  <div className='col-md-9 bd-highlight'>
                    <div className='w-100'>
                      <textarea
                        name='description'
                        className='form-control form-control-sm'
                        placeholder='Enter Description'
                        rows={3}
                        value={incidentData.description}
                        onChange={(event) => handleChange(event, 'description')}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className='checkbox-wrapper'>
                  <input
                    className='p-2 v-middle'
                    type='checkbox'
                    checked={incidentData?.significantIncident}
                    onChange={(event) => handleChange(event, 'significantIncident')}
                    value={incidentData.significantIncident}
                    ref={checkboxRef}
                  />
                  <label style={{marginLeft: '8px'}}>Significant Incident</label>
                </div>

                {/* Text */}
                <div className='bd-highlight mb-3 bdr-top pt-5 mt-2'>
                  <div className='bd-highlight mb-3'>
                    <div className='d-flex align-items-top gap-2'>
                      <span className='fw-bold m-width'>Incident Name </span> <b>:</b> {subject}
                    </div>
                  </div>
                  <div className='bd-highlight mb-3'>
                    <div className='d-flex align-items-center gap-2'>
                      <span className='fw-bold m-width'>Event ID </span> <b>:</b> {eventID}
                    </div>
                  </div>
                  <div className='bd-highlight mb-3'>
                    <div className='d-flex align-items-center gap-2'>
                      <span className='fw-bold m-width'> Destination User </span> <b>:</b>{' '}
                      {destinationUser}
                    </div>
                  </div>
                  <div className='bd-highlight mb-3'>
                    <div className='d-flex align-items-center gap-2'>
                      <span className='fw-bold m-width'>Source IP </span> <b>:</b> {sourceIP}
                    </div>
                  </div>
                  <div className='bd-highlight mb-3'>
                    <div className='d-flex align-items-center gap-2'>
                      <span className='fw-bold m-width'>Vendor</span> <b>:</b> {vendor}
                    </div>
                  </div>
                </div>
                <div className='bd-highlight mb-3'>
                  <div className='d-flex align-items-center gap-2'>
                    <span className='fw-bold m-width'>Incident ID</span> <b>:</b> {incidentID}
                  </div>
                </div>

                <div className='bd-highlight mb-3'>
                  <div className='d-flex align-items-center gap-2'>
                    <span className='fw-bold m-width'>Created</span> <b>:</b>{' '}
                    {createdDate && getCurrentTimeZone(createdDate)}
                  </div>
                </div>

                <div className='bd-highlight mb-3'>
                  <div className='d-flex align-items-center gap-2'>
                    <span className='fw-bold m-width'>Updated</span> <b>:</b>{' '}
                    {modifiedDate && getCurrentTimeZone(modifiedDate)}
                  </div>
                </div>
              </div>

              <div className='tab-pane fade' id='kt_tab_pane_2' role='tabpanel'>
                <table
                  className='me-n5 pe-5 table table-hover table-row-dashed fs-6 gy-5 my-0 dataTable no-footer'
                  id='kt_inbox_listing'
                >
                  <tbody>
                    {alertsList && alertsList.length > 0 ? (
                      alertsList.map((alert, index) => (
                        <tr className='bg-gray-100 mb-3' key={index}>
                          <td className='p-2 pb-8'>
                            <div className='d-flex justify-content-between bd-highlight'>
                              <div
                                className='p-1 fs-12'
                                style={{width: '190px', textAlign: 'left'}}
                              >
                                <div className='text-dark mb-1'>
                                  <div>
                                    <span
                                      className='link-txt'
                                      onClick={() => handleAlert(alert.alertID)}
                                    >
                                      {alert.name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {/* <div className='p-1 bd-highlight'>
                                <a
                                  href='#'
                                  className='btn btn-sm btn-icon btn-light btn-secondary mx-1'
                                >
                                  <i className='fa-solid fa-trash'></i>
                                </a>
                                <a
                                  href='#'
                                  className='btn btn-sm btn-icon btn-light btn-secondary mx-1'
                                >
                                  <i className='fa-solid fa-arrow-up'></i>
                                </a>
                              </div> */}
                            </div>

                            {/* <div className='d-flex justify-content-between align-text-left bd-highlight'>
                              <div className='p-1 bd-highlight fw-bold fs-12'>Suspicious Rate</div>
                              <div className='p-1 bd-highlight fw-bold fs-12'>
                                <i className='fa-solid fa-circle-check text-success'></i> 1
                              </div>
                            </div> */}
                            <div className='d-flex justify-content-between align-text-left bd-highlight'>
                              <div className='p-1 bd-highlight fs-12'>Detected date</div>
                              <div className='p-1 fs-12'>
                                {alert.detectedtime && (
                                  <div className='gray'>
                                    {getCurrentTimeZone(alert.detectedtime)}
                                  </div>
                                )}
                              </div>
                            </div>
                            <hr className='my-0' />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan='3'>No alerts available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {selectedAlertPopUp && (
                  <IncidentAlertPopUp
                    selectedAlertId={selectedAlertId}
                    show={selectedAlertPopUp}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                  />
                )}
              </div>
              <div className='tab-pane fade' id='kt_tab_pane_3' role='tabpanel'>
                <table className='table align-middle gs-0 gy-4 dash-table'>
                  <thead>
                    <tr className='fw-bold text-muted bg-blue'>
                      <th className='min-w-50px'>PlayBook Name</th>
                      <th className='min-w-50px'>Description</th>
                      <th className='min-w-50px'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className='fs-12'>
                      <td>Login Failure</td>
                      <td>Failed Login</td>
                      <td>
                        <span className='badge badge-success'>Active</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className='tab-pane fade' id='kt_tab_pane_4' role='tabpanel'>
                Observables data
              </div>
              <div className='tab-pane fade timeline-section' id='kt_tab_pane_5' role='tabpanel'>
                <div className='pt-6 h-600px scroll-y'>
                  <div className='timeline-label'>
                    {incidentHistory && incidentHistory.length > 0 ? (
                      incidentHistory
                        .sort((a, b) => b.activityId - a.activityId)
                        .map((item) => {
                          const formattedDateTime = getCurrentTimeZone(item.activityDate)

                          return (
                            <div className='timeline-item mb-5' key={item.activityId}>
                              <div className='timeline-label fw-bold text-gray-800 fs-6'>
                                <p>{formattedDateTime}</p>
                                {/* <p className="time">{formattedDateTime}</p> */}
                                <p className='text-muted'>{item.createedUser}</p>
                              </div>

                              <div className='timeline-badge'>
                                <i className={`fa fa-genderless ${getRandomClass()} fs-1`}></i>
                              </div>
                              <div className='fw-semibold text-gray-700 ps-3 fs-7'>
                                {item.primaryDescription}
                              </div>
                            </div>
                          )
                        })
                    ) : (
                      <div className='text-gray-500'>No data found</div>
                    )}
                  </div>
                </div>
              </div>
              <div className='tab-pane fade' id='kt_tab_pane_sla' role='tabpanel'>
                <div className='p-3'>
                  <table className='table table-bordered table-sm w-auto'>
                    <tbody>
                      <tr>
                        <th>Resolution Due</th>
                        <td>
                          {incidentData.resolutionDueDatetime
                            ? getCurrentTimeZone(incidentData.resolutionDueDatetime)
                            : 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <th>Resolved Date Time</th>
                        <td>
                          {incidentData.resolvedDatetime
                            ? getCurrentTimeZone(incidentData.resolvedDatetime)
                            : 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <th>Closed Date Time</th>
                        <td>
                          {incidentData.closedDatetime
                            ? getCurrentTimeZone(incidentData.closedDatetime)
                            : 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <th>Resolution Time</th>
                        <td>{incidentData.resolutionTime || 0} min</td>
                      </tr>
                      <tr>
                        <th>SLA Met</th>
                        <td>
                          {incidentData.slaMet !== null && incidentData.slaMet !== undefined
                            ? incidentData.slaMet
                              ? 'Yes'
                              : 'No'
                            : 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <th>Escalated</th>
                        <td>{incidentData.isEscalated ? 'Yes' : 'No'}</td>
                      </tr>
                      <tr>
                        <th>Sentiment Score</th>
                        <td>
                          {incidentData.sentimentScore !== null &&
                          incidentData.sentimentScore !== undefined
                            ? incidentData.sentimentScore
                            : 0}
                        </td>
                      </tr>
                      <tr>
                        <th>Initial Sentiment Score</th>
                        <td>
                          {incidentData.initialSentimentScore !== null &&
                          incidentData.initialSentimentScore !== undefined
                            ? incidentData.initialSentimentScore
                            : 0}
                        </td>
                      </tr>
                      <tr>
                        <th>Created Date Time</th>
                        <td>
                          {incidentData.createdDate
                            ? getCurrentTimeZone(incidentData.createdDate)
                            : 'N/A'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className='tab-pane fade' id='kt_tab_pane_6' role='tabpanel'>
                {id && (
                  <div className='d-flex justify-content-end mb-1'>
                    <button
                      className='btn btn-primary btn-sm'
                      title='Add Note'
                      onClick={handleAddNotesClick}
                    >
                      <i className='fa fa-plus ms-0' /> Add Note
                    </button>
                  </div>
                )}

                <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
                  <thead>
                    <tr className='fw-bold text-muted bg-blue'>
                      <th className='min-w-50px'>User</th>
                      <th className='min-w-50px'>Date</th>
                      <th className='min-w-50px'>Notes</th>
                      <th className='min-w-50px'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(notes) && notes.length > 0 ? (
                      notes.map((note) => (
                        <tr key={note.incidentId} className='table-row'>
                          <td>{note.createdUser || 'N/A'}</td>
                          <td>{getCurrentTimeZone(note.createdDate) || 'N/A'}</td>
                          <td>{note.notes || 'N/A'}</td>
                          <td>
                            <div className='d-flex'>
                              <span>
                                <i
                                  className='fa fa-eye cursor me-2'
                                  onClick={() => handleViewClick(note)}
                                />
                              </span>
                              <span>
                                <i className='fa fa-pencil' onClick={() => handleEditClick(note)} />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan='4' className='text-center text-muted'>
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <NotesModalComponent
                  show={modalVisible}
                  mode={modalMode}
                  noteData={selectedNote}
                  onClose={() => setModalVisible(false)}
                  fetchNotes={fetchNotes}
                  id={id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IncidentDetails
