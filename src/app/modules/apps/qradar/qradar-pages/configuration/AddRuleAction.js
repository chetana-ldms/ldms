import React, {useState, useRef, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import { notify, notifyFail } from '../components/notification/Notification';
import { fetchLDPToolsByToolType, fetchRuleActionUrl, fetchToolActions } from '../../../../../api/ConfigurationApi'
import { fetchMasterData } from '../../../../../api/Api';
import { useErrorBoundary } from "react-error-boundary";
 

const AddRuleAction = () => {
  const handleError = useErrorBoundary();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [toolTypeActions, setToolTypeActions] = useState([])
  console.log(toolTypeActions, "toolTypeActions")
  const [toolAcations, setToolAcations] = useState([])
  const [tools, setTools] = useState([])
  console.log(tools, "tools")
  const [toolTypes, setToolTypes] = useState([])

  const [ruleCatagories, setRuleCatagories] = useState([])
  const [rulesconditiontypes, setRulesconditiontypes] = useState([])
  const ruleActionName = useRef()
  const toolTypeID = useRef()
  const toolId = useRef()
  const toolActionID = useRef()
  const errors = {}
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchToolActions();
        setToolTypeActions(data);
      } catch (error) {
        handleError(error);
      }
    };

    fetchData();
  }, []);
  let handleChangeToolType = (event) =>{
    let selectedValue = event.target.value;
    const result = async () => {
      try {
        const data = {
          toolTypeId: Number(selectedValue)
        }
        const response = await fetchLDPToolsByToolType(data);
        const result = response.ldpToolsList
        setTools(result)
      } catch (error) {
        handleError(error);
      }
    };

    result();
    
  }
  useEffect(() => {
    fetchMasterData("Tool_Types")
      .then((typeData) => {
        setToolTypes(typeData);
      })
      .catch((error) => {
        handleError(error);
      });
  }, []);
  const handleSubmit = async (event) => {
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
    if (!toolId.current.value) {
      errors.toolId = 'Select Tool'
      setLoading(false)
      return errors
    }
    if (!toolActionID.current.value) {
      errors.toolActionID = 'Select Tool Action'
      setLoading(false)
      return errors
    }
    setLoading(true)
    event.preventDefault()
    const createduserId = Number(sessionStorage.getItem('userId'));
    const orgId = Number(sessionStorage.getItem('orgId'));
    const createddate = new Date().toISOString();
    var data = {
      ruleActionName: ruleActionName.current.value,
      toolTypeID: toolTypeID.current.value,
      toolID: toolId.current.value,
      toolActionID: toolActionID.current.value,
      ruleGenerelActionID: 0,
      orgId,
      createddate,
      createduserId
    }
  
    try {
      const responseData = await fetchRuleActionUrl(data);
      const { isSuccess } = responseData;
  
      if (isSuccess) {
        notify('Rule Action Saved');
        navigate('/qradar/rules-actions/list')
      } else {
        notifyFail('Failed to save Rule Action');
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='card'>
      {loading && <UsersListLoading />}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Add New Rule Action</span>
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
            <div className='col-lg-6 mb-5'>
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
                  onChange={handleChangeToolType}
                  required
                >
                  <option value=''>Select</option>
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
                  ref={toolId}
                  required
                >
                  <option value=''>Select</option>
                  {tools.map((item, index) => (
                    <option value={item.toolId} key={index}>
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
                  <option value=''>Select</option>
                  {toolTypeActions.map((item, index) => (
                    <option value={item.toolActionID} key={index}>
                      {item.toolTypeActionName}
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

export {AddRuleAction}
