import FetchWithToken from "../modules/auth/FetchWithToken"

const EmaillogsOutboundUrl =process.env.REACT_APP_EMAIL_LOGS_OUTBOUND_URL
const EmaillogsOutboundStreamUrl=process.env.REACT_APP_EMAIL_LOGS_OUTBOUND_STRAM_URL

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