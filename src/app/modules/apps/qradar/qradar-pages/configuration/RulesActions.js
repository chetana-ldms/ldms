import React, {useState, useEffect, useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {fetchRuleActionDelete} from '../../../../../api/Api'
import {fetchRuleActions} from '../../../../../api/ConfigurationApi'
import {useErrorBoundary} from 'react-error-boundary'
import useFeatureActions from './useFeatureActions'
import Pagination from '../../../../../../utils/Pagination'
import DeleteConfirmation2 from '../risk-upgrade/DeleteConfirmation2'

const RulesActions = () => {
  const navigate = useNavigate()
  const handleError = useErrorBoundary()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))

  const [loading, setLoading] = useState(false)
  const [tools, setTools] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activePage, setActivePage] = useState(0)

  const [searchValue, setSearchValue] = useState('')
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))

  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }

  const handleNavigateToUpdate = (id) => {
    navigate(`/qradar/rules-actions/update/${id}`, {state: {save: true}})
  }

  const handleDelete = (item) => {
    setItemToDelete(item)
    setShowDeleteConfirmation(true)
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return
    const deletedUserId = Number(sessionStorage.getItem('userId'))
    const data = {
      actionId: itemToDelete.actionId,
      userId: deletedUserId,
    }
    try {
      setLoading(true)
      const response = await fetchRuleActionDelete(data)
      if (response?.isSuccess) {
        notify(response.message || 'Rule Action Deleted Successfully')
        setShowDeleteConfirmation(false)
        setItemToDelete(null)
        await reload()
      } else {
        notifyFail(response?.message || 'Failed to delete Rule Action')
      }
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const reload = async () => {
    try {
      setLoading(true)
      const payload = {}
      if (searchValue.trim()) {
        payload.searchText = searchValue.trim()
      }
      const response = await fetchRuleActions(payload)
      setTools(Array.isArray(response?.actions) ? response.actions : [])
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
  const currentItems = tools ? tools.slice(indexOfFirstItem, indexOfLastItem) : null

  useEffect(() => {
    reload()
  }, [])

  return (
    <div className='config card pad-10'>
      <ToastContainer />
      <div className='row'>
        <div className='col-md-3'>
          <h3 className='card-label fw-bold fs-3 mb-1'>
            Actions ({currentItems ? currentItems.length : 0} / {tools ? tools.length : 0})
          </h3>
        </div>

        <div className='col-md-8'>
          <div className='card-title header-filter'>
            <div className='input-group'>
              <input
                type='text'
                className='form-control form-control-sm'
                placeholder='Search Actions'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && reload()}
              />
              <button className='btn btn-sm btn-primary' onClick={reload}>
                <i className='fas fa-search' />
              </button>
            </div>
          </div>
        </div>

        <div className='col-md-1 text-end'>
          <Link
            to='/qradar/rules-actions/add'
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
              <th>Action Name</th>
              <th>Description</th>
              <th>Script</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {currentItems !== null && currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={index} className='fs-12'>
                  <td>{item.actionName || '-'}</td>
                  <td>{item.description || '-'}</td>
                  <td>{item.scriptName || '-'}</td>
                  <td>
                    {isActionAuthorized('View') ? (
                      <span className='me-8' title='View'>
                        <i
                          className='fa fa-eye cursor'
                          onClick={() => handleNavigateToUpdate(item.actionId)}
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
                        to={`/qradar/rules-actions/update/${item.actionId}`}
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
                <td colSpan='5' className='text-center'>
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {tools.length > 0 && (
          <Pagination
            pageCount={Math.ceil(tools.length / itemsPerPage)}
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
              ? `Are you sure you want to delete the Rule Action "${itemToDelete.actionName}"?`
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

export {RulesActions}
