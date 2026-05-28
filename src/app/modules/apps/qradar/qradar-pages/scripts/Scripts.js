import React, {useState, useEffect, useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {fetchMasterData} from '../../../../../api/Api'
import {useErrorBoundary} from 'react-error-boundary'
import Pagination from '../../../../../../utils/Pagination'
import DeleteConfirmation2 from '../risk-upgrade/DeleteConfirmation2'
import useFeatureActions from '../configuration/useFeatureActions'
import {fetchScriptSearchUrl, fetchScriptDeleteUrl} from '../../../../../api/ScriptsApi'

const Scripts = () => {
  const navigate = useNavigate()
  const handleError = useErrorBoundary()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolIdSession = Number(sessionStorage.getItem('toolID'))

  const [loading, setLoading] = useState(false)
  const [scripts, setScripts] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activePage, setActivePage] = useState(0)

  const categoryRef = useRef()
  const typeRef = useRef()
  const executionRef = useRef()
  const osRef = useRef()

  const [searchValue, setSearchValue] = useState('')
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const [dropdownData, setDropdownData] = useState({
    categories: [],
    types: [],
    executionTypes: [],
    operatingSystems: [],
  })

  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))
  const {featureActions} = useFeatureActions(orgId, toolIdSession, roleId, featureId)

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }

  const handleNavigateToUpdate = (id) => {
    navigate(`/qradar/scripts/update/${id}`, {state: {save: true}})
  }

  useEffect(() => {
    const fetchAllMasterData = async () => {
      try {
        const [cat, type, exec, os] = await Promise.all([
          fetchMasterData({maserDataType: 'script_category', orgId, toolId: toolIdSession}),
          fetchMasterData({maserDataType: 'script_type', orgId, toolId: toolIdSession}),
          fetchMasterData({maserDataType: 'executor_type', orgId, toolId: toolIdSession}),
          fetchMasterData({maserDataType: 'operating_system', orgId, toolId: toolIdSession}),
        ])
        setDropdownData({
          categories: cat || [],
          types: type || [],
          executionTypes: exec || [],
          operatingSystems: os || [],
        })
      } catch (error) {
        console.error(error)
        notifyFail('Failed to load filter options.')
      }
    }
    fetchAllMasterData()
  }, [orgId, toolIdSession])

  const handleDelete = (item) => {
    setItemToDelete(item)
    setShowDeleteConfirmation(true)
  }

  const handleDeleteConfirm = async (reason) => {
    if (!itemToDelete) return
    const deletedUserId = Number(sessionStorage.getItem('userId'))
    const data = {
      scriptId: itemToDelete.scriptId,
      userId: deletedUserId,
      deleteReason: reason,
    }
    try {
      setLoading(true)
      const response = await fetchScriptDeleteUrl(data)
      if (response?.isSuccess) {
        notify(response.message || 'Script Deleted Successfully')
        setShowDeleteConfirmation(false)
        setItemToDelete(null)
        await reload()
      } else {
        notifyFail(response?.message || 'Failed to delete script')
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

      if (searchValue) payload.searchText = searchValue
      
      const categoryId = Number(categoryRef.current?.value)
      if (categoryId) payload.scriptCategoryId = categoryId

      const typeId = Number(typeRef.current?.value)
      if (typeId) payload.scriptTypeId = typeId

      const executionTypeId = Number(executionRef.current?.value)
      if (executionTypeId) payload.executionTypeId = executionTypeId

      const osId = Number(osRef.current?.value)
      if (osId) payload.operatingSystemId = osId

      const response = await fetchScriptSearchUrl(payload)
      setScripts(Array.isArray(response?.data) ? response.data : [])
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
  const currentItems = scripts ? scripts.slice(indexOfFirstItem, indexOfLastItem) : null

  useEffect(() => {
    reload()
  }, [])

  return (
    <div className='config card pad-10'>
      <ToastContainer />
      <div className='row'>
        <div className='col-md-3'>
          <h3 className='card-label fw-bold fs-3 mb-1'>
            Scripts ({currentItems ? currentItems.length : 0} / {scripts ? scripts.length : 0})
          </h3>
        </div>

        <div className='col-md-8'>
          <div className='card-title header-filter'>
            <div className='input-group'>
              <input
                type='text'
                className='form-control form-control-sm'
                placeholder='Search Scripts'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && reload()}
              />
              <button className='btn btn-sm btn-primary' onClick={reload}>
                <i className='fas fa-search' />
              </button>
            </div>

            <div className='d-flex align-items-center gap-2 mb-1 mt-2 flex-wrap'>
              <div className='w-150px'>
                <select className='form-select form-select-sm' ref={categoryRef}>
                  <option value={0}>Category</option>
                  {dropdownData.categories.map((item) => (
                    <option key={item.dataID} value={item.dataID}>
                      {item.dataValue}
                    </option>
                  ))}
                </select>
              </div>
              <div className='w-120px'>
                <select className='form-select form-select-sm' ref={typeRef}>
                  <option value={0}>Type</option>
                  {dropdownData.types.map((item) => (
                    <option key={item.dataID} value={item.dataID}>
                      {item.dataValue}
                    </option>
                  ))}
                </select>
              </div>
              <div className='w-150px'>
                <select className='form-select form-select-sm' ref={executionRef}>
                  <option value={0}>Execution</option>
                  {dropdownData.executionTypes.map((item) => (
                    <option key={item.dataID} value={item.dataID}>
                      {item.dataValue}
                    </option>
                  ))}
                </select>
              </div>
              <div className='w-120px'>
                <select className='form-select form-select-sm' ref={osRef}>
                  <option value={0}>OS</option>
                  {dropdownData.operatingSystems.map((item) => (
                    <option key={item.dataID} value={item.dataID}>
                      {item.dataValue}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className='col-md-1 text-end'>
          <Link
            to='/qradar/scripts/add'
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
              <th>Script Name</th>
              <th>Category</th>
              <th>Type</th>
              <th>Execution</th>
              <th>OS</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {currentItems !== null && currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.scriptId} className='fs-12'>
                  <td>{item.scriptName || '-'}</td>
                  <td>{item.scriptCategoryName || '-'}</td>
                  <td>{item.scriptTypeName || '-'}</td>
                  <td>{item.executionTypeName || '-'}</td>
                  <td>{item.operatingSystemName || '-'}</td>
                  <td>
                    {isActionAuthorized('View') ? (
                      <span className='me-8' title='View'>
                        <i
                          className='fa fa-eye cursor'
                          onClick={() => handleNavigateToUpdate(item.scriptId)}
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
                        to={`/qradar/scripts/update/${item.scriptId}`}
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
                <td colSpan='6' className='text-center'>No data found</td>
              </tr>
            )}
          </tbody>
        </table>

        {scripts.length > 0 && (
          <Pagination
            pageCount={Math.ceil(scripts.length / itemsPerPage)}
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
              ? `Are you sure you want to delete the script "${itemToDelete.scriptName}"?`
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

export default Scripts