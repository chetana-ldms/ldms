import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { notify, notifyFail } from '../components/notification/Notification'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { fetchOrganizationToolsDelete } from "../../../../../api/Api"
import axios from 'axios'
import { fetchOrganizationToolsUrl } from '../../../../../api/ConfigurationApi'

const OrganizationTools = () => {
  const [loading, setLoading] = useState(false)
  const [tools, setTools] = useState([])
  console.log(tools, "tools3333")
  const { status } = useParams()

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
      const responce = await  fetchOrganizationToolsDelete(data);
      if (responce.isSuccess) {
        notify('Data Deleted');
      }else{
        notifyFail("Data not Deleted")
      }
      await reload();
    } catch (error) {
      console.log(error);
    }
  }
  const reload = async () => {
    try {
      setLoading(true);
      const response = await fetchOrganizationToolsUrl();
      setTools(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    reload();
  }, [])

  return (
    <div className='card'>
      <ToastContainer />
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Organizations Tools</span>
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
            {loading && <UsersListLoading />}
            {tools.map((item, index) => (
              <tr key={index} className='fs-12'>
                <td>{index + 1}</td>
                <td className='fw-bold'>{item.toolName}</td>
                <td>{item.orgName}</td>
                <td className='text-warning fw-bold'>{item.authKey}</td>
                <td style={{ maxWidth: '250px' }}>{item.apiUrl}</td>
                <td>
                  <button className='btn btn-primary btn-small'>
                    <Link
                      className='text-white'
                      to={`/qradar/organization-tools/update/${item.orgToolID}`}
                    >
                      Update
                    </Link>
                  </button>
                  <button className="btn btn-sm btn-danger btn-small ms-5" style={{ fontSize: '14px' }} onClick={() => { handleDelete(item) }}> Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export { OrganizationTools }
