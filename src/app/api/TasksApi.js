import { API } from "../../config/apiConfig";
import FetchWithToken from "../modules/auth/FetchWithToken";

const tasksUrl = API.TASK_LIST;
const taskCancelUrl = API.STATUS_CANCEL;

export const fetchTasksUrl = async (ownerUserId) => {
    try {
      const response = await FetchWithToken(`${tasksUrl}?ownerUserId=${ownerUserId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const responseData = await response.json();
      const taskList = responseData.taskList;
      return taskList;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchTaskCancelUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${taskCancelUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };
