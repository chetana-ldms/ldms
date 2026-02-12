import React, {useEffect, useState, useRef} from 'react'
import {Modal, Button, Spinner} from 'react-bootstrap'
import RichTextEditor from '../../../../../../utils/RichTextEditor'
import {
  fetchIncidentDescriptionAndAttachmentsUrl,
  fetchUpdateDescriptionAndAttachmentUrl,
} from '../../../../../api/IncidentsApi'
import {processHtmlWithInlineImages} from './processHtmlWithInlineImages'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import ConfirmPopup from '../../../../../../utils/ConfirmPopup'
import 'react-toastify/dist/ReactToastify.css'

const DetailsModal = ({show, onClose, incidentData}) => {
  const [loading, setLoading] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')
  const [attachments, setAttachments] = useState([])
  const [noDetails, setNoDetails] = useState(false)

  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState('')
  const [confirmCallback, setConfirmCallback] = useState(() => {})

  const initialState = useRef({fingerprint: '', attachments: ''})
  const hasLoaded = useRef(false)

  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('incidentToolId'))
  const userId = Number(sessionStorage.getItem('userId'))

  /* ========= HTML NORMALIZER ========= */
  const fingerprint = (html) => {
    if (!html) return ''
    return html
      .replace(/<p><br><\/p>/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  /* ========= LOAD DATA ========= */
  useEffect(() => {
    if (!show) return
    hasLoaded.current = false

    const loadData = async () => {
      setLoading(true)
      setNoDetails(false)
      setAttachments([])
      setHtmlContent('')

      try {
        const res = await fetchIncidentDescriptionAndAttachmentsUrl({
          incidentID: incidentData?.incidentID,
        })

        const {description, attachmentsInBase64 = [], isSuccess} = res || {}
        const attachmentsArray = attachmentsInBase64 || []

        if (!isSuccess || (!description && attachmentsArray.length === 0)) {
          setNoDetails(true)
          return
        }

        const mapped = attachmentsArray.map((f) => ({
          attachmentId: f.attachmentId,
          filePath: f.filePath,
          fileName: f.fileName,
          isInline: f.isInline || false,
          isExisting: true,
        }))
        setHtmlContent(description || '')
        setAttachments(mapped)

        setTimeout(() => {
          initialState.current = {
            fingerprint: fingerprint(description || ''),
            attachments: JSON.stringify(mapped),
          }
          hasLoaded.current = true
        }, 300)
      } catch (e) {
        console.error(e)
        setNoDetails(true)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [show, incidentData])

  /* ========= CHANGE DETECTION ========= */
  const isChanged = () => {
    if (!hasLoaded.current) return false
    return (
      fingerprint(htmlContent) !== initialState.current.fingerprint ||
      JSON.stringify(attachments) !== initialState.current.attachments
    )
  }

  /* ========= ATTACHMENTS ========= */
  const handleNewAttachment = (file) => {
    const isImage = file.type.startsWith('image/')

    setAttachments((prev) => [
      ...prev,
      {
        file,
        isInline: isImage, // ✅ images inline
        isExisting: false,
      },
    ])
  }

  const removeAttachment = (att) => {
    setAttachments((prev) =>
      prev.filter((a) => (att.isExisting ? a.attachmentId !== att.attachmentId : a !== att))
    )
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

  /* ========= SAVE ========= */
  const executeSave = async () => {
    setLoading(true)

    try {
      const {cleanedHtml, attachments: inlineImages} = processHtmlWithInlineImages(htmlContent)

      let updatedHtml = cleanedHtml

      const now = new Date()
      const timestamp =
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') +
        '_' +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0')

      // ✅ rename inline images + rewrite HTML
      const newInlineAttachments = inlineImages.map((img) => {
        const oldCid = img.contentId
        const ext = img.file.name.split('.').pop()

        const uniqueContentId = `${oldCid}_${timestamp}.${ext}`

        updatedHtml = updatedHtml.replaceAll(`cid:${oldCid}`, `cid:${uniqueContentId}`)

        const renamedFile = new File([img.file], uniqueContentId, {
          type: img.file.type,
        })

        return {
          file: renamedFile,
          contentId: uniqueContentId,
          isInline: true,
        }
      })

      // ✅ new normal files
      const newFiles = attachments.filter(
        (a) => !a.isExisting && !a.isInline && a.file instanceof File
      )

      // ✅ filter existing attachments AFTER html is ready
      const existingAttachments = attachments.filter((a) => {
        if (!a.isExisting || !a.attachmentId || !a.filePath) return false

        if (a.isInline) {
          const fileName = a.filePath.split('/').pop()
          return updatedHtml.includes(fileName)
        }

        return true
      })

      const payload = {
        ToolId: toolId,
        OrgId: orgId,
        IncidentId: incidentData?.incidentID,
        Description: updatedHtml,
        ModifiedDate: new Date().toISOString(),
        ModifiedUserId: userId,
        ExistingAttachments: existingAttachments,
        NewAttachments: [...newFiles, ...newInlineAttachments],
      }

      const res = await fetchUpdateDescriptionAndAttachmentUrl(payload)

      if (res?.isSuccess) {
        notify(res.message)
        onClose()
      } else {
        notifyFail(res?.message || 'Update failed')
      }
    } catch (err) {
      console.error(err)
      notifyFail('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    if (!isChanged()) {
      setConfirmMessage('No changes detected. Save anyway?')
      setConfirmCallback(() => executeSave)
      setShowConfirm(true)
    } else {
      executeSave()
    }
  }

  const handleCancel = () => {
    if (isChanged()) {
      setConfirmMessage('You are losing unsaved information. Continue?')
      setConfirmCallback(() => onClose)
      setShowConfirm(true)
    } else {
      onClose()
    }
  }

  const regularFiles = attachments.filter((a) => !a.isInline)

  return (
    <>
      <Modal show={show} onHide={handleCancel} className="DetailModal application-modal">
        <ToastContainer />

        <Modal.Header closeButton>
          <Modal.Title>Incident Description</Modal.Title>
          <button
          type="button"
          class="application-modal-close"
          aria-label="Close"
        >
          <i className="fa fa-close" />
        </button>
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
                      <div key={i} className='border rounded-pill px-3 py-1 bg-light'>
                        <span className='me-2'>
                          {att.file?.name || att.fileName}
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
          <Button variant='secondary' onClick={handleCancel}>
            Cancel
          </Button>
          {!noDetails && (
            <Button variant='primary' onClick={handleSave} disabled={loading}>
              Save
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <ConfirmPopup
        show={showConfirm}
        title='Confirmation'
        message={confirmMessage}
        onConfirm={() => {
          setShowConfirm(false)
          confirmCallback()
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  )
}

export default DetailsModal
