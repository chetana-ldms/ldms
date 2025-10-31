import React, { useEffect, useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import RichTextEditor from '../../../../../../utils/RichTextEditor'
import { fetchIncidentPreviousConversationUrl } from '../../../../../api/IncidentsApi'

const QuotedTextModal = ({ show, onHide, orgId, toolId, incidentID, onSave }) => {
  const [loading, setLoading] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')

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

          // 🧩 Replace cid: with base64 data
          attachments.forEach((file) => {
            if (file?.contentId && file?.data) {
              const cidRegex = new RegExp(`cid:${file.contentId}`, 'g')
              html = html.replace(cidRegex, `data:${file.fileType};base64,${file.data}`)
            }
          })

          // 🧹 Clean HTML safely using DOMParser
          const parser = new DOMParser()
          const doc = parser.parseFromString(html, 'text/html')

          // Remove any alt text or stray descriptive text containing "AI-generated"
          doc.querySelectorAll('img').forEach((img) => {
            img.removeAttribute('alt')
          })

          // Remove any text nodes containing the unwanted AI note
          doc.body.querySelectorAll('*').forEach((node) => {
            if (node.childNodes) {
              node.childNodes.forEach((child) => {
                if (
                  child.nodeType === 3 &&
                  /AI-generated content may be incorrect/i.test(child.textContent)
                ) {
                  child.textContent = ''
                }
              })
            }
          })

          // Get clean HTML
          const cleanedHtml = doc.body.innerHTML.trim()

          // 🧩 Combine with mail trail if exists
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
    onSave(htmlContent)
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
