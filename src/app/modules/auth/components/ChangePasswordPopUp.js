import React, {useState, useRef} from 'react'
import {Button, Modal, Form} from 'react-bootstrap'
import {
  notify,
  notifyFail,
} from '../../apps/qradar/qradar-pages/components/notification/Notification'
import {fetchChangePasswordUrl} from '../../../api/UserProfileApi'
import {ToastContainer} from 'react-toastify'
import {useNavigate} from 'react-router'
import TasksPopUp from './TasksPopUp'

function ChangePasswordPopUp({showChangePwdModal, setShowChangePwdModal}) {
  const navigate = useNavigate()
  const oldPasswordRef = useRef(null)
  const newPasswordRef = useRef(null)
  const confirmPasswordRef = useRef(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const userID = Number(sessionStorage.getItem('userId'))
  const openTaskCount = Number(sessionStorage.getItem('openTaskCount'))
  const date = new Date().toISOString()

  //   const handleCloseChangePwdModal = () => {
  //     setShowChangePwdModal(false)
  //   }

  const handlePostChangePwd = async (event) => {
    event.preventDefault()
    const oldPassword = oldPasswordRef.current.value
    const newPassword = newPasswordRef.current.value
    const confirmPass = confirmPasswordRef.current.value;
    const data = {
      modifiedUserId: userID,
      modifiedDate: date,
      userId: userID,
      newPassword: newPassword,
      oldPassword: oldPassword,
    }
    try {
      if (newPassword !== confirmPass) { 
        notifyFail('New password and confirm password do not match');
        return;
    }
      const responseData = await fetchChangePasswordUrl(data)
      const {isSuccess} = responseData

      if (isSuccess) {
        notify('Password Updated')
        setShowChangePwdModal(false)
        setTimeout(()=>{
          navigate('/dashboard')
        },2000)
      } else {
        notifyFail('Failed to update the Password')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <ToastContainer />
      {/* <Modal show={showChangePwdModal} onHide={handleCloseChangePwdModal}> */}
      <Modal show={showChangePwdModal}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='oldPassword'>
              <Form.Label>Old Password</Form.Label>
              <Form.Control type='password' ref={oldPasswordRef} />
            </Form.Group>
            <Form.Group controlId='newPassword'>
              <Form.Label>New Password</Form.Label>
              <Form.Control type='password' ref={newPasswordRef} />
            </Form.Group>
            <Form.Group controlId='confirmPassword'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                ref={confirmPasswordRef}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={handlePostChangePwd}>
            Change Password
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ChangePasswordPopUp
