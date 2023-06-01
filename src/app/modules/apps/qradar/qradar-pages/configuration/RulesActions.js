import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { ToastContainer, toast } from 'react-toastify'
import { notify, notifyFail } from '../components/notification/Notification'
import 'react-toastify/dist/ReactToastify.css'
import { fetchRuleActionDelete } from "../../../../../api/Api"
import axios from 'axios'
const RulesActions = () => {
  const [loading, setLoading] = useState(false)
  const [tools, setTools] = useState([])
  const { status } = useParams()

  const handleDelete = async (item) => {
    console.log(item, "item")
    const deletedUser = sessionStorage.getItem('userId');
    const deletedDate = new Date().toISOString();
    const data = {
      ruleActionID: item.ruleActionID,
      deletedDate,
      deletedUser
    } 
    try {
      await fetchRuleActionDelete(data);
      notify('Data Deleted');
      await reload();
    } catch (error) {
      console.log(error);
    }
  }
  const reload = () => {
    // setLoading(true)
    var config = {
      method: 'get',
      url: 'http://115.110.192.133:8011/api/RuleAction/v1/RuleActions',
      headers: {
        Accept: 'text/plain',
      },
    }

    axios(config)
      .then(function (response) {
        setTools(response.data.ruleActionList)
        console.log(response.data.ruleActionList)
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error)
      })
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
              <th className='min-w-50px'>Rule Action Name</th>
              <th className='min-w-50px'>Tool Type</th>
              <th className='min-w-50px'>Tool</th>
              <th className='min-w-50px'>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {tools.map((item, index) => (
              <tr key={index} className='fs-12'>
                <td>{item.ruleActionName}</td>
                <td>{item.toolTypeID}</td>
                <td>{item.toolID}</td>
                <td>
                  <Link
                    className='text-white'
                    to={`/qradar/rules-actions/update/${item.ruleActionID}`}
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

export { RulesActions }
