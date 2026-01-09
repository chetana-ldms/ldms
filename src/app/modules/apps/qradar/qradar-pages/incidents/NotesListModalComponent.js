import React, {useEffect, useRef, useState} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import NotesModalComponent from './NotesModalComponent'
import {fetchIncidentNotesListUrl, fetchNotesDeleteUrl} from '../../../../../api/IncidentsApi'
import DeleteConfirmation from '../../../../../../utils/DeleteConfirmation'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './NotesListModalComponent.css'

const NotesListModalComponent = ({show, onClose, id}) => {
  const [notes, setNotes] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState('view')
  const [selectedNote, setSelectedNote] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  // 🔹 expanded state
  const [expandedNotes, setExpandedNotes] = useState({})

  // 🔹 track which notes need "Show more"
  const [overflowNotes, setOverflowNotes] = useState({})

  // 🔹 refs for note content
  const noteRefs = useRef({})

  const toggleExpand = (noteId) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [noteId]: !prev[noteId],
    }))
  }

  const fetchNotes = async (id) => {
    try {
      const result = await fetchIncidentNotesListUrl(id)
      const sortedNotes = Array.isArray(result)
        ? [...result].sort((a, b) => b.incidentNotesId - a.incidentNotesId)
        : []
      setNotes(sortedNotes)
    } catch (error) {
      console.error(error)
      setNotes([])
    }
  }

  useEffect(() => {
    if (!show || !id) {
      setNotes([])
      return
    }
    fetchNotes(id)
  }, [show, id])

  // 🔹 CHECK OVERFLOW AFTER RENDER
  useEffect(() => {
    const overflowMap = {}

    notes.forEach((note) => {
      const el = noteRefs.current[note.incidentNotesId]
      if (el) {
        overflowMap[note.incidentNotesId] = el.scrollHeight > el.clientHeight
      }
    })

    setOverflowNotes(overflowMap)
  }, [notes])

  const handleAddNotesClick = () => {
    setModalMode('add')
    setSelectedNote(null)
    setModalVisible(true)
  }

  const handleViewClick = (note) => {
    setModalMode('view')
    setSelectedNote(note)
    setModalVisible(true)
  }

  const handleEditClick = (note) => {
    setModalMode('edit')
    setSelectedNote(note)
    setModalVisible(true)
  }

  const handleDelete = (item) => {
    setItemToDelete(item)
    setShowConfirmation(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    const data = {
      deleteIncidentNoteId: itemToDelete.incidentNotesId,
      deletedDate: new Date().toISOString(),
      deleteUserId: Number(sessionStorage.getItem('userId')),
      orgId: Number(sessionStorage.getItem('orgId')),
      toolId: Number(sessionStorage.getItem('incidentToolId')),
    }

    try {
      const response = await fetchNotesDeleteUrl(data)
      if (response?.isSuccess) {
        notify(response.message)
        fetchNotes(id)
      } else {
        notifyFail(response.message)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setShowConfirmation(false)
      setItemToDelete(null)
    }
  }

  return (
    <>
      <Modal show={show} onHide={onClose} className='notesListModal application-modal'>
        <ToastContainer />

        <Modal.Header closeButton>
          <Modal.Title>Incident Notes</Modal.Title>
          <button type='button' class='application-modal-close' aria-label='Close'>
            <i className='fa fa-close' />
          </button>
        </Modal.Header>

        <Modal.Body>
          <div className='d-flex justify-content-end mb-3'>
            <button className='btn btn-primary btn-sm' onClick={handleAddNotesClick}>
              <i className='fa fa-plus' /> Add Note
            </button>
          </div>

          {notes.length === 0 && <div className='text-center text-muted'>No notes available</div>}

          {notes.map((note) => (
            <div key={note.incidentNotesId} className='border rounded p-3 mb-3 shadow-sm bg-light'>
              <div className='d-flex justify-content-between align-items-center mb-2'>
                <div className='d-flex align-items-center gap-2'>
                  <strong>{note.createdUser || 'N/A'}</strong>
                  <span className='text-muted'>|</span>
                  <span className='text-muted fs-12'>{getCurrentTimeZone(note.createdDate)}</span>
                </div>

                <div className='d-flex gap-3'>
                  <i className='fa fa-eye cursor' onClick={() => handleViewClick(note)} />
                  <i className='fa fa-pencil cursor' onClick={() => handleEditClick(note)} />
                  <i className='fa fa-trash cursor' onClick={() => handleDelete(note)} />
                </div>
              </div>

              {/* NOTE CONTENT */}
              <div
                ref={(el) => (noteRefs.current[note.incidentNotesId] = el)}
                className={`note-content ${
                  expandedNotes[note.incidentNotesId] ? 'expanded' : 'collapsed'
                }`}
                dangerouslySetInnerHTML={{__html: note.notesHtmlContent}}
              />

              {/* 🔹 SHOW BUTTON ONLY IF OVERFLOW */}
              {overflowNotes[note.incidentNotesId] && (
                <div className='mt-1'>
                  <button
                    className='btn btn-link p-0'
                    onClick={() => toggleExpand(note.incidentNotesId)}
                  >
                    {expandedNotes[note.incidentNotesId] ? '▲ Show less' : '▼ Show more'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <NotesModalComponent
        show={modalVisible}
        mode={modalMode}
        noteData={selectedNote}
        onClose={() => setModalVisible(false)}
        fetchNotes={fetchNotes}
        id={id}
      />

      {showConfirmation && (
        <DeleteConfirmation
          show={showConfirmation}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </>
  )
}

export default NotesListModalComponent
