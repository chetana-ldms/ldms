import React, {useEffect, useState} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {fetchSentinelOneAlert} from '../../../../../api/AlertsApi'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {truncateText} from '../../../../../../utils/TruncateText'

const IncidentAlertPopUp = ({show, onClose, selectedAlertId}) => {
  const [sentinalOne, setSentinalOne] = useState(null)
  const [endpointInfo, setEndpointInfo] = useState(null)
  const [networkHistory, setNetworkHistory] = useState(null)
  const [threatHeaderDtls, setThreatHeaderDtls] = useState(null)
  const [threatInfo, setThreatInfo] = useState(null)
  const fetchAlertDetails = async () => {
    try {
      const sentinalOneDetails = await fetchSentinelOneAlert(selectedAlertId)
      setSentinalOne(sentinalOneDetails)
      const endpoint_Info = sentinalOneDetails.endpoint_Info
      setEndpointInfo(endpoint_Info)
      const networkHistory = sentinalOneDetails.networkHistory
      setNetworkHistory(networkHistory)
      const threatHeaderDtls = sentinalOneDetails.threatHeaderDtls
      setThreatHeaderDtls(threatHeaderDtls)
      const threatInfo = sentinalOneDetails.threatInfo
      setThreatInfo(threatInfo)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchAlertDetails()
  }, [selectedAlertId])
  const transformAction = (item) => {
    switch (item.toLowerCase()) {
      case 'kill':
        return 'KILLED'
      case 'quarantine':
        return 'QUARANTINED'
      case 'remediate':
        return 'REMEDIATED'
      case 'rollback':
        return 'ROLLED BACK'
      default:
        return item.toUpperCase()
    }
  }
  const getIconClass = (osType) => {
    switch (osType) {
      case 'windows':
        return 'fab fa-windows fs-40'
      case 'macos':
        return 'fab fa-apple fs-40'
      case 'linux':
        return 'fab fa-linux fs-40'
      default:
        return '' // or a default icon class
    }
  }
  return (
    <Modal show={show} onHide={onClose} className='Incident-modal application-modal'>
      <Modal.Header closeButton>
        <Modal.Title>{threatInfo?.name}</Modal.Title>
        <button type='button' class='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        {
          <div className='h-300px scroll-y'>
            <div className='row'>
              <div className='col-md-12'>
                <div className='row  d-flex justify-content-start'>
                  <div className='col-md-1 text-center'>
                    <i className='bi bi-stopwatch fs-18'></i>
                  </div>
                  <div className='col-md-5'>
                    <p className='mb-2'>
                      <span className='semi-bold'>Identified Time : </span>
                      <span>{getCurrentTimeZone(threatHeaderDtls?.identifiedTime)}</span>
                    </p>
                  </div>
                  <div className='col-md-5'>
                    <p className='mb-2'>
                      <span className='semi-bold'>Reporting Time : </span>
                      <span>{getCurrentTimeZone(threatHeaderDtls?.reportingTime)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className='row'>
              <div className='col-md-12'>
                <div className='d-flex '>
                  <div className='border-right pe-2'>
                    {' '}
                    <span className='semi-bold'>Threat status :</span>{' '}
                    {threatHeaderDtls?.threatStatus}
                  </div>
                  <div className='border-right px-1'>
                    <span className='semi-bold'>AI Confidence level : </span>
                    {threatHeaderDtls?.aiConfidenceLevel}
                  </div>
                  <div className='border-right px-1 pe-2 d-flex align-items-center'>
                    <span className='semi-bold'>Analyst Verdict : </span>
                    {threatHeaderDtls?.ldC_AnalysisVerdict}
                  </div>
                  <div className='px-1 d-flex align-items-center'>
                    <span className='semi-bold'>Incident Status : </span>
                    {threatHeaderDtls?.ldC_IncidentStatus}
                  </div>
                </div>
                {/* <hr /> */}
                <div className='mt-3'>
                  <span className='semi-bold'>Mitigation Actions Taken:</span>
                  {threatHeaderDtls?.mitigationActionWithStatus ? (
                    threatHeaderDtls?.mitigationActionWithStatus?.reverse().map((item, index) => (
                      <span key={index} className='m-2'>
                        {transformAction(item.actionName)}{' '}
                        {item.status === 'pending' && ` ${item.status}`}
                        {item.status !== 'pending' && (
                          <i className='bi bi-check green fs-20 v-middle'></i>
                        )}
                      </span>
                    ))
                  ) : threatHeaderDtls?.miticationActions ? (
                    threatHeaderDtls?.miticationActions?.reverse().map((item, index) => (
                      <span key={index} className='m-2'>
                        {transformAction(item)}
                        <i className='bi bi-check green fs-20 v-middle'></i>
                      </span>
                    ))
                  ) : (
                    <span>No mitigation actions</span>
                  )}
                </div>
              </div>
            </div>

            <hr />
            <div className='row'>
              <div className='fs-12 col-md-6'>
                <span className='semi-bold'>THREAT FILE NAME :</span> {threatInfo?.name}
              </div>
              <div className='fs-14 mt-5 text-primary col-md-6 text-end'></div>
            </div>
            <hr />
            <div className='row'>
              <div className='col-md-6'>
                <div className='row'>
                  <div className='col-md-4'>
                    <p className='semi-bold'>Path: </p>
                    <p className='semi-bold'>Process User:</p>
                    <p className='semi-bold'>Original Process:</p>
                    <p className='semi-bold'>SHA1:</p>
                    <p className='semi-bold'>Initiated By:</p>
                  </div>
                  <div className='col-md-8'>
                    <p
                      style={{
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '50ch',
                      }}
                      title={threatInfo?.path}
                    >
                      {threatInfo?.path}
                    </p>

                    <p>{threatInfo?.processUser}</p>
                    <p>{threatInfo?.originatingProcess}</p>
                    <p
                      style={{
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '50ch',
                      }}
                      title={threatInfo?.shA1}
                    >
                      {threatInfo?.shA1}
                    </p>
                    <p>{threatInfo?.initiatedBy}</p>
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='row'>
                  <div className='col-md-4 '>
                    <p className='semi-bold'>Detection Type:</p>
                    <p className='semi-bold'>Classification:</p>
                    <p className='semi-bold'> File Size:</p>
                    <p className='semi-bold'>Storyline</p>
                    <p className='semi-bold'>Threat id:</p>
                  </div>
                  <div className='col-md-6'>
                    <p>{threatInfo?.detectionType}</p>
                    <p>{threatInfo?.classification}</p>
                    <p>{threatInfo?.fileSize}</p>
                    <p>{threatInfo?.storyline}</p>
                    <p>{threatInfo?.threatId}</p>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <h4>END POINT</h4>
            {/* <hr className="my-2" /> */}

            <div className='row'>
              <div className='col-md-5'>
                <div className='row'>
                  <p className='semi-bold'>Real Time Data about the end point:</p>
                  <div className='row border-bottom'>
                    <div className='col-md-2'>
                      <span>
                        <i className={getIconClass(endpointInfo?.agentOSType)}></i>
                      </span>
                    </div>
                    <div className='col-md-10'>
                      <h6>{endpointInfo?.computerName}</h6>
                      <p className='fs-11'>{endpointInfo?.scope}</p>
                      <p className='fs-10'>{endpointInfo?.agentOSType}</p>
                    </div>
                  </div>
                  <div className='col-md-5 '>
                    {/* <p>Console connectivity</p> */}
                    <p className='mb-2 semi-bold'>Full Disc scan:</p>
                    <p className='semi-bold'>Pending Reboot:</p>
                    {/* <p>Number of not Mitigated Threats</p> */}
                    <p className='semi-bold'> Network status:</p>
                  </div>
                  <div className='col-md-7'>
                    {/* <p>{endpointInfo.consoleConnectivity}</p> */}
                    <p>{getCurrentTimeZone(endpointInfo?.fullDiskScan)}</p>
                    <p>{endpointInfo?.pendinRreboot}</p>
                    {/* <p>0</p> */}
                    <p>{endpointInfo?.networkStatus}</p>
                  </div>
                </div>
              </div>
              <div className='col-md-7'>
                <div className='row'>
                  <div className='col-md-4'>
                    {/* <p>At Detection time :</p> */}
                    <p className='semi-bold'>Scope:</p>
                    <p className='semi-bold'>OS Version:</p>
                    <p className='semi-bold'>Agent Version:</p>
                    <p className='semi-bold'> Policy:</p>
                    <p className='semi-bold'>Logged in user:</p>
                    <p className='semi-bold'>UUID:</p>
                    {/* <p className='semi-bold'>Domain:</p> */}
                    <p className='semi-bold'>IP v4 Address:</p>
                    <p className='semi-bold'>IP v6 Address:</p>
                    <p className='semi-bold fs-11'>Console Visible adress:</p>
                    <p className='semi-bold'>Subscription Time:</p>
                  </div>
                  <div className='col-md-8'>
                    {/* <p>.</p> */}
                    <p style={{fontSize: 10}} title={endpointInfo?.scope}>{truncateText(endpointInfo?.scope, 50)}</p>
                    <p>{endpointInfo?.osVersion}</p>
                    <p>{endpointInfo?.agentVersion}</p>
                    <p>{endpointInfo?.policy}</p>
                    <p>{endpointInfo?.loggedInUser}</p>
                    <p>{endpointInfo?.uuid}</p>
                    {/* <p>{endpointInfo?.domain?? null}</p> */}
                    <p>{endpointInfo?.ipV4Address}</p>
                    <p title={endpointInfo?.ipV6Address}>
                      {truncateText(endpointInfo?.ipV6Address, 50)}
                    </p>
                    <p>{endpointInfo?.consoleVisibleIPAddress ?? null}</p>
                    <p>{getCurrentTimeZone(endpointInfo?.subscriptionTime)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default IncidentAlertPopUp
