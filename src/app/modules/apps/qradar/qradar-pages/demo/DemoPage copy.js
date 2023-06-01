import {useState} from 'react'
import {DemoAlert} from './DemoAlert'
import {render} from 'react-dom'
import {Modal} from 'react-bootstrap'
import {MasterLayout} from '../../../../../../_metronic/layout/MasterLayout'
import {HeaderWrapper} from '../../../../../../_metronic/layout/components/header'
import {Sidebar} from '../../../../../../_metronic/layout/components/sidebar'
import {Content} from '../../../../../../_metronic/layout/components/content'
const DemoPage = () => {
  const initialState = [{id: 1, Alert: 'alert', Type: 'type'}]

  const [newDiv, setNewDiv] = useState([])

  const [alert, setAlerts] = useState(initialState)

  // ✅ Add an object to a state array
  const addObjectToArray = (obj) => {
    setAlerts((current) => [...current, obj])
  }

  const [isAlertVisible, setIsAlertVisible] = useState(false)

  const handleButtonClick = () => {
    setIsAlertVisible(true)

    setTimeout(() => {
      setIsAlertVisible(false)
    }, 3000)
  }

  const [modal, setModal] = useState(false)
  const Toggle = () => setModal(!modal)

  const [show, setShow] = useState(false)

  const handleClose = () => setModal(false)
  const handleShow = () => setShow(true)

  return (
    <div className='row demo-page'>
      <div className='mb-10'>
        <a href='' className='btn btn-danger'>
          Reset
        </a>
      </div>

      {/* Begin Col */}
      <div className='col-lg-5'>
        <div className='card mb-5 mb-xl-8'>
          <div className='card-body'>
            <h5>Security Monitoring</h5>
            <div className='demo-block'>
              <p>Add an alert from IntSight about SMB exploit named EternalBlue</p>
              <a
                // href='demo-alert'
                onClick={() => {
                  addObjectToArray({
                    alertID: 1,
                    alertDevicePKID: 0,
                    toolID: 1,
                    orgID: 1,
                    name: 'Demo:Add SMB  Exploit Alert',
                    severity: '10',
                    score: null,
                    status: 'New',
                    statusID: null,
                    detectedtime: null,
                    observableTagID: null,
                    observableTag: 1,
                    ownerUserID: 0,
                    ownerusername: null,
                    source: 'QRadar',
                    alertData: null,
                    createdUser: null,
                    processed: 0,
                  })
                  {
                    handleButtonClick()
                  }
                  Toggle()
                }}
              >
                <button className='btn btn-primary'>Add SMB Exploit Alert</button>
              </a>
            </div>
            <div className='demo-block'>
              <p>Start collaboration on the latest modified incident</p>
              <button className='btn btn-success'>Start Collaboration</button>
            </div>
          </div>
        </div>
        <div className='card mb-5 mb-xl-8'>
          <div className='card-body'>
            <h5>Leaked Credentials use case</h5>
            <div className='demo-block'>
              <p>Add Insights alert</p>
              <button
                onClick={(key) => {
                  addObjectToArray({
                    alertID: 1,
                    alertDevicePKID: 0,
                    toolID: 1,
                    orgID: 1,
                    name: 'Demo:Add Insights Alert',
                    severity: '10',
                    score: null,
                    status: 'New',
                    statusID: null,
                    detectedtime: null,
                    observableTagID: null,
                    observableTag: 1,
                    ownerUserID: 0,
                    ownerusername: null,
                    source: 'QRadar',
                    alertData: null,
                    createdUser: null,
                    processed: 0,
                  })
                  {
                    handleButtonClick()
                  }
                  Toggle()
                }}
                className='btn btn-primary'
              >
                Add Insights Alert
              </button>
            </div>
            <div className='demo-block'>
              <p>Start collaboration on the latest Intsights incident</p>
              <a href='#'>
                <button className='btn btn-success'>Start Collaboration</button>
              </a>
            </div>
            <div className='demo-block'>
              <p>Add failed login alert</p>
              <a href='alerts'>
                <button className='btn btn-primary'>Add Failed Login Alert</button>
              </a>
            </div>
            <div className='demo-block'>
              <p>Start collaboration on the latest failed login incident</p>
              <button className='btn btn-success'>Start Collaboration</button>
            </div>
          </div>
        </div>
      </div>
      {/* End Col */}

      {/* Begin Col */}
      <div className='col-lg-7'>
        <div className='card mb-5 mb-xl-8'>
          <div className='card-body'>
            <h5>Automation</h5>
            <div className='demo-block'>
              <p>Add an alert with known IOC (Open incident automatically - CYREN)</p>
              <button
                onClick={(key) => {
                  addObjectToArray({
                    alertID: 1,
                    alertDevicePKID: 0,
                    toolID: 1,
                    orgID: 1,
                    name: 'Demo: Add CYREN Alert',
                    severity: '10',
                    score: null,
                    status: 'New',
                    statusID: null,
                    detectedtime: null,
                    observableTagID: null,
                    observableTag: 1,
                    ownerUserID: 0,
                    ownerusername: null,
                    source: 'QRadar',
                    alertData: null,
                    createdUser: null,
                    processed: 0,
                  })
                  {
                    handleButtonClick()
                  }
                  Toggle()
                }}
                className='btn btn-primary'
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
                <div className='card-body'>
                  <h5>Threat Intelligence</h5>
                  <div className='demo-block'>
                    <p>Add channel post</p>
                    <button
                      onClick={(key) => {
                        addObjectToArray({
                          alertID: 1,
                          alertDevicePKID: 0,
                          toolID: 1,
                          orgID: 1,
                          name: 'Demo: Add Channel Post',
                          severity: '10',
                          score: null,
                          status: 'New',
                          statusID: null,
                          detectedtime: null,
                          observableTagID: null,
                          observableTag: 1,
                          ownerUserID: 0,
                          ownerusername: null,
                          source: 'QRadar',
                          alertData: null,
                          createdUser: null,
                          processed: 0,
                        })
                        {
                          handleButtonClick()
                        }
                        Toggle()
                      }}
                      className='btn btn-primary'
                    >
                      Add Channel Post
                    </button>
                    {/* <a href='alerts'>
                      <button className='btn btn-primary'>Add Channel Post</button>
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='card'>
                <div className='card-body'>
                  <h5>Malware Alert</h5>
                  <div className='demo-block'>
                    <p>Add Checkpoint</p>
                    <button
                      onClick={(key) => {
                        addObjectToArray({
                          alertID: 1,
                          alertDevicePKID: 0,
                          toolID: 1,
                          orgID: 1,
                          name: 'Demo: Add Checkpoint Alert',
                          severity: '10',
                          score: null,
                          status: 'New',
                          statusID: null,
                          detectedtime: null,
                          observableTagID: null,
                          observableTag: 1,
                          ownerUserID: 0,
                          ownerusername: null,
                          source: 'QRadar',
                          alertData: null,
                          createdUser: null,
                          processed: 0,
                        })
                        {
                          handleButtonClick()
                        }
                        Toggle()
                      }}
                      className='btn btn-primary'
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
                <div className='card-body'>
                  <h5>Vulnerability Management</h5>
                  <div className='demo-block'>
                    <p>New XML Incident</p>
                    <button
                      onClick={(key) => {
                        addObjectToArray({
                          alertID: 1,
                          alertDevicePKID: 0,
                          toolID: 1,
                          orgID: 1,
                          name: 'Demo:  New XML Incident',
                          severity: '10',
                          score: null,
                          status: 'New',
                          statusID: null,
                          detectedtime: null,
                          observableTagID: null,
                          observableTag: 1,
                          ownerUserID: 0,
                          ownerusername: null,
                          source: 'QRadar',
                          alertData: null,
                          createdUser: null,
                          processed: 0,
                        })
                        {
                          handleButtonClick()
                        }
                        Toggle()
                      }}
                      className='btn btn-primary'
                    >
                      New XML Incident
                    </button>
                    {/* <a href='alerts'>
                      <button className='btn btn-primary'>New XML Incident</button>
                    </a> */}
                  </div>
                  <div className='demo-block'>
                    <p>Start Collaborating on latest XM incident</p>
                    <a href='alerts'>
                      <button className='btn btn-primary'>Start Collaboration</button>
                    </a>
                  </div>
                </div>
              </div>
              <div className='card mt-8'>
                <div className='card-body'>
                  <h5>Suspecious mail</h5>
                  <div className='demo-block'>
                    <p>Start collaboration </p>
                    <a href='#'>
                      <button className='btn btn-success'>Start collaboration</button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-5'>
              <div className='card'>
                <div className='card-body'>
                  <h5>Blacklist</h5>
                  <div className='demo-block'>
                    <p>Add Scanning Alert</p>
                    <button
                      onClick={(key) => {
                        addObjectToArray({
                          id: Math.random(),
                          sev: 'Medium',
                          sla: '-3d 2h 43m',
                          score: '3',
                          status: 'Resolved',
                          time: '14/14/2022, 04:20:45',
                          name: 'Scanning Alert',
                          observable: '-',
                          owner: 'Owener 3',
                          source: '13.13.13.13',
                        })
                        {
                          handleButtonClick()
                        }
                        Toggle()
                      }}
                      className='btn btn-primary'
                    >
                      Add Scanning Alert
                    </button>
                    {/* <a href='alerts'>
                      <button className='btn btn-primary'>Add Scanning Alert</button>
                    </a> */}
                  </div>
                </div>
              </div>
              <div className='card mt-8'>
                <div className='card-body'>
                  <h5>Malicious code</h5>
                  <div className='demo-block'>
                    <p>Add WDATP Alert</p>
                    <button
                      onClick={(key) => {
                        addObjectToArray({
                          id: Math.random(),
                          sev: 'Medium',
                          sla: '-3d 2h 43m',
                          score: '3',
                          status: 'Resolved',
                          time: '14/14/2022, 04:20:45',
                          name: 'WDATP Alert',
                          observable: '-',
                          owner: 'Owener 3',
                          source: '13.13.13.13',
                        })
                        {
                          handleButtonClick()
                        }
                        Toggle()
                      }}
                      className='btn btn-primary'
                    >
                      Add WDATP Alert
                    </button>
                    {/* <a href='alerts'>
                      <button className='btn btn-primary'>Add WDATP Alert</button>
                    </a> */}
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
