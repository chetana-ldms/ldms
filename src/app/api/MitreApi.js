import FetchWithToken from "../modules/auth/FetchWithToken"
import { API } from "../../config/apiConfig"

const TechniquesUrl = API.MITRE_TECHNIQUES
const TacticsUrl = API.MITRE_TACTICS

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