import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import axios from 'axios'
import { useErrorBoundary } from "react-error-boundary";


const RoleData = () => {
  const handleError = useErrorBoundary();
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState([])
  useEffect(() => {
    setLoading(true)
    var config = {
      method: 'post',
      url: 'http://115.110.192.133:502/api/LDPSecurity/v1/Roles?orgId=1',
      headers: {
        Accept: 'text/plain',
      },
    }

    axios(config)
      .then(function (response) {
        setRoles(response.data.rolesList)
        setLoading(false)
      })
      .catch(function (error) {
        handleError(error);
      })
  }, [])
  return (
    <div className='card'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>System Roles</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'></div>
        </div>
      </div>
      <div className='card-body'>

        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th className='min-w-50px'>Role ID</th>
              <th className='min-w-50px'>Role Name</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {roles.length > 0 ? (
              roles.map((item, index) => (
                <tr key={index} className='fs-12'>
                  <td className='text-danger fw-bold'>{item.roleID}</td>
                  <td>{item.roleName}</td>
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
