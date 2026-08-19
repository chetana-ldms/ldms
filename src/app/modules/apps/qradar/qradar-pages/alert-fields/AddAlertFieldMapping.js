import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import {fetchLDPTools} from '../../../../../api/Api'
import {
  fetchAlertFieldsUrl,
  fetchCreateAlertFieldMappingUrl,
} from '../../../../../api/AlertFieldsApi'
import {notify, notifyFail} from '../components/notification/Notification'

function AddAlertFieldMapping() {
  const navigate = useNavigate()
  const userId = Number(sessionStorage.getItem('userId'))
  const [loading, setLoading] = useState(false)
  const [tools, setTools] = useState([])
  const [alertFields, setAlertFields] = useState([])
  const [formData, setFormData] = useState({toolId: 0, rawFieldId: 0, standardFieldId: 0, userId})

  const standardFields = alertFields.filter((field) => field.fieldType === 'Standard')
  const rawFields = alertFields.filter(
    (field) => field.fieldType === 'Raw' && Number(field.toolId) === formData.toolId
  )

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [toolData, fieldsResponse] = await Promise.all([
          fetchLDPTools(),
          fetchAlertFieldsUrl({searchText: null, fieldTypeId: null, toolId: null}),
        ])
        setTools(toolData || [])
        setAlertFields(
          Array.isArray(fieldsResponse)
            ? fieldsResponse
            : Array.isArray(fieldsResponse?.data)
            ? fieldsResponse.data
            : []
        )
      } catch (error) {
        console.error('Error loading mapping form data:', error)
      }
    }
    loadInitialData()
  }, [])

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
      const response = await fetchCreateAlertFieldMappingUrl(formData)
      if (response?.isSuccess) {
        notify(response.message || 'Alert field mapping created successfully')
        navigate('/qradar/alert-fields-mapping/list')
      } else {
        notifyFail(response?.message || 'Failed to create alert field mapping')
      }
    } catch (error) {
      console.error('Error creating alert field mapping:', error)
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
          <span className='white'>Add Alert Field Mapping</span>
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
        <div className='card-footer text-end px-5 py-4'>
          <button type='submit' className='btn btn-primary btn-sm' disabled={loading}>
            {loading ? 'Saving...' : 'Save Mapping'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddAlertFieldMapping
