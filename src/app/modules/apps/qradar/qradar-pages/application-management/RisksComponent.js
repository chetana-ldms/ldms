import React, {useState, useEffect} from 'react'
import {fetchApplicationsAndRisksUrl} from '../../../../../api/ApplicationSectionApi'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import CanvasJSReact from '../reports/assets/canvasjs.react'
import {Link} from 'react-router-dom'

function RisksComponent() {
  const [loading, setLoading] = useState(false)
  const [risk, setRisk] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [sortConfig, setSortConfig] = useState({key: null, direction: 'ascending'})

  const orgId = Number(sessionStorage.getItem('orgId'))
  const CanvasJS = CanvasJSReact.CanvasJS
  const CanvasJSChart = CanvasJSReact.CanvasJSChart

  const severities = {
    animationEnabled: true,
    subtitles: [
      {
        verticalAlign: 'center',
        fontSize: 24,
        dockInsidePlotArea: true,
      },
    ],
    height: 150,
    data: [
      {
        type: 'doughnut',
        showInLegend: true,
        indexLabel: '{name}: {y}',
        yValueFormatString: "#,###'%'",
        dataPoints: [{name: 'Medium', y: 100}],
      },
    ],
  }
  CanvasJS.addColorSet('colorShades', ['#f0e68c', '#ffb700', '#008080'])

  const options = {
    animationEnabled: true,
    axisX: {
      valueFormatString: 'HH',
      title: '',
    },
    axisY: {
      title: '',
      prefix: '',
      scaleBreaks: {
        customBreaks: [
          {
            spacing: '10',
          },
        ],
      },
    },
    height: 140,
    borderColor: '#ccc',
    data: [
      {
        type: 'column',
        dataPoints: [
          {label: 'Adobe Acrobat', y: 10},
          {label: 'MySQL Server', y: 15},
          {label: 'Splunk', y: 25},
        ],
      },
    ],
  }

  const fetchData = async () => {
    const data = {
      orgID: orgId,
    }
    try {
      setLoading(true)
      const response = await fetchApplicationsAndRisksUrl(data)
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
        {/* <div className="row">
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h4 className="uppercase normal">severities</h4>
                <CanvasJSChart style={{ height: "150px" }} options={severities} />
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h4 className="uppercase normal">exploitation</h4>
                <div className="mg-top-30 text-center">
                  <i className="fa fa-info-circle green fs-30 mg-btm-10" />
                  <br />
                  <p className="fs-15 gray">No notifications found</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h4 className="uppercase normal">most impactful applications</h4>
                <CanvasJSChart options={options} style="height:140px" />
              </div>
            </div>
          </div>
        </div> */}
      </div>
      <table className='table alert-table scroll-x'>
        <thead>
          <tr className='fw-bold text-muted bg-blue'>
            <th className='fs-12' onClick={() => sortTable('name')}>
              Application Name {renderSortIcon('name')}
            </th>
            <th className='fs-12' onClick={() => sortTable('applicationType')}>
              Type {renderSortIcon('applicationType')}
            </th>
            <th className='fs-12' onClick={() => sortTable('versionCount')}>
              Versions {renderSortIcon('versionCount')}
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
            <th className='fs-12' onClick={() => sortTable('label')}>
              Most common Status {renderSortIcon('label')}
            </th>
            <th className='fs-12' onClick={() => sortTable('remediationLevel')}>
              Remediation Level {renderSortIcon('remediationLevel')}
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
          </tr>
        </thead>
        <tbody>
          {loading && <UsersListLoading />}
          {sortedItems() !== null ? (
            sortedItems().map((item, index) => (
              <tr key={index} className='table-row'>
                <td>
                  <Link
                    to={`/qradar/application/update/${encodeURIComponent(
                      item.name
                    )}/${encodeURIComponent(item.vendor)}`}
                  >
                    {item.name}
                  </Link>
                </td>
                <td>{item.applicationType}</td>
                <td>{item.versionCount}</td>
                <td>{item.vendor}</td>
                <td>{item.highestSeverity}</td>
                <td>{item.highestNvdBaseScore ?? 0}</td>
                <td>
                  {
                    item.statuses.find(
                      (status) =>
                        status.count === Math.max(...item.statuses.map((status) => status.count))
                    ).label
                  }
                </td>
                <td>{item.remediationLevel ?? 0}</td>
                <td>{item.cveCount}</td>
                <td>{item.endpointCount}</td>
                <td>{getCurrentTimeZone(item.detectionDate)}</td>
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
        </nav>
      )}
    </div>
  )
}

export default RisksComponent
