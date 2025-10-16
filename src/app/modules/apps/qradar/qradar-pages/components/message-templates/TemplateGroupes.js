import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useErrorBoundary} from 'react-error-boundary'
import {UsersListLoading} from '../loading/UsersListLoading'
import DeleteConfirmation from '../../../../../../../utils/DeleteConfirmation'
import {
  fetchMessageTemplatesUrl,
  fetchTemplatesGroupsUrl,
  fetchTemplatesTemplateTypesUrl,
} from '../../../../../../api/IncidentsApi'
import useFeatureActions from '../../configuration/useFeatureActions'
import {notify, notifyFail} from '../notification/Notification'
import Select from 'react-select'
import {getCurrentTimeZone} from '../../../../../../../utils/helper'
import {truncateText} from '../../../../../../../utils/TruncateText'
import {fetchMessageTemplateDeleteUrl} from '../../../../../../api/MessageTemplateApi'

const TemplateGroupes = () => {
  const navigate = useNavigate()
  const handleError = useErrorBoundary()
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [search, setSearch] = useState('')
  const [types, setTypes] = useState([])
  const [groups, setGroups] = useState([])
  const [selectedType, setSelectedType] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))

  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  // 🟢 Fetch Templates
  const reload = async () => {
    setLoading(true)
    try {
      const payload = {
        orgId,
        toolId: 0,
        templateId: 0,
        templatetypeid: selectedType?.masterId || 0,
        templategroupid: selectedGroup?.masterId || 0,
        searchText: search?.trim() || '',
      }

      const response = await fetchMessageTemplatesUrl(payload)
      if (response?.isSuccess && Array.isArray(response?.data)) {
        setTools(response.data)
      } else {
        setTools([])
      }
    } catch (err) {
      console.error('Failed to fetch templates', err)
      setTools([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
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
    }
  }
  const handleDelete = (item) => {
    setItemToDelete(item)
    setShowConfirmation(true)
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      const data = {
        templateId: itemToDelete.templateId,
        deletedDate: new Date().toISOString(),
        deleteUserId: Number(sessionStorage.getItem('userId')),
      }

      try {
        const response = await fetchMessageTemplateDeleteUrl(data)
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

  // ✅ React-select dropdowns
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
  const handleNavigateToUpdate = (id) => {
    navigate(`/qradar/templates/update/${id}`, {state: {save: true}})
  }

  return (
    <div className='card pad-10 config'>
      <ToastContainer />
      <div className='card-header no-pad'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Message Templates ({tools.length})</span>
        </h3>

        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link
              to='/qradar/templates/add'
              className={`btn btn-new btn-small ${!isActionAuthorized('Create') ? 'disabled' : ''}`}
            >
              Add
            </Link>
          </div>
        </div>
      </div>
      <div className='row align-items-center mb-1 mt-1'>
        <div className='col-md-5 mb-2'>
          <input
            type='text'
            className='form-control'
            placeholder='Search Message...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className='col-md-3 mb-2'>
          <Select
            options={typeOptions}
            value={selectedType}
            onChange={setSelectedType}
            isClearable
            placeholder='Select Type'
            styles={customSelectStyle}
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
          <button className='btn btn-primary sm' onClick={reload}>
            <i className='fa fa-search me-1'></i>
          </button>
        </div>
      </div>
      <div className='card-body no-pad'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th>User</th>
              <th>Date</th>
              <th>Title</th>
              <th>Content</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan='4'>
                  <UsersListLoading />
                </td>
              </tr>
            )}

            {!loading && tools.length === 0 && (
              <tr>
                <td colSpan='4' className='text-center text-muted'>
                  No templates found.
                </td>
              </tr>
            )}

            {!loading &&
              tools.map((item, index) => (
                <tr key={index} className='fs-12 table-row'>
                  <td>{item.createdUser}</td>
                  <td>{getCurrentTimeZone(item.createdDate)}</td>
                  <td className=''>{item.title}</td>
                  <td className='' title={item.content}>
                    {truncateText(item.content, 70)}
                  </td>
                  <td>
                    {isActionAuthorized('View') ? (
                      <span className='me-8' title='View'>
                        <i
                          className='fa fa-eye cursor'
                          onClick={() => handleNavigateToUpdate(item.templateId)}
                        />
                      </span>
                    ) : (
                      <span className='me-8' title='View'>
                        <i className='fa fa-eye disabled' />
                      </span>
                    )}

                    {isActionAuthorized('Update') ? (
                      <span>
                        <Link
                          className='text-white'
                          to={`/qradar/templates/update/${item.templateId}`}
                          title='Edit'
                        >
                          <i className='fa fa-pencil cursor link' />
                        </Link>
                      </span>
                    ) : (
                      <span className='' title='Edit'>
                        <i className='fa fa-pencil disabled' />
                      </span>
                    )}

                    {isActionAuthorized('Delete') ? (
                      <span className='ms-8' onClick={() => handleDelete(item)} title='Delete'>
                        <i className='fa fa-trash cursor red' />
                      </span>
                    ) : (
                      <span className='ms-8' title='Delete'>
                        <i className='fa fa-trash disabled' />
                      </span>
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

export {TemplateGroupes}
