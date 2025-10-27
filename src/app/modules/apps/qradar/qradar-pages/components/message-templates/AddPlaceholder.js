import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useErrorBoundary} from 'react-error-boundary'
import {ToastContainer} from 'react-toastify'
import {notify, notifyFail} from '../notification/Notification'
import {
  fetchMessagePlaceHolderGroupsUrl,
  fetchMessagePlaceholderUrl,
  fetchMessagePlaceholdersUrl,
  fetchTablesListUrl,
  fetchTablesUrl,
} from '../../../../../../api/MessageTemplateApi'
import Select from 'react-select'

const AddPlaceholder = () => {
  const {showBoundary} = useErrorBoundary()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const orgId = Number(sessionStorage.getItem('orgId'))
  const createdUserId = Number(sessionStorage.getItem('userId'))

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
  const [showIn, setShowIn] = useState(false)

  // 🔹 Load dropdown data on mount
  useEffect(() => {
    loadDropdownData()
    loadPlaceholders()
  }, [])

  const loadDropdownData = async () => {
    try {
      const [groupsRes, tablesRes] = await Promise.all([
        fetchMessagePlaceHolderGroupsUrl(0),
        fetchTablesListUrl(),
      ])

      setGroups(Array.isArray(groupsRes?.data) ? groupsRes.data : [])
      setTables(Array.isArray(tablesRes?.tableNameList) ? tablesRes.tableNameList : [])
    } catch (err) {
      console.error('Failed to load dropdown data', err)
      notifyFail('Failed to load dropdown data')
    }
  }

  // 🔹 Fetch existing placeholders (for dependency dropdown)
  const loadPlaceholders = async () => {
    setLoading(true)
    try {
      const payload = {
        orgId,
        toolId: 0,
        templateId: 0,
        placeholderId: 0,
        placeholdergroupid: 0,
        searchText: '',
      }

      const response = await fetchMessagePlaceholdersUrl(payload)
      if (response?.isSuccess && Array.isArray(response?.placeholders)) {
        setPlaceholders(response.placeholders)
      } else {
        setPlaceholders([])
      }
    } catch (err) {
      console.error('Failed to fetch placeholders', err)
      setPlaceholders([])
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Fetch columns based on selected table
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

      if (data?.tableColumnNameList && Array.isArray(data.tableColumnNameList)) {
        setColumns(data.tableColumnNameList)
      } else {
        setColumns([])
        notifyFail('No columns found for selected table')
      }
    } catch (error) {
      console.error('Error loading columns:', error)
      notifyFail('Failed to load columns')
    }
  }

  const groupOptions = groups.map((g) => ({
    label: g.displayName,
    value: g.templateGroupId,
    masterId: g.masterId,
  }))

  const tableOptions = tables.map((t) => ({
    label: t,
    value: t,
  }))

  const columnOptions = columns.map((c) => ({
    label: c,
    value: c,
  }))

  const dependencyOptions = placeholders.map((p) => ({
    label: p.placeholderText,
    value: p.placeholderId,
  }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Common mandatory fields
    if (!selectedGroup) return notifyFail('Select a Group')
    if (!placeholderData.trim()) return notifyFail('Enter Placeholder Data')
    if (!placeholderText.trim()) return notifyFail('Enter DisplayName')
    if (!sourceType) return notifyFail('Select Source Type')

    // If sourceType is TABLE → these must be filled
    if (sourceType === 'Table') {
      if (!selectedTable) return notifyFail('Select Source Table')
      if (!selectedColumn) return notifyFail('Select Source Data Column')
      if (!selectedCriteriaColumn) return notifyFail('Select Source Criteria Column')
    }

    setLoading(true)

    const payload = {
      orgId,
      toolId: 0,
      groupId: selectedGroup?.masterId || 0,
      placeholderData,
      placeholderText,
      description,
      sourceTable: sourceType === 'Table' ? selectedTable?.value || '' : '',
      sourceDataColumn: sourceType === 'Table' ? selectedColumn?.value || '' : '',
      sourceCriteriaColumn: sourceType === 'Table' ? selectedCriteriaColumn?.value || '' : '',
      sourceType,
      dependency_PlaceholderId: selectedDependency?.value || 0,
      createdDate: new Date().toISOString(),
      createdUserId,
      showInSelection:showIn,
    }

    try {
      const response = await fetchMessagePlaceholderUrl(payload)
      if (response?.isSuccess) {
        notify('Placeholder added successfully!')
        setTimeout(() => navigate('/qradar/placeholder/list'), 2000)
      } else {
        notifyFail('Failed to add placeholder')
      }
    } catch (err) {
      console.error('Error creating placeholder:', err)
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
  const sourceTypeOptions = [
    {label: 'Table', value: 'Table'},
    {label: 'Static Data', value: 'Static Data'},
  ]

  return (
    <div className='config card'>
      <ToastContainer />
      <div className='card-header bg-heading d-flex justify-content-between align-items-center'>
        <h3 className='card-title white mb-1'>Add New Placeholder</h3>
        <Link to='/qradar/placeholder/list' className='white fs-15 text-underline'>
          <i className='fa fa-chevron-left white me-2' /> Back
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='card-body p-4'>
          <div className='row'>
            {/* Group */}
            <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>
                Group<span className='text-danger'>*</span>
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
            {/* <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>Object Type</label>
              <input
                type='text'
                className='form-control'
                value={objectType}
                onChange={(e) => setObjectType(e.target.value)}
                placeholder='Enter object type'
              />
            </div> */}
            <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>
                Placeholder Data<span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className='form-control'
                value={placeholderData}
                onChange={(e) => setPlaceholderData(e.target.value)}
                placeholder='Enter placeholder data'
                maxLength={100}
              />
            </div>
            <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>
               DisplayName<span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className='form-control'
                value={placeholderText}
                onChange={(e) => setPlaceholderText(e.target.value)}
                placeholder='Enter placeholder text'
                maxLength={255}
              />
            </div>
            <div className='col-md-8 mb-3'>
              <label className='form-label fw-bold'>Description</label>
              <textarea
                className='form-control'
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Enter description'
                maxLength={500}
              />
            </div>
            <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>Source Type<span className='text-danger'>*</span></label>
              <Select
                options={sourceTypeOptions}
                value={sourceTypeOptions.find((opt) => opt.value === sourceType) || null}
                onChange={(opt) => setSourceType(opt?.value || '')}
                placeholder='Select Source Type'
                isClearable
                styles={customSelectStyle}
              />
            </div>
            <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>
                Source Table
              </label>
              <Select
                options={tableOptions}
                value={selectedTable}
                onChange={setSelectedTable}
                isClearable
                placeholder='Select Source Table'
                styles={customSelectStyle}
              />
            </div>
            <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>Source Data Column</label>
              <Select
                options={columnOptions}
                value={selectedColumn}
                onChange={setSelectedColumn}
                isDisabled={!selectedTable}
                isClearable
                placeholder={selectedTable ? 'Select Data Column' : 'Select Source Table first'}
                styles={customSelectStyle}
              />
            </div>
            <div className='col-md-4 mb-3'>
              <label className='form-label fw-bold'>Source Criteria Column</label>
              <Select
                options={columnOptions}
                value={selectedCriteriaColumn}
                onChange={setSelectedCriteriaColumn}
                isDisabled={!selectedTable}
                isClearable
                placeholder={selectedTable ? 'Select Criteria Column' : 'Select Source Table first'}
                styles={customSelectStyle}
              />
            </div>
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
            <div className='col-md-4 mb-3 d-flex align-items-center mt-5'>
              <input
                type='checkbox'
                id='showIn'
                className='form-check-input ms-0'
                checked={showIn}
                onChange={(e) => setShowIn(e.target.checked)}
              />
              <label htmlFor='showIn' className='form-label fw-bold ms-5 p-5'>
                Show In
              </label>
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

export {AddPlaceholder}
