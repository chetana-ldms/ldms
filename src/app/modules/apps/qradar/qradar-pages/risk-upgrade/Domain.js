import React, {useState, useRef, useEffect} from 'react'
import RiskDetailsModal from './RiskDetailsModal'
import {fetchDomainsUrl, fetchRisks, fetchSyncDomainsUrl, fetchSyncRisksUrl} from '../../../../../api/BreachRiskApi'
import useFeatureActions from '../configuration/useFeatureActions'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Pagination from '../../../../../../utils/Pagination'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {truncateText} from '../../../../../../utils/TruncateText'
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
  const reload = async () => {
    try {
      setLoading(true)
      const response = await fetchDomainsUrl()
      setTools(response?.data || [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [itemsPerPage])
  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems =
    tools !== null
      ? sortedItems(
          tools.filter((item) => item.hostname.toLowerCase().includes(filterValue.toLowerCase())),
          sortConfig
        ).slice(currentPage * itemsPerPage, currentPage * itemsPerPage + itemsPerPage)
      : null

  const filteredList = filterValue
    ? sortedItems(
        tools.filter((item) => item.hostname.toLowerCase().includes(filterValue.toLowerCase())),
        sortConfig
      )
    : sortedItems(tools || [], sortConfig)

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

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }
    const handleRowClick = (risk) => {
    setSelectedHost(risk.hostname)
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

  return (
    <div className='card pad-10 config'>
      <ToastContainer />
      <div className='card-header no-pad'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>
            Domains({currentItems ? currentItems.length : 0} /{' '}
            {filteredList ? filteredList.length : 0})
          </span>
        </h3>
      </div>

      {/* ================= FILTERS ================= */}
      <div className='m-4'>
        <div className='row align-items-center'>
          {/* LEFT SIDE → Search + Sync */}
          <div className='col-md-6'>
            <div className='d-flex align-items-center gap-3'>
              <input
                type='text'
                placeholder='Search...'
                className='form-control'
                value={filterValue}
                onChange={handleFilterChange}
              />

              {/* 🔄 SYNC BUTTON */}
              <button className='btn btn-primary btn-small' onClick={handleSync} disabled={loading}>
                {loading ? 'Syncing...' : 'Sync'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className='card-body no-pad'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th onClick={() => handleSort('hostname')}>
                Hostname {renderSortIcon(sortConfig, 'hostname')}
              </th>

              <th onClick={() => handleSort('automatedScore')}>
                Score {renderSortIcon(sortConfig, 'automatedScore')}
              </th>

              <th onClick={() => handleSort('scannedDate')}>
                Scanned on {renderSortIcon(sortConfig, 'scannedDate')}
              </th>

              <th onClick={() => handleSort('Portfolio')}>
                Portfolio {renderSortIcon(sortConfig, 'Portfolio')}
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && <UsersListLoading />}
            {currentItems?.map((risk) => (
              <tr
                key={risk.id}
                className='fs-12 table-row'
                style={{cursor: 'pointer'}}
                onClick={() => handleRowClick(risk)}
              >
                <td>
                  <div className='sev-icon'>{risk.hostname}</div>
                </td>

                <td>
                  <div className='fw-semibold'>{risk?.automatedScore}</div>
                </td>
                <td>{getCurrentTimeZone(risk.scannedDate)}</td>
                <td>{risk.Portfolio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= CHILD MODAL ================= */}
      <HostRiskModal
        show={showHostModal}
        handleClose={() => setShowHostModal(false)}
        host={selectedHost}
      />
      {tools && (
        <Pagination
          pageCount={Math.ceil(filteredList.length / itemsPerPage)}
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
