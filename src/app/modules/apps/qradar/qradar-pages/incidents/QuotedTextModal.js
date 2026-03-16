import React, {useEffect, useState} from 'react'
import {Modal, Button, Spinner} from 'react-bootstrap'
import RichTextEditor from '../../../../../../utils/RichTextEditor'
import {fetchIncidentPreviousConversationUrl} from '../../../../../api/IncidentsApi'

const QuotedTextModal = ({show, onHide, orgId, toolId, incidentID, onSave}) => {
  const [loading, setLoading] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')
  const [previousAttachments, setPreviousAttachments] = useState([])
  const [noConversation, setNoConversation] = useState(false)

  useEffect(() => {
    const loadConversation = async () => {
      if (!show) return
      setLoading(true)
      setNoConversation(false)
      setHtmlContent('')

      try {
        const response = await fetchIncidentPreviousConversationUrl(orgId, toolId, incidentID)

        if (response?.isSuccess && response?.conversation) {
          const convo = response.conversation
          let html = convo.htmlCurrent || convo.currentMessageText || ''
          let mailTrail = convo.mailTrailText || ''

          const attachments = [
            ...(convo.attachmentsInBase64 || []),
            ...(convo.previousConversationAttachmentsInBase64 || []),
          ]
          setPreviousAttachments(attachments)

          // Replace cid references with base64 previews
          const replaceCidWithBase64 = (content) => {
            let updated = content
            attachments.forEach((file) => {
              if (file?.contentId && file?.data) {
                const cidRegex = new RegExp(`cid:${file.contentId}`, 'g')
                updated = updated.replace(cidRegex, `data:${file.fileType};base64,${file.data}`)
              }
            })
            return updated
          }

          let previewHtml = replaceCidWithBase64(html)
          mailTrail = replaceCidWithBase64(mailTrail)

          // Clean AI alt text
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

          if (!cleanedHtml && !mailTrail) {
            setNoConversation(true)
            return
          }

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
          setNoConversation(true)
        }
      } catch (err) {
        console.error('Error loading previous conversation:', err)
        setNoConversation(true)
      } finally {
        setLoading(false)
      }
    }

    loadConversation()
  }, [show, orgId, toolId, incidentID])

  // Convert base64 → File
  const base64ToFile = (base64, fileName, mimeType) => {
    const byteCharacters = atob(base64)
    const byteArrays = []
    const sliceSize = 512
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize)
      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i)
      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }
    const blob = new Blob(byteArrays, {type: mimeType})
    return new File([blob], fileName, {type: mimeType})
  }

  const handleSave = () => {
    let htmlToSend = htmlContent
    const updatedAttachments = []
    let cidCounter = 100

    previousAttachments.forEach((file) => {
      if (file?.data && file?.fileType) {
        const newCid = `inline_${cidCounter}.png`
        cidCounter++

        // Replace base64 in HTML with cid
        const escapedData = file.data.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const base64Pattern = new RegExp(`data:${file.fileType};base64,${escapedData}`, 'g')
        htmlToSend = htmlToSend.replace(base64Pattern, `cid:${newCid}`)

        const newFile = base64ToFile(file.data, newCid, file.fileType)
        updatedAttachments.push({file: newFile, ContentId: newCid})
      }
    })

    onSave({
      PreviousConversations: htmlToSend,
      PreviousConversations_Attachments: updatedAttachments,
    })

    onHide()
  }

  return (
    <Modal
      backdrop='static'
      keyboard={false}
      show={show}
      onHide={onHide}
      className='quotedTextModal application-modal'
    >
      <Modal.Header closeButton>
        <Modal.Title>Previous Conversation</Modal.Title>
        <button type='button' class='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className='text-center py-5'>
            <Spinner animation='border' />
          </div>
        ) : noConversation ? (
          <div className='text-center text-muted py-4'>No previous conversation found.</div>
        ) : (
          <RichTextEditor value={htmlContent} onChange={setHtmlContent} />
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Cancel
        </Button>
        {!noConversation && (
          <Button variant='primary' onClick={handleSave}>
            Add
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default QuotedTextModal
