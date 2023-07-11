import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notify, notifyFail } from '../components/notification/Notification';
import axios from 'axios'
import { fetchLDPToolsByToolType, fetchOrganizationToolsAddUrl } from '../../../../../api/ConfigurationApi';
import { fetchOrganizations } from '../../../../../api/dashBoardApi';
import { fetchMasterData } from '../../../../../api/Api';

const AddOrganizationTools = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [toolTypes, setToolTypes] = useState([])
  const [organizationList, setOrganizationList] = useState([])
  const [toolName, setToolName] = useState([])
  const toolID = useRef()
  const orgID = useRef()
  const authKey = useRef()
  const apiUrl = useRef()
  const errors = {}
  const handleSubmit = async(event) => {
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
    if (!apiUrl.current.value) {
      errors.apiUrl = 'Enter API Url'
      setLoading(false)
      return errors
    }
    setLoading(true)
    event.preventDefault()
    const createdUserId = Number(sessionStorage.getItem('userId'));
    const createdDate = new Date().toISOString();
    var data = {
      toolID: toolID.current.value,
      orgID: orgID.current.value,
      authKey: authKey.current.value,
      lastReadPKID: 0,
      apiUrl: apiUrl.current.value,
      createdDate,
      createdUserId
    }
    // var config = {
    //   method: 'post',
    //   url: 'http://115.110.192.133:502/api/LDPlattform/v1/OrganizationTools/Add',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Accept: 'text/plain',
    //   },
    //   data: data,
    // }
    // setTimeout(() => {
    //   axios(config)
    //     .then(function (response) {
    //       const { isSuccess } = response.data;

    //       if (isSuccess) {
    //         notify('Data Saved');
    //         navigate('/qradar/organization-tools/updated');
    //       } else {
    //         notifyFail('Failed to save data');
    //       }
    //       // console.log(JSON.stringify(response.data))
    //       // navigate('/qradar/organization-tools/updated')
    //     })
    //     .catch(function (error) {
    //       console.log(error)
    //     })
    //   setLoading(false)
    // }, 1000)
    try {
      const responseData = await fetchOrganizationToolsAddUrl(data);
      const { isSuccess } = responseData;
  
      if (isSuccess) {
        notify('Data Saved');
        navigate('/qradar/organization-tools/updated');
      } else {
        notifyFail('Failed to save data');
      }
    } catch (error) {
      console.log(error);
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

  let handleChangeToolType = (event) =>{
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
          console.log(error);
        }
      };
  
      result();
  }
  return (
    <div className='card'>
      <ToastContainer />
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Configure New Organization Tool</span>
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
                  ref={orgID}
                  required
                >
                  <option value=''>Select</option>
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
                  Enter Tool Type
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
                  <option value=''>Select</option>
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
                  <option value=''>Select </option>
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
                  Enter Authentication Key
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
