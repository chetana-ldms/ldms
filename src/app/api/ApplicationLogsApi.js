import { API } from "../../config/apiConfig";
import FetchWithToken from "../modules/auth/FetchWithToken";

const ApplicationLogsUrl = API.APPLICATION_LOGS

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

  