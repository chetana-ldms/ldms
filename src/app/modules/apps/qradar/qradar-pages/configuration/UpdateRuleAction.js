import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { notify, notifyFail } from '../components/notification/Notification';
import { fetchLDPToolsByToolType, fetchRuleActionDetails, fetchToolActions } from '../../../../../api/ConfigurationApi'
import { fetchLDPTools } from '../../../../../api/Api'

const UpdateRuleAction = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [toolTypeActions, setToolTypeActions] = useState([])
  const [toolAcations, setToolAcations] = useState([])
  const [tools, setTools] = useState([])
  const [toolTypes, setToolTypes] = useState([])
  const [toolTypeAction, setToolTypeAction] = useState(
    {
      ruleActionName:'',
      toolTypeName: '',
      toolTypeID: '',
      toolName: '',
      toolID: '',
      toolActionName: '',
      toolActionID: ''
    }
  );

  // const [ruleCatagories, setRuleCatagories] = useState([])
  // const [rulesconditiontypes, setRulesconditiontypes] = useState([])
  const ruleActionName = useRef()
  const toolTypeID = useRef()
  const toolId = useRef()
  const toolActionID = useRef()
  const errors = {}
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRuleActionDetails(id);
        setToolTypeAction({
          ...toolTypeAction,
          ruleActionName:data.ruleActionName,
          toolTypeName: data.toolTypeName,
          toolTypeID: data.toolTypeID,
          toolName: data.toolName,
          toolID: data.toolID,
          toolActionName: data.toolActionName,
          toolActionID: data.toolActionID
        })
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLDPTools();
        setTools(data);
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchToolActions();
        setToolTypeActions(data);
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, []);
  const handleChange = (event, field) => {
    const selectedValue = event.target.value;
  
    if (field === "ruleActionName") {
      setToolTypeAction((prevState) => ({
        ...prevState,
        [field]: selectedValue,
      }));
    }
  
    if (field === "toolName" || field === "toolActionName") {
      const selectedId = event.target.options[event.target.selectedIndex].getAttribute('data-id');
      setToolTypeAction((prevState) => ({
        ...prevState,
        [field === "toolName" ? "toolID" : "toolActionID"]: selectedId,
        [field]: selectedValue,
      }));
    }
  
    if (field === "toolTypeName") {
      const selectedId = event.target.options[event.target.selectedIndex].getAttribute('data-id');
      const fetchData = async () => {
        try {
          const data = {
            toolTypeId: Number(selectedId)
          }
          const response = await fetchLDPToolsByToolType(data);
          const result = response.ldpToolsList
          setTools(result)
        } catch (error) {
          console.log(error);
        }
      };
  
      fetchData();
      setToolTypeAction((prevState) => ({
        ...prevState,
        dataID: selectedId,
        toolTypeName: selectedValue,
      }));
    }
  };
  useEffect(() => {
    setLoading(true)


    var config = {
      method: 'get',
      url: 'http://182.71.241.246:502/api/LDPlattform/v1/ToolActions',
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
    // var config_2 = {
    //   method: 'get',
    //   url: 'http://182.71.241.246:502/api/LDPlattform/v1/ToolTypeActions',
    //   headers: {
    //     Accept: 'text/plain',
    //   },
    // }
    // axios(config_2)
    //   .then(function (response) {
    //     setToolTypeActions(response.data.toolTypeActionsList)
    //     setLoading(false)
    //   })
    //   .catch(function (error) {
    //     console.log(error)
    //   })
    /////////////////////////////////////
    // var config_3 = {
    //   method: 'get',
    //   url: 'http://182.71.241.246:502/api/LDPlattform/v1/LDPTools',
    //   headers: {
    //     Accept: 'text/plain',
    //   },
    // }
    // axios(config_3)
    //   .then(function (response) {
    //     setTools(response.data.ldpToolsList)
    //     setLoading(false)
    //   })
    //   .catch(function (error) {
    //     console.log(error)
    //   })
    //////////////////
    var data_4 = JSON.stringify({
      maserDataType: 'Tool_Types',
    })
    var config_4 = {
      method: 'post',
      url: 'http://182.71.241.246:502/api/LDPlattform/v1/MasterData',
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
    event.preventDefault()
    const modifieduserid = Number(sessionStorage.getItem('userId'));
    const orgId = Number(sessionStorage.getItem('orgId'));
    const modifieddate = new Date().toISOString();
    var data = JSON.stringify({
      // ruleActionName: ruleActionName.current.value,
      // toolTypeID: toolTypeID.current.value,
      // toolID: toolId.current.value,
      // toolActionID: toolActionID.current.value,
      // ruleGenerelActionID: 0,
      // ruleActionID: id,
      // orgId,
      // modifieddate,
      // modifieduserid,
      ruleActionName: toolTypeAction.ruleActionName,
      toolTypeID: toolTypeAction.toolTypeID,
      toolID: toolTypeAction.toolID,
      toolActionID: toolTypeAction.toolActionID,
      ruleGenerelActionID: 0,
      ruleActionID: id,
      orgId,
      modifieddate,
      modifieduserid,
    })
    var config = {
      method: 'post',
      url: 'http://182.71.241.246:8011/api/RuleAction/v1/RuleAction/Update',
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
            notify('Data Updated');
            navigate('/qradar/rules-actions/updated')
          } else {
            notifyFail('Failed to update data');
          }

          // console.log(JSON.stringify(response.data))
          // navigate('/qradar/rules-actions/updated')
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
                  value={toolTypeAction.ruleActionName}
                  onChange={(e) => handleChange(e, "ruleActionName")}
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
                  value={toolTypeAction.toolTypeName}
                  onChange={(e) => handleChange(e, "toolTypeName")}
                  // onChange={handleChangeToolType}
                  required
                >
                  <option value=''>Select Tool Type</option>
                  {toolTypes.map((item, index) => (
                    <option value={item.dataValue} key={index} data-id={item.dataID}>
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
                  value={toolTypeAction.toolName}
                  onChange={(e) => handleChange(e, "toolName")}
                  ref={toolId}
                  required
                >
                  <option value=''>Select Tool</option>
                  {tools.map((item, index) => (
                    <option value={item.toolName} key={index} data-id={item.toolId}>
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
                  value={toolTypeAction.toolActionName}
                  onChange={(e) => handleChange(e, "toolActionName")}
                  ref={toolActionID}
                  required
                >
                  <option value=''>Select Tool Action</option>
                  {toolTypeActions.map((item, index) => (
                    <option value={item.toolTypeActionName} key={index} data-id={item.toolActionID}>
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

export { UpdateRuleAction }
