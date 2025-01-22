import FetchWithToken from "../modules/auth/FetchWithToken";

const ApplicationLogsUrl ="http://10.41.3.232:501/api/ApplicationLog/v1/ApplicationLogs"


export const fetchApplicationLogsUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${ApplicationLogsUrl}`, {
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

  