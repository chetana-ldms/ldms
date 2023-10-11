import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { notify, notifyFail } from '../components/notification/Notification';
import axios from 'axios'
import { fetchLDPToolsByToolType, fetchOrganizationToolDetails, fetchOrganizationToolsUpdateUrl, fetchToolTypeActions } from '../../../../../api/ConfigurationApi';
import { fetchLDPTools, fetchMasterData } from '../../../../../api/Api';
import { fetchOrganizations } from '../../../../../api/dashBoardApi';
import { useErrorBoundary } from "react-error-boundary";

const UpdateOrganizationTools = () => {
  const handleError = useErrorBoundary();
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
  const [selectedToolAction, setSelectedToolAction] = useState('');
  const [toolActionTypes, setToolActionTypes] = useState([]);
  const [enteredApiUrl, setEnteredApiUrl] = useState('');
  const [tableData, setTableData] = useState([]);
  const [selectedToolType, setSelectedToolType] = useState(null)
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
        handleError(error);
      }
    };

    const fetchActionTypes = async () => {
      try {
        setLoading(true);
        const response = await fetchToolTypeActions();
        const result = response.filter((item) => item.toolTypeID === Number(selectedToolType));
        setToolActionTypes(result);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    if (!selectedToolType) {
      const initialToolType = toolTypeAction.toolTypeId;  
      setSelectedToolType(initialToolType);
    }

    fetchData();
    fetchActionTypes();
  }, [selectedToolType, toolTypeAction]);
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
          // apiUrl: data.apiUrl
        })
      } catch (error) {
        handleError(error);
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
    if (!tableData.length > 0) {
      errors.tableData = 'Enter Table Data'
      setLoading(false)
      return errors
    }
    // if (!apiUrl.current.value) {
    //   errors.apiUrl = 'Enter api url'
    //   setLoading(false)
    //   return errors
    // }
    event.preventDefault()
    const modifiedUserId = Number(sessionStorage.getItem('userId'));
    const modifiedDate = new Date().toISOString();
    var data = {
      toolID: toolTypeAction.toolID,
      orgID: toolTypeAction.orgID,
      authKey: toolTypeAction.authKey,
      orgToolID: Number(id),
      modifiedDate,
      modifiedUserId,
      lastReadPKID: 0,
      // apiUrl: toolTypeAction.apiUrl,
        toolActions: tableData.map(item => ({
          toolActionId: item.toolTypeActionID,
          orgToolActionId: 0,
          apiUrl: item.apiUrl,
          apiVerson: "string",
          getDataBatchSize: 0
        }))
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
      handleError(error);
    }
    setLoading(false);
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
  useEffect(() => {
      const fetchData = async () => {
        try {
          const organizationsResponse = await fetchOrganizations();
          setOrganizationList(organizationsResponse);
        } catch (error) {
          handleError(error);
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
      setSelectedToolType(selectedId)
      const fetchData = async () => {
        try {
          const data = {
            toolTypeId: Number(selectedId)
          }
          const response = await fetchLDPToolsByToolType(data);
          const result = response.ldpToolsList
          setToolName(result)
        } catch (error) {
          handleError(error);
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
  const handleAction = (event) => {
    event.preventDefault();
    const newToolAction = { toolAction: selectedToolAction, toolTypeActionID: toolActionTypes.find(item => item.toolAction === selectedToolAction)?.toolTypeActionID, apiUrl: enteredApiUrl };

    setTableData([...tableData, newToolAction]);
    setSelectedToolAction('');
    setEnteredApiUrl('');
  };
  const handleDelete = (index) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);
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
                  Organization
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
                   Tool Type
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
                   Tool
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
                  Authentication Key
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
            {/* <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='apiUrl' className='form-label fs-6 fw-bolder mb-3'>
                  API URL
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
            </div> */}
            <div className='card-body border-top p-9 mt-5'>
              <div className='row mb-6'>
                <div className='col-lg-4 mb-4 mb-lg-0'>
                  <div className='fv-row mb-0'>
                    <label htmlFor='toolTypeActionID' className='form-label fs-6 fw-bolder mb-3'>
                      Tool Action drop down
                    </label>
                    <select
                      className='form-select form-select-solid'
                      data-kt-select2='true'
                      data-placeholder='Select option'
                      data-allow-clear='true'
                      value={selectedToolAction}
                      onChange={(e) => setSelectedToolAction(e.target.value)}
                    // required
                    >
                      <option value='' disabled selected>Select</option>
                      {toolActionTypes.map((item, index) => (
                        <option value={item.toolAction} key={index}>
                          {item.toolAction}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className='col-lg-4 mb-4 mb-lg-0'>
                  <div className='fv-row mb-0'>
                    <label htmlFor='apiUrl' className='form-label fs-6 fw-bolder mb-3'>
                      API URL
                    </label>
                    <input
                      type='text'
                      // required
                      className='form-control form-control-lg form-control-solid'
                      id='apiUrl'
                      ref={apiUrl}
                      value={enteredApiUrl}
                      onChange={(e) => setEnteredApiUrl(e.target.value)}
                      placeholder='Ex: https://10.100.0.102/api/siem/offences'
                    />
                  </div>
                </div>
                <div className='col-lg-4 mb-4 mb-lg-0 d-flex align-items-end justify-content-center'>
                  <button className='btn btn-primary' onClick={handleAction} >Add Action</button>
                </div>
              </div>
            </div>
            {tableData.length > 0 && (
              <div className='card-body border-top p-9'>
                <h4>List of Tool Actions</h4>
                <table className='table'>
                  <thead>
                    <tr>
                      <th>Tool Action</th>
                      <th>API URL</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item, index) => (
                      <tr key={index}>
                        <td style={{ paddingTop: '30px' }}>{item.toolAction}</td>
                        <td style={{ paddingTop: '30px' }}>{item.apiUrl}</td>
                        <td>
                          <td>
                            <button
                              className='btn btn-danger'
                              title="Remove"
                              onClick={() => handleDelete(index)}
                              style={{ borderRadius: '50%' }}
                              type="button"
                            >
                              <i className='bi bi-x'></i>
                            </button>
                          </td>

                        </td>


                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
