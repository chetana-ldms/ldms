import React, { useState, useEffect } from 'react'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Pagination from '../../../../../../utils/Pagination'
import { fetchAllMasterDataUrl } from '../../../../../api/ConfigurationApi'
import { useErrorBoundary } from 'react-error-boundary'
import ManageMasterDataModal from './ManageMasterDataModal'

const MasterData = () => {
  const handleError = useErrorBoundary()
  const [tools, setTools] = useState([])
  const [filterValue, setFilterValue] = useState('')
  const [dataTypeFilter, setDataTypeFilter] = useState('')
  const [toolNameFilter, setToolNameFilter] = useState('')
  const [organizationNameFilter, setOrganizationNameFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activePage, setActivePage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isManageMasterDataModalVisible, setIsManageMasterDataModalVisible] = useState(false)

  const reload = async () => {
    try {
      setLoading(true)
      const response = await fetchAllMasterDataUrl()
      setTools(response)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [itemsPerPage])

  const handleSave = () => {
    reload()
  }

  const applyFilters = () => {
    let filteredTools = tools

    if (filterValue) {
      filteredTools = filteredTools.filter((item) =>
        item.searchText.toLowerCase().includes(filterValue.toLowerCase())
      )
    }

    if (dataTypeFilter) {
      filteredTools = filteredTools.filter((item) => item.dataType === dataTypeFilter)
    }

    if (toolNameFilter) {
      filteredTools = filteredTools.filter((item) => item.toolName === toolNameFilter)
    }

    if (organizationNameFilter) {
      filteredTools = filteredTools.filter((item) => item.organizationName === organizationNameFilter)
    }

    return filteredTools
  }

  const filteredList = applyFilters()
  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(0)
    setActivePage(0)
  }

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected)
    setActivePage(selected.selected)
  }

  return (
    <div className='card pad-10 config'>
      <ToastContainer />
      <div className='card-header no-pad'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>
            MasterData ({currentItems.length} / {filteredList.length})
          </span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <button
              className='btn btn-green btn-small'
              onClick={() => setIsManageMasterDataModalVisible(true)}
            >
              Manage Master Data
            </button>
          </div>
        </div>
        <ManageMasterDataModal
          show={isManageMasterDataModalVisible}
          handleClose={() => setIsManageMasterDataModalVisible(false)}
          tags={[]}
          onSave={handleSave}
        />
      </div>
      <div className='row mb-5 mt-2'>
        {/* Search Input */}
        <div className='col-lg-4'>
          <input
            type='text'
            placeholder='Search...'
            className='form-control'
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>
        {/* Dropdowns */}
        <div className='col-lg-2'>
          <select
            className='form-control p-0 ps-2'
            value={dataTypeFilter}
            onChange={(e) => setDataTypeFilter(e.target.value)}
          >
            <option value=''>Data Types</option>
            {Array.from(new Set(tools.map((item) => item.dataType))).map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className='col-lg-2'>
          <select
            className='form-control p-0 ps-2'
            value={toolNameFilter}
            onChange={(e) => setToolNameFilter(e.target.value)}
          >
            <option value=''>Tool Names</option>
            {Array.from(new Set(tools.map((item) => item.toolName))).map((tool, idx) => (
              <option key={idx} value={tool}>
                {tool}
              </option>
            ))}
          </select>
        </div>
        <div className='col-lg-2'>
          <select
            className='form-control p-0 ps-2'
            value={organizationNameFilter}
            onChange={(e) => setOrganizationNameFilter(e.target.value)}
          >
            <option value=''>Organizations</option>
            {Array.from(new Set(tools.map((item) => item.organizationName))).map(
              (org, idx) => (
                <option key={idx} value={org}>
                  {org}
                </option>
              )
            )}
          </select>
        </div>
      </div>
      <div className='card-body no-pad'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th>Data Type</th>
              <th>Data Name</th>
              <th>Data Value</th>
              <th>Tool Name</th>
              <th>Organization Name</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={index} className='fs-12 table-row'>
                  <td>{item.dataType}</td>
                  <td>{item.dataName}</td>
                  <td>{item.dataValue}</td>
                  <td>{item.toolName}</td>
                  <td>{item.organizationName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='5' className='text-center'>
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {filteredList && (
          <Pagination
            pageCount={Math.ceil(filteredList.length / itemsPerPage)}
            handlePageClick={handlePageClick}
            itemsPerPage={itemsPerPage}
            handlePageSelect={handlePageSelect}
            forcePage={activePage}
          />
        )}
      </div>
    </div>
  )
}

export { MasterData }
