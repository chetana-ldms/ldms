import FetchWithToken from '../modules/auth/FetchWithToken'

const MessageTemplateUrl = process.env.REACT_APP_MESSAGE_TEMPLATE_URL
const MessagePlaceholdersUrl = process.env.REACT_APP_MESSAGE_PLACEHOLDERS_URL
const MessageTemplateDeleteUrl = process.env.REACT_APP_MESSAGE_TEMPLATE_DELETE_URL
const MessageTemplateUpdateUrl = process.env.REACT_APP_MESSAGE_TEMPLATE_UPDATE_URL
const MessagePlaceholderUrl = process.env.REACT_APP_MESSAGE_PLACEHOLDER_URL
const TablesListUrl = process.env.REACT_APP_TABLES_LIST_URL
const TablesUrl = process.env.REACT_APP_TABLES_URL
const MessagePlaceholderUpdateUrl = process.env.REACT_APP_MESSAGE_PLACEHOLDER_UPDATE_URL
const MessagePlaceholderDeleteUrl = process.env.REACT_APP_MESSAGE_PLACEHOLDER_DELETE_URL
const MessagePlaceHolderGroupsUrl = process.env.REACT_APP_MESSAGE_PLACEHOLDER_GROUPS_URL
const MessageTemplateGroupsUrl = process.env.REACT_APP_MESSAGE_TEMPLATE_GROUPS_URL
const MessageTemplateGroupUrl = process.env.REACT_APP_MESSAGE_TEMPLATE_GROUP_URL
const MessageTemplateGroupUpdateUrl = process.env.REACT_APP_MESSAGE_TEMPLATE_GROUP_UPDATE_URL
const MessageTemplateGroupDeleteUrl = process.env.REACT_APP_MESSAGE_TEMPLATE_GROUP_DELETE_URL
const MessageTemplateTypesUrl = process.env.REACT_APP_MESSAGE_TEMPLATE_TYPES_URL
const MessageTemplateTypeUrl = process.env.REACT_APP_MESSAGE_TEMPLATE_TYPE_URL
const MessageTemplateTypeUpdateUrl = process.env.REACT_APP_MESSAGE_TEMPLATE_TYPE_UPDATE_URL
const MessageTemplateTypeDeleteUrl = process.env.REACT_APP_MESSAGE_TEMPLATE_TYPE_DELETE_URL
const MessagePlaceHolderGroupUrl = process.env.REACT_APP_MESSAGE_PLACEHOLDER_GROUP_URL
const MessagePlaceHolderGroupUpdateUrl = process.env.REACT_APP_MESSAGE_PLACEHOLDER_GROUP_UPDATE_URL
const MessagePlaceHolderGroupDeleteUrl = process.env.REACT_APP_MESSAGE_PLACEHOLDER_GROUP_DELETE_URL

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
