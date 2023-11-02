/* eslint-disable jsx-a11y/anchor-is-valid */
// import { AES } from 'crypto-js';
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
// import { getUserByToken, login } from '../core/_requests'
import { getUserByToken } from '../core/_requests'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { fetchAuthenticate, fetchOrganizations } from '../../../api/Api'
// import { useAuth } from '../core/Auth'
import axios from 'axios'
const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .required('Username is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  org: Yup.string().required('Organisation is required'),
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
  // const { saveAuth, setCurrentUser } = useAuth()
  const [organisation, setOrganisation] = useState([]);
  console.log(organisation, "organisationtest")
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
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      try {
        const authData = await fetchAuthenticate(values.username, values.password, Number(values.org))
        console.log(authData, "authData")
        if (authData.isSuccess) {
          sessionStorage.setItem('userId', authData.userID);
          sessionStorage.setItem('orgId', authData.orgId);
          sessionStorage.setItem('roleID', authData.roleID);
          sessionStorage.setItem('userName', authData.userName);
          sessionStorage.setItem('globalAdminRole', authData.globalAdminRole);
          sessionStorage.setItem('clientAdminRole', authData.clientAdminRole);
          navigate('/dashboard')
        } else {
          setStatus('The login details are incorrect')
        }
        // saveAuth(auth);
        // const { data: auth } = await login(values.username, values.password, Number(values.org));
        // saveAuth(auth);
        // const { data: user } = await getUserByToken(auth.api_token);
        // setCurrentUser(user);
      } catch (error) {
        console.error(error)
        // saveAuth(undefined)
        setStatus('The login details are incorrect')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  return (
    <form
      className='form w-100 login-form'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      {/* begin::Heading */}
      <div className='text-center mb-11'>
        <h1 className='text-dark fw-bolder mb-3'>
          <img src={toAbsoluteUrl('/media/misc/lancesoft_logo.png')} className='h-80px me-3' />
        </h1>
        <div className='text-blue-500 fw-semibold fs-20 login-subtxt'>Defence Centre</div>
      </div>
      {/* begin::Heading */}

      {formik.status ? (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      ) : (
        <div className='mb-10 bg-light-info p-8 rounded d-none'>
          <div className='text-info'>
            Use account <strong>admin@demo.com</strong> and password <strong>demo</strong> to
            continue.
          </div>
        </div>
      )}

      {/* begin::Form group */}
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
            <span role='alert'>{formik.errors.username}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
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
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
     
      {/* begin::Form group */}
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
              <option value="" >Select</option>
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
              <option value=""  >Select</option>
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
            <span role='alert'>{formik.errors.org}</span>
          </div>
        )}
      </div>

      {/* begin::Wrapper */}
      <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
        <div />

        {/* begin::Link */}
        {/* <Link to='/auth/forgot-password' className='link-primary'>
          Forgot Password ?
        </Link> */}
        {/* end::Link */}
      </div>
      {/* end::Wrapper */}

      {/* begin::Action */}
      <div className='d-grid mb-10'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-primary'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          <span className='indicator-label' >LOGIN</span>
          {/* {!loading && <span className='indicator-label' >Continue</span>} */}

          {/* {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )} */}
        </button>
      </div>
      {/* end::Action */}

      {/* <div className='text-gray-500 text-center fw-semibold fs-6'>
        Not a Member yet?{' '}
        <Link to='/auth/registration' className='link-primary'>
          Sign up
        </Link>
      </div> */}
    </form>
  )
}
