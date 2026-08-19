import React, {useEffect, useState} from 'react'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import {fetchLDPTools} from '../../../../../api/Api'
import {
  fetchAlertFieldsUrl,
  fetchGetAlertFieldMappingDetailUrl,
  fetchUpdateAlertFieldMappingUrl,
} from '../../../../../api/AlertFieldsApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {UsersListLoading} from '../components/loading/UsersListLoading'

function UpdateAlertFieldMapping() {
  const {id} = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const viewOnly = Boolean(location.state?.save)
  const userId = Number(sessionStorage.getItem('userId'))
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)
  const [tools, setTools] = useState([])
  const [alertFields, setAlertFields] = useState([])
  const [formData, setFormData] = useState({
    fieldMappingId: Number(id),
    toolId: 0,
    rawFieldId: 0,
    standardFieldId: 0,
    userId,
  })

  const standardFields = alertFields.filter((field) => field.fieldType === 'Standard')
  const rawFields = alertFields.filter(
    (field) => field.fieldType === 'Raw' && Number(field.toolId) === formData.toolId
  )

  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true)
        const [toolData, standardFieldsResponse, detailResponse] = await Promise.all([
          fetchLDPTools(),
          fetchAlertFieldsUrl({searchText: null, fieldTypeId: null, toolId: null}),
          fetchGetAlertFieldMappingDetailUrl({fieldMappingId: Number(id)}),
        ])
        setTools(toolData || [])
        setAlertFields(
          Array.isArray(standardFieldsResponse)
            ? standardFieldsResponse
            : Array.isArray(standardFieldsResponse?.data)
            ? standardFieldsResponse.data
            : []
        )

        const detail = detailResponse?.data
        if (!detail) {
          notifyFail(detailResponse?.message || 'Failed to load alert field mapping details')
          return
        }
        const toolId = detail.toolId || 0
        setFormData({
          fieldMappingId: detail.fieldMappingId ?? detail.id ?? Number(id),
          toolId,
          rawFieldId: detail.rawFieldId || 0,
          standardFieldId: detail.standardFieldId || 0,
          userId,
        })
      } catch (error) {
        console.error('Error loading alert field mapping details:', error)
        notifyFail('Failed to load alert field mapping details')
      } finally {
        setInitialLoading(false)
      }
    }
    loadData()
  }, [id, userId])

  const handleToolChange = (event) => {
    const toolId = Number(event.target.value)
    setFormData((previous) => ({...previous, toolId, rawFieldId: 0}))
  }

  const handleSelectChange = (event) => {
    const {name, value} = event.target
    setFormData((previous) => ({...previous, [name]: Number(value)}))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!formData.toolId || !formData.rawFieldId || !formData.standardFieldId) {
      notifyFail('Please select a tool, raw field, and standard field.')
      return
    }
    try {
      setLoading(true)
      const response = await fetchUpdateAlertFieldMappingUrl(formData)
      if (response?.isSuccess) {
        notify(response.message || 'Alert field mapping updated successfully')
        navigate('/qradar/alert-fields-mapping/list')
      } else {
        notifyFail(response?.message || 'Failed to update alert field mapping')
      }
    } catch (error) {
      console.error('Error updating alert field mapping:', error)
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
          <span className='white'>{viewOnly ? 'View' : 'Update'} Alert Field Mapping</span>
        </h3>
        <div className='card-toolbar'>
          <Link to='/qradar/alert-fields-mapping/list' className='white fs-15 text-underline'>
            <i className='fa fa-chevron-left white mg-right-5' />
            Back
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='card-body px-5 py-5'>
          <div className='row g-3'>
            <div className='col-md-4'>
              <label className='form-label fw-bold small'>
                Tool <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                value={formData.toolId}
                onChange={handleToolChange}
                disabled={viewOnly}
              >
                <option value={0}>Select Tool</option>
                {tools.map((tool) => (
                  <option key={tool.toolId} value={tool.toolId}>
                    {tool.toolName}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-4'>
              <label className='form-label fw-bold small'>
                Raw Field <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                name='rawFieldId'
                value={formData.rawFieldId}
                onChange={handleSelectChange}
                disabled={viewOnly}
              >
                <option value={0}>Select Raw Field</option>
                {rawFields.map((field) => (
                  <option key={field.fieldId ?? field.id} value={field.fieldId ?? field.id}>
                    {field.fieldName}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-4'>
              <label className='form-label fw-bold small'>
                Standard Field <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                name='standardFieldId'
                value={formData.standardFieldId}
                onChange={handleSelectChange}
                disabled={viewOnly}
              >
                <option value={0}>Select Standard Field</option>
                {standardFields.map((field) => (
                  <option key={field.fieldId ?? field.id} value={field.fieldId ?? field.id}>
                    {field.fieldName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {!viewOnly && (
          <div className='card-footer text-end px-5 py-4'>
            <button type='submit' className='btn btn-primary btn-sm' disabled={loading}>
              {loading ? 'Saving...' : 'Update Mapping'}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default UpdateAlertFieldMapping
