import {useEffect, useState} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {
  fetchAPIAuthDataAddUrl,
  fetchAPIAuthDataDeleteUrl,
  fetchAPIAuthDataDetailsUrl,
  fetchAPIAuthDataUpdateUrl,
} from '../../../../../api/ConfigurationApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import useFeatureActions from './useFeatureActions'
import {notify, notifyFail} from '../components/notification/Notification'
import DeleteConfirmation from '../../../../../../utils/DeleteConfirmation'
import {truncateText} from '../../../../../../utils/TruncateText'
import {fetchMasterData} from '../../../../../api/Api'

const ApiAuthConfig = ({show, onClose, orgToolID, selectedOrgToolActionId}) => {
  const [authType, setAuthType] = useState('')
  const [authName, setAuthName] = useState('')
  const [authKey, setAuthKey] = useState('')
  const [authUrl, setAuthUrl] = useState('')
  const [scope, setScope] = useState('')
  const [tenantId, setTenantId] = useState('')
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [apiAuth, setApiAuth] = useState([])
  console.log(apiAuth, 'apiAuth')
  const [editIndex, setEditIndex] = useState(null)
  const [dropdownData, setDropdownData] = useState({
    statusDropDown: [],
  })

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
    const fetchAllMasterData = async () => {
      const statusDataRequest = {
        maserDataType: 'Api Authentication Type',
        // orgId: orgId,
        // toolId: toolId,
        orgId: 0,
        toolId: 0,
      }
      try {
        const [statusData] = await Promise.all([fetchMasterData(statusDataRequest)])

        setDropdownData((prevDropdownData) => ({
          ...prevDropdownData,
          statusDropDown: statusData,
        }))
      } catch (error) {
        console.log(error)
      }
    }

    fetchAllMasterData()
  }, [])
  const {statusDropDown} = dropdownData
  console.log(statusDropDown, 'statusDropDown')

  const fetchData = async () => {
    const data = {
      authLevel: selectedOrgToolActionId ? 'Org Tool Action' : 'Org Tool',
      authLevelRefId: selectedOrgToolActionId ? selectedOrgToolActionId : orgToolID,
      orgId: orgId,
      toolId: toolId,
    }

    try {
      const organizationsResponse = await fetchAPIAuthDataDetailsUrl(data)
      setApiAuth(organizationsResponse?.apiAuthData)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (show) {
      fetchData()
    }
  }, [show])

  const handleDelete = (item) => {
    setItemToDelete(item)
    setShowConfirmation(true)
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      const data = {
        apiAuthId: itemToDelete.authDataId,
        deletedDate: new Date().toISOString(),
        deletedUserId: Number(sessionStorage.getItem('userId')),
      }

      try {
        const response = await fetchAPIAuthDataDeleteUrl(data)
        const {isSuccess, message} = response
        if (isSuccess) {
          notify(message)
          await fetchData()
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

  const handleAdd = async () => {
    const newItem = {
      authName,
      authType,
      apiKey: authType === 'API Key' ? authKey : '',
      apiAuthUrl: authUrl,
      apiAuthTokenGenScope: scope,
      tenantId,
      clientId,
      clientSecret,
      orgId: orgId,
      toolId: toolId,
      authLevel: selectedOrgToolActionId ? 'Org Tool Action' : 'Org Tool',
      authLevelRefId: selectedOrgToolActionId ? selectedOrgToolActionId : orgToolID,
    }

    if (editIndex === null) {
      newItem.createdDate = new Date().toISOString()
      newItem.createdUserId = Number(sessionStorage.getItem('userId'))
    } else {
      newItem.authDataId = apiAuth[editIndex].authDataId
      newItem.modifiedDate = new Date().toISOString()
      newItem.modifiedUserId = Number(sessionStorage.getItem('userId'))
    }

    try {
      setLoading(true)
      let response
      if (editIndex !== null) {
        response = await fetchAPIAuthDataUpdateUrl(newItem)
      } else {
        response = await fetchAPIAuthDataAddUrl(newItem)
      }
      if (response.isSuccess) {
        notify(response.message)
        await fetchData()
      } else {
        notifyFail(response.message)
      }
    } catch (error) {
      console.log(error)
      notifyFail('Failed to add API Auth Data')
    } finally {
      setLoading(false)
      setAuthName('')
      setAuthType('')
      setAuthKey('')
      setAuthUrl('')
      setScope('')
      setTenantId('')
      setClientId('')
      setClientSecret('')
      setEditIndex(null)
    }
  }

  const handleEdit = (index) => {
    const item = apiAuth[index]
    setAuthName(item.authName)
    setAuthType(item.authType)
    setAuthKey(item.apiKey)
    setAuthUrl(item.apiAuthUrl)
    setScope(item.apiAuthTokenGenScope)
    setTenantId(item.tenantId)
    setClientId(item.clientId)
    setClientSecret(item.clientSecret)
    setEditIndex(index)
  }
  const handleclose = () => {
    onClose('')
    setAuthName('')
    setAuthType('')
    setAuthKey('')
    setAuthUrl('')
    setScope('')
    setTenantId('')
    setClientId('')
    setClientSecret('')
    setEditIndex(null)
  }

  return (
    <Modal show={show} onHide={handleclose} className='application-modal channel-edit'>
      <Modal.Header closeButton>
        <Modal.Title>API Auth Configuration</Modal.Title>
        <button type='button' class='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className='row mb-3'>
            <div className='col-md-6 d-flex align-items-center'>
              <label htmlFor='authName' className='form-label me-2' style={{width: '20%'}}>
                Name
              </label>
              <input
                type='text'
                className='form-control'
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
              />
            </div>
            <div className='col-md-6 d-flex align-items-center'>
              <label htmlFor='authType' className='form-label me-2' style={{width: '20%'}}>
                Auth Type
              </label>
              <select
                className='form-select'
                value={authType}
                onChange={(e) => setAuthType(e.target.value)}
              >
                <option value=''>Select Auth Type</option>
                {statusDropDown.length > 0 &&
                  statusDropDown.map((item) => (
                    <option key={item.dataID} value={item.dataValue}>
                      {item.dataValue}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          {authType === 'API Key' && (
            <div className='row mb-3'>
              <div className='col-md-12 d-flex align-items-center'>
                <label htmlFor='authKey' className='form-label me-2' style={{width: '13%'}}>
                  Authentication Key
                </label>
                <textarea
                  className='form-control'
                  rows={3}
                  value={authKey}
                  onChange={(e) => setAuthKey(e.target.value)}
                />
              </div>
            </div>
          )}

          {authType === 'Client Secret' && (
            <div className='row mb-3'>
              <div className='col-md-6 d-flex align-items-center'>
                <label htmlFor='authUrl' className='form-label me-2' style={{width: '20%'}}>
                  Auth URL
                </label>
                <input
                  type='text'
                  className='form-control'
                  value={authUrl}
                  onChange={(e) => setAuthUrl(e.target.value)}
                />
              </div>
              <div className='col-md-6 d-flex align-items-center mb-3'>
                <label htmlFor='scope' className='form-label me-2' style={{width: '20%'}}>
                  Scope
                </label>
                <input
                  type='text'
                  className='form-control'
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                />
              </div>
              <div className='col-md-6 d-flex align-items-center mb-3'>
                <label htmlFor='tenantId' className='form-label me-2' style={{width: '20%'}}>
                  Tenant ID
                </label>
                <input
                  type='text'
                  className='form-control'
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                />
              </div>
              <div className='col-md-6 d-flex align-items-center mb-3'>
                <label htmlFor='clientId' className='form-label me-2' style={{width: '20%'}}>
                  Client ID
                </label>
                <input
                  type='text'
                  className='form-control'
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                />
              </div>
              <div className='col-md-6 d-flex align-items-center mb-3'>
                <label htmlFor='clientSecret' className='form-label me-2' style={{width: '20%'}}>
                  Client Secret
                </label>
                <input
                  type='text'
                  className='form-control'
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                />
              </div>
            </div>
          )}
          <div className='d-flex justify-content-end mb-1'>
            <button type='button' onClick={handleAdd} className='btn btn-primary btn-sm'>
              Save
            </button>
          </div>
        </form>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th>Name</th>
              <th>Auth Type</th>
              <th>API Key</th>
              <th>TenantId</th>
              <th>ClientId</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiAuth.map((item, index) => (
              <tr key={index}>
                <td>{item.authName}</td>
                <td title={item.authType}>{item.authType}</td>
                <td title={item.apiKey}>{truncateText(item.apiKey, 30)}</td>
                <td title={item.tenantId}>{truncateText(item.tenantId, 30)}</td>
                <td title={item.clientId}>{truncateText(item.clientId, 30)}</td>
                <td>
                  <span onClick={() => handleEdit(index)} title='Edit'>
                    <i className='fa fa-pencil cursor link' />
                  </span>
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
            ))}
          </tbody>
        </table>
        {showConfirmation && (
          <DeleteConfirmation
            show={showConfirmation}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ApiAuthConfig
