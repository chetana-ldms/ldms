import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {fetchMasterData} from '../../../../../api/Api'
import {fetchScriptSearchUrl, fetchScriptAddUrl, fetchScriptUpdateUrl} from '../../../../../api/ScriptsApi' // Assuming update uses a similar endpoint or fetchScriptUpdateUrl
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import {UsersListLoading} from '../components/loading/UsersListLoading'

// Utility to generate unique keys for list items
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`

const cs = {
  border: '1px solid #d1d5db',
  padding: '4px 6px',
  verticalAlign: 'middle',
  fontSize: 12,
}

const hs = {
  ...cs,
  background: '#dbeafe',
  fontWeight: 700,
  textAlign: 'center',
  whiteSpace: 'nowrap',
  color: '#1e40af',
}

const EMPTY_PARAMETER = () => ({
  tempKey: uid(),
  parameterName: '',
  parameterCode: '',
  parameterTypeId: 0,
  isRequired: false,
  defaultValue: '', // Default value can be an empty string
  validationRules: '{}', // Initialize as empty JSON object string
  displayOrder: 0,
})

function UpdateScripts() {
  const navigate = useNavigate()
  const {id} = useParams()

  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolIdSession = Number(sessionStorage.getItem('toolID'))
  const userId = Number(sessionStorage.getItem('userId'))

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const [dropdowns, setDropdowns] = useState({
    scriptCategories: [],
    scriptTypes: [],
    executionTypes: [],
    operatingSystems: [],
    parameterTypes: [],
  })

  const [formData, setFormData] = useState({
    scriptId: id,
    scriptName: '',
    scriptCategoryId: 0,
    scriptTypeId: 0,
    executionTypeId: 0,
    operatingSystemId: 0,
    scriptContent: '',
    outputSchema: '',
    timeoutSeconds: 0,
    isSecure: false,
    parameters: [],
    userId: userId,
  })

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Master Data
        const [categories, types, execTypes, os, paramTypes] = await Promise.all([
          fetchMasterData({maserDataType: 'script_category', orgId, toolId: toolIdSession}),
          fetchMasterData({maserDataType: 'script_type', orgId, toolId: toolIdSession}),
          fetchMasterData({maserDataType: 'executor_type', orgId, toolId: toolIdSession}),
          fetchMasterData({maserDataType: 'operating_system', orgId, toolId: toolIdSession}),
          fetchMasterData({maserDataType: 'global_data_type', orgId, toolId: toolIdSession}),
        ])

        setDropdowns({
          scriptCategories: categories || [],
          scriptTypes: types || [],
          executionTypes: execTypes || [],
          operatingSystems: os || [],
          parameterTypes: paramTypes || [],
        })

        // Load Script Details for pre-population
        const response = await fetchScriptSearchUrl({scriptId: Number(id)})
        if (response?.isSuccess && response.data?.length > 0) {
          const script = response.data[0]
          setFormData({
            scriptId: script.scriptId,
            scriptName: script.scriptName || '',
            scriptCategoryId: script.scriptCategoryId || 0,
            scriptTypeId: script.scriptTypeId || 0,
            executionTypeId: script.executionTypeId || 0,
            operatingSystemId: script.operatingSystemId || 0,
            scriptContent: script.scriptContent || '',
            // Ensure outputSchema is always a valid JSON string, even if empty
            outputSchema: script.outputSchema || '{}',
            timeoutSeconds: script.timeoutSeconds || 0,
            isSecure: !!script.isSecure,
            parameters: (script.parameters || []).map((p) => ({
              ...p,
              // Ensure validationRules is always a valid JSON string, even if empty
              validationRules: p.validationRules || '{}',
              tempKey: uid(), // Assign tempKey for UI management
            })),
            userId: userId,
          })
        } else {
          notifyFail('Failed to fetch script details.')
        }
      } catch (error) {
        console.error(error)
        notifyFail('An error occurred while loading data.')
      } finally {
        setInitialLoading(false)
      }
    }

    loadData()
  }, [id, orgId, toolIdSession, userId])

  // =========================
  // INPUT CHANGE
  // =========================

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

  // =========================
  // PARAMETERS
  // =========================

  const addParameter = () => {
    setFormData((prev) => ({
      ...prev,
      parameters: [...prev.parameters, EMPTY_PARAMETER()],
    }))
  }

  const removeParameter = (tempKey) => {
    setFormData((prev) => ({
      ...prev,
      parameters: prev.parameters.filter((param) => param.tempKey !== tempKey),
    }))
  }

  const handleParameterChange = (tempKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param) =>
        param.tempKey === tempKey ? {...param, [field]: value} : param
      ),
    }))
  }

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('draggedIndex', index)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, targetIndex) => {
    const draggedIndex = e.dataTransfer.getData('draggedIndex')
    const newParameters = [...formData.parameters]
    const [draggedItem] = newParameters.splice(draggedIndex, 1)
    newParameters.splice(targetIndex, 0, draggedItem)
    setFormData((prev) => ({...prev, parameters: newParameters}))
  }

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !formData.scriptName ||
      formData.scriptCategoryId === 0 ||
      formData.scriptTypeId === 0 ||
      formData.executionTypeId === 0 ||
      formData.operatingSystemId === 0 ||
      !formData.scriptContent
    ) {
      notifyFail('Please fill all mandatory script details.')
      return
    }

    for (const param of formData.parameters) {
      if (
        !param.parameterName ||
        !param.parameterCode ||
        param.parameterTypeId === 0
      ) {
        notifyFail('Please fill all mandatory fields for each parameter.')
        return
      }
    }

    try {
      // Only parse if outputSchema is not empty or just whitespace
      if (formData.outputSchema && formData.outputSchema.trim() !== '') {
        JSON.parse(formData.outputSchema)
      }
      for (const param of formData.parameters) {
        // Only parse if validationRules is not empty or just whitespace
        if (param.validationRules && param.validationRules.trim() !== '') {
          JSON.parse(param.validationRules)
        }
      }
    } catch (error) {
      notifyFail('Please enter valid JSON for Output Schema or Validation Rules.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...formData,
        outputSchema: formData.outputSchema && formData.outputSchema.trim() !== ''
          ? JSON.stringify(JSON.parse(formData.outputSchema))
          : '{}',
        timeoutSeconds: Number(formData.timeoutSeconds),
        parameters: formData.parameters.map(({tempKey, ...rest}, index) => ({
          ...rest,
          validationRules: rest.validationRules
            ? JSON.stringify(JSON.parse(rest.validationRules))
            : '{}', // Send as empty JSON object if no rules are provided
          parameterTypeId: Number(rest.parameterTypeId),
          displayOrder: index + 1,
          isRequired: Boolean(rest.isRequired),
        })),
        isSecure: Boolean(formData.isSecure),
      }

      // Using fetchScriptAddUrl here as a placeholder for an Update API if it follows the same pattern
      const response = await fetchScriptUpdateUrl(payload)

      if (response?.isSuccess) {
        notify(response.message || 'Script updated successfully')
        navigate('/qradar/scripts/list')
      } else {
        notifyFail(response?.message || 'Failed to update script')
      }
    } catch (error) {
      console.error(error)
      notifyFail('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <UsersListLoading />
  }

  return (
    <div className='card config'>
      <ToastContainer />
      <div className='card-header bg-heading'>
        <h3 className='card-title'>
          <span className='white'>Update Script</span>
        </h3>
        <div className='card-toolbar'>
          <Link to='/qradar/scripts/list' className='white fs-15 text-underline'>
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
                Script Name <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='scriptName'
                value={formData.scriptName}
                onChange={handleChange}
              />
            </div>

            <div className='col-md-4'>
              <label className='form-label fw-bold small'>
                Category <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                name='scriptCategoryId'
                value={formData.scriptCategoryId}
                onChange={handleSelectChange}
              >
                <option value={0}>Select Category</option>
                {dropdowns.scriptCategories.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>

            <div className='col-md-4'>
              <label className='form-label fw-bold small'>
                Type <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                name='scriptTypeId'
                value={formData.scriptTypeId}
                onChange={handleSelectChange}
              >
                <option value={0}>Select Type</option>
                {dropdowns.scriptTypes.map((item) => (
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
                Execution Type <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                name='executionTypeId'
                value={formData.executionTypeId}
                onChange={handleSelectChange}
              >
                <option value={0}>Select Execution Type</option>
                {dropdowns.executionTypes.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>

            <div className='col-md-4'>
              <label className='form-label fw-bold small'>
                Operating System <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                name='operatingSystemId'
                value={formData.operatingSystemId}
                onChange={handleSelectChange}
              >
                <option value={0}>Select OS</option>
                {dropdowns.operatingSystems.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>

            <div className='col-md-4'>
              <label className='form-label fw-bold small'>Timeout (Seconds)</label>
              <input
                type='number'
                className='form-control form-control-sm'
                name='timeoutSeconds'
                value={formData.timeoutSeconds}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='row g-3 mb-4'>
            <div className='col-md-12'>
              <label className='form-label fw-bold small'>
                Script Content <span className='text-danger'>*</span>
              </label>
              <textarea
                className='form-control form-control-sm'
                rows={5}
                name='scriptContent'
                value={formData.scriptContent}
                onChange={handleChange}
                style={{height: '50px'}}
              />
            </div>
          </div>

          <div className='row g-3 mb-4'>
            <div className='col-md-10'>
              <label className='form-label fw-bold small'>Output Schema (JSON)</label>
              <textarea
                className='form-control form-control-sm'
                rows={3}
                name='outputSchema'
                value={formData.outputSchema}
                onChange={handleChange}
                style={{height: '50px'}}
              />
            </div>
            <div className='col-md-2 d-flex align-items-center'>
              <div className='form-check form-check-custom form-check-solid'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  name='isSecure'
                  id='isSecure'
                  checked={formData.isSecure}
                  onChange={handleChange}
                />
                <label className='form-check-label small fw-bold ms-9' htmlFor='isSecure'>
                  Is Secure
                </label>
              </div>
            </div>
          </div>

          <div className='d-flex justify-content-between align-items-center mt-10 mb-5'>
            <h4 className='mb-0'>Parameters</h4>
            <button type='button' className='btn btn-sm btn-primary' onClick={addParameter}>
              <i className='fa fa-plus me-2'></i>
              Add Parameter
            </button>
          </div>

          {formData.parameters.length === 0 && (
            <div className='alert alert-info text-center'>No parameters added yet.</div>
          )}

          {formData.parameters.length > 0 && (
            <div className='table-responsive'>
              <table style={{borderCollapse: 'collapse', width: '100%'}}>
                <thead>
                  <tr>
                    <th style={hs}>Name <span className='text-danger'>*</span></th>
                    <th style={hs}>Code <span className='text-danger'>*</span></th>
                    <th style={hs}>Type <span className='text-danger'>*</span></th>
                    <th style={hs}>Default</th>
                    <th style={hs}>Validation Rule</th>
                    <th style={hs}>Required</th>
                    <th style={hs}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.parameters.map((param, index) => (
                    <tr
                      key={param.tempKey}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      style={{cursor: 'move'}}
                    >
                      <td style={cs}>
                        <input
                          type='text'
                          className='form-control form-control-sm'
                          value={param.parameterName}
                          onChange={(e) =>
                            handleParameterChange(param.tempKey, 'parameterName', e.target.value)
                          }
                        />
                      </td>
                      <td style={cs}>
                        <input
                          type='text'
                          className='form-control form-control-sm'
                          value={param.parameterCode}
                          onChange={(e) =>
                            handleParameterChange(param.tempKey, 'parameterCode', e.target.value)
                          }
                        />
                      </td>
                      <td style={cs}>
                        <select
                          className='form-select form-select-sm'
                          value={param.parameterTypeId}
                          onChange={(e) =>
                            handleParameterChange(
                              param.tempKey,
                              'parameterTypeId',
                              Number(e.target.value)
                            )
                          }
                        >
                          <option value={0}>Select</option>
                          {dropdowns.parameterTypes.map((item) => (
                            <option key={item.dataID} value={item.dataID}>
                              {item.dataValue}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={cs}>
                        <input
                          type='text'
                          className='form-control form-control-sm'
                          value={param.defaultValue}
                          onChange={(e) =>
                            handleParameterChange(param.tempKey, 'defaultValue', e.target.value)
                          }
                        />
                      </td>
                      <td style={cs}>
                        <input
                          type='text'
                          className='form-control form-control-sm'
                          value={param.validationRules}
                          onChange={(e) =>
                            handleParameterChange(param.tempKey, 'validationRules', e.target.value)
                          }
                        />
                      </td>
                      <td style={{...cs, textAlign: 'center'}}>
                        <input
                          type='checkbox'
                          checked={param.isRequired}
                          onChange={(e) =>
                            handleParameterChange(param.tempKey, 'isRequired', e.target.checked)
                          }
                        />
                      </td>
                      <td style={{...cs, textAlign: 'center'}}>
                        <button
                          type='button'
                          className='btn btn-sm btn-light-danger'
                          onClick={() => removeParameter(param.tempKey)}
                        >
                          <i className='fa fa-times'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className='card-footer text-end px-5 py-4'>
          <button type='submit' className='btn btn-primary btn-sm' disabled={loading}>
            {loading ? 'Updating...' : 'Update Script'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateScripts