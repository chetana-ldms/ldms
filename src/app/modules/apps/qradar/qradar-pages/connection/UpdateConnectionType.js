import React, {useState, useEffect} from 'react'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom'
import {fetchMasterData} from '../../../../../api/Api'
import {
  fetchConnectionTypeSearchUrl,
  fetchConnectionTypeUpdateUrl,
} from '../../../../../api/ConnectionApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import {UsersListLoading} from '../components/loading/UsersListLoading'

function UpdateConnectionType() {
  const navigate = useNavigate()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const {id} = useParams()
  const location = useLocation()
  const toolId = Number(sessionStorage.getItem('toolID'))
  const userId = Number(sessionStorage.getItem('userId'))

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [dropdownData, setDropdownData] = useState({
    categories: [],
    providers: [],
  })

  const [formData, setFormData] = useState({
    connectionTypeCode: '',
    connectionTypeName: '',
    connectionCategoryId: 0,
    providerTypeId: 0,
    description: '',
    icon: '',
    isSystem: false,
    userId: userId,
  })

  useEffect(() => {
    // Load dropdown master data

    const loadMasterData = async () => {
      try {
        const [categories, providers] = await Promise.all([
          fetchMasterData({maserDataType: 'connection_category', orgId, toolId}),
          fetchMasterData({maserDataType: 'provider_type', orgId, toolId}),
        ])
        setDropdownData({
          categories: categories || [],
          providers: providers || [],
        })
      } catch (error) {
        console.error('Error loading master data:', error)
        notifyFail('Failed to load form options.')
      } finally {
        setInitialLoading(false)
      }
    }
    loadMasterData()
  }, [orgId, toolId])

  useEffect(() => {
    // Fetch existing connection type details
    const fetchDetails = async () => {
      if (id) {
        try {
          const response = await fetchConnectionTypeSearchUrl({connectionTypeId: Number(id)})
          if (response?.isSuccess && response.data?.length > 0) {
            const data = response.data[0]
            setFormData((prev) => ({
              ...prev,
              connectionTypeCode: data.connectionTypeCode || '',
              connectionTypeName: data.connectionTypeName || '',
              connectionCategoryId: data.connectionCategoryId || 0,
              providerTypeId: data.providerTypeId || 0,
              description: data.description || '',
              icon: data.icon || '',
              isSystem: data.isSystem || false,
            }))
          } else {
            notifyFail('Failed to fetch connection type details.')
          }
        } catch (error) {
          console.error('Error fetching details:', error)
          notifyFail('An error occurred while fetching details.')
        }
      }
    }
    fetchDetails()
  }, [id])

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !formData.connectionTypeCode ||
      !formData.connectionTypeName ||
      formData.connectionCategoryId === 0 ||
      formData.providerTypeId === 0
    ) {
      notifyFail('Please fill all mandatory fields.')
      return
    }

    setLoading(true)
    try {
      const response = await fetchConnectionTypeUpdateUrl({
        ...formData,
        connectionTypeId: Number(id),
      })
      if (response?.isSuccess) {
        notify(response.message || 'Connection Type added successfully')

        setTimeout(() => {
          navigate('/qradar/connection-types/list')
        }, 2000)
      } else {
        notifyFail(response?.message || 'Failed to add connection type')
      }
    } catch (error) {
      console.error(error)
      notifyFail('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const isViewMode = location.state?.save === true

  if (initialLoading) return <UsersListLoading />

  return (
    <div className='card config'>
      <ToastContainer />
      <div className='card-header bg-heading'>
        <h3 className='card-title align-items-start flex-column'>
          {isViewMode ? (
            <span className='white'>View Connection Type</span>
          ) : (
            <span className='white'>Update Connection Type</span>
          )}
        </h3>
        <div className='card-toolbar'>
          <Link to='/qradar/connection-types/list' className='white fs-15 text-underline'>
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
                Name <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='connectionTypeName'
                value={formData.connectionTypeName}
                onChange={handleChange}
                disabled={isViewMode}
                placeholder='Enter connection type name'
              />
            </div>

            <div className='col-md-4'>
              <label className='form-label fw-bold small'>
                Code <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='connectionTypeCode'
                value={formData.connectionTypeCode}
                onChange={handleChange}
                disabled={isViewMode}
                placeholder='Enter unique type code'
              />
            </div>

            <div className='col-md-4'>
              <label className='form-label fw-bold small'>Icon</label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='icon'
                value={formData.icon}
                onChange={handleChange}
                disabled={isViewMode}
                placeholder='fa-link'
              />
            </div>
          </div>

          <div className='row g-3 mb-4'>
            <div className='col-md-4'>
              <label className='form-label fw-bold small'>
                Category <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                name='connectionCategoryId'
                value={formData.connectionCategoryId}
                onChange={handleSelectChange}
                disabled={isViewMode}
              >
                <option value={0}>Select Category</option>
                {dropdownData.categories.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>

            <div className='col-md-4'>
              <label className='form-label fw-bold small'>
                Provider Type <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                name='providerTypeId'
                value={formData.providerTypeId}
                onChange={handleSelectChange}
                disabled={isViewMode}
              >
                <option value={0}>Select Provider</option>
                {dropdownData.providers.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>

            <div className='col-md-4 d-flex align-items-center'>
              <div className='form-check form-check-custom mt-6'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  name='isSystem'
                  id='isSystem'
                  checked={formData.isSystem}
                  onChange={handleChange}
                  disabled={isViewMode}
                />
                <label className='form-check-label small fw-bold ms-10' htmlFor='isSystem'>
                  Is System
                </label>
              </div>
            </div>
          </div>

          <div className='row g-3'>
            <div className='col-md-12'>
              <label className='form-label fw-bold small'>Description</label>
              <textarea
                className='form-control form-control-sm'
                rows={3}
                name='description'
                value={formData.description}
                onChange={handleChange}
                placeholder='Enter description'
                style={{height: '100px'}}
              />
            </div>
          </div>
        </div>

        {!isViewMode && (
          <div className='card-footer text-end px-5 py-4'>
            <button type='submit' className='btn btn-primary btn-sm' disabled={loading}>
              {loading ? 'Saving...' : 'Save Connection Type'}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default UpdateConnectionType
