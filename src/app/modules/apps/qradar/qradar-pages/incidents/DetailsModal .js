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

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!show) return

    const loadData = async () => {
      setLoading(true)
      setNoDetails(false)
      setAttachments([])
      setHtmlContent('')

      try {
        const res = await fetchIncidentDescriptionAndAttachmentsUrl({
          incidentID: incidentData?.incidentID,
        })

        const {description, attachmentsInBase64 = []} = res || {}

        if (!description && !attachmentsInBase64.length) {
          setNoDetails(true)
          return
        }

        const mapped = attachmentsInBase64.map((f) => ({
          attachmentId: f.attachmentId,
          fileName: f.fileName,
          fileType: f.fileType,
          fileSize: f.fileSize,
          contentId: f.contentId,
          isInline: f.isInline,
          filePath: f.filePath,
          isExisting: true,
        }))

        setAttachments(mapped)

        let html = description || ''
        mapped.forEach((a) => {
          if (a.contentId && a.filePath) {
            html = html.replace(new RegExp(`cid:${a.contentId}`, 'g'), a.filePath)
          }
        })

        setHtmlContent(html)
      } catch (e) {
        console.error(e)
        setNoDetails(true)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [show, incidentData])

  /* ================= ATTACHMENTS ================= */
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

  const removeAttachment = (att) => {
    setAttachments((prev) => prev.filter((a) => a !== att))
  }

  const downloadAttachment = (att) => {
    if (att.filePath) {
      window.open(att.filePath, '_blank')
    } else if (att.file) {
      const url = URL.createObjectURL(att.file)
      const a = document.createElement('a')
      a.href = url
      a.download = att.file.name
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const formatSize = (b) =>
    b > 1024 * 1024
      ? (b / 1024 / 1024).toFixed(1) + ' MB'
      : (b / 1024).toFixed(1) + ' KB'

  /* ================= SAVE ================= */
  const handleSave = async () => {
    setLoading(true)

    try {
      const {cleanedHtml, attachments: inlineImages} =
        processHtmlWithInlineImages(htmlContent)

      const payload = {
        ToolId: toolId,
        OrgId: orgId,
        IncidentId: incidentData?.incidentID,
        Description: cleanedHtml,
        ModifiedDate: new Date().toISOString(),
        ModifiedUserId: userId,
        Attachments: [...inlineImages, ...attachments],
      }

      const res = await fetchUpdateDescriptionAndAttachmentUrl(payload)

      if (res?.isSuccess) {
        notify(res.message)
        onClose()
      } else {
        notifyFail(res?.message || 'Update failed')
      }
    } catch {
      notifyFail('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const regularFiles = attachments.filter((a) => !a.isInline)

  /* ================= UI ================= */
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
                  {regularFiles.map((att, i) => (
                    <div
                      key={i}
                      className='d-flex align-items-center border rounded-pill px-3 py-1 bg-light'
                    >
                      <span className='me-2'>
                        {att.fileName || att.file?.name}
                        {/* {att.fileSize && ` (${formatSize(att.fileSize)})`} */}
                      </span>

                      <button
                        className='btn btn-link p-0 me-2 text-primary'
                        onClick={() => downloadAttachment(att)}
                      >
                        <i className='fa fa-download' />
                      </button>

                      <button
                        className='btn btn-link p-0 text-danger'
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
