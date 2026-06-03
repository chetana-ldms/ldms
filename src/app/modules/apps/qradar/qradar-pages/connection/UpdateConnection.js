import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams, useLocation} from 'react-router-dom'
import {fetchMasterData} from '../../../../../api/Api'
import {
  fetchConnectionSearchUrl,
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
  const [dropdownData, setDropdownData] = useState({
    authTypes: [],
    environments: [],
    connectionTypes: [],
  })

  const [formData, setFormData] = useState({
    connectionId: Number(id),
    connectionCode: '',
    connectionName: '',
    connectionTypeId: 0,
    authTypeId: 0,
    environmentId: 0,
    configJson: '',
    isDefault: 0,
    isSystem: 0,
    userId: userId,
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [auths, envs, types, details] = await Promise.all([
          fetchMasterData({maserDataType: 'auth_type', orgId, toolId}),
          fetchMasterData({maserDataType: 'environment', orgId, toolId}),
          fetchConnectionTypeSearchUrl({}),
          fetchConnectionSearchUrl({connectionId: Number(id)}),
        ])

        setDropdownData({
          authTypes: auths || [],
          environments: envs || [],
          connectionTypes: types?.data || [],
        })

        if (details?.isSuccess && details.data?.length > 0) {
          const item = details.data[0]
          setFormData({
            connectionId: item.connectionId,
            connectionCode: item.connectionCode || '',
            connectionName: item.connectionName || '',
            connectionTypeId: item.connectionTypeId || 0,
            authTypeId: item.authTypeId || 0,
            environmentId: item.environmentId || 0,
            configJson: item.configJson || '',
            isDefault: item.isDefault || 0,
            isSystem: item.isSystem || 0,
            userId: userId,
          })
        }
      } catch (error) {
        console.error('Error loading connection data:', error)
        notifyFail('Failed to load data.')
      } finally {
        setInitialLoading(false)
      }
    }
    loadData()
  }, [id, orgId, toolId])

  const handleChange = (e) => {
    const {name, value, type, checked} = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }))
  }

  const handleSelectChange = (e) => {
    const {name, value} = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.connectionCode || !formData.connectionName || formData.connectionTypeId === 0) {
      notifyFail('Please fill mandatory fields.')
      return
    }

    setLoading(true)
    try {
      const response = await fetchConnectionUpdateUrl(formData)
      if (response?.isSuccess) {
        notify(response.message || 'Connection updated successfully')
        navigate('/qradar/connection/list')
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
            <div className='col-md-4'>
              <label className='form-label fw-bold small'>
                Connection Name <span className='text-danger'>*</span>
              </label>
              <input
                disabled={isViewMode}
                type='text'
                className='form-control form-control-sm'
                name='connectionName'
                value={formData.connectionName}
                onChange={handleChange}
              />
            </div>
            <div className='col-md-4'>
              <label className='form-label fw-bold small'>
                Connection Code <span className='text-danger'>*</span>
              </label>
              <input
                disabled={isViewMode}
                type='text'
                className='form-control form-control-sm'
                name='connectionCode'
                value={formData.connectionCode}
                onChange={handleChange}
              />
            </div>
            <div className='col-md-4'>
              <label className='form-label fw-bold small'>
                Connection Type <span className='text-danger'>*</span>
              </label>
              <select
                disabled={isViewMode}
                className='form-select form-select-sm'
                name='connectionTypeId'
                value={formData.connectionTypeId}
                onChange={handleSelectChange}
              >
                <option value={0}>Select Type</option>
                {dropdownData.connectionTypes.map((i) => (
                  <option key={i.connectionTypeId} value={i.connectionTypeId}>
                    {i.connectionTypeName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='row g-3 mb-4'>
            <div className='col-md-4'>
              <label className='form-label fw-bold small'>
                Auth Type <span className='text-danger'>*</span>
              </label>
              <select
                disabled={isViewMode}
                className='form-select form-select-sm'
                name='authTypeId'
                value={formData.authTypeId}
                onChange={handleSelectChange}
              >
                <option value={0}>Select Auth Type</option>
                {dropdownData.authTypes.map((i) => (
                  <option key={i.dataID} value={i.dataID}>
                    {i.dataValue}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-4'>
              <label className='form-label fw-bold small'>
                Environment <span className='text-danger'>*</span>
              </label>
              <select
                disabled={isViewMode}
                className='form-select form-select-sm'
                name='environmentId'
                value={formData.environmentId}
                onChange={handleSelectChange}
              >
                <option value={0}>Select Environment</option>
                {dropdownData.environments.map((i) => (
                  <option key={i.dataID} value={i.dataID}>
                    {i.dataValue}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-4 d-flex align-items-center gap-4'>
              <div className='form-check form-check-custom mt-6'>
                <input
                  disabled={isViewMode}
                  className='form-check-input'
                  type='checkbox'
                  name='isDefault'
                  id='isDefault'
                  checked={formData.isDefault === 1}
                  onChange={handleChange}
                />
                <label className='form-check-label small fw-bold ms-10' htmlFor='isDefault'>
                  Is Default
                </label>
              </div>
              <div className='form-check form-check-custom mt-6'>
                <input
                  disabled={isViewMode}
                  className='form-check-input'
                  type='checkbox'
                  name='isSystem'
                  id='isSystem'
                  checked={formData.isSystem === 1}
                  onChange={handleChange}
                />
                <label className='form-check-label small fw-bold ms-10' htmlFor='isSystem'>
                  Is System
                </label>
              </div>
            </div>
          </div>

          <div className='row g-3'>
            <div className='col-md-12'>
              <label className='form-label fw-bold small'>Config JSON</label>
              <textarea
                disabled={isViewMode}
                className='form-control form-control-sm'
                rows={4}
                name='configJson'
                value={formData.configJson}
                onChange={handleChange}
                style={{height: '100px'}}
              />
            </div>
          </div>
        </div>

        {!isViewMode && (
          <div className='card-footer text-end px-5 py-4'>
            <button type='submit' className='btn btn-primary btn-sm' disabled={loading}>
              {loading ? 'Updating...' : 'Update Connection'}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default UpdateConnection
