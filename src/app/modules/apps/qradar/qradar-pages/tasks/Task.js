import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchTaskCancelUrl, fetchTasksUrl } from "../../../../../api/TasksApi";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { AppContext } from "../context/AppContextProvider";
import { fetchResetPasswordUrl } from "../../../../../api/UserProfileApi";
import { notify, notifyFail } from "../components/notification/Notification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Task() {
  const [loading, setLoading] = useState(false);
  const userID = Number(sessionStorage.getItem("userId"));
  const date = new Date().toISOString();
  const { id } = useParams();
  const LoginCheck = sessionStorage.getItem("clickedButton");
  console.log(LoginCheck, "LoginCheck");
  const navigate = useNavigate();
  // const {tasksData} = useContext(AppContext)
  // console.log(tasksData)
  // const [tasks, setTasks] = useState(tasksData)
  // console.log(tasks, 'tasks')const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState([]);
  console.log(tasks, "tasks");
  const ownerUserId = Number(sessionStorage.getItem("userId"));

  const reload = async () => {
    try {
      setLoading(true);
      const data = await fetchTasksUrl(ownerUserId);
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const handleResetPassword = async (selectedUserID) => {
    var data = {
      modifiedUserId: userID,
      modifiedDate: date,
      userId: selectedUserID,
    };
    try {
      setLoading(true);
      const responseData = await fetchResetPasswordUrl(data);
      const { isSuccess, message } = responseData;

      if (isSuccess) {
        notify(message)
        reload();
      } else {
        notifyFail(message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const handleCancelPassword = async (selectedUserID) => {
    var data = {
      modifiedUserId: userID,
      modifiedDate: date,
      userId: selectedUserID,
      status: "Cancelled",
    };
    try {
      setLoading(true);
      const responseData = await fetchTaskCancelUrl(data);
      const { isSuccess, message } = responseData;

      if (isSuccess) {
        notify(message);
        reload();
      } else {
        notifyFail(message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  if (LoginCheck === "true" && tasks === null) {
    sessionStorage.removeItem("openTaskCount");
    setTimeout(()=>{
      navigate("/dashboard");},2000);
    sessionStorage.removeItem("clickedButton");
  }
  return (
    <div className="no-pad">
      <ToastContainer />
      <div className="border-0">
        <h1 className="card-title align-items-start flex-column mb-10">
          <span className="card-label fw-bold fs-3 mb-1">Tasks</span>
        </h1>
      </div>
      <div className="card-body">
        <table className="table align-middle gs-0 gy-4 dash-table alert-table">
          <thead>
            <tr className="fw-bold text-muted bg-blue">
              <th className="min-w-50px fs-14"> User</th>
              <th className="min-w-50px fs-14">Created Date</th>
              <th className="min-w-50px fs-14">Task Type</th>
              <th className="min-w-50px fs-14">Task Description</th>
              <th className="min-w-50px fs-14">Org Id</th>
              <th className="min-w-50px fs-14">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {tasks ? (
              tasks.map((task) => (
                <tr key={task.taskId}>
                  <td>{task.creadatedUser}</td>
                  <td>{task.createdDate}</td>
                  <td>{task.taskType}</td>
                  <td>{task.taskDescription}</td>
                  <td>{task.orgId}</td>
                  <td className="text-right">
                    <span
                      className="btn btn-small btn-new btn-primary"
                      onClick={() => handleResetPassword(task.taskForUserId)}
                    >
                      Reset pwd <i className="fa fa-pencil ms-4" />
                    </span>
                    {"  "}
                    <span
                      className="btn btn-small btn-danger"
                      onClick={() => handleCancelPassword(task.taskForUserId)}
                    >
                      Cancel <i className="fa fa-trash ms-4" />
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Task;
