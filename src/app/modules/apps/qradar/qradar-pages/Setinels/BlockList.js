import {useEffect, useState} from 'react'
import {fetchBlokckedListUrl} from '../../../../../api/SentinalApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import Pagination from '../../../../../../utils/Pagination'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import BlockListPopUp from './BlockListPopUp'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import {renderSortIcon, sortedItems} from '../../../../../../utils/Sorting'

function BlockList() {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [loading, setLoading] = useState(false)
  const [blockList, setBlockList] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [showPopup, setShowPopup] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [includeChildren, setIncludeChildren] = useState(true)
  const [includeParents, setIncludeParents] = useState(true)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [filterValue, setFilterValue] = useState('')
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  })

  const fetchData = async () => {
    const data = {
      orgID: orgId,
      includeChildren: includeChildren,
      includeParents: includeParents,
    }
    try {
      setLoading(true)
      const response = await fetchBlokckedListUrl(data)
      setBlockList(response)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchData()
  }, [includeChildren, includeParents])

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(0)
  }

  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems =
    blockList !== null
      ? sortedItems(
          blockList.filter((item) => item.osType.toLowerCase().includes(filterValue.toLowerCase())),
          sortConfig
        ).slice(indexOfFirstItem, indexOfLastItem)
      : null

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
    setSortConfig({key, direction})
  }

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected)
  }

  const openPopup = () => {
    setShowPopup(true)
  }

  const closePopup = () => {
    setShowPopup(false)
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

  const [dropdownOpen, setDropdownOpen] = useState(false) // State to manage dropdown toggle
  // Function to extract table data
  const extractTableData = (items) => {
    return items.map((item) => ({
      OS: item.osType,
      Description: item.description,
      Hash: item.value,
      'Scope Path': item.scopePath,
      User: item.UserName,
      Warning: item.notRecommended,
      'Last Updated': getCurrentTimeZone(item.updatedAt),
      Source: item.source,
      Scope: item.scopeName,
      Imported: item.imported ? 'Yes' : 'No',
    }))
  }
  // Function to convert data to CSV format
  const convertToCSV = (data) => {
    const csvRows = []

    // Add header row
    const header = Object.keys(data[0])
    csvRows.push(header.join(','))

    // Add data rows
    data.forEach((item) => {
      const values = header.map((key) => {
        let value = item[key]
        // Escape double quotes in values
        if (typeof value === 'string') {
          value = value.replace(/"/g, '""')
        }
        // Enclose value in double quotes if it contains special characters
        if (/[",\n]/.test(value)) {
          value = `"${value}"`
        }
        return value
      })
      csvRows.push(values.join(','))
    })

    // Combine rows into a single string
    return csvRows.join('\n')
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
    const tableData = extractTableData(blockList)
    exportToCSV(tableData)
  }

  // Function to extract current pagination table data
  const exportCurrentTableToCSV = () => {
    const tableData = extractTableData(currentItems)
    exportToCSV(tableData)
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
          <div className='row mb-5'>
            <div className='col-lg-6'>
              <Dropdown
                isOpen={dropdown}
                toggle={() => setDropdown(!dropdown)}
                className='float-left mg-right-10'
              >
                <DropdownToggle className='no-pad btn btn-small btn-border'>
                  <div className=''>
                    All related scopes <i className='fa fa-chevron-down link mg-left-5' />
                  </div>
                </DropdownToggle>
                <DropdownMenu className='w-auto px-5'>
                  <label className='dropdown-checkbox'>
                    <input
                      type='checkbox'
                      name='thisScopeAndItsAncestors'
                      onChange={handleCheckboxChange}
                      checked={includeParents} // Set checked state
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
                      checked={includeChildren} // Set checked state
                    />
                    <span>
                      <i className='link mg-right-5' /> This scope and its descendants
                    </span>
                  </label>
                </DropdownMenu>
              </Dropdown>

              <button className='btn btn-new btn-small float-left' onClick={openPopup}>
                Add New
              </button>
              {showPopup && <BlockListPopUp show={openPopup} onClose={closePopup} />}
              <div className='float-left mg-left-10'>
                <button className='btn btn-new btn-small float-left'>Delete selection</button>
              </div>
            </div>
            <div className='col-lg-6 text-right'>
              {/* <span className="gray inline-block mg-righ-20">530 Items</span> */}
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
          </div>
          {currentItems !== null && (
            <>
              <table className='table alert-table scroll-x'>
                <thead>
                  <tr>
                    <th>
                      <input type='checkbox' name='selectAll' />
                    </th>
                    <th onClick={() => handleSort('osType')}>
                      OS {renderSortIcon(sortConfig, 'osType')}
                    </th>
                    <th onClick={() => handleSort('description')}>
                      Description {renderSortIcon(sortConfig, 'description')}
                    </th>
                    <th onClick={() => handleSort('value')}>
                      Hash {renderSortIcon(sortConfig, 'value')}
                    </th>
                    <th onClick={() => handleSort('scopePath')}>
                      Scope Path {renderSortIcon(sortConfig, 'scopePath')}
                    </th>
                    <th onClick={() => handleSort('userName')}>
                      User {renderSortIcon(sortConfig, 'userName')}
                    </th>
                    <th onClick={() => handleSort('notRecommended')}>
                      warning {renderSortIcon(sortConfig, 'notRecommended')}
                    </th>
                    <th onClick={() => handleSort('updatedAt')}>
                      Last Update {renderSortIcon(sortConfig, 'updatedAt')}
                    </th>
                    <th onClick={() => handleSort('source')}>
                      Source {renderSortIcon(sortConfig, 'source')}
                    </th>
                    <th onClick={() => handleSort('scopeName')}>
                      Scope {renderSortIcon(sortConfig, 'scopeName')}
                    </th>
                    <th onClick={() => handleSort('imported')}>
                      Imported {renderSortIcon(sortConfig, 'imported')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems !== null ? (
                    currentItems?.map((item) => (
                      <tr className='table-row' key={item.id}>
                        <td>
                          <input type='checkbox' name={`checkbox_${item.id}`} />
                        </td>
                        <td>{item.osType}</td>
                        <td>{item.description}</td>
                        <td>{item.value}</td>
                        <td>{item.scopePath}</td>
                        <td>{item.userName}</td>
                        <td>{item.notRecommended}</td>
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
                pageCount={Math.ceil(blockList.length / itemsPerPage)}
                handlePageClick={handlePageClick}
                itemsPerPage={itemsPerPage}
                handlePageSelect={handlePageSelect}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}

export default BlockList
