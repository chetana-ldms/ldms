const tasksUrl = "http://115.110.192.133:502/api/Task/v1/Tasks";

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
