import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { notify, notifyFail } from '../components/notification/Notification';
import axios from 'axios'
import { fetchLDPToolsByToolType, fetchOrganizationToolDetails, fetchOrganizationToolsUpdateUrl } from '../../../../../api/ConfigurationApi';
import { fetchLDPTools, fetchMasterData } from '../../../../../api/Api';
import { fetchOrganizations } from '../../../../../api/dashBoardApi';

const UpdateOrganizationTools = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [toolTypes, setToolTypes] = useState([])
  const [toolName, setToolName] = useState([])
  const [organizationList, setOrganizationList] = useState([])
  const [toolTypeAction, setToolTypeAction] = useState(
    {
      orgID:"",
      orgName: "",
      toolTypeId: "",
      toolTypeName: '',
      toolID: "",
      toolName: '',
      authKey: "",
      apiUrl: ""
    }
  );
  const { id } = useParams()
  const toolID = useRef()
  const orgID = useRef()
  const authKey = useRef()
  const apiUrl = useRef()
  const errors = {}
 useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLDPTools();
        setToolName(data);
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOrganizationToolDetails(id);
        setToolTypeAction({
          ...toolTypeAction,
          orgID:data.orgID,
          orgName: data.orgName,
          toolTypeId: data.toolTypeId,
          toolTypeName: data.toolTypeName,
          toolID: data.toolID,
          toolName: data.toolName,
          authKey: data.authKey,
          apiUrl: data.apiUrl
        })
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);
  const handleSubmit = async(event, toolTypeAction) => {
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
    const modifiedUserId = Number(sessionStorage.getItem('userId'));
    const modifiedDate = new Date().toISOString();
    var data = {
      toolID: toolTypeAction.toolID,
      orgID: toolTypeAction.orgID,
      authKey: toolTypeAction.authKey,
      orgToolID: Number(id),
      lastReadPKID: 0,
      apiUrl: toolTypeAction.apiUrl,
      modifiedDate,
      modifiedUserId
    }
    try {
      const responseData = await fetchOrganizationToolsUpdateUrl(data);
      const { isSuccess } = responseData;
  
      if (isSuccess) {
        notify('Organizations Tool Updated');
        navigate('/qradar/organization-tools/updated');
      } else {
        notifyFail('Failed to update Organizations Tool');
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  useEffect(() => {
    fetchMasterData("Tool_Types")
      .then((typeData) => {
        setToolTypes(typeData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
      const fetchData = async () => {
        try {
          const organizationsResponse = await fetchOrganizations();
          setOrganizationList(organizationsResponse);
        } catch (error) {
          console.log(error);
        }
      };
  
      fetchData();
  }, [])
  const handleChange = (event, field) => {
    const selectedValue = event.target.value;
  
    if (field === "authKey" || field === "apiUrl") {
      setToolTypeAction((prevState) => ({
        ...prevState,
        [field]: selectedValue,
      }));
    }
  
    if (field === "toolName" || field === "orgName") {
      const selectedId = event.target.options[event.target.selectedIndex].getAttribute('data-id');
      setToolTypeAction((prevState) => ({
        ...prevState,
        [field === "toolName" ? "toolID" : "orgID"]: selectedId,
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
          setToolName(result)
        } catch (error) {
          console.log(error);
        }
      };
  
      fetchData();
      setToolTypeAction((prevState) => ({
        ...prevState,
        toolTypeId: selectedId,
        toolTypeName: selectedValue,
      }));
    }
  };
  
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
            <div className='col-lg-4 mb-4 mb-lg-0'>
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
                  value={toolTypeAction.orgName}
                  onChange={(e) => handleChange(e, "orgName")}
                  ref={orgID}
                  required
                >
                  <option value=''>Select</option>
                  {organizationList.map((item, index) => (
                    <option value={item.orgName} key={index} data-id={item.orgID}>
                      {item.orgName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='col-lg-4 mb-4 mb-lg-0'>
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
                  value={toolTypeAction.toolTypeName}
                  onChange={(e) => handleChange(e, "toolTypeName")}
                  // ref={toolID}
                  required
                >
                  <option value=''>Select</option>
                  {toolTypes.map((item, index) => (
                    <option value={item.dataValue} key={index} data-id={item.dataID}>
                      {item.dataValue}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='col-lg-4 mb-4 mb-lg-0'>
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
                  ref={toolID}
                  required
                >
                  <option value=''>Select</option>
                  {toolName.map((item, index) => (
                    <option value={item.toolName} key={index} data-id={item.toolId}>
                      {item.toolName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='col-lg-4 mb-4 mb-lg-0'>
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
                  onChange={(e) => handleChange(e, "authKey")}
                  value={toolTypeAction.authKey}
                  placeholder='Ex: xxxxxxxxxxxxxxxxx'
                />
              </div>
            </div>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='apiUrl' className='form-label fs-6 fw-bolder mb-3'>
                  Enter API URL
                </label>
                <input
                  type='text'
                  required
                  className='form-control form-control-lg form-control-solid'
                  id='apiUrl'
                  value={toolTypeAction.apiUrl}
                  onChange={(e) => handleChange(e, "apiUrl")}
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
            onClick={(e) => handleSubmit(e, toolTypeAction)}
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

export { UpdateOrganizationTools }
