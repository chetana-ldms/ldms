import React, {useEffect, useState} from 'react'
import {Modal, Button, Spinner} from 'react-bootstrap'
import RichTextEditor from '../../../../../../utils/RichTextEditor'
import {fetchUpdateDescriptionAndAttachmentUrl} from '../../../../../api/IncidentsApi'
import {processHtmlWithInlineImages} from './processHtmlWithInlineImages'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const DetailsModal = ({show, onClose, incidentData, onSave}) => {
  const [loading, setLoading] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')
  const [attachments, setAttachments] = useState([])
  const [noDetails, setNoDetails] = useState(false)
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('incidentToolId'))
  useEffect(() => {
    const loadData = async () => {
      if (!show) return

      setLoading(true)
      setNoDetails(false)
      setHtmlContent('')

      try {
        const html = incidentData?.description || ''
        const backendFiles = incidentData?.attachmentsInBase64 || []
        const convertedFiles = backendFiles.map((f) => {
          const byteCharacters = atob(f.data)
          const byteArray = new Uint8Array([...byteCharacters].map((c) => c.charCodeAt(0)))
          const file = new File([byteArray], f.fileName, {type: f.fileType})

          return {file, contentId: f.contentId}
        })
        setAttachments(convertedFiles)
        if (!html.trim() && convertedFiles.length === 0) {
          setNoDetails(true)
          return
        }
        let htmlPreview = html
        backendFiles.forEach((f) => {
          if (f?.contentId) {
            htmlPreview = htmlPreview.replace(
              new RegExp(`cid:${f.contentId}`, 'g'),
              `data:${f.fileType};base64,${f.data}`
            )
          }
        })
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlPreview, 'text/html')
        doc.querySelectorAll('img').forEach((img) => img.removeAttribute('alt'))
        doc.querySelectorAll('*').forEach((node) => {
          node.childNodes.forEach((child) => {
            if (
              child.nodeType === 3 &&
              /AI-generated content may be incorrect/i.test(child.textContent)
            ) {
              child.textContent = ''
            }
          })
        })
        setHtmlContent(doc.body.innerHTML.trim())
      } catch (e) {
        console.error('Load error:', e)
        setNoDetails(true)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [show, incidentData])
  const handleNewAttachment = (file) => {
    setAttachments((prev) => [...prev, {file, contentId: null}])
  }
  const removeAttachment = (idx) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx))
  }
  const handleSave = async () => {
    setLoading(true)

    try {
      // Extract inline embedded images
      const {cleanedHtml, attachments: inlineImages} = processHtmlWithInlineImages(htmlContent)

      // Normal attachments
      const nonInline = attachments.filter((x) => !x.contentId)

      // FINAL MERGED ATTACHMENT ARRAY
      const finalFiles = [...inlineImages, ...nonInline]

      const payload = {
        ModifiedDate: new Date().toISOString(),
        ToolId: toolId,
        OrgId: orgId,
        ModifiedUserId: Number(sessionStorage.getItem('userId')),
        IncidentId: incidentData?.incidentID,
        Description: cleanedHtml,
        Attachments: finalFiles, // <-- EXACT FORMAT
      }

      const res = await fetchUpdateDescriptionAndAttachmentUrl(payload)
      const {isSuccess, message} = res
      if (isSuccess) {
        notify(message)
        onClose()
      } else {
        notifyFail(message)
      }
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const regularFiles = attachments.filter((x) => !x.contentId)

  const formatSize = (bytes) =>
    bytes > 1024 * 1024
      ? (bytes / 1024 / 1024).toFixed(1) + ' MB'
      : (bytes / 1024).toFixed(1) + ' KB'

  return (
    <Modal show={show} onHide={onClose} className='detailsModal application-modal'>
      <ToastContainer />
      <Modal.Header closeButton>
        <Modal.Title>Incident Description</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className='text-center py-4'>
            <Spinner animation='border' />
          </div>
        ) : noDetails ? (
          <div className='text-center text-muted'>No details found.</div>
        ) : (
          <>
            {regularFiles.length > 0 && (
              <>
                <h6 className='fw-bold'>Attachments:</h6>
                <div className='d-flex flex-wrap gap-2'>
                  {regularFiles.map((att, idx) => (
                    <div
                      key={idx}
                      className='d-flex align-items-center border rounded-pill px-3 py-1 bg-light'
                    >
                      <span className='me-2'>
                        {att.file.name} ({formatSize(att.file.size)})
                      </span>
                      <button
                        className='btn btn-link text-danger p-0'
                        onClick={() => removeAttachment(idx)}
                      >
                        <i className='fa fa-times'></i>
                      </button>
                    </div>
                  ))}
                </div>
                <hr />
              </>
            )}

            <RichTextEditor
              value={htmlContent}
              onChange={setHtmlContent}
              onAttach={handleNewAttachment}
            />
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={onClose}>
          Cancel
        </Button>

        {!noDetails && (
          <Button variant='primary' onClick={handleSave}>
            Save
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default DetailsModal
