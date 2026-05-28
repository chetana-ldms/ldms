import FetchWithToken from "../modules/auth/FetchWithToken"

const ScriptSearchUrl ="http://10.41.3.232:501/api/ScriptRepository/v1/Script/Search"
const ScriptAddUrl ="http://10.41.3.232:501/api/ScriptRepository/v1/Script/Add"
const ScriptUpdateUrl="http://10.41.3.232:501/api/ScriptRepository/v1/Script/Update"
const ScriptDeleteUrl="http://10.41.3.232:501/api/ScriptRepository/v1/Script/Delete"

export const fetchScriptSearchUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ScriptSearchUrl}`, {
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
    const response = await FetchWithToken(`${ScriptAddUrl}`, {
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
    const response = await FetchWithToken(`${ScriptUpdateUrl}`, {
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
    const response = await FetchWithToken(`${ScriptDeleteUrl}`, {
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