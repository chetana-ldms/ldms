import React, {useState, useEffect} from 'react'
import {ToastContainer} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {fetchTasksUrl} from '../../../../../api/TasksApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'

function Task() {
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState([])
  console.log(tasks, 'tasks')
  const ownerUserId = Number(sessionStorage.getItem('userId'))

  const reload = async () => {
    try {
      setLoading(true)
      const data = await fetchTasksUrl(ownerUserId)
      setTasks(data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])
  const handleDelete = () =>{

  }

  return (
    <div className='card'>
      <ToastContainer />
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Tasks</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/tasks/add' className='btn btn-danger btn-small'>
              Add
            </Link>
          </div>
        </div>
      </div>
      <div className='card-body'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th className='min-w-50px fs-12'>taskId</th>
              <th className='min-w-50px fs-12'>creadatedUser</th>
              <th className='min-w-50px fs-12'>createdDate</th>
              <th className='min-w-50px fs-12'>taskType</th>
              <th className='min-w-50px fs-12'>taskDescription</th>
              <th className='min-w-50px fs-12'>orgId</th>
              <th className='min-w-50px fs-12'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {tasks?(tasks.map((task) => (
              <tr key={task.taskId}>
                <td>{task.taskId}</td>
                <td>{task.creadatedUser}</td>
                <td>{task.createdDate}</td>
                <td>{task.taskType}</td>
                <td>{task.taskDescription}</td>
                <td>{task.orgId}</td>
                <td>
                  <button className='btn btn-primary btn-small'>
                    <Link className='text-white' to={`/qradar/tasks/update/${task.taskId}`}>
                      Update
                    </Link>
                  </button>
                  <button
                    className='btn btn-sm btn-danger btn-small ms-5'
                    style={{fontSize: '14px'}}
                    onClick={() => {
                      handleDelete(task)
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))):(<tr>
              <td colSpan="7">No data found</td>
            </tr>)}
            
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Task
