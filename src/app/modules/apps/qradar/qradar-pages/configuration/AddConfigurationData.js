import React, {useState, useRef, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import {fetchAllMasterDataManageUrl, fetchConfigurationDataManageUrl, fetchLDPToolsUrl, fetchOrganizationsUrl} from '../../../../../api/ConfigurationApi'
import { notify, notifyFail } from '../components/notification/Notification'
import { ToastContainer } from 'react-toastify'

const AddConfigurationData = () => {
  const userID = Number(sessionStorage.getItem('userId'))
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const dataType = useRef()
  const dataName = useRef()
  const dataValue = useRef()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!dataType.current.value) {
      notifyFail('Enter Data Type')
      setLoading(false)
      return
    }
    if (!dataName.current.value) {
      notifyFail('Enter Data Name')
      setLoading(false)
      return
    }
    if (!dataValue.current.value) {
      notifyFail('Enter Data Value')
      setLoading(false)
      return
    }

    setLoading(true)

    const data = {
      dataID: 0,
      dataType: dataType.current.value,
      dataName: dataName.current.value,
      dataValue: dataValue.current.value,
      userId: userID,
      transactionDate: new Date().toISOString()
    }

    try {
      const responseData = await fetchConfigurationDataManageUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        setTimeout(() => {
          navigate('/qradar/configuration-data/list')
        }, 2000)
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='config card'>
      <ToastContainer />
      <div className='card-header bg-heading'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='white'>Add Configuration Data</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/configuration-data/list' className='white fs-15 text-underline'>
              <i className='fa fa-chevron-left white mg-right-5' />
              Back
            </Link>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='card-body pad-10'>
          <div className='row mb-4'>
            <div className='col-lg-4'>
              <label>Data Type</label>
              <input type='text' className='form-control' ref={dataType} />
            </div>

            <div className='col-lg-4'>
              <label>Data Name</label>
              <input type='text' className='form-control' ref={dataName} />
            </div>
            <div className='col-lg-4'>
              <label>Data Value</label>
              <input type='text' className='form-control' ref={dataValue} />
            </div>
          </div>
        </div>
        <div className='card-footer d-flex justify-content-end pad-10'>
          <button type='submit' className='btn btn-new btn-small' disabled={loading}>
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

export {AddConfigurationData}
