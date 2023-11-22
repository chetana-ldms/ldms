import React, {useState, useRef, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import { notify, notifyFail } from '../components/notification/Notification';
import axios from 'axios'
import { fetchRolesUpdateUrl } from '../../../../../api/ConfigurationApi'

const UpdateRoleData = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const {id} = useParams()
  const roleName = useRef()
  const errors = {}
  // const handleSubmit = (event) => {
  //   setLoading(true)
  //   event.preventDefault()
  //   const modifiedUserId = Number(sessionStorage.getItem('userId'));
  //   const modifieddate = new Date().toISOString();
  //   const orgId = Number(sessionStorage.getItem("orgId"));
  //   var data = {
  //     roleName: roleName.current.value,
  //     sysrole: 0,
  //     orgId,
  //     globalAdminRole: 0,
  //     clientAdminRole: 0,
  //     modifieddate,
  //     modifiedUserId,
  //     roleID: Number(id),
  //   }
  //   console.log('data', data)
  //   var config = {
  //     method: 'post',
  //     url: 'http://115.110.192.133:502/api/LDPSecurity/v1/User/Update',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'text/plain',
  //     },
  //     data: data,
  //   }
  //   setTimeout(() => {
  //     axios(config)
  //       .then(function (response) {
  //         console.log(JSON.stringify(response.data))
  //         navigate('/qradar/roles-data/list')
  //       })
  //       .catch(function (error) {
  //         console.log(error)
  //       })
  //     setLoading(false)
  //   }, 1000)
  // }
  const handleSubmit = async (event) => {
    setLoading(true)
    event.preventDefault()
    const modifiedUserId = Number(sessionStorage.getItem('userId'));
      const modifieddate = new Date().toISOString();
      const orgId = Number(sessionStorage.getItem("orgId"));
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
      const responseData = await fetchRolesUpdateUrl(data);
      const { isSuccess } = responseData;
  
      if (isSuccess) {
        notify('Role Updated');
        navigate('/qradar/roles-data/list')
      } else {
        notifyFail('Role Update Failed');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
   
  }


  return (
    <div className='card'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Update User Role</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/roles-data/list' className='btn btn-primary btn-small'>
              Back
            </Link>
          </div>
        </div>
      </div>
      <form>
        <div className='card-body border-top p-9'>
          <div className='row mb-6'>
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
                placeholder='Ex: Client Admin'
              />
            </div>
          </div>
          </div>
        </div>
        <div className='card-footer d-flex justify-content-end py-6 px-9'>
          <button
            type='submit'
            onClick={handleSubmit}
            className='btn btn-primary'
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
