import React, {useState, useEffect, useRef} from 'react'
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
import RichTextEditor from '../../../../../../../utils/RichTextEditor'
import {processHtmlWithInlineImages} from '../../incidents/processHtmlWithInlineImages'

const AddTemplates = () => {
  const {showBoundary} = useErrorBoundary()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState([])
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const [selectedType, setSelectedType] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [types, setTypes] = useState([])
  const [groups, setGroups] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedPlaceholders, setSelectedPlaceholders] = useState([])
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
    setSelectedPlaceholders((prev) => {
      const newPlaceholders = [...prev, ...placeholders]
      const placeholdersText = placeholders.map((p) => p.placeholderData).join(' ')
      setMessage((msg) => (msg ? msg + ' ' + placeholdersText : placeholdersText))
      return newPlaceholders
    })
    setShowModal(false)
  }

  const removePlaceholder = (index) => {
    const removedPlaceholder = selectedPlaceholders[index]
    setSelectedPlaceholders((prev) => prev.filter((_, i) => i !== index))
    setMessage((prev) =>
      prev.replace(new RegExp(removedPlaceholder.placeholderData, 'g'), '').trim()
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const titleValue = titleRef.current?.value?.trim()
    const {cleanedHtml, attachments: inlineAttachments} = processHtmlWithInlineImages(message)
    if (!selectedType) {
      notifyFail('Select Type')
      setLoading(false)
      return
    }

    if (!selectedGroup) {
      notifyFail('Select Group')
      setLoading(false)
      return
    }

    if (!titleValue) {
      notifyFail('Enter Template Title')
      setLoading(false)
      return
    }

    if (!message?.trim()) {
      notifyFail('Enter Template Content')
      setLoading(false)
      return
    }

    const createdUserId = Number(sessionStorage.getItem('userId'))
    const createdDate = new Date().toISOString()
    const data = {
      OrgId: orgId,
      ToolId: 2,
      TemplateTypeId: selectedType.masterId,
      GroupId: selectedGroup.masterId,
      Title: titleValue,
      Content: cleanedHtml, // ✅ use CID replaced html
      PlaceholderIds: selectedPlaceholders.map((p) => p.placeholderId),
      CreatedUserId: createdUserId,
      CreatedDate: createdDate,
      SignatureContent: 'test',
      attachments: [
        ...attachments.map((f) => ({file: f})),
        ...inlineAttachments, // ✅ cid objects from helper
      ],
    }

    try {
      const response = await fetchMessageTemplateUrl(data)
      if (response?.isSuccess) {
        notify('Template created successfully!')
        setTimeout(() => navigate('/qradar/templates/list'), 2000)
      } else {
        notifyFail('Failed to create template')
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
              <label className='form-label fw-bold'>
                Type <sup className='red'>*</sup>
              </label>
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
              <label className='form-label fw-bold'>
                Group <sup className='red'>*</sup>
              </label>
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
              <label className='form-label fw-bold'>
                Title <sup className='red'>*</sup>
              </label>
              <input
                type='text'
                className='form-control'
                maxLength={255}
                placeholder='Enter template title'
                ref={titleRef}
              />
            </div>
          </div>

          <div className='row'>
            <div className='col-md-12 mb-3 position-relative'>
              <label className='form-label fw-bold'>
                Content <sup className='red'>*</sup>
              </label>
              {attachments.length > 0 && (
                <div className='d-flex flex-wrap gap-2 mb-2'>
                  {attachments.map((file, idx) => (
                    <div
                      key={idx}
                      className='d-flex align-items-center px-2 py-1 border rounded bg-light'
                      style={{fontSize: '13px'}}
                    >
                      <span className='me-2'>
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                      <button
                        type='button'
                        className='btn btn-sm btn-link text-danger p-0'
                        onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <RichTextEditor
                value={message}
                onChange={setMessage}
                onAttach={(file) => setAttachments((prev) => [...prev, file])}
              />
              <i
                className='fa fa-plus-circle text-success position-absolute'
                style={{bottom: '12px', right: '15px', cursor: 'pointer', fontSize: '18px'}}
                title='Add Placeholder'
                onClick={() => setShowModal(true)}
              ></i>
            </div>
          </div>

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

export {AddTemplates}
