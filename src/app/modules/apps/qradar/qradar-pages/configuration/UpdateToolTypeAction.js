import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { notify, notifyFail } from '../components/notification/Notification';
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { fetchToolTypeActionDetails } from '../../../../../api/ConfigurationApi'

const UpdateToolTypeAction = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [toolTypes, setToolTypes] = useState([])
  const [toolTypeAction, setToolTypeAction] = useState({ toolTypeName: '', toolTypeID: '' });
  const toolTypeID = useRef()
  const toolAction = useRef()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchToolTypeActionDetails(id, toolAction);
        setToolTypeAction(data);
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, [id, toolAction]);
  const errors = {}
  useEffect(() => {
    setLoading(true)

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
    if (!toolAction.current.value) {
      console.log('error')
      errors.toolAction = 'Select Tool Action'
      setLoading(false)
      return errors
    }
    if (!toolTypeID.current.value) {
      errors.toolTypeID = 'Select Tool Type'
      setLoading(false)
      return errors
    }

    event.preventDefault()
    const modifiedUserId = Number(sessionStorage.getItem('userId'));
    const modifiedDate = new Date().toISOString();
    var data = JSON.stringify({
      // toolTypeID: toolTypeID.current.value,
      toolTypeID: toolTypeAction.toolTypeID,
      toolAction: toolAction.current.value,
      toolTypeActionID: id,
      modifiedDate,
      modifiedUserId
    })
    console.log(data, "data111")
    var config = {
      method: 'post',
      url: 'http://115.110.192.133:502/api/LDPlattform/v1/ToolTypeAction/Update',
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
            navigate('/qradar/tool-type-actions/updated');
          } else {
            notifyFail('Failed to update data');
          }
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
          <span className='card-label fw-bold fs-3 mb-1'>Update Tool Type Action</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/tool-type-actions/list' className='btn btn-primary btn-small'>
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
                <label htmlFor='toolAction' className='form-label fs-6 fw-bolder mb-3'>
                  Tool Type Action
                </label>
                <input
                  type='text'
                  required
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Ex: CreateTicket'
                  ref={toolAction}
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
                  value={toolTypeAction && toolTypeAction.toolTypeName}
                  onChange={(e) =>
                    setToolTypeAction({
                      toolTypeName: e.target.value,
                      toolTypeID: e.target.options[e.target.selectedIndex].getAttribute('data-id'),
                    })
                  }
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

export { UpdateToolTypeAction }