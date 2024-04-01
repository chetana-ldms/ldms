import React, {useEffect, useState} from 'react'
import {fetchPolicyDetailsUrl} from '../../../../../api/SentinalApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'

function Policy() {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [policy, setPolicy] = useState({})
  console.log(policy, 'policy')
  const [loading, setLoading] = useState(false)
  const [reputationChecked, setReputationChecked] = useState(false)
  const [staticAiChecked, setStaticAiChecked] = useState(false)
  const [staticAiSuspiciousChecked, setStaticAiSuspiciousChecked] = useState(false)
  const [behavioralAiChecked, setBehavioralAiChecked] = useState(false)
  const [documentScriptChecked, setDocumentScriptChecked] = useState(false)
  const [lateralMovementsChecked, setLateralMovementsChecked] = useState(false)
  const [antiExploitationChecked, setAntiExploitationChecked] = useState(false)
  const [unwantedApplicationsChecked, setUnwantedApplicationsChecked] = useState(false)
  const [applicationControlsChecked, setApplicationControlsChecked] = useState(false)
  const [alternativeThreatsChecked, setAlternativeThreatsChecked] = useState(false)

  const [snapshotsChecked, setSnapshotsChecked] = useState(false)
  const [antiTamperChecked, setAntiTamperChecked] = useState(false)
  const [scanNewAgentsChecked, setScanNewAgentsChecked] = useState(false)
  const [suspiciousDriveBlockingChecked, setSuspiciousDriveBlockingChecked] = useState(false)
  const [loggingChecked, setLoggingChecked] = useState(false)

  const [threatMitigationChecked, setThreatMitigationChecked] = useState(false)
  const [blockedDevicesChecked, setBlockedDevicesChecked] = useState(false)
  const [includeSuspiciousChecked, setIncludeSuspiciousChecked] = useState(false)
  const [includeWarningChecked, setIncludeWarningChecked] = useState(false)
  const [showLast30Days, setShowLast30Days] = useState(false)
  const [contactSupportChecked, setContactSupportChecked] = useState(false)

  const [deepVisibilityEnabled, setDeepVisibilityEnabled] = useState(false)
  const [processEnabled, setProcessEnabled] = useState(false)
  const [fileEnabled, setFileEnabled] = useState(false)
  const [urlEnabled, setUrlEnabled] = useState(false)
  const [dnsEnabled, setDnsEnabled] = useState(false)
  const [ipEnabled, setIpEnabled] = useState(false)
  const [loginEnabled, setLoginEnabled] = useState(false)
  const [registryKeysEnabled, setRegistryKeysEnabled] = useState(false)
  const [scheduledTasksEnabled, setScheduledTasksEnabled] = useState(false)
  const [behavioralIndicatorsEnabled, setBehavioralIndicatorsEnabled] = useState(false)
  const [commandScriptsEnabled, setCommandScriptsEnabled] = useState(false)
  const [crossProcessEnabled, setCrossProcessEnabled] = useState(false)
  const [driverLoadEnabled, setDriverLoadEnabled] = useState(false)
  const [dataMaskingEnabled, setDataMaskingEnabled] = useState(false)
  const [fileMonitoringEnabled, setFileMonitoringEnabled] = useState(false)

  const [autoDecommissionEnabled, setAutoDecommissionEnabled] = useState(false)

  const fetchData = async () => {
    const data = {
      orgID: orgId,
      tenantPolicyScope: false,
      accountPolicyScope: true,
      sitePolicyScope: false,
      groupPolicyScope: false,
      scopeId: '1665272541043650534',
    }
    try {
      setLoading(true)
      const response = await fetchPolicyDetailsUrl(data)
      setPolicy(response)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='account-policy'>
      {loading ? (
        <UsersListLoading />
      ) : (
        <>
          <div className='row'>
            <div className='col-md-6'>
              <p>
                <i className='fa fa-circle-exclamation incident-icon blue mg0right-5' /> Last
                Modified 12 days ago
              </p>
            </div>
            <div className='col-md-6 d-flex justify-content-end'>
              <p>Revert to default inherited policy</p>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-7'>
              <div className='card'>
                <div className='bg-heading'>
                  <h6 className='white pad-10'>Protection Mode</h6>
                </div>
                <div className='card-body'>
                  <div className='d-flex my-5'>
                    <h6 className='mr-3'>Malicious Threats</h6>
                    <div className='form-check form-check-inline'>
                      <input
                        className='form-check-input'
                        type='radio'
                        id='detect'
                        name='maliciousThreatsGroup'
                        checked={policy?.mitigationMode === 'detect'}
                      />
                      <label className='form-check-label mr-3' htmlFor='detect'>
                        Detect
                      </label>
                    </div>
                    <div className='form-check form-check-inline'>
                      <input
                        className='form-check-input'
                        type='radio'
                        id='protect'
                        name='maliciousThreatsGroup'
                        checked={policy?.mitigationMode === 'protect'}
                      />
                      <label className='form-check-label mr-3' htmlFor='protect'>
                        Protect
                      </label>
                    </div>
                    <div className='form-check form-check-inline'>
                      <input
                        className='form-check-input'
                        type='radio'
                        id='quarantine'
                        name='maliciousThreatsGroup'
                        checked={policy?.mitigationMode === 'Kill & Quarantine'}
                      />
                      <label className='form-check-label' htmlFor='quarantine'>
                        Kill & Quarantine
                      </label>
                    </div>
                  </div>

                  <div className='d-flex my-5'>
                    <h6 className='mr-3'>Suspicious Threat</h6>
                    <div className='form-check form-check-inline'>
                      <input
                        className='form-check-input'
                        type='radio'
                        id='detect'
                        name='suspiciousThreatsGroup'
                        checked={policy?.mitigationModeSuspicious === 'detect'}
                      />
                      <label className='form-check-label mr-3' htmlFor='detect'>
                        Detect
                      </label>
                    </div>
                    <div className='form-check form-check-inline'>
                      <input
                        className='form-check-input'
                        type='radio'
                        id='protect'
                        name='suspiciousThreatsGroup'
                        checked={policy?.mitigationModeSuspicious === 'protect'}
                      />
                      <label className='form-check-label mr-3' htmlFor='protect'>
                        Protect
                      </label>
                    </div>
                    <div className='form-check form-check-inline'>
                      <input
                        className='form-check-input'
                        type='radio'
                        id='alerts'
                        name='suspiciousThreatsGroup'
                        checked={policy?.mitigationModeSuspicious === 'alerts'}
                      />
                      <label className='form-check-label' htmlFor='alerts'>
                        Alerts Only
                      </label>
                    </div>
                  </div>
                  

                  <h4>Malicious Macros Mitigation</h4>
                  <p>
                    this only applies when the static AI detection engine is on. add the proytection
                    mode of Malicious Threats is set to protect.{' '}
                  </p>
                  <input className='' type='checkbox' />
                  <label>
                    Remove malicious Macros from the office file instead of placing the files in
                    quarantine
                  </label>
                  <hr />
                  <div>
                    <span>
                      {' '}
                      <strong>cantainment</strong>
                    </span>
                    <span>
                      {' '}
                      <input className='' type='checkbox' />
                      <label>Disconnect from the network</label>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-5'>
              <div className='card'>
                <div className='card-header bg-heading'>
                  <h6 className='pad-10 white'>Detection Engine</h6>
                </div>
                <div className='card-body pad-10'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id='reputation'
                      checked={policy?.engines?.reputation}
                      onChange={() => setReputationChecked(!reputationChecked)}
                    />
                    <label className='form-check-label' htmlFor='reputation'>
                      Reputation
                    </label>
                  </div>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id='staticAi'
                      checked={staticAiChecked}
                      onChange={() => setStaticAiChecked(!staticAiChecked)}
                    />
                    <label className='form-check-label' htmlFor='staticAi'>
                      Static AI
                    </label>
                  </div>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id='staticAiSuspicious'
                      checked={staticAiSuspiciousChecked}
                      onChange={() => setStaticAiSuspiciousChecked(!staticAiSuspiciousChecked)}
                    />
                    <label className='form-check-label' htmlFor='staticAiSuspicious'>
                      Static AI - Suspicious
                    </label>
                  </div>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id='behavioralAi'
                      checked={policy?.engines?.executables}
                      onChange={() => setBehavioralAiChecked(!behavioralAiChecked)}
                    />
                    <label className='form-check-label' htmlFor='behavioralAi'>
                      Behavioral AI - Executable
                    </label>
                  </div>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id='documentScript'
                      checked={documentScriptChecked}
                      onChange={() => setDocumentScriptChecked(!documentScriptChecked)}
                    />
                    <label className='form-check-label' htmlFor='documentScript'>
                      Document, Script
                    </label>
                  </div>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id='lateralMovements'
                      checked={policy?.engines?.lateralMovement}
                      onChange={() => setLateralMovementsChecked(!lateralMovementsChecked)}
                    />
                    <label className='form-check-label' htmlFor='lateralMovements'>
                      Lateral Movements
                    </label>
                  </div>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id='antiExploitation'
                      checked={policy?.engines?.exploits}
                      onChange={() => setAntiExploitationChecked(!antiExploitationChecked)}
                    />
                    <label className='form-check-label' htmlFor='antiExploitation'>
                      Anti Exploitation / Fileless
                    </label>
                  </div>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id='unwantedApplications'
                      checked={unwantedApplicationsChecked}
                      onChange={() => setUnwantedApplicationsChecked(!unwantedApplicationsChecked)}
                    />
                    <label className='form-check-label' htmlFor='unwantedApplications'>
                      Potential Unwanted Applications
                    </label>
                  </div>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id='applicationControls'
                      checked={policy?.engines?.applicationControl}
                      onChange={() => setApplicationControlsChecked(!applicationControlsChecked)}
                    />
                    <label className='form-check-label' htmlFor='applicationControls'>
                      Application Controls
                    </label>
                  </div>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id='alternativeThreats'
                      checked={alternativeThreatsChecked}
                      onChange={() => setAlternativeThreatsChecked(!alternativeThreatsChecked)}
                    />
                    <label className='form-check-label' htmlFor='alternativeThreats'>
                      Detect Alternative Threats
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row mt-5'>
            <div className='col-lg-12'>
              <div className='card'>
                <div className='card-header bg-heading'>
                  <h6 className='white pad-10'>Agent</h6>
                </div>
                <div className='card-body row pad-10'>
                  <div className='col-md-3'>
                    <p>Security Settings</p>
                  </div>
                  <div className='col-md-9'>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='snapshots'
                        checked={policy?.snapshotsOn}
                        onChange={() => setSnapshotsChecked(!snapshotsChecked)}
                      />
                      <label className='form-check-label' htmlFor='snapshots'>
                        Snapshots
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='antiTamper'
                        checked={policy?.antiTamperingOn}
                        onChange={() => setAntiTamperChecked(!antiTamperChecked)}
                      />
                      <label className='form-check-label' htmlFor='antiTamper'>
                        Anti Tamper
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='scanNewAgents'
                        checked={policy?.scanNewAgents}
                        onChange={() => setScanNewAgentsChecked(!scanNewAgentsChecked)}
                      />
                      <label className='form-check-label' htmlFor='scanNewAgents'>
                        Scan new agents
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='suspiciousDriveBlocking'
                        checked={policy?.signedDriverBlockingOn}
                        onChange={() =>
                          setSuspiciousDriveBlockingChecked(!suspiciousDriveBlockingChecked)
                        }
                      />
                      <label className='form-check-label' htmlFor='suspiciousDriveBlocking'>
                        Suspicious Drive Blocking
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='logging'
                        checked={policy?.agentLoggingOn}
                        onChange={() => setLoggingChecked(!loggingChecked)}
                      />
                      <label className='form-check-label' htmlFor='logging'>
                        Logging
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row mt-5'>
            <div className='col-lg-12'>
              <div className='card'>
                <div className='bg-heading'>
                  <h6 className='white pad-10'>Agent UI</h6>
                </div>
                <div className='mt-5 card-body pad-10'>
                  <input className='' type='checkbox' checked={policy?.agentUi?.agentUiOn} />
                  <label>Show Agent UI & tray icon on endpoints</label>

                  <p>Set which information and notification to show for end-user</p>
                  <div>
                    <p>show pop-up notification for:</p>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='threatMitigation'
                        checked={policy?.agentUi?.threatPopUpNotifications}
                        onChange={() => setThreatMitigationChecked(!threatMitigationChecked)}
                      />
                      <label className='form-check-label' htmlFor='threatMitigation'>
                        Threat and Mitigation
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='blockedDevices'
                        checked={policy?.agentUi?.devicePopUpNotifications}
                        onChange={() => setBlockedDevicesChecked(!blockedDevicesChecked)}
                      />
                      <label className='form-check-label' htmlFor='blockedDevices'>
                        Blocked Devices
                      </label>
                    </div>
                  </div>
                  <div>
                    <p>show Suspicious event in the UI:</p>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='includeSuspicious'
                        checked={policy?.agentUi?.showSuspicious}
                        onChange={() => setIncludeSuspiciousChecked(!includeSuspiciousChecked)}
                      />
                      <label className='form-check-label' htmlFor='includeSuspicious'>
                        Include Suspicious
                      </label>
                    </div>
                  </div>
                  <div>
                    <p>show warning in case of Agent errors:</p>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='includeWarning'
                        checked={policy?.agentUi?.showAgentWarnings}
                        onChange={() => setIncludeWarningChecked(!includeWarningChecked)}
                      />
                      <label className='form-check-label' htmlFor='includeWarning'>
                        Include warning
                      </label>
                    </div>
                  </div>
                  <div>
                    <p>show in the UI events from the last:</p>
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='showLast30Days'
                        checked={policy?.agentUi?.maxEventAgeDays}
                        onChange={() => setShowLast30Days(!showLast30Days)}
                      />
                      <label className='form-check-label' htmlFor='showLast30Days'>
                        30 days
                      </label>
                    </div>
                  </div>
                  <div>
                    <p>show these menu item in the UI:</p>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='threatMitigation'
                        checked={policy?.agentUi?.showDeviceTab}
                        onChange={() => setThreatMitigationChecked(!threatMitigationChecked)}
                      />
                      <label className='form-check-label' htmlFor='threatMitigation'>
                        Blocked Devices
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='blockedDevices'
                        checked={policy?.agentUi?.showQuarantineTab}
                        onChange={() => setBlockedDevicesChecked(!blockedDevicesChecked)}
                      />
                      <label className='form-check-label' htmlFor='blockedDevices'>
                        Quarantined Files
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='contactSupport'
                        checked={policy?.agentUi?.showSupport}
                        onChange={() => setContactSupportChecked(!contactSupportChecked)}
                      />
                      <label className='form-check-label' htmlFor='contactSupport'>
                        Contact Support
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row mt-5'>
            <div className='col-lg-12'>
              <div className='card'>
                <p className='pad-10'>
                  <i className='fa fa-circle-exclamation incident-icon blue mg0right-5' /> Some
                  agent Ui settings are supported for the agent version 21.7+
                </p>
              </div>
            </div>
          </div>
          <div className='row mt-5'>
            <div className='col-lg-12'>
              <div className='card'>
                <div className='card-header bg-heading'>
                  <h6 className='white pad-10'>Deep Visibality</h6>
                </div>
                <div className='card-body pad-10'>
                  <div className='d-flex justify-content-between'>
                    <div>
                      <h6>Deep Visibality configuration</h6>
                      <p>collect this deep Visibality data</p>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='deepVisibility'
                        checked={policy?.isDefault}
                        onChange={() => setDeepVisibilityEnabled(!deepVisibilityEnabled)}
                      />
                      <label className='form-check-label' htmlFor='deepVisibility'>
                        Enable deep Visibility
                      </label>
                    </div>
                    <div className='float-right'>
                      <span>icon</span> <span>Event type configuration</span>
                    </div>
                  </div>
                  <div className='d-flex flex-wrap'>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='process'
                        checked={policy?.iocAttributes?.process}
                        onChange={() => setProcessEnabled(!processEnabled)}
                      />
                      <label className='form-check-label' htmlFor='process'>
                        Process
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='file'
                        checked={policy?.iocAttributes?.file}
                        onChange={() => setFileEnabled(!fileEnabled)}
                      />
                      <label className='form-check-label' htmlFor='file'>
                        File
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='url'
                        checked={policy?.iocAttributes?.url}
                        onChange={() => setUrlEnabled(!urlEnabled)}
                      />
                      <label className='form-check-label' htmlFor='url'>
                        URL
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='dns'
                        checked={policy?.iocAttributes?.dns}
                        onChange={() => setDnsEnabled(!dnsEnabled)}
                      />
                      <label className='form-check-label' htmlFor='dns'>
                        DNS
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='ip'
                        checked={policy?.iocAttributes?.ip}
                        onChange={() => setIpEnabled(!ipEnabled)}
                      />
                      <label className='form-check-label' htmlFor='ip'>
                        IP
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='login'
                        checked={policy?.iocAttributes?.windowsEventLogs}
                        onChange={() => setLoginEnabled(!loginEnabled)}
                      />
                      <label className='form-check-label' htmlFor='login'>
                        Login
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='registryKeys'
                        checked={policy?.iocAttributes?.registry}
                        onChange={() => setRegistryKeysEnabled(!registryKeysEnabled)}
                      />
                      <label className='form-check-label' htmlFor='registryKeys'>
                        Registry Keys
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='scheduledTasks'
                        checked={policy?.iocAttributes?.scheduledTask}
                        onChange={() => setScheduledTasksEnabled(!scheduledTasksEnabled)}
                      />
                      <label className='form-check-label' htmlFor='scheduledTasks'>
                        Scheduled Tasks
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='behavioralIndicators'
                        checked={policy?.iocAttributes?.behavioralIndicators}
                        onChange={() =>
                          setBehavioralIndicatorsEnabled(!behavioralIndicatorsEnabled)
                        }
                      />
                      <label className='form-check-label' htmlFor='behavioralIndicators'>
                        Behavioral Indicators
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='commandScripts'
                        checked={policy?.iocAttributes?.commandScripts}
                        onChange={() => setCommandScriptsEnabled(!commandScriptsEnabled)}
                      />
                      <label className='form-check-label' htmlFor='commandScripts'>
                        Command Scripts
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='crossProcess'
                        checked={policy?.iocAttributes?.crossProcess}
                        onChange={() => setCrossProcessEnabled(!crossProcessEnabled)}
                      />
                      <label className='form-check-label' htmlFor='crossProcess'>
                        Cross Process
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='driverLoad'
                        checked={policy?.iocAttributes?.driver}
                        onChange={() => setDriverLoadEnabled(!driverLoadEnabled)}
                      />
                      <label className='form-check-label' htmlFor='driverLoad'>
                        Driver Load
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='dataMasking'
                        checked={policy?.iocAttributes?.dataMasking}
                        onChange={() => setDataMaskingEnabled(!dataMaskingEnabled)}
                      />
                      <label className='form-check-label' htmlFor='dataMasking'>
                        Data Masking
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='fileMonitoring'
                        checked={policy?.iocAttributes?.smartFileMonitoring}
                        onChange={() => setFileMonitoringEnabled(!fileMonitoringEnabled)}
                      />
                      <label className='form-check-label' htmlFor='fileMonitoring'>
                        Focused File Monitoring
                      </label>
                    </div>
                  </div>
                  <div>
                    <input
                      className=''
                      type='checkbox'
                      checked={policy?.iocAttributes?.autoInstallBrowserExtensions}
                    />
                    <label>Automatically install Deep Visibility browser extensions</label>
                    <p>
                      <i className='fa fa-circle-exclamation incident-icon blue mg0right-5' /> Last
                      Do not search if your organization uses Google Workspace(formerly G Suite) to
                      manage browser extensions
                    </p>
                    <p>
                      This overrides other browser extensions deployed Google Workspace. if your
                      organization uses Google Workspace to deploy browser extensions, This option
                      requires Windows Agent 4.7+{' '}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row mt-5'>
            <div className='col-lg-12'>
              <div className='card'>
                <div className='card-header bg-heading'>
                  <h6 className='white pad-10'>Binary Vault</h6>
                </div>
                <div className='card-body row pad-10'>
                  <div>
                    <span>
                      {' '}
                      <strong>Enable automatic File Upload</strong>
                    </span>
                    <span>
                      {' '}
                      <input
                        className=''
                        type='checkbox'
                        checked={policy?.autoFileUpload?.enabled}
                      />
                      <label>Enable automatic File Upload</label>
                    </span>
                  </div>
                  <div className='row'>
                    <div className='col-md-5'>
                      <p>Exclude Path</p>
                      <p>Exclude File Type</p>
                      <p>Maximum file size Upload(Max 250MB)</p>
                      <p>Total Upload per agent per day(Max 500MB)</p>
                      <p>offline cache size(Max 2048MB)</p>
                    </div>
                    <div className='col-md-7'>
                      <p>
                        {' '}
                        <input type='text' placeholder='New Path' />
                      </p>
                      <p>
                        {' '}
                        <input type='text' placeholder='New File Type' />
                      </p>
                      <p>
                        {' '}
                        <input
                          type='text'
                          value={
                            policy?.autoFileUpload?.maxFileSizeLimit / (1024 * 1024) + ' ' + 'MB'
                          }
                          placeholder='250 MB'
                        />
                      </p>
                      <p>
                        {' '}
                        <input
                          type='text'
                          value={
                            policy?.autoFileUpload?.maxDailyFileUploadLimit / (1024 * 1024) +
                            ' ' +
                            'MB'
                          }
                          placeholder='500 MB'
                        />
                      </p>
                      <p>
                        {' '}
                        <input
                          type='text'
                          value={
                            policy?.autoFileUpload?.maxLocalDiskUsageLimit / (1024 * 1024) +
                            ' ' +
                            'MB'
                          }
                          placeholder='2048 MB'
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row mt-5'>
            <div className='col-lg-12'>
              <div className='card'>
                <div className='card-header bg-heading'>
                  <h6 className='white pad-10'>More Options</h6>
                </div>
                <div className='card-body row pad-10'>
                  <div className='d-flex justify-content-start '>
                    <strong>Decommissioning</strong>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='autoDecommission'
                        checked={policy?.autoDecommissionOn}
                        onChange={() => setAutoDecommissionEnabled(!autoDecommissionEnabled)}
                      />
                      <label className='form-check-label' htmlFor='autoDecommission'>
                        Auto Decommission after {policy?.autoDecommissionDays} days offline
                      </label>
                    </div>
                  </div>
                  <div className='d-flex justify-content-start '>
                    <strong>Remote Shell</strong>
                    <div className=''>
                      <input className='' type='checkbox' checked={policy?.removeMacros} />
                      <label>Enable Remote Shell</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Policy
