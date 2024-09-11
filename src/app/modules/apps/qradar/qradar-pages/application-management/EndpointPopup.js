import React, {useEffect, useState} from 'react'
import {Modal, Button, Nav, Tab} from 'react-bootstrap'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input} from 'reactstrap'
import useFeatureActions from '../configuration/useFeatureActions'
import {fetchAgentActionUrl} from '../../../../../api/Api'
import {notify, notifyFail} from '../components/notification/Notification'
import {fetchAEndPointDetailsUrl} from '../../../../../api/ApplicationSectionApi'
import DropdownItemWithSubmenu from '../Setinels/DropdownItemWithSubmenu'
import ContinueConfirmation from '../../../../../../utils/ContinueConfirmation'
import SendMessageModal from '../Setinels/SendMessageModal'
import MoveAgentToAnotherSiteModal from '../Setinels/MoveAgentToAnotherSiteModal'
import DisableAgentModal from '../Setinels/DisableAgentModal'
import EnableAgentModal from '../Setinels/EnableAgentModal'
import AgentSoftwareUpdateModal from '../Setinels/AgentSoftwareUpdateModal'
import FetchLogsModal from '../Setinels/FetchLogsModal'
import General from './General'
import Inventory from './Inventory'
import Updates from './Updates'
import Tags from './Tags'
import { ToastContainer } from 'react-toastify'

