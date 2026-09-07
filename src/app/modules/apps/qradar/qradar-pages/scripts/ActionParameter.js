import React, {useState, useEffect, useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useErrorBoundary} from 'react-error-boundary'
import Pagination from '../../../../../../utils/Pagination'
import DeleteConfirmation2 from '../risk-upgrade/DeleteConfirmation2'
import useFeatureActions from '../configuration/useFeatureActions'
import {fetchRuleActions} from '../../../../../api/ConfigurationApi'
import {
  fetchGET_ACTION_PARAMETERS_URL,
  fetchDELETE_ACTION_PARAMETER_URL,
} from '../../../../../api/ScriptsApi'
import {notify, notifyFail} from '../components/notification/Notification'

const ActionParameter = () => {
  const navigate = useNavigate()
  const handleError = useErrorBoundary()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))

  const [loading, setLoading] = useState(false)
  const [parameters, setParameters] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activePage, setActivePage] = useState(0)

  const actionRef = useRef()
  const [searchValue, setSearchValue] = useState('')
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const [actions, setActions] = useState([])

  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))
  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }

  const handleNavigateToUpdate = (id) => {
    navigate(`/qradar/action_parameter/update/${id}`, {state: {save: true}})
  }

  // =========================
  // LOAD DROPDOWN DATA
  // =========================

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const response = await fetchRuleActions({orgId, toolId})
        setActions(Array.isArray(response?.actions) ? response.actions : [])
      } catch (error) {
        console.error(error)
        notifyFail('Failed to load actions.')
      }
    }
    loadDropdowns()
  }, [orgId, toolId])

  // =========================
  // DELETE
  // =========================

  const handleDelete = (item) => {
    setItemToDelete(item)
    setShowDeleteConfirmation(true)
  }

  const handleDeleteConfirm = async (reason) => {
    if (!itemToDelete) return
    const deletedUserId = Number(sessionStorage.getItem('userId'))
    const data = {
      actionParameterId: itemToDelete.actionParameterId,
      userId: deletedUserId,
      deleteReason: reason,
    }
    try {
      setLoading(true)
      const response = await fetchDELETE_ACTION_PARAMETER_URL(data)
      if (response?.isSuccess) {
        notify(response.message || 'Action Parameter Deleted Successfully')
        setShowDeleteConfirmation(false)
        setItemToDelete(null)
        await reload()
      } else {
        notifyFail(response?.message || 'Failed to delete Action Parameter')
      }
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // RELOAD / SEARCH
  // =========================

  const reload = async () => {
    try {
      setLoading(true)
      const payload = {}

      if (searchValue.trim()) payload.searchText = searchValue.trim()

      const actionId = Number(actionRef.current?.value)
      if (actionId) payload.actionId = actionId

      const response = await fetchGET_ACTION_PARAMETERS_URL(payload)
      setParameters(Array.isArray(response?.data) ? response.data : [])
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(0)
    setActivePage(0)
  }

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected)
    setActivePage(selected.selected)
  }

  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = parameters ? parameters.slice(indexOfFirstItem, indexOfLastItem) : null

  useEffect(() => {
    reload()
  }, [])

  return (
    <div className='config card pad-10'>
      <ToastContainer />
      <div className='row'>
        <div className='col-md-3'>
          <h3 className='card-label fw-bold fs-3 mb-1'>
            Action Parameters ({currentItems ? currentItems.length : 0} /{' '}
            {parameters ? parameters.length : 0})
          </h3>
        </div>

        <div className='col-md-6'>
          <div className='card-title header-filter'>
            <div className='input-group'>
              <input
                type='text'
                className='form-control form-control-sm'
                placeholder='Search Action Parameters'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && reload()}
              />
              <button className='btn btn-sm btn-primary' onClick={reload}>
                <i className='fas fa-search' />
              </button>
            </div>

            <div className='d-flex align-items-center gap-2 mb-1 mt-2 flex-wrap'>
              <div className='w-200px'>
                <select className='form-select form-select-sm' ref={actionRef}>
                  <option value={0}>Action</option>
                  {actions.map((item) => (
                    <option key={item.actionId} value={item.actionId}>
                      {item.actionName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className='col-md-3 text-end'>
          <Link
            to='/qradar/action_parameter/add'
            className={`btn btn-new btn-small ${!isActionAuthorized('Create') ? 'disabled' : ''}`}
          >
            Add
          </Link>
        </div>
      </div>

      <div className='card-body no-pad mt-3'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th>Parameter Name</th>
              <th>Action</th>
              <th>Type</th>
              <th>Required</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {currentItems !== null && currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.actionParameterId} className='fs-12'>
                  <td>{item.parameterName || '-'}</td>
                  <td>{item.actionName || '-'}</td>
                  <td>{item.parameterTypeName || '-'}</td>
                  <td>
                    <span
                      className={`badge ${item.required ? 'badge-success' : 'badge-secondary'}`}
                    >
                      {item.required ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>{item.description || '-'}</td>
                  <td>
                    {isActionAuthorized('View') ? (
                      <span className='me-8' title='View'>
                        <i
                          className='fa fa-eye cursor'
                          onClick={() => handleNavigateToUpdate(item.actionParameterId)}
                        />
                      </span>
                    ) : (
                      <span className='me-8' title='View'>
                        <i className='fa fa-eye disabled' />
                      </span>
                    )}

                    {isActionAuthorized('Update') ? (
                      <Link
                        className='text-white me-8'
                        to={`/qradar/action_parameter/update/${item.actionParameterId}`}
                        title='Edit'
                      >
                        <i className='fa fa-pencil cursor link' />
                      </Link>
                    ) : (
                      <span className='me-8' title='Edit'>
                        <i className='fa fa-pencil disabled' />
                      </span>
                    )}

                    {isActionAuthorized('Delete') ? (
                      <span className='' onClick={() => handleDelete(item)} title='Delete'>
                        <i className='fa fa-trash cursor red' />
                      </span>
                    ) : (
                      <span className='' title='Delete'>
                        <i className='fa fa-trash disabled' />
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='6' className='text-center'>
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {parameters.length > 0 && (
          <Pagination
            pageCount={Math.ceil(parameters.length / itemsPerPage)}
            handlePageClick={handlePageClick}
            itemsPerPage={itemsPerPage}
            handlePageSelect={handlePageSelect}
            forcePage={activePage}
          />
        )}

        <DeleteConfirmation2
          show={showDeleteConfirmation}
          message={
            itemToDelete
              ? `Are you sure you want to delete the Action Parameter "${itemToDelete.parameterName}"?`
              : ''
          }
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteConfirmation(false)
            setItemToDelete(null)
          }}
        />
      </div>
    </div>
  )
}

export default ActionParameter