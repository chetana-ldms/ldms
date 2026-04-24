import React, {useState, useEffect, useRef} from 'react'
import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {fetchMasterData} from '../../../../../api/Api'
import {fetchUsers} from '../../../../../api/AlertsApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {
  fetchAlertsByAlertIds,
  fetchGetIncidentHistory,
  fetchIncidentDetails,
  fetchIncidents,
  fetchUpdateIncident,
} from '../../../../../api/IncidentsApi'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {useErrorBoundary} from 'react-error-boundary'

const IncidentDetails = ({selectedAlert, onRefreshIncidents}) => {
  console.log('selectedAlert', selectedAlert)
  const [timelineData, setTimelineData] = useState([])
  const [selectedMitreStepId, setSelectedMitreStepId] = useState(null)

  const phishingAttackChain = [
    {
      alert_id: 'ALT-1001',
      name: 'Email Delivered',
      technique_id: 'T1566',
      completed: true,
      description: 'Malicious email with attachment delivered to user',
      tactic: 'Initial Access',
      technique_name: 'Spearphishing Attachment',
      entities: {user: 'john.doe@connecthomes.com'},
    },
    {
      alert_id: 'ALT-1002',
      name: 'User Clicked / Attachment Opened',
      technique_id: 'T1204',
      completed: true,
      description: 'User opened suspicious email attachment',
      tactic: 'Execution',
      technique_name: 'User Execution',
      entities: {user: 'john.doe@connecthomes.com', device: 'DESKTOP-001'},
    },
    {
      alert_id: 'ALT-1003',
      name: 'Script Executed',
      technique_id: 'T1059',
      completed: true,
      description: 'Script execution detected from document',
      tactic: 'Execution',
      technique_name: 'Command and Scripting Interpreter',
      entities: {device: 'DESKTOP-001'},
    },
    {
      alert_id: 'ALT-1004',
      name: 'Payload Downloaded',
      technique_id: 'T1105',
      completed: true,
      description: 'Suspicious outbound connection for payload download',
      tactic: 'Command and Control',
      technique_name: 'Ingress Tool Transfer',
      entities: {device: 'DESKTOP-001'},
    },
    {
      alert_id: null,
      name: 'C2 Communication',
      technique_id: 'T1071',
      completed: false,
      description: 'Potential command and control communication channel',
      tactic: 'Command and Control',
      technique_name: 'Application Layer Protocol',
      entities: {},
    },
  ]

  const [currentDateTime, setCurrentDateTime] = useState('')

  useEffect(() => {
    const now = new Date()

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    let hours = now.getHours()
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12 // convert 0 to 12 for 12 AM

    const formatted = `${year}-${month}-${day} ${String(hours).padStart(
      2,
      '0'
    )}:${minutes}:${seconds} ${ampm}`
    setCurrentDateTime(formatted)
  }, [selectedAlert?.name])

  useEffect(() => {
    if (!selectedAlert?.name) return

    fetch('/ldms/media/reports/LDC_Timeline_All_Scenarios.json')
      .then((res) => res.json())
      .then((data) => {
        const timeline = data[selectedAlert.name]
        if (timeline) {
          setTimelineData(timeline)
        } else {
          setTimelineData([])
          console.warn(`No timeline found for alert: ${selectedAlert.name}`)
        }
      })
      .catch((err) => console.error('Failed to load timeline:', err))
  }, [selectedAlert?.name])

  const getReportLink = (name) => {
    switch (name) {
      case 'Memory spike detected':
        return '/ldms/media/reports/Memory_Spike_Incident_Report.pdf'
      case 'Network outage detected':
        return '/ldms/media/reports/Network_Outage_Incident_Report.pdf'
      case 'Disk failure event detected':
        return '/ldms/media/reports/Disk_Failure_Incident_Report.pdf'
      case 'Failed Login Alert':
        return '/ldms/media/reports/failed_login_report.pdf'
      case 'Phishing Email Detected':
        return '/ldms/media/reports/Phishing_Incident_Report.pdf'
      default:
        return null
    }
  }

  const reportLink = getReportLink(selectedAlert?.name)

  return (
    <div className='col-md-4 border-1 border-gray-600'>
      <div className='card' style={{height: '738px'}}>
        <div className='d-flex justify-content-between align-items-center bg-heading bd-highlight mb-3 px-3'>
          {/* Left side: Title */}
          <h6 className='card-title mb-0 p-3'>
            <span className='card-label white fw-bold fs-3'>Incidents Details</span>
          </h6>
          {reportLink && (
            <div className='badge text-black fw-normal'>
              <a
                href={reportLink}
                target='_blank'
                rel='noopener noreferrer'
                className='btn btn-link p-0'
                title='Download Report'
              >
                <i className='fas fa-download white'></i>
              </a>
            </div>
          )}
        </div>

        <div className='container-fluid px-0 incident-tabs'>
          <div className='p-2 bd-highlight'>
            <ul className='nav nav-line-tabs mb-5 fs-8' role='tablist'>
              <li className='nav-item' role='presentation'>
                <a
                  className='nav-link active'
                  data-bs-toggle='tab'
                  href='#kt_tab_pane_1'
                  aria-selected='true'
                  role='tab'
                >
                  General
                </a>
              </li>
              <li className='nav-item' role='presentation'>
                <a
                  className='nav-link'
                  data-bs-toggle='tab'
                  href='#kt_tab_pane_2'
                  aria-selected='false'
                  role='tab'
                  tabindex='-1'
                >
                  Alerts
                </a>
              </li>
              <li className='nav-item' role='presentation'>
                <a
                  className='nav-link'
                  data-bs-toggle='tab'
                  href='#kt_tab_pane_3'
                  aria-selected='false'
                  role='tab'
                  tabindex='-1'
                >
                  Playbooks
                </a>
              </li>
              <li className='nav-item' role='presentation'>
                <a
                  className='nav-link'
                  data-bs-toggle='tab'
                  href='#kt_tab_pane_4'
                  aria-selected='false'
                  role='tab'
                  tabindex='-1'
                >
                  MITRE Mapping
                </a>
              </li>
              <li className='nav-item' role='presentation'>
                <a
                  className='nav-link'
                  data-bs-toggle='tab'
                  href='#kt_tab_pane_5'
                  aria-selected='false'
                  role='tab'
                  tabindex='-1'
                >
                  Timeline
                </a>
              </li>
            </ul>
            <div className='tab-content' id='myTabContent'>
              <div
                className='tab-pane fade me-n5 pe-5 h-500px active show'
                id='kt_tab_pane_1'
                role='tabpanel'
              >
                <div className='row bd-highlight mb-3'>
                  <div className='col-md-3 bd-highlight mt-2'>Status</div>
                  <div className='col-md-9 bd-highlight'>
                    <div className='w-120px'>
                      <select
                        name='status'
                        data-control='select2'
                        data-hide-search='true'
                        className='form-select form-control form-select-white form-select-sm fw-bold'
                      >
                        <option value='1'>New</option>
                        <option value='1'>Open</option>
                        <option value='1'>Pending</option>
                        <option value='1'>Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className='row bd-highlight mb-3'>
                  <div className='col-md-3 bd-highlight mt-2'>Priority</div>
                  <div className='col-md-9 bd-highlight'>
                    <div className='w-120px'>
                      <select
                        name='status'
                        data-control='select2'
                        data-hide-search='true'
                        className='form-select form-control form-select-white form-select-sm fw-bold text-danger'
                      >
                        <option value='1' className='text-danger'>
                          High
                        </option>
                        <option value='1' className='text-warning'>
                          Medium
                        </option>
                        <option value='1' className='text-info'>
                          Low
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className='row bd-highlight mb-3'>
                  <div className='col-md-3 bd-highlight mt-2'>Severity</div>
                  <div className='col-md-9 bd-highlight'>
                    <div className='w-120px'>
                      <select
                        name='status'
                        data-control='select2'
                        data-hide-search='true'
                        className='form-select form-control form-select-white form-select-sm fw-bold text-danger'
                      >
                        <option value='1' className='text-danger'>
                          High
                        </option>
                        <option value='1' className='text-warning'>
                          Medium
                        </option>
                        <option value='1' className='text-info'>
                          Low
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className='row bd-highlight mb-3'>
                  <div className='col-md-3 bd-highlight mt-2'>Type</div>
                  <div className='col-md-9 bd-highlight'>
                    <div className='w-120px'>
                      <select
                        name='status'
                        data-control='select2'
                        data-hide-search='true'
                        className='form-select form-control form-select-white form-select-sm fw-bold'
                      >
                        <option value='1'>{selectedAlert?.playBookName}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className='bd-highlight mb-3 bdr-top'>
                  <div className='col-md-12 bd-highlight p-0 m-0 pt-4 ps-1'>
                    <div className='d-flex align-items-center gap-2'>
                      <span className='fw-bold'>Alert Name - </span> {selectedAlert?.name}
                    </div>
                  </div>
                  <div className='col-md-12 bd-highlight p-0 m-0 pt-2 ps-1'>
                    <div className='d-flex align-items-center gap-2'>
                      <span className='fw-bold'>Event ID - </span> 4625
                    </div>
                  </div>
                  <div className='col-md-12 bd-highlight p-0 m-0 pt-2 ps-1'>
                    <div className='d-flex align-items-center gap-2'>
                      <span className='fw-bold'> Destination User - </span> --
                    </div>
                  </div>
                  <div className='col-md-12 bd-highlight p-0 m-0 pt-2 ps-1'>
                    <div className='d-flex align-items-center gap-2'>
                      <span className='fw-bold'>Host - </span> 10.0.0.25
                    </div>
                  </div>
                  <div className='col-md-12 bd-highlight p-0 m-0 pt-2 ps-1'>
                    <div className='d-flex align-items-center gap-2'>
                      <span className='fw-bold'>Vendor - </span> --
                    </div>
                  </div>
                </div>
                <div className='d-flex justify-content-between bd-highlight'>
                  <div className='p-2 bd-highlight'>
                    <div className='fs-13'>Incident ID</div>
                  </div>
                  <div className='p-2 bd-highlight'>
                    <div className='badge text-black fs-13'>20210728-00056 </div>
                  </div>
                </div>
                <div className='d-flex justify-content-between bd-highlight'>
                  <div className='p-2 bd-highlight'>
                    <div className='fs-13'>Owner</div>
                  </div>
                  <div className='p-2 bd-highlight'>
                    <div className=''>
                      <select
                        name='status'
                        data-control='select2'
                        data-hide-search='true'
                        className='form-select form-control form-select-white form-select-sm fw-bold'
                      >
                        <option value='1'>Senior security analyst</option>
                        <option value='1'>Arun</option>
                        <option value='1'>Naveen</option>
                        <option value='1'>Yohith</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className='d-flex justify-content-between bd-highlight'>
                  <div className='p-2 bd-highlight'>
                    <div className='fs-13'>Created</div>
                  </div>
                  <div className='p-2 bd-highlight'>
                    <div className='badge text-black fw-normal'>
                      {getCurrentTimeZone(selectedAlert?.detectedtime)}
                    </div>
                  </div>
                </div>
                <div className='d-flex justify-content-between bd-highlight'>
                  <div className='p-2 bd-highlight'>
                    <div className='fs-13'>Updated</div>
                  </div>
                  <div className='p-2 bd-highlight'>
                    <div className='badge text-black fw-normal'>
                      {getCurrentTimeZone(selectedAlert?.detectedtime)}
                    </div>
                  </div>
                </div>
              </div>
              <div className='tab-pane fade' id='kt_tab_pane_2' role='tabpanel'>
                <table
                  className='scroll-y me-n5 pe-5 table table-hover table-row-dashed fs-6 gy-5 my-0 dataTable no-footer'
                  id='kt_inbox_listing'
                >
                  <tbody>
                    <tr className='bg-gray-100 mb-3'>
                      <td className='p-2 pb-8'>
                        <div className='d-flex justify-content-between bd-highlight'>
                          <div className='p-1 bd-highlight fw-bold fs-12'>
                            <div className='text-dark mb-1'>
                              <a href='#' className='text-dark'>
                                <span className='fw-bold'>{selectedAlert?.name}</span>
                              </a>
                            </div>
                          </div>
                          <div className='p-1 bd-highlight'>
                            <a
                              href='#'
                              className='btn btn-sm btn-icon btn-light btn-secondary mx-1'
                            >
                              <i className='fa-solid fa-trash'></i>
                            </a>
                            <a
                              href='#'
                              className='btn btn-sm btn-icon btn-light btn-secondary mx-1'
                            >
                              <i className='fa-solid fa-arrow-up'></i>
                            </a>
                          </div>
                        </div>
                        <div className='d-flex justify-content-between align-text-left bd-highlight'>
                          <div className='p-1 bd-highlight fw-bold fs-12'>Suspicious Rate</div>
                          <div className='p-1 bd-highlight fw-bold fs-12'>
                            <i className='fa-solid fa-circle-check text-success'></i> 1
                          </div>
                        </div>
                        <div className='d-flex justify-content-between align-text-left bd-highlight'>
                          <div className='p-1 bd-highlight fw-bold fs-12'>Detected date</div>
                          <div className='p-1 bd-highlight fs-12'>
                            {getCurrentTimeZone(selectedAlert?.detectedtime)}
                          </div>
                        </div>
                        <hr className='my-0' />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className='tab-pane fade' id='kt_tab_pane_3' role='tabpanel'>
                <table className='table align-middle gs-0 gy-4 dash-table'>
                  <thead>
                    <tr className='fw-bold text-muted bg-blue'>
                      <th className='min-w-50px'>PlayBook Name</th>
                      <th className='min-w-50px'>Description</th>
                      <th className='min-w-50px'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className='fs-12'>
                      <td>{selectedAlert?.playBookName}</td>
                      <td>{selectedAlert?.playBookDescription}</td>
                      <td>
                        <span className='badge badge-success'>Active</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className='tab-pane fade' id='kt_tab_pane_4' role='tabpanel'>
                {selectedAlert?.name === 'Phishing Email Detected' ? (
                  <div className='card-body p-0 h-600px scroll-y'>
                    <h5 className='mb-4'>Phishing Attack Chain</h5>
                    <div className='mitre-attack-chain'>
                      {phishingAttackChain.map((step, index) => (
                        <div
                          key={index}
                          className={`attack-chain-item p-3 mb-2 border rounded ${
                            selectedMitreStepId === step.technique_id ? 'bg-light-primary border-primary' : 'bg-light'
                          }`}
                        >
                          <div 
                            className='d-flex align-items-center justify-content-between cursor-pointer'
                            onClick={() => setSelectedMitreStepId(selectedMitreStepId === step.technique_id ? null : step.technique_id)}
                          >
                            <div className='d-flex align-items-center'>
                              <div className='me-3'>
                                {step.completed ? (
                                  <i className='fas fa-check-circle text-success fs-3'></i>
                                ) : (
                                  <i className='far fa-circle text-gray-400 fs-3'></i>
                                )}
                              </div>
                              <span className='fw-bold'>
                                {step.technique_id} - {step.name}
                              </span>
                            </div>
                            <i className={`fas ${selectedMitreStepId === step.technique_id ? 'fa-chevron-down' : 'fa-chevron-right'} text-gray-400`}></i>
                          </div>

                          {selectedMitreStepId === step.technique_id && (
                            <div className='mt-3 p-3 border-top bg-white rounded shadow-none'>
                              <div className='fs-7'>
                                <p>
                                  <strong>Alert ID:</strong> {step.alert_id || 'N/A'}
                                </p>
                                <p>
                                  <strong>Description:</strong> {step.description}
                                </p>
                                <p>
                                  <strong>MITRE Tactic:</strong> {step.tactic}
                                </p>
                                <p>
                                  <strong>MITRE Technique:</strong> {step.technique_name} (
                                  {step.technique_id})
                                </p>
                                {Object.keys(step.entities).length > 0 && (
                                  <div>
                                    <strong>Entities:</strong>
                                    <ul className='mb-0'>
                                      {Object.entries(step.entities).map(([key, val]) => (
                                        <li key={key}>
                                          {key}: {val}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className='p-5 text-center text-muted'>
                    No MITRE Mapping available for this alert type.
                  </div>
                )}
              </div>
              <div className='tab-pane fade' id='kt_tab_pane_5' role='tabpanel'>
                <div className='card-body p-0 h-600px scroll-y'>
                  <div className='timeline-label'>
                    {timelineData?.map((entry, index) => {
                      const baseTime = new Date(currentDateTime) // start from current time
                      baseTime.setSeconds(baseTime.getSeconds() + index * 2) // add 2 seconds per step

                      let hours = baseTime.getHours()
                      const minutes = String(baseTime.getMinutes()).padStart(2, '0')
                      const seconds = String(baseTime.getSeconds()).padStart(2, '0')
                      const ampm = hours >= 12 ? 'PM' : 'AM'
                      hours = hours % 12 || 12

                      const stepTime = `${baseTime.getFullYear()}-${String(
                        baseTime.getMonth() + 1
                      ).padStart(2, '0')}-${String(baseTime.getDate()).padStart(2, '0')} ${String(
                        hours
                      ).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`

                      return (
                        <div key={index} className='timeline-item'>
                          <div
                            className='timeline-label fw-bold text-gray-800 fs-10'
                            style={{width: '60px'}}
                          >
                            {stepTime}
                          </div>

                          <div className='timeline-badge'>
                            <i className='fa fa-genderless text-primary fs-1'></i>
                          </div>
                          <div className='fw-semibold text-gray-700 ps-1 pb-5 fs-7'>
                            <div>
                              <div>
                                {entry.action} <strong>by</strong> {entry.user}
                              </div>
                            </div>

                            {entry?.result && (
                              <div>
                                <strong>Result:</strong> {entry.result}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IncidentDetails
