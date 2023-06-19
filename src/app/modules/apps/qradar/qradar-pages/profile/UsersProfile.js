import React, {useState} from 'react'

function UsersProfile() {
    return(
        <>
        <h1>Users Profile</h1>
        <div className='alert-table'>
        <table className='table users-table'>
        <thead>
            <tr>
                <th>User Name</th>
                <th>E-mail</th>
                <th>Role</th>
                <th align="right"></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Client Admin</td>
                <td>clientadmin@test.com</td>
                <td>Admin</td>
                <td align="right">
                    <span className='btn btn-small btn-new btn-primary'>Reset pwd <i className='fa fa-pencil' /></span>{" "}
                    <span className='btn btn-small btn-danger'>Delete  <i className='fa fa-trash' /></span>
                </td>
            </tr>
            <tr>
                <td>Analyst</td>
                <td>analyst@test.com</td>
                <td>Admin</td>
                <td align="right">
                    <span className='btn btn-small btn-new btn-primary'>Reset pwd <i className='fa fa-pencil' /></span>{" "}
                    <span className='btn btn-small btn-danger'>Delete  <i className='fa fa-trash' /></span>
                </td>
            </tr>
        </tbody>
        </table>
        </div>
        </>
    )
}

export default UsersProfile