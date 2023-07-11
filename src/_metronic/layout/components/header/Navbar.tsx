import clsx from 'clsx'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {HeaderNotificationsMenu, HeaderUserMenu, Search, ThemeModeSwitcher} from '../../../partials'
import {useLayout} from '../../core'
import { Link, useNavigate } from 'react-router-dom'


const itemClass = 'ms-1 ms-lg-3'
const btnClass =
  'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px'
const userAvatarClass = 'symbol-35px symbol-md-40px'
const btnIconClass = 'svg-icon-1'

const Navbar = () => {
  const {config} = useLayout()
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/auth');
  };
  const userName = sessionStorage.getItem('userName');
  return (
    <div className='app-navbar flex-shrink-0'>
      <p className='d-flex m-5'>Welcome &nbsp;<b>{" "} { userName}!</b></p>
        {/* <button className="btn btn-primary m-3" onClick={handleLogout} >LogOut </button> */}


      <div className={clsx('app-navbar-item', itemClass)}>
        <HeaderNotificationsMenu />
      </div>

      <div className={clsx('app-navbar-item', itemClass)}>
        <div
          className={clsx('cursor-pointer symbol', userAvatarClass)}
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
        >
          <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt='' />
        </div>
        <HeaderUserMenu />
      </div>

      
    </div>
  )
}

export {Navbar}
