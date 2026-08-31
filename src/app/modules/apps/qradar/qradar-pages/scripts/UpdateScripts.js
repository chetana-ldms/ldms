import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {fetchMasterData} from '../../../../../api/Api'
import {fetchScriptGetByIdUrl, fetchScriptUpdateUrl} from '../../../../../api/ScriptsApi'
import {ToastContainer} from 'react-toastify'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {notify, notifyFail} from '../components/notification/Notification'

function UpdateScripts() {
  const navigate = useNavigate()
  const {id} = useParams()

  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolIdSession = Number(sessionStorage.getItem('toolID'))
  const userId = Number(sessionStorage.getItem('userId'))

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const [dropdowns, setDropdowns] = useState({
    scriptTypes: [],
  })

  const [formData, setFormData] = useState({
    scriptId: id,
    scriptName: '',
    scriptTypeId: 0,
    scriptContent: '',
    description: '',
    version: '',
    userId: userId,
  })

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Master Data
        const [types] = await Promise.all([
          fetchMasterData({maserDataType: 'script_type', orgId, toolId: toolIdSession}),
        ])

        setDropdowns({
          scriptTypes: types || [],
        })

        // Load Script Details for pre-population
        const response = await fetchScriptGetByIdUrl({scriptId: Number(id)})
        if (response?.isSuccess && response.script) {
          const script = response.script
          setFormData({
            scriptId: script.scriptId,
            scriptName: script.scriptName || '',
            scriptTypeId: script.scriptTypeId || 0,
            scriptContent: script.scriptContent || '',
            description: script.description || '',
            version: script.version || '',
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

    if (!formData.scriptName.trim()) {
      notifyFail('Script Name is mandatory.')
      return
    }
    if (formData.scriptTypeId === 0) {
      notifyFail('Please select a Type.')
      return
    }
    if (!formData.scriptContent.trim()) {
      notifyFail('Script Content is mandatory.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        scriptId: Number(formData.scriptId),
        userId: formData.userId,
        scriptName: formData.scriptName.trim(),
        scriptTypeId: formData.scriptTypeId,
        scriptContent: formData.scriptContent.trim(),
        description: formData.description.trim(),
        version: formData.version.trim(),
      }

      const response = await fetchScriptUpdateUrl(payload)

      if (response?.isSuccess) {
        notify(response.message || 'Script updated successfully')
        setTimeout(() => {
          navigate('/qradar/scripts/list')
        }, 2000)
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
            <div className='col-md-6'>
              <label className='form-label fw-bold small'>
                Script Name <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='scriptName'
                value={formData.scriptName}
                onChange={handleChange}
                placeholder='Enter script name'
              />
            </div>

            <div className='col-md-6'>
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
            <div className='col-md-6'>
              <label className='form-label fw-bold small'>Version</label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='version'
                value={formData.version}
                onChange={handleChange}
                placeholder='Enter version'
              />
            </div>

            <div className='col-md-6'>
              <label className='form-label fw-bold small'>Description</label>
              <input
                type='text'
                className='form-control form-control-sm'
                name='description'
                value={formData.description}
                onChange={handleChange}
                placeholder='Enter description'
              />
            </div>
          </div>

          {/* SCRIPT CONTENT */}

          <div className='row g-3 mb-4'>
            <div className='col-md-12'>
              <label className='form-label fw-bold small'>
                Script Content <span className='text-danger'>*</span>
              </label>
              <textarea
                className='form-control form-control-sm'
                rows={8}
                name='scriptContent'
                value={formData.scriptContent}
                onChange={handleChange}
                placeholder='Enter your script content here'
              />
            </div>
          </div>

          {/* BUTTONS */}

          <div className='row mt-5'>
            <div className='col-md-12 text-end'>
              <button type='submit' className='btn btn-primary' disabled={loading}>
                {loading ? 'Saving...' : 'Update Script'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default UpdateScripts