import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams, useLocation} from 'react-router-dom'
import {fetchMasterData, fetchLDPTools} from '../../../../../api/Api'
import {fetchUpdateAlertFieldsUrl, fetchAlertFieldDetailsUrl} from '../../../../../api/AlertFieldsApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import {UsersListLoading} from '../components/loading/UsersListLoading'

function UpdateAlertFields() {
  const {id} = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [save, setSave] = useState(location.state?.save || '')

  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolIdSession = Number(sessionStorage.getItem('toolID'))
  const userId = Number(sessionStorage.getItem('userId'))

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)
  const [dropdowns, setDropdowns] = useState({
    categories: [],
    sourceTypes: [],
    dataTypes: [],
    tools: [],
  })

  const [formData, setFormData] = useState({
    fieldId: Number(id),
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
    setSave(location.state?.save || '')
  }, [location.state])

  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true)
        const [categories, sourceTypes, dataTypes, tools, details] = await Promise.all([
          fetchMasterData({maserDataType: 'field_category', orgId, toolId: toolIdSession}),
          fetchMasterData({maserDataType: 'field_source_type', orgId, toolId: toolIdSession}),
          fetchMasterData({maserDataType: 'global_data_type', orgId, toolId: toolIdSession}),
          fetchLDPTools(),
          fetchAlertFieldDetailsUrl(id),
        ])

        setDropdowns({
          categories: categories || [],
          sourceTypes: sourceTypes || [],
          dataTypes: dataTypes || [],
          tools: tools || [],
        })

        if (details?.data && details.data.length > 0) {
          const item = details.data[0]
          setFormData({
            fieldId: item.fieldId,
            fieldCode: item.fieldCode || '',
            fieldName: item.fieldName || '',
            displayName: item.displayName || '',
            fieldCategoryId: item.fieldCategoryId || 0,
            fieldSourceTypeId: item.fieldSourceTypeId || 0,
            dataTypeId: item.dataTypeId || 0,
            toolId: item.toolId || 0,
            jsonPath: item.jsonPath || '',
            isSearchable: item.isSearchable || 0,
            isFilterable: item.isFilterable || 0,
            isRequired: item.isRequired || 0,
            isSystem: item.isSystem || 0,
            defaultValue: item.defaultValue || '',
            remarks: item.remarks || '',
            userId: userId,
          })
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setInitialLoading(false)
      }
    }
    loadData()
  }, [id, orgId, toolIdSession, userId])

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
      formData.fieldCategoryId === 0 ||
      formData.fieldSourceTypeId === 0 ||
      formData.dataTypeId === 0 ||
      (dropdowns.sourceTypes.find(i => i.dataID === formData.fieldSourceTypeId)?.dataValue === 'Raw' && formData.toolId === 0)
    ) {
      notifyFail('Please fill all mandatory fields: Name, Code, Display Name, and Tool.')
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
          <span className='white'>{save ? 'View' : 'Update'} Alert Field</span>
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
              <label className='form-label fw-bold small'>Field Name</label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='fieldName'
                value={formData.fieldName}
                onChange={handleChange}
                disabled={!!save}
              />
            </div>
            <div className='col-md-4'>
              <label className='form-label fw-bold small'>Field Code</label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='fieldCode'
                value={formData.fieldCode}
                onChange={handleChange}
                disabled={!!save}
              />
            </div>
            <div className='col-md-4'>
              <label className='form-label fw-bold small'>Display Name</label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='displayName'
                value={formData.displayName}
                onChange={handleChange}
                disabled={!!save}
              />
            </div>
          </div>

          <div className='row g-3 mb-4'>
            <div className='col-md-4'>
              <label className='form-label fw-bold small'>
                Field Category <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                name='fieldCategoryId'
                value={formData.fieldCategoryId}
                onChange={handleSelectChange}
                disabled={!!save}
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
              <label className='form-label fw-bold small'>
                Field Source Type <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                name='fieldSourceTypeId'
                value={formData.fieldSourceTypeId}
                onChange={handleSelectChange}
                disabled={!!save}
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
              <label className='form-label fw-bold small'>
                Data Type <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                name='dataTypeId'
                value={formData.dataTypeId}
                onChange={handleSelectChange}
                disabled={!!save}
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
            {dropdowns.sourceTypes.find((i) => i.dataID === formData.fieldSourceTypeId)?.dataValue ===
              'Raw' && (
              <div className='col-md-4'>
                <label className='form-label fw-bold small'>
                  Tool <span className='text-danger'>*</span>
                </label>
                <select
                  className='form-select form-select-sm'
                  name='toolId'
                  value={formData.toolId}
                  onChange={handleSelectChange}
                  disabled={!!save}
                >
                  <option value={0}>Select Tool</option>
                  {dropdowns.tools.map((item) => (
                    <option key={item.toolId} value={item.toolId}>
                      {item.toolName}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className='col-md-8'>
              <label className='form-label fw-bold small'>JSON Path</label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='jsonPath'
                value={formData.jsonPath}
                onChange={handleChange}
                disabled={!!save}
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
                disabled={!!save}
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
                  disabled={!!save}
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
                  disabled={!!save}
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
                  disabled={!!save}
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
                  disabled={!!save}
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
                disabled={!!save}
              />
            </div>
          </div>
        </div>

        <div className='card-footer text-end px-5 py-4'>
          <button
            type='submit'
            className='btn btn-primary btn-sm'
            disabled={loading || !!save}
            style={{display: save ? 'none' : 'inline-block'}}
          >
            {loading ? 'Saving...' : 'Update Alert Field'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateAlertFields