import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import {fetchCreatePlaybookUrl} from '../../../../../api/AlertFieldsApi'
import {notify, notifyFail} from '../components/notification/Notification'

function AddPlaybook() {
  const navigate = useNavigate()
  const userId = Number(sessionStorage.getItem('userId'))
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({playbookName: '', description: '', userId})

  const handleChange = (event) => {
    const {name, value} = event.target
    setFormData((previous) => ({...previous, [name]: value}))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!formData.playbookName.trim() || !formData.description.trim()) {
      notifyFail('Please fill all mandatory fields.')
      return
    }
    try {
      setLoading(true)
      const response = await fetchCreatePlaybookUrl(formData)
      if (response?.isSuccess) {
        notify(response.message || 'Playbook created successfully')
        navigate('/qradar/alert-fields/playbook/list')
      } else {
        notifyFail(response?.message || 'Failed to create playbook')
      }
    } catch (error) {
      console.error('Error creating playbook:', error)
      notifyFail('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='card config'>
      <ToastContainer />
      <div className='card-header bg-heading'>
        <h3 className='card-title'>
          <span className='white'>Add Playbook</span>
        </h3>
        <div className='card-toolbar'>
          <Link to='/qradar/alert-fields/playbook/list' className='white fs-15 text-underline'>
            <i className='fa fa-chevron-left white mg-right-5' />
            Back
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='card-body px-5 py-5'>
          <div className='row g-3'>
            <div className='col-md-6'>
              <label className='form-label fw-bold small'>
                Playbook Name <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='playbookName'
                value={formData.playbookName}
                onChange={handleChange}
              />
            </div>
            <div className='col-md-6'>
              <label className='form-label fw-bold small'>
                Description <span className='text-danger'>*</span>
              </label>
              <textarea
                className='form-control form-control-sm'
                name='description'
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className='card-footer text-end px-5 py-4'>
          <button type='submit' className='btn btn-primary btn-sm' disabled={loading}>
            {loading ? 'Saving...' : 'Save Playbook'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddPlaybook
