import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useErrorBoundary} from 'react-error-boundary'
import {UsersListLoading} from '../loading/UsersListLoading'
import DeleteConfirmation from '../../../../../../../utils/DeleteConfirmation'
import {fetchOrganizationDelete} from '../../../../../../api/Api'
import useFeatureActions from '../../configuration/useFeatureActions'
import {notify, notifyFail} from '../notification/Notification'
import Select from 'react-select'
import {getCurrentTimeZone} from '../../../../../../../utils/helper'
import {truncateText} from '../../../../../../../utils/TruncateText'
import {fetchTemplatesGroupsUrl} from '../../../../../../api/IncidentsApi'
import {fetchMessagePlaceholderDeleteUrl, fetchMessagePlaceholdersUrl} from '../../../../../../api/MessageTemplateApi'

const Placeholder = () => {
  const navigate = useNavigate()
  const handleError = useErrorBoundary()
  const [placeholders, setPlaceholders] = useState([])
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [search, setSearch] = useState('')
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)

  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))

  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  // ✅ Fetch placeholders
  const reload = async () => {
    setLoading(true)
    try {
      const payload = {
        orgId,
        toolId: 0,
        templateId: 0,
        placeholderId: 0,
        placeholdergroupid: selectedGroup?.masterId || 0,
        searchText: search?.trim() || '',
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

  useEffect(() => {
    reload()
    loadGroups()
  }, [])

  const loadGroups = async () => {
    try {
      const groupsRes = await fetchTemplatesGroupsUrl()
      setGroups(Array.isArray(groupsRes?.data) ? groupsRes.data : [])
    } catch (err) {
      console.error('Failed to load groups', err)
    }
  }

  const handleDelete = (item) => {
    setItemToDelete(item)
    setShowConfirmation(true)
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      const data = {
        placeholderId: itemToDelete.placeholderId,
        deletedDate: new Date().toISOString(),
        deleteUserId: Number(sessionStorage.getItem('userId')),
      }

      try {
        const response = await fetchMessagePlaceholderDeleteUrl(data)
        const {isSuccess, message} = response
        if (isSuccess) {
          notify(message)
          await reload()
        } else {
          notifyFail(message)
        }
      } catch (error) {
        handleError(error)
      } finally {
        setShowConfirmation(false)
        setItemToDelete(null)
      }
    }
  }

  const cancelDelete = () => {
    setShowConfirmation(false)
    setItemToDelete(null)
  }

  // ✅ Authorization Check
  const isActionAuthorized = (actionName) =>
    featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )

  // ✅ Group dropdown
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

  const handleNavigateToUpdate = (id) => {
    navigate(`/qradar/placeholder/update/${id}`, {state: {save: true}})
  }

  return (
    <div className='card pad-10 config'>
      <ToastContainer />
      <div className='card-header no-pad'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Placeholders ({placeholders.length})</span>
        </h3>

        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link
              to='/qradar/placeholder/add'
              className={`btn btn-new btn-small ${!isActionAuthorized('Create') ? 'disabled' : ''}`}
            >
              Add
            </Link>
          </div>
        </div>
      </div>

      {/* 🔍 Filters */}
      <div className='row align-items-center mb-1 mt-1'>
        <div className='col-md-8 mb-2'>
          <input
            type='text'
            className='form-control'
            placeholder='Search Placeholder...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className='col-md-3 mb-2'>
          <Select
            options={groupOptions}
            value={selectedGroup}
            onChange={setSelectedGroup}
            isClearable
            placeholder='Select Group'
            styles={customSelectStyle}
          />
        </div>

        <div className='col-md-1 text-end'>
          <button className='btn btn-primary sm py-3' onClick={reload}>
            <i className='fa fa-search me-1'></i>
          </button>
        </div>
      </div>

      {/* 🔹 Table */}
      <div className='card-body no-pad'>
        <table className='table alert-table fixed-table scroll-x'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th>Object Type</th>
              <th>Placeholder Data</th>
              <th>Placeholder Text</th>
              <th>Description</th>
              <th>Source Table</th>
              <th>Source Data Column</th>
              <th>Source Criteria Column</th>
              <th>Source Type</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan='5'>
                  <UsersListLoading />
                </td>
              </tr>
            )}

            {!loading && placeholders.length === 0 && (
              <tr>
                <td colSpan='5' className='text-center text-muted'>
                  No placeholders found.
                </td>
              </tr>
            )}

            {!loading &&
              placeholders.map((item, index) => (
                <tr key={index} className='fs-12 table-row'>
                  <td>{item.objectType}</td>
                  <td>{item.placeholderData}</td>
                  <td className=''>{item.placeholderText}</td>
                  <td className='' title={item.description}>
                    {truncateText(item.description || '', 30)}
                  </td>
                  <td>{item.sourceTable}</td>
                  <td>{item.sourceDataColumn}</td>
                  <td>{item.sourceCriteriaColumn}</td>
                  <td>{item.sourceType}</td>
                  <td>
                    {isActionAuthorized('View') ? (
                      <span className='me-8' title='View'>
                        <i
                          className='fa fa-eye cursor'
                          onClick={() => handleNavigateToUpdate(item.placeholderId)}
                        />
                      </span>
                    ) : (
                      <i className='fa fa-eye disabled me-8' title='View' />
                    )}

                    {isActionAuthorized('Update') ? (
                      <span>
                        <Link
                          className='text-white'
                          to={`/qradar/placeholder/update/${item.placeholderId}`}
                          title='Edit'
                        >
                          <i className='fa fa-pencil cursor link' />
                        </Link>
                      </span>
                    ) : (
                      <i className='fa fa-pencil disabled' title='Edit' />
                    )}

                    {isActionAuthorized('Delete') ? (
                      <span className='ms-8' onClick={() => handleDelete(item)} title='Delete'>
                        <i className='fa fa-trash cursor red' />
                      </span>
                    ) : (
                      <i className='fa fa-trash disabled ms-8' title='Delete' />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {showConfirmation && (
          <DeleteConfirmation
            show={showConfirmation}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
      </div>
    </div>
  )
}

export {Placeholder}
