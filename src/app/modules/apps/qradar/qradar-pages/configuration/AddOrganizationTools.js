import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notify, notifyFail } from '../components/notification/Notification';
import axios from 'axios'
import { fetchLDPToolsByToolType, fetchOrganizationToolsAddUrl, fetchToolTypeActions } from '../../../../../api/ConfigurationApi';
import { fetchOrganizations } from '../../../../../api/dashBoardApi';
import { fetchMasterData } from '../../../../../api/Api';
import { useErrorBoundary } from "react-error-boundary";

const AddOrganizationTools = () => {
  const handleError = useErrorBoundary();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [toolTypes, setToolTypes] = useState([])
  const [organizationList, setOrganizationList] = useState([])
  const [toolName, setToolName] = useState([])
  const [selectedToolAction, setSelectedToolAction] = useState('');
  const [enteredApiUrl, setEnteredApiUrl] = useState('');
  const [tableData, setTableData] = useState([]);
  const [toolActionTypes, setToolActionTypes] = useState([])
  const toolID = useRef()
  const orgID = useRef()
  const authKey = useRef()
  const apiUrl = useRef()
  const apiUrlInTable = useRef()
  const errors = {}
  const handleSubmit = async (event) => {
    if (!toolID.current.value) {
      errors.toolID = 'Enter Tool ID'
      setLoading(false)
      return errors
    }
    if (!orgID.current.value) {
      errors.orgID = 'Enter Org ID'
      setLoading(false)
      return errors
    }
    if (!authKey.current.value) {
      errors.authKey = 'Enter Auth key'
      setLoading(false)
      return errors
    }
    if (!tableData.length > 0) {
      errors.tableData = 'Enter Table Data'
      setLoading(false)
      return errors
    }
    // if (!apiUrl.current.value) {
    //   errors.apiUrl = 'Enter API Url'
    //   setLoading(false)
    //   return errors
    // }
    setLoading(true)
    event.preventDefault()
    const createdUserId = Number(sessionStorage.getItem('userId'));
    const createdDate = new Date().toISOString();
    var data = {
      toolID: toolID.current.value,
      orgID: orgID.current.value,
      authKey: authKey.current.value,
      createdDate,
      createdUserId,
      lastReadPKID: 0,
      toolActions: tableData.map(item => ({
        toolActionId: item.toolTypeActionID,
        apiUrl: item.apiUrl,
        apiVerson: "string",
        getDataBatchSize: 0
      }))
    };
    try {
      const responseData = await fetchOrganizationToolsAddUrl(data);
      const { isSuccess } = responseData;

      if (isSuccess) {
        notify('Organizations Tools Saved');
        navigate('/qradar/organization-tools/updated');
      } else {
        notifyFail('Failed to save Organizations Tools');
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
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

  let handleChangeToolType = (event) => {
    let selectedValue = event.target.value;
    const result = async () => {
      try {
        const data = {
          toolTypeId: Number(selectedValue)
        }
        const response = await fetchLDPToolsByToolType(data);
        const result = response.ldpToolsList
        setToolName(result)
      } catch (error) {
        handleError(error);
      }
    };

    result();
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await fetchToolTypeActions();
        const result = response.filter((item) => item.toolTypeID === Number(selectedValue));
        setToolActionTypes(result);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };
    fetch()

  }
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
      <ToastContainer />
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Add New Organization Tool</span>
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
                  ref={orgID}
                  required
                >
                  <option value='' disabled selected>Select</option>
                  {organizationList.map((item, index) => (
                    <option value={item.orgID} key={index}>
                      {item.orgName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-10'>
                <label htmlFor='toolID' className='form-label fs-6 fw-bolder mb-3'>
                  Tool Type
                </label>
                <select
                  className='form-select form-select-solid'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  id='toolID'
                  onChange={handleChangeToolType}
                  ref={toolID}
                  required
                >
                  <option value='' disabled selected>Select</option>
                  {toolTypes.map((item, index) => (
                    <option value={item.dataID} key={index}>
                      {item.dataValue}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-10'>
                <label htmlFor='toolID' className='form-label fs-6 fw-bolder mb-3'>
                  Tool
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
                  <option value='' disabled selected>Select </option>
                  {toolName.map((item, index) => (
                    <option value={item.toolId} key={index}>
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
                  className='form-control form-control-lg form-control-solid'
                  id='authKey'
                  ref={authKey}
                  placeholder='Ex: xxxxxxxxxxxxxxxxx'
                  required
                />
              </div>
            </div>

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

export { AddOrganizationTools }
