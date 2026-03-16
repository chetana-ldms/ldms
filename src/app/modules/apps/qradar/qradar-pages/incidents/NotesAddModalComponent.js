import React, {useState, useEffect} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import AsyncCreatableSelect from 'react-select/async-creatable'
import makeAnimated from 'react-select/animated'

import {fetchGroupUsersUrl, fetchIncidentNotesAddUrl} from '../../../../../api/IncidentsApi'

import {notify, notifyFail} from '../components/notification/Notification'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import RichTextEditor from '../../../../../../utils/RichTextEditor'
import {processHtmlWithInlineImages} from './processHtmlWithInlineImages'

const animatedComponents = makeAnimated()

const NotesAddModalComponent = ({show, onClose, incidentData, fetchNotes, id}) => {
  const userID = Number(sessionStorage.getItem('userId'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('incidentToolId'))

  const [notifyList, setNotifyList] = useState([])
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState([])
  const [isPrivate, setIsPrivate] = useState(true)
  const [loading, setLoading] = useState(false)
  const [groupUsers, setGroupUsers] = useState([])

  /* ---------------- RESET ---------------- */
  const resetForm = () => {
    setMessage('')
    setAttachments([])
    setNotifyList([])
    setIsPrivate(true)
  }

  /* ---------------- GROUP USERS ---------------- */
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

  /* ---------------- SAVE ---------------- */
  const handleSaveNote = async () => {
    try {
      if (!id || !message || message === '<p><br></p>') {
        notifyFail('Please enter the message')
        return
      }

      setLoading(true)

      const {cleanedHtml, attachments: inlineAttachments} = processHtmlWithInlineImages(message)

      // ✅ IMPORTANT: raw File → wrap only here
      const finalAttachments = [...attachments.map((f) => ({file: f})), ...inlineAttachments]

      const response = await fetchIncidentNotesAddUrl({
        IncidentId: id,
        NotesHtmlContent: cleanedHtml,
        IsPriviate: isPrivate,
        CreateUserId: userID,
        CreatedDate: new Date().toISOString(),
        attachments: finalAttachments,
        NotifyEmails: notifyList.map((e) => e.value),
      })

      if (response?.isSuccess) {
        notify(response.message)
        resetForm()
        onClose()
        fetchNotes?.(id)
      } else {
        notifyFail(response?.message || 'Something went wrong')
      }
    } catch (err) {
      console.error(err)
      notifyFail('Failed to save note')
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- HELPERS ---------------- */
  const loadEmailOptions = async (inputValue) =>
    groupUsers
      .filter((u) => u?.emailId?.toLowerCase().includes(inputValue.toLowerCase()))
      .map((u) => ({
        label: u.emailId,
        value: u.emailId,
      }))

  const handleRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  /* ---------------- UI ---------------- */
  return (
    <Modal
      backdrop='static'
      keyboard={false}
      show={show}
      onHide={onClose}
      className='addANoteModal application-modal'
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Note</Modal.Title>
        <button type='button' class='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>

      <Modal.Body>
        {loading && <UsersListLoading />}

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

        <Form.Group>
          <Form.Label>
            Message <sup className='red'>*</sup>
          </Form.Label>

          {/* Attachments preview */}
          {attachments.length > 0 && (
            <div className='mb-2'>
              {attachments.map((file, i) => (
                <div key={i} className='d-flex justify-content-between align-items-center'>
                  <span>{file.name}</span>
                  <Button
                    variant='link'
                    className='text-danger p-0'
                    onClick={() => handleRemoveAttachment(i)}
                  >
                    ❌
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className='d-flex justify-content-end mb-2'>
            <Form.Check
              type='checkbox'
              label='Private'
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
          </div>

          {/* ✅ Attach files from editor */}
          <RichTextEditor
            value={message}
            onChange={setMessage}
            onAttach={(file) => setAttachments((prev) => [...prev, file])}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={onClose}>
          Close
        </Button>
        <Button variant='primary' onClick={handleSaveNote}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default NotesAddModalComponent
