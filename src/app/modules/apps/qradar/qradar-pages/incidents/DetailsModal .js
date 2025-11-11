import React, {useEffect, useState} from 'react'
import {Modal, Button, Spinner} from 'react-bootstrap'
import RichTextEditor from '../../../../../../utils/RichTextEditor'

const DetailsModal = ({show, onClose, incidentData, onSave}) => {
  const [htmlContent, setHtmlContent] = useState('')
  const [attachments, setAttachments] = useState([])

  useEffect(() => {
    if (show && incidentData) {
      setHtmlContent(incidentData.description || '')
      setAttachments(incidentData.attachmentsInBase64 || [])
    }
  }, [show, incidentData])

  // Convert base64 → File (for save handling)
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
    const blob = new Blob(byteArrays, {type: mimeType})
    return new File([blob], fileName, {type: mimeType})
  }

  const handleSave = () => {
    const updatedAttachments = attachments.map((file, i) => {
      const newCid = `inline_${i + 1}`
      const newFile = base64ToFile(file.data, `${newCid}.png`, file.fileType)
      return {file: newFile, ContentId: newCid}
    })

    onSave?.({
      Description: htmlContent,
      Description_Attachments: updatedAttachments,
    })

    onClose()
  }

  return (
    <Modal show={show} onHide={onClose} className='quotedTextModal application-modal' size='lg' centered>
      <Modal.Header closeButton>
        <Modal.Title>Incident Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!incidentData ? (
          <div className='text-center py-5'>
            <Spinner animation='border' />
          </div>
        ) : (
          <>
            <label className='fw-bold mb-2'>Description</label>
            <RichTextEditor value={htmlContent} onChange={setHtmlContent} />

            {attachments?.length > 0 && (
              <div className='mt-4'>
                <h6 className='fw-bold mb-2'>Attachments</h6>
                <div className='d-flex flex-wrap gap-3'>
                  {attachments.map((file, idx) => {
                    const fileUrl = `data:${file.fileType};base64,${file.data}`
                    const isImage = file.fileType.startsWith('image/')
                    return (
                      <div key={idx} className='border rounded p-2 text-center' style={{width: '150px'}}>
                        {isImage ? (
                          <img
                            src={fileUrl}
                            alt={file.fileName || 'attachment'}
                            style={{width: '100%', height: '100px', objectFit: 'cover'}}
                          />
                        ) : (
                          <i className='fa fa-file-text fa-3x text-muted' />
                        )}
                        <a
                          href={fileUrl}
                          download={file.fileName || `attachment_${idx + 1}`}
                          className='d-block mt-2 small text-truncate'
                          title={file.fileName}
                        >
                          {file.fileName || `Attachment ${idx + 1}`}
                        </a>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={onClose}>
          Cancel
        </Button>
        <Button variant='primary' onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DetailsModal
