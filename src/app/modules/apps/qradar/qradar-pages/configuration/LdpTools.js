import React, {useState, useEffect} from 'react'
import {Link, useParams} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import { ToastContainer, toast } from 'react-toastify'
import { notify, notifyFail } from '../components/notification/Notification'
import 'react-toastify/dist/ReactToastify.css'
import { fetchLDPToolsDelete } from "../../../../../api/Api"
import axios from 'axios'
import { fetchLDPToolsUrl } from '../../../../../api/ConfigurationApi'
const LdpTools = () => {
  const [loading, setLoading] = useState(false)
  const [tools, setTools] = useState([])
  console.log(tools, "tools1111")
  const {status} = useParams()

  const handleDelete = async (item)  =>{
    console.log(item, "item")
    const deletedUserId = Number(sessionStorage.getItem('userId'));
    const deletedDate = new Date().toISOString();
    const data = {
      toolId: item.toolId,
      deletedDate,
      deletedUserId
    }
    try {
      const responce = await fetchLDPToolsDelete(data);
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
    const response = await fetchLDPToolsUrl();
    setTools(response)
   }
  useEffect(() => {
    reload();
  }, [])

  return (
    <div className='card'>
       <ToastContainer />
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>LDP Tools</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/ldp-tools/add' className='btn btn-danger btn-small'>
              Add
            </Link>
          </div>
        </div>
      </div>
      <div className='card-body'>

        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th className='min-w-50px'>Tool ID</th>
              <th className='min-w-50px'>Tool Name</th>
              <th className='min-w-50px'>Tool Type</th>
              {/* <th className='min-w-50px'>Created Date</th> */}
              <th className='min-w-50px'>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {tools.map((item, index) => (
              <tr key={index} className='fs-12'>
                <td className='text-danger fw-bold'>{item.toolId}</td>
                <td>{item.toolName}</td>
                <td className='text-warning fw-bold'>{item.toolType}</td>
                {/* <td>{item.createdDate}</td> */}
                <td>
                  <Link className='text-white' to={`/qradar/ldp-tools/update/${item.toolId}`}>
                    <button className='btn btn-primary btn-small'>Update</button>
                  </Link>
                  <button className="btn btn-sm btn-danger btn-small ms-5" style={{ fontSize: '14px' }} onClick={()=>{handleDelete(item)}}> Delete</button>    

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export {LdpTools}
