import React, {useEffect, useState} from 'react'
import {Modal, Button, Accordion} from 'react-bootstrap'
import {
  fetchIncidentConversationDeleteUrl,
  fetchIncidentConversationUrl,
} from '../../../../../api/IncidentsApi'

import ForwardModal from './ForwardModal'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import DetailsModal from './DetailsModal '
import NotesModalComponent from './NotesModalComponent'
import NotesEditModalComponent from './NotesEditModalComponent'

const ConversationModal = ({show, onClose, incidentData}) => {
  const {orgId, toolId, incidentID} = incidentData || {}

  const [conversation, setConversation] = useState([])
  const [loading, setLoading] = useState(false)

  const [showForwardModal, setShowForwardModal] = useState(false)
  const [selectedConversationId, setSelectedConversationId] = useState(null)
  const [conversationId, setConversationId] = useState(null)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedMail, setSelectedMail] = useState(null)
  console.log('selectedMail', selectedMail)

  /* ---------------- LOAD CONVERSATION ---------------- */
  const loadConversation = async () => {
    try {
      setLoading(true)
      setConversation([])

      const res = await fetchIncidentConversationUrl(orgId, toolId, incidentID)
      if (res?.isSuccess) {
        setConversation(res.conversations || [])
      }
    } catch (err) {
      console.error('Conversation load failed', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (show && orgId && toolId && incidentID) {
      loadConversation()
    }
  }, [show, orgId, toolId, incidentID])

  /* ---------------- HELPERS ---------------- */
  const formatDateTime = (dateString) =>
    new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

  const getMailBackgroundClass = (mail) => {
    if (mail.incoming) return 'bg-white border'
    if (!mail.incoming && !mail.private) return 'bg-primary bg-opacity-10'
    if (!mail.incoming && mail.private) return 'bg-warning bg-opacity-25'
    return 'bg-info bg-opacity-25'
  }

  /* ---------------- DELETE ---------------- */
  const handleDeleteTrail = async (conversationId) => {
    try {
      const payload = {
        orgId,
        toolId,
        conversationId,
        deleteUserId: Number(sessionStorage.getItem('userId')),
        deletedDate: new Date().toISOString(),
      }
      const res = await fetchIncidentConversationDeleteUrl(payload)
      if (res?.isSuccess) loadConversation()
    } catch (err) {
      console.error(err)
    }
  }

  /* ---------------- FORWARD / REPLY ---------------- */
  const handleForwardTrail = (id, isReply) => {
    setSelectedConversationId(id)
    incidentData.replyForward = isReply
    setShowForwardModal(true)
  }

  /* ---------------- EDIT HANDLER ---------------- */
  const handleEditTrail = (mail) => {
    setSelectedMail(mail)

    if (mail.type === 'Incident Notes') {
      setShowNotesModal(true)
      setConversationId(mail.id)
    }

    if (mail.type === 'Incident') {
      setShowDetailsModal(true)
    }
  }

  /* ---------------- INLINE IMAGE HANDLER ---------------- */
  const renderHtmlWithInlineImages = (html, attachments) => {
    let processedHtml = html || ''

    attachments?.forEach((att) => {
      if (att.isInline && att.contentId && att.filePath) {
        processedHtml = processedHtml.replace(new RegExp(`cid:${att.contentId}`, 'g'), att.filePath)
      }
    })

    return {__html: processedHtml}
  }

  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        size='xl'
        scrollable
        className='conversationModal application-modal'
      >
        <Modal.Header closeButton>
          <Modal.Title>Conversation</Modal.Title>
          <button type='button' class='application-modal-close' aria-label='Close'>
            <i className='fa fa-close' />
          </button>
        </Modal.Header>

        <Modal.Body>
          {loading && <UsersListLoading />}

          {conversation.map((mail) => (
            <div key={mail.id} className={`mb-4 p-3 rounded ${getMailBackgroundClass(mail)}`}>
              {/* HEADER */}
              <div className='d-flex justify-content-between align-items-center mb-2'>
                <div className='d-flex align-items-center'>
                  <div className='symbol symbol-circle symbol-35px bg-light-primary text-primary fw-bold me-3 p-4'>
                    {mail.author?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <strong>{mail.originalMailHeader}</strong>
                    <div className='text-muted small'>{formatDateTime(mail.createdAt)}</div>
                  </div>
                </div>

                <div className='d-flex gap-3'>
                  {mail.canEdit && (
                    <i
                      className='fa fa-edit text-warning'
                      title='Edit'
                      style={{cursor: 'pointer'}}
                      onClick={() => handleEditTrail(mail)}
                    />
                  )}

                  {mail.canReply && (
                    <i
                      className='fa fa-reply text-success cursor'
                      title='Reply'
                      onClick={() => handleForwardTrail(mail.id, true)}
                    />
                  )}

                  {mail.canFowward && (
                    <i
                      className='fa fa-share text-primary cursor'
                      title='Forward'
                      onClick={() => handleForwardTrail(mail.id, false)}
                    />
                  )}

                  {mail.canDelete && (
                    <i
                      className='fa fa-trash text-danger cursor'
                      title='Delete'
                      onClick={() => handleDeleteTrail(mail.id)}
                    />
                  )}
                </div>
              </div>

              {/* BODY */}
              <div
                className='mail-body'
                dangerouslySetInnerHTML={renderHtmlWithInlineImages(
                  mail.htmlCurrent,
                  mail.attachmentsInBase64
                )}
              />

              {/* ATTACHMENTS */}
              {mail.attachmentsInBase64?.some((a) => !a.isInline) && (
                <div className='mt-3'>
                  <strong>Attachments:</strong>
                  <ul className='list-unstyled mt-2'>
                    {mail.attachmentsInBase64
                      .filter((a) => !a.isInline)
                      .map((att, i) => (
                        <li key={i}>
                          <a href={att.filePath} target='_blank' rel='noreferrer'>
                            {att.fileName}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* TRAILS */}
              {mail.conversationMailTrailData?.length > 0 && (
                <Accordion className='mt-3'>
                  {mail.conversationMailTrailData.map((trail, idx) => (
                    <Accordion.Item eventKey={String(idx)} key={idx}>
                      <Accordion.Header>
                        {trail.author} - {trail.originalMailHeader}
                      </Accordion.Header>
                      <Accordion.Body>
                        <div dangerouslySetInnerHTML={{__html: trail.htmlCurrent}} />
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
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

      {/* NOTES MODAL */}
      {showNotesModal && selectedMail && (
        <NotesEditModalComponent
          show={showNotesModal}
          mode='edit'
          conversationId={selectedMail?.id}
          incidentData={incidentData}
          id={incidentID}
          fetchNotes={loadConversation}
          onClose={() => {
            setShowNotesModal(false)
            setSelectedMail(null)
          }}
        />
      )}

      {/* DETAILS MODAL */}
      {showDetailsModal && selectedMail && (
        <DetailsModal
          show={showDetailsModal}
          incidentData={incidentData}
          incidentId={incidentID}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedMail(null)
          }}
          onUpdated={loadConversation}
        />
      )}

      {/* FORWARD MODAL */}
      <ForwardModal
        show={showForwardModal}
        onHide={() => setShowForwardModal(false)}
        incidentData={{
          ...incidentData,
          conversationId: selectedConversationId,
        }}
        onForward={loadConversation}
      />
    </>
  )
}

export default ConversationModal
