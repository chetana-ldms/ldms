import React, {useState, useEffect, useRef} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {fetchRulesDelete, fetchMasterData} from '../../../../../api/Api'
import axios from 'axios'
import {fetchRules} from '../../../../../api/ConfigurationApi'
import {useErrorBoundary} from 'react-error-boundary'
import useFeatureActions from './useFeatureActions'
import Pagination from '../../../../../../utils/Pagination'
import DeleteConfirmation2 from '../risk-upgrade/DeleteConfirmation2'

const Rules = () => {
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
    navigate(`/qradar/rules-engine/update/${id}`, {state: {save: true}})
  }

  const handleDelete = (item) => {
    setItemToDelete(item)
    setShowDeleteConfirmation(true)
  }

  const handleDeleteConfirm = async (reason) => {
    if (!itemToDelete) return
    const deletedUserId = Number(sessionStorage.getItem('userId'))
    const deletedDate = new Date().toISOString()
    const data = {
      ruleId: itemToDelete.ruleId,
      deletedDate,
      userId: deletedUserId,
      deleteReason: reason,
    }
    try {
      setLoading(true)
      const responce = await fetchRulesDelete(data)
      if (responce.isSuccess) {
        notify('Rule Deleted')
        setShowDeleteConfirmation(false)
        setItemToDelete(null)
        await reload()
      } else {
        notifyFail(responce.message || 'Rule not Deleted')
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
      const payload = {
        searchText: searchValue || '',
      }
      const response = await fetchRules(payload)
      setTools(Array.isArray(response?.rules) ? response.rules : []) // Ensure tools is always an array
      setLoading(false)
    } catch (error) {
      handleError(error)
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

  const getPlaybooksText = (rule) => {
    const playbooks = Array.isArray(rule?.playbooks) ? rule.playbooks : []
    if (!playbooks.length) return 'No playbooks'
    return playbooks
      .map((playbook) => playbook?.playbookName || playbook?.name || 'Unnamed playbook')
      .join(', ')
  }

  const getGroupsText = (rule) => {
    const groups = Array.isArray(rule?.groups) ? rule.groups : []
    return groups.length ? groups.length : 0
  }

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      reload()
    }
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
        <div className='col-md-5'>
          <div className='d-flex justify-content-between border-0'>
            <h3 className='align-items-start flex-column'>
              {/* <span className='fw-bold fs-3'></span> */}
              <span className='card-label fw-bold fs-3 mb-1'>
                Rule Engine ({currentItems ? currentItems.length : 0} / {tools ? tools.length : 0})
              </span>
            </h3>
          </div>
        </div>

        <div className='col-md-6'>
          <div className='card-title header-filter'>
            <div className='input-group'>
              <input
                type='text'
                className='form-control form-control-sm'
                placeholder='Search rule or playbook'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <button type='button' className='btn btn-sm btn-primary' onClick={reload}>
                <i className='fas fa-search' />
              </button>
            </div>

          </div>
        </div>
        <div className='col-md-1 float-end text-end'>
          <Link
            to='/qradar/rules-engine/add'
            className={`btn btn-new btn-small ${!isActionAuthorized('Create') ? 'disabled' : ''}`}
          >
            Add
          </Link>
        </div>
      </div>

      <div className='card-body no-pad'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th>Rule Name</th>
              <th>Groups</th>
              <th>Playbooks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {currentItems !== null && currentItems.length > 0 ? (
              currentItems?.map((item, index) => (
                <tr key={item?.ruleId || index} className='fs-12'>
                  <td>{item?.ruleName || '--'}</td>
                  <td>{getGroupsText(item)}</td>
                  <td>{getPlaybooksText(item)}</td>
                  <td>
                    {isActionAuthorized('View') ? (
                      <span className='me-8' title='View'>
                        <i
                          className='fa fa-eye cursor'
                          onClick={() => handleNavigateToUpdate(item.ruleId)}
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
                          to={`/qradar/rules-engine/update/${item.ruleId}`}
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
                      <span
                        className='ms-8'
                        onClick={() => {
                          handleDelete(item)
                        }}
                        title='Delete'
                      >
                        <i className='fa fa-trash cursor red' />
                      </span>
                    ) : (
                      <span className='ms-8' title='Delete'>
                        <i className='fa fa-trash disabled' />
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='4'>No data found</td>
              </tr>
            )}
          </tbody>
        </table>

        {tools && (
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
              ? `Are you sure you want to delete the rule "${itemToDelete.ruleName}"?`
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

export {Rules}
