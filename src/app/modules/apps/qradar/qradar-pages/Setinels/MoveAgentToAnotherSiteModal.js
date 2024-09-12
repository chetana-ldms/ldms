import React, {useEffect, useRef, useState} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {fetchAccountDetailsUrl} from '../../../../../api/SentinalApi'
import {fetchSitesUrl} from '../../../../../api/SettingsApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {fetchAccountsStructureUrl, fetchAgentActionUrl} from '../../../../../api/Api'

const MoveAgentToAnotherSiteModal = ({show, handleClose, items, selectedActionId, refreshData}) => {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const [accountId, setAccountId] = useState('')
  const [siteId, setSiteId] = useState('')
  const [accounts, setAccounts] = useState([])
  const [sites, setSites] = useState([])
  const siteRef = useRef()

  const handleToolChange = (e) => {
    const newAccountId = e.target.value
    setAccountId(newAccountId)
  }

  const fetchAccounts = async () => {
    try {
      const data = {
        orgId: orgId,
      }
      const response = await fetchAccountDetailsUrl(data)
      setAccounts(response)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchSites = async () => {
    if (!accountId) return
    try {
      const data = {
        orgId: orgId,
        accountId: String(accountId),
      }
      const response = await fetchSitesUrl(data)
      setSites(response.sites)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchSites()
  }, [accountId])
  const fetchDataAccount = async () => {
    const data = {
      orgID: orgId,
      testFlag: true
    };
    try {
      const response = await fetchAccountsStructureUrl(data);
      // setAccountsStructure(response);
    } catch (error) {
      console.error(error);
    } 
  };

  const handleChange = (event) => {
    setSiteId(event.target.value)
  }

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
      moveToTargetSiteId: siteId,
      executedUserId: Number(sessionStorage.getItem('userId')),
      executedDate: new Date().toISOString(),
    }
    try {
      const response = await fetchAgentActionUrl(payload)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        handleClose()
        refreshData()
        fetchDataAccount()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleSubmit = () => {
    sendSelectedItemsToBackend()
    window.location.reload();
  }

  const handleCloseWithReset = () => {
    setSiteId('')
    handleClose()
  }

  return (
    <Modal
      show={show}
      onHide={handleCloseWithReset}
      className='application-modal small-modal border-0'
    >
      <Modal.Header closeButton>
        <Modal.Title>Move Agent to Another Site {items && items.length > 0 && `(${items[0]?.computerName || items[0]?.endpointName})`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='mb-2 header-filter'>
          <label htmlFor='Tools' className='form-label fs-6 fw-bolder w-70px mt-3'>
            Accounts :
          </label>
          <select
            className='form-select form-select-solid bg-blue-light'
            data-kt-select2='true'
            data-placeholder='Select option'
            data-allow-clear='true'
            onChange={handleToolChange}
          >
            <option value=''>Select</option>
            {accounts?.map((item, index) => (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-2 header-filter'>
          <label htmlFor='sites' className='form-label fs-6 fw-bolder w-70px mt-3'>
            Sites :
          </label>
          <select
            className='form-select form-select-solid bg-blue-light'
            data-kt-select2='true'
            data-placeholder='Select option'
            data-allow-clear='true'
            ref={siteRef}
            onChange={handleChange}
            value={siteId}
          >
            <option value=''>Select</option>
            {sites?.map((item, index) => (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleCloseWithReset} className='btn-small'>
          Close
        </Button>
        <Button variant='primary' onClick={handleSubmit} className='btn-new btn-small'>
          Move
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MoveAgentToAnotherSiteModal
