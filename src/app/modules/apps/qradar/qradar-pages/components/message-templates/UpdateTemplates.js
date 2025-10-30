import React, {useState, useRef, useEffect} from 'react'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom'
import {useErrorBoundary} from 'react-error-boundary'
import {ToastContainer} from 'react-toastify'
import {notify, notifyFail} from '../notification/Notification'
import {
  fetchMessageTemplateUpdateUrl,
  fetchMessagePlaceholdersUrl,
} from '../../../../../../api/MessageTemplateApi'
import {
  fetchIncidentGroupsUrl,
  fetchMessageTemplatesUrl,
  fetchTemplatesGroupsUrl,
  fetchTemplatesTemplateTypesUrl,
} from '../../../../../../api/IncidentsApi'
import Select from 'react-select'
import PlaceholdersModal from './PlaceholdersModal'
import RichTextEditor from '../../../../../../../utils/RichTextEditor'
import {processHtmlWithInlineImages} from '../../incidents/processHtmlWithInlineImages'

const UpdateTemplates = () => {
  const {showBoundary} = useErrorBoundary()
  const toolId = Number(sessionStorage.getItem('incidentToolId'))
  const navigate = useNavigate()
  const location = useLocation()
  const {id} = useParams()
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState([])
  const [tools, setTools] = useState(null)
  const [loading, setLoading] = useState(false)
  const [types, setTypes] = useState([])
  const [groups, setGroups] = useState([])
  const [selectedType, setSelectedType] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  console.log('Selected Group:', selectedGroup)
  const [showModal, setShowModal] = useState(false)
  const [selectedPlaceholders, setSelectedPlaceholders] = useState([])
  const [placeholders, setPlaceholders] = useState([])
  const [availableFor, setAvailableFor] = useState('self')
  const [selectedAgentGroups, setSelectedAgentGroups] = useState([])
  const [folderOptions, setFolderOptions] = useState([])
  const [selectedFolder, setSelectedFolder] = useState(null)
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [save] = useState(location.state?.save || '')
  const contentRef = useRef()
  const titleRef = useRef()
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
  const base64ToFile = (base64, fileName, contentType) => {
    const byteString = atob(base64)
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new File([ab], fileName, {type: contentType})
  }
const didInitMatch = useRef(false)

useEffect(() => {
  if (!tools || folderOptions.length === 0 || groupOptions.length === 0) return
  if (didInitMatch.current) return
  didInitMatch.current = true
  const data = tools
  if (data.scopeName) {
    setAvailableFor(data.scopeName)
  }
  if (data.scopeTemplateGroupId) {
    const matchedFolder = folderOptions.find(
      (f) => f.masterId === data.scopeTemplateGroupId
    )
    if (matchedFolder) setSelectedFolder(matchedFolder)
  }
  /** ----- Agents Group Match ----- **/
  if (data.scopeName === 'agents in group' && Array.isArray(data.scopeValue)) {
    const matchedAgentGroups = groupOptions.filter((g) =>
      data.scopeValue.includes(g.groupId)
    )
    setSelectedAgentGroups(matchedAgentGroups)
  }
  /** ----- Type Match ----- **/
  const matchedType = types.find(
    (t) => t.templateTypeId === data.templateTypeId || t.masterId === data.templateTypeId
  )
  if (matchedType) {
    setSelectedType({
      label: matchedType.displayName,
      value: matchedType.templateTypeId,
      masterId: matchedType.masterId,
    })
  }
  /** ----- Group Match ----- **/
  const matchedGroup = groups.find(
    (g) => g.templateGroupId === data.groupId || g.masterId === data.groupId
  )
  if (matchedGroup) {
    setSelectedAgentGroups({
      label: matchedGroup.displayName,
      value: matchedGroup.templateGroupId,
      masterId: matchedGroup.masterId,
    })
  }
}, [tools, folderOptions, groupOptions, types, groups])
  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        const [typesRes, groupsRes] = await Promise.all([
          fetchTemplatesTemplateTypesUrl(),
          fetchTemplatesGroupsUrl(),
        ])
        const typeData = Array.isArray(typesRes?.data) ? typesRes.data : []
        const groupData = Array.isArray(groupsRes?.data) ? groupsRes.data : []
        setTypes(typeData)
        setGroups(groupData)
        const payload = {
          orgId,
          templateId: Number(id),
          toolId: toolId,
          templatetypeid: 0,
          templategroupid: 0,
          searchText: '',
          templateSeletion: false,
        }
        const response = await fetchMessageTemplatesUrl(payload)
        if (response?.isSuccess && Array.isArray(response?.data)) {
          const data = response.data[0]
          setTools(data)
          if (titleRef.current) titleRef.current.value = data.title || ''
          setMessage(data.content || '')
          if (Array.isArray(data?.attachmentsInBase64)) {
            const converted = data?.attachmentsInBase64?.map((att) =>
              base64ToFile(att.data, att.fileName, att.fileType)
            )
            setAttachments(converted)
          } else {
            setAttachments([])
          }
          const matchedType = typeData.find(
            (t) => t.templateTypeId === data.templateTypeId || t.masterId === data.templateTypeId
          )
          if (matchedType) {
            setSelectedType({
              label: matchedType.displayName,
              value: matchedType.templateTypeId,
              masterId: matchedType.masterId,
            })
          }
          const matchedGroup = groupData.find(
            (g) => g.templateGroupId === data.groupId || g.masterId === data.groupId
          )
          if (matchedGroup) {
            setSelectedGroup({
              label: matchedGroup.displayName,
              value: matchedGroup.templateGroupId,
              masterId: matchedGroup.masterId,
            })
          }
          if (Array.isArray(data.placeholders) && data.placeholders.length > 0) {
            setSelectedPlaceholders(data.placeholders)
          }
        } else {
          setTools(null)
        }
        await loadPlaceholders()
      } catch (err) {
        console.error('Error loading template data:', err)
        notifyFail('Failed to load template details')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [id])
  const loadPlaceholders = async () => {
    try {
      const payload = {
        orgId,
        toolId: 0,
        templateId: 0,
        placeholderId: 0,
        placeholdergroupid: 0, // group not used
        searchText: '',
      }
      const response = await fetchMessagePlaceholdersUrl(payload)
      if (response?.isSuccess && Array.isArray(response?.placeholders)) {
        setPlaceholders(response.placeholders)
      } else {
        setPlaceholders([])
        notifyFail(response?.message || 'No placeholders found')
      }
    } catch (err) {
      console.error('Failed to load placeholders:', err)
      notifyFail('Failed to load placeholders')
      setPlaceholders([])
    }
  }
