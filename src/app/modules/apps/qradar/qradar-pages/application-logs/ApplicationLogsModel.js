import React, {useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'
import {fetchApplicationLogsUrl} from '../../../../../api/ApplicationLogsApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {truncateText} from '../../../../../../utils/TruncateText'

function ApplicationLogsModel({selectedEndpoint, showModal, setShowModal}) {
  const logId = selectedEndpoint?.logId
  const [activity, setActivity] = useState({})
  const [loading, setLoading] = useState(false)
  const orgId = Number(sessionStorage.getItem('orgId'))

  const fetchData = async () => {
    const data = {
      paging: {
        rangeStart: 1,
        rangeEnd: 1,
      },
      orgId: orgId,
      logId: logId,
    }
    try {
      setLoading(true)
      const response = await fetchApplicationLogsUrl(data)
      setActivity(response?.getApplicationLogs[0] || {})
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (logId) {
      fetchData()
    }
  }, [logId])

  return (
    <Modal className='application-modal' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton className='pad-10'>
        <Modal.Title>Application Log Detail</Modal.Title>
        <button
          type='button'
          className='application-modal-close'
          aria-label='Close'
          onClick={() => setShowModal(false)}
        >
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <UsersListLoading />
        ) : (
          <div className='row'>
            <div className='col-md-2'>
              <div className='mb-3'>
                <strong>Severity : </strong>
              </div>
              <div className='mb-3'>
                <strong>Message : </strong>
              </div>
              <div className='mb-3'>
                <strong>User Name : </strong>
              </div>
              <div className='mb-3'>
                <strong>Time Stamp : </strong>
              </div>
              <div className='mb-3'>
                <strong>IP Address</strong>
              </div>
              <div className='mb-3'>
                <strong>Log Source : </strong>
              </div>
              <div className='mb-3'>
                <strong>Trace ID : </strong>
              </div>
              <div className='mb-3'>
                <strong>Stack Trace : </strong>
              </div>
              <div className='mb-3'>
                <strong>Request Data : </strong>
              </div>
              <div className='mb-3'>
                <strong>Response Data : </strong>
              </div>
              <div className='mb-3'>
                <strong>Additional Info : </strong>
              </div>
            </div>
            <div className='col-md-10'>
              <div className='mb-3'>{activity.severity || 'N/A'}</div>
              <div className='mb-3' title={activity.message}>
                {truncateText(activity.message, 90) || 'N/A'}
              </div>
              <div className='mb-3'>{activity.username || 'N/A'}</div>
              <div className='mb-3'>{activity.timestamp || 'N/A'}</div>
              <div className='mb-3'>{activity.ipAddress || 'N/A'}</div>
              <div className='mb-3'>{activity.logSource || 'N/A'}</div>
              <div className='mb-3'>{activity.traceId || 'N/A'}</div>
              <div className='mb-3' title={activity.stackTrace}>
                {truncateText(activity.stackTrace, 90) || 'N/A'}
              </div>

              <div className='mb-3' title={activity.requestData}>
                {truncateText(activity.requestData, 90) || 'N/A'}
              </div>

              <div className='mb-3' title={activity.responseData}>
                {truncateText(activity.responseData, 90) || 'N/A'}
              </div>

              <div className='mb-3' title={activity.additionalInfo}>
                {truncateText(activity.additionalInfo, 90) || 'N/A'}
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ApplicationLogsModel
