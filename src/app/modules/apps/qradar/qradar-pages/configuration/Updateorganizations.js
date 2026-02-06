import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { fetchOrganizationDetails } from '../../../../../api/Api'
import { fetchOrganizationUpdateUrl } from '../../../../../api/ConfigurationApi'
import { notify, notifyFail } from '../components/notification/Notification'
import { useErrorBoundary } from 'react-error-boundary'
import { ToastContainer } from 'react-toastify'
import ConfirmPopup from '../../../../../../utils/ConfirmPopup'

const UpdateOrganizations = () => {
  const handleError = useErrorBoundary()
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()

  const [save, setSave] = useState(location.state?.save || '')
  const [loading, setLoading] = useState(false)
  const [organizationData, setOrganizationData] = useState(null)

  // Confirmation popup state
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState('')
  const [confirmCallback, setConfirmCallback] = useState(() => {})

  // Form refs
  const orgName = useRef()
  const address = useRef()
  const mobileNo = useRef()
  const email = useRef()

  // Store initial data for change detection
  const initialData = useRef({
    orgName: '',
    address: '',
    mobileNo: '',
    email: '',
  })

  useEffect(() => {
    setSave(location.state?.save || '')
  }, [location.state])

  // Fetch organization details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOrganizationDetails(id, orgName, address, mobileNo, email)
        setOrganizationData(data)
        if (data) {
          initialData.current = {
            orgName: data.orgName || '',
            address: data.address || '',
            mobileNo: data.mobileNo || '',
            email: data.email || '',
          }
        }
      } catch (error) {
        handleError(error)
      }
    }
    fetchData()
  }, [id, handleError])

  // Check if any changes are made
  const isChanged = () => {
    return (
      orgName.current.value !== initialData.current.orgName ||
      address.current.value !== initialData.current.address ||
      mobileNo.current.value !== initialData.current.mobileNo ||
      email.current.value !== initialData.current.email
    )
  }

  // Handle actual submit
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    if (!orgName.current.value) {
      notifyFail('Enter Organization Name')
      setLoading(false)
      return
    }
    if (!address.current.value) {
      notifyFail('Enter Address')
      setLoading(false)
      return
    }

    const mobileValue = mobileNo.current.value
    const mobileRegex = /^[0-9]{10,15}$/
    if (!mobileRegex.test(mobileValue)) {
      notifyFail(
        'Phone number must contain only numeric characters and be between 10 and 15 digits long.'
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

    const updatedUserId = Number(sessionStorage.getItem('userId'))
    const updatedDate = new Date().toISOString()

    const data = {
      orgName: orgName.current.value,
      address: address.current.value,
      mobileNo: mobileNo.current.value,
      orgID: id,
      email: email.current.value,
      updatedUserId,
      updatedDate,
    }

    try {
      const responseData = await fetchOrganizationUpdateUrl(data)
      const { isSuccess, message } = responseData
      if (isSuccess) {
        notify(message)
        setTimeout(() => navigate('/qradar/organizations/updated'), 2000)
      } else {
        notifyFail(message)
      }
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  // Save button click
  const handleSaveClick = (event) => {
    event.preventDefault()
    if (!isChanged()) {
      setConfirmMessage('No changes detected. Do you still want to save?')
      setConfirmCallback(() => handleSubmit)
      setShowConfirm(true)
    } else {
      handleSubmit(event)
    }
  }

  // Back / Close click
  const handleCloseClick = (e) => {
    if (isChanged()) {
      e.preventDefault()
      setConfirmMessage('You have unsaved changes. Do you want to leave without saving?')
      setConfirmCallback(() => () => navigate('/qradar/organizations/list'))
      setShowConfirm(true)
    } else {
      navigate('/qradar/organizations/list')
    }
  }

  return (
    <div className="config card">
      <ToastContainer />
      <div className="card-header bg-heading">
        <h3 className="card-title align-items-start flex-column">
          {save ? <span className="white">View Organization</span> : <span className="white">Update Organization</span>}
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <Link to="#" className="white fs-15" onClick={handleCloseClick}>
              <i className="fa fa-chevron-left white mg-right-5" />
              Back
            </Link>
          </div>
        </div>
      </div>
      <form>
        <div className="card-body pad-10">
          <div className="row mb-6 table-filter">
            <div className="col-lg-6 mb-5">
              <div className="fv-row mb-0">
                <label htmlFor="orgName" className="form-label fs-6 fw-bolder mb-3">
                  Organization Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  className="form-control form-control-lg form-control"
                  id="orgName"
                  ref={orgName}
                  placeholder="Ex: lancesoft"
                  defaultValue={organizationData?.orgName || ''}
                />
              </div>
            </div>
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="fv-row mb-0">
                <label htmlFor="mobileNo" className="form-label fs-6 fw-bolder mb-3">
                  Organization Mobile
                </label>
                <input
                  type="tel"
                  required
                  className="form-control form-control-lg form-control-solid"
                  id="mobileNo"
                  ref={mobileNo}
                  placeholder="Ex: 01 0102030405"
                  minLength={10}
                  maxLength={15}
                  pattern="^[0-9]{10,15}$"
                  defaultValue={organizationData?.mobileNo || ''}
                />
              </div>
            </div>
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="fv-row mb-0">
                <label htmlFor="email" className="form-label fs-6 fw-bolder mb-3">
                  Organization Email
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg form-control-solid"
                  id="email"
                  ref={email}
                  placeholder="email@organization.com"
                  required
                  maxLength={100}
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                  defaultValue={organizationData?.email || ''}
                />
              </div>
            </div>
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="fv-row mb-0">
                <label htmlFor="address" className="form-label fs-6 fw-bolder mb-3">
                  Organization Address
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  className="form-control form-control-lg form-control-solid"
                  id="address"
                  ref={address}
                  placeholder="Address"
                  defaultValue={organizationData?.address || ''}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end pad-10">
          <button
            type="submit"
            onClick={handleSaveClick}
            className="btn btn-new btn-small"
            style={{ display: loading || save ? 'none' : 'inline-block' }}
          >
            {!loading && 'Update Changes'}
            {loading && (
              <span className="indicator-progress" style={{ display: 'block' }}>
                Please wait...
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>
        </div>
      </form>

      {/* Universal Confirm Popup */}
      <ConfirmPopup
        show={showConfirm}
        title="Confirmation"
        message={confirmMessage}
        onConfirm={() => {
          setShowConfirm(false)
          confirmCallback()
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  )
}

export { UpdateOrganizations }