const handleSelectPlaceholders = (selected) => {
  // Allow duplicates — just append all
  const newPlaceholders = Array.isArray(selected) ? selected : [selected]

  // Add to list (duplicates allowed)
  setSelectedPlaceholders((prev) => [...prev, ...newPlaceholders])

  // Add all placeholder texts into the editor content
  const toAdd = newPlaceholders.map((p) => p.placeholderTag).join(' ')
  setMessage((prev) => (prev ? `${prev} ${toAdd}` : toAdd))

  setShowModal(false)
}

const removePlaceholder = (index) => {
  const removed = selectedPlaceholders[index]
  if (!removed) return

  // Remove only that specific badge from list (by index, not text)
  const updated = selectedPlaceholders.filter((_, i) => i !== index)
  setSelectedPlaceholders(updated)

  // Remove only ONE occurrence from editor content, not all duplicates
  setMessage((prev) => {
    const idx = prev.indexOf(removed.placeholderTag)
    if (idx === -1) return prev // not found
    return (
      prev.slice(0, idx) +
      prev.slice(idx + removed.placeholderTag.length)
    ).trim()
  })
}

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
    // ===== Scope based validations =====
    if (availableFor === 'all agents') {
      if (!selectedFolder) {
        notifyFail('Select Template Group for All Agents scope')
        setLoading(false)
        return
      }
    }
    if (availableFor === 'agents in group') {
      if (!selectedAgentGroups.length) {
        notifyFail('Select at least one User Group')
        setLoading(false)
        return
      }
      if (!selectedFolder) {
        notifyFail('Select Template Group for Agents in Group scope')
        setLoading(false)
        return
      }
    }
    let ScopeName = availableFor // 'self' | 'all agents' | 'agents in group'
    let ScopeValue = null // userId OR groupIds OR 0
    let ScopeTemplateGroupId = null // selectedFolder?.masterId or 0
    const userId = Number(sessionStorage.getItem('userId'))
    if (availableFor === 'self') {
      ScopeValue = userId
      ScopeTemplateGroupId = 0
    }
    if (availableFor === 'all agents') {
      ScopeValue = 0
      ScopeTemplateGroupId = selectedFolder?.masterId || 0
    }
    if (availableFor === 'agents in group') {
      ScopeValue = selectedAgentGroups.map((g) => g.masterId) // array
      ScopeTemplateGroupId = selectedFolder?.masterId || 0
    }
    const modifiedUserId = Number(sessionStorage.getItem('userId'))
    const modifiedDate = new Date().toISOString()
    const {cleanedHtml, attachments: inlineAttachments} = processHtmlWithInlineImages(message)
    const data = {
      orgId,
      toolId,
      templateTypeId: selectedType?.masterId || 0,
      groupId: selectedGroup?.masterId || 0,
      title: titleValue,
      content: cleanedHtml,
      templateId: Number(id),
      placeholderIds: selectedPlaceholders.map((p) => p.placeholderId),
      modifiedUserId,
      modifiedDate,
      SignatureContent: 'test',
      attachments: [
        ...attachments.map((f) => ({file: f})),
        ...inlineAttachments, // ✅ cid objects from helper
      ],
      ScopeName,
      ScopeValue,
      ScopeTemplateGroupId,
    }

    try {
      const response = await fetchMessageTemplateUpdateUrl(data)
      if (response?.isSuccess) {
        notify('Template Updated successfully!')
        setTimeout(() => navigate('/qradar/templates/list'), 2000)
      } else {
        notifyFail('Failed Update the template')
      }
    } catch (error) {
      showBoundary(error)
    } finally {
      setLoading(false)
    }
  }

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
  const scopeOptions = [
    {label: 'Myself', value: 'self'},
    {label: 'All agents', value: 'all agents'},
    {label: 'Agents in group', value: 'agents in group'},
  ]
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchIncidentGroupsUrl(orgId, toolId, 0)
      if (Array.isArray(res)) {
        const mapped = res.map((g) => ({
          label: g.groupName,
          value: g.groupId,
          masterId: g.groupId,
        }))
        setFolderOptions(mapped)
      }
    }
    fetchData()
  }, [orgId, toolId])

  return (
    <div className='config card'>
      <ToastContainer />
      <div className='card-header bg-heading d-flex justify-content-between align-items-center'>
        <h3 className='card-title white mb-1'>{save ? 'View Template' : 'Update Template'}</h3>
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
                isDisabled={loading}
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
                isDisabled={loading}
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
                disabled={loading}
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
                        className='btn btn-sm btn-link text-primary p-0 me-2'
                        onClick={() => {
                          const url = URL.createObjectURL(file)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = file.name
                          a.click()
                          URL.revokeObjectURL(url)
                        }}
                      >
                        ⬇
                      </button>
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
          <div className='p-3'>
            <label className='form-label fw-bold'>Scope</label>
            <Select
              options={scopeOptions}
              value={scopeOptions?.find((o) => o.value === availableFor)}
              onChange={(opt) => setAvailableFor(opt.value)}
              placeholder='Select Scope'
              styles={customSelectStyle}
            />
            {availableFor === 'agents in group' && (
              <div className='mt-2'>
                <Select
                  options={groupOptions}
                  value={selectedAgentGroups}
                  onChange={setSelectedAgentGroups}
                  isMulti
                  placeholder='Select User Group'
                  styles={customSelectStyle}
                />
              </div>
            )}
            {(availableFor === 'all agents' || availableFor === 'agents in group') && (
              <div className='mt-3'>
                <label className='form-label fw-bold'>Template group</label>
                <Select
                  options={folderOptions}
                  value={selectedFolder}
                  onChange={setSelectedFolder}
                  placeholder='Select Template group'
                  styles={customSelectStyle}
                  isClearable
                />
              </div>
            )}
          </div>
        </div>
        {!save && (
          <div className='card-footer d-flex justify-content-end p-3'>
            <button type='submit' className='btn btn-new btn-small' disabled={loading}>
              Save Changes
            </button>
          </div>
        )}
      </form>
      <PlaceholdersModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSelect={handleSelectPlaceholders}
        placeholders={placeholders}
      />
    </div>
  )
}

export {UpdateTemplates}
