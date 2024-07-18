import React, {useEffect, useRef, useState} from 'react'
import {useErrorBoundary} from 'react-error-boundary'
import {ToastContainer} from 'react-toastify'
import {notify, notifyFail} from '../components/notification/Notification'
import {
  fetchFeaturesUrl,
  fetchOrganizationRolesUrl,
  fetchOrganizationToolsSecurityUrl,
} from '../../../../../api/securityApi'
import {fetchOrganizations} from '../../../../../api/Api'
import FeatureAccess from './FeatureAccess'

function RoleBasedAccess() {
  const handleError = useErrorBoundary()
  const [loading, setLoading] = useState(false)
  const [featureAccess, setFeatureAccess] = useState([])
  const orgName = useRef()
  const toolRef = useRef()
  const roleRef = useRef()
  const parentFeaturesRef = useRef()
  const [organizations, setOrganizations] = useState([])
  const globalAdminRole = Number(sessionStorage.getItem('globalAdminRole'))
  const clientAdminRole = Number(sessionStorage.getItem('clientAdminRole'))
  const [tools, setTools] = useState([])
  const [roles, setRoles] = useState([])
  const [parentFeatures, setParentFeatures] = useState([])
  const [selectedTool, setSelectedTool] = useState(null)
  const userID = Number(sessionStorage.getItem('userId'))
  const orgIdFromSession = Number(sessionStorage.getItem('orgId'))
  const [selectedOrganization, setSelectedOrganization] = useState(orgIdFromSession)
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))

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
        handleError(error)
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      reload()
    }, 300)
    return () => clearTimeout(timer)
  }, [selectedOrganization])

  useEffect(() => {
    const fetchDataFeatures = async () => {
      
        try {
          const data = {
            orgId: selectedOrganization,
            toolId: selectedTool || 0,
            featureId: 0,
            parentFeatures: true,
          }
          const featureResponse = await fetchFeaturesUrl(data)
          setParentFeatures(featureResponse)
        } catch (error) {
          handleError(error)
        }
    }
    fetchDataFeatures()
  }, [selectedTool])

  const handleOrganizationChange = (e) => {
    const newOrganizationId = Number(e.target.value)
    setSelectedOrganization(newOrganizationId)
  }

  const handleToolChange = (e) => {
    const newToolId = Number(e.target.value)
    setSelectedTool(newToolId)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)
    if (!selectedOrganization) {
      notifyFail('Select organization')
      setLoading(false)
      return
    }
    const data = {
      orgId: selectedOrganization,
      toolId: toolRef.current.value || 0,
      featureId: parentFeaturesRef.current.value || 0,
      parentFeatures: false,
    }

    try {
      const response = await fetchFeaturesUrl(data)
      setFeatureAccess(response)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='config card'>
      <ToastContainer />
      <div className='card-header bg-heading'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='white'>Role Based Access</span>
        </h3>
      </div>
      <form>
        <div className='card-body pad-10'>
          <div className='row mb-6 table-filter'>
            <div className='col-lg-3'>
              <label htmlFor='mobileNo' className='form-label fs-6 fw-bolder'>
                Organization
              </label>
              <select
                className='form-select form-select-solid bg-blue-light'
                data-kt-select2='true'
                data-placeholder='Select option'
                data-allow-clear='true'
                value={selectedOrganization}
                onChange={handleOrganizationChange}
              >
                {globalAdminRole === 1 &&
                  organizations?.length > 0 &&
                  organizations.map((item, index) => (
                    <option key={index} value={item.orgID}>
                      {item.orgName}
                    </option>
                  ))}

                {globalAdminRole !== 1 &&
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
            <div className='col-lg-3'>
              <label htmlFor='mobileNo' className='form-label fs-6 fw-bolder'>
                Tools
              </label>
              <select
                className='form-select form-select-solid bg-blue-light'
                data-kt-select2='true'
                data-placeholder='Select option'
                data-allow-clear='true'
                ref={toolRef}
                onChange={handleToolChange}
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
            <div className='col-lg-3'>
              <label htmlFor='mobileNo' className='form-label fs-6 fw-bolder'>
                Parent Features
              </label>
              <select
                className='form-select form-select-solid bg-blue-light'
                data-kt-select2='true'
                data-placeholder='Select option'
                data-allow-clear='true'
                ref={parentFeaturesRef}
              >
                <option value=''>Select</option>
                {parentFeatures !== null &&
                  parentFeatures?.map((item, index) => (
                    <option key={index} value={item.featureId}>
                      {item.featureName}
                    </option>
                  ))}
              </select>
            </div>
            <div className='col-lg-1'>
              <button type='submit' onClick={handleSubmit} className='btn btn-new btn-small'>
                Search
              </button>
            </div>
          </div>
        </div>
      </form>
      {featureAccess.length > 0 && (
        <FeatureAccess
          featureAccess={featureAccess}
          orgId={selectedOrganization}
          toolId={toolRef.current.value}
        />
      )}
    </div>
  )
}

export default RoleBasedAccess
