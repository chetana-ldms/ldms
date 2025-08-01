import React, {useEffect, useState} from 'react'
import {Modal, Button, Accordion} from 'react-bootstrap'
import {fetchIncidentConversationUrl} from '../../../../../api/IncidentsApi'

const ConversationModal = ({show, onClose, incidentData}) => {
  const {orgId, toolId, incidentID} = incidentData || {}
  const [conversation, setConversation] = useState([])
  console.log('conversation', conversation)

  useEffect(() => {
    if (show && orgId && toolId && incidentID) {
      const fetchData = async () => {
        const response = await fetchIncidentConversationUrl(orgId, toolId, incidentID)
        setConversation(response !== undefined ? response : [])
      }
      fetchData()
    }
  }, [show, orgId, toolId, incidentID])

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000) // in seconds

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

  return (
    <Modal show={show} onHide={onClose} size='xl' className='conversationModal application-modal'>
      <Modal.Header closeButton>
        <Modal.Title>Conversation</Modal.Title>
        <button type='button' class='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className='conversation-tab'>
          {conversation.map((mail, index) => (
            <div key={mail.id || index} className='mb-4'>
              <div className='d-flex align-items-center mb-2'>
                <div className='symbol symbol-circle symbol-35px bg-light-primary text-primary fw-bold me-3 p-4'>
                  {mail.author?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <strong>{mail.originalMailHeader}</strong>
                  <div className='text-muted small'>{formatDateTime(mail.createdAt)}</div>
                </div>
              </div>

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
                <div dangerouslySetInnerHTML={{__html: mail.htmlCurrent}} />

                {Array.isArray(mail.conversationMailTrailData) &&
                  mail.conversationMailTrailData.length > 0 && (
                    <Accordion className='mt-3'>
                      {mail.conversationMailTrailData.map((trail, tIndex) => (
                        <Accordion.Item eventKey={String(tIndex)} key={tIndex}>
                          <Accordion.Header>
                            {trail.author} - {trail.originalMailHeader}
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
                            <div dangerouslySetInnerHTML={{__html: trail.htmlCurrent}} />
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
  )
}

export default ConversationModal
