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
const MessageTemplateGroupsUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Template/Groups'
const MessageTemplateGroupUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Template/Group'
const MessageTemplateGroupUpdateUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Template/Group/Update'
const MessageTemplateGroupDeleteUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Template/Group/Delete'
const MessageTemplateTypesUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Template/Types'
const MessageTemplateTypeUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Template/Type'
const MessageTemplateTypeUpdateUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Template/Type/Update'
const MessageTemplateTypeDeleteUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Template/Type/Delete'
const MessagePlaceHolderGroupUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/PlaceHolder/Group'
const MessagePlaceHolderGroupUpdateUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/PlaceHolder/Group/Update'
const MessagePlaceHolderGroupDeleteUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/PlaceHolder/Group/Delete'

export const fetchMessageTemplateUrl = async (data) => {
  try {
    const formData = new FormData()

    // Basic fields
    formData.append('OrgId', data.OrgId)
    formData.append('ToolId', data.ToolId)
    formData.append('ToolTemplateId', 0)
    formData.append('TemplateTypeId', data.TemplateTypeId)
    formData.append('GroupId', data.GroupId)
    formData.append('Title', data.Title)
    formData.append('SignatureContent', data.SignatureContent || '')
    formData.append('CreatedUserId', data.CreatedUserId)
    formData.append('CreatedDate', data.CreatedDate)
    formData.append('ScopeName', data.ScopeName)
    formData.append('ScopeValue', data.ScopeValue)
    formData.append('ScopeTemplateGroupId', data.ScopeTemplateGroupId)

    // Placeholders
    data.PlaceholderIds?.forEach((id) => formData.append('PlaceholderIds', id))

    if (data.attachments?.length) {
      data.attachments.forEach((att) => {
        if (att.contentId) {
          // inline image
          formData.append('Attachments', att.file, att.file.name)
          formData.append('ContentIds', att.contentId)
        } else {
          formData.append('Attachments', att.file || att)
        }
      })
    }

    formData.append('Content', data.Content)

    const response = await fetch(MessageTemplateUrl, {
      method: 'POST',
      body: formData,
    })

    return await response.json()
  } catch (err) {
    console.error('API call failed:', err)
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
    const formData = new FormData()

    // Basic fields
    formData.append('OrgId', data.orgId)
    formData.append('TemplateId', data.templateId)
    formData.append('ToolId', data.toolId)
    formData.append('ToolTemplateId', 0)
    formData.append('TemplateTypeId', data.templateTypeId)
    formData.append('GroupId', data.groupId)
    formData.append('Title', data.title)
    formData.append('SignatureContent', data.SignatureContent || '')
    formData.append('ModifiedUserId', data.modifiedUserId)
    formData.append('ModifiedDate', data.modifiedDate)
    formData.append('ScopeName', data.ScopeName)
    formData.append('ScopeValue', data.ScopeValue)
    formData.append('ScopeTemplateGroupId', data.ScopeTemplateGroupId)

    // Placeholders
    data.PlaceholderIds?.forEach((id) => formData.append('PlaceholderIds', id))

    if (data.attachments?.length) {
      data.attachments.forEach((att) => {
        if (att.contentId) {
          // inline image
          formData.append('Attachments', att.file, att.file.name)
          formData.append('ContentIds', att.contentId)
        } else {
          formData.append('Attachments', att.file || att)
        }
      })
    }

    formData.append('Content', data.content)

    const response = await fetch(MessageTemplateUpdateUrl, {
      method: 'POST',
      body: formData,
    })

    return await response.json()
  } catch (err) {
    console.error('API call failed:', err)
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
export const fetchMessagePlaceHolderGroupsUrl = async (groupid) => {
  try {
    const response = await FetchWithToken(`${MessagePlaceHolderGroupsUrl}?groupid=${groupid}`, {
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
export const fetchMessageTemplateGroupsUrl = async (groupid) => {
  try {
    const response = await FetchWithToken(`${MessageTemplateGroupsUrl}?groupid=${groupid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error(error)
    return {isSuccess: false, data: []}
  }
}
export const fetchMessageTemplateGroupUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MessageTemplateGroupUrl}`, {
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
export const fetchMessageTemplateGroupUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MessageTemplateGroupUpdateUrl}`, {
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
export const fetchMessageTemplateGroupDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MessageTemplateGroupDeleteUrl}`, {
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
export const fetchMessageTemplateTypesUrl = async (typeid) => {
  try {
    const response = await FetchWithToken(`${MessageTemplateTypesUrl}?typeid=${typeid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error(error)
    return {isSuccess: false, data: []}
  }
}
export const fetchMessageTemplateTypeUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MessageTemplateTypeUrl}`, {
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
export const fetchMessageTemplateTypeUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MessageTemplateTypeUpdateUrl}`, {
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
export const fetchMessageTemplateTypeDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MessageTemplateTypeDeleteUrl}`, {
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
export const fetchMessagePlaceHolderGroupUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MessagePlaceHolderGroupUrl}`, {
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
export const fetchMessagePlaceHolderGroupUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MessagePlaceHolderGroupUpdateUrl}`, {
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
export const fetchMessagePlaceHolderGroupDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MessagePlaceHolderGroupDeleteUrl}`, {
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
