import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { ToastContainer, toast } from 'react-toastify'
import { notify, notifyFail } from '../components/notification/Notification'
import 'react-toastify/dist/ReactToastify.css'
import { fetchRuleActionDelete } from "../../../../../api/Api"
import axios from 'axios'
import { fetchRuleActions } from '../../../../../api/ConfigurationApi'
import { useErrorBoundary } from "react-error-boundary";
 

const RulesActions = () => {
  const handleError = useErrorBoundary();
  const orgId = Number(sessionStorage.getItem('orgId'));
  const [loading, setLoading] = useState(false)
  const [tools, setTools] = useState([])
  console.log(tools, "tools")
  const { status } = useParams()

  const handleDelete = async (item) => {
    console.log(item, "item")
    const deletedUserId = sessionStorage.getItem('userId');
    const deletedDate = new Date().toISOString();
    const data = {
      ruleActionID: item.ruleActionID,
      deletedDate,
      deletedUserId
    }
    try {
      const responce = await fetchRuleActionDelete(data);
      if (responce.isSuccess) {
        notify('Rule Action Deleted');
      } else {
        notifyFail("Rule Action not Deleted")
      }
      await reload();
    } catch (error) {
      handleError(error);
    }
  }
  const reload = async () => {
    try {
      setLoading(true)
      const data = await fetchRuleActions(orgId);
      setTools(data);
      setLoading(false)
    } catch (error) {
      handleError(error);
      setLoading(false)
    }
  }
  useEffect(() => {
    reload();
  }, [])

  return (
    <div className='card'>
      <ToastContainer />
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Rule Actions</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/rules-actions/add' className='btn btn-danger btn-small'>
              Add
            </Link>
          </div>
        </div>
      </div>
      <div className='card-body'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th className='min-w-50px'>Rule Action Name</th>
              <th className='min-w-50px'>Tool Type</th>
              <th className='min-w-50px'>Tool</th>
              <th className='min-w-50px'>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {tools.length > 0 ? (
              tools.map((item, index) => (
                <tr key={index} className='fs-12'>
                  <td>{item.ruleActionName}</td>
                  <td>{item.toolTypeName}</td>
                  <td>{item.toolName}</td>
                  <td>
                    <Link
                      className='text-white'
                      to={`/qradar/rules-actions/update/${item.ruleActionID}`}
                    >
                      <button className='btn btn-primary btn-small'>Update</button>
                    </Link>
                    <button
                      className="btn btn-sm btn-danger btn-small ms-5"
                      style={{ fontSize: '14px' }}
                      onClick={() => { handleDelete(item) }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No data found</td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  )
}

export { RulesActions }
