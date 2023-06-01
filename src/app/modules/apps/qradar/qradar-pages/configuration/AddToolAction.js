import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { notify, notifyFail } from '../components/notification/Notification';
import axios from 'axios'
import { UsersListLoading } from '../components/loading/UsersListLoading'

const AddToolAction = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [toolTypes, setToolTypes] = useState([])
  const [toolActionTypes, setToolActionTypes] = useState([])
  const toolID = useRef()
  const toolTypeActionID = useRef()
  const errors = {}

  useEffect(() => {
    setLoading(true)
    var config = {
      method: 'get',
      url: 'http://115.110.192.133:502/api/LDPlattform/v1/ToolTypeActions',
      headers: {
        Accept: 'text/plain',
      },
    }

    axios(config)
      .then(function (response) {
        setToolActionTypes(response.data.toolTypeActionsList)
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error)
      })
    //////////////////
    var data_4 = JSON.stringify({
      maserDataType: 'Tool_Types',
    })
    var config_4 = {
      method: 'post',
      url: 'http://115.110.192.133:502/api/LDPlattform/v1/MasterData',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data_4,
    }
    axios(config_4)
      .then(function (response) {
        setToolTypes(response.data.masterData)
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [])
  const handleSubmit = (event) => {
    if (!toolID.current.value) {
      errors.toolID = 'Enter Tool Type'
      setLoading(false)
      return errors
    }
    if (!toolTypeActionID.current.value) {
      errors.toolTypeActionID = 'Enter Tool Action Type'
      setLoading(false)
      return errors
    }
    setLoading(true)
    event.preventDefault()
    const createdUserId = Number(sessionStorage.getItem('userId'));
    const createdDate = new Date().toISOString();
    var data = JSON.stringify({
      toolID: toolID.current.value,
      toolTypeActionID: toolTypeActionID.current.value,
      createdDate,
      createdUserId
    })
    var config = {
      method: 'post',
      url: 'http://115.110.192.133:502/api/LDPlattform/v1/ToolAction/Add',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      },
      data: data,
    }
    setTimeout(() => {
      axios(config)
        .then(function (response) {
          const { isSuccess } = response.data;

          if (isSuccess) {
            notify('Data Saved');
            navigate('/qradar/tool-actions/updated');
          } else {
            notifyFail('Failed to save data');
          }
          // console.log(JSON.stringify(response.data))
          // navigate('/qradar/tool-actions/updated')
        })
        .catch(function (error) {
          console.log(error)
        })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className='card'>
      {loading && <UsersListLoading />}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Add New Tool Action</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/tool-actions/list' className='btn btn-primary btn-small'>
              Back
            </Link>
          </div>
        </div>
      </div>
      <form>
        <div className='card-body border-top p-9'>
          <div className='row mb-6'>
            <div className='col-lg-6 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='toolID' className='form-label fs-6 fw-bolder mb-3'>
                  Select Tool Type
                </label>
                <select
                  className='form-select form-select-solid'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  id='toolID'
                  ref={toolID}
                  required
                >
                  <option value=''>Select Tool Type</option>
                  {toolTypes.map((item, index) => (
                    <option value={item.dataID} key={index}>
                      {item.dataValue}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='col-lg-6 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='toolTypeActionID' className='form-label fs-6 fw-bolder mb-3'>
                  Select Tool Action Type
                </label>
                <select
                  className='form-select form-select-solid'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  id='toolTypeActionID'
                  ref={toolTypeActionID}
                  required
                >
                  <option value=''>Select Tool Action Type</option>
                  {toolActionTypes.map((item, index) => (
                    <option value={item.toolTypeActionID} key={index}>
                      {item.toolAction}
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

export { AddToolAction }
