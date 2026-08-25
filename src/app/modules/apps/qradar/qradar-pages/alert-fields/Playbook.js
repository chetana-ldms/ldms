import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import {fetchDeletePlaybookUrl, fetchGetPlaybooksUrl} from '../../../../../api/AlertFieldsApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import DeleteConfirmation2 from '../risk-upgrade/DeleteConfirmation2'
import {notify, notifyFail} from '../components/notification/Notification'

function Playbook() {
  const navigate = useNavigate()
  const userId = Number(sessionStorage.getItem('userId'))
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [playbooks, setPlaybooks] = useState([])
  const [itemToDelete, setItemToDelete] = useState(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const loadPlaybooks = async () => {
    try {
      setLoading(true)
      const response = await fetchGetPlaybooksUrl({searchtext: searchText.trim()})
      setPlaybooks(
        Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : []
      )
    } catch (error) {
      console.error('Error loading playbooks:', error)
      setPlaybooks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlaybooks()
  }, [])

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return
    try {
      setLoading(true)
      const response = await fetchDeletePlaybookUrl({
        playbookId: itemToDelete.playbookId ?? itemToDelete.id,
        userId,
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
          <div className='card-title header-filter'>
            <div className='input-group'>
              <input
                type='text'
                className='form-control form-control-sm'
                placeholder='Search Playbooks'
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
              <button className='btn btn-sm btn-primary' onClick={loadPlaybooks}>
                <i className='fas fa-search' />
              </button>
            </div>
          </div>
        </div>
        <div className='col-md-1 text-end'>
          <Link to='/qradar/alert-fields/playbook/add' className='btn btn-new btn-small'>
            Add
          </Link>
        </div>
      </div>
      <div className='card-body no-pad mt-3'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th>Playbook Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {!loading && playbooks.length > 0 ? (
              playbooks.map((playbook) => {
                const playbookId = playbook.playbookId ?? playbook.id
                return (
                  <tr key={playbookId} className='fs-12'>
                    <td>{playbook.playbookName || '--'}</td>
                    <td>{playbook.playbookDescription || '--'}</td>
                    <td>
                      <span className='me-8' title='View'>
                        <i
                          className='fa fa-eye cursor'
                          onClick={() =>
                            navigate(`/qradar/alert-fields/playbook/update/${playbookId}`, {
                              state: {save: true},
                            })
                          }
                        />
                      </span>
                      <Link
                        className='text-white me-8'
                        to={`/qradar/alert-fields/playbook/update/${playbookId}`}
                        title='Edit'
                      >
                        <i className='fa fa-pencil cursor link' />
                      </Link>
                      <span
                        onClick={() => {
                          setItemToDelete(playbook)
                          setShowDeleteConfirmation(true)
                        }}
                        title='Delete'
                      >
                        <i className='fa fa-trash cursor red' />
                      </span>
                    </td>
                  </tr>
                )
              })
            ) : !loading ? (
              <tr>
                <td colSpan='3' className='text-center'>
                  No data found
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <DeleteConfirmation2
          show={showDeleteConfirmation}
          message='Are you sure you want to delete this playbook?'
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

export default Playbook
