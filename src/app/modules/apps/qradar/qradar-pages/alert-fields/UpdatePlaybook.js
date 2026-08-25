import React, {useEffect, useState} from 'react'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import {fetchGetPlaybookDetailUrl, fetchUpdatePlaybookUrl} from '../../../../../api/AlertFieldsApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {UsersListLoading} from '../components/loading/UsersListLoading'

function UpdatePlaybook() {
  const {id} = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const viewOnly = Boolean(location.state?.save)
  const userId = Number(sessionStorage.getItem('userId'))
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)
  const [formData, setFormData] = useState({
    playbookId: Number(id),
    playbookName: '',
    description: '',
    userId,
  })

  useEffect(() => {
    const loadPlaybook = async () => {
      try {
        setInitialLoading(true)
        const response = await fetchGetPlaybookDetailUrl({playbookId: Number(id)})
        const playbook = response?.data
        if (!playbook) {
          notifyFail(response?.message || 'Failed to load playbook details')
          return
        }
        setFormData({
          playbookId: playbook.playbookId ?? playbook.id ?? Number(id),
          playbookName: playbook.playbookName || '',
          description: playbook.playbookDescription || '',
          userId,
        })
      } catch (error) {
        console.error('Error loading playbook details:', error)
        notifyFail('Failed to load playbook details')
      } finally {
        setInitialLoading(false)
      }
    }
    loadPlaybook()
  }, [id, userId])

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
      const response = await fetchUpdatePlaybookUrl(formData)
      if (response?.isSuccess) {
        notify(response.message || 'Playbook updated successfully')
        navigate('/qradar/alert-fields/playbook/list')
      } else {
        notifyFail(response?.message || 'Failed to update playbook')
      }
    } catch (error) {
      console.error('Error updating playbook:', error)
      notifyFail('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='card config'>
      <ToastContainer />
      {initialLoading && <UsersListLoading />}
      <div className='card-header bg-heading'>
        <h3 className='card-title'>
          <span className='white'>{viewOnly ? 'View' : 'Update'} Playbook</span>
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
                disabled={viewOnly}
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
                disabled={viewOnly}
              />
            </div>
          </div>
        </div>
        {!viewOnly && (
          <div className='card-footer text-end px-5 py-4'>
            <button type='submit' className='btn btn-primary btn-sm' disabled={loading}>
              {loading ? 'Saving...' : 'Update Playbook'}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default UpdatePlaybook
