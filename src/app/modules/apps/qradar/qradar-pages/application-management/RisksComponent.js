import React, {useState, useEffect} from 'react'
import {fetchApplicationsAndRisksUrl} from '../../../../../api/ApplicationSectionApi'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {Link} from 'react-router-dom'

function RisksComponent() {
  const [loading, setLoading] = useState(false)
  const [risk, setRisk] = useState([])
  console.log(risk, 'risk')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20); 
  const [sortConfig, setSortConfig] = useState({key: null, direction: 'ascending'})
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

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = risk !== null ? risk.slice(indexOfFirstItem, indexOfLastItem) : null
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

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
        <i className='bi bi-caret-up-fill'></i>
      ) : (
        <i className='bi bi-caret-down-fill'></i>
      )
    }
    return null
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
    setItemsPerPage(Number(event.target.value)); 
    setCurrentPage(1); 
  };

  return (
    <div>
      <div className='application-section mg-top-20 mg-btm-20'>
        <div className='header-filter mg-btm-20'>
          <form>
            <select className='form-select'>
              <option>Select filter</option>
            </select>
          </form>
        </div>
      </div>
      <table className='table alert-table scroll-x'>
        <thead>
          <tr className='fw-bold text-muted bg-blue'>
            <th className='fs-12' onClick={() => sortTable('name')}>
              Application Name {renderSortIcon('name')}
            </th>
            <th className='fs-12' onClick={() => sortTable('vendor')}>
              Vendor {renderSortIcon('vendor')}
            </th>
            <th className='fs-12' onClick={() => sortTable('highestSeverity')}>
              Highest Severity {renderSortIcon('highestSeverity')}
            </th>
            <th className='fs-12' onClick={() => sortTable('highestNvdBaseScore')}>
              Highest NVD base score {renderSortIcon('highestNvdBaseScore')}
            </th>
            <th className='fs-12' onClick={() => sortTable('cveCount')}>
              Number of CVEs {renderSortIcon('cveCount')}
            </th>
            <th className='fs-12' onClick={() => sortTable('endpointCount')}>
              Number of Endpoints {renderSortIcon('endpointCount')}
            </th>
            <th className='fs-12' onClick={() => sortTable('detectionDate')}>
              Application Detection Date {renderSortIcon('detectionDate')}
            </th>
            <th className='fs-12' onClick={() => sortTable('daysDetected')}>
              Days from Detection {renderSortIcon('daysDetected')}
            </th>
          </tr>
        </thead>
        <tbody>
          {loading && <UsersListLoading />}
          {sortedItems() !== null ? (
            sortedItems().map((item, index) => (
              <tr key={index} className='table-row'>
                <td>
                  <Link to={`/qradar/application/update/${encodeURIComponent(item.applicationId)}`}>
                    {item.name}
                  </Link>
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
      {currentItems !== null && (
        <nav>
		<div className="d-flex align-items-right">
		  <ul className='pagination'>
			{[...Array(Math.ceil(risk.length / itemsPerPage)).keys()].map((number) => (
			  <li key={number + 1} className='page-item'>
				<button
				  onClick={() => paginate(number + 1)}
				  className={`page-link ${currentPage === number + 1 ? 'active' : ''}`}
				>
				  {number + 1}
				</button>
			  </li>
			))}
		  </ul>
		  <div className="col-md-3 d-flex justify-content-end align-items-center">
			<span className="col-md-4">Count: </span>
			<select
			  className="form-select form-select-sm col-md-4"
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
	  </nav>
	  
		
      )}
    </div>
  )
}

export default RisksComponent
