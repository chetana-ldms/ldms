import React, {useState, useEffect} from 'react'
import {Link, useParams} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import { ToastContainer, toast } from 'react-toastify'
import { notify, notifyFail } from '../components/notification/Notification'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { fetchDelete, fetchPlayBooks } from '../../../../../api/playBookApi'
const Playbooks = () => {
  const orgId = Number(sessionStorage.getItem('orgId'));
  const [loading, setLoading] = useState(false)
  const [playbooks, setPlaybooks] = useState([])
  const {status} = useParams()

  const handleDelete = async (item) => {
    console.log(item, "item")
    const deletedUserId = sessionStorage.getItem('userId');
    const deletedDate = new Date().toISOString();
    const data = {
      playBookID: item.playBookID,
      deletedDate,
      deletedUserId
    } 
    try {
      const responce = await fetchDelete(data);
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
  const reload = async() => {
    try {
      const data = await fetchPlayBooks(orgId);
      setPlaybooks(data);
    } catch (error) {
      console.log(error)
    }
}
  useEffect(() => {
    reload();
  }, [])
  // const handleExecute = (item, param) => {
  //   setTimeout(() => {
  //     setLoading(false)
  //   }, 6000)
  //   setLoading(true)
  // }

  return (
    <div className='card'>
      <ToastContainer />
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>PlayBooks</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/addplaybooks' className='btn btn-danger btn-small'>
              Add
            </Link>
          </div>
        </div>
      </div>
      <div className='card-body'>

        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold bg-light'>
              <th className='min-w-50px'>PlayBook Name</th>
              <th className='min-w-50px'>Description</th>
              <th className='min-w-50px'>Alert Category</th>
              <th className='min-w-50px'>Status</th>
              <th className='min-w-50px'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {playbooks.map((item, index) => (
              <tr key={index} className='fs-12'>
                <td className='fs-14'>{item.playBookName}</td>
                <td className='fs-14'>{item.remarks}</td>
                <td className='fs-14'>{item.alertCatogory}</td>
                <td>
                  {item.active === 1 ? (
                    <span className='badge badge-success fs-14'>Active</span>
                  ) : (
                    <span className='badge badge-danger fs-14'>In Active</span>
                  )}
                </td>

                <td className='fs-14'>
                  <Link className='text-white' to={`/qradar/updateplaybooks/${item.playBookID}`}>
                    <button className='btn btn-primary btn-small'>Update</button>
                  </Link>
                  <button className="btn btn-sm btn-danger btn-small ms-5" style={{ fontSize: '14px' }} onClick={() => { handleDelete(item) }}> Delete</button>

                  {/* <button
                    className='btn btn-warning disable btn-small pt-5'
                    onClick={() => handleExecute(item, index)}
                  >
                    Execute
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export {Playbooks}
