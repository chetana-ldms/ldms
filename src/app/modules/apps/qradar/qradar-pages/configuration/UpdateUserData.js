import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchRoles } from '../../../../../api/Api'
import { fetchUserDetails, fetchUserUpdateUrl } from '../../../../../api/ConfigurationApi'
import axios from 'axios'
import { notify, notifyFail } from '../components/notification/Notification';

const UpdateUserData = () => {
  const orgId = Number(sessionStorage.getItem('orgId'));
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [roleTypes, setRoleTypes] = useState([])
  console.log(roleTypes, "roleTypes111")
  const [toolTypeAction, setToolTypeAction] = useState({ toolTypeName: '', toolTypeID: '' });
  const { id } = useParams()
  const userName = useRef()
  console.log(userName, "userName")
  const passWord = useRef()
  const roleType = useRef()
  const errors = {}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserDetails(id, userName);
        setToolTypeAction({
          ...toolTypeAction,
          roleID: data.roleID
        });
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, [id, userName]);
  const handleSubmit = async (event) => {
    setLoading(true)
    if (!userName.current.value) {
      errors.userName = 'Enter username'
      setLoading(false)
      return errors
    }
    if (!passWord.current.value) {
      errors.passWord = 'Enter password'
      setLoading(false)
      return errors
    }
    if (!roleType.current.value) {
      errors.roleType = 'Select Role Type'
      setLoading(false)
      return errors
    }
    event.preventDefault()
    const modifiedUserId = Number(sessionStorage.getItem('userId'));
    const modifiedDate = new Date().toISOString();
    const orgId = sessionStorage.getItem('orgId')
    var data ={
      name: userName.current.value,
      roleID: roleType.current.value,
      password: passWord.current.value,
      createdByUserName: 'admin',
      modifiedDate,
      userID: id,
      orgId,
      modifiedUserId
    }
    try {
      const responseData = await fetchUserUpdateUrl(data);
      // const { isSuccess } = responseData;

      // if (isSuccess) {
      //   notify('Data Updated');
        navigate('/qradar/users-data/list')
      // } else {
      //   notifyFail('Failed to update data');
      // }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRoles(orgId);
        setRoleTypes(data);
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, []);

  return (
    <div className='card'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Update User</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/users-data/list' className='btn btn-primary btn-small'>
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
                  Enter User Name
                </label>
                <input
                  type='text'
                  required
                  className='form-control form-control-lg form-control-solid'
                  id='userName'
                  ref={userName}
                  placeholder='Ex: username'
                />
              </div>
            </div>
            <div className='col-lg-4 mb-4 mb-lg-0'>
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
            </div>
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
                  value={toolTypeAction.roleID}
                  onChange={(e) =>
                    setToolTypeAction({
                      // toolTypeName: e.target.value,
                      toolTypeID: e.target.options[e.target.selectedIndex].getAttribute('data-id'),
                    })}
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
              <span className='indicator-progress' style={{ display: 'block' }}>
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

export { UpdateUserData }
