import React, {useState, useRef, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {fetchRoles} from '../../../../../api/Api'
import axios from 'axios'
import { fetchUserAddUrl } from '../../../../../api/ConfigurationApi'
import { notify, notifyFail } from '../components/notification/Notification';
import { useErrorBoundary } from "react-error-boundary";

const AddUserData = () => {
  const handleError = useErrorBoundary();
  const orgId = Number(sessionStorage.getItem('orgId'));
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [roleTypes, setRoleTypes] = useState([])
  console.log(roleTypes, "roleTypes")
  const userName = useRef()
  // const passWord = useRef()
  const roleType = useRef()
  const errors = {}
  const handleSubmit = async(event) => {
    setLoading(true)

    if (!userName.current.value) {
      errors.userName = 'Enter username'
      setLoading(false)
      return errors
    }

    // if (!passWord.current.value) {
    //   errors.passWord = 'Enter password'
    //   setLoading(false)
    //   return errors
    // }

    if (!roleType.current.value) {
      errors.roleType = 'Select Role Type'
      setLoading(false)
      return errors
    }

    event.preventDefault()
    const createdUserId = Number(sessionStorage.getItem('userId'));
    const createdDete = new Date().toISOString();
    const orgId = sessionStorage.getItem('orgId')
    var data ={
      name: userName.current.value,
      roleID: roleType.current.value,
      // password: passWord.current.value,
      sysUser:0,
      orgId,
      createdUserId,
      createdDete
    }
    try {
      const responseData = await fetchUserAddUrl(data);
      const { isSuccess } = responseData;
  
      if (isSuccess) {
        notify('User Saved');
        navigate('/qradar/users-data/list')
      } else {
        notifyFail('Failed to save User');
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRoles(orgId);
        setRoleTypes(data);
      } catch (error) {
        handleError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='card'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Add New User</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/users-data/list' className='btn btn-primary btn-small'>
              Back
            </Link>
          </div>
        </div>
      </div>
      <form action='' method='post'>
        <div className='card-body border-top p-9'>
          <div className='row mb-6'>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='userName' className='form-label fs-6 fw-bolder mb-3'>
                  Enter User Name
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  required
                  aria-required='true'
                  id='userName'
                  ref={userName}
                  placeholder='Ex: username'
                />
              </div>
            </div>
            {/* <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='userName' className='form-label fs-6 fw-bolder mb-3'>
                  Enter Password
                </label>
                <input
                  type='password'
                  required
                  className='form-control form-control-lg form-control-solid'
                  id='password'
                  ref={passWord}
                  placeholder='Ex: ***********'
                />
              </div>
            </div> */}
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='toolType' className='form-label fs-6 fw-bolder mb-3'>
                  Select Role Type
                </label>
                <select
                  className='form-select form-select-solid'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  id='roleType'
                  ref={roleType}
                  required
                >
                  <option>Select Role Type</option>
                  {roleTypes.map((item, index) => (
                    <option value={item.roleID} key={index}>
                      {item.roleName}
                    </option>
                  ))}
                </select>
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
