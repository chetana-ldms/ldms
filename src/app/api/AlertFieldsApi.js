import FetchWithToken from "../modules/auth/FetchWithToken"


const AlertFieldsUrl = "http://10.41.3.232:501/api/AlertField/v1/GetAlertField"
const AddAlertFieldsUrl = "http://10.41.3.232:501/api/AlertField/v1/CreateAlertField"
const UpdateAlertFieldsUrl = "http://10.41.3.232:501/api/AlertField/v1/update"
const DeleteAlertFieldsUrl = "http://10.41.3.232:501/api/AlertField/v1/delete"
const GetAlertFieldDetailUrl = "http://10.41.3.232:501/api/AlertField/v1/detail"
const GetAlertFieldMappingUrl = "http://10.41.3.232:501/api/AlertField/v1/GetAlertFieldMapping"
const CreateAlertFieldMappingUrl = "http://10.41.3.232:501/api/AlertField/v1/CreateMapping"
const GetAlertFieldMappingDetailUrl = "http://10.41.3.232:501/api/AlertField/v1/GetAlertFieldMappingDetail"
const UpdateAlertFieldMappingUrl = "http://10.41.3.232:501/api/AlertField/v1/UpdateAlertFieldMapping"
const DeleteAlertFieldMappingUrl = "http://10.41.3.232:501/api/AlertField/v1/DeleteAlertFieldMapping"

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
export const fetchGetAlertFieldMappingUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${GetAlertFieldMappingUrl}`, {
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
export const fetchCreateAlertFieldMappingUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${CreateAlertFieldMappingUrl}`, {
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
export const fetchGetAlertFieldMappingDetailUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${GetAlertFieldMappingDetailUrl}`, {
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
export const fetchUpdateAlertFieldMappingUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${UpdateAlertFieldMappingUrl}`, {
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
export const fetchDeleteAlertFieldMappingUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${DeleteAlertFieldMappingUrl}`, {
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