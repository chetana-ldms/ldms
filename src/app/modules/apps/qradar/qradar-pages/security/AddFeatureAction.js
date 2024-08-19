import React, { useEffect, useRef, useState } from 'react'
import { fetchLDPToolsUrl } from '../../../../../api/ConfigurationApi'
import { ToastContainer } from 'react-toastify'
import { notify, notifyFail } from '../components/notification/Notification'
import { Link, useNavigate } from 'react-router-dom'
import { fetchActionTypesUrl, fetchActionsAddUrl, fetchActionsUrl } from '../../../../../api/securityApi'

function AddFeatureAction() {
  const navigate = useNavigate()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [tools, setTools] = useState([])
  const [selectedTool, setSelectedTool] = useState(null)
  const [loading, setLoading] = useState(false)
  const toolRef = useRef()
  const featureNameRef = useRef()
  const displayNameRef = useRef()
  const SubFeatureExistsRef = useRef()
  const [isSubFeature, setIsSubFeature] = useState(false)
  const parentFeaturesRef = useRef()
  const [selectedParentFeatures, setSelectedParentFeatures] = useState(null)
  const [parentFeatures, setParentFeatures] = useState([])
  const [actionType, setActionType] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const fetchActionType = async () => {
      try {
        const response = await fetchActionTypesUrl()
        setActionType(response)
      } catch (error) {
        console.log(error)
      }
    }
    fetchActionType()
  }, [])

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const data = {
          toolId: selectedTool || 0,
          actionId: 0,
          parentActionId: 0,
          parentActions: true
        }
        const featureResponse = await fetchActionsUrl(data)
        setParentFeatures(featureResponse)
      } catch (error) {
        console.log(error)
      }
    }
    fetchActions()
  }, [selectedTool])

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
    if (!featureNameRef.current.value) {
      notifyFail('Enter Name')
      setLoading(false)
      return
    }

    if (!displayNameRef.current.value) {
      notifyFail('Enter Display Name')
      setLoading(false)
      return
    }
    setLoading(true)
    const data = {
      actionName: featureNameRef.current.value,
      actionDisplayName: displayNameRef.current.value,
      toolId: toolRef.current.value || 0,
      actionType: inputRef.current.value || '',
      parentActionId: parentFeaturesRef.current.value || 0,
      subactionExists: SubFeatureExistsRef.current.checked ? 1 : 0,
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
    }
    try {
      const responseData = await fetchActionsAddUrl(data)
      const { isSuccess, message } = responseData

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

  const handleToolChangeParentFeatures = (e) => {
    const newParentFeatures = Number(e.target.value)
    setSelectedParentFeatures(newParentFeatures)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    handleToolChangeParentFeatures(value)
  }

  const handleInputFocus = () => {
    setShowDropdown(true)
  }

  const handleOptionClick = (value) => {
    setInputValue(value)
    handleToolChangeParentFeatures(value)
    setShowDropdown(false)
  }

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !inputRef.current.contains(event.target)
    ) {
      setShowDropdown(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
      <form onSubmit={handleSubmit}>
        <div className='card-body pad-10'>
          <div className='row mb-6 table-filter'>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='Name' className='form-label fs-6 fw-bolder mb-3'>
                  Name
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  maxLength={200}
                  id='Name'
                  ref={featureNameRef}
                  placeholder=''
                />
              </div>
            </div>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='DisplayName' className='form-label fs-6 fw-bolder mb-3'>
                  Display Name
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  maxLength={200}
                  id='DisplayName'
                  ref={displayNameRef}
                  placeholder=''
                />
              </div>
            </div>

            <div className='col-lg-4'>
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
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='row mt-10'>
                <div className='col-md-3'>
                  <input
                    type='checkbox'
                    id='SubFeatureExists'
                    className='Psecume-2'
                    ref={SubFeatureExistsRef}
                    checked={isSubFeature}
                    onChange={() => setIsSubFeature(!isSubFeature)}
                  />
                </div>
                <div className=' col-md-9'>
                  <label htmlFor='SubFeatureExists' className='form-label fs-6 fw-bolder'>
                    Sub Action Exists
                  </label>
                </div>
              </div>
            </div>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='Parent Features' className='form-label fs-6 fw-bolder w-200px mt-3'>
                  Parent Action
                </label>
                <select
                  className='form-select form-select-solid bg-blue-light'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  ref={parentFeaturesRef}
                  onChange={handleToolChangeParentFeatures}
                  style={{ maxHeight: '150px', overflowY: 'auto' }}
                >
                  <option value=''>Select</option>
                  {parentFeatures !== null &&
                    parentFeatures?.map((item, index) => (
                      <option key={index} value={item.actionId}>
                        {item.actionDisplayName}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className='col-lg-4 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='Parent Features' className='form-label fs-6 fw-bolder w-200px mt-3'>
                  Action Type
                </label>
                <div className='position-relative' ref={dropdownRef}>
                  <input
                    type='text'
                    className='form-control bg-transparent'
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder='Enter or select a value'
                    ref={inputRef}
                  />
                  {showDropdown && (
                    <div
                      className='dropdown-menu show w-100'
                      style={{ maxHeight: '150px', overflowY: 'auto' }}
                    >
                      {actionType !== null &&
                        actionType.map((item, index) => (
                          <div
                            key={index}
                            className='dropdown-item'
                            onClick={() => handleOptionClick(item)}
                          >
                            {item}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
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
