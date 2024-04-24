const tasksUrl = process.env.REACT_APP_TASK_LIST_URL
const taskCancelUrl =process.env.REACT_APP_PASSWORDRESET_STATUS_UPDATE_URL

export const fetchTasksUrl = async (ownerUserId) => {
    try {
      const response = await fetch(`${tasksUrl}?ownerUserId=${ownerUserId}`, {
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
      console.log(taskList, "taskList");
      return taskList;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchTaskCancelUrl = async (data) => {
    try {
      const response = await fetch(`${taskCancelUrl}`, {
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
