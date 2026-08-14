import FetchWithToken from "../modules/auth/FetchWithToken"


const AlertFieldsUrl = "http://10.41.3.232:501/api/AlertField/v1/GetAlertFields"
const AddAlertFieldsUrl = "http://10.41.3.232:501/api/AlertField/v1/CreateAlertField"
const UpdateAlertFieldsUrl = "http://10.41.3.232:501/api/AlertField/v1/update"
const DeleteAlertFieldsUrl = "http://10.41.3.232:501/api/AlertField/v1/delete"
const GetAlertFieldDetailUrl = "http://10.41.3.232:501/api/AlertField/v1/detail"

export const fetchAlertFieldsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${AlertFieldsUrl}`, {
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
export const fetchAddAlertFieldsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${AddAlertFieldsUrl}`, {
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
export const fetchUpdateAlertFieldsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${UpdateAlertFieldsUrl}`, {
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
export const fetchDeleteAlertFieldsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${DeleteAlertFieldsUrl}`, {
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
export const fetchGetAlertFieldDetailUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${GetAlertFieldDetailUrl}`, {
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