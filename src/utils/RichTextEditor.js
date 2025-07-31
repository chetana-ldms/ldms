// components/RichTextEditor.js
import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './RichTextEditor.css' // <-- important

const quillModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
}

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'image',
]

const RichTextEditor = ({ value, onChange, placeholder = 'Type your reply here...' }) => {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      theme='snow'
      modules={quillModules}
      formats={quillFormats}
    />
  )
}

export default RichTextEditor
