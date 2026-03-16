import React, {useEffect, useRef, useState} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import NotesAddModalComponent from './NotesAddModalComponent'
import NotesEditModalComponent from './NotesEditModalComponent'
import {fetchIncidentNotesListUrl, fetchNotesDeleteUrl} from '../../../../../api/IncidentsApi'
import DeleteConfirmation from '../../../../../../utils/DeleteConfirmation'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './NotesListModalComponent.css'

const NotesListModalComponent = ({show, onClose, id, incidentData}) => {
  const [notes, setNotes] = useState([])

  // 🔹 modal control
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [modalMode, setModalMode] = useState('view')
  const [selectedNote, setSelectedNote] = useState(null)

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const [searchText, setSearchText] = useState('')
  const [expandedNotes, setExpandedNotes] = useState({})
  const [overflowNotes, setOverflowNotes] = useState({})
  const noteRefs = useRef({})

  /* ---------------- FETCH NOTES ---------------- */
  const fetchNotes = async (id) => {
    try {
      const result = await fetchIncidentNotesListUrl(id)
      const sorted = Array.isArray(result)
        ? [...result].sort((a, b) => b.incidentNotesId - a.incidentNotesId)
        : []
      setNotes(sorted)
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

  /* ---------------- SEARCH ---------------- */
  const stripHtml = (html) => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }

  const filteredNotes = notes.filter((note) => {
    if (!searchText.trim()) return true
    const text = stripHtml(note.notesHtmlContent || '').toLowerCase()
    return text.includes(searchText.toLowerCase())
  })

  /* ---------------- OVERFLOW ---------------- */
  useEffect(() => {
    const map = {}
    notes.forEach((note) => {
      const el = noteRefs.current[note.incidentNotesId]
      if (el) map[note.incidentNotesId] = el.scrollHeight > el.clientHeight
    })
    setOverflowNotes(map)
  }, [notes])

  const toggleExpand = (id) => {
    setExpandedNotes((p) => ({...p, [id]: !p[id]}))
  }

  /* ---------------- ACTIONS ---------------- */
  const handleAdd = () => {
    setShowAddModal(true)
  }

  const handleView = (note) => {
    setSelectedNote(note)
    setModalMode('view')
    setShowEditModal(true)
  }

  const handleEdit = (note) => {
    setSelectedNote(note)
    setModalMode('edit')
    setShowEditModal(true)
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
      const res = await fetchNotesDeleteUrl(data)
      if (res?.isSuccess) {
        notify(res.message)
        fetchNotes(id)
      } else notifyFail(res.message)
    } catch (e) {
      console.error(e)
    } finally {
      setShowConfirmation(false)
      setItemToDelete(null)
    }
  }

  /* ---------------- UI ---------------- */
  return (
    <>
      <Modal
        backdrop='static'
        keyboard={false}
        show={show}
        onHide={onClose}
        className='notesListModal application-modal'
      >
        <ToastContainer />

        <Modal.Header closeButton>
          <Modal.Title>Incident Notes</Modal.Title>
          <button type='button' class='application-modal-close' aria-label='Close'>
            <i className='fa fa-close' />
          </button>
        </Modal.Header>

        <Modal.Body>
          <Form.Control
            type='text'
            placeholder='Search notes...'
            className='mb-3'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <div className='d-flex justify-content-end mb-3'>
            <button className='btn btn-primary btn-sm' onClick={handleAdd}>
              <i className='fa fa-plus' /> Add Note
            </button>
          </div>

          {filteredNotes.length === 0 && (
            <div className='text-center text-muted'>No matching notes found</div>
          )}

          {filteredNotes.map((note) => (
            <div key={note.incidentNotesId} className='border rounded p-3 mb-3 shadow-sm bg-light'>
              <div className='d-flex justify-content-between mb-2'>
                <div>
                  <strong>{note.createdUser || 'N/A'}</strong>
                  <span className='mx-2'>|</span>
                  <span className='text-muted fs-12'>{getCurrentTimeZone(note.createdDate)}</span>
                </div>

                <div className='d-flex gap-3'>
                  <i className='fa fa-eye cursor' onClick={() => handleView(note)} />
                  <i className='fa fa-pencil cursor' onClick={() => handleEdit(note)} />
                  <i className='fa fa-trash cursor' onClick={() => handleDelete(note)} />
                </div>
              </div>

              <div
                ref={(el) => (noteRefs.current[note.incidentNotesId] = el)}
                className={`note-content ${
                  expandedNotes[note.incidentNotesId] ? 'expanded' : 'collapsed'
                }`}
                dangerouslySetInnerHTML={{__html: note.notesHtmlContent}}
              />

              {overflowNotes[note.incidentNotesId] && (
                <button
                  className='btn btn-link p-0 mt-1'
                  onClick={() => toggleExpand(note.incidentNotesId)}
                >
                  {expandedNotes[note.incidentNotesId] ? '▲ Show less' : '▼ Show more'}
                </button>
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

      {/* ✅ ADD MODAL */}
      <NotesAddModalComponent
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        id={id}
        incidentData={incidentData}
        fetchNotes={fetchNotes}
      />

      {/* ✅ EDIT / VIEW MODAL */}
      <NotesEditModalComponent
        show={showEditModal}
        mode={modalMode}
        noteData={selectedNote}
        onClose={() => setShowEditModal(false)}
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
