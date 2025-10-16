import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useErrorBoundary } from 'react-error-boundary'
import { ToastContainer } from 'react-toastify'
import { notify, notifyFail } from '../notification/Notification'
import {
  fetchMessagePlaceHolderGroupsUrl,
  fetchMessagePlaceholderUpdateUrl,
  fetchMessagePlaceholdersUrl,
  fetchTablesListUrl,
  fetchTablesUrl,
} from '../../../../../../api/MessageTemplateApi'
import { fetchTemplatesGroupsUrl } from '../../../../../../api/IncidentsApi'
import Select from 'react-select'

const UpdatePlaceholder = () => {
  const { showBoundary } = useErrorBoundary()
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)

  const orgId = Number(sessionStorage.getItem('orgId'))
  const modifiedUserId = Number(sessionStorage.getItem('userId'))
  const [save] = useState(location.state?.save || '')

  // Dropdown Data
  const [groups, setGroups] = useState([])
  const [tables, setTables] = useState([])
  const [columns, setColumns] = useState([])
  const [placeholders, setPlaceholders] = useState([])

  // Selected values
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedTable, setSelectedTable] = useState(null)
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [selectedCriteriaColumn, setSelectedCriteriaColumn] = useState(null)
  const [selectedDependency, setSelectedDependency] = useState(null)

  // Input fields
  const [objectType, setObjectType] = useState('')
  const [placeholderData, setPlaceholderData] = useState('')
  const [placeholderText, setPlaceholderText] = useState('')
  const [description, setDescription] = useState('')
  const [sourceType, setSourceType] = useState('')

  // 🔹 Init sequence — ensures groups and placeholders load before details
  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        // 1️⃣ Load Groups and Tables first
        const [groupsRes, tablesRes] = await Promise.all([
          fetchMessagePlaceHolderGroupsUrl(0),
          fetchTablesListUrl(),
        ])

        const groupData = Array.isArray(groupsRes?.data) ? groupsRes.data : []
        const tableData = Array.isArray(tablesRes?.tableNameList)
          ? tablesRes.tableNameList
          : []

        setGroups(groupData)
        setTables(tableData)

        // 2️⃣ Load all placeholders (for dependency dropdown)
        const placeholderPayload = {
          orgId,
          toolId: 0,
          templateId: 0,
          placeholderId: 0,
          placeholdergroupid: 0,
          searchText: '',
        }
        const placeholderRes = await fetchMessagePlaceholdersUrl(placeholderPayload)
        const placeholderList = Array.isArray(placeholderRes?.placeholders)
          ? placeholderRes.placeholders
          : []
        setPlaceholders(placeholderList)

        // 3️⃣ Now load specific placeholder details (after dropdowns are ready)
        await loadPlaceholderDetails(groupData, placeholderList)
      } catch (err) {
        console.error('Init failed:', err)
        notifyFail('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [id])

  // 🔹 Fetch placeholder details by ID and prepopulate form
  const loadPlaceholderDetails = async (groupData, placeholderList) => {
    if (!id) return
    try {
      const payload = { orgId, placeholderId: Number(id) }
      const response = await fetchMessagePlaceholdersUrl(payload)

      if (response?.isSuccess && Array.isArray(response?.placeholders)) {
        const data = response.placeholders[0]
        if (data) {
          setObjectType(data.objectType || '')
          setPlaceholderData(data.placeholderData || '')
          setPlaceholderText(data.placeholderText || '')
          setDescription(data.description || '')
          setSourceType(data.sourceType || '')

          // ✅ Match Group from already loaded list
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

          // ✅ Source Table + Columns
          if (data.sourceTable) {
            const tableOption = { label: data.sourceTable, value: data.sourceTable }
            setSelectedTable(tableOption)

            const tableInfo = await fetchTablesUrl(data.sourceTable)
            const colList = tableInfo?.tableColumnNameList || []
            setColumns(colList)

            const colOptions = colList.map((c) => ({ label: c, value: c }))
            const matchedDataCol = colOptions.find((c) => c.value === data.sourceDataColumn)
            const matchedCriteriaCol = colOptions.find(
              (c) => c.value === data.sourceCriteriaColumn
            )

            setSelectedColumn(matchedDataCol || null)
            setSelectedCriteriaColumn(matchedCriteriaCol || null)
          }

          // ✅ Dependency Placeholder
          if (data.dependency_PlaceholderId) {
            const dep = placeholderList.find(
              (p) => p.placeholderId === data.dependency_PlaceholderId
            )
            if (dep) {
              setSelectedDependency({
                label: dep.placeholderText,
                value: dep.placeholderId,
              })
            }
          }
        }
      }
    } catch (err) {
      console.error('Error loading placeholder details:', err)
    }
  }

  // 🔹 Load columns dynamically when table changes
  useEffect(() => {
    if (selectedTable?.value) {
      loadColumns(selectedTable.value)
    } else {
      setColumns([])
      setSelectedColumn(null)
      setSelectedCriteriaColumn(null)
    }
  }, [selectedTable])

  const loadColumns = async (tableName) => {
    try {
      const data = await fetchTablesUrl(tableName)
      const list = Array.isArray(data?.tableColumnNameList)
        ? data.tableColumnNameList
        : []
      setColumns(list)
    } catch (err) {
      console.error('Error loading columns:', err)
      notifyFail('Failed to load columns')
    }
  }

  const groupOptions = groups.map((g) => ({
    label: g.displayName,
    value: g.templateGroupId,
    masterId: g.masterId,
  }))
  const tableOptions = tables.map((t) => ({ label: t, value: t }))
  const columnOptions = columns.map((c) => ({ label: c, value: c }))
  const dependencyOptions = placeholders.map((p) => ({
    label: p.placeholderText,
    value: p.placeholderId,
  }))

  // 🔹 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedGroup) return notifyFail('Select a Group')
    if (!placeholderText.trim()) return notifyFail('Enter Placeholder Text')

    setLoading(true)
    const payload = {
      orgId,
      toolId: 0,
      groupId: selectedGroup?.masterId || 0,
      objectType,
      placeholderData,
      placeholderText,
      description,
      sourceTable: selectedTable?.value || '',
      sourceDataColumn: selectedColumn?.value || '',
      sourceCriteriaColumn: selectedCriteriaColumn?.value || '',
      sourceType,
      dependency_PlaceholderId: selectedDependency?.value || 0,
      placeholderId: Number(id),
      modifiedDate: new Date().toISOString(),
      modifiedUserId,
    }

    try {
      const response = await fetchMessagePlaceholderUpdateUrl(payload)
      if (response?.isSuccess) {
        notify(response.message || 'Placeholder updated successfully!')
        setTimeout(() => navigate('/qradar/placeholder/list'), 2000)
      } else {
        notifyFail(response?.message || 'Failed to update placeholder')
      }
    } catch (err) {
      console.error('Error updating placeholder:', err)
      showBoundary(err)
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

  return (
    <div className='config card'>
      <ToastContainer />
      <div className='card-header bg-heading d-flex justify-content-between align-items-center'>
        <h3 className='card-title white mb-1'>
          {save ? 'View Placeholder' : 'Update Placeholder'}
        </h3>
        <Link to='/qradar/placeholder/list' className='white fs-15 text-underline'>
          <i className='fa fa-chevron-left white me-2' /> Back
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='card-body p-4'>
          <div className='row'>
            {/* Group */}
            <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>Group</label>
              <Select
                options={groupOptions}
                value={selectedGroup}
                onChange={setSelectedGroup}
                isClearable
                placeholder='Select Group'
                styles={customSelectStyle}
              />
            </div>

            {/* Object Type */}
            <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>Object Type</label>
              <input
                type='text'
                className='form-control'
                value={objectType}
                onChange={(e) => setObjectType(e.target.value)}
                placeholder='Enter object type'
              />
            </div>

            {/* Placeholder Data */}
            <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>Placeholder Data</label>
              <input
                type='text'
                className='form-control'
                value={placeholderData}
                onChange={(e) => setPlaceholderData(e.target.value)}
                placeholder='Enter placeholder data'
              />
            </div>

            {/* Placeholder Text */}
            <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>Placeholder Text</label>
              <input
                type='text'
                className='form-control'
                value={placeholderText}
                onChange={(e) => setPlaceholderText(e.target.value)}
                placeholder='Enter placeholder text'
              />
            </div>

            {/* Description */}
            <div className='col-md-8 mb-3'>
              <label className='form-label fw-bold'>Description</label>
              <textarea
                className='form-control'
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Enter description'
              />
            </div>

            {/* Source Type */}
            <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>Source Type</label>
              <input
                type='text'
                className='form-control'
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
                placeholder='Enter source type'
              />
            </div>

            {/* Source Table */}
            <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>Source Table</label>
              <Select
                options={tableOptions}
                value={selectedTable}
                onChange={setSelectedTable}
                isClearable
                placeholder='Select Source Table'
                styles={customSelectStyle}
              />
            </div>

            {/* Source Data Column */}
            <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>Source Data Column</label>
              <Select
                options={columnOptions}
                value={selectedColumn}
                onChange={setSelectedColumn}
                isDisabled={!selectedTable}
                isClearable
                placeholder={
                  selectedTable ? 'Select Data Column' : 'Select Source Table first'
                }
                styles={customSelectStyle}
              />
            </div>

            {/* Source Criteria Column */}
            <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>Source Criteria Column</label>
              <Select
                options={columnOptions}
                value={selectedCriteriaColumn}
                onChange={setSelectedCriteriaColumn}
                isDisabled={!selectedTable}
                isClearable
                placeholder={
                  selectedTable ? 'Select Criteria Column' : 'Select Source Table first'
                }
                styles={customSelectStyle}
              />
            </div>

            {/* Dependency Placeholder */}
            <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>Dependency Placeholder</label>
              <Select
                options={dependencyOptions}
                value={selectedDependency}
                onChange={setSelectedDependency}
                isClearable
                placeholder='Select Dependency Placeholder'
                styles={customSelectStyle}
              />
            </div>
          </div>
        </div>

        <div className='card-footer d-flex justify-content-end p-3'>
          <button type='submit' className='btn btn-new btn-small' disabled={loading}>
            {!loading ? (
              'Save Placeholder'
            ) : (
              <span className='indicator-progress'>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export { UpdatePlaceholder }
