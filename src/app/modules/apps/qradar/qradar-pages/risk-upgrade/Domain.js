import React, {useState, useRef, useEffect, useMemo} from 'react'
import RiskDetailsModal from './RiskDetailsModal'
import {fetchDomainsUrl, fetchSyncDomainsUrl} from '../../../../../api/BreachRiskApi'
import useFeatureActions from '../configuration/useFeatureActions'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Pagination from '../../../../../../utils/Pagination'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {renderSortIcon, sortedItems} from '../../../../../../utils/Sorting'
import {notify, notifyFail} from '../components/notification/Notification'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import HostRiskModal from './HostRiskModal'

function Domain() {
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null)
  const dropdownRef = useRef(null)
  const [tools, setTools] = useState([])
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: 'ascending',
  })
  const [filterValue, setFilterValue] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activePage, setActivePage] = useState(0)
  const [loading, setLoading] = useState(false)

  const [statusFilter, setStatusFilter] = useState('active') // ✅ default active

  const orgId = Number(sessionStorage.getItem('orgId'))
  const [showHostModal, setShowHostModal] = useState(false)
  const [selectedHost, setSelectedHost] = useState(null)
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))
  const toolId = Number(sessionStorage.getItem('toolID'))

  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // const reload = async () => {
  //   try {
  //     setLoading(true)

  //     const orgid = sessionStorage.getItem('orgId')
  //     const toolid = sessionStorage.getItem('toolID')

  //     const response = await fetchDomainsUrl(orgid, toolid)

  //     setTools(response?.data || [])
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // useEffect(() => {
  //   reload()
  // }, [itemsPerPage])

   const reload = async () => {
    try {
      setLoading(true)
      const res = await fetch('/ldms/media/breach-risks/Domains.json')
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
  }, [itemsPerPage])

  // ================= FILTER + SORT =================
  const filteredAndSorted = useMemo(() => {
    let data = [...tools]

    // Priority sort
    data.sort((a, b) => {
      if (a.primaryAsset === 1 && b.primaryAsset !== 1) return -1
      if (a.primaryAsset !== 1 && b.primaryAsset === 1) return 1
      return 0
    })

    // ✅ Status filter using active field
    data = data.filter((item) => {
      if (statusFilter === 'all') return true
      if (statusFilter === 'active') return item.active === 1
      if (statusFilter === 'inactive') return item.active === 0
      return true
    })

    // Search filter
    data = data.filter((item) => item.assetName?.toLowerCase().includes(filterValue.toLowerCase()))

    // Sorting
    return sortedItems(data, sortConfig)
  }, [tools, statusFilter, filterValue, sortConfig])

  const currentItems = filteredAndSorted.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  )

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(0)
    setActivePage(0)
  }

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected)
    setActivePage(selected.selected)
  }

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
    setCurrentPage(0)
    setActivePage(0)
  }

  const handleRowClick = (risk) => {
    setSelectedHost(risk.assetName)
    setShowHostModal(true)
  }

  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({key, direction})
  }

  const handleSync = async () => {
    try {
      setLoading(true)

      const payload = {
        orgId,
        toolId,
      }

      const response = await fetchSyncDomainsUrl(payload)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        await reload()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  const getFormattedDate = (date) => {
  return getCurrentTimeZone(date) // reuse your existing formatter
}

const today = new Date()

const yesterday = new Date()
yesterday.setDate(today.getDate() - 1)

const dayBeforeYesterday = new Date()
dayBeforeYesterday.setDate(today.getDate() - 2)

  return (
    <div className='card pad-10 config'>
      <ToastContainer />

      <div className='card-header no-pad'>
        <h3 className='card-title align-items-start flex-column'>
          <div className='d-flex align-items-center gap-3'>
            <span className='card-label fw-bold fs-3 mb-1'>
              Domains ({currentItems.length} / {filteredAndSorted.length})
            </span>

            {/* ✅ Dropdown */}
            <select
              className='form-select w-auto'
              style={{padding: '4px 36px 4px 10px'}}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(0)
                setActivePage(0)
              }}
            >
              <option value='all'>All</option>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>
          </div>
        </h3>
      </div>

      {/* FILTER */}
      <div className='m-4'>
        <div className='row align-items-center'>
          <div className='col-md-6'>
            <div className='d-flex align-items-center gap-3'>
              <input
                type='text'
                placeholder='Search...'
                className='form-control'
                value={filterValue}
                onChange={handleFilterChange}
              />

              <button className='btn btn-primary btn-small' onClick={handleSync} disabled={loading}>
                {loading ? 'Syncing...' : 'Sync'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className='card-body no-pad'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th onClick={() => handleSort('assetName')}>
                Domain {renderSortIcon(sortConfig, 'assetName')}
              </th>

              <th onClick={() => handleSort('automatedScore')}>
                Score {renderSortIcon(sortConfig, 'automatedScore')}
              </th>

              <th onClick={() => handleSort('scannedDate')}>
                Scanned on {renderSortIcon(sortConfig, 'scannedDate')}
              </th>

              <th onClick={() => handleSort('primaryAsset')}>
                Primary Asset {renderSortIcon(sortConfig, 'primaryAsset')}
              </th>

              <th onClick={() => handleSort('Portfolio')}>
                Portfolio {renderSortIcon(sortConfig, 'Portfolio')}
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && <UsersListLoading />}

            {!loading && currentItems.length === 0 && (
              <tr>
                <td colSpan='5' className='text-center'>
                  No data found
                </td>
              </tr>
            )}

            {currentItems?.map((risk) => (
              <tr
                key={risk.id}
                className='fs-12 table-row'
                style={{cursor: 'pointer'}}
                onClick={() => handleRowClick(risk)}
              >
                <td>
                  <div className='sev-icon'>{risk.assetName}</div>
                </td>

                <td>
                  <div className='fw-semibold'>{risk?.automatedScore}</div>
                </td>

                <td>{getFormattedDate(dayBeforeYesterday)}</td>
                <td>{risk.primaryAsset ? 'Yes' : 'No'}</td>
                <td>{risk.Portfolio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <HostRiskModal
        show={showHostModal}
        handleClose={() => setShowHostModal(false)}
        host={selectedHost}
      />

      {/* PAGINATION */}
      {filteredAndSorted && (
        <Pagination
          pageCount={Math.ceil(filteredAndSorted.length / itemsPerPage)}
          handlePageClick={handlePageClick}
          itemsPerPage={itemsPerPage}
          handlePageSelect={handlePageSelect}
          forcePage={activePage}
        />
      )}
    </div>
  )
}

export default Domain
