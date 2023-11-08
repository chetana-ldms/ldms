import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UsersListLoading } from '../components/loading/UsersListLoading';
import { ToastContainer } from 'react-toastify';
import { notify, notifyFail } from '../components/notification/Notification';
import 'react-toastify/dist/ReactToastify.css';
import { fetchOrganizationDelete } from '../../../../../api/Api';
import axios from 'axios';
import { fetchOrganizationsUrl } from '../../../../../api/ConfigurationApi';
import { useErrorBoundary } from "react-error-boundary";

const Organizations = () => {
  const handleError = useErrorBoundary();
  const [loading, setLoading] = useState(false);
  const [tools, setTools] = useState([]);
  console.log(tools, 'tools222');
  const userID = Number(sessionStorage.getItem('userId'));
  const orgId = Number(sessionStorage.getItem('orgId'));
  const globalAdminRole = Number(sessionStorage.getItem("globalAdminRole"));
  const clientAdminRole = Number(sessionStorage.getItem("clientAdminRole"));
  const handleDelete = async (item) => {
    const deletedUserId = Number(sessionStorage.getItem('userId'));
    const deletedDate = new Date().toISOString();
    const data = {
      orgID: item.orgID,
      deletedDate,
      deletedUserId,
    };
    try {
      const responce = await fetchOrganizationDelete(data);
      if (responce.isSuccess) {
        notify('Organization Deleted');
      } else {
        notifyFail('Organization not Deleted');
      }
      await reload();
    } catch (error) {
      handleError(error);
    }
  };

  const reload = async () => {
    try {
      setLoading(true);
      const response = await fetchOrganizationsUrl();
      setTools(
        userID === 1
          ? response
          : response.filter((item) => item.orgID === orgId)
      );
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    reload();
  }, []);
  return (
    <div className="card">
      <ToastContainer />
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Organizations</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            {userID === 1 ? (
              <Link to="/qradar/organizations/add" className="btn btn-danger btn-small">
                Add
              </Link>
            ) : (
              <button className="btn btn-danger btn-small" disabled>
                Add
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="card-body">
        <table className="table align-middle gs-0 gy-4 dash-table alert-table">
          <thead>
            <tr className="fw-bold text-muted bg-blue">
              <th className="min-w-50px fs-12">ID</th>
              <th className="min-w-50px fs-12">Name</th>
              <th className="min-w-50px fs-12">Address</th>
              <th className="min-w-50px fs-12">Mobile No.</th>
              <th className="min-w-50px fs-12">Email</th>
              <th className="min-w-50px fs-12">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            
              {tools.length > 0 ? (
              tools.map((item, index) => (
                <tr key={index} className="fs-12">
                  <td className="text-warning fw-bold">{item.orgID}</td>
                  <td>{item.orgName}</td>
                  <td className="text-warning fw-bold" style={{ maxWidth: '350px' }}>
                    {item.address}
                  </td>
                  <td>{item.mobileNo}</td>
                  <td>{item.email}</td>
                  <td>
                  {globalAdminRole === 1 || clientAdminRole === 1 ? (
                      <button className="btn btn-primary btn-small">
                        <Link className="text-white" to={`/qradar/organizations/update/${item.orgID}`}>
                          Update
                        </Link>
                      </button>
                    ) : (
                      <button className="btn btn-primary btn-small" disabled>
                        Update
                      </button>
                    )}
                    {userID === 1 ? (
                      <button
                        className="btn btn-sm btn-danger btn-small ms-5"
                        style={{ fontSize: '14px' }}
                        onClick={() => {
                          handleDelete(item);
                        }}
                      >
                        Delete
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-danger btn-small ms-5" style={{ fontSize: '14px' }} disabled>
                        Delete
                      </button>
                    )}
                  </td> 
                </tr>
              ))
            ):(
              <tr>
                <td colSpan="6" className="text-center">
                  No data found.
                </td>
              </tr>
            )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { Organizations };
