import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {fetchMasterData, fetchLDPTools} from '../../../../../api/Api'
import {fetchAddAlertFieldsUrl} from '../../../../../api/AlertFieldsApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'

function AddAlertFields() {
  const navigate = useNavigate()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolIdSession = Number(sessionStorage.getItem('toolID'))
  const userId = Number(sessionStorage.getItem('userId'))

  const [loading, setLoading] = useState(false)
  const [dropdowns, setDropdowns] = useState({
    fieldTypes: [],
    dataTypes: [],
    tools: [],
  })
  const [formData, setFormData] = useState({
    fieldTypeId: 0,
    toolId: 0,
    fieldName: '',
    dataTypeId: 0,
    active: true,
    userId,
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fieldTypes, dataTypes, tools] = await Promise.all([
          fetchMasterData({maserDataType: 'field_source_type', orgId, toolId: toolIdSession}),
          fetchMasterData({maserDataType: 'global_data_type', orgId, toolId: toolIdSession}),
          fetchLDPTools(),
        ])
        setDropdowns({
          fieldTypes: fieldTypes || [],
          dataTypes: dataTypes || [],
          tools: tools || [],
        })
      } catch (error) {
        console.error('Error loading master data:', error)
      }
    }
    loadData()
  }, [orgId, toolIdSession])

  const handleChange = (event) => {
    const {name, value, type, checked} = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
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
      const response = await fetchAddAlertFieldsUrl(formData)
      if (response?.isSuccess) {
        notify(response.message || 'Alert field added successfully')
        navigate('/qradar/alert-fields/list')
      } else {
        notifyFail(response?.message || 'Failed to add alert field')
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
      <div className='card-header bg-heading'>
        <h3 className='card-title'>
          <span className='white'>Add New Alert Field</span>
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
                placeholder='Ex: SourceIP'
              />
            </div>
          </div>
        </div>

        <div className='card-footer text-end px-5 py-4'>
          <button type='submit' className='btn btn-primary btn-sm' disabled={loading}>
            {loading ? 'Saving...' : 'Save Alert Field'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddAlertFields
