import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Dropdown, Button, Accordion, Card } from 'react-bootstrap';
import { KTSVG, toAbsoluteUrl } from '../../../helpers';
import { HeaderNotificationsMenu, HeaderUserMenu } from '../../../partials';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../app/modules/apps/qradar/qradar-pages/context/AppContextProvider';
import { fetchTasksUrl } from '../../../../app/api/TasksApi';
import { fetchAccountsStructureUrl } from '../../../../app/api/Api';


interface Task {
  taskId: string;
  taskTitle: string;
}
interface Account {
  accountId: string;
  name: string;
  totalSites: number;
  totalEndpoints: number;
  sites: {
    siteId: string;
    totalGroups: number;
    name: string;
    isDefault: boolean;
    activeLicenses: number;
    groups: {
      groupId: string;
      name: string;
      totalAgents: number;
    }[];
  }[];
}

const itemClass = 'ms-1 ms-lg-3';
const userAvatarClass = 'symbol-35px symbol-md-40px';

const Navbar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const date = new Date().toISOString();
  const [tasksData, setTasksData] = useState([]);
  const [accountsStructure, setAccountsStructure] = useState<Account[]>([]);
  console.log(accountsStructure, "accountsStructure")
  const ownerUserId = Number(sessionStorage.getItem('userId'));
  const orgId = Number(sessionStorage.getItem('orgId'));
   const [selectedSite, setSelectedSite] = useState<string | null>(null);

  const handleSiteClick = (siteId: string) => {
    setSelectedSite(siteId === selectedSite ? null : siteId);
  };
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
  const handleBellIcon = async () =>{
   await reload();
  }

  const [openSection, setOpenSection] = useState<number | null>(null);
  const [showAccordion, setShowAccordion] = useState<boolean>(false);
  const fetchData = async () => {
    const data = {
      orgID: orgId,
    };
    try {
      setLoading(true);
      const response = await fetchAccountsStructureUrl(data);
      setAccountsStructure(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   fetchData();
  // }, []);

  const handleAccountClick = () => {
    setShowAccordion(!showAccordion);
    fetchData();
  };


  return (
    <div className='app-navbar flex-shrink-0'>
      <p className='d-flex m-5'>Welcome &nbsp;<b>{" "} {userName}!</b></p>
      <div className={clsx('app-navbar-item', itemClass)}>
        <HeaderNotificationsMenu />
      </div>
      <div className='app-navbar flex-shrink-0'>
      <button onClick={handleAccountClick}>Account</button>
      
      {showAccordion && (
  accountsStructure.map((account, accountIndex) => (
    <div className='header-account' key={accountIndex}>
      <Button variant="link" id="dropdown-basic" className='bell'>
        <span className='acc-name' title={account.name}>{account.name}</span>
        <div>
          Account: {account.totalSites} Sites, {account.totalEndpoints} Endpoints
        </div>
        <div>
          {account.sites.map((site, siteIndex) => (
            <div key={siteIndex}>
              <div className='d-flex justify-content-between'>
                <p>{site.name}</p>
                <p>{site.activeLicenses}</p>
              </div>
              <div>
                {site.groups.map((group, groupIndex) => (
                  <div className='d-flex justify-content-between' key={groupIndex}>
                    <p>{group.name}</p>
                    <p>{group.totalAgents}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Button>
    </div>
  ))
)}


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

      <div className='notification' onClick={handleBellIcon}>
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
                <Dropdown.Item className='no-pointer'>No new notifications.</Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
      </div>
    </div>
  );
};

export { Navbar };
