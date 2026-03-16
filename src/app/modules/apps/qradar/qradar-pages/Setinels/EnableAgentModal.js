import React, {useState} from 'react'
import {Modal, Button, DropdownButton, Dropdown} from 'react-bootstrap'
import {fetchAgentActionUrl} from '../../../../../api/Api'
import {notify, notifyFail} from '../components/notification/Notification'

const EnableAgentModal = ({isOpen, toggle, items, selectedActionId, refreshData}) => {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const [isRebootChecked, setIsRebootChecked] = useState(false)

  const sendSelectedItemsToBackend = async () => {
    const endPointsData = items.map((item) => ({
      agentIds: item.id,
      accountIds: item.accountId,
      groupIds: item.groupId,
      siteIds: item.siteId,
      agentName: item.computerName || item.endpointName,
    }))

    const payload = {
      orgId,
      toolId,
      agentActionId: selectedActionId,
      endPointsData,
      enableAgent: {
        shouldReboot: isRebootChecked,
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
  const handleEnable = () => {
    sendSelectedItemsToBackend()
  }

  return (
    <Modal
      backdrop='static'
      keyboard={false}
      show={isOpen}
      onHide={toggle}
      className='EnableAgentModal application-modal'
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Enable Agent{' '}
          {items && items.length > 0 && `(${items[0]?.computerName || items[0]?.endpointName})`}
        </Modal.Title>
        <button type='button' className='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        <h4 className='mb-5'>Are you sure you want to Enable the selected agent(s)?</h4>
        <div className='d-flex justify-content-between align-items-center'>
          <p className='mt-5 mb-3'>
            All detection engines are enabled <i className='bi bi-exclamation-circle' />
          </p>
          <div>
            <i className='fab fa-linux ms-4' />
            <i className='bi bi-windows ms-4' />
            <i className='bi bi-apple ms-4' />
          </div>
        </div>
        <div className='d-flex justify-content-between align-items-center'>
          <p className='mb-3'>Firewall Control rules are not enforced.</p>
          <div>
            <i className='fab fa-linux ms-4' />
            <i className='bi bi-windows ms-4' />
            <i className='bi bi-apple ms-4' />
          </div>
        </div>
        <div className='d-flex justify-content-between align-items-center'>
          <p className='mb-3'>Device Control rules are not enforced. </p>
          <div>
            <i className='bi bi-windows ms-4' />
            <i className='bi bi-apple ms-4' />
          </div>
        </div>
        <div className='d-flex justify-content-between align-items-center'>
          <p className='mb-3'>Ranger is enabled.</p>
          <div>
            <i className='bi bi-windows ms-4' />
            <i className='bi bi-apple ms-4' />
          </div>
        </div>
        <div className='d-flex justify-content-between align-items-center'>
          <p className='mb-0'>Anti-Tamper is enabled and the Agent is protected.</p>
          <div>
            <i className='bi bi-windows ms-4' />
            <i className='bi bi-apple ms-4' />
          </div>
        </div>
        <div className='d-flex align-items-center mt-5'>
          <input
            type='checkbox'
            id='rebootCheckbox'
            checked={isRebootChecked}
            onChange={(e) => setIsRebootChecked(e.target.checked)}
            className='me-2'
          />
          <label htmlFor='rebootCheckbox' className='mb-0 ms-2'>
            Reboot <strong>Windows</strong> endpoints to completely enable the Agent Behavioral AI
            and Device Control are not enabled completely unless you reboot the Agent..
          </label>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={handleEnable}>
          Yes
        </Button>{' '}
        <Button variant='secondary' onClick={toggle}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EnableAgentModal
