import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { ToastContainer, toast } from 'react-toastify'
import { notify, notifyFail } from '../components/notification/Notification'
import 'react-toastify/dist/ReactToastify.css'
import { fetchToolTypeActionDelete } from "../../../../../api/Api"
import axios from 'axios'
import { fetchToolTypeActions } from '../../../../../api/ConfigurationApi'
const ToolTypeActions = () => {
  const [loading, setLoading] = useState(false)
  const [toolTypeActions, setToolTypeActions] = useState([])
  const [updateData, setUpdateData] = useState({})
  const { status } = useParams()

  const handleDelete = async (item) => {
    const deletedUserId = Number(sessionStorage.getItem('userId'));
    const deletedDate = new Date().toISOString();
    const data = {
      toolTypeActionID: item.toolTypeActionID,
      deletedDate,
      deletedUserId
    }
    try {
      const responce = await fetchToolTypeActionDelete(data);
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
      const response = await fetchToolTypeActions();
      setToolTypeActions(response);
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
          <span className='card-label fw-bold fs-3 mb-1'>Tool Type Actions</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/tool-type-actions/add' className='btn btn-danger btn-small'>
              Add
            </Link>
          </div>
        </div>
      </div>
      <div className='card-body'>
        {/* {status === 'updated' && (
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
        )} */}
        {/* {status === 'updated' && (
          notify('Data Saved')
        )} */}

        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th className='min-w-50px'>Tool Action Type</th>
              <th className='min-w-50px'>Tool Type</th>
              <th className='min-w-50px'>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {toolTypeActions.map((item, index) => (
              <tr key={index} className='fs-12'>
                <td>{item.toolAction}</td>
                <td>{item.toolTypeName}</td>
                <td>
                  <Link
                    className='text-white'
                    to={`/qradar/tool-type-actions/update/${item.toolTypeActionID}`}
                  >
                    <button className='btn btn-primary btn-small'>Update</button>
                  </Link>

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

export { ToolTypeActions }
