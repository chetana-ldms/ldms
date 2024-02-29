import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Dropdown, Button } from 'react-bootstrap';
import { KTSVG, toAbsoluteUrl } from '../../../helpers';
import { HeaderNotificationsMenu, HeaderUserMenu } from '../../../partials';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../app/modules/apps/qradar/qradar-pages/context/AppContextProvider';
import { fetchTasksUrl } from '../../../../app/api/TasksApi';

interface Task {
  taskId: string;
  taskTitle: string;
}

const itemClass = 'ms-1 ms-lg-3';
const userAvatarClass = 'symbol-35px symbol-md-40px';

const Navbar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const userID = Number(sessionStorage.getItem('userId'));
  const date = new Date().toISOString();
  const [tasksData, setTasksData] = useState([]);
  const ownerUserId = Number(sessionStorage.getItem('userId'));

  const reload = async () => {
    try {
      setLoading(true);
      const data = await fetchTasksUrl(ownerUserId);
      setTasksData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      reload();
    }, 2 * 60000);

    return () => clearTimeout(timer);
  }, [tasksData]);

  const userName = sessionStorage.getItem('userName');

  const handleLogout = () => {
    navigate('/auth');
  };

  const handleNotification = (taskId: string) => {
    navigate(`/qradar/tasks/update/${taskId}`);
  };

  return (
    <div className='app-navbar flex-shrink-0'>
      <p className='d-flex m-5'>Welcome &nbsp;<b>{" "} {userName}!</b></p>
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
            {" "}
            <span className={tasksData?.length > 0 ? 'count' : 'count-zero'}></span>
          </Dropdown.Toggle>

            <Dropdown.Menu>
              {tasksData ? (
                tasksData.map((task: Task) => (
                  <Dropdown.Item key={task.taskId} onClick={() => handleNotification(task.taskId)}>
                    {task.taskTitle}
                  </Dropdown.Item>
                ))
              ) : (
                <Dropdown.Item disabled>No data found</Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
      </div>
    </div>
  );
};

export { Navbar };
