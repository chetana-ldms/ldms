import FetchWithToken from "../modules/auth/FetchWithToken"
import { API } from "../../config/apiConfig"

const TechniquesUrl = API.MITRE_TECHNIQUES
const TacticsUrl = API.MITRE_TACTICS
const TechniquesByTacticUrl = "http://10.41.3.232:501/api/MItreFramework/v1/TechniquesByTactic"

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
export const fetchTechniquesByTacticUrl = async (tacticId) => {
  try {
    const response = await FetchWithToken(`${TechniquesByTacticUrl}?tacticId=${tacticId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}