const EndpointPopup = ({selectedEndpoint, showModal, setShowModal, refreshData}) => {
  const [activeTab, setActiveTab] = useState('general')
  const id = selectedEndpoint?.endpointId || selectedEndpoint?.id
  const [generalData, setGeneralData] = useState([])
  console.log(generalData, 'generalData')
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sendMessageModalVisible, setSendMessageModalVisible] = useState(false)
  const [isDisableAgentModalVisible, setIsDisableAgentModalVisible] = useState(false)
  const [isEnableAgentModalVisible, setIsEnableAgentModalVisible] = useState(false)
  const [moveAgentToSiteModalVisible, setMoveAgentToSiteModalVisible] = useState(false)
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)
  const [isAgentSoftwareUpdateModalVisible, setIsAgentSoftwareUpdateModalVisible] = useState(false)
  const [isFetchLogsModalVisible, setIsFetchLogsModalVisible] = useState(false)
  const [selectedActionId, setSelectedActionId] = useState(null)
  const [items, setItems] = useState([])
  console.log(items, 'items')
  const [computerNames, setComputerNames] = useState('')
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))

  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)
  console.log(featureActions, 'featureActions')

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action?.actionName === actionName && action?.is_authorized === true
    )
  }
  const toggleActionDropdown = async () => {
    setActionDropdownOpen(!actionDropdownOpen)
    if (!actionDropdownOpen) {
      await fetchData()
    }
  }

  const handleActionClick = (actionId, actionDisplayName) => {
    setSelectedActionId(actionId)

    switch (actionDisplayName) {
      case 'Send Message':
        setSendMessageModalVisible(true)
        setActionDropdownOpen(false)
        break
      case 'Agent Move To Site':
        setMoveAgentToSiteModalVisible(true)
        setActionDropdownOpen(false)
        break
      case 'Disable Agent':
        setIsDisableAgentModalVisible(true)
        setActionDropdownOpen(false)
        break
      case 'Enable Agent':
        setIsEnableAgentModalVisible(true)
        setActionDropdownOpen(false)
        break
      case 'Agent Software Update':
        setIsAgentSoftwareUpdateModalVisible(true)
        setActionDropdownOpen(false)
        break
      case 'Fetch Logs':
        setIsFetchLogsModalVisible(true)
        setActionDropdownOpen(false)
        break
      default:
        setIsConfirmModalVisible(true)
        setActionDropdownOpen(false)
    }
  }

  const sendSelectedItemsToBackend = async () => {
    const endPointsData = items.map((item) => ({
      agentIds: item.id,
      accountIds: item.accountId,
      groupIds: item.groupId,
      siteIds: item.siteId,
    }))

    const payload = {
      orgId,
      toolId,
      agentActionId: selectedActionId,
      endPointsData,
      executedUserId: Number(sessionStorage.getItem('userId')),
      executedDate: new Date().toISOString(),
    }

    console.log(payload, 'payload')
    try {
      const response = await fetchAgentActionUrl(payload)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        refreshData()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleConfirm = async () => {
    setIsConfirmModalVisible(false)
    try {
      await sendSelectedItemsToBackend()
      setItems([])
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (items && items.length > 0) {
      const names = items
        .map((item, index) => {
          const name = item?.computerName || item?.endpointName
          return name ? (index === items.length - 1 ? name : `${name}, `) : ''
        })
        .join('')

      setComputerNames(names)
    }
  }, [items])

  const handleDismiss = () => {
    setIsConfirmModalVisible(false)
  }

  const filteredActionItems = featureActions
    ?.filter((action) =>
      action.actionDisplayName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    ?.filter((action) => action.actionName !== 'Access')
    ?.filter((action) => action.actionType === 'End Point Action')
    ?.filter((action) => isActionAuthorized(action.actionName))
  console.log(filteredActionItems, 'filteredActionItems')
  const fetchData = async () => {
    const data = {
      orgID: orgId,
      endPiontId: id,
    }
    try {
      const response = await fetchAEndPointDetailsUrl(data)
      const [firstEndpoint] = response
      setGeneralData(firstEndpoint)
      setItems([firstEndpoint])
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Modal className='application-modal' show={showModal} onHide={() => setShowModal(false)}>
       <ToastContainer />
      <Modal.Header closeButton className='pad-10'>
        <Modal.Title>
          {selectedEndpoint?.computerName || selectedEndpoint?.endpointName}
          {selectedEndpoint?.isPendingUninstall && ' (Pending Uninstall)'}
        </Modal.Title>
        <button type='button' className='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body className='pad-10'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='d-flex justify-content-between'>
              <div className='d-flex col-md-12 border-btm'>
                <div className='d-flex col-md-12 justify-content-between'>
                  <div>
                    <ul className='nav nav-tabs p-0 border-0 fs-14'>
                      <li className='nav-item text-center'>
                        <a
                          className={`nav-link normal pointer ${
                            activeTab === 'general' ? 'active' : ''
                          }`}
                          onClick={() => setActiveTab('general')}
                        >
                          General
                        </a>
                      </li>
                      <li className='nav-item text-center'>
                        <a
                          className={`nav-link normal pointer ${
                            activeTab === 'inventory' ? 'active' : ''
                          }`}
                          onClick={() => setActiveTab('inventory')}
                        >
                          App Inventory
                        </a>
                      </li>
                      {/* <li className="nav-item text-center">
                  <a
                    className={`nav-link normal pointer ${
                      activeTab === "tasks" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("tasks")}
                  >
                    Tasks
                  </a>
                </li> */}
                      <li className='nav-item text-center'>
                        <a
                          className={`nav-link normal pointer ${
                            activeTab === 'updates' ? 'active' : ''
                          }`}
                          onClick={() => setActiveTab('updates')}
                        >
                          Updates
                        </a>
                      </li>
                      <li className='nav-item text-center'>
                        <a
                          className={`nav-link normal pointer ${
                            activeTab === 'tags' ? 'active' : ''
                          }`}
                          onClick={() => setActiveTab('tags')}
                        >
                          Tags
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <Dropdown isOpen={actionDropdownOpen} toggle={toggleActionDropdown}>
                      <DropdownToggle className='no-pad'>
                        <div className={`btn btn-green btn-small`}>Actions</div>
                      </DropdownToggle>
                      <DropdownMenu className='w-200px p-3'>
                        <Input
                          type='text'
                          placeholder='Search... '
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className='mb-2 bg-grey'
                        />
                        {filteredActionItems
                          ?.filter((action) => action?.parentActionId === 0)
                          ?.map((action, index) => (
                            <DropdownItemWithSubmenu
                              key={index}
                              item={action?.actionDisplayName}
                              subItems={filteredActionItems?.filter(
                                (subAction) => subAction?.parentActionId === action?.actionId
                              )}
                              onItemSelect={handleActionClick}
                            />
                          ))}
                      </DropdownMenu>
                    </Dropdown>
                    <ContinueConfirmation
                      isVisible={isConfirmModalVisible}
                      onContinue={handleConfirm}
                      onDismiss={handleDismiss}
                      // items={items}
                      computerNames={computerNames}
                    />
                    <SendMessageModal
                      show={sendMessageModalVisible}
                      handleClose={() => setSendMessageModalVisible(false)}
                      items={items}
                      selectedActionId={selectedActionId}
                      refreshData={refreshData}
                    />
                    <MoveAgentToAnotherSiteModal
                      show={moveAgentToSiteModalVisible}
                      handleClose={() => setMoveAgentToSiteModalVisible(false)}
                      items={items}
                      selectedActionId={selectedActionId}
                      refreshData={refreshData}
                    />
                    <DisableAgentModal
                      isOpen={isDisableAgentModalVisible}
                      toggle={() => setIsDisableAgentModalVisible(false)}
                      items={items}
                      selectedActionId={selectedActionId}
                      refreshData={refreshData}
                    />
                    <EnableAgentModal
                      isOpen={isEnableAgentModalVisible}
                      toggle={() => setIsEnableAgentModalVisible(false)}
                      items={items}
                      selectedActionId={selectedActionId}
                      refreshData={refreshData}
                    />
                    <AgentSoftwareUpdateModal
                      isOpen={isAgentSoftwareUpdateModalVisible}
                      toggle={() => setIsAgentSoftwareUpdateModalVisible(false)}
                      items={items}
                      selectedActionId={selectedActionId}
                      refreshData={refreshData}
                    />
                    <FetchLogsModal
                      isOpen={isFetchLogsModalVisible}
                      toggle={() => setIsFetchLogsModalVisible(false)}
                      items={items}
                      selectedActionId={selectedActionId}
                      refreshData={refreshData}
                    />
                  </div>
                </div>
              </div>
            </div>

            {activeTab === 'general' && <General id={id} />}
            {activeTab === 'inventory' && <Inventory id={id} />}
            {/* {activeTab === "tasks" && <TasksApplication id={id} />} */}
            {activeTab === 'updates' && <Updates id={id} />}
            {activeTab === 'tags' && <Tags id={id} />}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default EndpointPopup
