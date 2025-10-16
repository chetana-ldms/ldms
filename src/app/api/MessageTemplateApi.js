import FetchWithToken from '../modules/auth/FetchWithToken'

const MessageTemplateUrl = 'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Template'
const MessagePlaceholdersUrl = 'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Placeholders'
const MessageTemplateDeleteUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Template/Delete'
const MessageTemplateUpdateUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Template/Update'
const MessagePlaceholderUrl = 'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Placeholder'
const TablesListUrl = 'http://10.41.3.232:501/api/GenerelFunctions/v1/TablesList'
const TablesUrl = 'http://10.41.3.232:501/api/GenerelFunctions/v1/Tables'
const MessagePlaceholderUpdateUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Placeholder/Update'
const MessagePlaceholderDeleteUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Placeholder/Delete'
const MessagePlaceHolderGroupsUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/PlaceHolder/Groups'

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
export const fetchMessagePlaceholderUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MessagePlaceholderUrl}`, {
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
export const fetchTablesListUrl = async () => {
  try {
    const response = await FetchWithToken(`${TablesListUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Error fetching template groups:', error)
    return {isSuccess: false, data: []}
  }
}
export const fetchTablesUrl = async (tableName) => {
  try {
    const response = await fetch(`${TablesUrl}/${tableName}/Columns`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching columns:', error)
    throw error
  }
}
export const fetchMessagePlaceholderUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MessagePlaceholderUpdateUrl}`, {
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
export const fetchMessagePlaceholderDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MessagePlaceholderDeleteUrl}`, {
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
export const fetchMessagePlaceHolderGroupsUrl = async () => {
  try {
    const response = await FetchWithToken(`${MessagePlaceHolderGroupsUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Error fetching template groups:', error)
    return {isSuccess: false, data: []}
  }
}
