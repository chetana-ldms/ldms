import React, {useEffect, useRef, useState} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {fetchAgentActionUrl} from '../../../../../api/Api'
import {notify, notifyFail} from '../components/notification/Notification'

const DisableAgentModal = ({isOpen, toggle, items, selectedActionId, refreshData}) => {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const [isExpirationChecked, setIsExpirationChecked] = useState(true)
  const [isRebootChecked, setIsRebootChecked] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [expirationTime, setExpirationTime] = useState(null)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const actionTypes = ['1', '3', '6', '12', '24']

  const calculateExpirationTime = (hours) => {
    const expirationDate = new Date()
    expirationDate.setHours(expirationDate.getHours() + hours)
    return expirationDate.toISOString()
  }

  const sendSelectedItemsToBackend = async () => {
    const endPointsData = items.map((item) => ({
      agentIds: item.id,
      accountIds: item.accountId,
      groupIds: item.groupId,
      siteIds: item.siteId,
    }))

    let expirationTime = ''
    if (isExpirationChecked && inputValue) {
      const hours = parseInt(inputValue, 10)
      if (!isNaN(hours)) {
        expirationTime = calculateExpirationTime(hours)
        setExpirationTime(expirationTime)
      }
    }

    const payload = {
      orgId,
      toolId,
      agentActionId: selectedActionId,
      endPointsData,
      disableAgent: {
        expiration: expirationTime,
        expirationTimeZone: 'GMT+00:00',
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

  const handleDisable = () => {
    if (isExpirationChecked && (!inputValue || isNaN(parseInt(inputValue, 10)))) {
      notifyFail('Please select a valid expiration time in hours.')
      return
    }
    sendSelectedItemsToBackend()
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    setShowDropdown(true)
  }

  const handleInputFocus = () => {
    setShowDropdown(true)
  }

  const handleOptionClick = (value) => {
    setInputValue(value)
    setShowDropdown(false)
  }

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !inputRef.current.contains(event.target)
    ) {
      setShowDropdown(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <Modal show={isOpen} onHide={toggle} className='DisableAgentModal application-modal'>
      <Modal.Header closeButton>
        <Modal.Title>
          Disable Agent{' '}
          {items && items.length > 0 && `(${items[0]?.computerName || items[0]?.endpointName})`}
        </Modal.Title>
        <button type='button' className='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        <h4 className='mb-5'>Are you sure you want to disable the selected agent(s)?</h4>
        <div className='d-flex justify-content-between align-items-center'>
          <p className='mt-5 mb-3'>
            All detection engines are disabled <i className='bi bi-exclamation-circle' />
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
          <p className='mb-3'>Ranger is disabled.</p>
          <div>
            <i className='bi bi-windows ms-4' />
            <i className='bi bi-apple ms-4' />
          </div>
        </div>
        <div className='d-flex justify-content-between align-items-center'>
          <p className='mb-0'>Anti-Tamper is disabled and the Agent is not protected.</p>
          <div>
            <i className='bi bi-windows ms-4' />
            <i className='bi bi-apple ms-4' />
          </div>
        </div>
        <div className='d-flex justify-content-between align-items-center mt-5'>
          <div className='d-flex align-items-center'>
            <input
              type='checkbox'
              id='expirationCheckbox'
              checked={isExpirationChecked}
              onChange={(e) => setIsExpirationChecked(e.target.checked)}
            />
            <label htmlFor='expirationCheckbox' className='mb-0 ms-2'>
              Set expiration time for this action
            </label>
          </div>
          <div className='position-relative ms-3' ref={dropdownRef}>
            <input
              type='text'
              className='form-control bg-transparent'
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder='Enter or select in Hours'
              ref={inputRef}
              disabled={!isExpirationChecked}
            />
            {showDropdown && isExpirationChecked && (
              <div
                className='dropdown-menu show w-100'
                style={{maxHeight: '150px', overflowY: 'auto'}}
              >
                {actionTypes.map((item, index) => (
                  <div
                    key={index}
                    className='dropdown-item'
                    onClick={() => handleOptionClick(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>{expirationTime ? `Expiration Time (UTC): ${expirationTime}` : null}</div>
        <div className='d-flex align-items-center mt-3'>
          <input
            type='checkbox'
            id='rebootCheckbox'
            checked={isRebootChecked}
            onChange={(e) => setIsRebootChecked(e.target.checked)}
          />
          <label htmlFor='rebootCheckbox' className='mb-0 ms-2'>
            Reboot <strong>Windows</strong> endpoints to completely disable the Agent. Behavioral AI
            and Device Control are not disabled completely unless you reboot the Agent.
          </label>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={handleDisable}>
          Yes
        </Button>{' '}
        <Button variant='secondary' onClick={toggle}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DisableAgentModal
