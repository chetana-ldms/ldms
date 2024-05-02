import React, {useState, useEffect} from 'react'
import {Link, useParams} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {ToastContainer, toast} from 'react-toastify'
import {notify, notifyFail} from '../components/notification/Notification'
import 'react-toastify/dist/ReactToastify.css'
import {fetchToolActionDelete} from '../../../../../api/Api'
import axios from 'axios'
import {fetchToolActionsUrl} from '../../../../../api/ConfigurationApi'
import {useErrorBoundary} from 'react-error-boundary'
import Pagination from '../../../../../../utils/Pagination'
import DeleteConfirmation from '../../../../../../utils/DeleteConfirmation'

const ToolActions = () => {
  const handleError = useErrorBoundary()
  const globalAdminRole = Number(sessionStorage.getItem('globalAdminRole'))
  const clientAdminRole = Number(sessionStorage.getItem('clientAdminRole'))
  const [loading, setLoading] = useState(false)
  const [filterValue, setFilterValue] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [toolActions, setToolActions] = useState([])
  console.log(toolActions, 'toolActions')
  const {status} = useParams()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const handleDelete = (item) => {
    setItemToDelete(item)
    setShowConfirmation(true)
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      const data = {
        toolActionId: itemToDelete.toolActionID,
        deletedDate: new Date().toISOString(),
        deletedUserId: Number(sessionStorage.getItem('userId')),
      }

      try {
        const response = await fetchToolActionDelete(data)
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
  const reload = async () => {
    try {
      setLoading(true)
      const response = await fetchToolActionsUrl()
      setToolActions(response)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])
  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = toolActions
    ? toolActions
        .filter((item) => item.toolTypeActionName.toLowerCase().includes(filterValue.toLowerCase()))
        .slice(indexOfFirstItem, indexOfLastItem)
    : null

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(0)
  }
  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected)
  }
  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
  }

  return (
    <div className='config card pad-10'>
      <ToastContainer />
      <div className='card-header no-pad'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Tool Actions</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            {globalAdminRole === 1 || clientAdminRole === 1 ? (
              <Link to='/qradar/tool-actions/add' className='btn btn-new btn-small'>
                Add
              </Link>
            ) : (
              <></>
            )}
          </div>
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
        <table className='table alert-table fixed-table scroll-x'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th className='w-100px'>S.No</th>
              <th className='w-400px'>Tool</th>
              <th className='w-500px'>Tool Action Type</th>
              {globalAdminRole === 1 || clientAdminRole === 1 ? <th>Action</th> : <></>}
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {currentItems !== null ? (
              currentItems.map((item, index) => (
                <tr key={index} className='fs-12'>
                  <td>{index + 1}</td>
                  <td>{item.toolName}</td>
                  <td>{item.toolTypeActionName}</td>

                  {globalAdminRole === 1 || clientAdminRole === 1 ? (
                    <td>
                      <span>
                        <Link
                          className='text-white'
                          to={`/qradar/tool-actions/update/${item.toolActionID}`}
                          title='Edit'
                        >
                          <i className='fa fa-pencil cursor link' />
                        </Link>
                      </span>

                      <span
                        className='ms-8'
                        onClick={() => {
                          handleDelete(item)
                        }}
                        title='Delete'
                      >
                        <i className='fa fa-trash cursor red' />
                      </span>
                    </td>
                  ) : (
                    <></>
                  )}
                </tr>
              ))
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
        <Pagination
          pageCount={Math.ceil(toolActions.length / itemsPerPage)}
          handlePageClick={handlePageClick}
          itemsPerPage={itemsPerPage}
          handlePageSelect={handlePageSelect}
        />
      </div>
    </div>
  )
}

export {ToolActions}
