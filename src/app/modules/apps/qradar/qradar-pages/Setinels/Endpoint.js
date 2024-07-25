import {useEffect, useState} from 'react'
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
import {actions} from 'react-table'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import ContinueConfirmation from '../../../../../../utils/ContinueConfirmation'
import SendMessageModal from './SendMessageModal'
import MoveAgentToAnotherSiteModal from './MoveAgentToAnotherSiteModal'

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
  const [selectedActionId, setSelectedActionId] = useState(null)
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)
  const toggleActionDropdown = () => setActionDropdownOpen(!actionDropdownOpen)
  const toggleGroupDropdown = () => setGroupDropdownOpen(!groupDropdownOpen)
  const [moveAgentToSiteModalVisible, setMoveAgentToSiteModalVisible] = useState(false);
  const [sendMessageModalVisible, setSendMessageModalVisible] = useState(false)
  const [selectedAlert, setselectedAlert] = useState([])
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
    const {value, checked} = e.target
    if (checked) {
      setselectedAlert([...selectedAlert, value])
      setIsCheckboxSelected(true)
    } else {
      const updatedAlert = selectedAlert.filter((e) => e !== value)
      setselectedAlert(updatedAlert)
      setIsCheckboxSelected(updatedAlert.length > 0)
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
  }, [accountId, siteId, groupId, itemsPerPage])

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

    if (actionDisplayName === "Send Message") {
      setSendMessageModalVisible(true);
    } else if (actionDisplayName === "Agent Move To Site") {
      setMoveAgentToSiteModalVisible(true);
    } else {
      setIsConfirmModalVisible(true);
    }
  };

  const handleConfirm = async () => {
    setIsConfirmModalVisible(false)
    try {
      const data = {
        orgId,
        toolId,
        agentActionId: selectedActionId,
        agentIds: selectedAlert,
        orgAccountStructureLevel: [
          {levelName: 'AccountId', levelValue: accountId || ''},
          {levelName: 'SiteId', levelValue: siteId || ''},
          {levelName: 'GroupId', levelValue: groupId || ''},
        ],
      }
      const response = await fetchAgentActionUrl(data)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDismiss = () => {
    setIsConfirmModalVisible(false)
  }

  const handleSendMessage = (message) => {
    // Logic for sending the message
    console.log('Message sent:', message)
    notify('Message sent successfully!')
    setSendMessageModalVisible(false)
  }

  const handleCloseSendMessageModal = () => {
    setSendMessageModalVisible(false)
  }
  const handleMoveAgent = (newSiteId) => {
    // Logic for moving agent to another site
    setMoveAgentToSiteModalVisible(false);
    console.log(newSiteId); // Implement your move agent logic here
  };

  const handleCloseMoveAgentModal = () => {
    setMoveAgentToSiteModalVisible(false);
  };
  const handleGroup = () => {}

  // const actionItems = [
  //   {name: 'Action 1', subItems: ['Sub Action 1', 'Sub Action 2']},
  //   {name: 'Action 2', subItems: ['Sub Action 3', 'Sub Action 4']},
  //   {name: 'Action 3', subItems: ['Sub Action 5', 'Sub Action 6']},
  //   {name: 'Action 4', subItems: ['Sub Action 7', 'Sub Action 8']},
  //   {name: 'Action 5', subItems: ['Sub Action 9', 'Sub Action 10']},
  //   {name: 'Action 6', subItems: ['Sub Action 11', 'Sub Action 12']},
  //   {name: 'Action 7', subItems: ['Sub Action 13', 'Sub Action 14']},
  //   {name: 'Action 8', subItems: ['Sub Action 15', 'Sub Action 16']},
  //   {name: 'Action 9', subItems: ['Sub Action 17', 'Sub Action 18']},
  //   {name: 'Action 10', subItems: ['Sub Action 19', 'Sub Action 20']},
  // ]
  const filteredActionItems = featureActions
    .filter((action) => action.actionDisplayName.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((action) => action.actionName !== 'Access')
    .filter((action) => isActionAuthorized(action.actionName))
  return (
    <div>
      <ToastContainer />
      {loading ? (
        <UsersListLoading />
      ) : (
        <div className='card pad-10'>
          <div className='header-filter mg-btm-20 row'>
            <div className='col-lg-3 d-flex justify-content-between'>
              {/* <Dropdown
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
                    {filteredActionItems.map((action, index) => (
                      <DropdownItemWithSubmenu
                        key={index}
                        item={action.actionDisplayName}
                        // subItems={action.subItems}
                        isCheckboxSelected={isCheckboxSelected}
                      />
                    ))}
                  </DropdownMenu>
                </Dropdown> */}
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
                  {filteredActionItems.map((action, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => handleActionClick(action.actionId, action.actionDisplayName)}
                    >
                      {action.actionDisplayName}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <Dropdown isOpen={groupDropdownOpen} toggle={toggleGroupDropdown}>
                <DropdownToggle className='no-pad'>
                  <div className={`btn btn-green btn-small ${!isCheckboxSelected && 'disabled'}`}>
                    Groups <i className='fa fa-caret-down link mg-left-5' />
                  </div>
                </DropdownToggle>
                <DropdownMenu className='w-auto'>
                  <DropdownItem
                    onClick={handleGroup}
                    className={!isCheckboxSelected ? 'disabled' : ''}
                  >
                    <i className='fa fa-users link mg-right-5' /> Groups
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className='col-lg-6'>
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
                Total({currentItems.length}/{filteredList.length})
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
                          value={item.id}
                          name={item.id}
                          onChange={(e) => handleselectedAlert(item, e)}
                          autoComplete='off'
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </td>
                    <td onClick={() => handleEndpointClick(item)} className='link-txt'>
                      {item.computerName}
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
          <ContinueConfirmation
            isVisible={isConfirmModalVisible}
            onContinue={handleConfirm}
            onDismiss={handleDismiss}
          />
          <SendMessageModal
            show={sendMessageModalVisible}
            handleClose={handleCloseSendMessageModal}
            handleSendMessage={handleSendMessage}
          />
          <MoveAgentToAnotherSiteModal
            show={moveAgentToSiteModalVisible}
            handleClose={handleCloseMoveAgentModal}
            handleMoveAgent={handleMoveAgent}
          />
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
      />
    </div>
  )
}

export default Endpoint
