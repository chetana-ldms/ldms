import React, {useState, useRef, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import { notify, notifyFail } from '../components/notification/Notification';
import axios from 'axios'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {fetchLDPTools} from '../../../../../api/Api'

const UpdateToolAction = () => {
  const navigate = useNavigate()
  const {id} = useParams()
  const [loading, setLoading] = useState(false)
  const [toolTypes, setToolTypes] = useState([])
  const [toolActionTypes, setToolActionTypes] = useState([])
  const [ldpTools, setLdpTools] = useState([]);
  console.log(ldpTools, "ldpTools")
  const toolID = useRef()
  const toolTypeActionID = useRef()
  const toolId = useRef()
  const errors = {}
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
    var data = JSON.stringify({
      toolID: toolID.current.value,
      toolTypeActionID: toolTypeActionID.current.value,
      toolActionID: id,
      modifiedDate,
      modifiedUserId
    })
    var config = {
      method: 'post',
      url: 'http://115.110.192.133:502/api/LDPlattform/v1/ToolAction/Update',
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
            navigate('/qradar/tool-actions/updated');
          } else {
            notifyFail('Failed to update data');
          }
          // console.log(JSON.stringify(response.data))
          // navigate('/qradar/tool-actions/updated')
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

            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='toolID' className='form-label fs-6 fw-bolder mb-3'>
                  Tools
                </label>
                <select
                  className='form-select form-select-solid'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  id='toolId'
                  ref={toolId}
                  required
                >
                  <option value=''>Select Tools</option>
                  {ldpTools.map((item, index) => (
                    <option value={item.toolId} key={index}>
                      {item.toolName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='toolTypeActionID' className='form-label fs-6 fw-bolder mb-3'>
                  Tool Action Type
                </label>
                <select
                  className='form-select form-select-solid'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  id='toolTypeActionID'
                  ref={toolTypeActionID}
                  required
                >
                  <option value=''>Select Tool Action Type</option>
                  {toolActionTypes.map((item, index) => (
                    <option value={item.toolTypeActionID} key={index}>
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

export {UpdateToolAction}
