import React, {useState, useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {notify, notifyFail} from '../components/notification/Notification'
import {fetchOrganizationAddUrl} from '../../../../../api/ConfigurationApi'
import {useErrorBoundary} from 'react-error-boundary'
import {ToastContainer} from 'react-toastify'

const AddOrganizations = () => {
  const handleError = useErrorBoundary()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const orgName = useRef()
  const address = useRef()
  const mobileNo = useRef()
  const email = useRef()
  const errors = {}

  const handleSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)
    const mobileValue = mobileNo.current.value
    const mobileRegex = /^[0-9]{10,15}$/

    if (!mobileRegex.test(mobileValue)) {
      notifyFail(
        'Mobile number must contain only numeric characters and be between 10 and 15 digits long.'
      )
      setLoading(false)
      return
    }
    const emailValue = email.current.value
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(emailValue)) {
      notifyFail('Enter a valid Email')
      setLoading(false)
      return
    }

    if (!orgName.current.value) {
      notifyFail('Enter Organization Name')
      setLoading(false)
      return
    }

    if (!address.current.value) {
      notifyFail('Enter Organization Address')
      setLoading(false)
      return
    }

    const createdUserId = Number(sessionStorage.getItem('userId'))
    const createdDate = new Date().toISOString()

    const data = {
      orgName: orgName.current.value,
      address: address.current.value,
      mobileNo: mobileValue,
      email: email.current.value,
      createdUserId,
      createdDate,
    }

    try {
      const responseData = await fetchOrganizationAddUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        setTimeout(() => {
          navigate('/qradar/organizations/updated')
        }, 2000)
      } else {
        notifyFail(message)
      }
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='config card'>
      <ToastContainer />
      <div className='card-header bg-heading'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='white'>Add New Organization</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/organizations/list' className='white fs-15 text-underline'>
              <i className='fa fa-chevron-left white mg-right-5' />
              Back
            </Link>
          </div>
        </div>
      </div>
      <form>
        <div className='card-body pad-10 mt-5'>
          <div className='row mb-6 table-filter'>
            <div className='col-lg-6 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='orgName' className='form-label fs-6 fw-bolder mb-3'>
                  Organization Name
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  required
                  maxLength={50}
                  id='orgName'
                  ref={orgName}
                  placeholder='Ex: lancesoft'
                />
              </div>
            </div>
            <div className='col-lg-6 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='mobileNo' className='form-label fs-6 fw-bolder mb-3'>
                  Organization Mobile
                </label>
                <input
                  type='tel'
                  required
                  className='form-control form-control-lg form-control-solid'
                  id='mobileNo'
                  ref={mobileNo}
                  placeholder='Ex: 01 0102030405'
                  minLength={10}
                  maxLength={15}
                  pattern='^[0-9]{10,15}$'
                  title='Phone number must be between 10 and 15 digits.'
                />
              </div>
            </div>

            <div className='col-lg-6 mb-4 mt-5 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='email' className='form-label fs-6 fw-bolder mb-3'>
                  Organization Email
                </label>
                <input
                  type='email'
                  className='form-control form-control-lg form-control-solid'
                  id='email'
                  ref={email}
                  placeholder='email@organization.com'
                  required
                  pattern='^[^\s@]+@[^\s@]+\.[^\s@]+$'
                  title='Please enter a valid email address'
                />
              </div>
            </div>
            <div className='col-lg-6 mb-4 mb-lg-0 mt-5'>
              <div className='fv-row mb-0'>
                <label htmlFor='address' className='form-label fs-6 fw-bolder mb-3'>
                  Organization Address
                </label>
                <input
                  type='text'
                  required
                  className='form-control form-control-lg form-control-solid'
                  id='address'
                  ref={address}
                  placeholder='Address : '
                />
              </div>
            </div>
          </div>
        </div>

        <div className='card-footer d-flex justify-content-end pad-10'>
          <button
            type='submit'
            onClick={handleSubmit}
            className='btn btn-new btn-small'
            disabled={loading}
          >
            {!loading && 'Save Changes'}
            {loading && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export {AddOrganizations}
