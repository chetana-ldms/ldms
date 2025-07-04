import React, {useState, useRef, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {
  fetchCreateIncident,
  fetchMasterData,
  fetchOrganizationToolsDetailsUrl,
  fetchUsersByOrgTool,
} from '../../../../../api/IncidentsApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {fetchOrganizationToolsSecurityUrl} from '../../../../../api/securityApi'

const AddIncidentModal = ({show, onHide, onRefreshIncidents}) => {
  const userID = Number(sessionStorage.getItem('userId'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const ToolId = Number(sessionStorage.getItem('toolID'))
  const date = new Date().toISOString()
  const [loading, setLoading] = useState(false)
  const [tools, setTools] = useState([])
  const [isOwnerEmailChecked, setIsOwnerEmailChecked] = useState(false)
  const checkboxRef = useRef()
  const toolRef = useRef()
  const [ldp_security_user, setldp_security_user] = useState([])
  console.log(ldp_security_user, 'ldp_security_user')
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
    incidentEmail: '',
    ownerName: '',
    description: '',
    significantIncident: false,
    toolID: '',
  })
  useEffect(() => {
    if (isOwnerEmailChecked) {
      const selectedOwner = ldp_security_user.find((user) => user.name === incidentData.ownerName)
      if (selectedOwner) {
        setIncidentData((prev) => ({
          ...prev,
          incidentEmail: selectedOwner.emailId || '',
        }))
      }
    }
  }, [incidentData.ownerName, isOwnerEmailChecked, ldp_security_user])

  useEffect(() => {
    const reload = async () => {
      try {
        setLoading(true)
        const data = await fetchOrganizationToolsDetailsUrl(orgId)
        const modifiedTools = [{toolID: -1, toolName: 'Internal Incident'}, ...data]
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
      const selectedTool = tools.find((tool) => tool.toolID === Number(incidentData.toolID))
      if (selectedTool?.incidentEmail != null) {
        setIncidentData((prev) => ({
          ...prev,
          incidentEmail: selectedTool.incidentEmail,
        }))
      } else {
        setIncidentData((prev) => ({
          ...prev,
          incidentEmail: '',
        }))
      }

      const resolvedToolId =
        selectedTool?.incidentsToolId > 0 ? selectedTool.incidentsToolId : selectedTool?.toolID

      if (!resolvedToolId) return

      try {
        const response = await fetchUsersByOrgTool(orgId, resolvedToolId, userID)
        setldp_security_user(response?.usersList ?? [])
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [incidentData.toolID, tools])
  useEffect(() => {
    const fetchAllIncidentMasterData = async () => {
      const selectedTool = tools.find((tool) => tool.toolID === Number(incidentData.toolID))
      const resolvedToolId =
        selectedTool?.incidentsToolId > 0 ? selectedTool.incidentsToolId : selectedTool?.toolID

      if (!resolvedToolId) return

      const severityDataRequest = {
        maserDataType: 'incident_severity',
        orgId,
        toolId: resolvedToolId,
      }
      const statusDataRequest = {
        maserDataType: 'incident_status',
        orgId,
        toolId: resolvedToolId,
      }
      const priorityDataRequest = {
        maserDataType: 'incident_priority',
        orgId,
        toolId: resolvedToolId,
      }
      const typeDataRequest = {
        maserDataType: 'Incident_Type',
        orgId,
        toolId: resolvedToolId,
      }

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
  }, [incidentData.toolID, tools])

  const handleChange = (event, field) => {
    const {value, checked, type} = event.target
    setIncidentData((prev) => ({
      ...prev,
      [field]: type === 'checkbox' ? checked : value,
    }))
  }
  const handleSave = async () => {
    if (!incidentData.toolID) {
      notifyFail('Please select a tool')
      return
    }
    if (!incidentData.subject) {
      notifyFail('Please enter subject')
      return
    }
    if (!incidentData.incidentStatusName) {
      notifyFail('Please select a incident')
      return
    }
    if (!incidentData.priorityName) {
      notifyFail('Please select a priority')
      return
    }
    if (!incidentData.incidentEmail) {
      notifyFail('Please enter the incidentEmail')
      return
    }
    if (!incidentData.description) {
      notifyFail('Please enter a description')
      return
    }
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
      toolId: Number(incidentData.toolID),
      incidentStatus: getIdByValue(dropdownData.statusDropDown, incidentData.incidentStatusName),
      score: '0',
      significantIncident: incidentData.significantIncident ? 1 : 0,
      createDate: date,
      createUserId: userID,
      incidentEmail: incidentData.incidentEmail,
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
              Select Tool <sup className='red'>*</sup>
            </label>
          </div>
          <div className='col-md-9'>
            <select
              className='form-select form-select-sm'
              value={incidentData.toolID}
              onChange={(e) => handleChange(e, 'toolID')}
            >
              <option value=''>Select</option>
              {tools !== null &&
                tools?.map((item, index) => (
                  <option key={index} value={item.toolID}>
                    {item.toolName}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className='row mb-2'>
          <div className='col-md-3 mt-2'>Subject <sup className='red'>*</sup></div>
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
        <div className='row mb-2'>
          <div className='col-md-3 mt-2'>Status <sup className='red'>*</sup> </div>
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
        <div className='row mb-2'>
          <div className='col-md-3 mt-2'>Priority <sup className='red'>*</sup> </div>
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
        <div className='row mb-2'>
          <div className='col-md-3 mt-2'>Email</div>
          <div className='col-md-5'>
            <input
              type='email'
              className='form-control form-control-sm'
              placeholder='Enter Email'
              value={incidentData?.incidentEmail || ''}
              onChange={(e) => handleChange(e, 'incidentEmail')}
              disabled={isOwnerEmailChecked}
            />
          </div>
          <div className='col-md-4 d-flex align-items-center'>
            <div className='form-check ms-2'>
              <input
                className='form-check-input'
                type='checkbox'
                id='ownerBasedEmail'
                checked={isOwnerEmailChecked}
                onChange={(e) => {
                  const isChecked = e.target.checked
                  setIsOwnerEmailChecked(isChecked)

                  if (isChecked) {
                    const selectedOwner = ldp_security_user.find(
                      (user) => user.name === incidentData.ownerName
                    )
                    if (selectedOwner) {
                      setIncidentData((prev) => ({
                        ...prev,
                        incidentEmail: selectedOwner.emailId || '',
                      }))
                    }
                  }
                }}
              />

              <label className='form-check-label ms-1' htmlFor='ownerBasedEmail'>
                Owner-based email
              </label>
            </div>
          </div>
        </div>

        <div className='row mb-2'>
          <div className='col-md-3 mt-2'>Description <sup className='red'>*</sup> </div>
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
