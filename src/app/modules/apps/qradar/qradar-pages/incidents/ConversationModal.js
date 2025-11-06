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
  const [showForwardModal, setShowForwardModal] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [selectedConversationId, setSelectedConversationId] = useState(null)
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
  const handleEditTrail = (mailId) => {}
  const handleForwardTrail = (trailId) => {
    setSelectedConversationId(trailId)
    incidentData.replyForward = false
    setShowForwardModal(true)
  }
  const handleReplyTrail = (trailId) => {
    setSelectedConversationId(trailId)
    incidentData.replyForward = true
    setShowForwardModal(true)
  }
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
  const renderHtmlWithBase64Images = (htmlString) => {
    if (!htmlString) return null

    // Create a DOMParser to parse the HTML content
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/html')

    // Fix all base64 <img> tags if they exist
    doc.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src')
      if (src && src.startsWith('data:image/')) {
        // Already base64 image → let it render directly
        img.setAttribute('src', src)
        img.style.maxWidth = '100%'
        img.style.height = 'auto'
      }
    })

    return {__html: doc.body.innerHTML}
  }
 const renderHtmlWithInlineImages = (htmlContent, attachmentsInBase64) => {
  if (!htmlContent) return {__html: ''}

  let processedHtml = htmlContent

  if (Array.isArray(attachmentsInBase64)) {
    attachmentsInBase64.forEach((att) => {
      const base64Content = att.data || att.fileContent || att.content || ''
      if (att?.contentId && base64Content) {
        const base64Src = `data:${att.fileType || 'image/png'};base64,${base64Content}`
        const cidPattern = new RegExp(`cid:${att.contentId}`, 'g')
        processedHtml = processedHtml.replace(cidPattern, base64Src)
      }
    })
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(processedHtml, 'text/html')

  doc.querySelectorAll('img').forEach((img) => {
    img.style.maxWidth = '100%'
    img.style.height = 'auto'
  })

  return {__html: doc.body.innerHTML}
}
const getFileUrl = (att) => {
  const base64Content = att.data || att.fileContent || att.content || ''
  if (!base64Content) return null

  try {
    const byteCharacters = atob(base64Content)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], {type: att.fileType || 'application/octet-stream'})
    return URL.createObjectURL(blob)
  } catch (err) {
    console.error('Error decoding base64 for file:', att.fileName, err)
    return null
  }
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
                  <div
                    className='mail-body'
                    dangerouslySetInnerHTML={renderHtmlWithInlineImages(
                      mail.htmlCurrent,
                      mail.attachmentsInBase64
                    )}
                  />
                  {Array.isArray(mail.attachmentsInBase64) &&
                    mail.attachmentsInBase64.some((att) => !att.isInline) && (
                      <div className='mt-3'>
                        <strong>Attachments:</strong>
                        <ul className='list-unstyled mt-2'>
                          {mail.attachmentsInBase64
                            .filter((att) => !att.isInline)
                            .map((att, index) => {
                              const fileUrl = `data:${att.fileType};base64,${att.data}`
                              const isPdf = att.fileType === 'application/pdf'
                              const isImage = att.fileType.startsWith('image/')
                              return (
                                <li key={index} className='mb-2'>
                                  {isImage ? (
                                    <div>
                                      <img
                                        src={fileUrl}
                                        alt={att.fileName}
                                        style={{maxWidth: '200px', borderRadius: '5px'}}
                                      />
                                      <div>
                                        <a href={fileUrl} download={att.fileName}>
                                          {att.fileName}
                                        </a>
                                      </div>
                                    </div>
                                  ) : isPdf ? (
                                    <div>
                                      <i className='fa fa-file-pdf text-danger me-2'></i>
                                      <a href={fileUrl} target='_blank' rel='noopener noreferrer'>
                                        {att.fileName}
                                      </a>
                                    </div>
                                  ) : (
                                    <div>
                                      <i className='fa fa-paperclip text-secondary me-2'></i>
                                      <a href={fileUrl} download={att.fileName}>
                                        {att.fileName}
                                      </a>
                                    </div>
                                  )}
                                </li>
                              )
                            })}
                        </ul>
                      </div>
                    )}

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
