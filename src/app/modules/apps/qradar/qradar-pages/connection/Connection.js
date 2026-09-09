import React, {useState, useEffect, useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useErrorBoundary} from 'react-error-boundary'
import Pagination from '../../../../../../utils/Pagination'
import DeleteConfirmation2 from '../risk-upgrade/DeleteConfirmation2'
import useFeatureActions from '../configuration/useFeatureActions'
import {fetchConnectionSearchUrl, fetchConnectionDeleteUrl} from '../../../../../api/ConnectionApi'

const Connection = () => {
  const navigate = useNavigate()
  const handleError = useErrorBoundary()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))

  const [loading, setLoading] = useState(false)
  const [connections, setConnections] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activePage, setActivePage] = useState(0)

  const [searchValue, setSearchValue] = useState('')
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))
  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const isActionAuthorized = (actionName) =>
    featureActions?.some((a) => a.actionName === actionName && a.is_authorized === true)

  const handleNavigateToUpdate = (id) => {
    navigate(`/qradar/connection/update/${id}`, {state: {save: true}})
  }

 const reload = async () => {
  try {
    setLoading(true);

    const payload = {
      searchText: searchValue.trim()
    };

    const res = await fetchConnectionSearchUrl(payload);

    setConnections(
      Array.isArray(res?.connections) ? res.connections : []
    );
  } catch (e) {
    handleError(e);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    reload()
  }, [])

  // =========================
  // DELETE
  // =========================

  const handleDelete = (item) => {
    setItemToDelete(item)
    setShowDeleteConfirmation(true)
  }

  const handleDeleteConfirm = async (reason) => {
    if (!itemToDelete) return
    try {
      setLoading(true)
      const res = await fetchConnectionDeleteUrl({
        connectionId: itemToDelete.connectionId,
        userId: Number(sessionStorage.getItem('userId')),
        deleteReason: reason,
      })
      if (res?.isSuccess) {
        notify(res.message || 'Connection Deleted Successfully')
        setShowDeleteConfirmation(false)
        setItemToDelete(null)
        await reload()
      } else {
        notifyFail(res?.message || 'Failed to delete connection')
      }
    } catch (e) {
      handleError(e)
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
  const currentItems = connections ? connections.slice(indexOfFirstItem, indexOfLastItem) : []

  return (
    <div className='config card pad-10'>
      <ToastContainer />
      <div className='row'>
        <div className='col-md-3'>
          <h3 className='card-label fw-bold fs-3 mb-1'>
            Connections ({currentItems.length} / {connections.length})
          </h3>
        </div>

        <div className='col-md-8'>
          <div className='card-title header-filter'>
            <div className='input-group'>
              <input
                type='text'
                className='form-control form-control-sm'
                placeholder='Search Connections'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && reload()}
              />
              <button className='btn btn-sm btn-primary' onClick={reload}>
                <i className='fas fa-search' />
              </button>
            </div>
          </div>
        </div>

        <div className='col-md-1 text-end'>
          <Link
            to='/qradar/connection/add'
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
              <th>Type</th>
              <th>Host</th>
              <th>Port</th>
              <th>Username</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.connectionId} className='fs-12'>
                  <td>{item.connectionName || '-'}</td>
                  <td>{item.connectionTypeName || '-'}</td>
                  <td>{item.hostName || '-'}</td>
                  <td>{item.port || '-'}</td>
                  <td>{item.username || '-'}</td>
                  <td>{item.description || '-'}</td>
                  <td>
                    {isActionAuthorized('View') ? (
                      <span className='me-8' title='View'>
                        <i
                          className='fa fa-eye cursor'
                          onClick={() => handleNavigateToUpdate(item.connectionId)}
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
                        to={`/qradar/connection/update/${item.connectionId}`}
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
                <td colSpan='7' className='text-center'>
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {connections.length > 0 && (
          <Pagination
            pageCount={Math.ceil(connections.length / itemsPerPage)}
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
              ? `Are you sure you want to delete the connection "${itemToDelete.connectionName}"?`
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

export default Connection