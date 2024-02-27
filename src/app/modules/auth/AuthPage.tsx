import {Route, Routes} from 'react-router-dom'
import {Registration} from './components/Registration'
import {ForgotPassword} from './components/ForgotPassword'
import {Login} from './components/Login'
import {AuthLayout} from './AuthLayout'
import ForgotPasswordForm from './components/ForgotPasswordForm'

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path='login' element={<Login />} />
      <Route path='registration' element={<Registration />} />
      <Route path='forgotpassword' element={<ForgotPasswordForm />} />
      <Route index element={<Login />} />
    </Route>
  </Routes>
)

export {AuthPage}
