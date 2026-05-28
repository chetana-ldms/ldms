import FetchWithToken from "../modules/auth/FetchWithToken"


const AlertFieldsUrl = "http://10.41.3.232:501/api/LDPlattform/v1/AlertFields"
const AddAlertFieldsUrl = "http://10.41.3.232:501/api/LDPlattform/v1/AlertFields/Add"
const UpdateAlertFieldsUrl = "http://10.41.3.232:501/api/LDPlattform/v1/AlertFields/Update"
const DeleteAlertFieldsUrl = "http://10.41.3.232:501/api/LDPlattform/v1/AlertFields/Delete"

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