import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { ToastContainer } from 'react-toastify'
import { notify, notifyFail } from '../components/notification/Notification'
import 'react-toastify/dist/ReactToastify.css'
import { fetchOrganizations, fetchUserDelete } from '../../../../../api/Api'
import { fetchAllUsersUrl } from '../../../../../api/ConfigurationApi'
import { useErrorBoundary } from 'react-error-boundary'
import DeleteConfirmation from '../../../../../../utils/DeleteConfirmation'
import Pagination from '../../../../../../utils/Pagination'
import useFeatureActions from './useFeatureActions'
import { fetchOrganizationToolsSecurityUrl } from '../../../../../api/securityApi'

const UserData = () => {
  const handleError = useErrorBoundary()
  const userID = Number(sessionStorage.getItem('userId'))
  const globalAdminRole = Number(sessionStorage.getItem('globalAdminRole'))
  const clientAdminRole = Number(sessionStorage.getItem('clientAdminRole'))
  const orgIdFromSession = Number(sessionStorage.getItem('orgId'))
  const [selectedOrganization, setSelectedOrganization] = useState(orgIdFromSession)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [filterValue, setFilterValue] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activePage, setActivePage] = useState(0)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [tools, setTools] = useState([])
  console.log('tools', tools)
  const [selectedToolId, setSelectedToolId] = useState('')
  const navigate = useNavigate()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))

  const { featureActions } = useFeatureActions(orgId, toolId, roleId, featureId)

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }
  const handleNavigateToUpdate = (id) => {
    navigate(`/qradar/users-data/update/${id}`, { state: { save: true } })
  }

  // Fetch organizations and tools for default org on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const organizationsResponse = await fetchOrganizations()
        setOrganizations(organizationsResponse)
        // Fetch tools for default org
        if (orgIdFromSession) {
          const toolsList = await fetchOrganizationToolsSecurityUrl(orgIdFromSession)
          setTools(toolsList || [])
        }
      } catch (error) {
        handleError(error)
      }
    }
    fetchData()
  }, [orgIdFromSession, handleError])

  // Fetch users when org or tool changes
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const data = await fetchAllUsersUrl(
          selectedOrganization,
          selectedToolId ? Number(selectedToolId) : 0,
          userID
        )
        setUsers(data)
      } catch (error) {
        handleError(error)
      } finally {
        setLoading(false)
      }
    }
    if (selectedOrganization && userID) {
      fetchUsers()
    }
  }, [selectedOrganization, selectedToolId, userID, handleError])

  const handleDelete = (item) => {
    setItemToDelete(item)
    setShowConfirmation(true)
  }
  const confirmDelete = async () => {
    if (itemToDelete) {
      const data = {
        userID: itemToDelete.userID,
        deletedDate: new Date().toISOString(),
        deletedUserId: Number(sessionStorage.getItem('userId')),
      }

      try {
        const response = await fetchUserDelete(data)
        const { isSuccess, message } = response
        if (isSuccess) {
          notify(message)
          // reload users
          const usersData = await fetchAllUsersUrl(
            selectedOrganization,
            selectedToolId ? Number(selectedToolId) : 0,
            userID
          )
          setUsers(usersData)
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

  // When organization changes, fetch tools for that org and reset tool selection
  const handleOrganizationChange = async (e) => {
    const newOrganizationId = Number(e.target.value)
    setSelectedOrganization(newOrganizationId)
    setSelectedToolId('') // Reset tool selection
    setTools([]) // Clear tools while loading
    try {
      const toolsList = await fetchOrganizationToolsSecurityUrl(newOrganizationId)
      setTools(toolsList || [])
    } catch (error) {
      handleError(error)
    }
  }

  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = users
    ? users
        .filter((item) => item.searchText?.toLowerCase().includes(filterValue.toLowerCase()))
        .slice(indexOfFirstItem, indexOfLastItem)
    : null
  const filteredList = filterValue
    ? users.filter((item) => item.searchText?.toLowerCase().includes(filterValue.toLowerCase()))
    : users

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(0)
    setActivePage(0)
  }
  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected)
    setActivePage(selected.selected)
  }
  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
    setCurrentPage(0)
    setActivePage(0)
  }

  return (
    <div className='config card pad-10'>
      <ToastContainer />

      <div className='header-filter row'>
        <div className='col-lg-4'>
          <h3 className='lh-40'>
            Users ({currentItems ? currentItems.length : 0} / {filteredList ? filteredList.length : 0})
          </h3>
        </div>

        <div className='col-lg-6 d-flex align-items-center'>
          {/* Organization Dropdown */}
          <label className='form-label fw-normal fc-gray fs-14 lh-40 float-left'>
            <span>Organization: </span>
          </label>
          <span className='float-left' style={{ minWidth: 180 }}>
            <select
              className='form-select form-select-solid bg-blue-light mg-left-10'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              value={selectedOrganization}
              onChange={handleOrganizationChange}
            >
              {globalAdminRole === 1 &&
                organizations?.length > 0 &&
                organizations.map((item, index) => (
                  <option key={index} value={item.orgID}>
                    {item.orgName}
                  </option>
                ))}

              {globalAdminRole !== 1 &&
                organizations?.length > 0 &&
                organizations
                  .filter((item) => item.orgID === orgId)
                  .map((item, index) => (
                    <option key={index} value={item.orgID}>
                      {item.orgName}
                    </option>
                  ))}
            </select>
          </span>
          {/* Tools Dropdown */}
          <label className='form-label fw-normal fc-gray fs-14 lh-40 float-left ms-5'>
            <span>Tool: </span>
          </label>
          <span className='float-left' style={{ minWidth: 180 }}>
            <select
              className='form-select form-select-solid bg-blue-light mg-left-10'
              value={selectedToolId || ''}
              onChange={(e) => setSelectedToolId(e.target.value)}
              disabled={!tools.length}
            >
              <option value=''>Select Tool</option>
              {tools.map((tool) => (
                <option key={tool.toolId} value={tool.toolId}>
                  {tool.toolName}
                </option>
              ))}
            </select>
          </span>
        </div>
        <div className='col-lg-2 fs-11 text-right'>
          <Link
            to='/qradar/users-data/add'
            className={`btn btn-new btn-small ${!isActionAuthorized('Create') ? 'disabled' : ''}`}
          >
            Add New User
          </Link>
        </div>
      </div>
      <div className='row mb-5 mt-2'>
        <div className='col-lg-12 header-filter'>
          <input
            type='text'
            placeholder='Search...'
            className='form-control'
            value={filterValue}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      <div className='card-body no-pad'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th className='min-w-50px'>User ID</th>
              <th className='min-w-50px'>User Name</th>
              <th className='min-w-50px'>User Email</th>
              <th className='min-w-50px'>User Role</th>
              <th className='min-w-50px'>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {currentItems !== null && currentItems !== undefined ? (
              currentItems?.map((item, index) => {
                if (globalAdminRole === 1 || clientAdminRole === 1 || userID === item.userID) {
                  return (
                    <tr key={index} className='fs-12'>
                      <td>{item?.userID}</td>
                      <td>{item?.name}</td>
                      <td>{item?.emailId}</td>
                      <td>{item?.roleName}</td>
                      <td>
                        {isActionAuthorized('View') ? (
                          <span className='me-8' title='View'>
                            <i
                              className='fa fa-eye cursor'
                              onClick={() => handleNavigateToUpdate(item.userID)}
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
                              to={`/qradar/users-data/update/${item.userID}`}
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
                  )
                }
                return null
              })
            ) : (
              <tr>
                <td colSpan='6' className='text-center'>
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {showConfirmation && (
          <DeleteConfirmation
            show={showConfirmation}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
        {users && (
          <Pagination
            pageCount={Math.ceil(filteredList.length / itemsPerPage)}
            handlePageClick={handlePageClick}
            itemsPerPage={itemsPerPage}
            handlePageSelect={handlePageSelect}
            forcePage={activePage}
          />
        )}
      </div>
    </div>
  )
}

export { UserData }
