
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
import {fetchConnectionTypeSearchUrl, fetchConnectionTypeDeleteUrl} from '../../../../../api/ConnectionApi'

const ConnectionType = () => {
  const navigate = useNavigate()
  const handleError = useErrorBoundary()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))

  const [loading, setLoading] = useState(false)
  const [connectionTypes, setConnectionTypes] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activePage, setActivePage] = useState(0)

  const categoryRef = useRef()
  const providerRef = useRef()

  const [searchValue, setSearchValue] = useState('')
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const [dropdownData, setDropdownData] = useState({
    categories: [],
    providers: [],
  })

  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))
  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }

  const handleNavigateToUpdate = (id) => {
    navigate(`/qradar/connection-types/update/${id}`, {state: {save: true}})
  }

  useEffect(() => {
    const fetchAllMasterData = async () => {
      try {
        const [cat, prov] = await Promise.all([
          fetchMasterData({maserDataType: 'connection_category', orgId, toolId}),
          fetchMasterData({maserDataType: 'provider_type', orgId, toolId}),
        ])
        setDropdownData({
          categories: cat || [],
          providers: prov || [],
        })
      } catch (error) {
        console.error(error)
        notifyFail('Failed to load filter options.')
      }
    }
    fetchAllMasterData()
  }, [orgId, toolId])

  const handleDelete = (item) => {
    setItemToDelete(item)
    setShowDeleteConfirmation(true)
  }

  const handleDeleteConfirm = async (reason) => {
    if (!itemToDelete) return
    const deletedUserId = Number(sessionStorage.getItem('userId'))
    const data = {
      connectionTypeId: itemToDelete.connectionTypeId,
      userId: deletedUserId,
      deleteReason: reason,
    }
    try {
      setLoading(true)
      const response = await fetchConnectionTypeDeleteUrl(data)
      if (response?.isSuccess) {
        notify(response.message || 'Connection Type Deleted Successfully')
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
      if (categoryId && categoryId !== 0) payload.connectionCategoryId = categoryId

      const providerId = Number(providerRef.current?.value)
      if (providerId && providerId !== 0) payload.providerTypeId = providerId

      const response = await fetchConnectionTypeSearchUrl(payload)
      setConnectionTypes(Array.isArray(response?.data) ? response.data : [])
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
  const currentItems = connectionTypes ? connectionTypes.slice(indexOfFirstItem, indexOfLastItem) : null

  useEffect(() => {
    reload()
  }, [])

  return (
    <div className='config card pad-10'>
      <ToastContainer />
      <div className='row'>
        <div className='col-md-6'>
          <h3 className='card-label fw-bold fs-3 mb-1'>
            Connection Type ({currentItems ? currentItems.length : 0} / {connectionTypes ? connectionTypes.length : 0})
          </h3>
        </div>

        <div className='col-md-5'>
          <div className='card-title header-filter'>
            <div className='input-group'>
              <input
                type='text'
                className='form-control form-control-sm'
                placeholder='Search Connection Type'
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
                <select className='form-select form-select-sm' ref={providerRef}>
                  <option value={0}>Provider</option>
                  {dropdownData.providers.map((item) => (
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
            to='/qradar/connection-types/add'
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
              <th>Name</th>
              <th>Code</th>
              <th>Category</th>
              <th>Provider</th>
              <th>System</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {currentItems !== null && currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.connectionTypeId} className='fs-12'>
                  <td>{item.connectionTypeName || '-'}</td>
                  <td>{item.connectionTypeCode || '-'}</td>
                  <td>{item.connectionCategoryName || '-'}</td>
                  <td>{item.providerTypeName || '-'}</td>
                  <td>{item.isSystem ? 'Yes' : 'No'}</td>
                  <td>
                    {isActionAuthorized('View') ? (
                      <span className='me-8' title='View'>
                        <i
                          className='fa fa-eye cursor'
                          onClick={() => handleNavigateToUpdate(item.connectionTypeId)}
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
                        to={`/qradar/connection-types/update/${item.connectionTypeId}`}
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

        {connectionTypes.length > 0 && (
          <Pagination
            pageCount={Math.ceil(connectionTypes.length / itemsPerPage)}
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
              ? `Are you sure you want to delete the connection type "${itemToDelete.connectionTypeName}"?`
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

export default ConnectionType