import React, {useState} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {fetchAgentActionUrl} from '../../../../../api/Api'
import {notify, notifyFail} from '../components/notification/Notification'

const FetchLogsModal = ({isOpen, toggle, items, selectedActionId, refreshData}) => {
  const [agentLogsChecked, setAgentLogsChecked] = useState(false)
  const [endpointLogsChecked, setEndpointLogsChecked] = useState(false)
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))

  const sendSelectedItemsToBackend = async () => {
    const endPointsData = items.map((item) => ({
      agentIds: item.id,
      accountIds: item.accountId,
      groupIds: item.groupId,
      siteIds: item.siteId,
    }))

    const payload = {
      orgId,
      toolId,
      agentActionId: selectedActionId,
      endPointsData,
      agentLogsFetch: {
        customerFacingLogs: endpointLogsChecked,
        platformLogs: true,
        agentLogs: agentLogsChecked,
      },
      executedUserId: Number(sessionStorage.getItem('userId')),
      executedDate: new Date().toISOString(),
    }
    console.log(payload, 'payload')
    try {
      const response = await fetchAgentActionUrl(payload)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        toggle()
        refreshData()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleSubmit = () => {
    sendSelectedItemsToBackend()
  }

  const handleClose = () => {
    toggle()
  }

  return (
    <Modal show={isOpen} onHide={handleClose} className='EnableAgentModal application-modal'>
      <Modal.Header closeButton>
        <Modal.Title>
          Fetch Logs{' '}
          {items && items.length > 0 && `(${items[0]?.computerName || items[0]?.endpointName})`}
        </Modal.Title>
        <button type='button' className='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        <p>Select the logs to fetch:</p>
        <div className='form-check'>
          <input
            type='checkbox'
            id='agentLogs'
            className='form-check-input'
            checked={agentLogsChecked}
            onChange={() => setAgentLogsChecked(!agentLogsChecked)}
          />
          <label className='form-check-label' htmlFor='agentLogs'>
            Agent logs
          </label>
        </div>
        <div className='form-check'>
          <input
            type='checkbox'
            id='endpointLogs'
            className='form-check-input'
            checked={endpointLogsChecked}
            onChange={() => setEndpointLogsChecked(!endpointLogsChecked)}
          />
          <label className='form-check-label' htmlFor='endpointLogs'>
            Endpoint logs (Windows only)
          </label>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Close
        </Button>
        <Button variant='primary' onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default FetchLogsModal
