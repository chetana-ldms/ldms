import React, {useState, useEffect, useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import {fetchMasterData} from '../../../../../api/Api'
import {useErrorBoundary} from 'react-error-boundary'
import Pagination from '../../../../../../utils/Pagination'
import DeleteConfirmation2 from '../risk-upgrade/DeleteConfirmation2'
import useFeatureActions from '../configuration/useFeatureActions'
import {fetchConnectionSearchUrl, fetchConnectionDeleteUrl, fetchConnectionTypeSearchUrl} from '../../../../../api/ConnectionApi'

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

  const typeRef = useRef()
  const authRef = useRef()
  const envRef = useRef()

  const [dropdownData, setDropdownData] = useState({
    types: [],
    authTypes: [],
    environments: [],
  })

  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))
  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const isActionAuthorized = (action) => featureActions?.some(a => a.actionName === action && a.is_authorized)

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [types, auths, envs] = await Promise.all([
          fetchConnectionTypeSearchUrl({}),
          fetchMasterData({maserDataType: 'auth_type', orgId, toolId}),
          fetchMasterData({maserDataType: 'environment', orgId, toolId}),
        ])
        setDropdownData({
          types: types?.data || [],
          authTypes: auths || [],
          environments: envs || [],
        })
      } catch (e) { console.error(e) }
    }
    loadFilters()
  }, [orgId, toolId])

  const reload = async () => {
    try {
      setLoading(true)
      const payload = {}
      if (searchValue) payload.searchText = searchValue
      const tId = Number(typeRef.current?.value)
      if (tId) payload.connectionTypeId = tId
      const aId = Number(authRef.current?.value)
      if (aId) payload.authTypeId = aId
      const eId = Number(envRef.current?.value)
      if (eId) payload.environmentId = eId

      const res = await fetchConnectionSearchUrl(payload)
      setConnections(Array.isArray(res?.data) ? res.data : [])
    } catch (e) { handleError(e) } finally { setLoading(false) }
  }

  useEffect(() => { reload() }, [])

  const handleDeleteConfirm = async (reason) => {
    if (!itemToDelete) return
    try {
      setLoading(true)
      const res = await fetchConnectionDeleteUrl({
        connectionId: itemToDelete.connectionId,
        deletedReason: reason,
        userId: Number(sessionStorage.getItem('userId'))
      })
      if (res?.isSuccess) {
        notify(res.message || 'Deleted successfully')
        setShowDeleteConfirmation(false)
        reload()
      } else notifyFail(res?.message || 'Delete failed')
    } catch (e) { handleError(e) } finally { setLoading(false) }
  }

  const currentItems = connections.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  return (
    <div className='config card pad-10'>
      <ToastContainer />
      <div className='row'>
        <div className='col-md-5'>
          <h3 className='card-label fw-bold fs-3'>Connections ({connections.length})</h3>
        </div>
        <div className='col-md-6'>
          <div className='card-title header-filter'>
            <div className='input-group'>
              <input type='text' className='form-control form-control-sm' placeholder='Search...' value={searchValue} onChange={e => setSearchValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && reload()} />
              <button className='btn btn-sm btn-primary' onClick={reload}><i className='fas fa-search' /></button>
            </div>
            <div className='d-flex gap-2 mt-2'>
              <select className='form-select form-select-sm w-150px' ref={typeRef}><option value={0}>Type</option>{dropdownData.types.map(i => <option key={i.connectionTypeId} value={i.connectionTypeId}>{i.connectionTypeName}</option>)}</select>
              <select className='form-select form-select-sm w-150px' ref={authRef}><option value={0}>Auth</option>{dropdownData.authTypes.map(i => <option key={i.dataID} value={i.dataID}>{i.dataValue}</option>)}</select>
              <select className='form-select form-select-sm w-150px' ref={envRef}><option value={0}>Env</option>{dropdownData.environments.map(i => <option key={i.dataID} value={i.dataID}>{i.dataValue}</option>)}</select>
            </div>
          </div>
        </div>
        <div className='col-md-1 text-end'>
          <Link to='/qradar/connection/add' className={`btn btn-new btn-small ${!isActionAuthorized('Create') ? 'disabled' : ''}`}>Add</Link>
        </div>
      </div>

      <div className='card-body no-pad mt-3'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th>Name</th>
              <th>Code</th>
              <th>Type</th>
              <th>Auth Type</th>
              <th>Env</th>
              <th>Default</th>
              <th>System</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {currentItems.map(item => (
              <tr key={item.connectionId} className='fs-12'>
                <td>{item.connectionName}</td>
                <td>{item.connectionCode}</td>
                <td>{item.connectionTypeName}</td>
                <td>{item.authTypeName}</td>
                <td>{item.environmentName}</td>
                <td>{item.isDefault ? 'Yes' : 'No'}</td>
                <td>{item.isSystem ? 'Yes' : 'No'}</td>
                <td>
                  <span className='me-5' title='View' onClick={() => navigate(`/qradar/connection/update/${item.connectionId}`, {state: {save: true}})}>
                    <i className='fa fa-eye cursor' />
                  </span>
                  <Link className='text-white me-5' to={`/qradar/connection/update/${item.connectionId}`} title='Edit'>
                    <i className='fa fa-pencil cursor link' />
                  </Link>
                  <span onClick={() => { setItemToDelete(item); setShowDeleteConfirmation(true); }} title='Delete'>
                    <i className='fa fa-trash cursor red' />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {connections.length > 0 && (
          <Pagination
            pageCount={Math.ceil(connections.length / itemsPerPage)}
            handlePageClick={p => { setCurrentPage(p.selected); setActivePage(p.selected); }}
            itemsPerPage={itemsPerPage}
            handlePageSelect={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(0); }}
            forcePage={activePage}
          />
        )}
      </div>
      <DeleteConfirmation2
        show={showDeleteConfirmation}
        message={itemToDelete ? `Delete connection "${itemToDelete.connectionName}"?` : ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirmation(false)}
      />
    </div>
  )
}

export default Connection