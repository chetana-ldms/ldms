import React, {useState, useRef, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { notify, notifyFail } from '../components/notification/Notification';
import axios from 'axios'
import { fetchMasterData } from '../../../../../api/Api';
import { fetchLDPToolsAddUrl } from '../../../../../api/ConfigurationApi';
import { useErrorBoundary } from "react-error-boundary";

const AddLdpTools = () => {
  const handleError = useErrorBoundary();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [toolTypes, setToolTypes] = useState([])
  console.log(toolTypes, "toolTypes")
  const toolName = useRef()
  const toolType = useRef()
  const errors = {}
  const handleSubmit = async(event) => {
    setLoading(true)

    if (!toolName.current.value) {
      errors.toolName = 'Enter Tool Name'
      setLoading(false)
      return errors
    }

    if (!toolType.current.value) {
      errors.toolType = 'Select Tool Type'
      setLoading(false)
      return errors
    }

    event.preventDefault()
    const createdUserId = Number(sessionStorage.getItem('userId'));
    const createdDate = new Date().toISOString();
    var data = {
      toolName: toolName.current.value,
      ToolTypeID: Number(toolType.current.value),
      // toolTypeID: 1,
      createdUserId,
      createdDate
      
    }
    try {
      const responseData = await fetchLDPToolsAddUrl(data);
      const { isSuccess } = responseData;
  
      if (isSuccess) {
        notify('LDP Tools saved');
        navigate('/qradar/ldp-tools/list')
      } else {
        notifyFail('Failed to save LDP Tools');
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

  return (
    <div className='card'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Configure New LDP Tool</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/ldp-tools/list' className='btn btn-primary btn-small'>
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
                <label htmlFor='toolName' className='form-label fs-6 fw-bolder mb-3'>
                  Enter Tool Name
                </label>
                <input
                  type='text'
                  required
                  className='form-control form-control-lg form-control-solid'
                  id='toolName'
                  ref={toolName}
                  placeholder='Ex: Qradar'
                />
              </div>
            </div>
            <div className='col-lg-6 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='toolType' className='form-label fs-6 fw-bolder mb-3'>
                  Enter Tool Type
                </label>
                <select
                  className='form-select form-select-solid'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  id='toolType'
                  ref={toolType}
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

export {AddLdpTools}
