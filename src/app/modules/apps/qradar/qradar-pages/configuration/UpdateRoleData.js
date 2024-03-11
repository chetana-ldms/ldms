import React, {useState, useRef, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {notify, notifyFail} from '../components/notification/Notification'
import axios from 'axios'
import {fetchRolesDetailUrl, fetchRolesUpdateUrl} from '../../../../../api/ConfigurationApi'

const UpdateRoleData = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState([
    {
      roleName: '',
    },
  ])
  const {id} = useParams()
  const roleName = useRef()
  const errors = {}
  useEffect(() => {
    const fetchData = async () => {
      try {
        const Response = await fetchRolesDetailUrl(id)
        setRole(Response)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [id])
  const handleChange = (e) => {
    setRole({
      ...role,
      roleName: e.target.value,
    })
  }
  const handleSubmit = async (event) => {
    setLoading(true)
    event.preventDefault()
    const modifiedUserId = Number(sessionStorage.getItem('userId'))
    const modifieddate = new Date().toISOString()
    const orgId = Number(sessionStorage.getItem('orgId'))
    var data = {
      roleName: roleName.current.value,
      sysrole: 0,
      orgId,
      globalAdminRole: 0,
      clientAdminRole: 0,
      modifieddate,
      modifiedUserId,
      roleID: Number(id),
    }
    console.log('data', data)
    try {
      const responseData = await fetchRolesUpdateUrl(data)
      const {isSuccess} = responseData

      if (isSuccess) {
        notify('Role Updated')
        navigate('/qradar/roles-data/list')
      } else {
        notifyFail('Role Update Failed')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='card'>
      <div className='card-header bg-header'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='white uppercase'>Update User Role</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/roles-data/list' className='white fs-15'>
              <i className='fa fa-chevron-left white mg-right-5' />
              Back
            </Link>
          </div>
        </div>
      </div>
      <form>
        <div className='card-body pad-10'>
          <div className='row mb-6 table-filter'>
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
                  value={role?.roleName || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='card-footer d-flex justify-content-end py-6 px-9'>
          <button
            type='submit'
            onClick={handleSubmit}
            className='btn btn-new btn-small'
            disabled={loading}
          >
            {!loading && 'Update Changes'}
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

export {UpdateRoleData}
