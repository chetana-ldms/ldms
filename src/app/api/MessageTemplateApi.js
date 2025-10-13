const MessageTemplateUrl = 'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Template'
const MessagePlaceholdersUrl = 'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Placeholders'

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
