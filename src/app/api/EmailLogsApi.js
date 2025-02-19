import FetchWithToken from "../modules/auth/FetchWithToken"

const EmaillogsOutboundUrl ="http://10.41.3.232:501/api/Microsoft/v1/Emaillogs/Outbound"
const EmaillogsOutboundStreamUrl="http://10.41.3.232:501/api/Microsoft/v1/Emaillogs/Outbound/Stream"
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