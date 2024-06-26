import React, {useEffect, useState} from 'react'
import {fetchApplicationInventoryUrl} from '../../../../../api/ApplicationSectionApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import ReactPaginate from 'react-paginate'
import InventoryEndpointPopUp from './InventoryEndpointPopUp'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import {renderSortIcon, sortTable, sortedItems} from '../../../../../../utils/Sorting'
import Pagination from '../../../../../../utils/Pagination'
import { fetchExportDataAddUrl } from '../../../../../api/Api'

function InventoryComponent() {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Define functions for data extraction, conversion, and export

  const extractTableData = (items) => {
    return items.map((item) => ({
      Name: item.applicationName,
      Vendor: item.applicationVendor,
      'Number of Versions': item.applicationVersionsCount,
      'Number of Endpoints': item.endpointsCount,
    }))
  }

  const convertToCSV = (data) => {
    const header = Object.keys(data[0]).join(',') + '\n'
    const body = data.map((item) => Object.values(item).join(',')).join('\n')
    return header + body
  }

  const exportToCSV = (data) => {
    const csvData = convertToCSV(data)
    const blob = new Blob([csvData], {type: 'text/csv;charset=utf-8;'})
    const fileName = 'inventory.csv'
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

  const exportTableToCSV = async () => {
    const fullData = extractTableData(filteredList);
    exportToCSV(fullData);
    const data = {
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem("userId")),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: "Inventory"
    };
    try {
      const response = await fetchExportDataAddUrl(data);
    } catch (error) {
      console.error(error);
    }
  };

  const exportCurrentTableToCSV = async() => {
    const currentData = extractTableData(currentItems)
    exportToCSV(currentData)
    const data = {
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem("userId")),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: "Inventory"
    };
    try {
      const response = await fetchExportDataAddUrl(data);
    } catch (error) {
      console.error(error);
    }
  }

  // Initialize states and data fetching

  const [loading, setLoading] = useState(false)
  const [risk, setRisk] = useState([])
  console.log(risk, "inventory")
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
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')

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
  }, [accountId, siteId, groupId, itemsPerPage])

  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = risk
    ? sortedItems(
        risk.filter((item) =>
          item.applicationName.toLowerCase().includes(filterValue.toLowerCase())
        ),
        sortConfig
      ).slice(indexOfFirstItem, indexOfLastItem)
    : null

    const filteredList = filterValue
    ? risk.filter((item) => item.applicationName.toLowerCase().includes(filterValue.toLowerCase()))
    : risk;

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
    setCurrentPage(0)
  }

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
    setSortConfig({key, direction})
  }

  return (
    <div className='application-section card pad-10 mt-5 mb-5'>
      {loading ? (
        <UsersListLoading />
      ) : (
        <>
          <div className='header-filter row'>
            <div className='col-lg-9'>
              <input
                type='text'
                placeholder='Search...'
                className='form-control'
                value={filterValue}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-lg-3 d-flex justify-content-between">
            <div className="fs-15 mt-2"> Total({currentItems.length}/{filteredList.length})</div>              
            <div className=''>
              <div className='export-report border-0 float-right'>
                <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
                  <DropdownToggle className='no-pad'>
                    <div className='btn btn-border btn-small'>
                      Export <i className='fa fa-file-export link mg-left-5' />
                    </div>
                  </DropdownToggle>
                  <DropdownMenu className='w-auto'>
                    <DropdownItem onClick={exportTableToCSV}>
                      <i className='fa fa-file-excel link mg-right-5' /> Export Full Report
                    </DropdownItem>
                    <DropdownItem onClick={exportCurrentTableToCSV}>
                      <i className='fa fa-file-excel link mg-right-5' /> Export Current Page Report
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
              </div>
          </div>
          <div className='actions'>
            {loading ? (
              <UsersListLoading />
            ) : (
              <table className='table alert-table mg-top-20 fixed-table scroll-x'>
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
                  {currentItems !== null ? (
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
          {risk && (
            <Pagination
              pageCount={Math.ceil(filteredList.length / itemsPerPage)}
              handlePageClick={handlePageClick}
              itemsPerPage={itemsPerPage}
              handlePageSelect={handlePageSelect}
            />
          )}
        </>
      )}
    </div>
  )
}

export default InventoryComponent
