/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import {FC} from 'react'
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import {PrivateRoutes} from './PrivateRoutes'
import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {Logout, AuthPage, useAuth} from '../modules/auth'
import {App} from '../App'
import { PageLayout } from '../modules/auth/components/components/PageLayout'
import{TeamsChannel} from "../modules/auth/components/TeamsChannel"

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const {PUBLIC_URL} = process.env

const AppRoutes: FC = () => {
  // const {currentUser} = useAuth()
  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          {/* {currentUser ? (
            <> */}
              <Route path='/*' element={<PrivateRoutes />} />
              <Route path='*' element={<Navigate to='/dashboard' />} />
            {/* </>
          ) : (
            <> */}
          //  the code need uncomment if you want microsoft login page
              {/* <Route path='auth/*' element={<AuthPage />} />   
              <Route path='*' element={<Navigate to='/auth' />} /> */}
          //  the code need comment if you want microsoft login page
              <Route path='auth/*' element={<AuthPage />} />
              <Route index element={<Navigate to='/auth' />} />
          //  the code need uncomment if you want microsoft login page
              {/* <Route path='pagelayout/*' element={<PageLayout />} />
              <Route index element={<Navigate to='/pagelayout' />} /> */}
              <Route path='teams-channel/*' element={<TeamsChannel />} />
              <Route path='*' element={<Navigate to='/teams-channel' />} />
            {/* </>
          )} */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {AppRoutes}
