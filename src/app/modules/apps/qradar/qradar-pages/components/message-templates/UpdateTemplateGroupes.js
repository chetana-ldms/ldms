import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useErrorBoundary } from 'react-error-boundary'
import { ToastContainer } from 'react-toastify'
import { notify, notifyFail } from '../notification/Notification'
import {
  fetchMessageTemplateGroupsUrl,
  fetchMessageTemplateGroupUpdateUrl,
  fetchMessageTemplateGroupUrl,
} from '../../../../../../api/MessageTemplateApi'

const UpdateTemplateGroupes = () => {
  const { showBoundary } = useErrorBoundary()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const { id } = useParams()
  const codeRef = useRef()
  const displayNameRef = useRef()
  const descriptionRef = useRef()

  const [save] = useState(location.state?.save || '')

useEffect(() => {
  const fetchGroupDetails = async () => {
    try {
      const response = await fetchMessageTemplateGroupsUrl(Number(id))

      if (response?.isSuccess && response?.data) {
        const group = response.data[0]
        if (codeRef.current) codeRef.current.value = group.code || ''
        if (displayNameRef.current) displayNameRef.current.value = group.displayName || ''
        if (descriptionRef.current) descriptionRef.current.value = group.description || ''
      } else {
        notifyFail('No group details found')
      }
    } catch (error) {
      console.error('Failed to load group details:', error)
      notifyFail('Failed to load group details')
    }
  }

  if (id) fetchGroupDetails()
}, [id])


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const code = codeRef.current?.value?.trim()
    const displayName = displayNameRef.current?.value?.trim()
    const description = descriptionRef.current?.value?.trim()
    if (!code) {
      notifyFail('Enter Code')
      setLoading(false)
      return
    }
    if (!displayName) {
      notifyFail('Enter Display Name')
      setLoading(false)
      return
    }
    if (!description) {
      notifyFail('Enter Description')
      setLoading(false)
      return
    }

    const modifiedUserId = Number(sessionStorage.getItem('userId')) || 0
    const modifiedDate = new Date().toISOString()

    const payload = {
      dataId: Number(id) || 0,
      code,
      displayName,
      description,
      modifiedDate,
      modifiedUserId,
    }

    try {
      const response = await fetchMessageTemplateGroupUpdateUrl(payload)
      if (response?.isSuccess) {
        notify(response.message || 'Template Group updated successfully!')
        setTimeout(() => navigate('/qradar/template-groupes/list'), 2000)
      } else {
        notifyFail(response?.message || 'Failed to update Template Group')
      }
    } catch (error) {
      console.error('Error updating Template Group:', error)
      showBoundary(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='config card'>
      <ToastContainer />
      <div className='card-header bg-heading d-flex justify-content-between align-items-center'>
        <h3 className='card-title white mb-1'>
          {save ? 'View Template Group' : 'Update Template Group'}
        </h3>

        <Link to='/qradar/template-groupes/list' className='white fs-15 text-underline'>
          <i className='fa fa-chevron-left white me-2' /> Back
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='card-body p-4'>
          <div className='row'>

            {/* Code */}
            <div className='col-md-6 mb-3'>
              <label className='form-label fw-bold'>Code</label>
              <input
                type='text'
                className='form-control'
                placeholder='Enter code'
                ref={codeRef}
                maxLength={100}
                readOnly={save}
              />
            </div>

            {/* Display Name */}
            <div className='col-md-6 mb-3'>
              <label className='form-label fw-bold'>Display Name</label>
              <input
                type='text'
                className='form-control'
                placeholder='Enter display name'
                ref={displayNameRef}
                maxLength={200}
                readOnly={save}
              />
            </div>

            {/* Description */}
            <div className='col-md-6 mb-3'>
              <label className='form-label fw-bold'>Description</label>
              <textarea
                className='form-control'
                rows={3}
                placeholder='Enter description'
                ref={descriptionRef}
                readOnly={save}
              />
            </div>
          </div>
        </div>

        {!save && (
          <div className='card-footer d-flex justify-content-end p-3'>
            <button type='submit' className='btn btn-new btn-small' disabled={loading}>
              {!loading && 'Update Template Group'}
              {loading && (
                <span className='indicator-progress'>
                  Please wait...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export { UpdateTemplateGroupes }
