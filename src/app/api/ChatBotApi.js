
import FetchWithToken from "../modules/auth/FetchWithToken";
const ADUserBOTAskUrl ="http://10.41.3.232:501/api/BOT/v1/ADUserBOT/Ask"


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