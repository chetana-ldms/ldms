import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';

const SiteType = ({setActiveStep}) => {
  const navigate = useNavigate();
  const [siteType, setSiteType] = useState('trial')
  const [selectedExpirationDate, setSelectedExpirationDate] = useState('')
  const [isNonExpireChecked, setIsNonExpireChecked] = useState(true)
  const [skuSelected, setSkuSelected] = useState(false)
  const [totalAgents, setTotalAgents] = useState('')
  const [isUnlimitedLicenses, setIsUnlimitedLicenses] = useState(false)
  const [isRoguesChecked, setIsRoguesChecked] = useState(false)

  const handleNext = (event) => {
    event.preventDefault()
    setActiveStep('site-policy')
  }
const handleBack = (event) =>{
  event.preventDefault()
  setActiveStep('site-name')
}
  const handleQuit = () => {
    navigate('/qradar/sites/list'); 
  }

  const handleExpirationDateChange = (event) => {
    setSelectedExpirationDate(event.target.value)
  }

  const handleNonExpireChange = (event) => {
    setIsNonExpireChecked(event.target.checked)
    if (event.target.checked) {
      setSelectedExpirationDate('') // Clear the date if Non-Expire is checked
    }
  }

  const handleSkuChange = (event) => {
    if (event.target.value === 'complete') {
      setSkuSelected(true)
    } else {
      setSkuSelected(false)
    }
  }

  const handleDeleteSku = () => {
    setSkuSelected(false)
  }

  const handleTotalAgentsChange = (event) => {
    setTotalAgents(event.target.value)
  }

  const handleUnlimitedLicensesChange = (event) => {
    setIsUnlimitedLicenses(event.target.checked)
  }

  const handleRoguesChange = (event) => {
    setIsRoguesChecked(event.target.checked)
  }

  return (
    <div className='config card'>
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
                        value='trial'
                        checked={siteType === 'trial'}
                        onChange={() => setSiteType('trial')}
                      />{' '}
                      Trial
                    </label>
                    <label>
                      <input
                        type='radio'
                        value='paid'
                        checked={siteType === 'paid'}
                        onChange={() => setSiteType('paid')}
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
                      value={selectedExpirationDate}
                      onChange={handleExpirationDateChange}
                      disabled={isNonExpireChecked}
                    />
                  </div>
                </div>
              </div>
              <div className='row justify-content-start mb-3'>
                <div className='col-md-12'>
                  <label>
                    <input
                      type='checkbox'
                      checked={isNonExpireChecked}
                      onChange={handleNonExpireChange}
                    />{' '}
                    Non-Expire
                  </label>
                </div>
              </div>

              {/* Add New SKU Dropdown */}
              <hr />
              {!skuSelected ? (
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
                      <div className='card-body'>
                        <strong>Surfaces</strong>
                        <div className='row'>
                          <div className='col-md-6 d-flex align-items-center'>
                            <label style={{width: '180px'}}>Total Agents</label>
                            <input
                              type='number'
                              className='form-control'
                              value={totalAgents}
                              onChange={handleTotalAgentsChange}
                            />
                          </div>
                          <div className='col-md-6 d-flex align-items-center'>
                            <label>
                              <input
                                type='checkbox'
                                checked={isUnlimitedLicenses}
                                onChange={handleUnlimitedLicensesChange}
                              />{' '}
                              Unlimited licenses
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className='card-body'>
                        <strong>Add-ons</strong>
                        <div className='row'>
                          <div className='col-md-6 d-flex align-items-center mt-4'>
                            <label>
                              <input
                                type='checkbox'
                                checked={isRoguesChecked}
                                onChange={handleRoguesChange}
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
            </div>

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
          </form>
        </div>
      </div>
    </div>
  )
}

export default SiteType
