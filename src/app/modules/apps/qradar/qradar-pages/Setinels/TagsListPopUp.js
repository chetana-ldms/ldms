import React, {useState, useRef, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {notify, notifyFail} from '../components/notification/Notification'
import {fetchAddToblockListUrl, fetchTagAddUrl} from '../../../../../api/SentinalApi'

const TagsListPopUp = ({show, onClose, refreshParent}) => {
  const TagKeyRef = useRef(null)
  const descriptionTextareaRef = useRef(null)
  const TagValueRef = useRef(null)
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')

  const handleSubmit = async () => {
    try {
      if (!TagKeyRef.current.value) {
        notifyFail('Please enter Tag key')
        return
      }
      const data = {
        orgId: orgId,
        toolId: toolId,
        orgAccountStructureLevel: [
          {
            levelName: 'AccountId',
            levelValue: accountId || '',
          },
          {
            levelName: 'SiteId',
            levelValue: siteId || '',
          },
          {
            levelName: 'GroupId',
            levelValue: groupId || '',
          },
        ],
        tagKey: TagKeyRef.current.value,
        tagValue: TagValueRef.current.value,
        tagKeyDescription: descriptionTextareaRef.current.value || '',
        type: 'agents',
      }

      const responseData = await fetchTagAddUrl(data)
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
      console.log(error)
    }
  }

  return (
    <Modal
      backdrop='static'
      keyboard={false}
      show={show}
      onHide={onClose}
      className='addToBlockList application-modal'
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <div> Create tag</div>
        </Modal.Title>
        <button type='button' class='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className='mb-5'>
          A tag is a custom label with a key & value. You can create a key without a value or add
          multiple values to the same key.
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <label htmlFor='osInput' className='form-label'>
              Tag Key*
            </label>
            <input type='text' className='form-control' ref={TagKeyRef} required />
          </div>
        </div>
        <div className='row mt-5'>
          <div className='col-md-6'>
            <div>
              <label className='form-label' htmlFor='sha1Input'>
                Tag Value
              </label>
              <input type='text' className='form-control' ref={TagValueRef} required />
            </div>
          </div>
        </div>
        <div className='mt-5'>
          <label className='form-label'>Description</label>
          <textarea
            ref={descriptionTextareaRef}
            rows='1'
            className='form-control'
            maxLength={4000}
            placeholder='Add Description or Leave empty'
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='btn btn-small btn-secondary' onClick={onClose}>
          Close
        </Button>
        <Button variant='btn btn-new btn-small' onClick={handleSubmit}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default TagsListPopUp
