import React, {useState, useRef, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {fetchUsers} from '../../../../../api/AlertsApi'
import {fetchMasterData} from '../../../../../api/Api'
import {fetchCreateIncident} from '../../../../../api/IncidentsApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {fetchOrganizationToolsSecurityUrl} from '../../../../../api/securityApi'

const AddIncidentModal = ({show, onHide, onRefreshIncidents}) => {
  const userID = Number(sessionStorage.getItem('userId'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolID = Number(sessionStorage.getItem('toolID'))
  const date = new Date().toISOString()
  const [loading, setLoading] = useState(false)
  const [tools, setTools] = useState([])
  const checkboxRef = useRef()
  const toolRef = useRef()
  const [ldp_security_user, setldp_security_user] = useState([])
  const [dropdownData, setDropdownData] = useState({
    severityNameDropDownData: [],
    statusDropDown: [],
    priorityDropDown: [],
    typeDropDown: [],
  })
  const [incidentData, setIncidentData] = useState({
    subject: '',
    incidentStatusName: '',
    priorityName: '',
    severityName: '',
    type: '',
    ownerName: '',
    description: '',
    significantIncident: false,
  })
  useEffect(() => {
    const reload = async () => {
      try {
        setLoading(true)
        const data = await fetchOrganizationToolsSecurityUrl(orgId)
        const modifiedTools = [
          {toolId: -1, toolName: 'Local Incident'},
          ...data,
        ]
        setTools(modifiedTools)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    reload()
  }, [orgId])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchUsers(orgId, userID)
      setldp_security_user(response?.usersList != undefined ? response?.usersList : [])
    }

    fetchData()
  }, [])
  useEffect(() => {
    const fetchAllIncidentMasterData = async () => {
      if (!incidentData.toolId) return

      const selectedToolId = Number(incidentData.toolId)
      const severityDataRequest = {
        maserDataType: 'incident_severity',
        orgId,
        toolId: selectedToolId,
      }
      const statusDataRequest = {maserDataType: 'incident_status', orgId, toolId: selectedToolId}
      const priorityDataRequest = {
        maserDataType: 'incident_priority',
        orgId,
        toolId: selectedToolId,
      }
      const typeDataRequest = {maserDataType: 'Incident_Type', orgId, toolId: selectedToolId}

      try {
        const [severityData, statusData, priorityData, typeData] = await Promise.all([
          fetchMasterData(severityDataRequest),
          fetchMasterData(statusDataRequest),
          fetchMasterData(priorityDataRequest),
          fetchMasterData(typeDataRequest),
        ])

        setDropdownData({
          severityNameDropDownData: severityData,
          statusDropDown: statusData,
          priorityDropDown: priorityData,
          typeDropDown: typeData,
        })
      } catch (error) {
        console.log(error)
      }
    }

    fetchAllIncidentMasterData()
  }, [incidentData.toolId])

  const handleChange = (event, field) => {
    const {value, checked, type} = event.target
    setIncidentData((prev) => ({
      ...prev,
      [field]: type === 'checkbox' ? checked : value,
    }))
  }
  const handleSave = async () => {
    const getIdByValue = (array, value) => {
      const match = array.find((item) => item.dataValue === value)
      return match ? match.dataID : 0
    }

    const ownerId =
      ldp_security_user.find((user) => user.name === incidentData.ownerName)?.userID || 0

    const payload = {
      description: incidentData.description,
      subject: incidentData.subject,
      priority: getIdByValue(dropdownData.priorityDropDown, incidentData.priorityName),
      severity: getIdByValue(dropdownData.severityNameDropDownData, incidentData.severityName),
      owner: ownerId,
      typeId: getIdByValue(dropdownData.typeDropDown, incidentData.type),
      orgId: orgId,
      toolId: Number(incidentData.toolId),
      incidentStatus: getIdByValue(dropdownData.statusDropDown, incidentData.incidentStatusName),
      score: '0',
      significantIncident: incidentData.significantIncident ? 1 : 0,
      createDate: date,
      createUserId: userID,
    }

    try {
      const response = await fetchCreateIncident(payload)
      const {isSuccess, message} = response

      if (isSuccess) {
        notify(message)
        onRefreshIncidents()
        resetForm()
        onHide()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const resetForm = () => {
    setIncidentData({
      subject: '',
      incidentStatusName: '',
      priorityName: '',
      severityName: '',
      type: '',
      ownerName: '',
      description: '',
      significantIncident: false,
      toolId: '',
    })
    if (checkboxRef.current) checkboxRef.current.checked = false
  }

  return (
    <Modal
      show={show}
      onHide={() => {
        resetForm()
        onHide()
      }}
      className='addAIncidentModal application-modal'
    >
      <Modal.Header closeButton>
        <Modal.Title>New Incident</Modal.Title>
        <button type='button' className='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className='row mb-2'>
          <div className='col-md-3 mt-2'>
            {' '}
            <label htmlFor='toolID' className=''>
              Select Tool
            </label>
          </div>
          <div className='col-md-9'>
            <select
              className='form-select form-select-sm'
              value={incidentData.toolId}
              onChange={(e) => handleChange(e, 'toolId')}
            >
              <option value=''>Select</option>
              {tools !== null &&
                tools?.map((item, index) => (
                  <option key={index} value={item.toolId}>
                    {item.toolName}
                  </option>
                ))}
            </select>
          </div>
        </div>
        {/* Subject */}
        <div className='row mb-2'>
          <div className='col-md-3 mt-2'>Subject</div>
          <div className='col-md-9'>
            <input
              type='text'
              className='form-control form-control-sm'
              placeholder='Enter Subject'
              value={incidentData.subject}
              onChange={(e) => handleChange(e, 'subject')}
            />
          </div>
        </div>

        {/* Status */}
        <div className='row mb-2'>
          <div className='col-md-3 mt-2'>Status</div>
          <div className='col-md-9'>
            <select
              className='form-select form-select-sm'
              value={incidentData.incidentStatusName}
              onChange={(e) => handleChange(e, 'incidentStatusName')}
            >
              <option value=''>Select</option>
              {dropdownData?.statusDropDown.map((status) => (
                <option key={status.dataID} value={status.dataValue}>
                  {status.dataValue}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority */}
        <div className='row mb-2'>
          <div className='col-md-3 mt-2'>Priority</div>
          <div className='col-md-9'>
            <select
              className='form-select form-select-sm'
              value={incidentData.priorityName}
              onChange={(e) => handleChange(e, 'priorityName')}
            >
              <option value=''>Select</option>
              {dropdownData?.priorityDropDown.map((priority) => (
                <option key={priority.dataID} value={priority.dataValue}>
                  {priority.dataValue}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Severity */}
        <div className='row mb-2'>
          <div className='col-md-3 mt-2'>Severity</div>
          <div className='col-md-9'>
            <select
              className='form-select form-select-sm'
              value={incidentData.severityName}
              onChange={(e) => handleChange(e, 'severityName')}
            >
              <option value=''>Select</option>
              {dropdownData?.severityNameDropDownData.map((severity) => (
                <option key={severity.dataID} value={severity.dataValue}>
                  {severity.dataValue}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type */}
        <div className='row mb-2'>
          <div className='col-md-3 mt-2'>Type</div>
          <div className='col-md-9'>
            <select
              className='form-select form-select-sm'
              value={incidentData.type}
              onChange={(e) => handleChange(e, 'type')}
            >
              <option value=''>Select</option>
              {dropdownData?.typeDropDown.map((type) => (
                <option key={type.dataID} value={type.dataValue}>
                  {type.dataValue}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Owner */}
        <div className='row mb-2'>
          <div className='col-md-3 mt-2'>Owner</div>
          <div className='col-md-9'>
            <select
              className='form-select form-select-sm'
              value={incidentData.ownerName}
              onChange={(e) => handleChange(e, 'ownerName')}
            >
              <option value=''>Select</option>
              {ldp_security_user?.map((user, index) => (
                <option key={index} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className='row mb-2'>
          <div className='col-md-3 mt-2'>Description</div>
          <div className='col-md-9'>
            <textarea
              className='form-control form-control-sm'
              placeholder='Enter Description'
              rows={3}
              value={incidentData.description}
              onChange={(e) => handleChange(e, 'description')}
            />
          </div>
        </div>

        {/* Significant Incident */}
        <div className='form-check'>
          <input
            className='form-check-input'
            type='checkbox'
            checked={incidentData.significantIncident}
            onChange={(e) => handleChange(e, 'significantIncident')}
            ref={checkboxRef}
          />
          <label className='form-check-label ms-2'>Significant Incident</label>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant='secondary'
          onClick={() => {
            resetForm()
            onHide()
          }}
        >
          Close
        </Button>

        <Button variant='primary' onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddIncidentModal
