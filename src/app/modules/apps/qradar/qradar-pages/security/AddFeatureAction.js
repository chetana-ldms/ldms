import React, {useEffect, useRef, useState} from 'react'
import {fetchLDPToolsUrl} from '../../../../../api/ConfigurationApi'
import {ToastContainer} from 'react-toastify'
import {notify, notifyFail} from '../components/notification/Notification'
import {Link, useNavigate} from 'react-router-dom'
import {fetchActionsAddUrl} from '../../../../../api/securityApi'

function AddFeatureAction() {
  const navigate = useNavigate()
  const [tools, setTools] = useState([])
  const [selectedTool, setSelectedTool] = useState(null)
  const [loading, setLoading] = useState(false)
  const toolRef = useRef()
  const featureNameRef = useRef()
  const displayNameRef = useRef()
  useEffect(() => {
    const reload = async () => {
      try {
        const data = await fetchLDPToolsUrl()
        setTools(data)
      } catch (error) {
        console.log(error)
      }
    }
    reload()
  }, [])
  const handleToolChange = (e) => {
    const newToolId = Number(e.target.value)
    setSelectedTool(newToolId)
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    const data = {
      actionName: featureNameRef.current.value,
      actionDisplayName:displayNameRef.current.value ,
      toolId: toolRef.current.value || 0,
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
    }

    try {
      const responseData = await fetchActionsAddUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        setTimeout(() => {
          navigate('/qradar/featureaction/list')
        }, 2000)
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='config card'>
      <ToastContainer />
      <div className='card-header bg-heading'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='white'>Add New Actions</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/featureaction/list' className='white fs-15 text-underline'>
              <i className='fa fa-chevron-left white mg-right-5' />
              Back
            </Link>
          </div>
        </div>
      </div>
      <form>
        <div className='card-body pad-10'>
          <div className='row mb-6 table-filter'>
            <div className='col-lg-3'>
              <label htmlFor='mobileNo' className='form-label fs-6 fw-bolder'>
                Tools
              </label>
              <select
                className='form-select form-select-solid bg-blue-light'
                data-kt-select2='true'
                data-placeholder='Select option'
                data-allow-clear='true'
                ref={toolRef}
                onChange={handleToolChange}
              >
                <option value=''>Select</option>
                {tools !== null &&
                  tools?.map((item, index) => (
                    <option key={index} value={item.toolId}>
                      {item.toolName}
                    </option>
                  ))}
              </select>
            </div>
            <div className='col-lg-3 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='Name' className='form-label fs-6 fw-bolder mb-3'>
                  Name
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  required
                  maxLength={200}
                  id='Name'
                  ref={featureNameRef}
                  placeholder=''
                />
              </div>
            </div>
            <div className='col-lg-3 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='DisplayName' className='form-label fs-6 fw-bolder mb-3'>
                  Display Name
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  required
                  maxLength={200}
                  id='DisplayName'
                  ref={displayNameRef}
                  placeholder=''
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className='card-footer d-flex justify-content-end pad-10'>
        <button type='submit' onClick={handleSubmit} className='btn btn-new btn-small'>
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default AddFeatureAction
