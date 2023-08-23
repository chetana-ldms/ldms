import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { notify, notifyFail } from '../components/notification/Notification';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchOrganizationToolsDelete } from "../../../../../api/Api";
import axios from 'axios';
import { fetchOrganizationToolsUrl } from '../../../../../api/ConfigurationApi';
import { useErrorBoundary } from "react-error-boundary";


const OrganizationTools = () => {
  const handleError = useErrorBoundary();
  const userID = Number(sessionStorage.getItem('userId'));
  const orgId = Number(sessionStorage.getItem('orgId'));
  const [tools, setTools] = useState([]);

  const handleDelete = async (item) => {
    console.log(item, "item")
    const deletedUserId = Number(sessionStorage.getItem('userId'));
    const deletedDate = new Date().toISOString();
    const data = {
      orgToolID: item.orgToolID,
      deletedDate,
      deletedUserId
    }
    try {
      const responce = await fetchOrganizationToolsDelete(data);
      if (responce.isSuccess) {
        notify('Organizations Tool Deleted');
      } else {
        notifyFail("Organizations Tool not Deleted")
      }
      await reload();
    } catch (error) {
      handleError(error);    }
  }

  const reload = async () => {
    try {
      const response = await fetchOrganizationToolsUrl();
      setTools(response);
    } catch (error) {
      handleError(error);    }
  };

  useEffect(() => {
    reload();
  }, []);

  return (
    <div className='card'>
      <ToastContainer />
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Organizations Tools</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            {userID === 1 ? (
              <Link to='/qradar/organization-tools/add' className='btn btn-danger btn-small'>
                Add
              </Link>
            ) : (
              <button className='btn btn-danger btn-small' disabled>
                Add
              </button>
            )}
          </div>
        </div>
      </div>
      <div className='card-body'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th className='min-w-50px fs-12'>S.NoD</th>
              <th className='min-w-50px fs-12'>Org Tool Name</th>
              <th className='min-w-50px fs-12'>Org Organization</th>
              <th className='min-w-50px fs-12'>Org Auth Key</th>
              <th className='min-w-50px fs-12'>Org API URL</th>
              <th className='min-w-50px fs-12'>Actions</th>
              {/* <th></th> */}
            </tr>
          </thead>
          <tbody>
            {tools.length === 0 ? (
              <tr>
                <td colSpan='6' className='text-center'>
                  No data found.
                </td>
              </tr>
            ) : (
              tools.map((item, index) => {
                // Check if the userID is 1 or the item belongs to the current user (userID === 2)
                const shouldDisplay = userID === 1 || item.orgID === orgId;

                if (shouldDisplay) {
                  return (
                    <tr key={index} className='fs-12'>
                      <td>{index + 1}</td>
                      <td className='fw-bold'>{item.toolName}</td>
                      <td>{item.orgName}</td>
                      <td className='text-warning fw-bold'>{item.authKey}</td>
                      <td style={{ maxWidth: '250px' }}>{item.apiUrl}</td>
                      <td>
                        {userID === 1 ? (
                          <button className='btn btn-primary btn-small'>
                            <Link
                              className='text-white'
                              to={`/qradar/organization-tools/update/${item.orgToolID}`}
                            >
                              Update
                            </Link>
                          </button>
                        ) : (
                          <button className='btn btn-primary btn-small' disabled>
                            Update
                          </button>
                        )}
                        {userID === 1 ? (
                          <button
                            className='btn btn-sm btn-danger btn-small ms-5'
                            style={{ fontSize: '14px' }}
                            onClick={() => {
                              handleDelete(item);
                            }}
                          >
                            Delete
                          </button>
                        ) : (
                          <button
                            className='btn btn-sm btn-danger btn-small ms-5'
                            style={{ fontSize: '14px' }}
                            disabled
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                }

                return null; // Skip rendering if the condition is not met
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { OrganizationTools };
