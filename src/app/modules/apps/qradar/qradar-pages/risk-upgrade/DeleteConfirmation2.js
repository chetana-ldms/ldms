import React, {useState} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {FormGroup, Label, Input} from 'reactstrap'

const DeleteConfirmation2 = ({
  show,
  onConfirm,
  onCancel,
  message,
}) => {
  const [reason, setReason] = useState('')

  const handleConfirm = () => {
    onConfirm(reason)
    setReason('')
  }

  const handleCancel = () => {
    setReason('')
    onCancel()
  }

  return (
    <Modal
      backdrop='static'
      keyboard={false}
      show={show}
      onHide={handleCancel}
      className='application-modal small-modal border-0'
    >
      <Modal.Body className='border-btm'>
        <p className='mb-3'>{message}</p>
        <FormGroup className='mb-3'>
          <Label for='deleteReason' className='fw-bold'>
            Reason <span className='text-danger'>*</span>
          </Label>
          <Input
            type='textarea'
            id='deleteReason'
            rows='3'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder='Enter reason for deletion'
          />
        </FormGroup>

        <div className='d-flex justify-content-center gap-2'>
          <Button className='btn-secondary btn-small' onClick={handleCancel}>
            No
          </Button>
          <Button className='btn-small btn-new' onClick={handleConfirm} disabled={!reason.trim()}>
            Yes
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default DeleteConfirmation2
