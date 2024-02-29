import React, {useContext, useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router'
import {AppContext} from '../context/AppContextProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {fetchResetPasswordUrl} from '../../../../../api/UserProfileApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import {fetchTaskCancelUrl, fetchTasksUrl} from '../../../../../api/TasksApi'

function UpdateTask() {
  const [loading, setLoading] = useState(false)
  const userID = Number(sessionStorage.getItem('userId'))
  const date = new Date().toISOString()
  const {id} = useParams()
  const navigate = useNavigate()
  // const { tasksData } = useContext(AppContext);
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
  const handleResetPassword = async (selectedUserID) => {
    var data = {
      modifiedUserId: userID,
      modifiedDate: date,
      userId: selectedUserID,
    }
    try {
      setLoading(true)
      const responseData = await fetchResetPasswordUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        reload()
      } else {
        notifyFail(message)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
  const handleCancelPassword = async (selectedUserID) => {
    var data = {
      modifiedUserId: userID,
      modifiedDate: date,
      userId: selectedUserID,
      status: 'Cancelled',
    }
    try {
      setLoading(true)
      const responseData = await fetchTaskCancelUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        reload()
      } else {
        notifyFail(message)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
  return (
    <div className='card'>
      <ToastContainer />
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Tasks</span>
        </h3>
      </div>
      <div className='card-body'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
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
            {tasks?.map((task) => {
              if (task?.taskId === Number(id)) {
                return (
                  <tr key={task?.taskId}>
                    <td>{task?.creadatedUser}</td>
                    <td>{task?.createdDate}</td>
                    <td>{task?.taskType}</td>
                    <td>{task?.taskDescription}</td>
                    <td>{task?.orgId}</td>
                    <td>
                      <span
                        className='btn btn-small btn-new btn-primary'
                        onClick={() => handleResetPassword(task.taskForUserId)}
                      >
                        Reset pwd <i className='fa fa-pencil ms-4' />
                      </span>
                      {'  '}
                      <span
                        className='btn btn-small btn-new btn-danger'
                        onClick={() => handleCancelPassword(task.taskForUserId)}
                      >
                        Cancel
                      </span>
                    </td>
                  </tr>
                )
              }
              return null
            })}
            {tasks.length === 0 && (
              <tr>
                <td colSpan='6'>No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UpdateTask
