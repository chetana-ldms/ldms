import React, {useState, useEffect} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import {
  fetchGroupUsersUrl,
  fetchIncidentNotesAddUrl,
  fetchIncidentNotesUpdateUrl,
  fetchNotesDetailsUrl,
  fetchIncidenttNotesByIncidentByConversationIdUrl,
} from '../../../../../api/IncidentsApi'
import AsyncCreatableSelect from 'react-select/async-creatable'
import makeAnimated from 'react-select/animated'
import {notify, notifyFail} from '../components/notification/Notification'
import RichTextEditor from '../../../../../../utils/RichTextEditor'
import {processHtmlWithInlineImages} from './processHtmlWithInlineImages'
import {UsersListLoading} from '../components/loading/UsersListLoading'

const animatedComponents = makeAnimated()

const NotesModalComponent = ({
  show,
  mode,
  noteData,
  onClose,
  incidentData,
  fetchNotes,
  id,
  conversationId,
}) => {
  const userID = Number(sessionStorage.getItem('userId'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('incidentToolId'))

  const [notifyList, setNotifyList] = useState([])
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState([])
  const [isPrivate, setIsPrivate] = useState(true)
  const [loading, setLoading] = useState(false)
  const [groupUsers, setGroupUsers] = useState([])

  /* -------------------- RESET FORM -------------------- */
  const resetForm = () => {
    setMessage('')
    setAttachments([])
    setNotifyList([])
    setIsPrivate(true)
  }

  /* -------------------- GROUP USERS -------------------- */
  useEffect(() => {
    const fetchUsers = async () => {
      if (!orgId || !toolId) return
      try {
        const res = await fetchGroupUsersUrl(orgId, toolId, incidentData?.groupId || 0)
        setGroupUsers(Array.isArray(res?.usersList) ? res.usersList : [])
      } catch (err) {
        console.error(err)
        setGroupUsers([])
      }
    }
    fetchUsers()
  }, [orgId, toolId, incidentData?.groupId])

  /* -------------------- LOAD NOTE -------------------- */
  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      loadNoteDetails()
    } else {
      resetForm()
    }
  }, [mode, noteData, conversationId])

  const loadNoteDetails = async () => {
    try {
      setLoading(true)

      let incidentNotesId = noteData?.incidentNotesId

      if (conversationId) {
        const convRes = await fetchIncidenttNotesByIncidentByConversationIdUrl(conversationId)
        incidentNotesId = convRes?.incidentNotesId
      }

      if (!incidentNotesId) return

      const response = await fetchNotesDetailsUrl(incidentNotesId)
      if (!response) return

      setMessage(response?.incidentNotes?.notesHtmlContent || '')

      const mappedAttachments =
        response?.attachmentsInBase64?.map((att) => ({
          attachmentId: att.attachmentId,
          name: att.fileName,
          size: att.fileSize,
          type: att.fileType,
          filePath: att.filePath,
          fromServer: true,
          isInline: att.isInline,
        })) || []

      setAttachments(mappedAttachments)
    } catch (err) {
      console.error(err)
      notifyFail('Failed to load note')
    } finally {
      setLoading(false)
    }
  }

  /* -------------------- SAVE NOTE -------------------- */
  const handleSaveNote = async () => {
    try {
      if (!id || !message || message === '<p><br></p>') {
        notifyFail('Please enter the message')
        return
      }

      const {cleanedHtml, attachments: inlineAttachments} = processHtmlWithInlineImages(message)

      const finalAttachments = [...attachments.map((f) => ({file: f})), ...inlineAttachments]

      let response

      if (mode === 'add') {
        response = await fetchIncidentNotesAddUrl({
          IncidentId: id,
          NotesHtmlContent: cleanedHtml,
          IsPriviate: isPrivate,
          CreateUserId: userID,
          CreatedDate: new Date().toISOString(),
          attachments: finalAttachments,
          NotifyEmails: notifyList.map((e) => e.value),
        })
      }

      if (mode === 'edit') {
        response = await fetchIncidentNotesUpdateUrl({
          IncidentNotesId: noteData?.incidentNotesId,
          IncidentId: id,
          NotesHtmlContent: cleanedHtml,
          attachments: finalAttachments,
          ModifiedUserId: userID,
          ModifiedDate: new Date().toISOString(),
        })
      }

      if (response?.isSuccess) {
        notify(response.message)

        resetForm() // ✅ clear inputs after success
        onClose()
        fetchNotes?.(id)
      } else {
        notifyFail(response?.message || 'Something went wrong')
      }
    } catch (err) {
      console.error(err)
      notifyFail('Failed to save note')
    }
  }

  /* -------------------- HELPERS -------------------- */
  const loadEmailOptions = async (inputValue) =>
    groupUsers
      .filter((u) => u?.emailId?.toLowerCase().includes(inputValue.toLowerCase()))
      .map((u) => ({label: u.emailId, value: u.emailId}))

  const handleRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  /* -------------------- UI -------------------- */
  return (
    <Modal show={show} onHide={onClose} className='addANoteModal application-modal'>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'add' && 'Add Note'}
          {mode === 'edit' && 'Edit Note'}
          {mode === 'view' && 'View Note'}
        </Modal.Title>
        <button type='button' class='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>

      <Modal.Body>
        {loading && <UsersListLoading />}

        {mode === 'add' && (
          <Form.Group className='mb-3 row'>
            <Form.Label className='col-md-2'>Notify To</Form.Label>
            <div className='col-md-10'>
              <AsyncCreatableSelect
                isMulti
                loadOptions={loadEmailOptions}
                components={{...animatedComponents, DropdownIndicator: () => null}}
                value={notifyList}
                onChange={setNotifyList}
              />
            </div>
          </Form.Group>
        )}

        <Form.Group>
          <Form.Label>
            Message <sup className='red'>*</sup>
          </Form.Label>

          {attachments.length > 0 && (
            <div className='mb-2'>
              {attachments.map((f, i) => (
                <div key={i} className='d-flex justify-content-between align-items-center'>
                  <a href={f.filePath} target='_blank' rel='noreferrer'>
                    {f.name}
                  </a>

                  {mode !== 'view' && (
                    <Button
                      variant='link'
                      className='text-danger p-0'
                      onClick={() => handleRemoveAttachment(i)}
                    >
                      ❌
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {mode === 'add' && (
            <div className='d-flex justify-content-end mb-2'>
              <Form.Check
                type='checkbox'
                label='Private'
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
            </div>
          )}

          <RichTextEditor
            value={message}
            onChange={setMessage}
            onAttach={(f) => mode !== 'view' && setAttachments((p) => [...p, f])}
            readOnly={mode === 'view'}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={onClose}>
          Close
        </Button>
        {(mode === 'add' || mode === 'edit') && (
          <Button variant='primary' onClick={handleSaveNote}>
            Save
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default NotesModalComponent
