import React, {useEffect, useState} from 'react'
import {ToastContainer} from 'react-toastify'
import {useErrorBoundary} from 'react-error-boundary'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import Pagination from '../../../../../../utils/Pagination'
import {
  fetchSentinelReportDeleteUrl,
  fetchSentinelReportTaskDeleteUrl,
  fetchSentinelReportsTasksUrl,
} from '../../../../../api/SentinelsReportApi'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import useFeatureActions from '../configuration/useFeatureActions'
import DeleteConfirmation from '../../../../../../utils/DeleteConfirmation'
import {notify, notifyFail} from '../components/notification/Notification'
import ReportTaskModal from './ReportTaskModal'
import {useNavigate} from 'react-router-dom'
import ReportTaskModalEditPopup from './ReportTaskModalEditPopup'

function LoadReportTask() {
  const navigate = useNavigate()
  const [expandedRow, setExpandedRow] = useState(null)
  const handleError = useErrorBoundary()
  const [tools, setTools] = useState([])
  console.log(tools, 'tools')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedAlert, setselectedAlert] = useState([])
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false)
  const [filterValue, setFilterValue] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [activePage, setActivePage] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [refreshFlag, setRefreshFlag] = useState(false)
  const handleOpenModal = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showPopupEdit, setShowPopupEdit] = useState(false)
  const userID = Number(sessionStorage.getItem('userId'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))

  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }

  const reload = async () => {
    try {
      const data = {
        orgId: orgId,
        toolId: toolId,
        scopeName: siteId ? 'SiteId' : 'AccountId',
        scopeValue: siteId || accountId,
      }
      setLoading(true)
      const response = await fetchSentinelReportsTasksUrl(data)
      setTools(response.reportData)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
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

  const handleselectedAlert = (item, e) => {
    const {value, checked} = e.target
    if (checked) {
      setselectedAlert([...selectedAlert, value])
      setIsCheckboxSelected(true)
    } else {
      const updatedAlert = selectedAlert.filter((e) => e !== value)
      setselectedAlert(updatedAlert)
      setIsCheckboxSelected(updatedAlert.length > 0)
    }
  }

  const handleDelete = () => {
    setShowConfirmation(true)
  }

  const confirmDelete = async () => {
    if (selectedAlert) {
      const data = {
        orgId: orgId,
        toolId: toolId,
        ids: selectedAlert,
        deletedDate: new Date().toISOString(),
        deletedUserId: Number(sessionStorage.getItem('userId')),
      }

      try {
        const response = await fetchSentinelReportTaskDeleteUrl(data)
        const {isSuccess, message} = response
        if (isSuccess) {
          notify(message)
          await reload()
          setIsCheckboxSelected(false)
          setselectedAlert([])
        } else {
          notifyFail(message)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setShowConfirmation(false)
      }
    }
  }
  const cancelDelete = () => {
    setShowConfirmation(false)
  }

  const handleRefreshActions = () => {
    setRefreshFlag(!refreshFlag)
    setTimeout(() => {
      reload()
    }, 5000)
  }
  const handleTableRowClick = (item) => {
    setSelectedItem(item)
    if (isActionAuthorized('Update')) {
      setShowPopupEdit(true)
    }
  }
  const openPopupEdit = () => {
    setShowPopupEdit(true)
  }

  const closePopupEdit = () => {
    setShowPopupEdit(false)
  }

  return (
    <div className='card pad-10 config'>
      <ToastContainer />
      <div className='card-header no-pad'>
        <div className=' d-flex'>
          <div>
            <button
              className={`btn btn-green btn-small ${
                !isActionAuthorized('Create') ? 'disabled' : ''
              }`}
              onClick={handleOpenModal}
            >
              New Report Task
            </button>
            <ReportTaskModal
              show={showModal}
              handleClose={handleCloseModal}
              refreshParent={handleRefreshActions}
            />
          </div>
          <div className='float-left mg-left-10'>
            <button
              className={`btn btn-green btn-small float-left ${
                !isCheckboxSelected || !isActionAuthorized('Delete') ? 'disabled' : ''
              }`}
              onClick={handleDelete}
              disabled={!isCheckboxSelected || !isActionAuthorized('Delete')}
            >
              Delete selection
            </button>
          </div>
        </div>
        <div className='card-toolbar'>
          <h3 className='mt-2'>
            <span className='card-label fw-bold fs-3 mb-1 ms-5'>
              Load Report Task ({currentItems ? currentItems.length : 0} /{' '}
              {filteredList ? filteredList.length : 0})
            </span>
          </h3>
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
              <th></th>
              <th>Name</th>
              <th>Scope</th>
              <th>Site Name</th>
              <th>Frequency</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}

            {currentItems !== null ? (
              currentItems.map((item, index) => (
                <React.Fragment key={index}>
                  <tr
                    className='table-row'
                    key={item.id}
                    onClick={() => handleTableRowClick(item)}
                    style={{cursor: 'pointer'}}
                  >
                    <td>
                      <div className='form-check form-check-sm form-check-custom form-check-solid px-3'>
                        <input
                          className='form-check-input widget-13-check'
                          type='checkbox'
                          checked={selectedAlert?.includes(item.id)}
                          value={item.id}
                          name={item.id}
                          onChange={(e) => handleselectedAlert(item, e)}
                          autoComplete='off'
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </td>
                    <td>{item.name}</td>
                    <td>{item.scope}</td>
                    <td className='wrap-txt'>{item.sites ? item.sites : 'N/A'}</td>
                    <td>{item.frequency ? item.frequency : 'N/A'}</td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan='8' className='text-center'>
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {showPopupEdit && selectedItem && (
          <ReportTaskModalEditPopup
            show={openPopupEdit}
            onClose={closePopupEdit}
            refreshParent={handleRefreshActions}
            selectedItem={selectedItem}
          />
        )}
        {showConfirmation && (
          <DeleteConfirmation
            show={showConfirmation}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
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

export default LoadReportTask
