import React, {useState, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {ToastContainer} from 'react-toastify'
import {notify, notifyFail} from '../components/notification/Notification'
import {fetchSitesUpdateUrl} from '../../../../../api/SettingsApi'

function UpdateSiteMoreModel({show, handleClose, items, selectedActionId, refreshData}) {
  console.log(items, 'items')
  const [siteTypeData, setSiteTypeData] = useState({
    siteType: '',
    selectedExpirationDate: '',
    isNonExpireChecked: false,
    skuSelected: false,
    totalAgents: '0',
    isUnlimitedLicenses: false,
    siteId: '',
  })

  const [siteNameData, setSiteNameData] = useState({
    siteName: '',
    siteDescription: '',
  })

  const accountId = sessionStorage.getItem('accountId')

  const handleNext = async (event) => {
    event.preventDefault()

    const expirationDate = siteTypeData?.selectedExpirationDate
      ? new Date(siteTypeData.selectedExpirationDate).toISOString()
      : null

    const data = {
      expiration: expirationDate,
      unlimitedExpiration: siteTypeData?.isNonExpireChecked,
      unlimitedLicenses: siteTypeData?.isUnlimitedLicenses,
      inherits: true,
      name: items.map(item => item.name).join(', '),
      siteType: siteTypeData?.siteType,
      accountId: accountId,
      description: siteNameData?.siteDescription,
      totalLicenses: siteTypeData.isUnlimitedLicenses ? '0' : siteTypeData?.totalAgents,
      orgId: Number(sessionStorage.getItem('orgId')),
      toolId: Number(sessionStorage.getItem('toolID')),
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
      siteIds: items.map(item => item.id),
    }

    try {
      const responseData = await fetchSitesUpdateUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        refreshData()
        handleClose()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleExpirationDateChange = (event) => {
    setSiteTypeData({...siteTypeData, selectedExpirationDate: event.target.value})
  }

  const handleNonExpireChange = (event) => {
    const isChecked = event.target.checked

    setSiteTypeData((prevState) => ({
      ...prevState,
      isNonExpireChecked: isChecked,
      selectedExpirationDate: isChecked ? '' : prevState.selectedExpirationDate,
    }))
  }

  const handleSkuChange = (event) => {
    if (event.target.value === 'complete') {
      setSiteTypeData({...siteTypeData, skuSelected: true})
    } else {
      setSiteTypeData({...siteTypeData, skuSelected: false})
    }
  }

  const handleDeleteSku = () => {
    setSiteTypeData({...siteTypeData, skuSelected: false})
  }

  const handleTotalAgentsChange = (event) => {
    setSiteTypeData({...siteTypeData, totalAgents: event.target.value})
  }

  const handleUnlimitedLicensesChange = (event) => {
    setSiteTypeData({...siteTypeData, isUnlimitedLicenses: event.target.checked})
  }

  const handleRoguesChange = (event) => {
    setSiteTypeData({...siteTypeData, isRoguesChecked: event.target.checked})
  }

  const handleSiteNameChange = (event) => {
    setSiteNameData({...siteNameData, siteName: event.target.value})
  }

  const handleSiteDescriptionChange = (event) => {
    setSiteNameData({...siteNameData, siteDescription: event.target.value})
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} className='application-modal'>
        <Modal.Header closeButton>
            <Modal.Title>
              Update Site - {items.length} ({items.map((item) => item.name).join(', ')})
            </Modal.Title>
          <button type='button' className='application-modal-close' aria-label='Close'>
            <i className='fa fa-close' />
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className='config card'>
            {/* <ToastContainer /> */}
            <div>
              <form>
                <div className='form-group'>
                  <div className='row mb-3'>
                    <div className='col-md-6'>
                      <label className='form-label fs-6 fw-bolder d-flex justify-content-start'>
                        Site Name *
                      </label>
                      <input
                        type='text'
                        className='form-control form-control-lg'
                        required
                        maxLength={200}
                        placeholder='Enter Site Name...'
                        value={siteNameData.siteName}
                        onChange={handleSiteNameChange}
                        disabled
                      />
                    </div>
                  </div>
                  <div className='row mb-3'>
                    <div className='col-md-6'>
                      <label className='form-label fs-6 fw-bolder d-flex justify-content-start'>
                        Site Description
                      </label>
                      <textarea
                      className='p-2'
                        placeholder='Enter Site Description...'
                        maxLength={500}
                        rows={2}
                        style={{width: '100%'}}
                        value={siteNameData.siteDescription}
                        onChange={handleSiteDescriptionChange}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div>
              <form>
                <div className='form-group'>
                  <div className='row justify-content-start'>
                    <div className='col-md-12'>
                      <label className='form-label fs-6 fw-bolder d-flex justify-content-start'>
                        Site Type
                      </label>
                      <div>
                        <label className='me-3'>
                          <input
                            type='radio'
                            value='Trial'
                            checked={siteTypeData.siteType === 'Trial'}
                            onChange={() => setSiteTypeData({...siteTypeData, siteType: 'Trial'})}
                          />{' '}
                          Trial
                        </label>
                        <label>
                          <input
                            type='radio'
                            value='Paid'
                            checked={siteTypeData.siteType === 'Paid'}
                            onChange={() => setSiteTypeData({...siteTypeData, siteType: 'Paid'})}
                          />{' '}
                          Paid
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className='row justify-content-start mb-3'>
                    <div className='col-md-12'>
                      <label>Expiration Date: </label>
                      <input
                        className='date'
                        type='date'
                        value={siteTypeData.selectedExpirationDate}
                        onChange={handleExpirationDateChange}
                        disabled={siteTypeData.isNonExpireChecked}
                      />
                    </div>
                  </div>

                  <div className='row justify-content-start mb-3'>
                    <div className='col-md-12'>
                      <label>
                        <input
                          type='checkbox'
                          checked={siteTypeData.isNonExpireChecked}
                          onChange={handleNonExpireChange}
                        />{' '}
                        Non-Expire
                      </label>
                    </div>
                  </div>

                  {!siteTypeData.skuSelected ? (
                    <div className='row justify-content-start mb-3'>
                      <div className='col-md-12 disabled'>
                        <select className='form-control ' onChange={handleSkuChange} disabled>
                          <option value=''>Select SKU</option>
                          <option value='complete '>Complete</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className='row justify-content-start mb-3'>
                      <div className='col-md-12'>
                        <p> Packages *</p>
                        <div className='card'>
                          <div className='card-header d-flex justify-content-between align-items-center'>
                            <strong>Complete</strong>
                            <button type='button' className='btn btn-sm' onClick={handleDeleteSku}>
                              <i className='bi bi-trash'></i>
                            </button>
                          </div>
                          <div className='card-body p-0 m-0'>
                            <strong className='mt-2'>Surfaces</strong>
                            <div className='row mt-4 mb-3'>
                              <div className='col-md-4'>
                                <label>
                                  Total Agents{' '}
                                  <input
                                    type='text'
                                    className='form-control'
                                    value={
                                      siteTypeData.isUnlimitedLicenses
                                        ? ''
                                        : siteTypeData.totalAgents
                                    }
                                    onChange={handleTotalAgentsChange}
                                    disabled={siteTypeData.isUnlimitedLicenses}
                                  />
                                </label>
                              </div>
                              <div className='col-md-8 mt-4'>
                                <div className='ms-5 mt-5'>
                                  <input
                                    className='form-check-input widget-13-check'
                                    type='checkbox'
                                    checked={siteTypeData.isUnlimitedLicenses}
                                    onChange={handleUnlimitedLicensesChange}
                                  />{' '}
                                  <label className='ms-5'>Unlimited licenses</label>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className='card-body p-0 m-0' style={{display: 'none'}}>
                            <strong>Add-ons</strong>
                            <div className='row'>
                              <div className='col-md-6 d-flex align-items-center mt-4'>
                                <label>
                                  <input
                                    type='checkbox'
                                    checked={siteTypeData.isRoguesChecked}
                                    onChange={handleRoguesChange}
                                    className='disabled'
                                  />{' '}
                                  Rogues{' '}
                                </label>
                              </div>
                            </div>
                            <div className='mt-4 bg-light p-2'>
                              <i className='fa fa-circle-exclamation' /> Platform Settings are
                              inherited from Account
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='primary' onClick={handleNext}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default UpdateSiteMoreModel
