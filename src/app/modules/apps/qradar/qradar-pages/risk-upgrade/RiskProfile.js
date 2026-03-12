import React, {useState, useRef, useEffect} from 'react'
import RiskDetailsModal from './RiskDetailsModal'
import {fetchRisks, fetchSyncRisksUrl} from '../../../../../api/BreachRiskApi'
import useFeatureActions from '../configuration/useFeatureActions'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Pagination from '../../../../../../utils/Pagination'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {truncateText} from '../../../../../../utils/TruncateText'
import {renderSortIcon, sortedItems} from '../../../../../../utils/Sorting'
import {notify, notifyFail} from '../components/notification/Notification'
import { UsersListLoading } from '../components/loading/UsersListLoading'

function RiskDetailsPage() {
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
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)
  const orgId = Number(sessionStorage.getItem('orgId'))

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
    const payload = {
      orgId: orgId,
      toolId: toolId,
    }
    try {
      setLoading(true)
      const response = await fetchRisks(payload)
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
          tools.filter((item) => item.finding.toLowerCase().includes(filterValue.toLowerCase())),
          sortConfig
        ).slice(currentPage * itemsPerPage, currentPage * itemsPerPage + itemsPerPage)
      : null

  const filteredList = filterValue
    ? sortedItems(
        tools.filter((item) => item.finding.toLowerCase().includes(filterValue.toLowerCase())),
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
    setSelectedRisk(risk)
    setShowModal(true)
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

      const response = await fetchSyncRisksUrl(payload)
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
            Risks({currentItems ? currentItems.length : 0} /{' '}
            {filteredList ? filteredList.length : 0})
          </span>
        </h3>

        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <div className='card-header bg-white d-flex justify-content-between align-items-center py-2 position-relative'>
              <div className='position-relative' ref={dropdownRef}>
                <button
                  className='btn btn-green btn-small px-4'
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  Manage risks {showDropdown ? '▲' : '▾'}
                </button>

                {showDropdown && (
                  <div
                    className='position-absolute end-0 mt-2 bg-white shadow rounded-3 py-2'
                    style={{width: '200px', zIndex: 1000}}
                  >
                    <div
                      className={`px-3 py-2 ${
                        selectedAction === 'remediate' ? 'bg-primary text-white' : ''
                      }`}
                      style={{cursor: 'pointer'}}
                      onClick={() => setSelectedAction('remediate')}
                    >
                      <div>
                        <strong>Request remediation</strong>
                      </div>
                      <div>Address risks</div>
                    </div>

                    <div
                      className={`px-3 py-2 ${
                        selectedAction === 'waive' ? 'bg-primary text-white' : ''
                      }`}
                      style={{cursor: 'pointer'}}
                      onClick={() => setSelectedAction('waive')}
                    >
                      <div>
                        <strong>Waive a risk</strong>
                      </div>
                      <div>Dismiss a risk</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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

          {/* RIGHT SIDE → Switches */}
          <div className='col-md-6 d-flex justify-content-end gap-4'>
            <div className='form-check form-switch'>
              <input className='form-check-input' type='checkbox' defaultChecked />
              <label className='form-check-label'>Show passed checks</label>
            </div>

            <div className='form-check form-switch'>
              <input className='form-check-input' type='checkbox' defaultChecked />
              <label className='form-check-label'>Show waived risks</label>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className='card-body no-pad'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th onClick={() => handleSort('severityName')}>
                Sev. {renderSortIcon(sortConfig, 'severityName')}
              </th>

              <th onClick={() => handleSort('finding')}>
                Finding / Risk {renderSortIcon(sortConfig, 'finding')}
              </th>

              <th onClick={() => handleSort('category')}>
                Category {renderSortIcon(sortConfig, 'category')}
              </th>

              <th onClick={() => handleSort('firstDetected')}>
                First detected {renderSortIcon(sortConfig, 'firstDetected')}
              </th>

              <th onClick={() => handleSort('hostnameCount')}>
                Assets affected {renderSortIcon(sortConfig, 'hostnameCount')}
              </th>

              <th>Status</th>
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
                  <div className='sev-icon'>{risk.severityName}</div>
                </td>

                <td>
                  <div title={risk.finding} className='fw-semibold'>
                    {truncateText(risk.finding, 40)}
                  </div>
                  <div title={risk.riskTitle} className='text-muted small'>
                    {truncateText(risk.riskTitle, 40)}
                  </div>
                </td>

                <td>
                  <span className='badge bg-light text-dark border px-3 py-2'>{risk.category}</span>
                </td>
                <td>{getCurrentTimeZone(risk.firstDetected)}</td>
                <td>{risk.hostnameCount}</td>

                <td className='text-end'>
                  <span className='arrow'>›</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= CHILD MODAL ================= */}
      <RiskDetailsModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        risk={selectedRisk}
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

export default RiskDetailsPage
