import React, {useState, useRef, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import axios from 'axios'

const UpdateOrganizationTools = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [toolTypes, setToolTypes] = useState([])
  const [organizationList, setOrganizationList] = useState([])
  const {id} = useParams()
  const toolID = useRef()
  const orgID = useRef()
  const authKey = useRef()
  const apiUrl = useRef()
  const errors = {}
  const handleSubmit = (event) => {
    setLoading(true)
    if (!toolID.current.value) {
      errors.toolID = 'Enter Tool'
      setLoading(false)
      return errors
    }
    if (!orgID.current.value) {
      errors.orgID = 'Enter Organization'
      setLoading(false)
      return errors
    }
    if (!authKey.current.value) {
      errors.authKey = 'Enter Auth Key'
      setLoading(false)
      return errors
    }
    if (!apiUrl.current.value) {
      errors.apiUrl = 'Enter api url'
      setLoading(false)
      return errors
    }
    event.preventDefault()
    var data = JSON.stringify({
      toolID: toolID.current.value,
      orgID: orgID.current.value,
      authKey: authKey.current.value,
      orgToolID: id,
      lastReadPKID: 0,
      apiUrl: apiUrl.current.value,
      createdDate: '2022-12-29T14:31:55.732Z',
      createdUser: 'super_admin',
    })
    var config = {
      method: 'post',
      url: 'http://115.110.192.133:502/api/LDPlattform/v1/OrganizationTools/Update',
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
          navigate('/qradar/organization-tools/updated')
        })
        .catch(function (error) {
          console.log(error)
        })
      setLoading(false)
    }, 1000)
  }
  useEffect(() => {
    setLoading(true)
    var data = JSON.stringify({
      maserDataType: 'Tool_Types',
    })
    var config_2 = {
      method: 'post',
      url: 'http://115.110.192.133:502/api/LDPlattform/v1/MasterData',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    }
    axios(config_2)
      .then(function (response) {
        setToolTypes(response.data.masterData)
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error)
      })
    var config_3 = {
      method: 'GET',
      url: 'http://115.110.192.133:502/api/LDPlattform/v1/Organizations',
      headers: {
        Accept: 'text/plain',
      },
    }
    axios(config_3)
      .then(function (response) {
        setOrganizationList(response.data.organizationList)
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
          <span className='card-label fw-bold fs-3 mb-1'>Update Organization Tool</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/organization-tools/list' className='btn btn-primary btn-small'>
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
                  Enter Tool
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
                <label htmlFor='orgID' className='form-label fs-6 fw-bolder mb-3'>
                  Enter Organization
                </label>
                <select
                  className='form-select form-select-solid'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  id='orgID'
                  ref={orgID}
                  required
                >
                  <option value=''>Select Organization</option>
                  {organizationList.map((item, index) => (
                    <option value={item.orgID} key={index}>
                      {item.orgName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='col-lg-6 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='authKey' className='form-label fs-6 fw-bolder mb-3'>
                  Enter Authentication Key
                </label>
                <input
                  type='text'
                  required
                  className='form-control form-control-lg form-control-solid'
                  id='authKey'
                  ref={authKey}
                  placeholder='Ex: xxxxxxxxxxxxxxxxx'
                />
              </div>
            </div>
            <div className='col-lg-6 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='apiUrl' className='form-label fs-6 fw-bolder mb-3'>
                  Enter API URL
                </label>
                <input
                  type='text'
                  required
                  className='form-control form-control-lg form-control-solid'
                  id='apiUrl'
                  ref={apiUrl}
                  placeholder='Ex: https://10.100.0.102/api/siem/offences'
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

export {UpdateOrganizationTools}
