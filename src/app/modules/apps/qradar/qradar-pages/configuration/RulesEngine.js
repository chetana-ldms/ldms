import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { notify, notifyFail } from '../components/notification/Notification'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { fetchRulesDelete } from "../../../../../api/Api"
import axios from 'axios'
import { fetchRules } from '../../../../../api/ConfigurationApi'
import { useErrorBoundary } from "react-error-boundary";


const RulesEngine = () => {
  const handleError = useErrorBoundary();
  const globalAdminRole = Number(sessionStorage.getItem("globalAdminRole"));
  const clientAdminRole = Number(sessionStorage.getItem("clientAdminRole"));
  const orgId = Number(sessionStorage.getItem('orgId'));
  const [loading, setLoading] = useState(false)
  const [tools, setTools] = useState([])

  const handleDelete = async (item) => {
    console.log(item, "item")
    const deletedUserId = Number(sessionStorage.getItem('userId'));
    const deletedDate = new Date().toISOString();
    const data = {
      ruleID: item.ruleID,
      deletedDate,
      deletedUserId
    }
    try {
      const responce = await fetchRulesDelete(data);
      if (responce.isSuccess) {
        notify('Rule Deleted');
      } else {
        notifyFail("Rule not Deleted")
      }
      await reload();
    } catch (error) {
      handleError(error);    }
  }
  const reload = async () => {
    try {
      setLoading(true)
      const data = await fetchRules(orgId);
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
          <span className='card-label fw-bold fs-3 mb-1'>Rule Engine</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
          {globalAdminRole === 1 || clientAdminRole === 1 ? (
              <Link to='/qradar/rules-engine/add' className='btn btn-danger btn-small'>
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
              <th className='min-w-50px'>Rule Name</th>
              {/* <th className='min-w-50px'>Rule Conditions</th> */}
              <th className='min-w-50px'>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {tools !==null && tools.length > 0 ? (
              tools.map((item, index) => (
                <tr key={index} className='fs-12'>
                  <td>{item.ruleName}</td>
                  {/* <td>{item.ruleCatagoryID}</td> */}
                  <td>
                  {globalAdminRole === 1 || clientAdminRole === 1 ? (
                      <button className='btn btn-primary btn-small'>
                        <Link
                          className='text-white'
                          to={`/qradar/rules-engine/update/${item.ruleID}`}
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

export { RulesEngine }
