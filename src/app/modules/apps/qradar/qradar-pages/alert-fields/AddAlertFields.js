import React, {useState, useEffect} from 'react'
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
    categories: [],
    sourceTypes: [],
    dataTypes: [],
    tools: [],
  })

  const [formData, setFormData] = useState({
    fieldCode: '',
    fieldName: '',
    displayName: '',
    fieldCategoryId: 0,
    fieldSourceTypeId: 0,
    dataTypeId: 0,
    toolId: 0,
    jsonPath: '',
    isSearchable: 0,
    isFilterable: 0,
    isRequired: 0,
    isSystem: 0,
    defaultValue: '',
    remarks: '',
    userId: userId,
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categories, sourceTypes, dataTypes, tools] = await Promise.all([
          fetchMasterData({maserDataType: 'field_category', orgId, toolId: toolIdSession}),
          fetchMasterData({maserDataType: 'field_source_type', orgId, toolId: toolIdSession}),
          fetchMasterData({maserDataType: 'global_data_type', orgId, toolId: toolIdSession}),
          fetchLDPTools(),
        ])
        setDropdowns({
          categories: categories || [],
          sourceTypes: sourceTypes || [],
          dataTypes: dataTypes || [],
          tools: tools || [],
        })
      } catch (error) {
        console.error('Error loading master data:', error)
      }
    }
    loadData()
  }, [orgId, toolIdSession])

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

    if (
      !formData.fieldCode ||
      !formData.fieldName ||
      !formData.displayName ||
      formData.toolId === 0
    ) {
      notifyFail('Please fill all mandatory fields: Name, Code, Display Name, and Tool.')
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
            <div className='col-md-4'>
              <label className='form-label fw-bold small'>
                Field Code <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='fieldCode'
                value={formData.fieldCode}
                onChange={handleChange}
                placeholder='Ex: source_ip'
              />
            </div>
            <div className='col-md-4'>
              <label className='form-label fw-bold small'>
                Display Name <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='displayName'
                value={formData.displayName}
                onChange={handleChange}
                placeholder='Ex: Source IP Address'
              />
            </div>
          </div>

          <div className='row g-3 mb-4'>
            <div className='col-md-4'>
              <label className='form-label fw-bold small'>Field Category</label>
              <select
                className='form-select form-select-sm'
                name='fieldCategoryId'
                value={formData.fieldCategoryId}
                onChange={handleSelectChange}
              >
                <option value={0}>Select Category</option>
                {dropdowns.categories.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-4'>
              <label className='form-label fw-bold small'>Field Source Type</label>
              <select
                className='form-select form-select-sm'
                name='fieldSourceTypeId'
                value={formData.fieldSourceTypeId}
                onChange={handleSelectChange}
              >
                <option value={0}>Select Source Type</option>
                {dropdowns.sourceTypes.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-4'>
              <label className='form-label fw-bold small'>Data Type</label>
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

          <div className='row g-3 mb-4'>
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
            <div className='col-md-8'>
              <label className='form-label fw-bold small'>JSON Path</label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='jsonPath'
                value={formData.jsonPath}
                onChange={handleChange}
                placeholder='Ex: $.network.source.ip'
              />
            </div>
          </div>

          <div className='row g-3 mb-4'>
            <div className='col-md-4'>
              <label className='form-label fw-bold small'>Default Value</label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='defaultValue'
                value={formData.defaultValue || ''}
                onChange={handleChange}
              />
            </div>
            <div className='col-md-8 d-flex align-items-center gap-4 mt-5'>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  name='isSearchable'
                  id='isSearchable'
                  checked={formData.isSearchable === 1}
                  onChange={handleChange}
                />
                <label className='form-check-label small fw-bold' htmlFor='isSearchable'>
                  Searchable
                </label>
              </div>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  name='isFilterable'
                  id='isFilterable'
                  checked={formData.isFilterable === 1}
                  onChange={handleChange}
                />
                <label className='form-check-label small fw-bold' htmlFor='isFilterable'>
                  Filterable
                </label>
              </div>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  name='isRequired'
                  id='isRequired'
                  checked={formData.isRequired === 1}
                  onChange={handleChange}
                />
                <label className='form-check-label small fw-bold' htmlFor='isRequired'>
                  Required
                </label>
              </div>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  name='isSystem'
                  id='isSystem'
                  checked={formData.isSystem === 1}
                  onChange={handleChange}
                />
                <label className='form-check-label small fw-bold' htmlFor='isSystem'>
                  System Field
                </label>
              </div>
            </div>
          </div>

          <div className='row g-3'>
            <div className='col-md-12'>
              <label className='form-label fw-bold small'>Remarks</label>
              <textarea
                className='form-control form-control-sm'
                name='remarks'
                rows={3}
                value={formData.remarks}
                onChange={handleChange}
                placeholder='Enter any additional information...'
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