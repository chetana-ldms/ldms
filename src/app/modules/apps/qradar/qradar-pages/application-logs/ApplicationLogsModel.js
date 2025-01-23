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
          <div>
            <div className='row'>
              <div className='col-md-2'>
                <div className='mb-2'>
                  <strong>Severity : </strong>
                </div>
                <div className='mb-2'>
                  <strong>User Name : </strong>
                </div>
                <div className='mb-2'>
                  <strong>Time Stamp : </strong>
                </div>
                <div className='mb-2'>
                  <strong>IP Address</strong>
                </div>
                <div className='mb-2'>
                  <strong>Log Source : </strong>
                </div>
                <div className='mb-2'>
                  <strong>Trace ID : </strong>
                </div>
              </div>
              <div className='col-md-10'>
                <div className='mb-2'>{activity.severity || 'N/A'}</div>
                <div className='mb-2'>{activity.username || 'N/A'}</div>
                <div className='mb-2'>{activity.timestamp || 'N/A'}</div>
                <div className='mb-2'>{activity.ipAddress || 'N/A'}</div>
                <div className='mb-2'>{activity.logSource || 'N/A'}</div>
                <div className='mb-2'>{activity.traceId || 'N/A'}</div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-2'>
                <div className='mb-2'>
                  <strong>Message : </strong>
                </div>
              </div>
              <div className='col-md-10'>
                <div className='mb-2'>{activity.message || 'N/A'}</div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-2'>
              <div className='mb-2'>
                  <strong>Stack Trace : </strong>
                </div>
              </div>
              <div className='col-md-10'>
                <div className='mb-2 text-wrap text-break'>{activity.stackTrace || 'N/A'}</div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-2'>
              <div className='mb-2'>
                  <strong>Request Data : </strong>
                </div>
              </div>
              <div className='col-md-10'>
                <div className='mb-2'>{activity.requestData || 'N/A'}</div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-2'>
              <div className='mb-2'>
                  <strong>Response Data : </strong>
                </div>
              </div>
              <div className='col-md-10'>
                <div className='mb-2'>{activity.responseData || 'N/A'}</div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-2'>
              <div className='mb-2'>
                  <strong>Additional Info : </strong>
                </div>
              </div>
              <div className='col-md-10'>
                <div className='mb-2'>{activity.additionalInfo || 'N/A'}</div>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ApplicationLogsModel
