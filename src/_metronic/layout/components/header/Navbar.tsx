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
  const [accountName, setAccountName] = useState<string>('');
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
    sessionStorage.setItem('accountId', accountId);
    sessionStorage.setItem('accountName', accountName);
    setAccountName(accountName);
    setSiteName("");
    setGroupName("");
    sessionStorage.setItem('siteName', "Default site");
    sessionStorage.setItem('siteId', "1");
    sessionStorage.setItem('groupName', "Default Group");
    sessionStorage.setItem('groupId', "1");
  };
  
  const handleAccordionClick = (name: string, id: string) => {
    sessionStorage.setItem('siteName', name);
    setSiteName(name)
    setGroupName("");
    sessionStorage.setItem('siteId', id);
    sessionStorage.setItem('groupName', "Default Group");
    sessionStorage.setItem('groupId', "1");
    
  };
  const handleGroupClick = (name: string, id: string) => {
    sessionStorage.setItem('groupName', name);
    setGroupName(name);
    sessionStorage.setItem('groupId', id);
  };
// const accountName = sessionStorage.getItem('accountName');
// const siteName = sessionStorage.getItem('siteName');
// const groupName = sessionStorage.getItem('groupName');
  return (
    <div className='app-navbar flex-shrink-0 account-header'>
      {/* <div className='d-flex mt-5 semi-bold'>
      {orgNames}/{accountNames.join(', ')}{siteName ? `/${siteName}` : ''}{groupName ? `/${groupName}` : ''}
      </div> */}
      {/* <div className='d-flex mt-5 semi-bold'>
      {orgNames}
      </div> */}
      <div className='d-flex mt-5 semi-bold'>
        <Dropdown>
          <Dropdown.Toggle variant="primary" className='no-btn' id="dropdown-basic">
          {orgNames}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {accountsStructure.map((account, index) => (
              <Dropdown.Item key={index} onClick={() => handleAccountClick(account.accountId, account.name)}>
                {account.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
       {
          accountName &&
          <Dropdown>
          <Dropdown.Toggle variant="primary" className='no-btn' id="dropdown-basic">
          {` / ${accountName}`}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {accountsStructure?.find(account => account.name === accountName)?.sites.map((site, siteIndex) => (
              <Dropdown.Item key={siteIndex} onClick={() => handleAccordionClick(site.name, site.siteId)}>
                {site.name} {site.activeLicenses}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        }
      
        {siteName &&
          <Dropdown>
            <Dropdown.Toggle variant="primary" className='no-btn' id="dropdown-basic">
              {`/ ${siteName}`}
            </Dropdown.Toggle>
            <Dropdown.Menu>
            {accountsStructure
              ?.find(account => account.name === accountName)
              ?.sites.find(site => site.name === siteName)
              ?.groups.map((group, groupIndex) => (
                <Dropdown.Item key={groupIndex} onClick={() => handleGroupClick(group.name, group.groupId)}>
                  {group.name} {group.totalAgents}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
            </Dropdown>
            }
            {groupName &&
            <Dropdown>
            <Dropdown.Toggle variant="primary" className='no-btn' id="dropdown-basic">
              {`/ ${groupName}`}
            </Dropdown.Toggle>
          </Dropdown>
        }
      </div>
     
      
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
