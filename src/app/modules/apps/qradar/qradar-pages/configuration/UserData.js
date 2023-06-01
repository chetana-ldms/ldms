import React, {useState, useEffect} from 'react'
import {Link, useParams} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import axios from 'axios'

const UserData = () => {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const {status} = useParams()
  useEffect(() => {
    setLoading(true)
    var config = {
      method: 'post',
      url: 'http://115.110.192.133:502/api/LDPSecurity/v1/Users?OrgId=1',
      headers: {
        Accept: 'text/plain',
      },
    }

    axios(config)
      .then(function (response) {
        setUsers(response.data.usersList)
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [])
  return (
    <div className='card'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>System Users</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/users-data/add' className='btn btn-danger btn-small'>
              Add New User
            </Link>
          </div>
        </div>
      </div>
      <div className='card-body'>
        {status === 'updated' && (
          <div class='alert alert-success d-flex align-items-center p-5'>
            <div class='d-flex flex-column'>
              <h4 class='mb-1 text-dark'>Data Saved</h4>
            </div>
            <button
              type='button'
              class='position-absolute position-sm-relative m-2 m-sm-0 top-0 end-0 btn btn-icon ms-sm-auto'
              data-bs-dismiss='alert'
            >
              X<span class='svg-icon svg-icon-2x svg-icon-light'>...</span>
            </button>
          </div>
        )}

        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th className='min-w-50px'>User ID</th>
              <th className='min-w-50px'>User Name</th>
              <th className='min-w-50px'>User Role</th>
              <th className='min-w-50px'>Created Date</th>
              <th className='min-w-50px'>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {users.map((item, index) => (
              <tr key={index} className='fs-12'>
                <td className='text-danger fw-bold'>{item.userID}</td>
                <td>{item.name}</td>
                <td className='text-warning fw-bold'>{item.roleID}</td>
                <td>{item.createdDete}</td>
                <td>
                  <Link className='text-white' to={`/qradar/users-data/update/${item.userID}`}>
                    <button className='btn btn-danger btn-small'>Update</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export {UserData}
