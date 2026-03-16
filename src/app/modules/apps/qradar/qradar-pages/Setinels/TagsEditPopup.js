import React, {useState, useRef, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {notify, notifyFail} from '../components/notification/Notification'
import {fetchTagUpdateUrl} from '../../../../../api/SentinalApi'

const TagsEditPopup = ({show, onClose, refreshParent, selectedItem}) => {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const [formData, setFormData] = useState({
    osType: selectedItem?.key || '',
    description: selectedItem?.description || '',
    tagValue: selectedItem?.value || '',
  })

  const {osType, description, tagValue} = formData

  useEffect(() => {
    setFormData({
      osType: selectedItem?.key || '',
      description: selectedItem?.description || '',
      tagValue: selectedItem?.value || '',
    })
  }, [selectedItem])

  const handleChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    })
  }

  const handleSubmit = async () => {
    try {
      if (!osType) {
        notifyFail('Please enter Tag key')
        return
      }

      const data = {
        orgId: orgId,
        toolId: toolId,
        tagKey: osType,
        tagValue: tagValue || '',
        tagKeyDescription: description,
        tagId: selectedItem.id,
      }

      const responseData = await fetchTagUpdateUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        onClose()
        setTimeout(() => {
          refreshParent()
        }, 2000)
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.error('Error during API call:', error)
    }
  }

  return (
    <Modal
      backdrop='static'
      keyboard={false}
      show={show}
      onHide={onClose}
      className='application-modal'
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Tag</Modal.Title>
        <button type='button' class='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className='row'>
          <div className='col-md-6'>
            <label htmlFor='osInput' className='form-label'>
              Tag Key*
            </label>
            <input
              type='text'
              className='form-control'
              value={osType}
              onChange={(e) => handleChange(e, 'osType')}
            />
          </div>
        </div>
        <div className='row mt-5'>
          <div className='col-md-6'>
            <label className='form-label' htmlFor='sha1Input'>
              Tag Value
            </label>
            <input
              type='text'
              className='form-control'
              value={tagValue}
              onChange={(e) => handleChange(e, 'tagValue')}
            />
          </div>
        </div>
        <div className='mt-5'>
          <label className='form-label'>Description</label>
          <textarea
            rows='1'
            className='form-control'
            placeholder='Add Description or Leave empty'
            maxLength={4000}
            value={description}
            onChange={(e) => handleChange(e, 'description')}
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='btn btn-small btn-secondary' onClick={onClose}>
          Close
        </Button>
        <Button variant='btn btn-new btn-small' onClick={handleSubmit}>
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default TagsEditPopup
