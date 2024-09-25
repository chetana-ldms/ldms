import React, {useEffect, useState} from 'react'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {fetchAccountDetailsUrl} from '../../../../../api/SentinalApi'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {fetchSiteActionUrl, fetchSitesUrl} from '../../../../../api/SettingsApi'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input} from 'reactstrap'
import useFeatureActions from '../configuration/useFeatureActions'
import {fetchAgentActionUrl, fetchFeaturesActionsAuthorizedUrl} from '../../../../../api/Api'
import {notify, notifyFail} from '../components/notification/Notification'
import 'react-toastify/dist/ReactToastify.css'
import ContinueConfirmation from '../../../../../../utils/ContinueConfirmation'
import {useNavigate} from 'react-router-dom'
import UpdateSiteModel from './UpdateSiteModel'
import {ToastContainer} from 'react-toastify'
import UpdateSiteMoreModel from './UpdateSiteMoreModel'
import ReactivateSiteModel from './ReactivateSiteModel'

function Sites() {
  const navigate = useNavigate()
  const [sites, setSites] = useState([])
  console.log(sites, 'sites')
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false)
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false)
  const [features, setFeatures] = useState([])
  const [selectedActionId, setSelectedActionId] = useState(null)
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)
  const toggleActionDropdown = () => setActionDropdownOpen(!actionDropdownOpen)
  const [items, setItems] = useState([])
  const [selectedActionDisplayName, setSelectedActionDisplayName] = useState('')
  const [computerNames, setComputerNames] = useState('')
  const [loading, setLoading] = useState(false)
  const [updateSiteModel, setUpdateSiteModel] = useState(false)
  const [updateSiteMoreModel, setUpdateSiteMoreModel] = useState(false)
  const [reactivateSiteModel, setReactivateSiteModel] = useState(false)
  const disableActions = ['Delete Site', 'Expire Site', 'Reactivate Site']

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
  const fetchData = async () => {
    const data = {
      orgID: orgId,
      accountId: accountId,
    }
    try {
      setLoading(true)
      const response = await fetchSitesUrl(data)
      let fetchedSites = response.sites

      if (groupId) {
        setSites([])
      } else if (siteId) {
        const filteredSite = fetchedSites.filter((site) => site.id === siteId)
        setSites(filteredSite)
      } else {
        setSites(fetchedSites)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewSiteClick = () => {
    navigate('/qradar/site-stepper')
  }
  useEffect(() => {
    fetchData()
  }, [])
  const handleActionClick = (actionId, actionDisplayName) => {
    setSelectedActionId(actionId)
    setSelectedActionDisplayName(actionDisplayName)

    switch (actionDisplayName) {
      case 'Site Update':
        if (items.length > 1) {
          setUpdateSiteMoreModel(true)
        } else {
          setUpdateSiteModel(true)
        }
        break
      case 'Reactivate Site':
        setReactivateSiteModel(true)
        break
      default:
        setIsConfirmModalVisible(true)
    }
  }
  const sendSelectedItemsToBackend = async () => {
    const siteId = items.map((item) => item.id).join(',')
    const siteNames = items.map((item) => item.name).join(', ')

    const payload = {
      orgId,
      toolId,
      actionId: selectedActionId,
      siteId: siteId,
      siteName: siteNames,
      executedUserId: Number(sessionStorage.getItem('userId')),
      executedDate: new Date().toISOString(),
    }

    console.log(payload, 'payload')
    try {
      const response = await fetchSiteActionUrl(payload)
      const {isSuccess, message} = response
      if (isSuccess) {
        fetchData()
        notify(message)
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const refreshData = () => {
    fetchData()
    setItems([])
  }

  const handleConfirm = async () => {
    setIsConfirmModalVisible(false)
    if (items.length === 1) {
      try {
        await sendSelectedItemsToBackend()
        setItems([])
        setIsCheckboxSelected(false)
      } catch (error) {
        console.log(error)
      }
    }
  }
  useEffect(() => {
    if (items && items.length > 0) {
      const names = items
        .map((item, index) => (index === items.length - 1 ? item.name : `${item.name}, `))
        .join('')
      setComputerNames(names)
    }
  }, [items])

  const handleDismiss = () => {
    setIsConfirmModalVisible(false)
  }
  const filteredActionItems = featureActions
    .filter((action) => action.actionName !== 'Access')
    .filter((action) => action.actionType == 'Site Action')
    .filter((action) => isActionAuthorized(action.actionName))
  console.log(filteredActionItems, 'filteredActionItems')
  return (
    <div className='ldc-application'>
      <ToastContainer />
      {loading ? (
        <UsersListLoading />
      ) : (
        <div className='card pad-10'>
          <div className='header-filter mg-btm-20 row'>
            <div className='col-lg-3 d-flex'>
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
                  {filteredActionItems.map((action, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => handleActionClick(action.actionId, action.actionDisplayName)}
                      disabled={
                        (items.length > 1 && disableActions.includes(action.actionDisplayName)) ||
                        (action.actionDisplayName === 'Expire Site' &&
                          items.some((item) => item.state === 'expired')) ||
                        (action.actionDisplayName === 'Reactivate Site' &&
                          items.some((item) => item.state == 'active')) ||
                        (action.actionDisplayName === 'Delete Site' &&
                          items.some((item) => item.state === 'deleted'))
                      }
                    >
                      {action.actionDisplayName}
                    </DropdownItem>
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
              <UpdateSiteModel
                show={updateSiteModel}
                handleClose={() => setUpdateSiteModel(false)}
                items={items}
                selectedActionId={selectedActionId}
                refreshData={refreshData}
              />
              <UpdateSiteMoreModel
                show={updateSiteMoreModel}
                handleClose={() => setUpdateSiteMoreModel(false)}
                items={items}
                selectedActionId={selectedActionId}
                refreshData={refreshData}
              />
              <ReactivateSiteModel
                show={reactivateSiteModel}
                handleClose={() => setReactivateSiteModel(false)}
                items={items}
                selectedActionId={selectedActionId}
                refreshData={refreshData}
                computerNames={computerNames}
              />
              <button className='btn btn-green btn-small ms-5' onClick={handleNewSiteClick}>
                New Site
              </button>
            </div>
            <div className='col-lg-9 d-flex justify-content-end'>
              <div className='fs-15 mt-2'>
                {' '}
                Total({sites ? sites.length : 0}/{sites ? sites.length : 0})
              </div>
            </div>
          </div>
          <table className='table alert-table scroll-x '>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>SKU</th>
                <th>Add-Ons</th>
                <th>Singularity Platform Settings</th>
                <th>Total Licenses</th>
                <th>Active Agents</th>
                <th>Created At</th>
                <th>Expiration Date</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {sites !== null && sites.length > 0 ? (
                sites?.map((item, index) => (
                  <tr
                    className={`table-row ${
                      item.state === 'deleted' || item.state === 'expired'
                        ? 'text-muted bg-light pointer-events-none'
                        : ''
                    }`}
                    key={index}
                  >
                    <td>
                      {item.state == 'active' || item.state === 'expired' ? (
                        <div className='form-check form-check-sm form-check-custom form-check-solid pe-2 me-5'>
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
                      ) : null}
                    </td>
                    <td>
                      {item.name} {item.state === 'deleted' ? '(Deleted)' : ''}
                    </td>
                    <td>
                      {item.sku}({item.totalLicenses})
                    </td>
                    <td>
                      {item?.licenses?.modules?.map((name, index) => (
                        <span key={index}>{name.displayName}</span>
                      ))}
                    </td>
                    <td>
                      {item?.licenses?.settings?.map((item) => (
                        <span key={index}>
                          {item.settingGroupDisplayName}: {item.displayName}
                        </span>
                      ))}
                    </td>
                    <td>{item.totalLicenses == '0' ? 'Unlimited' : item.totalLicenses}</td>
                    <td>{item.activeLicenses}</td>
                    <td>{getCurrentTimeZone(item.createdAt)}</td>
                    <td>{getCurrentTimeZone(item.expiration)}</td>
                    <td>{item.siteType}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='24'>No data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Sites
