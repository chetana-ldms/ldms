import React, {useEffect, useState} from 'react'
import {Modal, Button, Spinner, Form} from 'react-bootstrap'

import {
  fetchIncidentNotesUpdateUrl,
  fetchIncidenttNotesByIncidentByConversationIdUrl,
  fetchNotesDetailsUrl,
} from '../../../../../api/IncidentsApi'

import {notify, notifyFail} from '../components/notification/Notification'
import RichTextEditor from '../../../../../../utils/RichTextEditor'
import {processHtmlWithInlineImages} from './processHtmlWithInlineImages'

const NotesEditModalComponent = ({show, onClose, noteData, fetchNotes, id, conversationId}) => {
  const userID = Number(sessionStorage.getItem('userId'))

  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState([])
  const [loading, setLoading] = useState(false)

  /* ================= LOAD NOTE ================= */
  useEffect(() => {
    if (show && (noteData?.incidentNotesId || conversationId)) {
      loadNoteDetails()
    }
  }, [show, noteData, conversationId])

  const loadNoteDetails = async () => {
    try {
      setLoading(true)

      let incidentNotesId = noteData?.incidentNotesId

      // If conversationId is provided, fetch by conversation first
      if (conversationId) {
        const convRes = await fetchIncidenttNotesByIncidentByConversationIdUrl(conversationId)

        incidentNotesId = convRes?.incidentNotesId
      }

      if (!incidentNotesId) return

      const response = await fetchNotesDetailsUrl(incidentNotesId)
      if (!response) return

      const html = response?.incidentNotes?.notesHtmlContent || ''

      const mapped =
        response?.attachments?.map((att) => ({
          attachmentId: att.attachmentId,
          filePath: att.filePath,
          fileName: att.fileName,
          isInline: att.isInline || false,
          isExisting: true,
        })) || []

      setMessage(html)
      setAttachments(mapped)
    } catch (err) {
      console.error(err)
      notifyFail('Failed to load note')
    } finally {
      setLoading(false)
    }
  }

  /* ================= NEW ATTACHMENT ================= */
  const handleNewAttachment = (file) => {
    const isImage = file.type.startsWith('image/')

    setAttachments((prev) => [
      ...prev,
      {
        file,
        isInline: isImage,
        isExisting: false,
      },
    ])
  }

  /* ================= REMOVE ATTACHMENT ================= */
  const removeAttachment = (att) => {
    setAttachments((prev) =>
      prev.filter((a) => (att.isExisting ? a.attachmentId !== att.attachmentId : a !== att))
    )
  }

  /* ================= SAVE ================= */
  const executeSave = async () => {
    setLoading(true)

    try {
      const {cleanedHtml, attachments: inlineImages} = processHtmlWithInlineImages(message)

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

      /* ===== Inline rename ===== */
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

      /* ===== New normal files ===== */
      const newFiles = attachments.filter(
        (a) => !a.isExisting && !a.isInline && a.file instanceof File
      )

      /* ===== Existing attachments ===== */
      const existingAttachments = attachments
        .filter((a) => a.isExisting && a.attachmentId && a.filePath)
        .map((a) => ({
          attachmentId: a.attachmentId,
          filePath: a.filePath,
        }))

      const payload = {
        IncidentNotesId: noteData?.incidentNotesId,
        IncidentId: id,
        NotesHtmlContent: updatedHtml,
        ModifiedUserId: userID,
        ModifiedDate: new Date().toISOString(),
        ExistingAttachments: existingAttachments,
        NewAttachments: [...newFiles, ...newInlineAttachments],
      }

      const res = await fetchIncidentNotesUpdateUrl(payload)

      if (res?.isSuccess) {
        notify(res.message)
        onClose()
        fetchNotes?.(id)
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

  /* ================= DOWNLOAD ================= */
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

  const regularFiles = attachments.filter((a) => !a.isInline)

  return (
    <Modal
      backdrop='static'
      keyboard={false}
      show={show}
      onHide={onClose}
      className='addANoteModal application-modal'
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Note</Modal.Title>
        <button type='button' className='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className='text-center py-4'>
            <Spinner animation='border' />
          </div>
        ) : (
          <Form.Group>
            <Form.Label>
              Message <sup className='red'>*</sup>
            </Form.Label>

            {regularFiles.length > 0 && (
              <>
                <h6 className='fw-bold'>Attachments</h6>
                <div className='d-flex flex-wrap gap-2 mb-2'>
                  {regularFiles.map((att, i) => (
                    <div key={i} className='border rounded-pill px-3 py-1 bg-light'>
                      <span className='me-2'>{att.file?.name || att.fileName}</span>
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
              </>
            )}

            <RichTextEditor value={message} onChange={setMessage} onAttach={handleNewAttachment} />
          </Form.Group>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={onClose}>
          Close
        </Button>
        <Button variant='primary' onClick={executeSave} disabled={loading}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default NotesEditModalComponent
