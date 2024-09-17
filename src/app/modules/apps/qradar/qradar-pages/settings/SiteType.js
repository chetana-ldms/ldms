import React from 'react'
import {useNavigate} from 'react-router-dom'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import { fetchSitesCreateUrl } from '../../../../../api/SettingsApi'

const SiteType = ({setActiveStep, siteTypeData, setSiteTypeData, siteNameData}) => {
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const navigate = useNavigate()

  const handleNext = async (event) => {
    event.preventDefault()
    if (!siteTypeData.skuSelected) {
      notifyFail('Please select a SKU')
      return
    }
    
    // setActiveStep('site-policy')
    const expirationDate = siteTypeData?.selectedExpirationDate
    ? new Date(siteTypeData.selectedExpirationDate).toISOString()
    : null

    const data = {
      expiration: expirationDate,
      unlimitedExpiration: siteTypeData?.isNonExpireChecked,
      unlimitedLicenses: siteTypeData?.isUnlimitedLicenses,
      inherits: true,
      name: siteNameData?.siteName,
      siteType: siteTypeData?.siteType,
      accountId: accountId,
      description: siteNameData?.siteDescription,
      totalLicenses: siteTypeData?.totalAgents,
      orgId : Number(sessionStorage.getItem('orgId')),
      toolId : Number(sessionStorage.getItem('toolID')),
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
      siteId: siteId
    }
    console.log(siteTypeData, "siteTypeData")
    console.log(siteNameData, "siteNameData")

    try {
      const responseData = await fetchSitesCreateUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        setTimeout(() => {
          navigate('/qradar/sites/list')
        }, 2000)
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    } 
  }

  const handleBack = (event) => {
    event.preventDefault()
    setActiveStep('site-name')
  }

  const handleQuit = () => {
    navigate('/qradar/sites/list')
  }

  const handleExpirationDateChange = (event) => {
    setSiteTypeData({...siteTypeData, selectedExpirationDate: event.target.value})
  }

  const handleNonExpireChange = (event) => {
    setSiteTypeData({...siteTypeData, isNonExpireChecked: event.target.checked})
    if (event.target.checked) {
      setSiteTypeData({...siteTypeData, selectedExpirationDate: ''}) 
    }
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

  return (
    <div className='config card'>
      <ToastContainer />
      <div className='row'>
        <div className='col-md-2'></div>
        <div className='col-md-10'>
          <h2>Site Properties</h2>
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
                  <div className='ps-2'>
                    <div>
                      <label className='no-margin pr-2 semi-bold'>Expiration Date: </label>
                    </div>
                    <input
                      className='date'
                      type='date'
                      value={siteTypeData.selectedExpirationDate}
                      onChange={handleExpirationDateChange}
                      disabled={siteTypeData.isNonExpireChecked}
                    />
                  </div>
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

              {/* Add New SKU Dropdown */}
              <hr />
              {!siteTypeData.skuSelected ? (
                <div className='row justify-content-start mb-3'>
                  <div className='col-md-12'>
                    <select className='form-control' onChange={handleSkuChange}>
                      <option value=''>Select SKU</option>
                      <option value='complete'>Complete</option>
                      {/* Add more options as needed */}
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
                          <i className='bi bi-trash'></i> {/* Bootstrap trash icon */}
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
                                value={siteTypeData.totalAgents}
                                onChange={handleTotalAgentsChange}
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
                              <label className='ms-5'>
                              Unlimited licenses
                            </label>
                            </div>
                              
                          </div>
                        </div>
                      </div>
                      <div className='card-body p-0 m-0'>
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
                              <i
                                className='fa fa-circle-exclamation'
                                title='This feature is not available in this scope because it requires a feature or in the parent scope that is not available'
                              />
                            </label>
                          </div>
                        </div>
                        <div className='mt-4 bg-light p-2'>
                          <i className='fa fa-circle-exclamation' /> Platform Setting are inherited
                          from Account
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className='row card-footer pad-10'>
                <div className='col-md-6'>
                  <button type='button' onClick={handleBack} className='btn btn-new btn-small'>
                    Back
                  </button>
                </div>
                <div className='col-md-6 d-flex justify-content-end'>
                  <button type='submit' onClick={handleNext} className='btn btn-new btn-small'>
                    Next
                  </button>
                  <button
                    type='button'
                    onClick={handleQuit}
                    className='btn btn-secondary btn-small ms-3'
                  >
                    Quit
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SiteType
