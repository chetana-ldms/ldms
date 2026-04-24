import React, {useState, useEffect} from 'react'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import Pagination from '../../../../../../utils/Pagination'

function MitreFramework() {
  const [mitreData, setMitreData] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedScenario, setSelectedScenario] = useState('ALL')
  const [activeTab, setActiveTab] = useState('scenarios') // New state for active tab
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    fetch('/ldms/media/reports/MitreFramework.json')
      .then((res) => res.json())
      .then((data) => {
        setMitreData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Fetch error:', err)
        setLoading(false)
      })
  }, [])

  const getFilteredSteps = () => {
    if (!mitreData?.scenarios) return []

    if (selectedScenario === 'ALL') {
      return mitreData.scenarios.flatMap((s) =>
        s.steps.map((step) => ({
          scenario: s.scenario,
          ...step,
        }))
      )
    }

    const scenario = mitreData.scenarios.find((s) => s.scenario === selectedScenario)

    return scenario
      ? scenario.steps.map((step) => ({
          scenario: scenario.scenario,
          ...step,
        }))
      : []
  }

  const providedTactics = [
    {
      tacticId: 'TA0001',
      name: 'Initial Access',
      description: 'Gaining entry into target environment',
    },
    {tacticId: 'TA0002', name: 'Execution', description: 'Running malicious code'},
    {tacticId: 'TA0003', name: 'Persistence', description: 'Maintaining access'},
    {tacticId: 'TA0004', name: 'Privilege Escalation', description: 'Gaining higher permissions'},
    {tacticId: 'TA0005', name: 'Defense Evasion', description: 'Avoiding detection'},
    {tacticId: 'TA0006', name: 'Credential Access', description: 'Stealing credentials'},
    {tacticId: 'TA0007', name: 'Discovery', description: 'Exploring environment'},
    {tacticId: 'TA0008', name: 'Lateral Movement', description: 'Moving across systems'},
    {tacticId: 'TA0009', name: 'Collection', description: 'Gathering data'},
    {tacticId: 'TA0010', name: 'Exfiltration', description: 'Stealing data'},
    {
      tacticId: 'TA0011',
      name: 'Command and Control',
      description: 'Communicating with attacker systems',
    },
    {tacticId: 'TA0040', name: 'Impact', description: 'Causing damage'},
  ]

  const providedTechniques = [
    {
      techniqueId: 'T1566',
      name: 'Phishing',
      tacticId: 'TA0001',
      description: 'Sending malicious emails',
    },
    {
      techniqueId: 'T1566.001',
      name: 'Spearphishing Attachment',
      tacticId: 'TA0001',
      description: 'Malicious attachments',
    },
    {
      techniqueId: 'T1566.002',
      name: 'Spearphishing Link',
      tacticId: 'TA0001',
      description: 'Malicious URLs',
    },
    {
      techniqueId: 'T1204',
      name: 'User Execution',
      tacticId: 'TA0002',
      description: 'User opens file/clicks link',
    },
    {
      techniqueId: 'T1059',
      name: 'Command and Scripting Interpreter',
      tacticId: 'TA0002',
      description: 'PowerShell, CMD execution',
    },
    {
      techniqueId: 'T1203',
      name: 'Exploitation for Client Execution',
      tacticId: 'TA0002',
      description: 'Exploiting application',
    },
    {
      techniqueId: 'T1105',
      name: 'Ingress Tool Transfer',
      tacticId: 'TA0011',
      description: 'Downloading payload',
    },
    {
      techniqueId: 'T1071',
      name: 'Application Layer Protocol',
      tacticId: 'TA0011',
      description: 'C2 communication over HTTP/DNS',
    },
    {
      techniqueId: 'T1027',
      name: 'Obfuscated Files or Information',
      tacticId: 'TA0005',
      description: 'Obfuscating malware',
    },
    {
      techniqueId: 'T1003',
      name: 'Credential Dumping',
      tacticId: 'TA0006',
      description: 'Dumping passwords',
    },
    {
      techniqueId: 'T1087',
      name: 'Account Discovery',
      tacticId: 'TA0007',
      description: 'Enumerating users',
    },
    {
      techniqueId: 'T1041',
      name: 'Exfiltration Over C2 Channel',
      tacticId: 'TA0010',
      description: 'Data exfiltration',
    },
    {
      techniqueId: 'T1486',
      name: 'Data Encrypted for Impact',
      tacticId: 'TA0040',
      description: 'Ransomware encryption',
    },
  ]

  const steps = getFilteredSteps()

  let currentDisplayItems = []

  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = steps.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected)
  }

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(0)
  }

  const handleTabChange = (tabName) => {
    setActiveTab(tabName)
    setCurrentPage(0) // Reset pagination when changing tabs
  }

  switch (activeTab) {
    case 'scenarios':
      currentDisplayItems = currentItems
      break
    case 'tactic':
      currentDisplayItems = providedTactics.slice(indexOfFirstItem, indexOfLastItem)
      break
    case 'technique':
      currentDisplayItems = providedTechniques.slice(indexOfFirstItem, indexOfLastItem)
      break
  }

  const handleDownloadReport = (reportType) => {
    let reportPath = ''
    let fileName = ''

    if (reportType === 'tactic') {
      reportPath = '/ldms/media/reports/Tactic_Report.pdf'
      fileName = 'Mitre_Tactic_Report.pdf'
    } else if (reportType === 'technique') {
      reportPath = '/ldms/media/reports/Technique_Report.pdf'
      fileName = 'Mitre_Technique_Report.pdf'
    }

    const link = document.createElement('a')
    link.href = reportPath
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className='card pad-10 config'>
      <div className='card-header no-pad'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>MITRE Framework</span>
        </h3>
        <div className='w-40 p-0'>
          <ul className='nav nav-tabs pb-0' style={{textDecoration: 'none'}}>
            <li className='nav-item'>
              <a
                className={`nav-link ${activeTab === 'scenarios' ? 'active' : ''}`}
                onClick={() => handleTabChange('scenarios')}
                style={{textDecoration: 'none'}}
              >
                Scenarios
              </a>
            </li>
            <li className='nav-item'>
              <a
                className={`nav-link ${activeTab === 'tactic' ? 'active' : ''}`}
                onClick={() => handleTabChange('tactic')}
                style={{textDecoration: 'none'}}
              >
                Tactic
              </a>
            </li>
            <li className='nav-item'>
              <a
                className={`nav-link ${activeTab === 'technique' ? 'active' : ''}`}
                onClick={() => handleTabChange('technique')}
                style={{textDecoration: 'none'}}
              >
                Technique
              </a>
            </li>
          </ul>
        </div>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-3'>
            <button
              className='btn btn-secondary btn-small'
              onClick={() => handleDownloadReport('tactic')}
            >
              Tactic Report <i className='fas fa-download ms-2'></i>
            </button>
            <button
              className='btn btn-secondary btn-small'
              onClick={() => handleDownloadReport('technique')}
            >
              Technique Report <i className='fas fa-download ms-2'></i>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'scenarios' && (
        <div className='row mb-5 mt-2'>
          <div className='col-lg-12 header-filter d-flex align-items-center gap-3'>
            <label className='form-label fw-normal fc-gray fs-14 lh-40 mb-0'>Scenario:</label>
            <div className='w-250px'>
              <select
                className='form-select form-select-solid bg-blue-light'
                value={selectedScenario}
                onChange={(e) => {
                  setSelectedScenario(e.target.value)
                  setCurrentPage(0)
                }}
              >
                <option value='ALL'>All Scenarios</option>
                {mitreData?.scenarios?.map((s, i) => (
                  <option key={i} value={s.scenario}>
                    {s.scenario}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className='card-body no-pad'>
        {/* Table Content */}
        <div className='table-responsive'>
          {/* 📊 Table */}
          {activeTab === 'scenarios' && (
            <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
              <thead>
                <tr className='fw-bold text-muted bg-blue'>
                  <th>Scenario</th>
                  <th>Sequence</th>
                  <th>Tactic</th>
                  <th>Technique</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan='4'>
                      <UsersListLoading />
                    </td>
                  </tr>
                ) : currentDisplayItems.length > 0 ? (
                  currentDisplayItems.map((item, index) => (
                    <tr key={index} className='fs-12 table-row'>
                      <td>{item.scenario}</td>
                      <td>{item.sequence}</td>
                      <td>{item.tactic}</td>
                      <td>
                        {item.technique_id} - {item.technique}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='4' className='text-center'>
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'tactic' && (
            <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
              <thead>
                <tr className='fw-bold text-muted bg-blue'>
                  <th>Tactic ID</th>
                  <th>Tactic Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan='3'>
                      <UsersListLoading />
                    </td>
                  </tr>
                ) : currentDisplayItems.length > 0 ? (
                  currentDisplayItems.map((item, index) => (
                    <tr key={index} className='fs-12 table-row'>
                      <td>{item.tacticId}</td>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='1' className='text-center'>
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'technique' && (
            <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
              <thead>
                <tr className='fw-bold text-muted bg-blue'>
                  <th>Technique ID</th>
                  <th>Technique Name</th>
                  <th>Tactic ID</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan='4'>
                      <UsersListLoading />
                    </td>
                  </tr>
                ) : currentDisplayItems.length > 0 ? (
                  currentDisplayItems.map((item, index) => (
                    <tr key={index} className='fs-12 table-row'>
                      <td>{item.techniqueId}</td>
                      <td>{item.name}</td>
                      <td>{item.tacticId}</td>
                      <td>{item.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='2' className='text-center'>
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* 🔢 Pagination */}
        {!loading && currentDisplayItems.length > 0 && (
          <Pagination
            pageCount={Math.ceil(
              (activeTab === 'scenarios'
                ? steps.length
                : activeTab === 'tactic'
                ? providedTactics.length
                : providedTechniques.length) / itemsPerPage
            )}
            handlePageClick={handlePageClick}
            itemsPerPage={itemsPerPage}
            handlePageSelect={handlePageSelect}
            forcePage={currentPage}
          />
        )}
      </div>
    </div>
  )
}

export default MitreFramework
