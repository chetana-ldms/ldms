import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useErrorBoundary } from 'react-error-boundary'
import { ToastContainer } from 'react-toastify'
import { notify, notifyFail } from '../notification/Notification'
import { fetchMessageTemplateGroupUrl, fetchMessageTemplateTypeUrl } from '../../../../../../api/MessageTemplateApi'

const AddTemplateTypes = () => {
  const { showBoundary } = useErrorBoundary()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const codeRef = useRef()
  const displayNameRef = useRef()
  const descriptionRef = useRef()

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

    const createdUserId = Number(sessionStorage.getItem('userId')) || 0
    const createdDate = new Date().toISOString()
    const payload = {
      code,
      displayName,
      description,
      createdDate,
      createdUserId,
    }

    try {
      const response = await fetchMessageTemplateTypeUrl(payload)
      if (response?.isSuccess) {
        notify(response.message)
        setTimeout(() => navigate('/qradar/template-types/list'), 2000)
      } else {
        notifyFail(response?.message)
      }
    } catch (error) {
      console.error('Error creating Template Group:', error)
      showBoundary(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='config card'>
      <ToastContainer />
      <div className='card-header bg-heading d-flex justify-content-between align-items-center'>
        <h3 className='card-title white mb-1'>Add New Template Type</h3>
        <Link to='/qradar/template-types/list' className='white fs-15 text-underline'>
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
              />
            </div>
          </div>
        </div>

        <div className='card-footer d-flex justify-content-end p-3'>
          <button type='submit' className='btn btn-new btn-small' disabled={loading}>
            {!loading && 'Save Template Group'}
            {loading && (
              <span className='indicator-progress'>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export { AddTemplateTypes }
