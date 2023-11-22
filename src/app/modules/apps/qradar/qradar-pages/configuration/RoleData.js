import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { ToastContainer, toast } from 'react-toastify'
import { notify, notifyFail } from '../components/notification/Notification'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { useErrorBoundary } from "react-error-boundary";
import { fetchRolesDeleteUrl, fetchRolesUrl } from '../../../../../api/ConfigurationApi';
import { fetchLDPToolsDelete } from '../../../../../api/Api';


const RoleData = () => {
  const handleError = useErrorBoundary();
  const globalAdminRole = Number(sessionStorage.getItem("globalAdminRole"));
  const clientAdminRole = Number(sessionStorage.getItem("clientAdminRole"));
  const orgId = Number(sessionStorage.getItem('orgId'));
  const orgIdFromSession = Number(sessionStorage.getItem("orgId"));
  const [selectedOrganization, setSelectedOrganization] = useState(orgIdFromSession);
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState([])
  console.log(roles, "roles111")

  const reload = async () => {
    try {
      setLoading(true)
      // const orgId = Number(sessionStorage.getItem('orgId'));
      const data = await fetchRolesUrl(orgId);
      setRoles(data);
      setLoading(false)
    } catch (error) {
      handleError(error);
      setLoading(false)
    }
  };

  useEffect(() => {
    reload();
  }, []);
  const handleDelete = async (item) => {
    console.log(item, "item")
    const deletedUserId = Number(sessionStorage.getItem('userId'));
    const deletedDate = new Date().toISOString();
    const data = {
      roleID: item.roleID,
      deletedDate,
      deletedUserId
    }
    try {
      setLoading(true)
      const responce = await fetchRolesDeleteUrl(data);
      if (responce.isSuccess) {
        notify('Role Deleted');
      } else {
        notifyFail("Role not Deleted")
      }
      await reload();
      setLoading(false)
    } catch (error) {
      setLoading(false)
      handleError(error);
    }
  }
  return (
    <div className='card'>
      <ToastContainer />
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>System Roles</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            {globalAdminRole === 1 || clientAdminRole === 1 ? (
              <Link to='/qradar/roles-data/add' className='btn btn-danger btn-small'>
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
              <th className='min-w-50px'>Role ID</th>
              <th className='min-w-50px'>Role Name</th>
              <th className='min-w-50px'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {roles.length > 0 ? (
              roles.map((item, index) => (
                <tr key={index} className='fs-12'>
                  <td className='text-danger fw-bold'>{item.roleID}</td>
                  <td>{item.roleName}</td>
                  <td>
                    {globalAdminRole === 1 || clientAdminRole === 1 ? (
                      <button className='btn btn-primary btn-small'>
                        <Link
                          className='text-white'
                          to={`/qradar/roles-data/update/${item.roleID}`}
                        >
                          Update
                        </Link>
                      </button>
                    ) : (
                      <button className='btn btn-primary btn-small' disabled>
                        Update
                      </button>
                    )}
                    {globalAdminRole === 1 || clientAdminRole === 1 ? (
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
              ))
            ) : (
              <tr>
                <td colSpan="2">No data found</td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  )
}

export { RoleData }
