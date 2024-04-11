import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Dropdown, Button, Accordion, Card } from 'react-bootstrap';
import { KTSVG, toAbsoluteUrl } from '../../../helpers';
import { HeaderNotificationsMenu, HeaderUserMenu } from '../../../partials';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../app/modules/apps/qradar/qradar-pages/context/AppContextProvider';
import { fetchTasksUrl } from '../../../../app/api/TasksApi';
import { fetchAccountsStructureUrl, fetchOrganizations } from '../../../../app/api/Api';

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
  const [tasksData, setTasksData] = useState([]);
  const [siteName, setSiteName] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('');
  const [accountsStructure, setAccountsStructure] = useState<Account[]>([]);
  console.log(accountsStructure, "accountsStructure");
  const [showDropdown, setShowDropdown] = useState<boolean>(false); 
  const ownerUserId = Number(sessionStorage.getItem('userId'));
  const [organizations, setOrganizations] = useState<{ orgID: number; orgName: string }[]>([]);
  const orgId = Number(sessionStorage.getItem('orgId'));
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const organizationsResponse = await fetchOrganizations();
        setOrganizations(organizationsResponse);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
const orgNames = organizations
  .filter((item) => item.orgID === orgId)
  .map((item) => item.orgName)
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

  const handleBellIcon = async () => {
    await reload();
  };

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

  useEffect(() => {
    fetchData();
  }, []);
  const accountNames = accountsStructure.map((item) => {
return item.name
  })
  const handleAccountClick = (accountId: string, accountName: string) => {
    sessionStorage.removeItem('accountId');
    sessionStorage.removeItem('accountName');
    sessionStorage.setItem('accountId', accountId);
    sessionStorage.setItem('accountName', accountName);
  };
  
  const handleAccordionClick = (name: string, id: string) => {
    sessionStorage.removeItem('siteName');
    sessionStorage.removeItem('siteId');
    sessionStorage.setItem('siteName', name);
    setSiteName(name)
    sessionStorage.setItem('siteId', id);
  };
  const handleGroupClick = (name: string, id: string) => {
    sessionStorage.removeItem('groupName');
    sessionStorage.removeItem('groupId');
    sessionStorage.setItem('groupName', name);
    setGroupName(name);
    sessionStorage.setItem('groupId', id);
  };
// const accountName = sessionStorage.getItem('accountName');
// const siteName = sessionStorage.getItem('siteName');
// const groupName = sessionStorage.getItem('groupName');
  return (
    <div className='app-navbar flex-shrink-0'>
      <div>
      <p className='m-5 float-start '>Welcome &nbsp;<b>{" "} {userName}!</b></p>
      </div>
      <div className='d-flex m-5'>
      {orgNames}/{accountNames.join(', ')}{siteName ? `/${siteName}` : ''}{groupName ? `/${groupName}` : ''}
      </div>
      <div className={clsx('app-navbar-item', itemClass)}>
        <HeaderNotificationsMenu />
      </div>

      {accountsStructure.map((account, accountIndex) => (
        <Dropdown key={accountIndex} className='account-header' show={showDropdown}>
          <Dropdown.Toggle as={Button} variant="link" id="dropdown-basic" className='bell'>
            <i className='fa fa-user-circle fs-20' onClick={() => setShowDropdown(!showDropdown)} />
            {" "}
          </Dropdown.Toggle>

          <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleAccountClick(account.accountId, account.name)}>
          <p className='no-margin'>{account.name}</p>
          <span className='gray fs-12'>Account: {account.totalSites} Sites, {account.totalEndpoints} Endpoints</span>
        </Dropdown.Item>

            {account.sites.map((site, siteIndex) => (
              <Dropdown.Item key={siteIndex}>
              <div className="accordion" id={`accordion-${siteIndex}`}>
                <div className="accordion-item">
                  <h2 className="accordion-header" id={`heading-${siteIndex}`}>
                  <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${siteIndex}`}
                  aria-expanded="true"
                  aria-controls={`collapse-${siteIndex}`}
                  onClick={() => handleAccordionClick(site.name, site.siteId)}
                >
                  {site.name} {site.activeLicenses}
                </button>

                  </h2>
                  <div
                    id={`collapse-${siteIndex}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading-${siteIndex}`}
                    data-bs-parent={`#accordion-${siteIndex}`}
                  >
                  <div className="accordion-body">
                  {site.groups.map((group, groupIndex) => (
                    <p key={groupIndex} onClick={() => handleGroupClick(group.name, group.groupId)}>
                      {group.name} {group.totalAgents}
                    </p>
                  ))}
                </div>

                  </div>
                </div>
              </div>
            </Dropdown.Item>
            
            ))}
          </Dropdown.Menu>
        </Dropdown>
      ))}

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
            <i className='fa fa-bell link' />
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
