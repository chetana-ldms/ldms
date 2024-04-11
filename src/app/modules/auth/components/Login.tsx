
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { fetchAuthenticate, fetchOrganizations } from '../../../api/Api'
import TasksPopUp from './TasksPopUp';
import ChangePasswordPopUp from './ChangePasswordPopUp'
import { ToastContainer } from 'react-toastify'
import { notify, notifyFail } from '../../apps/qradar/qradar-pages/components/notification/Notification'
import 'react-toastify/dist/ReactToastify.css';
const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .required('Username is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  org: Yup.string()
    .notOneOf(['0'], 'Please select an organisation') 
    .required('Organisation is required'),
});

interface Organisation {
  orgID: number;
  orgName: string;
}
const initialValues = {
  username: '',
  password: '',
  org: 0,
};
/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {
  const [loading, setLoading] = useState(false)
  const [organisation, setOrganisation] = useState([]);
  const [message, setMessage] = useState('')
  const [showChangePwdModal, setShowChangePwdModal] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    fetchOrganizations()
      .then(orgRes => {
        setOrganisation(orgRes);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  const handlePassword = () => {
    navigate('/auth/forgotpassword')
  };
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      try {
        const authData = await fetchAuthenticate(values.username, values.password, Number(values.org))
        console.log(authData, "authData")
        setMessage(authData.message);
        if (authData.isSuccess) {
            // notify('Login succesful');
          sessionStorage.setItem('userId', authData.userID);
          sessionStorage.setItem('orgId', authData.orgId);
          sessionStorage.setItem('roleID', authData.roleID);
          sessionStorage.setItem('userName', authData.userName);
          sessionStorage.setItem('globalAdminRole', authData.globalAdminRole);
          sessionStorage.setItem('clientAdminRole', authData.clientAdminRole);
          sessionStorage.setItem('openTaskCount', authData.openTaskCount);
          sessionStorage.setItem('defaultPassword', authData.defaultPassword);
          sessionStorage.setItem('accountName', "LanceSoft Inc");
          sessionStorage.setItem('accountId', "1");
          sessionStorage.setItem('siteName', "Default site");
          sessionStorage.setItem('siteId', "1");
          sessionStorage.setItem('groupName', "Default Group");
          sessionStorage.setItem('groupId', "1");
          const defaultPassword = authData.defaultPassword;
          if (defaultPassword) {
            setShowChangePwdModal(true);
          } else{
              navigate('/dashboard');
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
      <hr/>
      { message &&
      <div className="alert alert-danger mb-5">
          <i className="fa fa-exclamation-circle red" /> {message}
        </div>
      }
      <div className='fv-row mb-8'>
        <label className='form-label fs-6 fw-bolder text-dark'>Username</label>
        <input
          placeholder='username'
          {...formik.getFieldProps('username')}
          className={clsx(
            'form-control bg-transparent',
            { 'is-invalid': formik.touched.username && formik.errors.username },
            {
              'is-valid': formik.touched.username && !formik.errors.username,
            }
          )}
          type='text'
          name='username'
          autoComplete='off'
        />
        {formik.touched.username && formik.errors.username && (
          <div className='fv-plugins-message-container'>
            <span className='red' role='alert'>{formik.errors.username}</span>
          </div>
        )}
      </div>
      <div className='fv-row mb-3'>
        <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
        <input
          placeholder='password'
          type='password'
          autoComplete='off'
          {...formik.getFieldProps('password')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.password && formik.errors.password,
            },
            {
              'is-valid': formik.touched.password && !formik.errors.password,
            }
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span className='red' role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
        <div className='text-right mt-3'>
          <p onClick={handlePassword} className='link pointer text-underline'>Forgot password</p>
        </div>
      </div>
      <div className='fv-row mb-8'>
        <label className='form-label fs-6 fw-bolder text-dark'>Organisation Name</label>
        <div>
          {organisation === null && (
            
             <select
             placeholder='Organisation'
             {...formik.getFieldProps('org')}
             className={clsx(
               'form-select form-control bg-transparent',
               { 'is-invalid': formik.touched.org && formik.errors.org },
               { 'is-valid': formik.touched.org && !formik.errors.org }
             )}
             autoComplete='off'
           >
              <option value="">Select Organisation</option>
            </select>
          )}
          {organisation !== null && (
            
            <select
              placeholder='Organisation'
              {...formik.getFieldProps('org')}
              className={clsx(
                'form-select form-control bg-transparent',
                { 'is-invalid': formik.touched.org && formik.errors.org },
                { 'is-valid': formik.touched.org && !formik.errors.org }
              )}
              autoComplete='off'
            >
              <option value="" >Select Organisation</option>
              {organisation.length >= 0 && organisation.map((user: Organisation) => (
                <option key={user.orgID} value={user.orgID}>
                  {user.orgName}
                </option>
              ))}
            </select>
          )}
        </div>
        {formik.touched.org && formik.errors.org && (
          <div className='fv-plugins-message-container'>
            <span className='red' role='alert'>{formik.errors.org}</span>
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
          <span className='indicator-label' >LOGIN</span>
        </button>
      </div>
    </form>
    <ChangePasswordPopUp showChangePwdModal={showChangePwdModal} setShowChangePwdModal={setShowChangePwdModal}/>

    </div>
  )
}
