import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { notify, notifyFail } from '../components/notification/Notification';
import axios from 'axios'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { fetchLDPTools, fetchMasterData } from '../../../../../api/Api'
import { fetchLDPToolsByToolType, fetchToolActionDetails, fetchToolActionUpdateUrl, fetchToolTypeActions } from '../../../../../api/ConfigurationApi';

const UpdateToolAction = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [toolTypes, setToolTypes] = useState([])
  const [toolActionTypes, setToolActionTypes] = useState([])
  const [toolTypeAction, setToolTypeAction] = useState(
    {
      toolTypeName: "",
      toolName: '',
      toolID: '',
      toolTypeActionName: "",
      toolTypeActionID: "",
      selectedToolId:""
    }
  );
  console.log(toolTypeAction, "toolTypeAction")
  const [ldpTools, setLdpTools] = useState([]);
  const toolID = useRef()
  const toolTypeActionID = useRef()
  const toolId = useRef()
  const errors = {}
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchToolActionDetails(id);
        setToolTypeAction((prevToolTypeAction) => ({
          ...prevToolTypeAction,
          toolTypeName:data.toolTypeName,
          toolName: data.toolName,
          toolTypeActionName: data.toolTypeActionName,
          toolID: data.toolID, //2nd field
          toolTypeId: data.toolTypeId, //1st field
          toolTypeActionID: data.toolTypeActionID //3rd field 
        }));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (event,field) => {
    let selectedId = event.target.options[event.target.selectedIndex].getAttribute('data-id');
    if(field === "selectToolType"){
      setToolTypeAction({
        ...toolTypeAction,
        selectedToolId : selectedId,
        toolTypeName:event.target.value
      });
      const result = async () => {
        try {
          const data = {
            toolTypeId: Number(selectedId)
          }
          const response = await fetchLDPToolsByToolType(data);
          const result = response.ldpToolsList
          setLdpTools(result)
        } catch (error) {
          console.log(error);
        }
      };
  
      result();
      const fetch = async () => {
        try {
          setLoading(true);
          const response = await fetchToolTypeActions();
          const result = response.filter((item) => item.toolTypeID === Number(selectedId));
          setToolActionTypes(result);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      fetch()
    }else if(field === "tools"){
      setToolTypeAction({
        ...toolTypeAction,
        toolName : event.target.value,
        toolID:selectedId
      });
    }else if(field === "toolActionType"){
      setToolTypeAction({
        ...toolTypeAction,
        toolTypeActionName : event.target.value,
        toolTypeActionID:selectedId
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLDPTools();
        setLdpTools(data);
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, []);
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
   
        fetchMasterData("Tool_Types")
          .then((typeData) => {
            setToolTypes(typeData);
          })
          .catch((error) => {
            console.log(error);
          });
  }, [])
  const handleSubmit = async(event, toolTypeAction) => {
    setLoading(true)
    if (!toolTypeActionID.current.value) {
      errors.toolTypeActionID = 'Select Tool Action'
      setLoading(false)
      return errors
    }
    if (!toolID.current.value) {
      errors.toolID = 'Select Tool Type'
      setLoading(false)
      return errors
    }
    event.preventDefault()
    const modifiedUserId = Number(sessionStorage.getItem('userId'));
    const modifiedDate = new Date().toISOString();
    var data ={
        toolID: toolTypeAction.toolID,
        toolTypeActionID: toolTypeAction.toolTypeActionID,
        toolActionID: Number(id),
        modifiedDate,
        modifiedUserId
    }
    try {
      const responseData = await fetchToolActionUpdateUrl(data);
      const { isSuccess } = responseData;
  
      if (isSuccess) {
        notify('Tool Action Updated');
        navigate('/qradar/tool-actions/updated');
      } else {
        notifyFail('Failed to update Tool Action');
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <div className='card'>
      {loading && <UsersListLoading />}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Update Tool Action</span>
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
            <div className='col-lg-4 mb-4 mb-lg-0'>
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
                  value={toolTypeAction.toolTypeName}
                  onChange={(e) => handleChange(e,"selectToolType")}
                  required
                >
                  <option value=''>Select Tool Type</option>
                  {toolTypes.map((item, index) => (
                    <option value={item.value} key={index} data-id={item.dataID}>
                      {item.dataValue}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='toolID' className='form-label fs-6 fw-bolder mb-3'>
                  Select Tools
                </label>
                <select
                  className='form-select form-select-solid'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  id='toolId'
                  ref={toolId}
                  value={toolTypeAction.toolName}
                  onChange={(e) => handleChange(e,"tools")}
                  required
                >
                  <option value=''>Select Tools</option>
                  {ldpTools.map((item, index) => (
                    <option value={item.toolName} key={index} data-id={item.toolId}>
                      {item.toolName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-lg-4 mb-4 mb-lg-0">
              <div className="fv-row mb-0">
                <label htmlFor="toolTypeActionID" className="form-label fs-6 fw-bolder mb-3">
                  Tool Action Type
                </label>
                <select
                  className="form-select form-select-solid"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-allow-clear="true"
                  id="toolTypeActionID"
                  value={toolTypeAction.toolTypeActionName}
                  ref={toolTypeActionID}
                  onChange={(e)=>handleChange(e,"toolActionType")}
                  required
                >
                  <option value="">Select Tool Action Type</option>
                  {toolActionTypes.map((item, index) => (
                    <option value={item.toolTypeActionName} key={index} data-id={item.toolTypeActionID}>
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
            onClick={(e) => handleSubmit(e, toolTypeAction)}
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

export { UpdateToolAction }
