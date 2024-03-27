import React, {useState} from 'react'

function Policy() {
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

  return (
    <div>
      <div className='row'>
        <div className='col-md-6'>
          <p>
            <i className='fa fa-circle-exclamation incident-icon blue mg0right-5' /> Last Modified
            12 days ago
          </p>
        </div>
        <div className='col-md-6 d-flex justify-content-end'>
          <p>Revert to default inherited policy</p>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-7 card'>
          <div className='card-header'>
            <h2>Protection Mode</h2>
          </div>
          <div className='card-body'>
            <h4>Malicious Macros Mitigation</h4>
            <p>
              this only applies when the static AI detection engine is on. add the proytection mode
              of Malicious Threats is set to protect.{' '}
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
        <div className='col-md-5 card'>
          <div className='card-header'>
            <h2>Detection Engine</h2>
          </div>
          <div className='card-body'>
            <div className='form-check form-switch'>
              <input
                className='form-check-input'
                type='checkbox'
                id='reputation'
                checked={reputationChecked}
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
                checked={behavioralAiChecked}
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
                checked={lateralMovementsChecked}
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
                checked={antiExploitationChecked}
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
                checked={applicationControlsChecked}
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
      <div className='row card'>
        <div className='card-header'>
          <h2>Agent</h2>
        </div>
        <div className='card-body row'>
          <div className='col-md-3'>
            <p>Security Settings</p>
          </div>
          <div className='col-md-9'>
            <div className='form-check form-switch'>
              <input
                className='form-check-input'
                type='checkbox'
                id='snapshots'
                checked={snapshotsChecked}
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
                checked={antiTamperChecked}
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
                checked={scanNewAgentsChecked}
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
                checked={suspiciousDriveBlockingChecked}
                onChange={() => setSuspiciousDriveBlockingChecked(!suspiciousDriveBlockingChecked)}
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
                checked={loggingChecked}
                onChange={() => setLoggingChecked(!loggingChecked)}
              />
              <label className='form-check-label' htmlFor='logging'>
                Logging
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='d-flex'>
          <div className='mx-10'>
            <h2>Agent UI</h2>
          </div>
          <div className='mx-10'>
            <input className='' type='checkbox' />
            <label>Show Agent UI & tray icon on endpoints</label>
          </div>
        </div>
        <div>Set which information and notification to show for end-user</div>
        <div>
          <span>show pop-up notification for:</span>
          <div className='form-check form-switch'>
            <input
              className='form-check-input'
              type='checkbox'
              id='threatMitigation'
              checked={threatMitigationChecked}
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
              checked={blockedDevicesChecked}
              onChange={() => setBlockedDevicesChecked(!blockedDevicesChecked)}
            />
            <label className='form-check-label' htmlFor='blockedDevices'>
              Blocked Devices
            </label>
          </div>
        </div>
        <div>
          <span>show Suspicious event in the UI:</span>
          <div className='form-check form-switch'>
            <input
              className='form-check-input'
              type='checkbox'
              id='includeSuspicious'
              checked={includeSuspiciousChecked}
              onChange={() => setIncludeSuspiciousChecked(!includeSuspiciousChecked)}
            />
            <label className='form-check-label' htmlFor='includeSuspicious'>
              Include Suspicious
            </label>
          </div>
        </div>
        <div>
          <span>show warning in case of Agent errors:</span>
          <div className='form-check form-switch'>
            <input
              className='form-check-input'
              type='checkbox'
              id='includeWarning'
              checked={includeWarningChecked}
              onChange={() => setIncludeWarningChecked(!includeWarningChecked)}
            />
            <label className='form-check-label' htmlFor='includeWarning'>
              Include warning
            </label>
          </div>
        </div>
        <div>
          <span>show in the UI events from the last:</span>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              id='showLast30Days'
              checked={showLast30Days}
              onChange={() => setShowLast30Days(!showLast30Days)}
            />
            <label className='form-check-label' htmlFor='showLast30Days'>
              30 days
            </label>
          </div>
        </div>
        <div>
          <span>show these menu item in the UI:</span>
          <div className='form-check form-switch'>
            <input
              className='form-check-input'
              type='checkbox'
              id='threatMitigation'
              checked={threatMitigationChecked}
              onChange={() => setThreatMitigationChecked(!threatMitigationChecked)}
            />
            <label className='form-check-label' htmlFor='threatMitigation'>
              Threat Mitigation
            </label>
          </div>
          <div className='form-check form-switch'>
            <input
              className='form-check-input'
              type='checkbox'
              id='blockedDevices'
              checked={blockedDevicesChecked}
              onChange={() => setBlockedDevicesChecked(!blockedDevicesChecked)}
            />
            <label className='form-check-label' htmlFor='blockedDevices'>
              Blocked Devices
            </label>
          </div>
          <div className='form-check form-switch'>
            <input
              className='form-check-input'
              type='checkbox'
              id='contactSupport'
              checked={contactSupportChecked}
              onChange={() => setContactSupportChecked(!contactSupportChecked)}
            />
            <label className='form-check-label' htmlFor='contactSupport'>
              Contact Support
            </label>
          </div>
        </div>
      </div>
      <div className='row card'>
        <p>
          <i className='fa fa-circle-exclamation incident-icon blue mg0right-5' /> Some agent Ui
          settings are supported for the agent version 21.7+
        </p>
      </div>
      <div className='row card'>
        <div className='card-header'>
          <h2>Deep Visibality</h2>
        </div>
        <div className='card-body'>
          <div className='d-flex'>
            <div>
              <h6>Deep Visibality configuration</h6>
              <p>collect this deep Visibality data</p>
            </div>
            <div className='form-check form-switch'>
              <input
                className='form-check-input'
                type='checkbox'
                id='deepVisibility'
                checked={deepVisibilityEnabled}
                onChange={() => setDeepVisibilityEnabled(!deepVisibilityEnabled)}
              />
              <label className='form-check-label' htmlFor='deepVisibility'>
                Enable deep Visibility
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Policy
