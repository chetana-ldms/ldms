
import FetchWithToken from "../modules/auth/FetchWithToken";
const ADUserBOTAskUrl =process.env.REACT_APP_ADUSER_BOT_ASK_URL


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