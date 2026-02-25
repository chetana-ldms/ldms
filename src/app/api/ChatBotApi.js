
import { API } from "../../config/apiConfig";
import FetchWithToken from "../modules/auth/FetchWithToken";
const ADUserBOTAskUrl = API.ADUSER_BOT_ASK

export const fetchADUserBOTAskUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${ADUserBOTAskUrl}`, {
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