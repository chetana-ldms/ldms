import React, {useState, useRef, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import axios from 'axios'

const UpdateRoleData = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [roleTypes, setRoleTypes] = useState([])
  const {id} = useParams()
  const userName = useRef()
  const passWord = useRef()
  const roleType = useRef()
  const errors = {}
  const handleSubmit = (event) => {
    setLoading(true)
    if (!userName.current.value) {
      errors.userName = 'Enter username'
      setLoading(false)
      return errors
    }
    if (!roleType.current.value) {
      errors.roleType = 'Enter Role Type'
      setLoading(false)
      return errors
    }
    if (!passWord.current.value) {
      errors.passWord = 'Enter password'
      setLoading(false)
      return errors
    }
    event.preventDefault()
    var data = JSON.stringify({
      name: userName.current.value,
      roleID: roleType.current.value,
      password: passWord.current.value,
      createdByUserName: 'admin',
      createdDete: '2023-01-05T16:12:17.058Z',
      userID: id,
    })
    console.log('data', data)
    var config = {
      method: 'post',
      url: 'http://115.110.192.133:502/api/LDPSecurity/v1/User/Update',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      },
      data: data,
    }
    setTimeout(() => {
      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data))
          navigate('/qradar/users-data/list')
        })
        .catch(function (error) {
          console.log(error)
        })
      setLoading(false)
    }, 1000)
  }

  useEffect(() => {
    setLoading(true)
    var config = {
      method: 'post',
      url: 'http://115.110.192.133:502/api/LDPSecurity/v1/Roles',
      headers: {
        Accept: 'text/plain',
      },
    }
    axios(config)
      .then(function (response) {
        setRoleTypes(response.data.rolesList)
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [])

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
                  required
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
