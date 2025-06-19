import React, {useState, useRef, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {fetchMasterData, fetchOrganizations, fetchRoles} from '../../../../../api/Api'
import axios from 'axios'
import {
  fetchLDPToolsUrl,
  fetchRolesUrl,
  fetchToolMasterDataUrl,
  fetchUserAddUrl,
} from '../../../../../api/ConfigurationApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {useErrorBoundary} from 'react-error-boundary'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {ToastContainer} from 'react-toastify'
import MapUserPopup from './MapUserPopup'

const AddUserData = () => {
  const handleError = useErrorBoundary()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const roleID = Number(sessionStorage.getItem('roleID'))
  const userID = Number(sessionStorage.getItem('userId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [roleTypes, setRoleTypes] = useState([])
  const [organizationList, setOrganizationList] = useState([])
  const [tools, setTools] = useState([])
  const [toolMasterData, setToolMasterData] = useState([])
  console.log(toolMasterData, 'toolMasterData')
  const [selectedTool, setSelectedTool] = useState('')
  const userName = useRef()
  const userEmail = useRef()
  const orgID = useRef()
  const roleType = useRef()
  const mapUserName = useRef()
  const mapuserId = useRef()
  const errors = {}
  const [showPopup, setShowPopup] = useState(false)
  const [isDefaultData, setIsDefaultData] = useState(false)
  const checkboxRef = useRef(null)

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
  const handleToolChange = (e) => {
    setSelectedTool(e.target.value)
  }
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

  useEffect(() => {
    const fetchData = async () => {
      var data = {
        orgId: orgId,
        toolId: selectedTool,
        masterDataType: 'user',
      }
      try {
        const toolMasterData = await fetchToolMasterDataUrl(data)
        setToolMasterData(toolMasterData)
      } catch (error) {
        handleError(error)
      }
    }

    fetchData()
  }, [])
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    if (!userName.current.value) {
      notifyFail('Enter username')
      setLoading(false)
      return
    }
    if (!userEmail.current.value) {
      notifyFail('Enter Email')
      setLoading(false)
      return
    }
    const emailValue = userEmail.current.value
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(emailValue)) {
      notifyFail('Enter a valid Email')
      setLoading(false)
      return
    }
    if (!orgID.current.value) {
      notifyFail('Enter Organization')
      setLoading(false)
      return
    }

    if (!roleType.current.value) {
      notifyFail('Select Role Type')
      setLoading(false)
      return
    }
    const createdUserId = Number(sessionStorage.getItem('userId'))
    const createdDate = new Date().toISOString()
    // const orgId = sessionStorage.getItem('orgId')
    var data = {
      name: userName.current.value,
      emailId: userEmail.current.value,
      roleID: Number(roleType.current.value),
      orgId: Number(orgID.current.value),
      mapUserName: mapUserName.current.value,
      mapUserId: mapuserId.current.value,
      toolId: selectedTool ? Number(selectedTool) : 0,
      sysUser: 0,
      createdUserId,
      createdDate,
      defaultUser:isDefaultData,
    }
    try {
      const responseData = await fetchUserAddUrl(data)
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
    } finally {
      setLoading(false)
    }
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
    if (!selectedTool) {
      notifyFail('Select the tool first')
      return
    }
    setShowPopup(true)
  }
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.style.setProperty('width', '70px', 'important')
    }
  }, [])

  return (
    <div className='config card'>
      <ToastContainer />
      {loading && <UsersListLoading />}
      <div className='card-header bg-heading mb-5'>
        <h3 className='card-title'>
          <span className='card-label white'>Add New User</span>
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
      <form className='table-filter' action='' method='post'>
        <div className='card-body pad-10'>
          <div className='row mb-6'>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='userName' className='form-label fs-6 fw-bolder mb-3'>
                  User Name
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  id='userName'
                  ref={userName}
                  placeholder='Ex: username'
                  maxLength={200}
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
                  className='form-select form-select-solid'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  id='orgID'
                  ref={orgID}
                >
                  <option value=''>Select</option>
                  {roleID === 1 &&
                    organizationList?.length > 0 &&
                    organizationList.map((item, index) => (
                      <option key={index} value={item.orgID}>
                        {item.orgName}
                      </option>
                    ))}

                  {roleID !== 1 &&
                    organizationList?.length > 0 &&
                    organizationList
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
          <div className='row mb-6'>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='roleType' className='form-label fs-6 fw-bolder mb-3'>
                  Select Role Type
                </label>
                <select
                  className='form-select form-select-solid'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  id='roleType'
                  ref={roleType}
                >
                  <option value=''>Select Role Type</option>
                  {roleTypes.map((item, index) => (
                    <option value={item.roleID} key={index}>
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
                <select className='form-control' value={selectedTool} onChange={handleToolChange}>
                  <option value=''>Select Tool Name</option>
                  {tools.map((tool, idx) => (
                    <option key={idx} value={tool.toolId}>
                      {tool.toolName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='form-check mt-10 d-flex'>
                <input
                  type='checkbox'
                  ref={checkboxRef}
                  id='defaultDataCheckbox'
                  checked={isDefaultData}
                  onChange={(e) => setIsDefaultData(e.target.checked)}
                />

                <label className='form-label fs-6 fw-bolder mt-2' htmlFor='defaultDataCheckbox'>
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
                  id='userName'
                  ref={mapUserName}
                  placeholder='Ex: username'
                  maxLength={200}
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
                  id='mapUserName'
                  ref={mapuserId}
                  placeholder='Ex: username'
                  maxLength={200}
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
                selectedTool={selectedTool}
                onClose={() => setShowPopup(false)}
                onImport={(item) => {
                  mapUserName.current.value = item.dataValue
                  mapuserId.current.value = item.dataId
                }}
              />
            </div>
          </div>
        </div>

        <div className='card-footer text-right pad-10'>
          <button
            type='submit'
            onClick={handleSubmit}
            className='btn btn-new btn-small'
            disabled={loading}
          >
            {!loading && 'Save Changes'}
            {loading && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export {AddUserData}
