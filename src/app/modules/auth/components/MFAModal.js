import React, {useState} from 'react'
import {Button, Modal, Form} from 'react-bootstrap'
import {fetchAuthUserResendOTPUrl, fetchAuthUserVerifyOTPUrl, fetchFeaturesAuthorizedUrl} from '../../../api/Api'
import {
  notify,
  notifyFail,
} from '../../apps/qradar/qradar-pages/components/notification/Notification'
import ChangePasswordPopUp from './ChangePasswordPopUp'
import {useNavigate} from 'react-router-dom'

function MFAModal({show, onClose}) {
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [showChangePwdModal, setShowChangePwdModal] = useState(false)

  const handleVerify = async (event) => {
    event.preventDefault()
    if (!otp) {
      notifyFail('Please Enter OTP')
      return
    }

    const createdUserId = Number(sessionStorage.getItem('userId'))
    const createdDate = new Date().toISOString()

    const data = {
      userId: createdUserId,
      enteredOTP: otp,
    }

    try {
      const responseData = await fetchAuthUserVerifyOTPUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        if (responseData.isSuccess) {
          sessionStorage.setItem('userId', responseData.userID.toString())
          sessionStorage.setItem('orgId', responseData.orgId.toString())
          sessionStorage.setItem('roleID', responseData.roleID.toString())
          sessionStorage.setItem('userName', responseData.userName)
          sessionStorage.setItem('globalAdminRole', responseData.globalAdminRole.toString())
          sessionStorage.setItem('clientAdminRole', responseData.clientAdminRole.toString())
          sessionStorage.setItem('accessToken', responseData.accessToken.toString())
          sessionStorage.setItem('refreshToken', responseData.refreshToken)
          sessionStorage.setItem('openTaskCount', responseData.openTaskCount.toString())
          sessionStorage.setItem('defaultPassword', responseData.defaultPassword.toString() || '')
          sessionStorage.setItem('isMFAEnabled', responseData.isMFAEnabled.toString() || '')
          if (responseData.orgToolsData && responseData.orgToolsData.length > 0) {
            const toolData = responseData.orgToolsData[0]
            sessionStorage.setItem('toolID', toolData.toolId.toString())

            toolData.toolOrgStructure.forEach((level) => {
              switch (level.levelName) {
                case 'AccountName':
                  sessionStorage.setItem('accountName', level.levelData)
                  break
                case 'AccountId':
                  sessionStorage.setItem('accountId', level.levelData)
                  break
                case 'SiteName':
                  sessionStorage.setItem('siteName', level.levelData)
                  break
                case 'SiteId':
                  sessionStorage.setItem('siteId', level.levelData)
                  break
                case 'GroupName':
                  sessionStorage.setItem('groupName', level.levelData)
                  break
                case 'GroupId':
                  sessionStorage.setItem('groupId', level.levelData)
                  break
                default:
                  break
              }
            })
          }

          sessionStorage.setItem('toolExpire', 'true')
          sessionStorage.setItem('sentinalTesting', 'false')
          sessionStorage.setItem('selectedFeatureId', '1')
          if (responseData.defaultPassword) {
            setShowChangePwdModal(true)
          } else {
            const orgId = sessionStorage.getItem('orgId')
            const toolId = sessionStorage.getItem('toolID')
            const roleId = sessionStorage.getItem('roleID')
            try {
              const data = {
                orgId: orgId,
                toolId: toolId,
                roleId: roleId,
                parentFeatureId: 0,
              }
              const response = await fetchFeaturesAuthorizedUrl(data)
              const features = response.features
              if (features.length > 0) {
                const featureUrl = features[0]?.featureUrl
                navigate(featureUrl)
              }
            } catch (error) {
              console.log(error)
            }
          }
        } else {
          // notifyFail('Authentication failed');
        }
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleResendOtp = async () => {
    const userId = Number(sessionStorage.getItem("userId"));
    const data = {
        userId: userId,
      }

    try {
      const response = await fetchAuthUserResendOTPUrl(data);
      const { isSuccess, message } = response;

      if (isSuccess) {
        notify(message);
      } else {
        notifyFail(message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={onClose} >
      <Modal.Header closeButton>
        <Modal.Title>
          OTP Verification
          {/* <button type='button' class='application-modal-close' aria-label='Close'>
            <i className='fa fa-close' />
          </button> */}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Please enter the OTP sent to your registered Email.</p>
        <Form>
          <Form.Group controlId='formOtp'>
            <Form.Label>OTP</Form.Label>
            <Form.Control
              type='text'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder='Enter OTP'
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={handleResendOtp}>
          Resend OTP
        </Button>
        <Button variant='secondary' onClick={onClose}>
          Cancel
        </Button>
        <Button variant='primary' onClick={handleVerify}>
          Verify
        </Button>
      </Modal.Footer>
      <ChangePasswordPopUp
        showChangePwdModal={showChangePwdModal}
        setShowChangePwdModal={setShowChangePwdModal}
      />
    </Modal>
  )
}

export default MFAModal
