import React, {useState, useEffect} from 'react'
import {Link, useParams} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import axios from 'axios'

const OrganizationTools = () => {
  const [loading, setLoading] = useState(false)
  const [tools, setTools] = useState([])
  const {status} = useParams()

  useEffect(() => {
    setLoading(true)
    var config = {
      method: 'get',
      url: 'http://115.110.192.133:502/api/LDPlattform/v1/OrganizationTools',
      headers: {
        Accept: 'text/plain',
      },
    }
    axios(config)
      .then(function (response) {
        setTools(response.data.organizationToolList)
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
          <span className='card-label fw-bold fs-3 mb-1'>Organizations</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/organization-tools/add' className='btn btn-danger btn-small'>
              Add
            </Link>
          </div>
        </div>
      </div>
      <div className='card-body'>
        {status == 'updated' && (
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
              <th className='min-w-50px fs-12'>S.NoD</th>
              <th className='min-w-50px fs-12'>Org Tool Name</th>
              <th className='min-w-50px fs-12'>Org Organization</th>
              <th className='min-w-50px fs-12'>Org Auth Key</th>
              <th className='min-w-50px fs-12'>Org API URL</th>
              <th className='min-w-50px fs-12'>Actions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {tools.map((item, index) => (
              <tr key={index} className='fs-12'>
                <td>{index + 1}</td>
                <td className='fw-bold'>{item.toolName}</td>
                <td>{item.orgID}</td>
                <td className='text-warning fw-bold'>{item.authKey}</td>
                <td>{item.apiUrl}</td>
                <td>
                  <button className='btn btn-danger btn-small'>
                    <Link
                      className='text-white'
                      to={`/qradar/organization-tools/update/${item.toolID}`}
                    >
                      Update
                    </Link>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export {OrganizationTools}
