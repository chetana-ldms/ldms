import React, {useState, useRef, useEffect} from 'react'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom'
import {fetchOrganizations, fetchRoles} from '../../../../../api/Api'
import {
  fetchIncidentClientsUrl,
  fetchLDPToolsUrl,
  fetchRolesUrl,
  fetchUserDetails,
  fetchUserUpdateUrl,
} from '../../../../../api/ConfigurationApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {useErrorBoundary} from 'react-error-boundary'
import {ToastContainer} from 'react-toastify'
import MapUserPopup from './MapUserPopup'

const UpdateUserData = () => {
  const empId = useRef()
  const jobTitle = useRef()
  const mobileNumber = useRef()
  const [isInternalStaff, setIsInternalStaff] = useState(false)
  const [clientList, setClientList] = useState([])
  const clientIdRef = useRef()
  const handleError = useErrorBoundary()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const roleID = Number(sessionStorage.getItem('roleID'))
  const userID = Number(sessionStorage.getItem('userId'))
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [roleTypes, setRoleTypes] = useState([])
  const [organizationList, setOrganizationList] = useState([])
  const [isDefaultData, setIsDefaultData] = useState(false)
  const [toolTypeAction, setToolTypeAction] = useState({
    toolTypeName: '',
    toolTypeID: '',
    toolId: '',
    orgId: '',
    roleID: '',
    clientId: '',
  })

  const [tools, setTools] = useState([])
  const [selectedTool, setSelectedTool] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const {id} = useParams()
  const userName = useRef()
  const userEmail = useRef()
  const orgID = useRef()
  const roleType = useRef()
  const toolType = useRef()
  const mapUserName = useRef()
  const mapuserId = useRef()
  const errors = {}
  const location = useLocation()
  const [save, setSave] = useState(location.state?.save || '')
  useEffect(() => {
    setSave(location.state?.save || '')
  }, [location.state])
  const handleToolChange = (e) => {
    setSelectedTool(e.target.value)
  }
  const fetchClients = async () => {
    try {
      if (!toolTypeAction?.orgId) return
      const toolIdToSend = toolTypeAction.toolId || 0

      const response = await fetchIncidentClientsUrl(toolTypeAction?.orgId, toolIdToSend, 0)
      setClientList(response)
    } catch (error) {
      handleError(error)
    }
  }
  useEffect(() => {
    console.log('useEffect triggered with:', toolTypeAction.orgId, toolTypeAction.toolId)
    fetchClients()
  }, [toolTypeAction.orgId, toolTypeAction.toolId])
  const reloadTools = async () => {
    try {
      const response = await fetchLDPToolsUrl()
      setTools(response)
    } catch (error) {
      console.error('Failed to fetch tools:', error)
    }
  }
  useEffect(() => {
    reloadTools()
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserDetails(
          id,
          userName,
          userEmail,
          mapUserName,
          mapuserId,
          empId,
          jobTitle,
          mobileNumber
        )
        setToolTypeAction({
          ...toolTypeAction,
          roleID: data.roleID,
          orgId: data.orgId,
          toolId: data.toolId,
          clientId: data.clientId,
        })
        setIsDefaultData(data.defaultUser || false)
        setIsInternalStaff(data.isInternalStaff || false)
      } catch (error) {
        handleError(error)
      }
    }

    fetchData()
  }, [id, userName, userEmail, mapUserName, mapuserId, empId, jobTitle, mobileNumber])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const organizationsResponse = await fetchOrganizations()
        setOrganizationList(organizationsResponse)
      } catch (error) {
        handleError(error)
      }
    }

    fetchData()
  }, [])
 const handleSelectChange = (e, field) => {
  const selectedId = e.target.options[e.target.selectedIndex].getAttribute('data-id')

  if (field === 'toolId') {
    if (mapUserName.current) mapUserName.current.value = ''
    if (mapuserId.current) mapuserId.current.value = ''
  }

  setToolTypeAction((prev) => ({
    ...prev,
    [field]: selectedId,
  }))
}


  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    if (!userName.current.value) {
      errors.userName = 'Enter username'
      setLoading(false)
      return errors
    }
    const emailValue = userEmail.current.value
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(emailValue)) {
      notifyFail('Enter a valid Email')
      setLoading(false)
      return
    }
    if (!orgID.current.value) {
      errors.passWord = 'Enter password'
      setLoading(false)
      return errors
    }
    if (!roleType.current.value) {
      errors.roleType = 'Select Role Type'
      setLoading(false)
      return errors
    }
    const modifiedUserId = Number(sessionStorage.getItem('userId'))
    const modifiedDate = new Date().toISOString()
    const orgId = sessionStorage.getItem('orgId')
    var data = {
      name: userName.current.value,
      emailId: userEmail.current.value,
      roleID: roleType.current.value,
      orgId: Number(orgID.current.value),
      modifiedDate,
      userID: id,
      modifiedUserId,
      mapUserName: mapUserName.current.value,
      mapUserId: mapuserId.current.value,
      toolId: Number(toolType.current.value),
      defaultUser: isDefaultData,
      empId: empId.current.value || '',
      isInternalStaff: isInternalStaff ? 1 : 0,
      clientId: clientIdRef.current.value || 0,
      jobTitle: jobTitle.current.value || '',
      mobileNumber: mobileNumber.current.value || '',
    }
    try {
      const responseData = await fetchUserUpdateUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        setTimeout(() => {
          navigate('/qradar/users-data/list')
        }, 2000)
      } else {
        notifyFail(message)
      }
    } catch (error) {
      handleError(error)
    }
    setLoading(false)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRolesUrl(orgId, userID)
        setRoleTypes(data)
      } catch (error) {
        handleError(error)
      }
    }
    fetchData()
  }, [])
  const handleMapUserClick = () => {
    if (!toolTypeAction.toolId) {
      notifyFail('Select the tool first')
      return
    }
    setShowPopup(true)
  }
  return (
    <div className='config card'>
      <ToastContainer />
      <div className='card-header bg-heading'>
        <h3 className='card-title align-items-start flex-column'>
          {save ? (
            <span className='white'>View User</span>
          ) : (
            <span className='white'>Update User</span>
          )}
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/users-data/list' className='white fs-15 text-underline'>
              <i className='fa fa-chevron-left white mg-right-5' />
              Back
            </Link>
          </div>
        </div>
      </div>
      <form>
        <div className='card-body pad-10'>
          <div className='row mb-6'>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='userName' className='form-label fs-6 fw-bolder mb-3'>
                  Enter User Name
                </label>
                <input
                  type='text'
                  required
                  className='form-control form-control-lg form-control-solid'
                  id='userName'
                  maxLength={200}
                  ref={userName}
                  placeholder='Ex: username'
                />
              </div>
            </div>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='userName' className='form-label fs-6 fw-bolder mb-3'>
                  User Email
                </label>
                <input
                  type='email'
                  className='form-control form-control-lg form-control-solid'
                  id='userEmail'
                  ref={userEmail}
                  maxLength={100}
                  placeholder='email@user.com'
                  required
                  pattern='^[^\s@]+@[^\s@]+\.[^\s@]+$'
                  title='Please enter a valid email address'
                />
              </div>
            </div>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='orgID' className='form-label fs-6 fw-bolder mb-3'>
                  Organization
                </label>
                <select
                  className='form-select form-select-solid bg-blue-light'
                  id='orgID'
                  ref={orgID}
                  value={toolTypeAction.orgId}
                  onChange={(e) => handleSelectChange(e, 'orgId')}
                  required
                >
                  <option value=''>Select organization</option>
                  {roleID === 1 &&
                    organizationList?.length > 0 &&
                    organizationList.map((item, index) => (
                      <option value={item.orgID} key={index} data-id={item.orgID}>
                        {item.orgName}
                      </option>
                    ))}
                  {roleID !== 1 &&
                    organizationList?.length > 0 &&
                    organizationList
                      .filter((item) => item.orgID === orgId)
                      .map((item, index) => (
                        <option value={item.orgID} key={index} data-id={item.orgID}>
                          {item.orgName}
                        </option>
                      ))}
                </select>
              </div>
            </div>
          </div>
          <div className='row mb-6'>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='toolType' className='form-label fs-6 fw-bolder mb-3'>
                  Select Role Type
                </label>
                <select
                  className='form-select form-select-solid'
                  id='roleType'
                  ref={roleType}
                  value={toolTypeAction.roleID}
                  onChange={(e) => handleSelectChange(e, 'roleID')}
                  required
                >
                  <option value=''>Select Role Type</option>
                  {roleTypes.map((item, index) => (
                    <option value={item.roleID} key={index} data-id={item.roleID}>
                      {item.roleName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='toolType' className='form-label fs-6 fw-bolder mb-3'>
                  Select Tool
                </label>
                <select
                  className='form-select form-select-solid'
                  id='tools'
                  ref={toolType}
                  value={toolTypeAction.toolId}
                  onChange={(e) => handleSelectChange(e, 'toolId')}
                  required
                >
                  <option value=''>Select Tool Name</option>
                  {tools.map((item, index) => (
                    <option value={item.toolId} key={index} data-id={item.toolId}>
                      {item.toolName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='form-check mt-10 d-flex'>
                <input
                  type='checkbox'
                  className='form-check-input'
                  id='defaultDataCheckbox'
                  checked={isDefaultData}
                  onChange={(e) => setIsDefaultData(e.target.checked)}
                />

                <label className='form-check-label' htmlFor='defaultDataCheckbox'>
                  Default Data
                </label>
              </div>
            </div>
          </div>
          <div className='row mb-6'>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='userName' className='form-label fs-6 fw-bolder mb-3'>
                  Map User Name
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  aria-required='true'
                  id='userName'
                  ref={mapUserName}
                  placeholder='Ex: username'
                  maxLength={200}
                  disabled
                />
              </div>
            </div>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='userName' className='form-label fs-6 fw-bolder mb-3'>
                  Map UserID
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  aria-required='true'
                  id='userName'
                  ref={mapuserId}
                  placeholder='Ex: username'
                  maxLength={200}
                  disabled
                />
              </div>
            </div>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mt-10'>
                <button
                  type='button'
                  className='btn btn-primary btn-sm'
                  onClick={handleMapUserClick}
                >
                  Map User Details
                </button>
              </div>
              <MapUserPopup
                show={showPopup}
                selectedTool={toolTypeAction?.toolId}
                onClose={() => setShowPopup(false)}
                onImport={(item) => {
                  mapUserName.current.value = item.dataValue
                  mapuserId.current.value = item.dataId
                }}
              />
            </div>
          </div>
          <div className='row mb-2 mt-2'>
            <div className='col-lg-4 mb-2 mb-lg-0'>
              <label className='form-label fs-6 fw-bolder mb-3'>Employee ID</label>
              <input
                type='text'
                className='form-control form-control-lg form-control-solid'
                ref={empId}
                placeholder='Enter Employee ID'
              />
            </div>
            <div className='col-lg-4 mb-2 mb-lg-0'>
              <label className='form-label fs-6 fw-bolder mb-3'>Job Title</label>
              <input
                type='text'
                className='form-control form-control-lg form-control-solid'
                ref={jobTitle}
                placeholder='Enter Job Title'
              />
            </div>
            <div className='col-lg-4 mb-2 mb-lg-0'>
              <label className='form-label fs-6 fw-bolder mb-3'>Mobile Number</label>
              <input
                type='number'
                className='form-control form-control-lg form-control-solid'
                ref={mobileNumber}
                placeholder='Enter Mobile Number'
              />
            </div>
          </div>

          <div className='row mb-6'>
            <div className='col-lg-4 mb-lg-0'>
              <label className='form-label fs-6 fw-bolder mb-3'>Client</label>
              <select
                className='form-select form-select-solid'
                ref={clientIdRef}
                value={toolTypeAction.clientId}
                onChange={(e) => handleSelectChange(e, 'clientId')}
              >
                <option value=''>Select Client</option>
                {clientList?.map((client, index) => (
                  <option value={client.clientId} key={index} data-id={client.clientId}>
                    {client.clientName}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='form-check mt-10 d-flex'>
                <input
                  type='checkbox'
                  id='isInternalStaffCheckbox'
                  className='form-check-input'
                  checked={isInternalStaff}
                  onChange={(e) => setIsInternalStaff(e.target.checked)}
                />

                <label
                  htmlFor='isInternalStaffCheckbox'
                  className='form-check-label fs-6 fw-bolder'
                >
                  Is Internal Staff
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='card-footer d-flex justify-content-end pad-10'>
          <button
            type='submit'
            onClick={handleSubmit}
            className='btn btn-new btn-small'
            style={{display: loading || save ? 'none' : 'inline-block'}}
          >
            Update Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export {UpdateUserData}
