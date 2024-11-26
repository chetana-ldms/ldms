import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sortable from 'react-sortablejs'
import {notify, notifyFail} from '../components/notification/Notification'
import {useErrorBoundary} from 'react-error-boundary'
import useFeatureActions from '../configuration/useFeatureActions'
import {
  fetchParentUpgradePoliciesUrl,
  fetchTagsUrl,
  fetchUpgradePoliciesDeActivateUrl,
  fetchUpgradePoliciesSetInheritingUrl,
  fetchUpgradePoliciesUrl,
  fetchUpgradePolicyActionsUrl,
} from '../../../../../api/SentinalApi'
import {Form} from 'react-bootstrap'
import AutoUpgradePolicyModal from './AutoUpgradePolicyModal'
import AutoUpgradePolicyUpdateModal from './AutoUpgradePolicyUpdateModal'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import ConfirmationModal from './ConfirmationModal'

const AutoUpgrade = () => {
  const handleError = useErrorBoundary()
  const [tools, setTools] = useState([])
  console.log(tools, 'tools')
  const [toolsParent, setToolsParent] = useState([])
  const [isToggledParent, setIsToggledParent] = useState([])
  const [loading, setLoading] = useState(false)
  const [showToggleConfirmation, setShowToggleConfirmation] = useState(false)
  const [pendingToggleState, setPendingToggleState] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedOS, setSelectedOS] = useState('windows')
  const [selectedItem, setSelectedItem] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [modalState, setModalState] = useState(null)
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false)
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const userID = Number(sessionStorage.getItem('userId'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))
  const [dropdownTags, setDropdownTags] = useState([])
  console.log(dropdownTags, 'dropdownTags')
  const [isToggled, setIsToggled] = useState(true)
  const fetchDropdownTags = async () => {
    const data = {
      orgId: orgId,
      toolId: toolId,
      includeChildren: true,
      includeParents: true,
      orgAccountStructureLevel: [
        {levelName: 'AccountId', levelValue: accountId || ''},
        {levelName: 'SiteId', levelValue: siteId || ''},
        {levelName: 'GroupId', levelValue: groupId || ''},
      ],
    }
    try {
      const response = await fetchTagsUrl(data)
      setDropdownTags(response?.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchDropdownTags()
  }, [])
  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const reload = async () => {
    try {
      setLoading(true)
      let scopeLevel = 'account'
      let scopeId = accountId

      if (groupId) {
        scopeLevel = 'group'
        scopeId = groupId
      } else if (siteId) {
        scopeLevel = 'site'
        scopeId = siteId
      }

      const data = {
        orgId: orgId,
        toolId: toolId,
        scopeLevel: scopeLevel,
        scopeId: scopeId,
        osType: selectedOS,
      }

      const response = await fetchUpgradePoliciesUrl(data)
      setTools(response?.data?.policies)
      setIsToggled(response?.data)
      const responseParent = await fetchParentUpgradePoliciesUrl(data)
      setToolsParent(responseParent?.data?.policies)
      setIsToggledParent(responseParent?.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [selectedOS])
  const refreshData = () => {
    reload()
  }
  const toggleGroupDropdown = (index) => {
    setGroupDropdownOpen((prevIndex) => (prevIndex === index ? null : index))
  }

  const handleGroupAction = async (action, item) => {
    const data = {
      orgId: orgId,
      toolId: toolId,
      policyId: item?.id,
      isDeleteAction: action === 'Delete',
      isActivateAction: action === 'Activate',
      isDeActiveAction: action === 'Deactivate',
      isResetPolicyRetryCounter: action === 'Retry Upgrade',
    }
    try {
      const responseData = await fetchUpgradePolicyActionsUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        reload()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }

  const handleNavigateToUpdate = (item) => {
    setSelectedItem(item)
    setShowPopup(true)
  }
  const handleNavigateToUpdateView = (item) => {
    setSelectedItem(item)
    setShowPopup(true)
    setModalState({save: true})
  }
  const handleOSChange = (event) => {
    const selected = event.target.value
    setSelectedOS(selected)
  }
  const handleCreateUpgradePolicy = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)
  const handleCloseUpdateModal = () => setShowPopup(false)
  const handleToggleChange = (e) => {
    const newToggleState = e.target.checked
    setPendingToggleState(newToggleState)
    setShowToggleConfirmation(true)
  }

  const confirmToggle = async () => {
    setIsToggled(pendingToggleState)
    setShowToggleConfirmation(false)
    let scopeLevel = 'account'
    let scopeId = accountId

    if (groupId) {
      scopeLevel = 'group'
      scopeId = groupId
    } else if (siteId) {
      scopeLevel = 'site'
      scopeId = siteId
    }
    const data = {
      orgId: orgId,
      toolId: toolId,
      isInheriting: pendingToggleState,
      scopeLevel: scopeLevel,
      scopeId: scopeId,
    }

    try {
      const response = await fetchUpgradePoliciesSetInheritingUrl(data)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        reload()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      handleError(error)
    }
  }

  const cancelToggle = () => {
    setShowToggleConfirmation(false)
    setPendingToggleState(null)
  }
  const handleDisableAllUpgradePolicies = async () => {
    let scopeLevel = 'account'
    let scopeId = accountId

    if (groupId) {
      scopeLevel = 'group'
      scopeId = groupId
    } else if (siteId) {
      scopeLevel = 'site'
      scopeId = siteId
    }
    const data = {
      orgId: orgId,
      toolId: toolId,
      osType: selectedOS,
      scopeLevel: scopeLevel,
      scopeId: scopeId,
    }
    try {
      const response = await fetchUpgradePoliciesDeActivateUrl(data)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        reload()
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
        <div className='card-header no-pad'>
          <div className='card-toolbar'>
            <div className='d-flex align-items-center gap-2'>
              <div>
                <select
                  className='form-select form-select-sm'
                  value={selectedOS}
                  onChange={handleOSChange}
                >
                  <option value='windows'>Windows</option>
                  <option value='macOS'>MacOS</option>
                  <option value='linux'>Linux</option>
                </select>
              </div>
              <div>
                <button
                  className={`btn btn-success btn-small ${
                    !isActionAuthorized('Create') ? 'disabled' : ''
                  }`}
                  onClick={handleCreateUpgradePolicy}
                >
                  Create Upgrade Policy
                </button>
              </div>
              <div className='fs-15 mt-0'> Total({tools ? tools.length : 0})</div>
            </div>
            <AutoUpgradePolicyModal
              show={showModal}
              onClose={handleCloseModal}
              refreshData={refreshData}
              selectedOS={selectedOS}
            />
            <AutoUpgradePolicyUpdateModal
              selectedItem={selectedItem}
              show={showPopup}
              onClose={handleCloseUpdateModal}
              refreshData={refreshData}
              selectedOS={selectedOS}
              modalState={modalState}
            />
          </div>
        </div>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <button className='btn btn-success btn-small' onClick={handleDisableAllUpgradePolicies}>
              Disable All Upgrade Policies
            </button>
          </div>
        </div>
      </div>
      <div className='card-body no-pad'>
        {tools && (
          <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
            <thead>
              <tr className='fw-bold text-muted bg-blue'>
                <th>Name</th>
                <th>Status</th>
                <th>Version</th>
                <th>Scope</th>
                <th>Affected Endpoints</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading && <UsersListLoading />}

              {tools ? (
                tools.map((item, index) => (
                  <tr key={index} className='fs-12 table-row'>
                    <td>{item.name}</td>
                    <td>{item.isActive ? 'Active' : 'Disabled'}</td>
                    <td>
                      {item.package.major}{' '}
                      {item.package.minor.charAt(0).toUpperCase() + item.package.minor.slice(1)}(
                      {item.package.build})
                    </td>

                    <td>{item.scopeLevel}</td>
                    <td>
                      {item.tags && item.tags.length > 0 ? (
                        <span
                          title={item.tags
                            .map((tagId) => {
                              const tag = dropdownTags.find(
                                (dropdownTag) => dropdownTag.id === tagId
                              )
                              return tag ? `${tag.key}: ${tag.value}` : ''
                            })
                            .filter(Boolean)
                            .join(', ')}
                        >
                          {item.tags
                            .map((tagId) => {
                              const tag = dropdownTags.find(
                                (dropdownTag) => dropdownTag.id === tagId
                              )
                              return tag ? `${tag.key}: ${tag.value}` : ''
                            })
                            .filter(Boolean)
                            .join(', ')
                            .slice(0, 20) + (item.tags.join(', ').length > 20 ? '...' : '')}
                        </span>
                      ) : item.allEndpoints ? (
                        'All Endpoints in scope'
                      ) : (
                        'N/A'
                      )}
                    </td>

                    <td className='d-flex align-items-center'>
                      {isActionAuthorized('View') ? (
                        <span className='me-6' title='View'>
                          <i
                            className='fa fa-eye cursor'
                            onClick={() => handleNavigateToUpdateView(item)}
                          />
                        </span>
                      ) : (
                        <span className='me-6' title='View'>
                          <i className='fa fa-eye disabled' />
                        </span>
                      )}

                      {isActionAuthorized('Update') ? (
                        <span className='me-6' title='Edit'>
                          <i
                            className='fa fa-pencil cursor link'
                            onClick={() => handleNavigateToUpdate(item)}
                          />
                        </span>
                      ) : (
                        <span className='me-6' title='Edit'>
                          <i className='fa fa-pencil disabled' />
                        </span>
                      )}

                      <Dropdown
                        isOpen={groupDropdownOpen === index}
                        toggle={() => toggleGroupDropdown(index)}
                      >
                        <DropdownToggle className='no-pad ms-4'>
                          <span className='btn btn-green btn-small'>Actions</span>
                        </DropdownToggle>
                        <DropdownMenu className='w-auto p-3'>
                          {!item.isActive && (
                            <DropdownItem onClick={() => handleGroupAction('Activate', item)}>
                              Activate
                            </DropdownItem>
                          )}
                          {item.isActive && (
                            <DropdownItem onClick={() => handleGroupAction('Deactivate', item)}>
                              Deactivate
                            </DropdownItem>
                          )}
                          <DropdownItem onClick={() => handleGroupAction('Delete', item)}>
                            Delete
                          </DropdownItem>
                          <DropdownItem onClick={() => handleGroupAction('Retry Upgrade', item)}>
                            Retry Upgrade
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
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
        )}
        {toolsParent && <div>This scope inherits {toolsParent.length} Upgrade Policies</div>}
        {toolsParent && (
          <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
            <thead>
              <tr className='fw-bold text-muted bg-blue'>
                <th>Name</th>
                <th>Status</th>
                <th>Version</th>
                <th>Scope</th>
                <th>Affected Endpoints</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading && <UsersListLoading />}

              {toolsParent ? (
                toolsParent.map((item, index) => (
                  <tr key={index} className='fs-12 table-row'>
                    <td>{item.name}</td>
                    <td>{item.isActive ? 'Active' : 'Disabled'}</td>
                    <td>
                      {item.package.major}{' '}
                      {item.package.minor.charAt(0).toUpperCase() + item.package.minor.slice(1)}(
                      {item.package.build})
                    </td>

                    <td>{item.scopeLevel}</td>
                    <td>{item.allEndpoints ? 'All Endpoints in scope' : 'N/A'}</td>
                    <td>
                      <span className='me-8' title='View'>
                        <i className='fa fa-eye disabled' />
                      </span>
                      <span className='' title='Edit'>
                        <i className='fa fa-pencil disabled' />
                      </span>
                      <span className='ms-8' title='Delete'>
                        <i className='fa fa-trash disabled' />
                      </span>
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
        )}
        {showToggleConfirmation && (
          <ConfirmationModal
            show={showToggleConfirmation}
            onConfirm={confirmToggle}
            onCancel={cancelToggle}
            message={`Are you sure you want to turn ${
              pendingToggleState ? 'ON' : 'OFF'
            } the policy?`}
          />
        )}
        {!toolsParent && !tools && (
          <div className='text-center'>
            <h6>No Upgrade Policies are configured in this scope</h6>
            <p>Click Create Upgrade Policy to create your first Upgrade Policy in this scope</p>
          </div>
        )}
      </div>
      <div className='d-flex justify-content-between align-items-center p-3 bg-light'>
        <div className='d-flex align-items-center'>
          <span className='me-3 fw-bold'>Inherit Upgrade Policy</span>
          <Form.Check
            type='switch'
            id='inherit-policy-switch'
            checked={isToggled?.isInherited}
            onChange={handleToggleChange}
            label={isToggled?.isInherited ? 'ON' : 'OFF'}
            className={`custom-toggle ${isToggled ? 'text-success' : 'text-muted'}`}
          />
        </div>
        {!toolsParent && !tools && <div>There is no Upgrade Policy to inherit</div>}
      </div>
    </div>
  )
}

export {AutoUpgrade}
