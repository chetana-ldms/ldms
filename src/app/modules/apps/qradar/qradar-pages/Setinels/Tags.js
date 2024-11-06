import {useEffect, useState} from 'react'
import {
  fetchTagsDeleteUrl,
  fetchTagsUrl,
} from '../../../../../api/SentinalApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import DeleteConfirmation from '../../../../../../utils/DeleteConfirmation'
import useFeatureActions from '../configuration/useFeatureActions'
import {truncateText} from '../../../../../../utils/TruncateText'
import TagsListPopUp from './TagsListPopUp'
import TagsEditPopup from './TagsEditPopup'

function Tags() {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [loading, setLoading] = useState(false)
  const [blockList, setBlockList] = useState([])
  const [refreshFlag, setRefreshFlag] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [showPopupEdit, setShowPopupEdit] = useState(false)
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [includeChildren, setIncludeChildren] = useState(true)
  const [includeParents, setIncludeParents] = useState(true)
  const [selectedAlert, setselectedAlert] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const [totalCount, setTotalCount] = useState('')
  const toolId = Number(sessionStorage.getItem('toolID'))
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))

  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }
  const fetchData = async () => {
    const data = {
      orgId: orgId,
      toolId: toolId,
      includeChildren: includeChildren,
      includeParents: includeParents,
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
      const response = await fetchTagsUrl(data)
      setBlockList(response?.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchData()
  }, [includeChildren, includeParents])
  const openPopup = () => {
    setShowPopup(true)
  }
  const closePopup = () => {
    setShowPopup(false)
  }

  const openPopupEdit = () => {
    setShowPopupEdit(true)
  }

  const closePopupEdit = () => {
    setShowPopupEdit(false)
  }
  const handleCheckboxChange = (event) => {
    const checkboxName = event.target.name
    const isChecked = event.target.checked

    if (checkboxName === 'thisScopeAndItsAncestors') {
      setIncludeParents(isChecked)
    } else if (checkboxName === 'thisScopeAndItsDescendants') {
      setIncludeChildren(isChecked)
    }
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
  const handleDelete = () => {
    setShowConfirmation(true)
  }

  const confirmDelete = async () => {
    if (selectedAlert) {
      const data = {
        orgId: orgId,
        tagIds: selectedAlert,
        toolId: toolId,
      }

      try {
        const response = await fetchTagsDeleteUrl(data)
        const {isSuccess, message} = response
        if (isSuccess) {
          notify(message)
          await fetchData()
          setIsCheckboxSelected(false)
          setselectedAlert([])
        } else {
          notifyFail(message)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setShowConfirmation(false)
      }
    }
  }
  const cancelDelete = () => {
    setShowConfirmation(false)
  }
  const handleRefreshActions = () => {
    setRefreshFlag(!refreshFlag)
    fetchData()
  }

  const handleTableRowClick = (item) => {
    setSelectedItem(item)
    if (isActionAuthorized('Update')) {
      setShowPopupEdit(true)
    }
  }
  return (
    <div>
      <ToastContainer />
      {loading ? (
        <UsersListLoading />
      ) : (
        <div className='card pad-10'>
          <div className='row mb-5'>
            <div className='col-lg-10 d-flex'>
              <Dropdown
                isOpen={dropdown}
                toggle={() => setDropdown(!dropdown)}
                className='float-left mg-right-10'
              >
                <DropdownToggle className='no-pad btn btn-small btn-border'>
                  <div className='fs-12 normal'>
                    Show full tag inventory
                    <i className='fa fa-chevron-down link mg-left-5' />
                  </div>
                </DropdownToggle>
                <DropdownMenu className='w-auto px-5'>
                  <label className='dropdown-checkbox'>
                    <input
                      type='checkbox'
                      name='thisScopeAndItsAncestors'
                      onChange={handleCheckboxChange}
                      checked={includeParents}
                    />
                    <span>
                      <i className='link mg-right-5' /> This scope and its ancestors
                    </span>
                  </label>{' '}
                  <br />
                  <label className='dropdown-checkbox'>
                    <input
                      type='checkbox'
                      name='thisScopeAndItsDescendants'
                      onChange={handleCheckboxChange}
                      checked={includeChildren}
                    />
                    <span>
                      <i className='link mg-right-5' /> This scope and its descendants
                    </span>
                  </label>
                </DropdownMenu>
              </Dropdown>

              <button
                className={`btn btn-green btn-small ms-3 ${
                  !isActionAuthorized('Create') ? 'disabled' : ''
                }`}
                onClick={openPopup}
              >
                {' '}
                Add New
              </button>
              {showPopup && (
                <TagsListPopUp
                  show={openPopup}
                  onClose={closePopup}
                  refreshParent={handleRefreshActions}
                />
              )}
              <div className='float-left mg-left-10'>
                <button
                  className={`btn btn-green btn-small float-left ${
                    !isCheckboxSelected || !isActionAuthorized('Delete') ? 'disabled' : ''
                  }`}
                  onClick={handleDelete}
                  disabled={!isCheckboxSelected || !isActionAuthorized('Delete')}
                >
                  Delete selection
                </button>
              </div>
              <div className='fs-15 mt-2 ms-5'> Total {blockList ? blockList.length : 0}</div>
            </div>
          </div>
          {blockList !== null && (
            <>
              <table className='table alert-table fixed-table scroll-x'>
                <thead>
                  <tr>
                    <th className='checkbox-th'></th>
                    <th>Key</th>
                    <th>Value</th>
                    <th>Description</th>
                    <th>Tagged Endpoints in This Scope</th>
                    <th>Scopes</th>
                    <th>Update By</th>
                    <th>Last Update</th>
                  </tr>
                </thead>
                <tbody>
                  {blockList !== null ? (
                    blockList?.map((item) => (
                      <tr
                        className='table-row'
                        key={item.id}
                        onClick={() => handleTableRowClick(item)}
                        style={{cursor: 'pointer'}}
                      >
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
                        <td>{item.key}</td>
                        <td title={item.value}> {truncateText(item.value, 20)}</td>
                        <td title={item.description}>{truncateText(item.description, 20)}</td>
                        <td title={item.totalEndpoints}>{item.totalEndpoints}</td>
                        <td title={item.scopePath}>{truncateText(item.scopePath, 20)}</td>
                        <td>{item.updatedBy}</td>
                        <td>{getCurrentTimeZone(item.updatedAt)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='24'>No data found</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {showConfirmation && (
                <DeleteConfirmation
                  show={showConfirmation}
                  onConfirm={confirmDelete}
                  onCancel={cancelDelete}
                />
              )}

              {showPopupEdit && selectedItem && (
                <TagsEditPopup
                  show={openPopupEdit}
                  onClose={closePopupEdit}
                  refreshParent={handleRefreshActions}
                  selectedItem={selectedItem}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Tags
