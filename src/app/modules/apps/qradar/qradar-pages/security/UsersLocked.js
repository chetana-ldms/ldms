import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DeleteConfirmation from '../../../../../../utils/DeleteConfirmation'
import Pagination from '../../../../../../utils/Pagination'
import {fetchOrganizationsUrl} from '../../../../../api/ConfigurationApi'
import {fetchOrganizationDelete} from '../../../../../api/Api'
import {notify, notifyFail} from '../components/notification/Notification'
import {useErrorBoundary} from 'react-error-boundary'
import useFeatureActions from '../configuration/useFeatureActions'
import {fetchAuthUserlockedUrl, fetchAuthUserUnlockUrl} from '../../../../../api/securityApi'
import {getCurrentTimeZone} from '../../../../../../utils/helper'

const UsersLocked = () => {
  const handleError = useErrorBoundary()
  const [tools, setTools] = useState([])
  const [filterValue, setFilterValue] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activePage, setActivePage] = useState(0)
  const [items, setItems] = useState([])
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false)
  const [loading, setLoading] = useState(false)
  const userID = Number(sessionStorage.getItem('userId'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))

  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const reload = async () => {
    try {
      setLoading(true)
      const response = await fetchAuthUserlockedUrl(orgId)
      setTools(response)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
    setItems([])
    setIsCheckboxSelected(false)
  }, [itemsPerPage])

  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = tools
    ? tools
        .filter((item) => item.name.toLowerCase().includes(filterValue.toLowerCase()))
        .slice(indexOfFirstItem, indexOfLastItem)
    : null
  const filteredList = filterValue
    ? tools.filter((item) => item.name.toLowerCase().includes(filterValue.toLowerCase()))
    : tools

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

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }
  const handleselectedAlert = (item, e) => {
    const {checked} = e.target

    if (checked) {
      setItems([...items, item])
      setIsCheckboxSelected(true)
    } else {
      const updatedItems = items.filter((i) => i.userID !== item.userID)
      setItems(updatedItems)
      setIsCheckboxSelected(updatedItems.length > 0)
    }
  }
  const handleUnlockUser = async () => {
    const data = {
      userIds: items.map((item) => item.userID),
    }

    try {
      const response = await fetchAuthUserUnlockUrl(data)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        await reload()
        setItems([])
        setIsCheckboxSelected(false)
      } else {
        notifyFail(message)
      }
    } catch (error) {
      handleError(error)
    }
  }
  return (
    <div className='card pad-10 config'>
      <ToastContainer />
      <div className='card-header no-pad'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>
            Locked Users ({currentItems ? currentItems.length : 0} /{' '}
            {filteredList ? filteredList.length : 0})
          </span>
        </h3>
        <button
          className={`btn btn-green btn-sm ${!isCheckboxSelected ? 'disabled' : ''}`}
          onClick={handleUnlockUser}
          disabled={!isCheckboxSelected}
        >
          Unlock Users
        </button>
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
              <th className='checkbox-th ps-5'></th>
              <th>Name</th>
              <th>Role Name</th>
              <th>Email</th>
              <th>Failed Login Attempts</th>
              <th>Last Failed Login Time</th>
              <th>Lock Expiration Time</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}

            {currentItems !== null ? (
              currentItems.map((item, index) => (
                <tr key={index} className='fs-12 table-row'>
                  <td>
                    <div className='form-check form-check-sm form-check-custom form-check-solid px-3'>
                      <input
                        className='form-check-input widget-13-check'
                        type='checkbox'
                        value={item.userID}
                        name={item.userID}
                        onChange={(e) => handleselectedAlert(item, e)}
                        autoComplete='off'
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </td>
                  <td>{item.name}</td>
                  <td>{item.roleName}</td>
                  <td className='wrap-txt' title={item.emailId}>
                    {item.emailId}
                  </td>
                  <td>{item.failedLoginAttemptCount}</td>
                  <td>{getCurrentTimeZone(item.lastFailedLoginTime)}</td>
                  <td>{getCurrentTimeZone(item.lockExpirationTime)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='6' className='text-center'>
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {tools && (
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

export default UsersLocked
