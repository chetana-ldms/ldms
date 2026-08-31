import FetchWithToken from "../modules/auth/FetchWithToken"
import { API } from "../../config/apiConfig"

export const fetchScriptSearchUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.SCRIPT_SEARCH}`, {
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
export const fetchScriptAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.SCRIPT_ADD}`, {
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
export const fetchScriptUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.SCRIPT_UPDATE}`, {
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
export const fetchScriptDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.SCRIPT_DELETE}`, {
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
export const fetchScriptGetByIdUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.SCRIPT_GET_BY_ID}`, {
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