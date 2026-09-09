import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams, useLocation} from 'react-router-dom'
import {
  fetchConnectionDetailUrl,
  fetchConnectionUpdateUrl,
  fetchConnectionTypeSearchUrl,
} from '../../../../../api/ConnectionApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import {UsersListLoading} from '../components/loading/UsersListLoading'

function UpdateConnection() {
  const navigate = useNavigate()
  const {id} = useParams()
  const location = useLocation()
  const isViewMode = location.state?.save === true

  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const userId = Number(sessionStorage.getItem('userId'))

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [connectionTypes, setConnectionTypes] = useState([])

  const [formData, setFormData] = useState({
    connectionId: Number(id),
    connectionName: '',
    connectionTypeId: 0,
    hostName: '',
    port: '',
    username: '',
    password: '',
    description: '',
    userId: userId,
  })

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    const loadData = async () => {
      try {
        const [typesRes, detailRes] = await Promise.all([
          fetchConnectionTypeSearchUrl({}),
          fetchConnectionDetailUrl({connectionId: Number(id)}),
        ])

        setConnectionTypes(
          Array.isArray(typesRes?.connectionTypes) ? typesRes.connectionTypes : typesRes?.data || []
        )

        if (detailRes?.isSuccess && detailRes.connection) {
          const item = detailRes.connection
          setFormData({
            connectionId: item.connectionId,
            connectionName: item.connectionName || '',
            connectionTypeId: item.connectionTypeId || 0,
            hostName: item.hostName || '',
            port: item.port || '',
            username: item.username || '',
            password: item.password || '',
            description: item.description || '',
            userId: userId,
          })
        } else {
          notifyFail('Failed to fetch connection details.')
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
    const {name, value} = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    if (!formData.connectionName.trim()) {
      notifyFail('Connection Name is mandatory.')
      return
    }
    if (formData.connectionTypeId === 0) {
      notifyFail('Please select a Connection Type.')
      return
    }
    if (!formData.hostName.trim()) {
      notifyFail('Host Name is mandatory.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        connectionId: formData.connectionId,
        connectionName: formData.connectionName.trim(),
        connectionTypeId: formData.connectionTypeId,
        hostName: formData.hostName.trim(),
        port: formData.port ? Number(formData.port) : 0,
        username: formData.username.trim(),
        password: formData.password,
        description: formData.description.trim(),
        userId: formData.userId,
      }

      const response = await fetchConnectionUpdateUrl(payload)
      if (response?.isSuccess) {
        notify(response.message || 'Connection updated successfully')
        setTimeout(() => {
          navigate('/qradar/connection/list')
        }, 2000)
      } else {
        notifyFail(response?.message || 'Failed to update connection')
      }
    } catch (error) {
      console.error(error)
      notifyFail('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) return <UsersListLoading />

  return (
    <div className='card config'>
      <ToastContainer />

      <div className='card-header bg-heading'>
        <h3 className='card-title'>
          <span className='white'>{isViewMode ? 'View' : 'Update'} Connection</span>
        </h3>
        <div className='card-toolbar'>
          <Link to='/qradar/connection/list' className='white fs-15 text-underline'>
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
                Connection Name <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='connectionName'
                value={formData.connectionName}
                onChange={handleChange}
                placeholder='Enter connection name'
                disabled={isViewMode}
              />
            </div>

            <div className='col-md-6'>
              <label className='form-label fw-bold small'>
                Connection Type <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                name='connectionTypeId'
                value={formData.connectionTypeId}
                onChange={handleSelectChange}
                disabled={isViewMode}
              >
                <option value={0}>Select Connection Type</option>
                {connectionTypes.map((i) => (
                  <option key={i.connectionTypeId} value={i.connectionTypeId}>
                    {i.connectionTypeName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='row g-3 mb-4'>
            <div className='col-md-6'>
              <label className='form-label fw-bold small'>
                Host Name <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='hostName'
                value={formData.hostName}
                onChange={handleChange}
                placeholder='Enter host name or IP'
                disabled={isViewMode}
              />
            </div>

            <div className='col-md-6'>
              <label className='form-label fw-bold small'>Port</label>
              <input
                type='number'
                className='form-control form-control-sm'
                name='port'
                value={formData.port}
                onChange={handleChange}
                placeholder='Enter port number'
                min={0}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className='row g-3 mb-4'>
            <div className='col-md-6'>
              <label className='form-label fw-bold small'>Username</label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='username'
                value={formData.username}
                onChange={handleChange}
                placeholder='Enter username'
                disabled={isViewMode}
              />
            </div>

            <div className='col-md-6'>
              <label className='form-label fw-bold small'>Password</label>
              <input
                type='password'
                className='form-control form-control-sm'
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='Enter password'
                disabled={isViewMode}
              />
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
                disabled={isViewMode}
              />
            </div>
          </div>

          {/* BUTTONS */}

          {!isViewMode && (
            <div className='row mt-5'>
              <div className='col-md-12 text-end'>
                <button type='submit' className='btn btn-primary' disabled={loading}>
                  {loading ? 'Saving...' : 'Update Connection'}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default UpdateConnection
