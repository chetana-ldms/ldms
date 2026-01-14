import React, {useEffect, useState} from 'react'
import {Modal, Button, Accordion} from 'react-bootstrap'
import {
  fetchIncidentConversationDeleteUrl,
  fetchIncidentConversationUrl,
} from '../../../../../api/IncidentsApi'
import ForwardModal from './ForwardModal'
import {UsersListLoading} from '../components/loading/UsersListLoading'

const ConversationModal = ({show, onClose, incidentData}) => {
  const {orgId, toolId, incidentID} = incidentData || {}

  const [conversation, setConversation] = useState([])
  const [showForwardModal, setShowForwardModal] = useState(false)
  const [selectedConversationId, setSelectedConversationId] = useState(null)
  const [loading, setLoading] = useState(false)

  /* ---------------- LOAD CONVERSATION ---------------- */
  const loadConversation = async () => {
    try {
      setLoading(true)
      setConversation([])

      const res = await fetchIncidentConversationUrl(orgId, toolId, incidentID)

      if (res?.isSuccess) {
        setConversation(res.conversations || [])
      } else {
        console.error(res?.message)
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
  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const getMailBackgroundClass = (mail) => {
    if (mail.incoming === true) return 'bg-white border'
    if (mail.incoming === false && mail.private === false) return 'bg-primary bg-opacity-10'
    if (mail.incoming === false && mail.private === true) return 'bg-warning bg-opacity-25'
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

  /* ---------------- INLINE IMAGE HANDLER ---------------- */
  const renderHtmlWithInlineImages = (html, attachments) => {
    if (!html) return {__html: ''}

    let processedHtml = html

    if (Array.isArray(attachments)) {
      attachments.forEach((att) => {
        if (att.isInline && att.contentId && att.filePath) {
          const cidRegex = new RegExp(`cid:${att.contentId}`, 'g')
          processedHtml = processedHtml.replace(cidRegex, att.filePath)
        }
      })
    }

    return {__html: processedHtml}
  }
   const handleEditTrail = (mailId) => {}

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
                      className='fa fa-edit text-warning me-3'
                      title='Edit'
                      style={{cursor: 'pointer'}}
                      onClick={() => handleEditTrail(mail.id)}
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

              {/* ATTACHMENTS (NON-INLINE ONLY) */}
              {Array.isArray(mail.attachmentsInBase64) &&
                mail.attachmentsInBase64.some((a) => !a.isInline && a.filePath) && (
                  <div className='mt-3'>
                    <strong>Attachments:</strong>
                    <ul className='list-unstyled mt-2'>
                      {mail.attachmentsInBase64
                        .filter((a) => !a.isInline && a.filePath)
                        .map((att, i) => (
                          <li key={i} className='mb-2'>
                            <i className='fa fa-paperclip me-2'></i>
                            <a
                              href={att.filePath}
                              target='_blank'
                              rel='noopener noreferrer'
                              download
                            >
                              {att.fileName}
                            </a>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

              {/* TRAILS */}
              {Array.isArray(mail.conversationMailTrailData) &&
                mail.conversationMailTrailData.length > 0 && (
                  <Accordion className='mt-3'>
                    {mail.conversationMailTrailData.map((trail, idx) => (
                      <Accordion.Item eventKey={String(idx)} key={idx}>
                        <Accordion.Header>
                          {trail.author} - {trail.originalMailHeader}
                        </Accordion.Header>
                        <Accordion.Body>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: trail.htmlCurrent,
                            }}
                          />
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
