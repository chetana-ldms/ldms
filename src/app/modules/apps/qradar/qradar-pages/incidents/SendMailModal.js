import React, {useEffect, useState} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import {
  fetchEmailSearchUrl,
  fetchReplyIncidentUrl,
  fetchSendMailUrl,
} from '../../../../../api/IncidentsApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // Rich editor styles
import RichTextEditor from '../../../../../../utils/RichTextEditor'
import AsyncCreatableSelect from 'react-select/async-creatable'
import makeAnimated from 'react-select/animated'
import {fetchMasterData} from '../../../../../api/Api'
import Select from 'react-select'

const animatedComponents = makeAnimated()

const SendMailModal = ({show, onHide, onSend}) => {
  const userID = Number(sessionStorage.getItem('userId'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [cc, setCc] = useState([])
  const [bcc, setBcc] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [dropdownData, setDropdownData] = useState({
    FreshDesk_Support_Mails: [],
  })
  const {FreshDesk_Support_Mails} = dropdownData

  const handleSend = async () => {
    if (!to || !subject || !message || message === '<p><br></p>') {
      notifyFail('Please fill all required fields')
      return
    }
    const data = {
      sendMailDateTime: new Date().toISOString(),
      orgId,
      toolId,
      body: message,
      email: to?.value || '',
      subject,
      //   fromEmail: from?.value?.match(/\(([^)]+)\)/)?.[1] || from?.value || '',
      ccEmails: cc.map((e) => e.value),
      bccEmails: bcc.map((e) => e.value),
      userId: userID,
    }
    try {
      setLoading(true)
      const response = await fetchSendMailUrl(data)
      const {isSuccess, message: responseMessage} = response
      if (isSuccess) {
        notify(responseMessage)
        handleClose()
        onSend()
      } else {
        notifyFail(responseMessage)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFrom('')
    setTo('')
    setSubject('')
    setCc([])
    setBcc([])
    setMessage('')
    onHide()
  }

  const loadEmailOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 1) return []
    const response = await fetchEmailSearchUrl(orgId, toolId, inputValue)
    if (!response || !Array.isArray(response)) return []
    return response.map((email) => ({label: email, value: email}))
  }

  const customStyles = {
    control: (base) => ({...base, minHeight: '40px'}),
    menu: (base) => ({...base, zIndex: 9999}),
  }
  useEffect(() => {
    const fetchAllMasterData = async () => {
      const supportEmailRequestData = {
        maserDataType: 'FreshDesk_Support_Mails',
        orgId: orgId,
        toolId: toolId,
      }
      try {
        const [supportEmail] = await Promise.all([fetchMasterData(supportEmailRequestData)])

        setDropdownData((prevDropdownData) => ({
          ...prevDropdownData,
          FreshDesk_Support_Mails: supportEmail,
        }))
      } catch (error) {
        console.log(error)
      }
    }

    fetchAllMasterData()
  }, [])

  return (
    <Modal show={show} onHide={handleClose} className='sendMailModal application-modal' size='lg'>
      <ToastContainer />
      <Modal.Header closeButton>
        <Modal.Title>Send Mail</Modal.Title>
        <button type='button' className='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className='mb-1 row align-items-center'>
            <Form.Label className='col-md-2 col-form-label'>From</Form.Label>
            <div className='col-md-10'>
              <Select
                options={
                  FreshDesk_Support_Mails?.map((item) => ({
                    label: item.dataValue,
                    value: item.dataValue,
                  })) || []
                }
                value={from}
                onChange={(selected) => setFrom(selected)}
                placeholder='Select sender email'
                components={{DropdownIndicator: () => null}}
                styles={customStyles}
              />
            </div>
          </Form.Group>

          <Form.Group className='mb-1 row align-items-center'>
            <Form.Label className='col-md-2 col-form-label'>
              To <sup className='red'>*</sup>
            </Form.Label>
            <div className='col-md-10'>
              <AsyncCreatableSelect
                cacheOptions
                defaultOptions
                loadOptions={loadEmailOptions}
                components={{...animatedComponents, DropdownIndicator: () => null}}
                styles={customStyles}
                value={to}
                onChange={(selected) => setTo(selected)}
                placeholder='Search or type recipient email'
              />
            </div>
          </Form.Group>

          <Form.Group className='mb-1 row align-items-center'>
            <Form.Label className='col-md-2 col-form-label'>
              Subject <sup className='red'>*</sup>
            </Form.Label>
            <div className='col-md-10'>
              <Form.Control
                type='text'
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder='Subject'
              />
            </div>
          </Form.Group>

          <Form.Group className='mb-1 row align-items-center'>
            <Form.Label className='col-md-2 col-form-label'>Cc</Form.Label>
            <div className='col-md-10'>
              <AsyncCreatableSelect
                isMulti
                cacheOptions
                defaultOptions
                loadOptions={loadEmailOptions}
                components={{...animatedComponents, DropdownIndicator: () => null}}
                styles={customStyles}
                value={cc}
                onChange={setCc}
                placeholder='Type or search email'
              />
            </div>
          </Form.Group>

          <Form.Group className='mb-1 row align-items-center'>
            <Form.Label className='col-md-2 col-form-label'>Bcc</Form.Label>
            <div className='col-md-10'>
              <AsyncCreatableSelect
                isMulti
                cacheOptions
                defaultOptions
                loadOptions={loadEmailOptions}
                components={{...animatedComponents, DropdownIndicator: () => null}}
                styles={customStyles}
                value={bcc}
                onChange={setBcc}
                placeholder='Type or search email'
              />
            </div>
          </Form.Group>

          <Form.Group controlId='formBody' className='mt-3'>
            <Form.Label>
              Message <sup className='red'>*</sup>
            </Form.Label>
            <RichTextEditor value={message} onChange={setMessage} />
          </Form.Group>

          <Form.Group className='d-flex justify-content-end gap-2 mt-3'>
            <Button variant='secondary' onClick={handleClose} disabled={loading}>
              Close
            </Button>
            <Button variant='primary' onClick={handleSend} disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default SendMailModal
