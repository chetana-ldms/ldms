import React, {useState, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {
  fetchIncidentNotesAddUrl,
  fetchIncidentNotesUpdateUrl,
} from '../../../../../api/IncidentsApi'
import {notify, notifyFail} from '../components/notification/Notification'

const NotesModalComponent = ({show, mode, noteData, onClose, fetchNotes, id}) => {
  const userID = Number(sessionStorage.getItem('userId'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolID = Number(sessionStorage.getItem('toolID'))
  const date = new Date().toISOString()
  const [noteText, setNoteText] = useState('')
  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && noteData) {
      setNoteText(noteData.notes || '')
    } else {
      setNoteText('')
    }
  }, [noteData, mode])

  const handleSaveNote = async () => {
    try {
      let response

      if (mode === 'add') {
        if (!id) {
          console.warn('Incident ID is missing. Cannot add note.')
          return
        }

        const payload = {
          incidentId: id,
          notes: noteText,
          createUserId: userID,
          createdDate: date,
        }
        response = await fetchIncidentNotesAddUrl(payload)
      } else if (mode === 'edit') {
        const payload = {
          incidentId: id,
          notes: noteText,
          incidentNotesId: noteData?.incidentNotesId,
          updateUserId: userID,
          updateDate: date,
        }
        response = await fetchIncidentNotesUpdateUrl(payload)
      }

      const {isSuccess, message} = response

      if (isSuccess) {
        notify(message)
        setNoteText('')
        onClose()
        if (id && typeof fetchNotes === 'function') {
          fetchNotes(id)
        }
      } else {
        notifyFail(message || 'Something went wrong')
      }
    } catch (err) {
      console.error('Failed to save note:', err)
      notifyFail('Failed to save note')
    }
  }

  return (
    <Modal show={show} onHide={onClose} className='addANoteModal application-modal'>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'add' && 'Add Note'}
          {mode === 'view' && 'View Note'}
          {mode === 'edit' && 'Edit Note'}
        </Modal.Title>
        <button type='button' className='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className='mb-3'>
          <label className='form-label'>Note</label>
          <textarea
            className='form-control'
            rows='5'
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            disabled={mode === 'view'}
          />
        </div>
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
