import React, {useState, useRef, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import axios from 'axios'
import {UsersListLoading} from '../components/loading/UsersListLoading' 

const UpdateRule = () => {
  const navigate = useNavigate()
  const {id} = useParams()
  const [loading, setLoading] = useState(false)
  const [ruleCatagories, setRuleCatagories] = useState([])
  const [rulesconditiontypes, setRulesconditiontypes] = useState([])
  const [ruleData, setRuleData] = useState([])
  const ruleName = useRef()
  const ruleCatagoryID = useRef()
  const [formFields, setFormFields] = useState([
    {
      rulesConditionTypeID: '',
      ruleConditionValues: [{rulesConditionValue: ''}],
    },
  ])
  useEffect(() => {
    setLoading(true)
    var config = {
      method: 'get',
      url: `http://115.110.192.133:8011/api/RulesConfiguraton/v1/Rules/Rule?ruleID=${id}`,
      headers: {
        Accept: 'text/plain',
      },
    }
    axios(config)
      .then(function (response) {
        setRuleData(response.data.ruleData)
        setFormFields(response.data.ruleData.ruleConditions)
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error)
      })
    /////////////////////////////////////
    var config_2 = {
      method: 'get',
      url: 'http://115.110.192.133:8011/api/RulesConfiguraton/v1/RuleEngine/MasterData?MasterDataType=Rule_Catagories',
      headers: {
        Accept: 'text/plain',
      },
    }
    axios(config_2)
      .then(function (response) {
        setRuleCatagories(response.data.masterDataList)
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error)
      })
    /////////////////////////////////////
    var config_3 = {
      method: 'get',
      url: 'http://115.110.192.133:8011/api/RulesConfiguraton/v1/RuleEngine/MasterData?MasterDataType=Rules_Condition_Types',
      headers: {
        Accept: 'text/plain',
      },
    }
    axios(config_3)
      .then(function (response) {
        setRulesconditiontypes(response.data.masterDataList)
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [])
  // Dynamic Rules Starts
  const addRule = () => {
    let object = {
      rulesConditionTypeID: '',
      ruleConditionValues: [{rulesConditionValue: ''}],
    }
    setFormFields([...formFields, object])
  }
  const handleRule = (event, index) => {
    let data = [...formFields]
    data[index][event.target.name] = event.target.value
    setFormFields(data)
  }
  const removeRule = (index) => {
    let data = [...formFields]
    data.splice(index, 1)
    setFormFields(data)
  }
  const addAction = (index) => {
    let actionobject = {rulesConditionValue: ''}
    let data = [...formFields]
    let afterPush = data[index]['ruleConditionValues'].concat(actionobject)
    data[index]['ruleConditionValues'] = afterPush
    setFormFields(data)
  }
  const handleAction = (action_event, index, act_index) => {
    let data = [...formFields]
    data[index]['ruleConditionValues'][act_index][action_event.target.name] =
      action_event.target.value
    setFormFields(data)
  }
  const removeAction = (act_index, index) => {
    let data = [...formFields]
    let newdata = data[index]['ruleConditionValues']
    newdata.splice(act_index, 1)
    setFormFields(data)
  }
  // Dynamic Rules Ends
  const handleSubmit = (event) => {
    setLoading(true)
    event.preventDefault()
    // console.log('formFields', formFields)
    var data = JSON.stringify({
      ruleName: ruleName.current.value,
      ruleCatagoryID: ruleCatagoryID.current.value,
      ruleRunAttributeName: ruleName.current.value,
      ruleID: id,
      modifiedDate: '2023-01-03T13:49:58.115Z',
      modifieduser: 'Super_admin',
      ruleConditions: formFields,
    })

    // console.log('Data to be sent', data)
    var config = {
      method: 'post',
      url: 'http://115.110.192.133:8011/api/RulesConfiguraton/v1/Rules/Update',
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
          navigate('/qradar/rules-engine/updated')
        })
        .catch(function (error) {
          console.log(error)
        })
      setLoading(false)
    }, 1000)
    /// Get Rule Category IDs
  }

  return (
    <div className='card'>
      {loading && <UsersListLoading />}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Update Rule</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/rules-engine/list' className='btn btn-primary btn-small'>
              Back
            </Link>
          </div>
        </div>
      </div>
      <div className='card-body border-top p-9'>
        <div className='row mb-6'>
          <div className='col-lg-6 mb-4 mb-lg-0'>
            <div className='fv-row mb-0'>
              <label htmlFor='ruleName' className='form-label fs-6 fw-bolder mb-3'>
                Rule Name
              </label>
              <input
                type='text'
                className='form-control form-control-lg form-control-solid'
                placeholder='Ex: Detect IP'
                ref={ruleName}
                value={ruleData.ruleName}
              />
            </div>
          </div>
          <div className='col-lg-6 mb-4 mb-lg-0'>
            <div className='fv-row mb-0'>
              <label htmlFor='ruleCatagoryID' className='form-label fs-6 fw-bolder mb-3'>
                Rule Category
              </label>
              <select
                className='form-select form-select-solid'
                data-kt-select2='true'
                data-placeholder='Select option'
                data-allow-clear='true'
                required
                ref={ruleCatagoryID}
                value={ruleData.ruleCatagoryID}
              >
                <option>Select Rule Category</option>
                {ruleCatagories.map((item, index) => (
                  <option value={item.masterdataid} key={index}>
                    {item.masterdatavalue}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='col-lg-12 mb-4 mb-lg-0'>
            <div className='fv-row mb-0'>
              <label htmlFor='ruleCatagoryID' className='form-label fs-6 fw-bolder mb-3'>
                Rule Conditions
              </label>
              <form onSubmit={handleSubmit}>
                {formFields.map((form, index) => {
                  console.log('form', form)
                  return (
                    <div key={index}>
                      <div className='card-body border-top fv-row mb-0 bg-gray-400'>
                        <div className='row mb-6'>
                          <div className='col-lg-4 mb-4 mb-lg-0'>
                            <label
                              htmlFor='rulesConditionTypeID'
                              className='form-label fs-6 fw-bolder mb-3'
                            >
                              Select Rule Categgory Type
                            </label>
                            <select
                              name='rulesConditionTypeID'
                              className='form-select form-select-solid'
                              data-kt-select2='true'
                              data-placeholder='Select option'
                              data-allow-clear='true'
                              required
                              value={form.rulesConditionTypeID}
                              onChange={(event) => handleRule(event, index)}
                            >
                              <option>Select Rule Category</option>
                              {rulesconditiontypes.map((item, rcindex) => (
                                <option
                                  name='rulesConditionCategory'
                                  value={item.masterdataid}
                                  key={rcindex}
                                >
                                  {item.masterdatavalue}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className='col-lg-4 mb-4 mb-lg-0'>
                            <label
                              htmlFor='ruleCatagoryID'
                              className='form-label fs-6 fw-bolder mb-3'
                            >
                              Condition Text
                            </label>
                            {form.ruleConditionValues.map((act, act_index) => {
                              return (
                                <div key={act_index} className='input-group mb-3'>
                                  <input
                                    name='rulesConditionValue'
                                    type='text'
                                    className='form-control form-control-lg form-control-solid'
                                    id='rulesConditionValue'
                                    placeholder={`Suspicious IP`}
                                    value={act.rulesConditionValue}
                                    onChange={(action_event) =>
                                      handleAction(action_event, index, act_index)
                                    }
                                  />
                                  <span
                                    onClick={() => removeAction(act_index, index)}
                                    className='btn btn-danger'
                                  >
                                    Delete
                                  </span>
                                </div>
                              )
                            })}
                            <span
                              className='form-control btn btn-warning btn-small text-dark'
                              onClick={() => addAction(index)}
                            >
                              Add Field
                            </span>
                          </div>
                          <div className='col-lg-4 mb-4 mb-lg-0'>
                            <label
                              htmlFor='ruleCatagoryID'
                              className='form-label fs-6 fw-bolder mb-3'
                            >
                              Action
                            </label>
                            <span
                              className='form-control btn btn-danger pull-right'
                              onClick={() => removeRule(index)}
                            >
                              Remove
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </form>
              <span className='mt-6 btn btn-primary btn-small' onClick={addRule}>
                Add More Conditions
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='card-footer d-flex justify-content-end py-6 px-9'>
        <button type='submit' onClick={handleSubmit} className='btn btn-primary' disabled={loading}>
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

export {UpdateRule}
