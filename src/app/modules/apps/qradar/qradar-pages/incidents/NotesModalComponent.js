import React, {useState, useEffect} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import {
  fetchGroupUsersUrl,
  fetchIncidentNotesAddUrl,
  fetchIncidentNotesUpdateUrl,
  fetchNotesDetailsUrl,
} from '../../../../../api/IncidentsApi'
import AsyncCreatableSelect from 'react-select/async-creatable'
import {notify, notifyFail} from '../components/notification/Notification'
import RichTextEditor from '../../../../../../utils/RichTextEditor'
import makeAnimated from 'react-select/animated'
import {processHtmlWithInlineImages} from './processHtmlWithInlineImages'
import {UsersListLoading} from '../components/loading/UsersListLoading'

const animatedComponents = makeAnimated()

const NotesModalComponent = ({show, mode, noteData, onClose, incidentData, fetchNotes, id}) => {
  const userID = Number(sessionStorage.getItem('userId'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('incidentToolId'))

  const [notifyList, setNotifyList] = useState([])
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState([])
  const [isPrivate, setIsPrivate] = useState(true)
  const [loading, setLoading] = useState(false)
  const [groupUsers, setGroupUsers] = useState([])

  /* -------------------- GROUP USERS -------------------- */
  useEffect(() => {
    const fetchData = async () => {
      if (!orgId || !toolId) return
      try {
        const response = await fetchGroupUsersUrl(orgId, toolId, incidentData?.groupId || 0)
        setGroupUsers(Array.isArray(response?.usersList) ? response.usersList : [])
      } catch (err) {
        console.error(err)
        setGroupUsers([])
      }
    }
    fetchData()
  }, [orgId, toolId, incidentData?.groupId])

  /* -------------------- NOTE DETAILS -------------------- */
  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && noteData?.incidentNotesId) {
      fetchNoteDetails()
    } else {
      setMessage('')
      setAttachments([])
      setNotifyList([])
      setIsPrivate(true)
    }
  }, [mode, noteData])

  const fetchNoteDetails = async () => {
    try {
      setLoading(true)

      const response = await fetchNotesDetailsUrl(noteData.incidentNotesId)
      if (!response) return

      const html = response?.incidentNotes?.notesHtmlContent || ''

      const mappedAttachments =
        response.attachmentsInBase64?.map((att) => ({
          attachmentId: att.attachmentId,
          name: att.fileName,
          size: att.fileSize,
          type: att.fileType,
          filePath: att.filePath,
          fromServer: true,
          isInline: att.isInline,
        })) || []

      setMessage(html)
      setAttachments(mappedAttachments)
    } catch (err) {
      console.error(err)
      notifyFail('Failed to load note details')
    } finally {
      setLoading(false)
    }
  }
  const handleSaveNote = async () => {
    try {
      if (!id || !message || message === '<p><br></p>') {
        notifyFail('Please enter the message')
        return
      }

      const {cleanedHtml, attachments: inlineAttachments} = processHtmlWithInlineImages(message)

      const allAttachments = [...attachments.map((f) => ({file: f})), ...inlineAttachments]

      let response

      if (mode === 'add') {
        response = await fetchIncidentNotesAddUrl({
          IncidentId: id,
          NotesHtmlContent: cleanedHtml,
          IsPriviate: isPrivate,
          CreateUserId: userID,
          CreatedDate: new Date().toISOString(),
          attachments: allAttachments,
          NotifyEmails: notifyList.map((e) => e.value),
        })
      }

      if (mode === 'edit') {
        response = await fetchIncidentNotesUpdateUrl({
          IncidentNotesId: noteData?.incidentNotesId,
          IncidentId: id,
          NotesHtmlContent: cleanedHtml,
          attachments: allAttachments,
          ModifiedUserId: userID,
          ModifiedDate: new Date().toISOString(),
        })
      }

      if (response?.isSuccess) {
        notify(response.message)
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

  const loadEmailOptions = async (inputValue) =>
    groupUsers
      .filter((u) => u?.emailId?.toLowerCase().includes(inputValue.toLowerCase()))
      .map((u) => ({label: u.emailId, value: u.emailId}))
  const handleRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

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

        {/* ✅ Notify To (ONLY ADD MODE) */}
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

          {/* Attachments */}
          {/* Attachments */}
          {attachments.length > 0 && (
            <div className='mb-2'>
              {attachments.map((f, i) => (
                <div key={i} className='d-flex align-items-center justify-content-between'>
                  <a href={f.filePath} target='_blank' rel='noreferrer'>
                    {f.name}
                  </a>

                  {/* ❌ Remove icon (not in view mode) */}
                  {mode !== 'view' && (
                    <Button
                      variant='link'
                      className='text-danger p-0 ms-2'
                      onClick={() => handleRemoveAttachment(i)}
                      title='Remove attachment'
                    >
                      ❌
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ✅ Private (ONLY ADD MODE) */}
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
