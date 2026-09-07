import React, {useState, useEffect} from 'react'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom'
import {fetchMasterData} from '../../../../../api/Api'
import {fetchRuleActions} from '../../../../../api/ConfigurationApi'
import {
  fetchGET_ACTION_PARAMETER_DETAIL_URL,
  fetchUPDATE_ACTION_PARAMETER_URL,
} from '../../../../../api/ScriptsApi'
import {ToastContainer} from 'react-toastify'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {notify, notifyFail} from '../components/notification/Notification'

function UpdateActionParameter() {
  const navigate = useNavigate()
  const {id} = useParams()
  const location = useLocation()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const userId = Number(sessionStorage.getItem('userId'))

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [viewOnly, setViewOnly] = useState(Boolean(location.state?.save))

  const [dropdowns, setDropdowns] = useState({
    actions: [],
    parameterTypes: [],
  })

  const [formData, setFormData] = useState({
    actionParameterId: id,
    actionId: 0,
    parameterName: '',
    parameterTypeId: 0,
    required: false,
    description: '',
    userId: userId,
  })

  useEffect(() => {
    setViewOnly(Boolean(location.state?.save))
  }, [location.state])
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load dropdowns in parallel with detail fetch
        const [actionsRes, parameterTypes, detailRes] = await Promise.all([
          fetchRuleActions({orgId, toolId}),
          fetchMasterData({maserDataType: 'parameter_type', orgId, toolId}),
          fetchGET_ACTION_PARAMETER_DETAIL_URL({actionParameterId: Number(id)}),
        ])

        setDropdowns({
          actions: Array.isArray(actionsRes?.actions) ? actionsRes.actions : [],
          parameterTypes: parameterTypes || [],
        })

        if (detailRes?.isSuccess && detailRes.data) {
          const param = detailRes.data
          setFormData({
            actionParameterId: param.actionParameterId,
            actionId: param.actionId || 0,
            parameterName: param.parameterName || '',
            parameterTypeId: param.parameterTypeId || 0,
            required: param.required || false,
            description: param.description || '',
            userId: userId,
          })
        } else {
          notifyFail('Failed to fetch Action Parameter details.')
        }
      } catch (error) {
        console.error(error)
        notifyFail('An error occurred while loading data.')
      } finally {
        setInitialLoading(false)
      }
    }

    loadData()
  }, [id, orgId, toolId, userId])

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const {name, value, type, checked} = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSelectChange = (e) => {
    const {name, value} = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }))
  }

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.actionId === 0) {
      notifyFail('Please select an Action.')
      return
    }
    if (!formData.parameterName.trim()) {
      notifyFail('Parameter Name is mandatory.')
      return
    }
    if (formData.parameterTypeId === 0) {
      notifyFail('Please select a Parameter Type.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        actionParameterId: Number(formData.actionParameterId),
        actionId: formData.actionId,
        parameterName: formData.parameterName.trim(),
        parameterTypeId: formData.parameterTypeId,
        required: formData.required,
        description: formData.description.trim(),
        userId: formData.userId,
      }

      const response = await fetchUPDATE_ACTION_PARAMETER_URL(payload)

      if (response?.isSuccess) {
        notify(response.message || 'Action Parameter updated successfully')
        setTimeout(() => {
          navigate('/qradar/action_parameter/list')
        }, 2000)
      } else {
        notifyFail(response?.message || 'Failed to update Action Parameter')
      }
    } catch (error) {
      console.error(error)
      notifyFail('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <UsersListLoading />
  }

  return (
    <div className='card config'>
      <ToastContainer />

      <div className='card-header bg-heading'>
        <h3 className='card-title'>
          <span className='white'>{viewOnly ? 'View' : 'Update'} Action Parameter</span>
        </h3>
        <div className='card-toolbar'>
          <Link to='/qradar/action_parameter/list' className='white fs-15 text-underline'>
            <i className='fa fa-chevron-left white mg-right-5' />
            Back
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='card-body px-5 py-5'>
          <div className='row g-3 mb-4'>
            <div className='col-md-6'>
              <label className='form-label fw-bold small'>
                Action <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                name='actionId'
                value={formData.actionId}
                onChange={handleSelectChange}
              >
                <option value={0}>Select Action</option>
                {dropdowns.actions.map((item) => (
                  <option key={item.actionId} value={item.actionId}>
                    {item.actionName}
                  </option>
                ))}
              </select>
            </div>

            <div className='col-md-6'>
              <label className='form-label fw-bold small'>
                Parameter Name <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='parameterName'
                value={formData.parameterName}
                onChange={handleChange}
                placeholder='Enter parameter name'
              />
            </div>
          </div>

          <div className='row g-3 mb-4'>
            <div className='col-md-6'>
              <label className='form-label fw-bold small'>
                Parameter Type <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                name='parameterTypeId'
                value={formData.parameterTypeId}
                onChange={handleSelectChange}
              >
                <option value={0}>Select Parameter Type</option>
                {dropdowns.parameterTypes.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>

            <div className='col-md-6'>
              <label className='form-label fw-bold small'>Description</label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='description'
                value={formData.description}
                onChange={handleChange}
                placeholder='Enter description'
              />
            </div>
          </div>

          <div className='row g-3 mb-4 ms-5'>
            <div className='col-md-6 d-flex align-items-center gap-2 mt-2'>
              <input
                type='checkbox'
                className='form-check-input'
                id='required'
                name='required'
                checked={formData.required}
                onChange={handleChange}
              />
              <label className='form-check-label fw-bold small ms-5 mb-0' htmlFor='required'>
                Required
              </label>
            </div>
          </div>

          {/* BUTTONS */}
          {!viewOnly && (
            <div className='row mt-5'>
              <div className='col-md-12 text-end'>
                <button type='submit' className='btn btn-primary' disabled={loading}>
                  {loading ? 'Saving...' : 'Update Action Parameter'}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default UpdateActionParameter
