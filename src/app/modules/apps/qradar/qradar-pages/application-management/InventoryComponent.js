import React, {useEffect, useState} from 'react'
import {fetchApplicationInventoryUrl} from '../../../../../api/ApplicationSectionApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import ReactPaginate from 'react-paginate'
import InventoryEndpointPopUp from './InventoryEndpointPopUp'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import {renderSortIcon, sortTable, sortedItems} from '../../../../../../utils/Sorting'
import Pagination from '../../../../../../utils/Pagination'

function InventoryComponent() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const extractTableData = (items) => {
    return items.map((item) => ({
      Name: item.applicationName,
      Vendor: item.applicationVendor,
      'Number of Versions': item.applicationVersionsCount,
      'Number of Endpoints': item.endpointsCount,
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
    const fileName = 'risk_data.csv'
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
  const exportTableToCSV = () => {
    const tableData = extractTableData(risk)
    exportToCSV(tableData)
  }

  // Function to extract current pagination table data
  const exportCurrentTableToCSV = () => {
    const tableData = extractTableData(currentItems)
    exportToCSV(tableData)
  }

  const [loading, setLoading] = useState(false)
  const [risk, setRisk] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  })
  const [filterValue, setFilterValue] = useState('')
  const orgId = Number(sessionStorage.getItem('orgId'))

  const fetchData = async () => {
    const data = {
      orgID: orgId,
      siteId: '',
    }
    try {
      setLoading(true)
      const response = await fetchApplicationInventoryUrl(data)
      setRisk(response)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedItems(
    risk.filter((item) => item.applicationName.toLowerCase().includes(filterValue.toLowerCase())),
    sortConfig
  ).slice(indexOfFirstItem, indexOfLastItem)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(0)
  }

  const handleItemClick = (item) => {
    setSelectedItem(item)
    setShowPopup(true)
  }

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected)
  }

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
  }
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
    setSortConfig({key, direction})
  }

  return (
    <div className='application-section mg-top-20 mg-btm-20'>
      {loading ? (
        <UsersListLoading />
      ) : (
        <>
          <div className='header-filter mg-btm-20 row'>
            <div className='col-lg-10'>
              <input
                type='text'
                placeholder='Enter filter'
                className='form-control'
                value={filterValue}
                onChange={handleFilterChange}
              />
            </div>
            <div className='col-lg-2'>
              <div className='export-report border-0'>
                <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
                  <DropdownToggle className='no-pad'>
                    <div className='btn btn-new btn-small'>Actions</div>
                  </DropdownToggle>
                  <DropdownMenu className='w-auto'>
                    <DropdownItem onClick={exportTableToCSV} className='border-btm'>
                      <i className='fa fa-file-excel link mg-right-5' /> Export full report
                    </DropdownItem>
                    <DropdownItem onClick={exportCurrentTableToCSV}>
                      <i className='fa fa-file-excel link mg-right-5' /> Export current page report
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </div>
          <div className='actions'>
            {loading ? (
              <UsersListLoading />
            ) : (
              <table className='table alert-table mg-top-20'>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('applicationName')}>
                      Name {renderSortIcon(sortConfig, 'applicationName')}
                    </th>
                    <th onClick={() => handleSort('applicationVendor')}>
                      Vendor {renderSortIcon(sortConfig, 'applicationVendor')}
                    </th>
                    <th onClick={() => handleSort('applicationVersionsCount')}>
                      Number of Versions {renderSortIcon(sortConfig, 'applicationVersionsCount')}
                    </th>
                    <th onClick={() => handleSort('endpointsCount')}>
                      Number of Endpoints {renderSortIcon(sortConfig, 'endpointsCount')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                  currentItems !== null ? (
                  currentItems.map((item, index) => (
                    <tr className='table-row' key={index}>
                      <td onClick={() => handleItemClick(item)} className='link-txt'>
                        {item.applicationName}
                      </td>
                      <td>{item.applicationVendor}</td>
                      <td>{item.applicationVersionsCount}</td>
                      <td>{item.endpointsCount}</td>
                    </tr>
                  ))
                  ) : (
                    <tr>
                      <td>No data found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
            <InventoryEndpointPopUp
              selectedItem={selectedItem}
              showModal={showPopup}
              setShowModal={setShowPopup}
            />
          </div>
          <hr />
           <Pagination
            pageCount={Math.ceil(risk.length / itemsPerPage)}
            handlePageClick={handlePageClick}
            itemsPerPage={itemsPerPage}
            handlePageSelect={handlePageSelect}
          />
        </>
      )}
    </div>
  )
}

export default InventoryComponent
