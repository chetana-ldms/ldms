/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toAbsoluteUrl } from '../../../helpers';
import { fetchLogoutAddUrl } from '../../../../app/api/Api';

const HeaderUserMenu: FC = () => {
  const createdUserId = Number(sessionStorage.getItem('userId'));
  const createdDate = new Date().toISOString();
  const orgId = Number(sessionStorage.getItem('orgId'));
  const navigate = useNavigate();

  const handleLogout = async () => {
    const data = {
      createdUserId,
      createdDate,
      orgId: Number(sessionStorage.getItem('orgId')),
    };
    try {
      const responseData = await fetchLogoutAddUrl(data);
      const { isSuccess } = responseData;

      if (isSuccess) {
        sessionStorage.clear();
        navigate('/auth'); // Redirect to the login page
      }
    } catch (error) {
      console.log(error);
    }
  };

  const userName = sessionStorage.getItem('userName');
  const email = sessionStorage.getItem('email');

  useEffect(() => {
    if (!createdUserId) {
      navigate('/auth'); 
    }
  }, [createdUserId]);

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
            <img alt='Logo' src={toAbsoluteUrl('/media/avatars/300-1.jpg')} />
          </div>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {userName}
            </div>
            <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              {email}
            </a>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>

      <div className='menu-item px-5'>
        <Link to={'/qradar/profile'} className='menu-link px-5'>
          User Profile
        </Link>
      </div>

      <div className='separator my-2'></div>

      <div className='menu-item px-5'>
        <a onClick={handleLogout} className='menu-link px-5'>
          Sign Out
        </a>
      </div>
    </div>
  );
};

export { HeaderUserMenu };
