import React, { useEffect, useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import RichTextEditor from '../../../../../../utils/RichTextEditor'
import { fetchIncidentPreviousConversationUrl } from '../../../../../api/IncidentsApi'

const QuotedTextModal = ({ show, onHide, orgId, toolId, incidentID, onSave }) => {
  const [loading, setLoading] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')
  const [previousAttachments, setPreviousAttachments] = useState([])

  useEffect(() => {
    const loadConversation = async () => {
      if (!show) return
      setLoading(true)

      try {
        const response = await fetchIncidentPreviousConversationUrl(orgId, toolId, incidentID)

        if (response?.isSuccess && response?.conversation) {
          const convo = response.conversation
          let html = convo.htmlCurrent || convo.currentMessageText || ''
          const mailTrail = convo.mailTrailText || ''
          const attachments = [
            ...(convo.attachmentsInBase64 || []),
            ...(convo.previousConversationAttachmentsInBase64 || []),
          ]

          setPreviousAttachments(attachments)

          // 🧩 Replace cid: with base64 in HTML for preview only
          let previewHtml = html
          attachments.forEach((file) => {
            if (file?.contentId && file?.data) {
              const cidRegex = new RegExp(`cid:${file.contentId}`, 'g')
              previewHtml = previewHtml.replace(
                cidRegex,
                `data:${file.fileType};base64,${file.data}`
              )
            }
          })

          // 🧹 Clean HTML safely using DOMParser
          const parser = new DOMParser()
          const doc = parser.parseFromString(previewHtml, 'text/html')

          // Remove unwanted alt text and AI labels
          doc.querySelectorAll('img').forEach((img) => {
            img.removeAttribute('alt')
          })
          doc.body.querySelectorAll('*').forEach((node) => {
            node.childNodes.forEach((child) => {
              if (
                child.nodeType === 3 &&
                /AI-generated content may be incorrect/i.test(child.textContent)
              ) {
                child.textContent = ''
              }
            })
          })

          const cleanedHtml = doc.body.innerHTML.trim()

          // 🧩 Combine with mail trail if available
          const formattedHtml = `
            <div>
              ${cleanedHtml}
              ${
                mailTrail
                  ? `<div style="border-left:2px solid #ccc; margin:10px 0 0 10px; padding-left:10px; color:#6c757d;">
                      ${mailTrail}
                    </div>`
                  : ''
              }
            </div>
          `

          setHtmlContent(formattedHtml)
        } else {
          setHtmlContent('<p>No previous conversation found.</p>')
        }
      } catch (err) {
        console.error('Error loading previous conversation:', err)
        setHtmlContent('<p>Error loading conversation.</p>')
      } finally {
        setLoading(false)
      }
    }

    loadConversation()
  }, [show, orgId, toolId, incidentID])

  const handleSave = () => {
    // 🧩 Before sending back — convert inline base64 back to cid references
    let htmlToSend = htmlContent
    previousAttachments.forEach((file) => {
      if (file?.contentId && file?.data) {
        const base64Pattern = new RegExp(
          `data:${file.fileType};base64,${file.data.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
          'g'
        )
        htmlToSend = htmlToSend.replace(base64Pattern, `cid:${file.contentId}`)
      }
    })

    // ✅ Send back as required
    onSave({
      PreviousConversations: htmlToSend,
      PreviousConversations_Attachments: previousAttachments,
    })
    onHide()
  }

  return (
    <Modal show={show} onHide={onHide} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Quoted Text (Previous Conversation)</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className='text-center py-5'>
            <Spinner animation='border' />
          </div>
        ) : (
          <RichTextEditor value={htmlContent} onChange={setHtmlContent} />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Cancel
        </Button>
        <Button variant='primary' onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default QuotedTextModal
