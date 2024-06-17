import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Dropdown, Button } from 'react-bootstrap';
import { KTSVG, toAbsoluteUrl } from '../../../helpers';
import { HeaderNotificationsMenu, HeaderUserMenu } from '../../../partials';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../app/modules/apps/qradar/qradar-pages/context/AppContextProvider';
import { fetchTasksUrl } from '../../../../app/api/TasksApi';
import { fetchAPITokenExpireUrl, fetchAccountsStructureUrl, fetchOrganizations } from '../../../../app/api/Api';

interface Task {
  taskId: string;
  taskTitle: string;
}
interface ToolExpireMessage {
  message: string;
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
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const accountNames = sessionStorage.getItem('accountName')
  const siteNames = sessionStorage.getItem('siteName') || '';
  const groupNames = sessionStorage.getItem('groupName') || '';
  const toolExpire = sessionStorage.getItem('toolExpire');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tasksData, setTasksData] = useState<Task[]>([]);
  const [accountName, setAccountName] = useState<string>('');
  const [siteName, setSiteName] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('');
  const [toolExpireMessage, setToolExpireMessage] = useState<string | ToolExpireMessage>('');
  const [accountsStructure, setAccountsStructure] = useState<Account[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false); 
  const ownerUserId = Number(sessionStorage.getItem('userId'));
  const [organizations, setOrganizations] = useState<{ orgID: number; orgName: string }[]>([]);
  const orgId = Number(sessionStorage.getItem('orgId'));
  const accountNameDefault = sessionStorage.getItem('accountName');
  const openTaskCount = Number(sessionStorage.getItem('openTaskCount'))
 
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
    let timer: ReturnType<typeof setTimeout>;

    if (openTaskCount > 0) {
      timer = setTimeout(() => {
        reload();
      }, 2 * 60000); 
    }

    return () => clearTimeout(timer);
  }, [tasksData, openTaskCount]);

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
      testFlag: true
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
  const fetchDataApiExpire = async () => {
    const data = {
      orgID: orgId,
    };
    try {
      setLoading(true);
      const response = await fetchAPITokenExpireUrl(data);
      setToolExpireMessage(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (toolExpire === "true") {
      fetchDataApiExpire(); 
      const intervalId = setInterval(() => {
        fetchDataApiExpire();
      }, 30 * 60 * 1000); 
      return () => clearInterval(intervalId);
    }
  }, [toolExpire]);
  
  const handleAccountClick = (accountId: string, accountName: string) => {
    sessionStorage.setItem('accountId', accountId);
    sessionStorage.setItem('accountName', accountName);
    setAccountName(accountName);
    setSiteName("");
    setGroupName("");
    sessionStorage.removeItem('siteName');
    sessionStorage.removeItem('siteId');
    sessionStorage.removeItem('groupName');
    sessionStorage.removeItem('groupId');
    window.location.reload();
  };
  
  const handleAccordionClick = (name: string, id: string) => {
    sessionStorage.setItem('siteName', name);
    setSiteName(name)
    setGroupName("");
    sessionStorage.setItem('siteId', id);
    sessionStorage.removeItem('groupName');
    sessionStorage.removeItem('groupId');
    window.location.reload();
  };
  const handleGroupClick = (name: string, id: string) => {
    sessionStorage.setItem('groupName', name);
    setGroupName(name);
    sessionStorage.setItem('groupId', id);
    window.location.reload();
  };

  return (
    <div className='app-navbar flex-shrink-0 account-header'>
      <div className='d-flex mt-5 semi-bold acc-site'>
        {accountsStructure !== null ? (
          <>
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

            {accountName || accountNames ? (
              <Dropdown>
                <Dropdown.Toggle variant="primary" className='no-btn' id="dropdown-basic">
                  {`/ ${accountName || accountNames}`} 
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {accountsStructure
                    ?.find(account => account.name === (accountName || accountNames))
                    ?.sites
                    ?.map((site, siteIndex) => (
                      <Dropdown.Item key={siteIndex} onClick={() => handleAccordionClick(site.name, site.siteId)}>
                        <div className='d-flex justify-content-between '>
                          <div>{site.name}</div>
                          <div>({site.activeLicenses})</div>
                        </div>
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
            ) : null}

            {siteName || siteNames ? (
              <Dropdown>
                <Dropdown.Toggle variant="primary" className='no-btn' id="dropdown-basic">
                  {`/ ${siteName || siteNames}`} 
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {accountsStructure
                    ?.find(account => account.name === (accountName || accountNames))
                    ?.sites.find(site => site.name === (siteName || siteNames))
                    ?.groups.map((group, groupIndex) => (
                      <Dropdown.Item key={groupIndex} onClick={() => handleGroupClick(group.name, group.groupId)}>
                        <div className='d-flex justify-content-between '>
                          <div>{group.name}</div>
                          <div>({group.totalAgents})</div>
                        </div>
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
            ) : null}

            {groupName || groupNames ? (
              <Dropdown>
                <Dropdown.Toggle variant="primary" className='no-btn' id="dropdown-basic">
                  {`/ ${groupName || groupNames}`}
                </Dropdown.Toggle>
              </Dropdown>
            ) : null}
          </>
        ) : (
          <div>{orgNames}</div>
        )}
      </div>
      {toolExpireMessage && typeof toolExpireMessage === 'object' && (
        <div className='d-flex align-items-center me-10'>{toolExpireMessage.message}</div>
      )}
      <div className='d-flex align-items-center'><span>Welcome <b>{userName}!</b></span></div>
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
            {tasksData !==null ? (
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
