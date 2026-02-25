import { API } from "../../config/apiConfig";
import FetchWithToken from "../modules/auth/FetchWithToken"

const EmaillogsOutboundUrl = API.EMAIL_LOGS_OUTBOUND;
const EmaillogsOutboundStreamUrl = API.EMAIL_LOGS_OUTBOUND_STREAM;

export const fetchEmaillogsOutboundUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${EmaillogsOutboundUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
  
      const responseData = await response.json()
      return responseData
    } catch (error) {
      console.log(error)
    }
  }
  export const fetchEmaillogsOutboundStreamUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${EmaillogsOutboundStreamUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
  
      const responseData = await response.json()
      return responseData
    } catch (error) {
      console.log(error)
    }
  }