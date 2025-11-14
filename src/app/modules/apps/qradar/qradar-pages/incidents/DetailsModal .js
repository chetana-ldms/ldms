import React, { useEffect, useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import RichTextEditor from '../../../../../../utils/RichTextEditor'

const DetailsModal = ({ show, onClose, incidentData, onSave }) => {
  const [loading, setLoading] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')
  const [attachments, setAttachments] = useState([])
  const [noDetails, setNoDetails] = useState(false)

  useEffect(() => {
    const loadDetails = async () => {
      if (!show) return
      setLoading(true)
      setNoDetails(false)
      setHtmlContent('')

      try {
        const html = incidentData?.description || ''
        const attachmentsData = incidentData?.attachmentsInBase64 || []
        setAttachments(attachmentsData)

        if (!html.trim() && attachmentsData.length === 0) {
          setNoDetails(true)
          return
        }

        // Replace cid references with base64 previews
        const replaceCidWithBase64 = (content) => {
          let updated = content
          attachmentsData.forEach((file) => {
            if (file?.contentId && file?.data) {
              const cidRegex = new RegExp(`cid:${file.contentId}`, 'g')
              updated = updated.replace(cidRegex, `data:${file.fileType};base64,${file.data}`)
            }
          })
          return updated
        }

        let previewHtml = replaceCidWithBase64(html)

        // 🧹 Clean unwanted AI text
        const parser = new DOMParser()
        const doc = parser.parseFromString(previewHtml, 'text/html')

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

        const cleanedHtml = doc.body.innerHTML.trim()

        if (!cleanedHtml && attachmentsData.filter((a) => !a.isInline).length === 0) {
          setNoDetails(true)
          return
        }

        setHtmlContent(cleanedHtml)
      } catch (err) {
        console.error('Error loading details:', err)
        setNoDetails(true)
      } finally {
        setLoading(false)
      }
    }

    loadDetails()
  }, [show, incidentData])

  // Convert base64 → File
  const base64ToFile = (base64, fileName, mimeType) => {
    const byteCharacters = atob(base64)
    const byteArrays = []
    const sliceSize = 512
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize)
      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i)
      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }
    const blob = new Blob(byteArrays, { type: mimeType })
    return new File([blob], fileName, { type: mimeType })
  }

  const handleSave = () => {
    let htmlToSend = htmlContent
    const updatedAttachments = []
    let cidCounter = 100

    attachments.forEach((file) => {
      if (file?.data && file?.fileType) {
        const newCid = `inline_${cidCounter}.png`
        cidCounter++

        const escapedData = file.data.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const base64Pattern = new RegExp(`data:${file.fileType};base64,${escapedData}`, 'g')
        htmlToSend = htmlToSend.replace(base64Pattern, `cid:${newCid}`)

        const newFile = base64ToFile(file.data, newCid, file.fileType)
        updatedAttachments.push({ file: newFile, ContentId: newCid })
      }
    })

    onSave({
      IncidentDetails: htmlToSend,
      IncidentDetails_Attachments: updatedAttachments,
    })

    onClose()
  }

  // Filter only non-inline attachments
  const nonInlineAttachments = attachments.filter((file) => file?.isInline === false)

  // Remove attachment
  const handleRemove = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  // Helper to format file size
  const formatSize = (bytes) => {
    if (!bytes) return '0 KB'
    return bytes > 1024 * 1024
      ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
      : `${(bytes / 1024).toFixed(1)} KB`
  }

  return (
    <Modal show={show} onHide={onClose} className='detailsModal application-modal'>
      <Modal.Header closeButton>
        <Modal.Title>Incident Description</Modal.Title>
        <button type='button' className='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className='text-center py-5'>
            <Spinner animation='border' />
          </div>
        ) : noDetails ? (
          <div className='text-center text-muted py-4'>No details found.</div>
        ) : (
          <>
            {/* 🔹 Attachment chips with download & delete */}
            {nonInlineAttachments.length > 0 && (
              <div className='mb-3'>
                <h6 className='fw-bold mb-2'>Attachments:</h6>
                <div className='d-flex flex-wrap gap-2'>
                  {nonInlineAttachments.map((file, idx) => (
                    <div
                      key={idx}
                      className='d-flex align-items-center border rounded-pill px-3 py-1 bg-light'
                      style={{ fontSize: '0.9rem' }}
                    >
                      <span className='text-truncate me-2' style={{ maxWidth: 200 }}>
                        {decodeURIComponent(file.fileName || 'Attachment')} ({formatSize(file.fileSize)})
                      </span>

                      {/* Download */}
                      <a
                        href={`data:${file.fileType};base64,${file.data}`}
                        download={decodeURIComponent(file.fileName || 'attachment')}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary me-2'
                        title='Download'
                      >
                        <i className='fa fa-download me-1'></i>
                      </a>

                      {/* Remove */}
                      <button
                        type='button'
                        onClick={() => handleRemove(idx)}
                        className='btn btn-link text-danger p-0'
                        title='Remove'
                      >
                        <i className='fa fa-times'></i>
                      </button>
                    </div>
                  ))}
                </div>
                <hr />
              </div>
            )}

            {/* Rich text content */}
            <RichTextEditor value={htmlContent} onChange={setHtmlContent} />
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
