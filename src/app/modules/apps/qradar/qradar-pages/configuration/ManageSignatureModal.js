import React, {useState, useEffect} from 'react'
import {Modal, Button, Spinner} from 'react-bootstrap'
import ReactQuill, {Quill} from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {fetchManageSignatureUrl, fetchSignatureUrl} from '../../../../../api/ConfigurationApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'

// ✅ Import and register the maintained image resize module
import ImageResize from 'quill-image-resize-module-react'
Quill.register('modules/imageResize', ImageResize)

const ManageSignatureModal = ({show, onClose, userId}) => {
  const [signatureHtml, setSignatureHtml] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)

  // Quill modules (with image resize)
  const modules = {
    toolbar: [
      [{header: [1, 2, false]}],
      ['bold', 'italic', 'underline', 'strike'],
      [{list: 'ordered'}, {list: 'bullet'}],
      ['link', 'image'],
      ['clean'],
    ],
    imageResize: {
      modules: ['Resize', 'DisplaySize', 'Toolbar'], // ✅ now width & height resize works
      displaySize: true,
    },
  }

  // 🔹 Fetch existing signature when modal opens
  useEffect(() => {
    if (show && userId) {
      const loadSignature = async () => {
        setInitialLoading(true)
        try {
          const response = await fetchSignatureUrl(userId)
          if (response?.isSuccess && response.data?.signatureHtml) {
            setSignatureHtml(response.data.signatureHtml)
          } else {
            setSignatureHtml('')
          }
        } catch (error) {
          console.error(error)
          notifyFail('Failed to load signature')
        } finally {
          setInitialLoading(false)
        }
      }
      loadSignature()
    }
  }, [show, userId])

  // 🔹 Save/Update signature
  const handleSubmit = async () => {
    setLoading(true)
    const data = {
      userId: Number(userId),
      signatureHtml,
      transactionUserId: Number(sessionStorage.getItem('userId')) || 0,
      transactionDateTime: new Date().toISOString(),
    }

    try {
      const responseData = await fetchManageSignatureUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        onClose()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.error(error)
      notifyFail('Something went wrong while saving signature')
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Clear editor content (local only)
  const handleClear = () => {
    setSignatureHtml('')
  }

  return (
    <Modal
      backdrop='static'
      keyboard={false}
      show={show}
      onHide={onClose}
      className='addAManageSignatureModal application-modal'
      size='lg'
      centered
    >
      <ToastContainer />
      <Modal.Header closeButton>
        <Modal.Title>Manage Signature</Modal.Title>
        <button type='button' className='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        {initialLoading ? (
          <div className='text-center py-5'>
            <Spinner animation='border' />
            <p className='mt-2'>Loading signature...</p>
          </div>
        ) : (
          <ReactQuill
            value={signatureHtml}
            onChange={setSignatureHtml}
            placeholder='Paste or write your email signature here...'
            theme='snow'
            style={{minHeight: '200px'}}
            modules={modules} // ✅ Added image resize support
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='outline-danger' onClick={handleClear} disabled={loading || initialLoading}>
          Clear
        </Button>
        <Button variant='secondary' onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant='primary' onClick={handleSubmit} disabled={loading || initialLoading}>
          {loading ? (
            <>
              <Spinner animation='border' size='sm' className='me-2' />
              Saving...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ManageSignatureModal
