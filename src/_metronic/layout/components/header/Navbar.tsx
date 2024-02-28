import React, { useEffect, useState } from 'react';
import clsx from 'clsx'
import { KTSVG, toAbsoluteUrl } from '../../../helpers'
import { HeaderNotificationsMenu, HeaderUserMenu, Search, ThemeModeSwitcher } from '../../../partials'
import { useLayout } from '../../core'
import { Link, useNavigate } from 'react-router-dom'
import { Dropdown, Button } from 'react-bootstrap';
import { fetchTasksUrl } from '../../../../app/api/TasksApi';

const itemClass = 'ms-1 ms-lg-3'
const btnClass = 'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px'
const userAvatarClass = 'symbol-35px symbol-md-40px'
const btnIconClass = 'svg-icon-1'

const Navbar = () => {
  const { config } = useLayout()
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/auth');
  };
  const userName = sessionStorage.getItem('userName');
  const [tasks, setTasks] = useState<any[]>([]); 

  const ownerUserId = Number(sessionStorage.getItem('userId'))

  const reload = async () => {
    try {
      const data = await fetchTasksUrl(ownerUserId)
      setTasks(data || []); 
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    reload()
  }, [])
  const handleNotification = () =>{
    navigate(`/qradar/tasks/list`)
  }
  
  return (
    <div className='app-navbar flex-shrink-0'>
      <p className='d-flex m-5'>Welcome &nbsp;<b>{" "} { userName}!</b></p>
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

      <div className='notification'>
        <Dropdown>
          <Dropdown.Toggle as={Button} variant="link" id="dropdown-basic" className='bell'>
            <i className='fa fa-bell link'/>
            {" "}<span className='count'>{tasks.length}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {tasks.map(task => (
               <Dropdown.Item onClick={handleNotification}>
                 {task.taskType}
               </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      
    </div>
  )
}

export { Navbar }
