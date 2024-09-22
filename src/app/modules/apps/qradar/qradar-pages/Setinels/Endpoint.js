import {useEffect, useState} from 'react'
import React from 'react'
import ReactPaginate from 'react-paginate'
import {fetchAEndPointDetailsUrl} from '../../../../../api/ApplicationSectionApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import Pagination from '../../../../../../utils/Pagination'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input} from 'reactstrap'
import {renderSortIcon, sortedItems} from '../../../../../../utils/Sorting'
import EndpointPopupSentinal from './EndpointPopupSentinal'
import {
  fetchAgentActionUrl,
  fetchExportDataAddUrl,
  fetchFeaturesActionsAuthorizedUrl,
} from '../../../../../api/Api'
import DropdownItemWithSubmenu from './DropdownItemWithSubmenu'
import useFeatureActions from '../configuration/useFeatureActions'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import ContinueConfirmation from '../../../../../../utils/ContinueConfirmation'
import SendMessageModal from './SendMessageModal'
import MoveAgentToAnotherSiteModal from './MoveAgentToAnotherSiteModal'
import DisableAgentModal from './DisableAgentModal'
import EnableAgentModal from './EnableAgentModal'
import MoveToGroupModal from './MoveToGroupModal'
import DeleteGroupModal from './DeleteGroupModal'
import AgentSoftwareUpdateModal from './AgentSoftwareUpdateModal'
import FetchLogsModal from './FetchLogsModal'
import CreateGroupModal from './CreateGroupModal'

