import React, {useEffect, useRef, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import {fetchLDPTools} from '../../../../../api/Api'
import {
  fetchDeleteAlertFieldMappingUrl,
  fetchGetAlertFieldMappingUrl,
} from '../../../../../api/AlertFieldsApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import DeleteConfirmation2 from '../risk-upgrade/DeleteConfirmation2'
import {notify, notifyFail} from '../components/notification/Notification'

export function AlertFieldMapping() {
  const navigate = useNavigate()
  const toolRef = useRef()
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [tools, setTools] = useState([])
  const [mappings, setMappings] = useState([])
  const [itemToDelete, setItemToDelete] = useState(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const userId = Number(sessionStorage.getItem('userId'))

  const loadMappings = async () => {
    try {
      setLoading(true)
      const toolId = Number(toolRef.current?.value)
      const response = await fetchGetAlertFieldMappingUrl({
        searchText: searchText.trim() || null,
        toolId: toolId || null,
      })
      setMappings(Array.isArray(response?.data) ? response.data : [])
    } catch (error) {
      console.error('Error loading alert field mappings:', error)
      setMappings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadTools = async () => {
      try {
        setTools((await fetchLDPTools()) || [])
      } catch (error) {
        console.error('Error loading tools:', error)
      }
    }
    loadTools()
    loadMappings()
  }, [])

  const handleDelete = (mapping) => {
    setItemToDelete(mapping)
    setShowDeleteConfirmation(true)
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return
    try {
      setLoading(true)
      const response = await fetchDeleteAlertFieldMappingUrl({
        fieldMappingId: itemToDelete.fieldMappingId ?? itemToDelete.id,
        userId,
      })
      if (response?.isSuccess) {
        notify(response.message || 'Alert field mapping deleted successfully')
        setShowDeleteConfirmation(false)
        setItemToDelete(null)
        await loadMappings()
      } else {
        notifyFail(response?.message || 'Failed to delete alert field mapping')
      }
    } catch (error) {
      console.error('Error deleting alert field mapping:', error)
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
          <h3 className='card-label fw-bold fs-3 mb-1'>Alert Field Mappings</h3>
        </div>
        <div className='col-md-5'>
          <div className='card-title header-filter'>
            <div className='input-group'>
              <input
                type='text'
                className='form-control form-control-sm'
                placeholder='Search mappings'
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
              <button className='btn btn-sm btn-primary' onClick={loadMappings}>
                <i className='fas fa-search' />
              </button>
            </div>
            <div className='d-flex align-items-center gap-3 mb-1 mt-2'>
              <div className='w-150px'>
                <select
                  className='form-select form-select-sm'
                  ref={toolRef}
                  onChange={loadMappings}
                >
                  <option value={0}>Select Tool</option>
                  {tools.map((tool) => (
                    <option key={tool.toolId} value={tool.toolId}>
                      {tool.toolName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-3 text-end'>
          <Link to='/qradar/alert-fields-mapping/add' className='btn btn-new btn-small'>
            Add
          </Link>
        </div>
      </div>

      <div className='card-body no-pad mt-3'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th>Raw Field</th>
              <th>Standard Field</th>
              <th>Tool</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {!loading && mappings.length > 0 ? (
              mappings.map((mapping) => {
                const mappingId = mapping.fieldMappingId ?? mapping.id
                return (
                  <tr key={mappingId} className='fs-12'>
                    <td>{mapping.rawFieldName || mapping.rawField || '--'}</td>
                    <td>{mapping.standardFieldName || mapping.standardField || '--'}</td>
                    <td>{mapping.toolName || '--'}</td>
                    <td>
                      <span className='me-8' title='View'>
                        <i
                          className='fa fa-eye cursor'
                          onClick={() =>
                            navigate(`/qradar/alert-fields-mapping/update/${mappingId}`, {
                              state: {save: true},
                            })
                          }
                        />
                      </span>
                      <Link
                        className='text-white me-8'
                        to={`/qradar/alert-fields-mapping/update/${mappingId}`}
                        title='Edit'
                      >
                        <i className='fa fa-pencil cursor link' />
                      </Link>
                      <span onClick={() => handleDelete(mapping)} title='Delete'>
                        <i className='fa fa-trash cursor red' />
                      </span>
                    </td>
                  </tr>
                )
              })
            ) : !loading ? (
              <tr>
                <td colSpan='4' className='text-center'>
                  No data found
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <DeleteConfirmation2
          show={showDeleteConfirmation}
          message='Are you sure you want to delete this alert field mapping?'
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

export default AlertFieldMapping
