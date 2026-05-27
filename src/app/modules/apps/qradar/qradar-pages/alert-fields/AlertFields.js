import React, {useState, useEffect, useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {fetchMasterData, fetchLDPTools} from '../../../../../api/Api'
import {useErrorBoundary} from 'react-error-boundary'
import Pagination from '../../../../../../utils/Pagination'
import DeleteConfirmation2 from '../risk-upgrade/DeleteConfirmation2'
import useFeatureActions from '../configuration/useFeatureActions'
import {fetchAlertFieldsUrl, fetchDeleteAlertFieldsUrl} from '../../../../../api/AlertFieldsApi'

const AlertFields = () => {
  const navigate = useNavigate()
  const handleError = useErrorBoundary()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolIdSession = Number(sessionStorage.getItem('toolID'))

  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activePage, setActivePage] = useState(0)

  const toolRef = useRef()
  const categoryRef = useRef()
  const dataTypeRef = useRef()

  const [searchValue, setSearchValue] = useState('')
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const [dropdownData, setDropdownData] = useState({
    tools: [],
    categories: [],
    dataTypes: [],
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
    navigate(`/qradar/alert-fields/update/${id}`, {state: {save: true}})
  }

  useEffect(() => {
    const fetchAllMasterData = async () => {
      try {
        const [tools, cat, dType] = await Promise.all([
          fetchLDPTools(),
          fetchMasterData({maserDataType: 'field_category', orgId, toolId: toolIdSession}),
          fetchMasterData({maserDataType: 'global_data_type', orgId, toolId: toolIdSession}),
        ])
        setDropdownData({
          tools: tools || [],
          categories: cat || [],
          dataTypes: dType || [],
        })
      } catch (error) {
        console.error(error)
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
      fieldId: itemToDelete.fieldId,
      userId: deletedUserId,
      deletedReason: reason,
    }
    try {
      setLoading(true)
      const response = await fetchDeleteAlertFieldsUrl(data)
      if (response?.isSuccess) {
        notify(response.message || 'Field Deleted Successfully')
        setShowDeleteConfirmation(false)
        setItemToDelete(null)
        await reload()
      } else {
        notifyFail(response?.message || 'Failed to delete field')
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
      
      const toolId = Number(toolRef.current?.value)
      if (toolId) payload.toolId = toolId

      const categoryId = Number(categoryRef.current?.value)
      if (categoryId) payload.fieldCategoryId = categoryId

      const dataTypeId = Number(dataTypeRef.current?.value)
      if (dataTypeId) payload.dataTypeId = dataTypeId

      const response = await fetchAlertFieldsUrl(payload)
      setFields(Array.isArray(response?.data) ? response.data : [])
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
  const currentItems = fields ? fields.slice(indexOfFirstItem, indexOfLastItem) : null

  useEffect(() => {
    reload()
  }, [])

  return (
    <div className='config card pad-10'>
      <ToastContainer />
      <div className='row'>
        <div className='col-md-4'>
          <h3 className='card-label fw-bold fs-3 mb-1'>
            Alert Fields ({currentItems ? currentItems.length : 0} / {fields ? fields.length : 0})
          </h3>
        </div>

        <div className='col-md-7'>
          <div className='card-title header-filter'>
            <div className='input-group'>
              <input
                type='text'
                className='form-control form-control-sm'
                placeholder='Search Fields'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button className='btn btn-sm btn-primary' onClick={reload}>
                <i className='fas fa-search' />
              </button>
            </div>

            <div className='d-flex align-items-center gap-3 mb-1 mt-2'>
              <div className='w-150px'>
                <select className='form-select form-select-sm' ref={toolRef}>
                  <option value={0}>Select Tool</option>
                  {dropdownData.tools.map((item) => (
                    <option key={item.toolId} value={item.toolId}>
                      {item.toolName}
                    </option>
                  ))}
                </select>
              </div>
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
              <div className='w-150px'>
                <select className='form-select form-select-sm' ref={dataTypeRef}>
                  <option value={0}>Data Type</option>
                  {dropdownData.dataTypes.map((item) => (
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
            to='/qradar/alert-fields/add'
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
              <th>Field Name</th>
              <th>Code</th>
              <th>Display Name</th>
              <th>Category</th>
              <th>Data Type</th>
              <th>Tool</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {currentItems !== null && currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={index} className='fs-12'>
                  <td>{item.fieldName}</td>
                  <td>{item.fieldCode}</td>
                  <td>{item.displayName}</td>
                  <td>
                    {item.fieldCategoryName ||
                      dropdownData.categories.find((c) => c.dataID === item.fieldCategoryId)
                        ?.dataValue ||
                      '--'}
                  </td>
                  <td>
                    {item.dataTypeName ||
                      dropdownData.dataTypes.find((d) => d.dataID === item.dataTypeId)?.dataValue ||
                      '--'}
                  </td>
                  <td>
                    {item.toolName ||
                      dropdownData.tools.find((t) => t.toolId === item.toolId)?.toolName ||
                      '--'}
                  </td>
                  <td>
                    {isActionAuthorized('View') ? (
                      <span className='me-8' title='View'>
                        <i
                          className='fa fa-eye cursor'
                          onClick={() => handleNavigateToUpdate(item.fieldId)}
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
                        to={`/qradar/alert-fields/update/${item.fieldId}`}
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
                <td colSpan='7' className='text-center'>No data found</td>
              </tr>
            )}
          </tbody>
        </table>

        {fields.length > 0 && (
          <Pagination
            pageCount={Math.ceil(fields.length / itemsPerPage)}
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
              ? `Are you sure you want to delete the alert field "${itemToDelete.fieldName}"?`
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

export default AlertFields