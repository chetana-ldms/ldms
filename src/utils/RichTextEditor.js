// components/RichTextEditor.js
import React, {useRef, useMemo} from 'react'
import ReactQuill, {Quill} from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './RichTextEditor.css'
import ImageResize from 'quill-image-resize-module-react'

Quill.register('modules/imageResize', ImageResize)

const RichTextEditor = ({value, onChange, onAttach}) => {
  const quillRef = useRef(null)
  const fileInputRef = useRef(null)

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{header: [1, 2, false]}],
          ['bold', 'italic', 'underline'],
          [{list: 'ordered'}, {list: 'bullet'}],
          ['link', 'image'],
          ['attachment'],
          ['clean'],
        ],
        handlers: {
          attachment: () => {
            if (fileInputRef.current) {
              fileInputRef.current.value = ''
              fileInputRef.current.click()
            }
          },
        },
      },
      imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
      },
    }),
    []
  )

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    if (typeof onAttach === 'function') {
      onAttach(file)
    }
    e.target.value = ''
  }

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        theme='snow'
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder='Type your reply here...'
      />
      <input
        ref={fileInputRef}
        type='file'
        accept='.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg'
        style={{display: 'none'}}
        onChange={handleFileChange}
      />
    </div>
  )
}

export default RichTextEditor