function Endpoint() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false)
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const globalAdminRole = Number(sessionStorage.getItem('globalAdminRole'))
  const clientAdminRole = Number(sessionStorage.getItem('clientAdminRole'))
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false)
  const [features, setFeatures] = useState([])
  const [openSubmenus, setOpenSubmenus] = useState({})
  const [selectedActionId, setSelectedActionId] = useState(null)
  const [selectedActionDisplayName, setSelectedActionDisplayName] = useState('')
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)
  const toggleActionDropdown = () => setActionDropdownOpen(!actionDropdownOpen)
  const toggleGroupDropdown = () => setGroupDropdownOpen(!groupDropdownOpen)
  const [moveAgentToSiteModalVisible, setMoveAgentToSiteModalVisible] = useState(false)
  const [sendMessageModalVisible, setSendMessageModalVisible] = useState(false)
  const [isDisableAgentModalVisible, setIsDisableAgentModalVisible] = useState(false)
  const [isEnableAgentModalVisible, setIsEnableAgentModalVisible] = useState(false)
  const [isMoveToGroupModalVisible, setIsMoveToGroupModalVisible] = useState(false)
  const [isDeleteGroupModalVisible, setIsDeleteGroupModalVisible] = useState(false)
  const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] = useState(false)
  const [isAgentSoftwareUpdateModalVisible, setIsAgentSoftwareUpdateModalVisible] = useState(false)
  const [isFetchLogsModalVisible, setIsFetchLogsModalVisible] = useState(false)
  const [items, setItems] = useState([])
  console.log(items, "items")
  const [computerNames, setComputerNames] = useState('')
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
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
  const handleselectedAlert = (item, e) => {
    const {checked} = e.target

    if (checked) {
      setItems([...items, item])
      setIsCheckboxSelected(true)
    } else {
      const updatedItems = items.filter((i) => i.id !== item.id)
      setItems(updatedItems)
      setIsCheckboxSelected(updatedItems.length > 0)
    }
  }

  const fetchFeatureActions = async () => {
    try {
      const data = {
        orgId: orgId,
        toolId: toolId,
        roleId: roleId,
        featureId: featureId,
      }
      const response = await fetchFeaturesActionsAuthorizedUrl(data)
      setFeatures(response.featureActions)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchFeatureActions()
  }, [])

  const extractTableData = (items) => {
    return items.map((item) => ({
      'Endpoint Name': item.computerName,
      Account: item.accountName,
      Site: item.siteName,
      'Last loged in user': item.lastLoggedInUserName,
      Group: item.groupName,
      Domain: item.domain,
      'Console Visible Ip': item.externalIp,
      'Agent Version': item.agentVersion,
      'Last Active': getCurrentTimeZone(item.lastActiveDate),
      'Register on': getCurrentTimeZone(item.registeredAt),
      'Device Type': item.machineType,
      OS: item.osName,
      'OS Version': item.osRevision,
      Architecture: item.osArch,
      'CPU Count': item.cpuCount,
      'Core Count': item.coreCount,
      'Network Status': item.networkStatus,
      'Full Disk Scan': getCurrentTimeZone(item.lastSuccessfulScanDate),
      'IP Address': item.lastIpToMgmt,
      'Installer Type': item.installerType,
      'Storage Name': item.storageName ?? null,
      'Storage Type': item.storageType ?? null,
      'Last successfull scan time': getCurrentTimeZone(item.lastSuccessfulScanDate),
      Locations: item.locations[0].name,
    }))
  }
  // Function to convert data to CSV format
  const convertToCSV = (data) => {
    const header = Object.keys(data[0]).join(',') + '\n'
    const body = data.map((item) => Object.values(item).join(',')).join('\n')
    return header + body
  }

  const exportToCSV = (data) => {
    const csvData = convertToCSV(data)
    const blob = new Blob([csvData], {type: 'text/csv;charset=utf-8;'})
    const fileName = 'endpoints.csv'
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, fileName)
    } else {
      const link = document.createElement('a')
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }

  // Function to extract full table data
  const exportTableToCSV = async () => {
    const tableData = extractTableData(filteredList)
    exportToCSV(tableData)
    const data = {
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: 'Endpoints',
    }
    try {
      const response = await fetchExportDataAddUrl(data)
    } catch (error) {
      console.error(error)
    }
  }

  // Function to extract current pagination table data
  const exportCurrentTableToCSV = async () => {
    const tableData = extractTableData(currentItems)
    exportToCSV(tableData)
    const data = {
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: 'Endpoints',
    }
    try {
      const response = await fetchExportDataAddUrl(data)
    } catch (error) {
      console.error(error)
    }
  }

  const [loading, setLoading] = useState(false)
  const [endpoints, setEndpoints] = useState([])
  const [selectedEndpoint, setSelectedEndpoint] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [activePage, setActivePage] = useState(0)
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  })
  const fetchData = async () => {
    const data = {
      orgID: orgId,
      orgAccountStructureLevel: [
        {
          levelName: 'AccountId',
          levelValue: accountId || '',
        },
        {
          levelName: 'SiteId',
          levelValue: siteId || '',
        },
        {
          levelName: 'GroupId',
          levelValue: groupId || '',
        },
      ],
    }
    try {
      setLoading(true)
      const response = await fetchAEndPointDetailsUrl(data)
      //   const [firstEndpoint] = response;
      setEndpoints(response)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [itemsPerPage])

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(0)
    setActivePage(0)
  }

  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = endpoints
    ? sortedItems(
        endpoints.filter((item) =>
          item.computerName.toLowerCase().includes(filterValue.toLowerCase())
        ),
        sortConfig
      ).slice(indexOfFirstItem, indexOfLastItem)
    : null

  const filteredList = filterValue
    ? endpoints.filter((item) =>
        item.computerName.toLowerCase().includes(filterValue.toLowerCase())
      )
    : endpoints
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
    setSortConfig({key, direction})
  }

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected)
    setActivePage(selected.selected)
  }
  const handleEndpointClick = (item) => {
    setSelectedEndpoint(item)
    setShowPopup(true)
  }
  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
    setCurrentPage(0)
    setActivePage(0)
  }
  const handleActionClick = (actionId, actionDisplayName) => {
    setSelectedActionId(actionId)
    setSelectedActionDisplayName(actionDisplayName)
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
      agentName:item.computerName
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
        fetchData()
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
      setIsCheckboxSelected(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (items && items.length > 0) {
      const names = items
        .map((item, index) =>
          index === items.length - 1 ? item.computerName : `${item.computerName}, `
        )
        .join('')
      setComputerNames(names)
    }
  }, [items])
  const handleDismiss = () => {
    setIsConfirmModalVisible(false)
  }

  const refreshData = () => {
    fetchData()
  }
  const handleGroup = (actionId, actionDisplayName) => {
    setSelectedActionId(actionId)

    switch (actionDisplayName) {
      case 'Agent Move To Group':
        setIsMoveToGroupModalVisible(true)
        break
      case 'Agent Delete Group':
        setIsDeleteGroupModalVisible(true)
        break
      case 'Create Group':
        setIsCreateGroupModalVisible(true)
        break
      default:
        setIsConfirmModalVisible(true)
    }
  }

  const filteredActionItems = featureActions
    .filter((action) => action.actionDisplayName.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((action) => action.actionName !== 'Access')
    .filter((action) => action.actionType == 'End Point Action')
    .filter((action) => isActionAuthorized(action.actionName))
  console.log(filteredActionItems, 'filteredActionItems')
  const filteredGroupItems = featureActions
    .filter((action) => action.actionName !== 'Access')
    .filter((action) => action.actionType === 'Group Action')
    .filter((action) => isActionAuthorized(action.actionName))
  console.log(filteredGroupItems, 'filteredGroupItems')
  return (
    <div>
      <ToastContainer />
      {loading ? (
        <UsersListLoading />
      ) : (
        <div className='card pad-10'>
          <div className='header-filter mg-btm-20 row'>
            <div className='col-lg-2 d-flex justify-content-between'>
              <Dropdown
                isOpen={actionDropdownOpen}
                toggle={toggleActionDropdown}
                className={!isCheckboxSelected ? 'disabled' : ''}
              >
                <DropdownToggle className='no-pad'>
                  <div className={`btn btn-green btn-small ${!isCheckboxSelected && 'disabled'}`}>
                    Actions
                  </div>
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
                    .filter((action) => action.parentActionId === 0)
                    .map((action, index) => (
                      <DropdownItemWithSubmenu
                        key={index}
                        item={action.actionDisplayName}
                        subItems={filteredActionItems.filter(
                          (subAction) => subAction.parentActionId === action.actionId
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
                selectedActionDisplayName={selectedActionDisplayName}
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
                <Dropdown
                  isOpen={groupDropdownOpen}
                  toggle={toggleGroupDropdown}
                  style={{marginLeft: '5px'}}
                  className={!siteId ? 'disabled' : ''}
                >
                  <DropdownToggle className='no-pad'>
                    <div className={`btn btn-green btn-small `}>Groups</div>
                  </DropdownToggle>
                  <DropdownMenu className='w-auto p-3'>
                    {filteredGroupItems.map((action, index) => (
                      <DropdownItem
                        key={index}
                        onClick={() => handleGroup(action.actionId, action.actionDisplayName)}
                        disabled={
                          (action.actionDisplayName === 'Agent Move To Group' &&
                            !isCheckboxSelected) ||
                          (action.actionDisplayName === 'Create Group' && isCheckboxSelected)
                        }
                      >
                        {action.actionDisplayName}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              <MoveToGroupModal
                show={isMoveToGroupModalVisible}
                handleClose={() => setIsMoveToGroupModalVisible(false)}
                items={items}
                selectedActionId={selectedActionId}
                refreshData={refreshData}
              />
              <DeleteGroupModal
                show={isDeleteGroupModalVisible}
                handleClose={() => setIsDeleteGroupModalVisible(false)}
                items={items}
                selectedActionId={selectedActionId}
                refreshData={refreshData}
              />
              <CreateGroupModal
                show={isCreateGroupModalVisible}
                handleClose={() => setIsCreateGroupModalVisible(false)}
                items={items}
                selectedActionId={selectedActionId}
                refreshData={refreshData}
              />
            </div>
            <div className='col-lg-7'>
              <input
                type='text'
                placeholder='Search...'
                className='form-control'
                value={filterValue}
                onChange={handleFilterChange}
              />
            </div>
            <div className='col-lg-3 d-flex justify-content-between'>
              <div className='fs-15 mt-2'>
                {' '}
                Total({currentItems ? currentItems.length : 0}/
                {filteredList ? filteredList.length : 0})
              </div>
              <div className=''>
                <div className='export-report border-0 float-right'>
                  <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
                    <DropdownToggle className='no-pad'>
                      <div className='btn btn-border btn-small'>
                        Export <i className='fa fa-file-export link mg-left-5' />
                      </div>
                    </DropdownToggle>
                    <DropdownMenu className='w-auto'>
                      <DropdownItem onClick={exportTableToCSV} className='border-btm'>
                        <i className='fa fa-file-excel link mg-right-5' /> Export Full Report
                      </DropdownItem>
                      <DropdownItem onClick={exportCurrentTableToCSV}>
                        <i className='fa fa-file-excel link mg-right-5' /> Export Current Page
                        Report
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
          <table className='table alert-table fixed-table scroll-x'>
            <thead>
              <tr>
                <th className='checkbox-th ps-5'></th>
                <th onClick={() => handleSort('computerName')}>
                  Endpoint Name {renderSortIcon(sortConfig, 'computerName')}
                </th>
                <th onClick={() => handleSort('accountName')}>
                  Account {renderSortIcon(sortConfig, 'accountName')}
                </th>
                <th onClick={() => handleSort('siteName')}>
                  Site {renderSortIcon(sortConfig, 'siteName')}
                </th>
                <th onClick={() => handleSort('lastLoggedInUserName')}>
                  User Name {renderSortIcon(sortConfig, 'lastLoggedInUserName')}
                </th>
                <th onClick={() => handleSort('lastActiveDate')}>
                  Last Active {renderSortIcon(sortConfig, 'lastActiveDate')}
                </th>
                <th onClick={() => handleSort('groupName')}>
                  Group {renderSortIcon(sortConfig, 'groupName')}
                </th>
                <th onClick={() => handleSort('domain')}>
                  Domain {renderSortIcon(sortConfig, 'domain')}
                </th>
                <th onClick={() => handleSort('externalIp')}>
                  Console Visible Ip {renderSortIcon(sortConfig, 'externalIp')}
                </th>
                <th onClick={() => handleSort('agentVersion')}>
                  Agent Version {renderSortIcon(sortConfig, 'agentVersion')}
                </th>
                <th onClick={() => handleSort('registeredAt')}>
                  Registered Date {renderSortIcon(sortConfig, 'registeredAt')}
                </th>
                <th onClick={() => handleSort('machineType')}>
                  Device Type {renderSortIcon(sortConfig, 'machineType')}
                </th>
                <th onClick={() => handleSort('osName')}>
                  Os {renderSortIcon(sortConfig, 'osName')}
                </th>
                <th onClick={() => handleSort('osRevision')}>
                  Os Version {renderSortIcon(sortConfig, 'osRevision')}
                </th>
                <th onClick={() => handleSort('osArch')}>
                  Architecture {renderSortIcon(sortConfig, 'osArch')}
                </th>
                <th onClick={() => handleSort('cpuCount')}>
                  CPU Count {renderSortIcon(sortConfig, 'cpuCount')}
                </th>
                <th onClick={() => handleSort('coreCount')}>
                  Core Count {renderSortIcon(sortConfig, 'coreCount')}
                </th>
                <th onClick={() => handleSort('networkStatus')}>
                  Network Status {renderSortIcon(sortConfig, 'networkStatus')}
                </th>
                <th onClick={() => handleSort('lastSuccessfulScanDate')}>
                  Full Disk Scan {renderSortIcon(sortConfig, 'lastSuccessfulScanDate')}
                </th>
                <th onClick={() => handleSort('lastIpToMgmt')}>
                  IP Address {renderSortIcon(sortConfig, 'lastIpToMgmt')}
                </th>
                <th onClick={() => handleSort('installerType')}>
                  Installer Type {renderSortIcon(sortConfig, 'installerType')}
                </th>
                <th onClick={() => handleSort('storageName')}>
                  Storage Name {renderSortIcon(sortConfig, 'storageName')}
                </th>
                <th onClick={() => handleSort('storageType')}>
                  Storage Type {renderSortIcon(sortConfig, 'storageType')}
                </th>
                <th onClick={() => handleSort('lastSuccessfulScanDate')}>
                  Last Successful Scan Time {renderSortIcon(sortConfig, 'lastSuccessfulScanDate')}
                </th>
                <th onClick={() => handleSort('locations')}>
                  Locations {renderSortIcon(sortConfig, 'locations')}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems !== null ? (
                currentItems?.map((item, index) => (
                  <tr className='table-row' key={index}>
                    <td>
                      <div className='form-check form-check-sm form-check-custom form-check-solid px-3'>
                        <input
                          className='form-check-input widget-13-check'
                          type='checkbox'
                          value={item}
                          name={item.id}
                          onChange={(e) => handleselectedAlert(item, e)}
                          autoComplete='off'
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </td>
                    <td onClick={() => handleEndpointClick(item)}>
                      <span className='link border-bottom border-1 border-primary'>
                        {item.computerName}
                      </span>
                      <div className='fs-10'>
                        {item.isPendingUninstall ? 'Pending Uninstall' : ''}
                      </div>
                    </td>
                    <td>{item.accountName}</td>
                    <td>{item.siteName}</td>
                    <td>{item.lastLoggedInUserName}</td>
                    <td>{getCurrentTimeZone(item.lastActiveDate)}</td>
                    <td>{item.groupName}</td>
                    <td>{item.domain}</td>
                    <td>{item.externalIp}</td>
                    <td>{item.agentVersion}</td>
                    <td>{getCurrentTimeZone(item.registeredAt)}</td>
                    <td>{item.machineType}</td>
                    <td>{item.osName}</td>
                    <td>{item.osRevision}</td>
                    <td>{item.osArch}</td>
                    <td>{item.cpuCount}</td>
                    <td>{item.coreCount}</td>
                    <td>{item.networkStatus}</td>
                    <td>{getCurrentTimeZone(item.lastSuccessfulScanDate)}</td>
                    <td>{item.lastIpToMgmt}</td>
                    <td>{item.installerType}</td>
                    <td>{item.storageName ?? null}</td>
                    <td>{item.storageType ?? null}</td>
                    <td>{getCurrentTimeZone(item.lastSuccessfulScanDate)}</td>
                    <td>{item?.locations?.[0]?.name ?? null}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='24'>No data found</td>
                </tr>
              )}
            </tbody>
          </table>

          {endpoints && (
            <Pagination
              pageCount={Math.ceil(filteredList.length / itemsPerPage)}
              handlePageClick={handlePageClick}
              itemsPerPage={itemsPerPage}
              handlePageSelect={handlePageSelect}
              forcePage={activePage}
            />
          )}
        </div>
      )}
      <EndpointPopupSentinal
        selectedEndpoint={selectedEndpoint}
        showModal={showPopup}
        setShowModal={setShowPopup}
        refreshData={refreshData}
      />
    </div>
  )
}

export default Endpoint
