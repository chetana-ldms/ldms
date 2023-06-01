import React, {useState, useRef, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import axios from 'axios'
import {UsersListLoading} from '../components/loading/UsersListLoading'

const UpdateRuleAction = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [toolTypeActions, setToolTypeActions] = useState([])
  const [toolAcations, setToolAcations] = useState([])
  const [tools, setTools] = useState([])
  const [toolTypes, setToolTypes] = useState([])

  // const [ruleCatagories, setRuleCatagories] = useState([])
  // const [rulesconditiontypes, setRulesconditiontypes] = useState([])
  const ruleActionName = useRef()
  const toolTypeID = useRef()
  const toolID = useRef()
  const toolActionID = useRef()
  const errors = {}

  useEffect(() => {
    setLoading(true)


    var config = {
      method: 'get',
      url: 'http://115.110.192.133:502/api/LDPlattform/v1/ToolActions',
      headers: {
        Accept: 'text/plain',
      },
    }
    axios(config)
      .then(function (response) {
        setToolAcations(response.data.toolAcationsList)
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error)
      })
    //////////////////////////////////////////////
    var config_2 = {
      method: 'get',
      url: 'http://115.110.192.133:502/api/LDPlattform/v1/ToolTypeActions',
      headers: {
        Accept: 'text/plain',
      },
    }
    axios(config_2)
      .then(function (response) {
        setToolTypeActions(response.data.toolTypeActionsList)
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error)
      })
    /////////////////////////////////////
    var config_3 = {
      method: 'get',
      url: 'http://115.110.192.133:502/api/LDPlattform/v1/LDPTools',
      headers: {
        Accept: 'text/plain',
      },
    }
    axios(config_3)
      .then(function (response) {
        setTools(response.data.ldpToolsList)
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
    setLoading(true)
    if (!ruleActionName.current.value) {
      errors.ruleActionName = 'Enter Rule Action Name'
      setLoading(false)
      return errors
    }
    if (!toolTypeID.current.value) {
      errors.toolTypeID = 'Select Tool Type'
      setLoading(false)
      return errors
    }
    if (!toolID.current.value) {
      errors.toolID = 'Select Tool'
      setLoading(false)
      return errors
    }
    if (!toolActionID.current.value) {
      errors.toolActionID = 'Select Tool Action'
      setLoading(false)
      return errors
    }
    event.preventDefault()
    var data = JSON.stringify({
      ruleActionName: ruleActionName.current.value,
      toolTypeID: toolTypeID.current.value,
      toolID: toolID.current.value,
      toolActionID: toolActionID.current.value,
      ruleGenerelActionID: 0,
      ruleActionID: id,
      modifieddate: '2023-01-10T15:14:46.337Z',
      modifieduser: 'super_admin',
    })
    var config = {
      method: 'post',
      url: 'http://115.110.192.133:8011/api/RuleAction/v1/RuleAction/Update',
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
          navigate('/qradar/rules-actions/updated')
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
          <span className='card-label fw-bold fs-3 mb-1'>Update Rule Action</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/rules-actions/list' className='btn btn-primary btn-small'>
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
                <label htmlFor='ruleName' className='form-label fs-6 fw-bolder mb-3'>
                  Rule Action Name
                </label>
                <input
                  type='text'
                  required
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Ex: FreshDesk_CreateTicket'
                  ref={ruleActionName}
                />
              </div>
            </div>
            <div className='col-lg-6 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='toolTypeID' className='form-label fs-6 fw-bolder mb-3'>
                  Select Tool Type
                </label>
                <select
                  className='form-select form-select-solid'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  id='toolTypeID'
                  ref={toolTypeID}
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
                <label htmlFor='toolID' className='form-label fs-6 fw-bolder mb-3'>
                  Select Tool
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
                  <option value=''>Select Tool</option>
                  {tools.map((item, index) => (
                    <option value={item.toolTypeID} key={index}>
                      {item.toolName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='col-lg-6 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='toolActionID' className='form-label fs-6 fw-bolder mb-3'>
                  Select Tool Action
                </label>
                <select
                  className='form-select form-select-solid'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  id='toolActionID'
                  ref={toolActionID}
                  required
                >
                  <option value=''>Select Tool Action</option>
                  {toolTypeActions.map((item, index) => (
                    <option value={item.toolTypeID} key={index}>
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

export {UpdateRuleAction}
