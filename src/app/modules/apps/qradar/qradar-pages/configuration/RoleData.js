import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {ToastContainer, toast} from 'react-toastify'
import {notify, notifyFail} from '../components/notification/Notification'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import {useErrorBoundary} from 'react-error-boundary'
import {fetchRolesDeleteUrl, fetchRolesUrl} from '../../../../../api/ConfigurationApi'
import {fetchExportDataAddUrl, fetchLDPToolsDelete} from '../../../../../api/Api'
import DeleteConfirmation from '../../../../../../utils/DeleteConfirmation'
import Pagination from '../../../../../../utils/Pagination'
import useFeatureActions from './useFeatureActions'
import jsPDF from 'jspdf'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'

const RoleData = () => {
  const handleError = useErrorBoundary()
  const globalAdminRole = Number(sessionStorage.getItem('globalAdminRole'))
  const clientAdminRole = Number(sessionStorage.getItem('clientAdminRole'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const userID = Number(sessionStorage.getItem('userId'))
  const orgIdFromSession = Number(sessionStorage.getItem('orgId'))
  const [selectedOrganization, setSelectedOrganization] = useState(orgIdFromSession)
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState([])
  const [filterValue, setFilterValue] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activePage, setActivePage] = useState(0)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const toolId = Number(sessionStorage.getItem('toolID'))
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))

  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }
  const handleNavigateToUpdate = (id) => {
    navigate(`/qradar/roles-data/update/${id}`, {state: {save: true}})
  }

  const reload = async () => {
    try {
      setLoading(true)
      const data = await fetchRolesUrl(orgId, userID)
      setRoles(data)
      setLoading(false)
    } catch (error) {
      handleError(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [itemsPerPage])
  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = roles
    ? roles
        .filter((item) => item.searchText.toLowerCase().includes(filterValue.toLowerCase()))
        .slice(indexOfFirstItem, indexOfLastItem)
    : null
  const filteredList = filterValue
    ? roles.filter((item) => item.searchText.toLowerCase().includes(filterValue.toLowerCase()))
    : roles

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
  const handleDelete = (item) => {
    setItemToDelete(item)
    setShowConfirmation(true)
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      const data = {
        roleID: itemToDelete.roleID,
        deletedDate: new Date().toISOString(),
        deletedUserId: Number(sessionStorage.getItem('userId')),
      }

      try {
        const response = await fetchRolesDeleteUrl(data)
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
  const exportToExcel = async () => {
    if (!currentItems || currentItems.length === 0) return
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        Object.keys(currentItems[0]).join(','),
        ...currentItems.map((row) => Object.values(row).join(',')),
      ].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'role.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    const data = {
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: 'role',
    }
    try {
      await fetchExportDataAddUrl(data)
    } catch (error) {
      console.error(error)
    }
  }

  // Function to export data to PDF
  const exportToPDF = async () => {
    if (!currentItems || currentItems.length === 0) return
    const doc = new jsPDF()
    doc.autoTable({
      head: [Object.keys(currentItems[0])],
      body: currentItems.map((row) => Object.values(row)),
    })
    doc.save('role.pdf')
    const data = {
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: 'role',
    }
    try {
      await fetchExportDataAddUrl(data)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className='config card pad-10'>
      <ToastContainer />
      <div className='card-header no-pad'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>
            Roles ({currentItems ? currentItems.length : 0} /{' '}
            {filteredList ? filteredList.length : 0})
          </span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link
              to='/qradar/roles-data/add'
              className={`btn btn-new btn-small ${!isActionAuthorized('Create') ? 'disabled' : ''}`}
            >
              Add
            </Link>
          </div>
        </div>
      </div>
      <div className='row mt-2'>
        <div className='col-lg-9 mb-2 mt-2 header-filter'>
          <input
            type='text'
            placeholder='Search...'
            className='form-control'
            value={filterValue}
            onChange={handleFilterChange}
          />
        </div>
        <div className='col-lg-3 header-filter mb-2'>
          <div className=' d-flex justify-content-end align-items-center'>
            <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
              <DropdownToggle caret>
                Export <i className='fa fa-file-export link mg-left-10' />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={exportToExcel}>
                  Export to CSV <i className='fa fa-file-excel link float-right' />
                </DropdownItem>
                <DropdownItem onClick={exportToPDF}>
                  Export to PDF <i className='fa fa-file-pdf red float-right' />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className='card-body no-pad'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th>Role ID</th>
              <th>Role Name</th>
              <th>Organization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {currentItems !== null ? (
              currentItems.map((item, index) => (
                <tr key={index} className='fs-12'>
                  <td>{item.roleID}</td>
                  <td>{item.roleName}</td>
                  <td>{item.orgName}</td>
                  <td>
                    {isActionAuthorized('View') ? (
                      <span className='me-8' title='View'>
                        <i
                          className='fa fa-eye cursor'
                          onClick={() => handleNavigateToUpdate(item.roleID)}
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
                          to={`/qradar/roles-data/update/${item.roleID}`}
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
              ))
            ) : (
              <tr>
                <td colSpan='2'>No data found</td>
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
        {roles && (
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

export {RoleData}
