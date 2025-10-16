import React, {useState, useRef, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useErrorBoundary} from 'react-error-boundary'
import {ToastContainer} from 'react-toastify'
import {notify, notifyFail} from '../notification/Notification'
import {fetchMessageTemplateUrl} from '../../../../../../api/MessageTemplateApi'
import {
  fetchTemplatesGroupsUrl,
  fetchTemplatesTemplateTypesUrl,
} from '../../../../../../api/IncidentsApi'
import Select from 'react-select'
import PlaceholdersModal from './PlaceholdersModal'

const AddPlaceholderGroups = () => {
  const {showBoundary} = useErrorBoundary()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const orgId = Number(sessionStorage.getItem('orgId'))

  const [selectedType, setSelectedType] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [types, setTypes] = useState([])
  const [groups, setGroups] = useState([])

  const [showModal, setShowModal] = useState(false)
  const [selectedPlaceholders, setSelectedPlaceholders] = useState([]) // array of objects
  const contentRef = useRef()
  const titleRef = useRef()

  useEffect(() => {
    loadDropdownData()
  }, [])

  const loadDropdownData = async () => {
    try {
      const [typesRes, groupsRes] = await Promise.all([
        fetchTemplatesTemplateTypesUrl(),
        fetchTemplatesGroupsUrl(),
      ])
      setTypes(Array.isArray(typesRes?.data) ? typesRes.data : [])
      setGroups(Array.isArray(groupsRes?.data) ? groupsRes.data : [])
    } catch (err) {
      console.error('Failed to load dropdown data', err)
      notifyFail('Failed to load dropdown data')
    }
  }

  const handleSelectPlaceholders = (placeholders) => {
    setSelectedPlaceholders((prev) => [...prev, ...placeholders])
    setShowModal(false)
  }
  const removePlaceholder = (index) => {
    setSelectedPlaceholders((prev) => prev.filter((_, i) => i !== index))
  }
  useEffect(() => {
    const textarea = contentRef.current
    if (!textarea) return
    const placeholdersText = selectedPlaceholders.map((p) => p.placeholderData).join(' ')
    textarea.value = placeholdersText
  }, [selectedPlaceholders])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const titleValue = titleRef.current?.value?.trim()
    const contentValue = contentRef.current?.value?.trim()

    if (!titleValue) {
      notifyFail('Enter Template Title')
      setLoading(false)
      return
    }

    if (!contentValue) {
      notifyFail('Enter Template Content')
      setLoading(false)
      return
    }

    const createdUserId = Number(sessionStorage.getItem('userId'))
    const createdDate = new Date().toISOString()

    const data = {
      orgId,
      templateTypeId: selectedType?.masterId || 0,
      groupId: selectedGroup?.masterId || 0,
      title: titleValue,
      content: contentValue,
      placeholderIds: selectedPlaceholders.map((p) => p.placeholderId), // only remaining placeholders
      createdUserId,
      createdDate,
    }

    try {
      const response = await fetchMessageTemplateUrl(data)
      if (response?.isSuccess) {
        notify(response.message || 'Template created successfully!')
        setTimeout(() => navigate('/qradar/templates/list'), 2000)
      } else {
        notifyFail(response?.message || 'Failed to create template')
      }
    } catch (error) {
      showBoundary(error)
    } finally {
      setLoading(false)
    }
  }

  const typeOptions = types.map((t) => ({
    label: t.displayName,
    value: t.templateTypeId,
    masterId: t.masterId,
  }))

  const groupOptions = groups.map((g) => ({
    label: g.displayName,
    value: g.templateGroupId,
    masterId: g.masterId,
  }))

  const customSelectStyle = {
    control: (provided) => ({
      ...provided,
      minHeight: '36px',
      fontSize: '0.9rem',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  }

  return (
    <div className='config card'>
      <ToastContainer />
      <div className='card-header bg-heading d-flex justify-content-between align-items-center'>
        <h3 className='card-title white mb-1'>Add New Templates</h3>
        <Link to='/qradar/templates/list' className='white fs-15 text-underline'>
          <i className='fa fa-chevron-left white me-2' /> Back
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='card-body p-4'>
          <div className='row'>
            <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>Template Type</label>
              <Select
                options={typeOptions}
                value={selectedType}
                onChange={setSelectedType}
                isClearable
                placeholder='Select Type'
                styles={customSelectStyle}
              />
            </div>
            <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>Template Group</label>
              <Select
                options={groupOptions}
                value={selectedGroup}
                onChange={setSelectedGroup}
                isClearable
                placeholder='Select Group'
                styles={customSelectStyle}
              />
            </div>
            <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>Template Title</label>
              <input
                type='text'
                className='form-control form-control-solid'
                maxLength={200}
                placeholder='Enter template title'
                ref={titleRef}
              />
            </div>
          </div>

          <div className='row'>
            <div className='col-md-12 mb-3 position-relative'>
              <label className='form-label fw-bold'>Template Content</label>
              <textarea
                className='form-control form-control-solid pe-5'
                rows={6}
                maxLength={2000}
                placeholder='Enter template content'
                ref={contentRef}
                style={{minHeight: '160px', resize: 'vertical'}}
              />
              <i
                className='fa fa-plus-circle text-success position-absolute'
                style={{bottom: '12px', right: '15px', cursor: 'pointer', fontSize: '18px'}}
                title='Add Placeholder'
                onClick={() => setShowModal(true)}
              ></i>
            </div>
          </div>

          {/* Show selected placeholders below textarea with remove button */}
          {selectedPlaceholders.length > 0 && (
            <div className='mb-3'>
              <label className='form-label fw-bold'>Selected Placeholders</label>
              <div className='d-flex flex-wrap gap-2'>
                {selectedPlaceholders.map((ph, index) => (
                  <span
                    key={index}
                    className='badge bg-primary rounded-pill d-flex align-items-center'
                  >
                    {ph.placeholderText}
                    <i
                      className='fa fa-times ms-2'
                      style={{cursor: 'pointer'}}
                      onClick={() => removePlaceholder(index)}
                    ></i>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className='card-footer d-flex justify-content-end p-3'>
          <button type='submit' className='btn btn-new btn-small' disabled={loading}>
            {!loading && 'Save Changes'}
            {loading && (
              <span className='indicator-progress'>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
      </form>

      <PlaceholdersModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSelect={handleSelectPlaceholders}
      />
    </div>
  )
}

export {AddPlaceholderGroups}
