import FetchWithToken from "../modules/auth/FetchWithToken"

const ConnectionTypeAddUrl ="http://10.41.3.232:501/api/ConnectionEngine/v1/ConnectionType/Add"
const ConnectionTypeUpdateUrl ="http://10.41.3.232:501/api/ConnectionEngine/v1/ConnectionType/Update"
const ConnectionTypeDeleteUrl ="http://10.41.3.232:501/api/ConnectionEngine/v1/ConnectionType/Delete"
const ConnectionTypeSearchUrl ="http://10.41.3.232:501/api/ConnectionEngine/v1/ConnectionType/Search"
const ConnectionAddUrl ="http://10.41.3.232:501/api/ConnectionEngine/v1/Connection/Add"
const ConnectionUpdateUrl ="http://10.41.3.232:501/api/ConnectionEngine/v1/Connection/Update"
const ConnectionDeleteUrl ="http://10.41.3.232:501/api/ConnectionEngine/v1/Connection/Delete"
const ConnectionSearchUrl ="http://10.41.3.232:501/api/ConnectionEngine/v1/Connection/Search"

export const fetchConnectionTypeAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ConnectionTypeAddUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchConnectionTypeUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ConnectionTypeUpdateUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchConnectionTypeDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ConnectionTypeDeleteUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchConnectionTypeSearchUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ConnectionTypeSearchUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchConnectionAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ConnectionAddUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchConnectionUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ConnectionUpdateUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchConnectionDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ConnectionDeleteUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchConnectionSearchUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ConnectionSearchUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}