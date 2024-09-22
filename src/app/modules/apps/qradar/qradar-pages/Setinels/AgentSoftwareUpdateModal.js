import React, {useEffect, useState} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {fetchSoftwarePackagesUrl} from '../../../../../api/SettingsApi'
import { fetchSoftwarePackagesUpdateUrl } from '../../../../../api/SentinalApi'
import { notify, notifyFail } from '../components/notification/Notification'

const AgentSoftwareUpdateModal = ({isOpen, toggle, items, selectedActionId, refreshData}) => {
  console.log(items, "items")
  const [updateTiming, setUpdateTiming] = useState('Immediately')
  const [selectedUpdate, setSelectedUpdate] = useState(null)
  const [filterValue, setFilterValue] = useState('')
  const [platform, setPlatform] = useState('windows')
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const [updates, setUpdates] = useState([])
  const [showDowngrade, setShowDowngrade] = useState(false)
  const [allowDowngrade, setAllowDowngrade] = useState(false)
  const osTypes = items && items.length > 0 
  ? [...new Set(items.map((item) => item?.osType?.toLowerCase() || 'windows'))] 
  : ['windows'];

  const sendSelectedItemsToBackend = async () => {
    const endPointsData = items.map((item) => ({
      agentIds: item.id,
      accountIds: item.accountId,
      groupIds: item.groupId,
      siteIds: item.siteId,
      agentName:item.computerName || item.endpointName
    }))

    const payload = {
      orgId,
      toolId,
      actionId: selectedActionId,
      endPointsData,
      data: {
        packageId: selectedUpdate?.id || 0,
        allowDowngrade: allowDowngrade,
        fileName: selectedUpdate?.fileName || '',
        isScheduled: updateTiming === 'According to Maintenance Window',
        packageType: selectedUpdate?.packageType,
        osType: selectedUpdate?.osType,
      },
      modifiedDate: new Date().toISOString(),
      modifiedUserId:Number(sessionStorage.getItem('userId')) ,
    }
    console.log(payload,  "payload")
    try {
      const response = await fetchSoftwarePackagesUpdateUrl(payload)
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
  const handleSave = () => {
    sendSelectedItemsToBackend()
  }

  const handleRadioChange = (event) => {
    setUpdateTiming(event.target.value)
  }

  const handleUpdateSelect = (update) => {
    setSelectedUpdate(update)
    setShowDowngrade(true)
  }

  const handlePlatformChange = (event) => {
    setPlatform(event.target.value)
  }
  const handleDowngradeChange = (event) => {
    setAllowDowngrade(event.target.checked);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          orgId: orgId,
          toolId: toolId,
          plattformType: platform,
        }
        const response = await fetchSoftwarePackagesUrl(data)
        setUpdates(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [platform])
  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
  }
  const filteredList = filterValue
  ? updates.filter((item) =>
      item.searchData.toLowerCase().includes(filterValue.toLowerCase())
    )
  : updates
  return (
    <Modal show={isOpen} onHide={toggle} className='AgentSoftwareUpdateModal application-modal'>
      <Modal.Header closeButton>
        <Modal.Title>Update Agent {items && items.length > 0 && `(${items[0]?.computerName || items[0]?.endpointName})`}</Modal.Title>
        <button type='button' className='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body className='py-0 my-0 pt-2'>
        <div className='row mb-6 table-filter'>
          <div className='col-lg-4 mb-4 mb-lg-0'>
            <div className='fv-row mb-0'>
              <label htmlFor='toolID' className='form-label fs-6 fw-bolder mb-3'>
                Platform
              </label>
              <select
                className='form-select form-select-solid'
                data-kt-select2='true'
                data-placeholder='Select option'
                data-allow-clear='true'
                value={platform}
                onChange={handlePlatformChange}
              >
                {osTypes?.map((osType, index) => (
                  <option key={index} value={osType}>
                    {osType?.charAt(0).toUpperCase() + osType?.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <h6>Update Timing</h6>
        <div className='d-flex mt-3'>
          <div className='me-5'>
            <input
              type='radio'
              id='immediately'
              name='updateTiming'
              value='Immediately'
              checked={updateTiming === 'Immediately'}
              onChange={handleRadioChange}
              className='me-3'
            />
            <label htmlFor='immediately'>Immediately</label>
          </div>
          <div className='ms-5'>
            <input
              type='radio'
              id='maintenance-window'
              name='updateTiming'
              value='According to Maintenance Window'
              checked={updateTiming === 'According to Maintenance Window'}
              onChange={handleRadioChange}
              className='me-3'
            />
            <label htmlFor='maintenance-window'>According to Maintenance Window</label>
          </div>
        </div>
        <div className=''>
              <input
                type='text'
                placeholder='Search...'
                className='form-control'
                value={filterValue}
                onChange={handleFilterChange}
              />
            </div>
        <ul className='list-unstyled mt-4' style={{maxHeight: '270px', overflowY: 'auto'}}>
          {filteredList?.map((update) => (
            <li key={update.id} className='d-flex align-items-center border-top border-1'>
               <input
                type='radio'
                id={`update-${update.id}`}
                name='softwareUpdate'
                value={update.id}
                onChange={() => handleUpdateSelect(update)} // Pass the full update object
                checked={selectedUpdate?.id === update.id}
                className='me-3'
              />
              <label htmlFor={`update-${update.id}`} className='pt-3' style={{width: '95%'}}>
                <div className='row'>
                  <div className='col-md-1'>
                    <div
                      style={{
                        borderRadius: '50%',
                        backgroundColor: 'red',
                        padding: '8px',
                        textAlign: 'center',
                        color: 'white',
                      }}
                    >
                      {update.minorVersion}
                    </div>
                  </div>
                  <div className='col-md-11'>
                    <h6>
                      {update.majorVersion} {update.minorVersion} ({update.version})
                    </h6>
                    <div className='d-flex fs-12'>
                      {' '}
                      File Size: {(update.fileSize / 1048576).toFixed(2)} MB | Extension :{' '}
                      {update.fileExtension} | Name : {update.fileName}{' '}
                    </div>
                  </div>
                </div>
              </label>
            </li>
          ))}
        </ul>
        {showDowngrade && (
          <>
            <h6>Downgrade</h6>
            <div className='mt-4'>
              <input
                type='checkbox'
                id='downgrade'
                name='downgrade'
                className='me-2'
                onChange={handleDowngradeChange}
              />
              <label htmlFor='downgrade'>Allow Downgrade</label>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className='m-0 p-2'>
        <Button variant='secondary' onClick={toggle}>
          Close
        </Button>
        <Button variant='primary' onClick={handleSave} disabled={!selectedUpdate}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AgentSoftwareUpdateModal
