import React, {useEffect, useState} from 'react'
import {Modal, Button, Accordion} from 'react-bootstrap'
import {
  fetchIncidentConversationDeleteUrl,
  fetchIncidentConversationUrl,
} from '../../../../../api/IncidentsApi'
import ForwardModal from './ForwardModal'
import ReplyModal from './ReplyModal'

const ConversationModal = ({show, onClose, incidentData}) => {
  const {orgId, toolId, incidentID} = incidentData || {}
  const [conversation, setConversation] = useState([])
  console.log(conversation, 'conversation')

  // States for Reply / Forward modals
  const [showForwardModal, setShowForwardModal] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [selectedConversationId, setSelectedConversationId] = useState(null)

  // Fetch conversations
  const loadConversation = async () => {
    try {
      setConversation([])
      const response = await fetchIncidentConversationUrl(orgId, toolId, incidentID)

      if (response?.isSuccess) {
        setConversation(response?.conversations || [])
      } else {
        console.error('API failed:', response?.message)
        setConversation([])
      }
    } catch (error) {
      console.error('Error fetching conversation:', error)
      setConversation([])
    }
  }

  useEffect(() => {
    if (show && orgId && toolId && incidentID) {
      loadConversation()
    }
  }, [show, orgId, toolId, incidentID])

  // Delete trail
  const handleDeleteTrail = async (conversationId) => {
    if (!conversationId) return
    try {
      const payload = {orgId, toolId, conversationId}
      const response = await fetchIncidentConversationDeleteUrl(payload)
      if (response?.isSuccess) {
        await loadConversation()
      } else {
        console.error('Delete failed:', response?.message)
      }
    } catch (error) {
      console.error('Error deleting conversation trail:', error)
    }
  }
  const handleEditTrail = (mailId) => {
};

  const handleForwardTrail = (trailId) => {
    setSelectedConversationId(trailId)
    incidentData.replyForward = false
    setShowForwardModal(true)
  }

  // Reply trail
  const handleReplyTrail = (trailId) => {
    setSelectedConversationId(trailId)
    incidentData.replyForward = true
    setShowForwardModal(true)
  }

  // Format time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000) // seconds

    if (diff < 60) return `${diff} sec${diff !== 1 ? 's' : ''} ago`
    if (diff < 3600)
      return `${Math.floor(diff / 60)} min${Math.floor(diff / 60) !== 1 ? 's' : ''} ago`
    if (diff < 86400)
      return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) !== 1 ? 's' : ''} ago`
    if (diff < 604800)
      return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) !== 1 ? 's' : ''} ago`

    return date.toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getMailBackgroundClass = (mail) => {
    if (mail.incoming === true) return 'bg-white border'
    if (mail.incoming === false && mail.private === false) return 'bg-primary bg-opacity-10'
    if (mail.incoming === false && mail.private === true) return 'bg-warning bg-opacity-25'
    return 'bg-info bg-opacity-25'
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
        </Modal.Header>
        <Modal.Body>
          <div className='conversation-tab'>
            {conversation?.map((mail, index) => (
              <div
                key={mail.id || index}
                className={`mb-4 p-3 rounded ${getMailBackgroundClass(mail)}`}
              >
                {/* Main header with author + actions */}
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
                  <div className='d-flex align-items-center'>
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
                        className='fa fa-reply text-success me-3'
                        title='Reply'
                        style={{cursor: 'pointer'}}
                        onClick={() => handleReplyTrail(mail.id)}
                      />
                    )}
                    {mail.canFowward && (
                      <i
                        className='fa fa-share text-primary me-3'
                        title='Forward'
                        style={{cursor: 'pointer'}}
                        onClick={() => handleForwardTrail(mail.id)}
                      />
                    )}
                    {mail.canDelete && (
                      <i
                        className='fa fa-trash text-danger'
                        title='Delete'
                        style={{cursor: 'pointer'}}
                        onClick={() => handleDeleteTrail(mail.id)}
                      />
                    )}
                  </div>
                </div>

                {/* Mail details */}
                <div className='ps-5'>
                  {(mail.toEmails || mail.ccEmails || mail.bccEmails) && (
                    <div className='text-muted small mt-2'>
                      {mail.toEmails && (
                        <div>
                          <strong>To:</strong> {mail.toEmails}
                        </div>
                      )}
                      {mail.ccEmails && (
                        <div>
                          <strong>Cc:</strong> {mail.ccEmails}
                        </div>
                      )}
                      {mail.bccEmails && (
                        <div>
                          <strong>Bcc:</strong> {mail.bccEmails}
                        </div>
                      )}
                    </div>
                  )}
                  <div className='mail-body' dangerouslySetInnerHTML={{__html: mail.htmlCurrent}} />
                  {Array.isArray(mail?.attachments) && mail?.attachments?.length > 0 && (
                    <div className='mt-2'>
                      <strong>Attachments:</strong>
                      <ul className='list-unstyled mt-1'>
                        {mail?.attachments?.map((att, aIndex) => (
                          <li key={aIndex}>
                            <a href={att?.url} target='_blank' rel='noopener noreferrer'>
                              {att?.name || att?.fileName || 'Attachment'}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Trails */}
                  {Array.isArray(mail.conversationMailTrailData) &&
                    mail.conversationMailTrailData.length > 0 && (
                      <Accordion className='mt-3'>
                        {mail.conversationMailTrailData.map((trail, tIndex) => (
                          <Accordion.Item
                            eventKey={String(tIndex)}
                            key={tIndex}
                            className={`rounded p-2 ${getMailBackgroundClass(trail)}`}
                          >
                            <Accordion.Header>
                              <div className='d-flex justify-content-between align-items-center w-100'>
                                <span>
                                  {trail.author} - {trail.originalMailHeader}
                                </span>
                              </div>
                            </Accordion.Header>
                            <Accordion.Body>
                              <div className='text-muted small mt-2'>
                                {trail.toEmails && (
                                  <div>
                                    <strong>To:</strong> {trail.toEmails}
                                  </div>
                                )}
                                {trail.ccEmails && (
                                  <div>
                                    <strong>Cc:</strong> {trail.ccEmails}
                                  </div>
                                )}
                                {trail.bccEmails && (
                                  <div>
                                    <strong>Bcc:</strong> {trail.bccEmails}
                                  </div>
                                )}
                              </div>
                              <div
                                className='mail-body'
                                dangerouslySetInnerHTML={{__html: trail.htmlCurrent}}
                              />
                              {Array.isArray(trail?.attachments) && trail?.attachments.length > 0 && (
                                <div className='mt-2'>
                                  <strong>Attachments:</strong>
                                  <ul className='list-unstyled mt-1'>
                                    {trail?.attachments?.map((att, aIndex) => (
                                      <li key={aIndex}>
                                        <a href={att.url} target='_blank' rel='noopener noreferrer'>
                                          {att?.name || att?.fileName || 'Attachment'}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                      </Accordion>
                    )}
                </div>
              </div>
            ))}
          </div>
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
        incidentData={{...incidentData, conversationId: selectedConversationId}}
        onForward={loadConversation}
      />
    </>
  )
}

export default ConversationModal
