import React, {useState, useRef, useEffect} from 'react'
import RiskDetailsModal from './RiskDetailsModal'
import {
  fetchDomainsUrl,
  fetchIpsUrl,
  fetchRisks,
  fetchSyncDomainsUrl,
  fetchSyncIpsUrl,
  fetchSyncRisksUrl,
} from '../../../../../api/BreachRiskApi'
import useFeatureActions from '../configuration/useFeatureActions'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Pagination from '../../../../../../utils/Pagination'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {renderSortIcon, sortedItems} from '../../../../../../utils/Sorting'
import {notify, notifyFail} from '../components/notification/Notification'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import HostRiskModal from './HostRiskModal'
import {truncateText} from '../../../../../../utils/TruncateText'
import IpDetailsModal from './IpDetailsModal'

function IpAddress() {
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
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState(null)
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
      const response = await fetchIpsUrl()
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

  /* ================= UNIQUE SOURCES FOR DROPDOWN ================= */
  const uniqueSources = [...new Set(tools?.flatMap((item) => item.sources || []))]

  /* ================= FILTER + SORT + PAGINATION ================= */
  const filteredAndSorted = sortedItems(
    tools.filter((item) => {
      const matchesSearch = item.assetName?.toLowerCase().includes(filterValue.toLowerCase())

      const matchesSource = statusFilter === '' || item.sources?.includes(statusFilter)

      return matchesSearch && matchesSource
    }),
    sortConfig
  )

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
    const source = risk.sources?.[0]

    if (source === 'DNS' || source === 'Custom Range') {
      setSelectedRisk(risk)
      setShowModal(true)
    } else {
      setShowModal(false)
    }
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

      const response = await fetchSyncIpsUrl(payload)
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
          <div className='d-flex align-items-center gap-3'>
            <span className='card-label fw-bold fs-3 mb-1'>
              IP Address ({currentItems.length} / {filteredAndSorted.length})
            </span>

            {/* ===== DROPDOWN FROM SOURCES ===== */}
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
              <option value=''>All Sources</option>
              {uniqueSources.map((source, index) => (
                <option key={index} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
        </h3>
      </div>

      {/* ================= FILTER + SYNC ================= */}
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

      {/* ================= TABLE ================= */}
      <div className='card-body no-pad'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th onClick={() => handleSort('sources')}>
                Sources {renderSortIcon(sortConfig, 'sources')}
              </th>
              <th onClick={() => handleSort('assetName')}>
                IP Address {renderSortIcon(sortConfig, 'assetName')}
              </th>
              <th onClick={() => handleSort('owner')}>
                Owner {renderSortIcon(sortConfig, 'owner')}
              </th>
              <th onClick={() => handleSort('asName')}>
                Autonomous System {renderSortIcon(sortConfig, 'asName')}
              </th>
              <th onClick={() => handleSort('country')}>
                Registrant Country {renderSortIcon(sortConfig, 'country')}
              </th>
              <th onClick={() => handleSort('automatedScore')}>
                Score {renderSortIcon(sortConfig, 'automatedScore')}
              </th>
              <th style={{width: '200px'}} onClick={() => handleSort('services')}>
                Services {renderSortIcon(sortConfig, 'services')}
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
                  <div className='sev-icon'>{risk.sources?.join(', ')}</div>
                </td>
                <td>
                  <div className='fw-semibold'>{risk?.assetName}</div>
                </td>
                <td>
                  <div title={risk.owner} className='fw-semibold'>
                    {truncateText(risk?.owner, 20)}
                  </div>
                </td>
                <td>
                  <div className='fw-semibold'>{risk?.asName}</div>
                  <div className='fw-semibold'>{risk?.asn ? `AS ${risk.asn}` : '-'}</div>
                </td>
                <td>
                  <div className='fw-semibold'>{risk?.country}</div>
                </td>
                <td>
                  <div className='fw-semibold'>{risk?.automatedScore || '-'}</div>
                </td>
                <td>{risk.services?.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <IpDetailsModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        risk={selectedRisk}
      />

      {tools && (
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

export default IpAddress
