import React, {useEffect, useRef, useState} from 'react'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {ToastContainer} from 'react-toastify'
import useFeatureActions from '../configuration/useFeatureActions'
import {Link, useNavigate} from 'react-router-dom'
import {
  fetchActionsDeleteUrl,
  fetchActionsUrl,
} from '../../../../../api/securityApi'
import { notify, notifyFail } from '../components/notification/Notification'
import DeleteConfirmation from '../../../../../../utils/DeleteConfirmation'
import { fetchLDPToolsUrl } from '../../../../../api/ConfigurationApi'

function FeatureAction() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [tools, setTools] = useState([])
  const [actions, setActions] = useState([])
  console.log(actions, "actions")
  const [selectedTool, setSelectedTool] = useState(null)
  const toolRef = useRef()
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
  useEffect(() => {
    const reload = async () => {
      try {
        const data = await fetchLDPToolsUrl()
        setTools(data)
      } catch (error) {
        console.log(error)
      }
    }
      reload()
  }, [])
  const reload = async () => {
    try {
      const data = {
        toolId: selectedTool || 0,
      }
      const featureResponse = await fetchActionsUrl(data)
      setActions(featureResponse)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])
  const handleToolChange = (e) => {
    const newToolId = Number(e.target.value)
    setSelectedTool(newToolId)
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const data = {
        toolId: selectedTool || 0,
      }
      const featureResponse = await fetchActionsUrl(data)
      setActions(featureResponse)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  const handleDelete = (item) => {
    setItemToDelete(item)
    setShowConfirmation(true)
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      const data = {
        actionId: itemToDelete.actionId,
        deletedDate: new Date().toISOString(),
        deletedUserId: Number(sessionStorage.getItem('userId')),
      }

      try {
        const response = await fetchActionsDeleteUrl(data)
        const {isSuccess, message} = response
        if (isSuccess) {
          notify(message)
          await reload()
        } else {
          notifyFail(message)
        }
      } catch (error) {
        console.log(error)
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
  const handleNavigateToUpdate = (id) => {
    navigate(`/qradar/featureaction/update/${id}`, {state: {save: true}})
  }
  return (
    <div className='activity-timeline'>
      <ToastContainer />
      <div className='card header-filter mb-5 pad-10'>
        <div className='d-flex'>
          <div className='d-flex me-5'>
            <label htmlFor='Tools' className='form-label fs-6 fw-bolder w-70px mt-3'>
              Tools: 
            </label>
            <select
              className='form-select form-select-solid bg-blue-light'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              ref={toolRef}
              onChange={handleToolChange}
            >
              <option value=''>Select</option>
              {tools !== null &&
                tools?.map((item, index) => (
                  <option key={index} value={item.toolId}>
                    {item.toolName}
                  </option>
                ))}
            </select>
          </div>
          <div className='d-flex'>
            <button className='btn btn-primary btn-small ms-1' onClick={handleSubmit}>
              <i className='fa fa-search white' />
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <UsersListLoading />
      ) : (
        <div className='card pad-10 config'>
          <div className='card-header no-pad'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bold fs-3 mb-1'>
                Features ({actions.length} / {actions.length})
              </span>
            </h3>
            <div className='card-toolbar'>
              <div className='d-flex align-items-center gap-2 gap-lg-3'>
                <Link
                  to='/qradar/featureaction/add'
                  className={`btn btn-new btn-small ${
                    !isActionAuthorized('Create') ? 'disabled' : ''
                  }`}
                >
                  Add
                </Link>
              </div>
            </div>
          </div>
          <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
            <thead>
              <tr className='fw-bold text-muted bg-blue'>
                <th>Name</th>
                <th>Display Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <UsersListLoading />}

              {actions !== null ? (
                actions.map((item, index) => (
                  <tr key={index} className='fs-12 table-row'>
                    <td>{item.actionName}</td>
                    <td>{item.actionDisplayName}</td>
                    <td>
                      {isActionAuthorized('View') ? (
                        <span className='me-8' title='View'>
                          <i
                            className='fa fa-eye cursor'
                            onClick={() => handleNavigateToUpdate(item.actionId)}
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
                            to={`/qradar/featureaction/update/${item.actionId}`}
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
                  <td colSpan='6' className='text-center'>
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
       {showConfirmation && (
          <DeleteConfirmation
            show={showConfirmation}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
    </div>
  )
}

export default FeatureAction
