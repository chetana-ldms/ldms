import {useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {ToastContainer, toast} from 'react-toastify'
const DemoPage = () => {
  const {status} = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

 const datatoBeadded = [
  {
    alertID: 11,
    alertDevicePKID: 0,
    toolID: 1,
    orgID: 1,
    name: 'Add SMB  Exploit Alert',
    severity: 'Low',
    score: 8,
    status: 'New',
    playBookName: 'SMB Exploit',
    playBookDescription: 'SMB Exploit',
    sla: '1h 11m',
    statusID: null,
    detectedtime: new Date().toISOString(),
    observableTagID: 1,
    observableTag: 'BruteForce',
    ownerUserID: 0,
    ownerusername: 'admin',
    source: 'Microsoft Sentinel',
    alertData: null,
    createdUser: null,
    processed: 0,
    mitreTactic: 'Lateral Movement',
    mitreTechniques: [{ id: 'T1021', name: 'Remote Services' }],
  },
  {
    alertID: 12,
    alertDevicePKID: 0,
    toolID: 1,
    orgID: 1,
    name: 'Add CYREN Alert',
    severity: 'Low',
    playBookName: 'CYREN Alert',
    playBookDescription: 'CYREN Alert',
    score: 7,
    status: 'New',
    sla: '2h 10m',
    statusID: null,
    detectedtime: new Date().toISOString(),
    observableTagID: 1,
    observableTag: 'Authentication',
    ownerUserID: 0,
    ownerusername: 'analyst',
    source: 'Microsoft Sentinel',
    alertData: null,
    createdUser: null,
    processed: 0,
    mitreTactic: 'Defense Evasion',
    mitreTechniques: [{ id: 'T1070', name: 'Indicator Removal' }],
  },
  {
    alertID: 13,
    alertDevicePKID: 0,
    toolID: 1,
    orgID: 1,
    name: 'Add Insights Alert',
    severity: 'Low',
    playBookName: 'Insights Alert',
    playBookDescription: 'Insights Alert',
    score: 6,
    status: 'New',
    sla: '3h 21m',
    statusID: null,
    detectedtime: new Date().toISOString(),
    observableTagID: 'null',
    observableTag: 'Credential Access',
    ownerUserID: 0,
    ownerusername: 'admin',
    source: 'Microsoft Sentinel',
    alertData: null,
    createdUser: null,
    processed: 0,
    mitreTactic: 'Credential Access',
    mitreTechniques: [{ id: 'T1003', name: 'Credential Dumping' }],
  },
  {
    alertID: 14,
    alertDevicePKID: 0,
    toolID: 1,
    orgID: 1,
    name: 'Failed Login Alert',
    sla: '5h 11m',
    playBookName: 'Failed Login Alert',
    playBookDescription: 'Failed Login Alert',
    severity: 'Medium',
    score: 3,
    status: 'New',
    statusID: null,
    detectedtime: new Date().toISOString(),
    observableTagID: null,
    observableTag: 'BruteForce',
    ownerUserID: 0,
    ownerusername: 'Global Admin',
    source: 'Microsoft Sentinel',
    alertData: null,
    createdUser: null,
    processed: 0,
    mitreTactic: 'Credential Access',
    mitreTechniques: [{ id: 'T1110', name: 'Brute Force' }],
  },
  {
    alertID: 15,
    alertDevicePKID: 0,
    toolID: 1,
    orgID: 1,
    name: 'Add Channel Post',
    severity: 'Medium',
    playBookName: 'Channel Post',
    playBookDescription: 'Channel Post',
    score: 2,
    status: 'New',
    statusID: null,
    detectedtime: new Date().toISOString(),
    observableTagID: null,
    observableTag: 'BruteForce',
    ownerUserID: 0,
    ownerusername: null,
    source: 'Microsoft Sentinel',
    alertData: null,
    createdUser: null,
    processed: 0,
    mitreTactic: 'Initial Access',
    mitreTechniques: [{ id: 'T1566', name: 'Phishing' }],
  },
  {
    alertID: 16,
    alertDevicePKID: 0,
    toolID: 1,
    orgID: 1,
    name: ' Add Checkpoint Alert',
    severity: 'Medium',
    playBookName: 'Checkpoint Alert',
    playBookDescription: 'Checkpoint Alert',
    score: 1,
    status: 'New',
    statusID: null,
    detectedtime: new Date().toISOString(),
    observableTagID: null,
    observableTag: 'Credential Access',
    ownerUserID: 0,
    ownerusername: null,
    source: 'Microsoft Sentinel',
    alertData: null,
    createdUser: null,
    processed: 0,
    mitreTactic: 'Defense Evasion',
    mitreTechniques: [{ id: 'T1562', name: 'Impair Defenses' }],
  },
  {
    alertID: 17,
    alertDevicePKID: 0,
    toolID: 1,
    orgID: 1,
    name: ' New XML Incident',
    severity: 'Medium',
    playBookName: 'New XML Incident',
    playBookDescription: 'New XML Incident',
    score: 2,
    status: 'New',
    statusID: null,
    detectedtime: new Date().toISOString(),
    observableTagID: null,
    observableTag: 'Credential Access',
    ownerUserID: 0,
    ownerusername: null,
    source: 'Microsoft Sentinel',
    alertData: null,
    createdUser: null,
    processed: 0,
    mitreTactic: 'Execution',
    mitreTechniques: [{ id: 'T1059', name: 'Command and Scripting Interpreter' }],
  },
  {
    alertID: 18,
    alertDevicePKID: 0,
    toolID: 1,
    orgID: 1,
    name: 'Add Scanning Alert',
    severity: 'High',
    playBookName: ' Scanning Alert',
    playBookDescription: ' Scanning Alert',
    score: 3,
    status: 'New',
    sla: '2h 10m',
    statusID: null,
    detectedtime: new Date().toISOString(),
    observableTagID: null,
    observableTag: 'Credential Access',
    ownerUserID: 0,
    ownerusername: null,
    source: 'Microsoft Sentinel',
    alertData: null,
    createdUser: null,
    processed: 0,
    mitreTactic: 'Reconnaissance',
    mitreTechniques: [{ id: 'T1046', name: 'Network Service Scanning' }],
  },
  {
    alertID: 19,
    alertDevicePKID: 0,
    toolID: 1,
    orgID: 1,
    name: ' Add WDATP Alert',
    severity: 'High',
    playBookName: ' WDATP Alert',
    playBookDescription: ' WDATP Alert',
    score: 4,
    status: 'New',
    statusID: null,
    detectedtime: new Date().toISOString(),
    observableTagID: null,
    observableTag: 'Credential Access',
    ownerUserID: 0,
    ownerusername: null,
    source: 'Microsoft Sentinel',
    alertData: null,
    createdUser: null,
    processed: 0,
    mitreTactic: 'Defense Evasion',
    mitreTechniques: [{ id: 'T1218', name: 'Signed Binary Proxy Execution' }],
  },
  {
    alertID: 20,
    alertDevicePKID: 0,
    toolID: 1,
    orgID: 1,
    name: 'Suspecious mail',
    sla: '4h 40m',
    playBookName: 'Suspecious mail',
    playBookDescription: 'Suspecious mail',
    severity: 'High',
    score: 2,
    status: 'New',
    statusID: null,
    detectedtime: new Date().toISOString(),
    observableTagID: null,
    observableTag: 'Authentication',
    ownerUserID: 0,
    ownerusername: null,
    source: 'Microsoft Sentinel',
    alertData: null,
    createdUser: null,
    processed: 0,
    mitreTactic: 'Initial Access',
    mitreTechniques: [{ id: 'T1566.002', name: 'Phishing Link' }],
  },
  {
    alertID: 22,
    alertDevicePKID: 0,
    toolID: 1,
    orgID: 1,
    name: 'Memory spike detected',
    DisplayName: 'Memory Spike Detected on Server 10.0.0.25',
    severity: 'High',
    playBookName: 'Memory spike ',
    playBookDescription: 'Memory spike ',
    score: 8,
    status: 'New',
    sla: '45m',
    statusID: null,
    detectedtime: new Date().toISOString(),
    observableTagID: null,
    observableTag: 'Performance',
    ownerUserID: 0,
    ownerusername: 'Senior security analyst',
    source: 'Microsoft Sentinel',
    mitreTactic: 'Impact',
    mitreTechniques: [{ id: 'T1496', name: 'Resource Hijacking' }],
    alertData: null,
    createdUser: null,
    processed: 0,
  },
  {
    alertID: 21,
    alertDevicePKID: 0,
    toolID: 1,
    orgID: 1,
    name: 'Disk failure event detected',
    DisplayName: 'Disk failure event detected on Server 10.1.0.26',
    severity: 'High',
    playBookName: 'Disk failure',
    playBookDescription: 'Disk failure',
    score: 9,
    status: 'New',
    sla: '30m',
    statusID: null,
    detectedtime: new Date().toISOString(),
    observableTagID: null,
    observableTag: 'Device State',
    ownerUserID: 0,
    ownerusername: 'Senior security analyst',
    source: 'Microsoft Sentinel',
    mitreTactic: 'Availability',
    mitreTechniques: [{ id: 'T1499', name: 'Endpoint Denial of Service' }],
    alertData: null,
    createdUser: null,
    processed: 0,
  },
  {
    alertID: 23,
    alertDevicePKID: 0,
    toolID: 1,
    orgID: 1,
    name: 'Network outage detected',
    DisplayName: 'Server 192.168.10.1 Unreachable due to Network outage',
    severity: 'High',
    playBookName: 'Network outage',
    playBookDescription: 'Network outage',
    score: 7,
    status: 'New',
    sla: '1h',
    statusID: null,
    detectedtime: new Date().toISOString(),
    observableTagID: null,
    observableTag: 'Communication Failure',
    ownerUserID: 0,
    ownerusername: 'Senior security analyst',
    source: 'Microsoft Sentinel',
    mitreTactic: 'Command and Control',
    mitreTechniques: [{ id: 'T1071', name: 'Application Layer Protocol' }],
    alertData: null,
    createdUser: null,
    processed: 0,
  },
  {
    alertID: 24,
    alertDevicePKID: 0,
    toolID: 1,
    orgID: 1,
    name: 'Phishing Email Detected',
    DisplayName:
      'An email with a suspicious URL and malicious attachment was delivered to user john.doe@connecthomes.com',
    severity: 'High',
    playBookName: 'Phishing ',
    playBookDescription: 'Phishing',
    score: 8,
    status: 'New',
    sla: '45m',
    statusID: null,
    detectedtime: new Date().toISOString(),
    observableTagID: null,
    observableTag: 'Phishing.Email',
    ownerUserID: 0,
    ownerusername: 'Senior security analyst',
    source: 'Microsoft Sentinel',
    mitreTactic: 'Initial Access',
    mitreTechniques: [
      { id: 'T1566.001', name: 'Spearphishing Attachment' },
    ],
    alertData: null,
    createdUser: null,
    processed: 0,
  },
]

  const localAlert = JSON.parse(localStorage.getItem('alertData')) || []
  if (localStorage.getItem('alertData') === null) {
    localStorage.setItem('alertData', JSON.stringify([]))
  }
  if (status === 'v2') {
    console.log('status == ', status)
    navigate('/qradar/demoalert/updated')
  }
  const addalerttolocal = (e) => {
    const currentAlerts = JSON.parse(localStorage.getItem('alertData')) || []
    currentAlerts.push(e)
    setLoading(true)
    localStorage.setItem('alertData', JSON.stringify(currentAlerts))
    localStorage.setItem('alertadded', JSON.stringify(1))
    navigate('/qradar/demoalert/updated')
  }
  const addalerttolocalv1 = (e) => {
    const currentAlerts = JSON.parse(localStorage.getItem('alertData')) || []
    currentAlerts.push(e)
    setLoading(true)
    localStorage.setItem('alertData', JSON.stringify(currentAlerts))
    localStorage.setItem('alertadded', JSON.stringify(1))
    navigate('/qradar/demoalertv1/updated')
  }
  return (
    <div className='row demo-page'>
      <ToastContainer />
      <div className='mb-10'>
        <a
          href='#'
          onClick={() => {
            localStorage.setItem('alertData', JSON.stringify([]))
          }}
          className='btn btn-danger btn-small'
        >
          Reset
        </a>
      </div>
      {/* Begin Col */}
      <div className='col-lg-5'>
        <div className='card mb-8'>
          <h5 className='bg-heading'>Phishing.Email</h5>
          <div className='card-body'>
            <div className='demo-block'>
              <p className=''>
                This alert triggers when a suspicious or malicious email is detected that may try to
                steal user credentials, deliver malware, or trick users into visiting harmful
                websites.
              </p>
              <button className='btn btn-new' onClick={() => addalerttolocal(datatoBeadded[13])}>
                Add Phishing Alert
              </button>
            </div>
          </div>
        </div>
        <div className='card mb-8'>
          <h5 className='bg-heading p-3 mb-0'>Network: Communication Failure</h5>
          <div className='card-body'>
            <div className='demo-block'>
              <p className=''>
                Add Network Outage alert — triggered by NIC down events, ICMP failures, or dropped
                outbound traffic
              </p>
              <button className='btn btn-new' onClick={() => addalerttolocal(datatoBeadded[12])}>
                Add Network Outage Alert
              </button>
            </div>
          </div>
        </div>

        <div className='card mb-5 mb-xl-8'>
          <h5 className='bg-heading'>Security Monitoring</h5>
          <div className='card-body'>
            <div className='demo-block'>
              <p>Add an alert from Int Sight about SMB exploit named EternalBlue</p>
              <a
                onClick={() => {
                  addalerttolocal(datatoBeadded[0])
                }}
              >
                <button className='btn btn-new'>Add SMB Exploit Alert</button>
              </a>
            </div>
            <div className='demo-block'>
              <p>Start collaboration on the latest modified incident</p>
              <button
                onClick={() => {
                  addalerttolocal(datatoBeadded[0])
                }}
                className='btn btn-success'
              >
                Start Collaboration
              </button>
            </div>
          </div>
        </div>
        <div className='card mb-5 mb-xl-8 h-420px'>
          <h5 className='bg-heading'>Leaked Credentials - Use Cases</h5>
          <div className='card-body'>
            <div className='demo-block'>
              <p>Add Insights alert</p>
              <button
                onClick={() => {
                  addalerttolocal(datatoBeadded[2])
                }}
                className='btn btn-new'
              >
                Add Insights Alert
              </button>
            </div>
            <div className='demo-block'>
              <p>Start collaboration on the latest Intsights incident</p>
              <button
                onClick={() => {
                  addalerttolocalv1(datatoBeadded[2])
                }}
                className='btn btn-success'
              >
                Start Collaboration
              </button>
            </div>
            <div className='demo-block'>
              <p>Failed Login Alert</p>
              <button
                onClick={() => {
                  addalerttolocal(datatoBeadded[3])
                }}
                className='btn btn-new'
              >
                Add Failed Login Alert
              </button>
            </div>
            <div className='demo-block'>
              <p>Start collaboration on the latest failed login incident</p>
              <button
                onClick={() => {
                  addalerttolocalv1(datatoBeadded[3])
                }}
                className='btn btn-success'
              >
                Start Collaboration
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* End Col */}

      {/* Begin Col */}
      <div className='col-lg-7'>
        <div className='row'>
          <div className='col-lg-6'>
            <div className='card mb-5'>
              <h5 className='bg-heading'>System: Device State</h5>
              <div className='card-body'>
                <div className='demo-block'>
                  <p className=''>
                    Add Memory Spike alert — triggered when system memory usage exceeds safe
                    thresholds or OOM kill events occur.
                  </p>
                  <button
                    className='btn btn-new'
                    onClick={() => addalerttolocal(datatoBeadded[10])}
                  >
                    Add Memory Spike Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='col-lg-6'>
            <div className='card mb-8'>
              <h5 className='bg-heading p-3 mb-0'>System: Performance</h5>
              <div className='card-body'>
                <div className='demo-block'>
                  <p>
                    Add an Disk Failure alert — triggered when a disk shows signs of failure (I/O
                    errors or SMART warnings).
                  </p>
                  <button
                    className='btn btn-new'
                    onClick={() => addalerttolocal(datatoBeadded[11])} // index 10
                  >
                    Add Disk Failure Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='card mb-5 mb-xl-8'>
          <h5 className='bg-heading'>Automation</h5>
          <div className='card-body'>
            <div className='demo-block'>
              <p>Add an alert with known IOC (Open incident automatically - CYREN)</p>
              <button
                onClick={() => {
                  addalerttolocal(datatoBeadded[1])
                }}
                className='btn btn-new'
              >
                Add CYREN Alert
              </button>
            </div>
          </div>
        </div>
        <div className='mb-5 mb-xl-8'>
          <div className='row'>
            <div className='col-lg-6'>
              <div className='card'>
                <h5 className='bg-heading'>Threat Intelligence</h5>
                <div className='card-body'>
                  <div className='demo-block'>
                    <p>Add Channel Post</p>
                    <button
                      onClick={() => {
                        addalerttolocal(datatoBeadded[4])
                      }}
                      className='btn btn-new'
                    >
                      Add Channel Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='card'>
                <h5 className='bg-heading'>Malware Alert</h5>
                <div className='card-body'>
                  <div className='demo-block'>
                    <p>Add Checkpoint</p>
                    <button
                      onClick={() => {
                        addalerttolocal(datatoBeadded[5])
                      }}
                      className='btn btn-new'
                    >
                      Add Checkpoint Alert
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='mb-5 mb-xl-8'>
          <div className='row'>
            <div className='col-lg-7'>
              <div className='card'>
                <h5 className='bg-heading'>Vulnerability Management</h5>
                <div className='card-body'>
                  <div className='demo-block'>
                    <p>New XML Incident</p>
                    <button
                      onClick={() => {
                        addalerttolocal(datatoBeadded[6])
                      }}
                      className='btn btn-new'
                    >
                      New XML Incident
                    </button>
                  </div>
                  <div className='demo-block'>
                    <p>Start collaborating on latest XM incident</p>
                    <button
                      onClick={() => {
                        addalerttolocal(datatoBeadded[6])
                      }}
                      className='btn btn-success'
                    >
                      Start Collaboration
                    </button>
                  </div>
                </div>
              </div>
              <div className='card mt-8'>
                <h5 className='bg-heading'>Suspicious mail</h5>
                <div className='card-body'>
                  <div className='demo-block'>
                    <p>Start Collaboration </p>
                    <button
                      onClick={() => {
                        addalerttolocalv1(datatoBeadded[9])
                      }}
                      className='btn btn-success'
                    >
                      Start Collaboration
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-5'>
              <div className='card'>
                <h5 className='bg-heading'>Blacklist</h5>
                <div className='card-body'>
                  <div className='demo-block'>
                    <p>Add Scanning Alert</p>
                    <button
                      onClick={() => {
                        addalerttolocal(datatoBeadded[7])
                      }}
                      className='btn btn-new'
                    >
                      Add Scanning Alert
                    </button>
                  </div>
                </div>
              </div>
              <div className='card mt-8'>
                <h5 className='bg-heading'>Malicious code</h5>
                <div className='card-body'>
                  <div className='demo-block'>
                    <p>Add WDATP Alert</p>
                    <button
                      className='btn btn-new'
                      onClick={() => {
                        addalerttolocal(datatoBeadded[8])
                      }}
                    >
                      Add WDATP Alert
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Col */}
    </div>
  )
}

export {DemoPage}
