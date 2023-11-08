import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { ToastContainer, toast } from 'react-toastify'
import { notify, notifyFail } from '../components/notification/Notification'
import 'react-toastify/dist/ReactToastify.css'
import { fetchToolActionDelete } from "../../../../../api/Api"
import axios from 'axios'
import { fetchToolActionsUrl } from '../../../../../api/ConfigurationApi'
import { useErrorBoundary } from "react-error-boundary";


const ToolActions = () => {
  const handleError = useErrorBoundary();
  const globalAdminRole = Number(sessionStorage.getItem("globalAdminRole"));
  const clientAdminRole = Number(sessionStorage.getItem("clientAdminRole"));
  const [loading, setLoading] = useState(false)
  const [toolActions, setToolActions] = useState([])
  console.log(toolActions, "toolActions")
  const { status } = useParams()

  const handleDelete = async (item) => {
    console.log(item, "item")
    const deletedUserId = Number(sessionStorage.getItem('userId'));
    const deletedDate = new Date().toISOString();
    const data = {
      toolActionId: item.toolActionID,
      deletedDate,
      deletedUserId
    }
    try {
      const responce = await fetchToolActionDelete(data);
      if (responce.isSuccess) {
        notify('Tool Action Deleted');
      } else {
        notifyFail("Tool Action not Deleted")
      }
      await reload();
    } catch (error) {
      handleError(error);
    }
  }

  const reload = async () => {
    try {
      setLoading(true);
      const response = await fetchToolActionsUrl();
      setToolActions(response);
    } catch (error) {
      handleError(error);
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
          <span className='card-label fw-bold fs-3 mb-1'>Tool Actions</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            {globalAdminRole === 1 || clientAdminRole === 1 ? (
              <Link to='/qradar/tool-actions/add' className='btn btn-danger btn-small'>
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
              <th className='min-w-50px'>S.No</th>
              <th className='min-w-50px'>Tool</th>
              <th className='min-w-50px'>Tool Action Type</th>
              <th className='min-w-50px'>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {toolActions !== null ? (
              toolActions.map((item, index) => (
                <tr key={index} className='fs-12'>
                  <td>{index + 1}</td>
                  <td>{item.toolName}</td>
                  <td>{item.toolTypeActionName}</td>
                  <td>
                    {globalAdminRole === 1 || clientAdminRole === 1 ? (
                      <button className='btn btn-primary btn-small'>
                        <Link
                          className='text-white'
                          to={`/qradar/tool-actions/update/${item.toolActionID}`}
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
                <td colSpan='6' className='text-center'>No data found</td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  )
}

export { ToolActions }
