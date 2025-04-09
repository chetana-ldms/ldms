import {useEffect, useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, useNavigate} from 'react-router-dom'
import {useFormik} from 'formik'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {
  fetchAuthenticate,
  fetchFeaturesActionsAuthorizedUrl,
  fetchFeaturesAuthorizedUrl,
  fetchOrganizations,
} from '../../../api/Api'
import ChangePasswordPopUp from './ChangePasswordPopUp'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MFAModal from './MFAModal'

const loginSchema = Yup.object().shape({
  username: Yup.string().min(3, 'Minimum 3 symbols').required('Username is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  org: Yup.string().min(1, 'Organization is required').required('Organization is required'),
})

const initialValues = {
  username: '',
  password: '',
  org: '',
}

export function Login() {
  const [loading, setLoading] = useState(false)
  const [organisation, setOrganisation] = useState([])
  const [features, setFeatures] = useState([])
  console.log(features, 'features')
  const [message, setMessage] = useState('')
  const [showChangePwdModal, setShowChangePwdModal] = useState(false)
  const [showMFAModal, setShowMFAModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const handleOpen = () => setShowMFAModal(true);
  const handleClose = () => setShowMFAModal(false);
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrganizations()
      .then((orgRes) => {
        setOrganisation(orgRes)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const handlePassword = () => {
    navigate('/auth/forgotpassword')
  }

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        const authData = await fetchAuthenticate(values.username, values.password, values.org)
        console.log(authData, 'authData')
        setMessage(authData.message || '')
        if (authData.isSuccess) {
          sessionStorage.setItem('userId', authData.userID.toString())
          sessionStorage.setItem('orgId', authData.orgId.toString())
          sessionStorage.setItem('roleID', authData.roleID.toString())
          sessionStorage.setItem('userName', authData.userName)
          sessionStorage.setItem('globalAdminRole', authData.globalAdminRole.toString())
          sessionStorage.setItem('clientAdminRole', authData.clientAdminRole.toString())
          sessionStorage.setItem('accessToken', authData.accessToken.toString())
          sessionStorage.setItem('refreshToken', authData.refreshToken)
          sessionStorage.setItem('openTaskCount', authData.openTaskCount.toString())
          sessionStorage.setItem('defaultPassword', authData.defaultPassword.toString() || "")
          sessionStorage.setItem('isMFAEnabled', authData.isMFAEnabled.toString() || "")
          if (authData.orgToolsData && authData.orgToolsData.length > 0) {
            const toolData = authData.orgToolsData[0]
            sessionStorage.setItem('toolID', toolData.toolId.toString())
            sessionStorage.setItem('login_toolID', toolData.toolId.toString())
            if(toolData.toolOrgStructure !==null)
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

          if (authData.isMFAEnabled) {
            setShowMFAModal(true)
          } else if (authData.defaultPassword) {
            setShowChangePwdModal(true)
          } else {
            const orgId = sessionStorage.getItem('orgId')
            const toolId = sessionStorage.getItem('toolID')
            const roleId = sessionStorage.getItem('roleID')
            try {
              const data = {
                orgId: orgId,
                toolId: toolId ? toolId : 0,
                roleId: roleId,
                parentFeatureId: 0,
              }
              const response = await fetchFeaturesAuthorizedUrl(data)
              const features = response.features
              if(response.isSuccess == false){
                setMessage('Please contact administrator')
              }
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
      } catch (error) {
        console.error(error)
        setStatus('The login details are incorrect')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const fetchFeatures = async () => {
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
      setFeatures(response.features)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='card pad-20'>
      <ToastContainer />

      <form
        className='form w-100 login-form'
        onSubmit={formik.handleSubmit}
        noValidate
        id='kt_login_signin_form'
      >
        <div className='text-center'>
          <h1 className='text-dark fw-bolder mb-3'>
            <img src={toAbsoluteUrl('/media/misc/lancesoft_logo.png')} className='h-80px me-3' />
          </h1>
          <div className='text-blue-500 fw-semibold fs-20 login-subtxt'>Defence Centre</div>
        </div>
        <h1 className='mb-2 text-blue'>Login</h1>
        <hr />
        {message && (
          <div className='alert alert-danger mb-5'>
            <i className='fa fa-exclamation-circle red' /> {message}
          </div>
        )}
        <div className='fv-row mb-8'>
          <label className='form-label fs-6 fw-bolder text-dark'>User</label>
          <input
            placeholder='username'
            {...formik.getFieldProps('username')}
            className={clsx(
              'form-control bg-transparent',
              {'is-invalid': formik.touched.username && formik.errors.username},
              {'is-valid': formik.touched.username && !formik.errors.username}
            )}
            type='text'
            name='username'
            autoComplete='off'
          />
          {formik.touched.username && formik.errors.username && (
            <div className='fv-plugins-message-container'>
              <span className='red' role='alert'>
                {formik.errors.username}
              </span>
            </div>
          )}
        </div>
        <style>
          {`
          input[type="password"]::-ms-reveal {
            display: none;
          }
        `}
        </style>
        <div className='fv-row mb-3'>
          <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
          <div className='input-group-password position-relative'>
            <input
              placeholder='password'
              type={showPassword ? 'text' : 'password'}
              autoComplete='off'
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control bg-transparent',
                {'is-invalid': formik.touched.password && formik.errors.password},
                {'is-valid': formik.touched.password && !formik.errors.password}
              )}
              style={{paddingRight: '2.5rem'}}
            />
            <button
              type='button'
              className='btn position-absolute end-0 top-0 h-100'
              style={{border: 'none', background: 'transparent'}}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <i className='fa fa-eye' /> : <i className='fa fa-eye-slash' />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span className='red' role='alert'>
                  {formik.errors.password}
                </span>
              </div>
            </div>
          )}
          <div className='text-right mt-3'>
            <p onClick={handlePassword} className='link pointer text-underline'>
              Forgot password
            </p>
          </div>
        </div>

        <div className='fv-row mb-8'>
          <label className='form-label fs-6 fw-bolder text-dark'>Organization</label>
          <input
            placeholder='organization'
            {...formik.getFieldProps('org')}
            className={clsx(
              'form-control bg-transparent',
              {'is-invalid': formik.touched.org && formik.errors.org},
              {'is-valid': formik.touched.org && !formik.errors.org}
            )}
            type='text'
            name='org'
            autoComplete='off'
          />
          {formik.touched.org && formik.errors.org && (
            <div className='fv-plugins-message-container'>
              <span className='red' role='alert'>
                {formik.errors.org}
              </span>
            </div>
          )}
        </div>
        <div className='d-grid mb-10'>
          <button
            type='submit'
            id='kt_sign_in_submit'
            className='btn btn-login'
            disabled={formik.isSubmitting || !formik.isValid}
          >
            <span className='indicator-label'>LOGIN</span>
          </button>
        </div>
      </form>
      <ChangePasswordPopUp
        showChangePwdModal={showChangePwdModal}
        setShowChangePwdModal={setShowChangePwdModal}
      />
      <MFAModal show={showMFAModal} onClose={handleClose}/>
    </div>
  )
}
