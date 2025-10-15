import FetchWithToken from '../modules/auth/FetchWithToken'

const MessageTemplateUrl = 'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Template'
const MessagePlaceholdersUrl = 'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Placeholders'
const MessageTemplateDeleteUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Template/Delete'
const MessageTemplateUpdateUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Template/Update'

export const fetchMessageTemplateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MessageTemplateUrl}`, {
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
export const fetchMessagePlaceholdersUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MessagePlaceholdersUrl}`, {
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
export const fetchMessageTemplateDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MessageTemplateDeleteUrl}`, {
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
export const fetchMessageTemplateUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MessageTemplateUpdateUrl}`, {
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
