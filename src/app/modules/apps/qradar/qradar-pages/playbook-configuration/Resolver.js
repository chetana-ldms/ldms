import React, {useState, useEffect, useRef} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {fetchMasterData} from '../../../../../api/Api'
import {fetchRulesDelete} from '../../../../../api/Api' // Keeping fetchRulesDelete as delete logic was not requested to change
import {useErrorBoundary} from 'react-error-boundary'
import Pagination from '../../../../../../utils/Pagination'
import DeleteConfirmation2 from '../risk-upgrade/DeleteConfirmation2'
import useFeatureActions from '../configuration/useFeatureActions'
import {fetchResolverDeleteUrl, fetchResolverSearchUrl} from '../../../../../api/PlayBookConfigurationApi'

const Resolver = () => {
  const navigate = useNavigate()
  const handleError = useErrorBoundary()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const [loading, setLoading] = useState(false)
  const [tools, setTools] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activePage, setActivePage] = useState(0)
  const severityRef = useRef()
  const scenarioRef = useRef()
  const priorityRef = useRef()
  const [searchValue, setSearchValue] = useState('')
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [dropdownData, setDropdownData] = useState({
    severityDropDown: [],
    categoryDropDown: [], // Renamed from scenarioDropDown
    strategyTypeDropDown: [], // Renamed from priorityDropDown
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
    navigate(`/qradar/resolver/update/${id}`, {state: {save: true}})
  }

  useEffect(() => {
    const fetchAllMasterData = async () => {
      try {
        const [cat, sev, stratType] = await Promise.all([
          fetchMasterData({maserDataType: 'resolver_category', orgId, toolId}),
          fetchMasterData({maserDataType: 'resolver_severity', orgId, toolId}),
          fetchMasterData({maserDataType: 'resolver_strategy_type', orgId, toolId}),
        ])
        setDropdownData({
          severityDropDown: sev || [],
          categoryDropDown: cat || [],
          strategyTypeDropDown: stratType || [],
        })
      } catch (error) {
        console.log(error)
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
    const deletedDate = new Date().toISOString()
    const data = {
      resolverId: itemToDelete.resolverId,
      deletedDate,
      userId: deletedUserId,
      deleteReason: reason,
    }
    try {
      setLoading(true)
      const responce = await fetchResolverDeleteUrl(data)
      if (responce.isSuccess) {
        notify(responce.message || 'Resolver Deleted Successfully')
        setShowDeleteConfirmation(false)
        setItemToDelete(null)
        await reload()
      } else {
        notifyFail(responce.message || 'Resolver not Deleted')
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
      const payload = {active: true}

      if (searchValue) {
        payload.searchText = searchValue
      }
      const categoryId = Number(scenarioRef.current?.value)
      if (categoryId !== 0) {
        payload.categoryId = categoryId
      }
      const severityId = Number(severityRef.current?.value)
      if (severityId !== 0) {
        payload.severityId = severityId
      }
      const strategyTypeId = Number(priorityRef.current?.value)
      if (strategyTypeId !== 0) {
        payload.strategyTypeId = strategyTypeId
      }

      const response = await fetchResolverSearchUrl(payload)
      setTools(Array.isArray(response?.data) ? response.data : []) // Ensure tools is always an array
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
                Resolver ({currentItems ? currentItems.length : 0} / {tools ? tools.length : 0})
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
                placeholder='Search Resolver'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button className='btn btn-sm btn-primary' onClick={reload}>
                <i className='fas fa-search' />
              </button>
            </div>

            <div className='d-flex align-items-center gap-3 mb-1 mt-2'>
              <div className='w-150px'>
                <select className='form-select form-select-sm' ref={scenarioRef}>
                  {' '}
                  {/* Changed to Category */}
                  <option value=''>Select Category</option>
                  {dropdownData.categoryDropDown.map((item) => (
                    <option key={item.dataID} value={item.dataID}>
                      {item.dataValue}
                    </option>
                  ))}
                </select>
              </div>
              <div className='w-150px'>
                <select className='form-select form-select-sm' ref={severityRef}>
                  <option value=''>Select Severity</option>
                  {dropdownData.severityDropDown.map((item) => (
                    <option key={item.dataID} value={item.dataID}>
                      {item.dataValue}
                    </option>
                  ))}
                </select>
              </div>
              <div className='w-150px'>
                <select className='form-select form-select-sm' ref={priorityRef}>
                  {' '}
                  {/* Changed to Strategy Type */}
                  <option value=''>Strategy Type</option>
                  {dropdownData.strategyTypeDropDown.map((item) => (
                    <option key={item.dataID} value={item.dataID}>
                      {item.dataValue}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-1 float-end text-end'>
          <Link
            to='/qradar/resolver/add'
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
              <th>Resolver Name</th>
              <th>Code</th>
              <th>Category</th>
              <th>Severity</th>
              <th>Strategy Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {currentItems !== null && currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={index} className='fs-12'>
                  <td>{item.resolverName}</td>
                  <td>{item.resolverCode}</td>
                  <td>{item.categoryName}</td>
                  <td>{item.severityName}</td>
                  <td>{item.strategyTypeName}</td>
                  <td>{item.enabled === 1 ? 'Enabled' : 'Disabled'}</td>
                  <td>
                    {isActionAuthorized('View') ? (
                      <span className='me-8' title='View'>
                        <i
                          className='fa fa-eye cursor'
                          onClick={() => handleNavigateToUpdate(item.resolverId)}
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
                          to={`/qradar/resolver/update/${item.resolverId}`}
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
                <td colSpan='7'>No data found</td>
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
              ? `Are you sure you want to delete the resolver "${itemToDelete.resolverName}"?`
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

export {Resolver}
