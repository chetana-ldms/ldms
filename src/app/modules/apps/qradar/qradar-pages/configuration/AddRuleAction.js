import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {notify, notifyFail} from '../components/notification/Notification'
import {fetchRuleActionUrl} from '../../../../../api/ConfigurationApi'
import {fetchScriptSearchUrl} from '../../../../../api/ScriptsApi'
import {ToastContainer} from 'react-toastify'

const AddRuleAction = () => {
  const navigate = useNavigate()
  const userId = Number(sessionStorage.getItem('userId'))

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [scripts, setScripts] = useState([])

  const [formData, setFormData] = useState({
    actionName: '',
    scriptId: 0,
    description: '',
    userId: userId,
  })

  // =========================
  // LOAD SCRIPTS FOR DROPDOWN
  // =========================

  useEffect(() => {
    const loadScripts = async () => {
      try {
        const response = await fetchScriptSearchUrl({})
        setScripts(Array.isArray(response?.scripts) ? response.scripts : [])
      } catch (error) {
        console.error(error)
        notifyFail('Failed to load scripts.')
      } finally {
        setInitialLoading(false)
      }
    }
    loadScripts()
  }, [])

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

    if (!formData.actionName.trim()) {
      notifyFail('Action Name is mandatory.')
      return
    }
    if (formData.scriptId === 0) {
      notifyFail('Please select a Script.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        actionName: formData.actionName.trim(),
        scriptId: formData.scriptId,
        description: formData.description.trim(),
        userId: formData.userId,
      }

      const response = await fetchRuleActionUrl(payload)

      if (response?.isSuccess) {
        notify(response.message || 'Rule Action added successfully')
        setTimeout(() => {
          navigate('/qradar/rules-actions/list')
        }, 2000)
      } else {
        notifyFail(response?.message || 'Failed to add Rule Action')
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

      {/* HEADER */}

      <div className='card-header bg-heading'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='white'>Add New Action</span>
        </h3>
        <div className='card-toolbar'>
          <Link to='/qradar/rules-actions/list' className='white fs-15 text-underline'>
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
                Action Name <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='actionName'
                value={formData.actionName}
                onChange={handleChange}
                placeholder='Enter action name'
              />
            </div>

            <div className='col-md-6'>
              <label className='form-label fw-bold small'>
                Script <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                name='scriptId'
                value={formData.scriptId}
                onChange={handleSelectChange}
              >
                <option value={0}>Select Script</option>
                {scripts.map((item) => (
                  <option key={item.scriptId} value={item.scriptId}>
                    {item.scriptName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='row g-3 mb-4'>
            <div className='col-md-12'>
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

          {/* BUTTONS */}

          <div className='row mt-5'>
            <div className='col-md-12 text-end'>
              <button type='submit' className='btn btn-primary' disabled={loading}>
                {loading ? 'Saving...' : 'Save Action'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export {AddRuleAction}
