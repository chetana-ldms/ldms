import React, {useEffect, useState} from 'react'
import {Modal, Button, Spinner} from 'react-bootstrap'
import RichTextEditor from '../../../../../../utils/RichTextEditor'
import {
  fetchIncidentDescriptionAndAttachmentsUrl,
  fetchUpdateDescriptionAndAttachmentUrl,
} from '../../../../../api/IncidentsApi'
import {processHtmlWithInlineImages} from './processHtmlWithInlineImages'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const DetailsModal = ({show, onClose, incidentData}) => {
  const [loading, setLoading] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')
  const [attachments, setAttachments] = useState([])
  const [noDetails, setNoDetails] = useState(false)

  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('incidentToolId'))
  const userId = Number(sessionStorage.getItem('userId'))

  /* ===================== LOAD DATA ===================== */
  useEffect(() => {
    if (!show) return

    const loadData = async () => {
      setLoading(true)
      setNoDetails(false)
      setHtmlContent('')
      setAttachments([])

      try {
        const payload = {incidentID: incidentData?.incidentID}
        const response = await fetchIncidentDescriptionAndAttachmentsUrl(payload)

        const {description, attachmentsInBase64 = []} = response || {}

        if (!description && attachmentsInBase64.length === 0) {
          setNoDetails(true)
          return
        }

        const backendAttachments = attachmentsInBase64.map((f) => ({
          attachmentId: f.attachmentId,
          fileName: f.fileName,
          fileType: f.fileType,
          fileSize: f.fileSize,
          contentId: f.contentId,
          isInline: f.isInline,
          filePath: f.filePath,
          isExisting: true,
        }))

        setAttachments(backendAttachments)

        let htmlPreview = description || ''

        backendAttachments.forEach((f) => {
          if (f.contentId && f.filePath) {
            htmlPreview = htmlPreview.replace(
              new RegExp(`cid:${f.contentId}`, 'g'),
              f.filePath
            )
          }
        })

        setHtmlContent(htmlPreview)
      } catch (err) {
        console.error(err)
        setNoDetails(true)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [show, incidentData])

  /* ===================== ATTACHMENTS ===================== */
  const handleNewAttachment = (file) => {
    setAttachments((prev) => [
      ...prev,
      {
        file,
        isInline: false,
        contentId: null,
        isExisting: false,
      },
    ])
  }

  const removeAttachment = (attachment) => {
    setAttachments((prev) => prev.filter((a) => a !== attachment))
  }

  const downloadAttachment = (attachment) => {
    // Existing file
    if (attachment.filePath) {
      window.open(attachment.filePath, '_blank')
      return
    }

    // New file (local)
    if (attachment.file) {
      const url = URL.createObjectURL(attachment.file)
      const a = document.createElement('a')
      a.href = url
      a.download = attachment.file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const formatSize = (bytes) =>
    bytes > 1024 * 1024
      ? (bytes / 1024 / 1024).toFixed(1) + ' MB'
      : (bytes / 1024).toFixed(1) + ' KB'

  /* ===================== SAVE ===================== */
  const handleSave = async () => {
    setLoading(true)

    try {
      const {cleanedHtml, attachments: inlineImages} =
        processHtmlWithInlineImages(htmlContent)

      const newFiles = attachments.filter(
        (a) => a.file && !a.contentId
      )

      const payload = {
        ModifiedDate: new Date().toISOString(),
        ToolId: toolId,
        OrgId: orgId,
        ModifiedUserId: userId,
        IncidentId: incidentData?.incidentID,
        Description: cleanedHtml,
        Attachments: [...inlineImages, ...newFiles],
      }

      const res = await fetchUpdateDescriptionAndAttachmentUrl(payload)

      if (res?.isSuccess) {
        notify(res.message)
        onClose()
      } else {
        notifyFail(res?.message || 'Update failed')
      }
    } catch (err) {
      notifyFail('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const regularFiles = attachments.filter((a) => !a.isInline)

  /* ===================== UI ===================== */
  return (
    <Modal show={show} onHide={onClose} size='lg'>
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
          <div className='text-center text-muted'>No details found</div>
        ) : (
          <>
            {regularFiles.length > 0 && (
              <>
                <h6 className='fw-bold'>Attachments</h6>

                <div className='d-flex flex-wrap gap-2'>
                  {regularFiles.map((att) => (
                    <div
                      key={att.filePath || att.file?.name}
                      className='d-flex align-items-center border rounded-pill px-3 py-1 bg-light'
                    >
                      <span className='me-2'>
                        {att.fileName || att.file?.name}
                        {att.fileSize && ` (${formatSize(att.fileSize)})`}
                      </span>

                      {/* Download */}
                      <button
                        className='btn btn-link text-primary p-0 me-2'
                        title='Download'
                        onClick={() => downloadAttachment(att)}
                      >
                        <i className='fa fa-download' />
                      </button>

                      {/* Remove */}
                      <button
                        className='btn btn-link text-danger p-0'
                        title='Remove'
                        onClick={() => removeAttachment(att)}
                      >
                        <i className='fa fa-times' />
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
          <Button variant='primary' onClick={handleSave} disabled={loading}>
            Save
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default DetailsModal
