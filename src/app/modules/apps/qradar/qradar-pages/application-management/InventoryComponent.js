import React, {useEffect, useState} from 'react'
import {fetchApplicationInventoryUrl} from '../../../../../api/ApplicationSectionApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'

function InventoryComponent() {
  const [loading, setLoading] = useState(false)
  const [risk, setRisk] = useState([])
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

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = risk.slice(indexOfFirstItem, indexOfLastItem)

  const sortTable = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({key, direction})
  }

  const sortedItems = () => {
    if (sortConfig.key !== null) {
      return [...currentItems].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return currentItems
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

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
  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value)); 
    setCurrentPage(1); 
  };
  return (
    <div className='application-section mg-top-20 mg-btm-20'>
      <div className='header-filter mg-btm-20'>
        <form>
          <select className='form-select'>
            <option>Select filter</option>
          </select>
        </form>
      </div>
      <div className='actions'>
        {/* <div className="row">
          <div className="col-lg-6">
            <button className="btn btn-new btn-small float-left">
              Actions <i className="fa fa-chevron-down white" />
            </button>
            <div className="float-left mg-left-20">
              <span className="fs-12 gray mg-right-10 inline-block">
                Last Scanned:
              </span>{" "}
              <span>Feb 28, 2024 9:30 AM</span>
              <br />
              <span className="fs-12 gray mg-right-10 inline-block">
                Next Scanned:
              </span>{" "}
              <span>Feb 28, 2024 9:30 AM</span>
            </div>
          </div>
          <div className="col-lg-6 text-right">
            <span className="gray inline-block mg-righ-20">530 Items</span>
            <span className="inline-block mg-left-10">
              <select className="form-select form-select-sm">
                <option>50 Results</option>
              </select>
            </span>
            <span className="inline-block mg-left-10">
              <select className="form-select form-select-sm">
                <option>Columns</option>
              </select>
            </span>
            <span className="inline-block mg-left-10 link">
              Export <i className="fas fa-file-export link" />
            </span>
          </div>
        </div> */}
        <table className='table alert-table mg-top-20'>
          <thead>
            <tr>
              <th onClick={() => sortTable('applicationName')}>
                Name {sortConfig.key === 'applicationName' && renderSortIcon('applicationName')}
              </th>
              <th onClick={() => sortTable('applicationVendor')}>
                Vendor{' '}
                {sortConfig.key === 'applicationVendor' && renderSortIcon('applicationVendor')}
              </th>
              <th onClick={() => sortTable('applicationVersionsCount')}>
                Number of Versions{' '}
                {sortConfig.key === 'applicationVersionsCount' &&
                  renderSortIcon('applicationVersionsCount')}
              </th>
              <th onClick={() => sortTable('endpointsCount')}>
                Number of Endpoints{' '}
                {sortConfig.key === 'endpointsCount' && renderSortIcon('endpointsCount')}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {sortedItems() !== null ? (
              sortedItems().map((item, index) => (
                <tr key={index}>
                  <td>{item.applicationName}</td>
                  <td>{item.applicationVendor}</td>
                  <td>{item.applicationVersionsCount}</td>
                  <td>{item.endpointsCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='4'>No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
    </div>
  )
}

export default InventoryComponent
