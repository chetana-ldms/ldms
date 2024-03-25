import React, {useState, useEffect} from 'react'
import ReactPaginate from 'react-paginate'
import {fetchApplicationsAndRisksUrl} from '../../../../../api/ApplicationSectionApi'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import RiskEndpointPopUp from './RiskEndpointPopUp'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'

function RisksComponent() {
  const [dropdownOpen, setDropdownOpen] = useState(false) // State to manage dropdown toggle

  const [loading, setLoading] = useState(false)
  const [risk, setRisk] = useState([])
  const [filterValue, setFilterValue] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  })
  const orgId = Number(sessionStorage.getItem('orgId'))
  const fetchData = async () => {
    const data = {
      orgID: orgId,
    }
    try {
      setLoading(true)
      const response = await fetchApplicationsAndRisksUrl(data)
      setRisk(response.data)
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
  const currentItems = risk
    .filter((item) => item.name.toLowerCase().includes(filterValue.toLowerCase()))
    .slice(indexOfFirstItem, indexOfLastItem)

  const sortTable = (key) => {
    const direction =
      key === sortConfig.key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
    setSortConfig({key, direction})
  }
  const sortedItems = () => {
    if (sortConfig.key !== null) {
      return [...currentItems].sort((a, b) => {
        const valueA = getValueForSorting(a, sortConfig.key)
        const valueB = getValueForSorting(b, sortConfig.key)
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortConfig.direction === 'ascending'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA)
        } else {
          return sortConfig.direction === 'ascending' ? valueA - valueB : valueB - valueA
        }
      })
    }
    return currentItems
  }
  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? (
        <>
          <i className='fa fa-caret-up white ps-3' />
        </>
      ) : (
        <>
          <i className='fa fa-caret-down white ps-3' />
        </>
      )
    }
    return (
      <>
        <i className='fa fa-sort white ps-3' />
      </>
    )
  }

  const getValueForSorting = (item, key) => {
    if (key === 'label') {
      const mostCommonStatus = item.statuses.reduce((prev, current) => {
        return prev.count > current.count ? prev : current
      })
      return mostCommonStatus.label
    } else {
      return item[key]
    }
  }
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

  const extractTableData = (items) => {
    return items.map((item) => ({
      Name: item.name,
      Vendor: item.vendor,
      'Highest Severity': item.highestSeverity,
      'Highest NVD Base Score': item.highestNvdBaseScore ?? 0,
      'Number of CVEs': item.cveCount,
      'Number of Endpoints': item.endpointCount,
      'Application Detection Date': getCurrentTimeZone(item.detectionDate),
      'Days from Detection': item.daysDetected,
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
    const fileName = 'risk_data.csv'
    if (navigator.msSaveBlob) {
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
  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
  }

  return (
    <div>
      {loading ? (
        <UsersListLoading />
      ) : (
        <>
          <div className='application-section mg-top-20 mg-btm-20'>
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
                        <i className='fa fa-file-excel link mg-right-5' /> Export current page
                        report
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
          <table className='table alert-table scroll-x'>
            <thead>
              <tr className='fw-bold text-muted bg-blue'>
                <th onClick={() => sortTable('name')}>Application Name {renderSortIcon('name')}</th>
                <th onClick={() => sortTable('vendor')}>Vendor {renderSortIcon('vendor')}</th>
                <th onClick={() => sortTable('highestSeverity')}>
                  Highest Severity {renderSortIcon('highestSeverity')}
                </th>
                <th onClick={() => sortTable('highestNvdBaseScore')}>
                  Highest NVD base score {renderSortIcon('highestNvdBaseScore')}
                </th>
                <th onClick={() => sortTable('cveCount')}>
                  Number of CVEs {renderSortIcon('cveCount')}
                </th>
                <th onClick={() => sortTable('endpointCount')}>
                  Number of Endpoints {renderSortIcon('endpointCount')}
                </th>
                <th onClick={() => sortTable('detectionDate')}>
                  Application Detection Date {renderSortIcon('detectionDate')}
                </th>
                <th onClick={() => sortTable('daysDetected')}>
                  Days from Detection {renderSortIcon('daysDetected')}
                </th>
              </tr>
            </thead>

            <tbody>
              {/* {loading && <UsersListLoading />} */}
              {sortedItems() !== null ? (
                sortedItems().map((item, index) => (
                  <tr key={index} className='table-row'>
                    <td onClick={() => handleItemClick(item)} className='link-txt'>
                      {item.name}
                    </td>
                    <td>{item.vendor}</td>
                    <td>{item.highestSeverity}</td>
                    <td>{item.highestNvdBaseScore ?? 0}</td>
                    <td>{item.cveCount}</td>
                    <td>{item.endpointCount}</td>
                    <td>{getCurrentTimeZone(item.detectionDate)}</td>
                    <td>{item.daysDetected}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No data found</td>
                </tr>
              )}
            </tbody>
          </table>
          <RiskEndpointPopUp
            selectedItem={selectedItem}
            showModal={showPopup}
            setShowModal={setShowPopup}
          />
          <div className='d-flex justify-content-end align-items-center pagination-bar'>
            <ReactPaginate
              previousLabel={<i className='fa fa-chevron-left' />}
              nextLabel={<i className='fa fa-chevron-right' />}
              pageCount={Math.ceil(risk.length / itemsPerPage)}
              marginPagesDisplayed={1}
              pageRangeDisplayed={8}
              onPageChange={handlePageClick}
              containerClassName={'pagination justify-content-end'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item custom-previous'}
              previousLinkClassName={'page-link custom-previous-link'}
              nextClassName={'page-item custom-next'}
              nextLinkClassName={'page-link custom-next-link'}
              breakClassName={'page-item'}
              breakLinkClassName={'page-link'}
              activeClassName={'active'}
            />
            <div className='col-md-3 d-flex justify-content-end align-items-center'>
              <span className='col-md-4'>Count: </span>
              <select
                className='form-select form-select-sm col-md-4'
                value={itemsPerPage}
                onChange={handlePageSelect}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default RisksComponent
