import React, {useState, useEffect} from 'react'
import useFeatureActions from '../configuration/useFeatureActions'
import {ToastContainer} from 'react-toastify'
import Pagination from '../../../../../../utils/Pagination'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {renderSortIcon, sortedItems} from '../../../../../../utils/Sorting'
import VulnerabilitiesDetailsModal from './VulnerabilitiesDetailsModal'

function Vulnerabilities() {
  const [tools, setTools] = useState([])
  const [filterValue, setFilterValue] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activePage, setActivePage] = useState(0)
  const [loading, setLoading] = useState(false)

  const [expandedRow, setExpandedRow] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState(null)

  const orgId = Number(sessionStorage.getItem('orgId'))
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))
  const toolId = Number(sessionStorage.getItem('toolID'))

  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: 'ascending',
  })

  // ================= LOAD DATA =================
  const reload = async () => {
    try {
      setLoading(true)
      const res = await fetch('/ldms/media/breach-risks/Vulnerabilities.json')
      const data = await res.json()
      setTools(data?.data || [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  // ================= FILTER =================
  const filteredData = filterValue
    ? tools.filter((item) =>
        item?.cve?.id?.toLowerCase().includes(filterValue.toLowerCase())
      )
    : tools

  // ================= SORT =================
  const sortedData = sortedItems(filteredData || [], sortConfig)

  // ================= PAGINATION =================
  const currentItems = sortedData.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  )

  // 🔥 Reset page when filtering
  useEffect(() => {
    setCurrentPage(0)
    setActivePage(0)
  }, [filterValue])

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(0)
    setActivePage(0)
    setExpandedRow(null)
  }

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected)
    setActivePage(selected.selected)
    setExpandedRow(null)
  }

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
    setCurrentPage(0)
    setActivePage(0)
    setExpandedRow(null)
  }

  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({key, direction})
  }

  // ================= IGNORE =================
  const handleIgnore = (item, e) => {
    e.stopPropagation()
    console.log('Ignored:', item?.cve?.id)
    setExpandedRow(null)
  }

  const getFormattedDate = (date) => {
    return getCurrentTimeZone(date)
  }

  const today = new Date()
  const dayBeforeYesterday = new Date()
  dayBeforeYesterday.setDate(today.getDate() - 2)

  return (
    <div className='card pad-10 config'>
      <ToastContainer />

      <div className='card-header no-pad'>
        <h3 className='card-title fw-bold fs-3'>
          Vulnerabilities ({currentItems.length} / {sortedData.length})
        </h3>
      </div>

      {/* SEARCH */}
      <div className='m-4'>
        <input
          type='text'
          placeholder='Search CVE...'
          className='form-control'
          value={filterValue}
          onChange={handleFilterChange}
        />
      </div>

      <div className='card-body no-pad'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th onClick={() => handleSort('severity')} style={{cursor: 'pointer'}}>
                CVSS {renderSortIcon(sortConfig, 'severity')}
              </th>
              <th>EPSS</th>
              <th>CVE ID</th>
              <th>Verified</th>
              <th>Software</th>
              <th>First Detected</th>
              <th>Domains & IPs</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((item, index) => {
              const severity = item?.cve?.severity || 0
              const epssPercent = ((item?.cve?.epss || 0) * 100).toFixed(1)
              const rowKey = item?.cve?.id
              const uniqueKey = `${rowKey}-${index}` // ✅ FIXED KEY
              const isExpanded = expandedRow === uniqueKey

              const getSeverityClass = () => {
                if (severity >= 9) return 'bg-danger text-white'
                if (severity >= 7) return 'bg-warning text-dark'
                if (severity >= 4) return 'bg-secondary text-white'
                return 'bg-success text-white'
              }

              return (
                <React.Fragment key={uniqueKey}>
                  <tr
                    style={{cursor: 'pointer'}}
                    onClick={() =>
                      setExpandedRow(isExpanded ? null : uniqueKey)
                    }
                  >
                    <td>
                      <span className={`badge ${getSeverityClass()} px-3 py-2`}>
                        {severity}
                      </span>
                    </td>

                    <td>{epssPercent}%</td>

                    <td className='fw-semibold'>{rowKey}</td>

                    <td>
                      <span
                        className={`badge ${
                          item?.verified ? 'bg-success' : 'bg-warning text-dark'
                        }`}
                      >
                        {item?.verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>

                    <td>
                      {item?.cpeDetails?.map((cpe, i) => (
                        <span key={i} className='badge bg-light text-dark border me-1'>
                          {cpe.product}
                        </span>
                      ))}
                    </td>

                    <td>{getFormattedDate(dayBeforeYesterday)}</td>

                    <td>
                      <div>{item?.hostname || '-'}</div>
                      <small className='text-muted'>
                        {item?.ipAddresses?.join(', ')}
                      </small>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr>
                      <td colSpan='7' className='bg-light p-4'>
                        <div className='row'>
                          <div className='col-md-8'>
                            <h6>Description</h6>
                            <p>{item?.cve?.description}</p>

                            <p>
                              <strong>Severity Level:</strong> {item?.severityLevel}
                            </p>

                            <p>
                              <strong>Breach Probability:</strong> {item?.breachProbability}
                            </p>
                          </div>

                          <div className='col-md-4 text-end'>
                            <button
                              className='btn btn-primary btn-sm me-2'
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedRisk(item)
                                setShowModal(true)
                              }}
                            >
                              Learn More
                            </button>

                            {featureActions?.canDelete && (
                              <button
                                className='btn btn-outline-danger btn-sm'
                                onClick={(e) => handleIgnore(item, e)}
                              >
                                Ignore
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <VulnerabilitiesDetailsModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        vulnerability={selectedRisk}
      />

      {/* PAGINATION */}
      <Pagination
        pageCount={Math.ceil(sortedData.length / itemsPerPage)}
        handlePageClick={handlePageClick}
        itemsPerPage={itemsPerPage}
        handlePageSelect={handlePageSelect}
        forcePage={activePage}
      />
    </div>
  )
}

export default Vulnerabilities