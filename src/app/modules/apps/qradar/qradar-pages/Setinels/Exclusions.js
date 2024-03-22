import {useEffect, useState} from 'react'
import ReactPaginate from 'react-paginate'
import {fetchAEndPointDetailsUrl} from '../../../../../api/ApplicationSectionApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import Pagination from '../../../../../../utils/Pagination'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {fetchExclusionListUrl} from '../../../../../api/SentinalApi'
import {useAbsoluteLayout} from 'react-table'
import MitigationModal from '../alerts/MitigationModal'
import AddToBlockListModal from '../alerts/AddToBlockListModal'
import CreateExclusionModal from './CreateExclusionModal'
import AddFromExclusionsCatalogModal from './AddFromExclusionsCatalogModal'

function Exclusions() {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [loading, setLoading] = useState(false)
  const [exlusions, setExlusions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMoreActionsModal, setShowMoreActionsModal] = useState(false)
  const [addToBlockListModal, setAddToBlockListModal] = useState(false)
  const [selectedValue, setSelectedValue] = useState('')
  console.log(exlusions, 'exlusions111')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  const fetchData = async () => {
    const data = {
      orgID: orgId,
    }
    try {
      setLoading(true)
      const response = await fetchExclusionListUrl(data)
      setExlusions(response)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(0)
  }

  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = exlusions.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected)
  }

  const handleThreatActions = () => {
    setShowDropdown(true)
    console.log(showDropdown, 'showDropdown')
  }
  const handleShowDropdown = () => {
    setShowDropdown(false)
  }
  const handleCloseMoreActionsModal = () => {
    setShowMoreActionsModal(false)
    setShowDropdown(false)
  }
  const handleAction = () => {
    handleCloseMoreActionsModal()
  }
  const handleCloseAddToBlockList = () => {
    setAddToBlockListModal(false)
    setShowDropdown(false)
  }
  const handleActionAddToBlockList = () => {
    setAddToBlockListModal(false)
  }
  const handleDropdownSelect = async (event) => {
    const value = event.target.value
    setSelectedValue(value)
    if (value === 'CreateExclusion') {
      setShowMoreActionsModal(true)
    } else if (value === 'AddFromExclusionsCatalog') {
      setAddToBlockListModal(true)
    } else {
      setShowDropdown(false)
    }
  }
  return (
    <div>
      {loading ? (
        <UsersListLoading />
      ) : (
        <>
          <div className='row'>
            <div className='col-lg-6 d-flex'>
              <div className='mb-3'>
                <a
                  href='#'
                  className='btn btn-small btn-primary '
                  data-kt-menu-trigger='click'
                  data-kt-menu-placement='bottom-end'
                  onClick={handleThreatActions}
                >
                  New Exclusion
                </a>
                <div
                  className='menu menu-sub menu-sub-dropdown w-250px w-md-300px alert-action'
                  data-kt-menu='true'
                >
                  {showDropdown && (
                    <div className='px-5 py-5'>
                      <div className='mb-5'>
                        <div className='d-flex justify-content-end mb-5'>
                          <div>
                            <div
                              className='close fs-20 text-muted pointer'
                              aria-label='Close'
                              onClick={handleShowDropdown}
                            >
                              <span
                                aria-hidden='true'
                                style={{
                                  color: 'inherit',
                                  textShadow: 'none',
                                }}
                              >
                                &times;
                              </span>
                            </div>
                          </div>
                        </div>
                        <select
                          onChange={handleDropdownSelect}
                          className='form-select form-select-solid'
                          data-kt-select2='true'
                          data-control='select2'
                          data-placeholder='Select option'
                          data-allow-clear='true'
                        >
                          <option value='' className='p-2'>
                            Select
                          </option>
                          <option value='CreateExclusion' className='mb-2'>
                            Create Exclusion
                          </option>
                          <option value='AddFromExclusionsCatalog' className='mb-2'>
                            Add from exclusions Catalog
                          </option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
                {showMoreActionsModal && (
                  <CreateExclusionModal
                    show={showMoreActionsModal}
                    handleClose={handleCloseMoreActionsModal}
                    handleAction={handleAction}
                    selectedValue={selectedValue}
                  />
                )}
                {addToBlockListModal && (
                  <AddFromExclusionsCatalogModal
                    show={addToBlockListModal}
                    handleClose={handleCloseAddToBlockList}
                    handleAction={handleActionAddToBlockList}
                    selectedValue={selectedValue}
                  />
                )}
              </div>
              <button className='btn btn-small btn-primary ms-2 '>Delete selection</button>
            </div>
            <div className='col-lg-6 text-right'>
              <span className='gray inline-block mg-righ-20'>{exlusions.length} Items</span>
              <span className='inline-block mg-left-10 link'>
                Export <i className='fas fa-file-export link' />
              </span>
            </div>
          </div>
          <table className='table alert-table scroll-x'>
            <thead>
              <tr>
                <th>
                  <input type='checkbox' name='selectAll' />
                </th>
                <th>Exclusion Type</th>
                <th>OS</th>
                <th>Application Name</th>
                <th>Inventory Listed</th>
                <th>Description</th>
                <th>Value</th>
                <th>Scope path </th>
                <th>User</th>
                <th>Mode</th>
                <th>Last Update</th>
                <th>Source</th>
                <th>Scope</th>
                <th>Imported</th>
              </tr>
            </thead>
            <tbody>
              {currentItems !== null ? (
                currentItems?.map((item, index) => (
                  <tr className='table-row' key={index}>
                    <td>
                      <input type='checkbox' name={`checkbox_${item.id}`} />
                    </td>
                    <td></td>
                    <td>{item.osType}</td>
                    <td>{item.applicationName}</td>
                    <td></td>
                    <td>{item.description}</td>
                    <td>{item.value}</td>
                    <td>{item?.scopePath}</td>
                    <td>{item.userName}</td>
                    <td>{item.mode}</td>
                    <td>{getCurrentTimeZone(item.updatedAt)}</td>
                    <td>{item.source}</td>
                    <td>{item.scopeName}</td>
                    <td>{item.imported ? 'Yes' : 'No'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='24'>No data found</td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            pageCount={Math.ceil(exlusions.length / itemsPerPage)}
            handlePageClick={handlePageClick}
            itemsPerPage={itemsPerPage}
            handlePageSelect={handlePageSelect}
          />
        </>
      )}
    </div>
  )
}

export default Exclusions
