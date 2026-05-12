import FetchWithToken from "../modules/auth/FetchWithToken"

const TechniquesUrl ="http://10.41.3.232:501/api/MITREFramework/v1/Techniques"
const TacticsUrl ="http://10.41.3.232:501/api/MITREFramework/v1/Tactics"

export const fetchTechniquesUrl = async () => {
  try {
    const response = await FetchWithToken(`${TechniquesUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const result = responseData.data
    return result
  } catch (error) {
    console.log(error)
  }
}
export const fetchTacticsUrl = async () => {
  try {
    const response = await FetchWithToken(`${TacticsUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const result = responseData.data
    return result
  } catch (error) {
    console.log(error)
  }
}