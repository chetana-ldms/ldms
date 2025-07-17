import React, {useState, useRef, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import {notify, notifyFail} from '../components/notification/Notification'
import {fetchRolesAddUrl, fetchRolesUrl} from '../../../../../api/ConfigurationApi'
import {ToastContainer} from 'react-toastify'
import {fetchOrganizations} from '../../../../../api/Api'

const AddRoleData = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [organizations, setOrganizations] = useState([])
  const [roles, setRoles] = useState([])
  const [parentRoleId, setParentRoleId] = useState('')
  const [selectedOrganization, setSelectedOrganization] = useState(
    Number(sessionStorage.getItem('orgId')) || ''
  )
  const createdUserId = Number(sessionStorage.getItem('userId'))
  const userName = useRef()
  const roleName = useRef()
  const handleSubmit = async (event) => {
    setLoading(true)
    event.preventDefault()
    if (!roleName.current.value) {
      notifyFail('Enter role Name')
      setLoading(false)
      return
    }
    if (!selectedOrganization) {
      notifyFail('Select Organization')
      setLoading(false)
      return
    }
     if (!parentRoleId) {
      notifyFail('Select Parent Role')
      setLoading(false)
      return
    }
    const createdUserId = Number(sessionStorage.getItem('userId'))
    const createdDate = new Date().toISOString()
    var data = {
      roleName: roleName.current.value,
      sysrole: 0,
      orgId: selectedOrganization,
      parentRoleId: parentRoleId || null,
      globalAdminRole: 0,
      clientAdminRole: 0,
      createdDate,
      createdUserId,
    }
    console.log('data', data)
    try {
      const responseData = await fetchRolesAddUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        setTimeout(() => {
          navigate('/qradar/roles-data/list')
        }, 2000)
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const getOrganizations = async () => {
      try {
        const orgs = await fetchOrganizations()
        setOrganizations(orgs)
      } catch (error) {
        console.log(error)
      }
    }
    getOrganizations()
  }, [])
  const reload = async () => {
    try {
      setLoading(true)
      const data = await fetchRolesUrl(selectedOrganization, createdUserId)
      setRoles(data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [selectedOrganization, createdUserId])

  return (
    <div className='config card'>
      <ToastContainer />
      <div className='card-header bg-heading'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='white'>Add User Role </span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/roles-data/list' className='white fs-15 text-underline'>
              <i className='fa fa-chevron-left white mg-right-5' />
              Back
            </Link>
          </div>
        </div>
      </div>
      <div className='card-body pad-10'>
        <div className='row mb-6 table-filter'>
          <div className='col-lg-4 mb-4 mb-lg-0'>
            <div className='fv-row mb-0'>
              <label className='form-label fs-6 fw-bolder mb-3'>Select Organization</label>
              <select
                className='form-select form-select-lg form-select-solid'
                value={selectedOrganization}
                onChange={(e) => setSelectedOrganization(Number(e.target.value))}
              >
                {Number(sessionStorage.getItem('globalAdminRole')) === 1 && organizations.length > 0
                  ? organizations.map((org) => (
                      <option key={org.orgID} value={org.orgID}>
                        {org.orgName}
                      </option>
                    ))
                  : organizations
                      .filter((org) => org.orgID === Number(sessionStorage.getItem('orgId')))
                      .map((org) => (
                        <option key={org.orgID} value={org.orgID}>
                          {org.orgName}
                        </option>
                      ))}
              </select>
            </div>
          </div>
          <div className='col-lg-4 mb-4 mb-lg-0'>
            <div className='fv-row mb-0'>
              <label htmlFor='userName' className='form-label fs-6 fw-bolder mb-3'>
                Enter Role
              </label>
              <input
                type='text'
                className='form-control form-control-lg form-control-solid'
                id='role'
                ref={roleName}
                maxLength={200}
                placeholder='Ex: Client Admin'
              />
            </div>
          </div>
          <div className='col-lg-4 mb-4 mb-lg-0'>
            <div className='fv-row mb-0'>
              <label className='form-label fs-6 fw-bolder mb-3'>Parent Role</label>
              <select
                className='form-select form-select-lg form-select-solid'
                value={parentRoleId}
                onChange={(e) => setParentRoleId(Number(e.target.value))}
              >
                <option value=''>Select Parent Role</option>
                {roles.length > 0 &&
                  roles.map((role) => (
                    <option key={role.roleID} value={role.roleID}>
                      {role.roleName}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className='card-footer d-flex justify-content-end pad-10'>
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
    </div>
  )
}

export {AddRoleData}
