import React, {useState, useEffect} from 'react'
import {Link, useParams} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import axios from 'axios'
const Playbooks = () => {
  const [loading, setLoading] = useState(false)
  const [playbooks, setPlaybooks] = useState([])
  const {status} = useParams()

  useEffect(() => {
    setLoading(true)
    var config = {
      method: 'get',
      url: 'http://115.110.192.133:8011/api/PlayBook/v1/PlayBooks',
      headers: {
        Accept: 'text/plain',
      },
    }

    axios(config)
      .then(function (response) {
        setPlaybooks(response.data.playbooks)
        console.log(response.data.playbooks)
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [])
  // const handleExecute = (item, param) => {
  //   setTimeout(() => {
  //     setLoading(false)
  //   }, 6000)
  //   setLoading(true)
  // }

  return (
    <div className='card'>
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
            <tr className='fw-bold bg-light'>
              <th className='min-w-50px'>PlayBook Name</th>
              <th className='min-w-50px'>Description</th>
              <th className='min-w-50px'>Alert Category</th>
              <th className='min-w-50px'>Status</th>
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
                  {/* <Link className='text-white' to={`/qradar/updateplaybooks/${item.playBookID}`}>
                    <button className='btn btn-danger btn-small'>Update</button>
                  </Link> */}
                  &nbsp;
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
