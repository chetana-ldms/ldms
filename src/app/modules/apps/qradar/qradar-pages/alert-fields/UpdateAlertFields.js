import React, {useEffect, useState} from 'react'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom'
import {fetchMasterData, fetchLDPTools} from '../../../../../api/Api'
import {
  fetchGetAlertFieldDetailUrl,
  fetchUpdateAlertFieldsUrl,
} from '../../../../../api/AlertFieldsApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import {UsersListLoading} from '../components/loading/UsersListLoading'

function UpdateAlertFields() {
  const {id} = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [viewOnly, setViewOnly] = useState(Boolean(location.state?.save))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolIdSession = Number(sessionStorage.getItem('toolID'))
  const userId = Number(sessionStorage.getItem('userId'))

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)
  const [dropdowns, setDropdowns] = useState({fieldTypes: [], dataTypes: [], tools: []})
  const [formData, setFormData] = useState({
    fieldId: Number(id),
    fieldName: '',
    fieldTypeId: 0,
    toolId: 0,
    dataTypeId: 0,
    modifiedUserid: userId,
  })

  useEffect(() => {
    setViewOnly(Boolean(location.state?.save))
  }, [location.state])

  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true)
        const [fieldTypes, dataTypes, tools, details] = await Promise.all([
          fetchMasterData({maserDataType: 'field_source_type', orgId, toolId: toolIdSession}),
          fetchMasterData({maserDataType: 'global_data_type', orgId, toolId: toolIdSession}),
          fetchLDPTools(),
          fetchGetAlertFieldDetailUrl({fieldId: Number(id)}),
        ])

        setDropdowns({
          fieldTypes: fieldTypes || [],
          dataTypes: dataTypes || [],
          tools: tools || [],
        })

        if (details?.data) {
          const item = details.data
          setFormData({
            fieldId: item.id ?? Number(id),
            fieldName: item.fieldName || '',
            fieldTypeId: item.fieldTypeId || 0,
            toolId: item.toolId || 0,
            dataTypeId: item.dataTypeId || 0,
            modifiedUserid: userId,
          })
        } else {
          notifyFail(details?.message || 'Failed to load alert field details')
        }
      } catch (error) {
        console.error('Error loading alert field details:', error)
        notifyFail('Failed to load alert field details')
      } finally {
        setInitialLoading(false)
      }
    }
    loadData()
  }, [id, orgId, toolIdSession, userId])

  const handleChange = (event) => {
    const {name, value} = event.target
    setFormData((previous) => ({...previous, [name]: value}))
  }

  const handleSelectChange = (event) => {
    const {name, value} = event.target
    setFormData((previous) => ({...previous, [name]: Number(value)}))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (
      !formData.fieldName.trim() ||
      !formData.fieldTypeId ||
      !formData.toolId ||
      !formData.dataTypeId
    ) {
      notifyFail('Please fill all mandatory fields.')
      return
    }

    setLoading(true)
    try {
      const response = await fetchUpdateAlertFieldsUrl(formData)
      if (response?.isSuccess) {
        notify(response.message || 'Alert field updated successfully')
        navigate('/qradar/alert-fields/list')
      } else {
        notifyFail(response?.message || 'Failed to update alert field')
      }
    } catch (error) {
      console.error(error)
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
          <span className='white'>{viewOnly ? 'View' : 'Update'} Alert Field</span>
        </h3>
        <div className='card-toolbar'>
          <Link to='/qradar/alert-fields/list' className='white fs-15 text-underline'>
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
                Field Type <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                name='fieldTypeId'
                value={formData.fieldTypeId}
                onChange={handleSelectChange}
                disabled={viewOnly}
              >
                <option value={0}>Select Field Type</option>
                {dropdowns.fieldTypes.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>

            <div className='col-md-4'>
              <label className='form-label fw-bold small'>
                Tool <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                name='toolId'
                value={formData.toolId}
                onChange={handleSelectChange}
                disabled={viewOnly}
              >
                <option value={0}>Select Tool</option>
                {dropdowns.tools.map((item) => (
                  <option key={item.toolId} value={item.toolId}>
                    {item.toolName}
                  </option>
                ))}
              </select>
            </div>

            <div className='col-md-4'>
              <label className='form-label fw-bold small'>
                Data Type <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                name='dataTypeId'
                value={formData.dataTypeId}
                onChange={handleSelectChange}
                disabled={viewOnly}
              >
                <option value={0}>Select Data Type</option>
                {dropdowns.dataTypes.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='row g-3'>
            <div className='col-md-12'>
              <label className='form-label fw-bold small'>
                Field Name <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='fieldName'
                value={formData.fieldName}
                onChange={handleChange}
                disabled={viewOnly}
              />
            </div>
          </div>
        </div>

        <div className='card-footer text-end px-5 py-4'>
          {!viewOnly && (
            <button type='submit' className='btn btn-primary btn-sm' disabled={loading}>
              {loading ? 'Saving...' : 'Update Alert Field'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default UpdateAlertFields
