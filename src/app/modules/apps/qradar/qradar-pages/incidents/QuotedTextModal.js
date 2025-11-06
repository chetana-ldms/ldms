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
        let mailTrail = convo.mailTrailText || ''

        // Combine current + previous attachments
        const attachments = [
          ...(convo.attachmentsInBase64 || []),
          ...(convo.previousConversationAttachmentsInBase64 || []),
        ]
        setPreviousAttachments(attachments)

        // ✅ Replace cid references in BOTH html and mailTrail
        const replaceCidWithBase64 = (content) => {
          let updatedContent = content
          attachments.forEach((file) => {
            if (file?.contentId && file?.data) {
              const cidRegex = new RegExp(`cid:${file.contentId}`, 'g')
              updatedContent = updatedContent.replace(
                cidRegex,
                `data:${file.fileType};base64,${file.data}`
              )
            }
          })
          return updatedContent
        }

        // Apply replacements to both parts
        let previewHtml = replaceCidWithBase64(html)
        mailTrail = replaceCidWithBase64(mailTrail)

        // 🧹 Clean unwanted alt or "AI-generated" text
        const parser = new DOMParser()
        const doc = parser.parseFromString(previewHtml, 'text/html')
        doc.querySelectorAll('img').forEach((img) => img.removeAttribute('alt'))
        doc.querySelectorAll('*').forEach((node) => {
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

        // ✅ Combine cleaned main + mail trail (now with inline images)
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


  // 🧩 Handle Save — consistent with ReplyModal’s attachments/notes structure
  const handleSave = () => {
    let htmlToSend = htmlContent

    // Replace base64 previews back to cid references
    previousAttachments.forEach((file) => {
      if (file?.contentId && file?.data) {
        const base64Pattern = new RegExp(
          `data:${file.fileType};base64,${file.data.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
          'g'
        )
        htmlToSend = htmlToSend.replace(base64Pattern, `cid:${file.contentId}`)
      }
    })

    // Filter only used inline attachments
    const usedAttachments = previousAttachments.filter(
      (file) => file?.contentId && htmlToSend.includes(`cid:${file.contentId}`)
    )

    // 🧩 Convert base64 → real File objects for sending (just like ReplyModal attachments)
    const convertedFiles = usedAttachments.map((file) => {
      const byteString = atob(file.data)
      const mimeType = file.fileType || 'image/png'
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      const blob = new Blob([ab], { type: mimeType })
      const fileName = file.fileName || file.contentId || 'inline_image.png'
      return new File([blob], fileName, { type: mimeType })
    })

    // ✅ Return same structure as ReplyModal expects
    onSave({
      PreviousConversations: htmlToSend,
      PreviousConversations_Attachments: convertedFiles,
    })
    onHide()
  }

  return (
    <Modal show={show} onHide={onHide} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Previous Conversation</Modal.Title>
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
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default QuotedTextModal
