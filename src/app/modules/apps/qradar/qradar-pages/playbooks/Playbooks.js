import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {fetchDelete, fetchPlayBooks} from '../../../../../api/playBookApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import DeleteConfirmation2 from '../risk-upgrade/DeleteConfirmation2'
import {notify, notifyFail} from '../components/notification/Notification'

const Playbooks = () => {
  const navigate = useNavigate()
  const userId = Number(sessionStorage.getItem('userId') || 0)
  const [playbooks, setPlaybooks] = useState([])
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const loadPlaybooks = async () => {
    setLoading(true)
    try {
      const response = await fetchPlayBooks({searchText: searchText.trim()})
      setPlaybooks(Array.isArray(response?.data) ? response.data : [])
    } catch (error) {
      console.error('Error loading playbooks:', error)
      setPlaybooks([])
      notifyFail('Failed to load playbooks.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlaybooks()
  }, [])

  const handleDeleteConfirm = async (deleteReason) => {
    if (!itemToDelete) return
    setLoading(true)
    try {
      const response = await fetchDelete({
        playbookId: itemToDelete.playbookId,
        userId,
        deleteReason: deleteReason || '',
      })
      if (response?.isSuccess) {
        notify(response.message || 'Playbook deleted successfully')
        setShowDeleteConfirmation(false)
        setItemToDelete(null)
        await loadPlaybooks()
      } else {
        notifyFail(response?.message || 'Failed to delete playbook')
      }
    } catch (error) {
      console.error('Error deleting playbook:', error)
      notifyFail('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='config card pad-10'>
      <ToastContainer />
      <div className='row'>
        <div className='col-md-4'>
          <h3 className='card-label fw-bold fs-3 mb-1'>Playbooks</h3>
        </div>
        <div className='col-md-7'>
          <div className='input-group'>
            <input
              type='text'
              className='form-control form-control-sm'
              placeholder='Search Playbooks'
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && loadPlaybooks()}
            />
            <button className='btn btn-sm btn-primary' onClick={loadPlaybooks}>
              <i className='fas fa-search' />
            </button>
          </div>
        </div>
        <div className='col-md-1 text-end'>
          <Link to='/qradar/addplaybooks' className='btn btn-new btn-small'>
            Add
          </Link>
        </div>
      </div>{' '}
      <div className='card-body no-pad mt-3'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th>Playbook Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>{' '}
          <tbody>
            {loading && <UsersListLoading />}
            {!loading && playbooks.length > 0 ? (
              playbooks.map((playbook) => (
                <tr key={playbook.playbookId} className='fs-12'>
                  <td>{playbook.playbookName || '--'}</td>
                  <td>{playbook.description || '--'}</td>
                  <td>
                    <span className='me-8' title='View'>
                      <i
                        className='fa fa-eye cursor'
                        onClick={() =>
                          navigate(`/qradar/updateplaybooks/${playbook.playbookId}`, {
                            state: {save: true},
                          })
                        }
                      />
                    </span>
                    <Link
                      className='text-white me-8'
                      to={`/qradar/updateplaybooks/${playbook.playbookId}`}
                      title='Edit'
                    >
                      <i className='fa fa-pencil cursor link' />
                    </Link>
                    <span
                      title='Delete'
                      onClick={() => {
                        setItemToDelete(playbook)
                        setShowDeleteConfirmation(true)
                      }}
                    >
                      <i className='fa fa-trash cursor red' />
                    </span>
                  </td>
                </tr>
              ))
            ) : !loading ? (
              <tr>
                <td colSpan='3' className='text-center'>
                  No data found
                </td>
              </tr>
            ) : null}
          </tbody>{' '}
        </table>{' '}
        <DeleteConfirmation2
          show={showDeleteConfirmation}
          message='Are you sure you want to delete this playbook?'
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteConfirmation(false)
            setItemToDelete(null)
          }}
        />
      </div>{' '}
    </div>
  )
}
export {Playbooks}
