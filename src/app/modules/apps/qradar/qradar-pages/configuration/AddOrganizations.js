import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { notify, notifyFail } from '../components/notification/Notification';
import axios from 'axios'
import { async } from 'q';
import { fetchOrganizationAddUrl } from '../../../../../api/ConfigurationApi';

const AddOrganizations = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const orgName = useRef()
  const address = useRef()
  const mobileNo = useRef()
  const email = useRef()
  const errors = {}

  const handleSubmit = async (event) => {
    setLoading(true)

    if (!orgName.current.value) {
      errors.orgName = 'Enter Organization Name'
      setLoading(false)
      return errors
    }
    if (!mobileNo.current.value) {
      errors.mobileNo = 'Enter Organization Mobile No.'
      setLoading(false)
      return errors
    }
    if (!email.current.value) {
      errors.email = 'Enter Organization Mobile No.'
      setLoading(false)
      return errors
    }
    if (!address.current.value) {
      errors.address = 'Enter Organization Mobile No.'
      setLoading(false)
      return errors
    }

    event.preventDefault()
    const createdUserId = Number(sessionStorage.getItem('userId'));
    const createdDate = new Date().toISOString();
    var data = {
      orgName: orgName.current.value,
      address: address.current.value,
      mobileNo: mobileNo.current.value,
      email: email.current.value,
      createdUserId,
      createdDate,
    }
    try {
      const responseData = await fetchOrganizationAddUrl(data);
      const { isSuccess } = responseData;

      if (isSuccess) {
        notify('Data Saved');
        navigate('/qradar/organizations/updated');
      } else {
        notifyFail('Failed to save data');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='card'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Add New Organization</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/organizations/list' className='btn btn-primary btn-small'>
              Back
            </Link>
          </div>
        </div>
      </div>
      <form>
        <div className='card-body border-top p-9'>
          <div className='row mb-6'>
            <div className='col-lg-6 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='orgName' className='form-label fs-6 fw-bolder mb-3'>
                  Organization Name
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  required
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
                  pattern='[0-9]'
                  required
                  className='form-control form-control-lg form-control-solid'
                  id='mobileNo'
                  ref={mobileNo}
                  placeholder='Ex: 01 0102030405'
                />
              </div>
            </div>
            <div className='col-lg-6 mb-4 mb-lg-0'>
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
                />
              </div>
            </div>
            <div className='col-lg-6 mb-4 mb-lg-0'>
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

        <div className='card-footer d-flex justify-content-end py-6 px-9'>
          <button
            type='submit'
            onClick={handleSubmit}
            className='btn btn-primary'
            disabled={loading}
          >
            {!loading && 'Save Changes'}
            {loading && (
              <span className='indicator-progress' style={{ display: 'block' }}>
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

export { AddOrganizations }
