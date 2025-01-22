import FetchWithToken from "../modules/auth/FetchWithToken";

const ApplicationLogsUrl =process.env.REACT_APP_APPLICATION_LOGS_URL


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

  