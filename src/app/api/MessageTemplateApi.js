import { API } from '../../config/apiConfig';
import FetchWithToken from '../modules/auth/FetchWithToken'
const MessageTemplateUrl = API.MESSAGE_TEMPLATE;
const MessageTemplateDeleteUrl = API.MESSAGE_TEMPLATE_DELETE;
const MessageTemplateUpdateUrl = API.MESSAGE_TEMPLATE_UPDATE;
const MessagePlaceholdersUrl = API.MESSAGE_PLACEHOLDERS;
const MessagePlaceholderUrl = API.MESSAGE_PLACEHOLDERS;
const MessagePlaceholderUpdateUrl = API.MESSAGE_PLACEHOLDER_UPDATE;
const MessagePlaceholderDeleteUrl = API.MESSAGE_PLACEHOLDER_DELETE;
const TablesListUrl = API.TABLES_LIST;
const TablesUrl = API.TABLES;
const MessagePlaceHolderGroupsUrl = API.MESSAGE_PLACEHOLDER_GROUPS;
const MessagePlaceHolderGroupUrl = API.MESSAGE_PLACEHOLDER_GROUP;
const MessagePlaceHolderGroupUpdateUrl = API.MESSAGE_PLACEHOLDER_GROUP_UPDATE;
const MessagePlaceHolderGroupDeleteUrl = API.MESSAGE_PLACEHOLDER_GROUP_DELETE;
const MessageTemplateGroupsUrl = API.MESSAGE_TEMPLATE_GROUPS;
const MessageTemplateGroupUrl = API.MESSAGE_TEMPLATE_GROUP;
const MessageTemplateGroupUpdateUrl = API.MESSAGE_TEMPLATE_GROUP_UPDATE;
const MessageTemplateGroupDeleteUrl = API.MESSAGE_TEMPLATE_GROUP_DELETE;
const MessageTemplateTypesUrl = API.MESSAGE_TEMPLATE_TYPES;
const MessageTemplateTypeUrl = API.MESSAGE_TEMPLATE_TYPE;
const MessageTemplateTypeUpdateUrl = API.MESSAGE_TEMPLATE_TYPE_UPDATE;
const MessageTemplateTypeDeleteUrl = API.MESSAGE_TEMPLATE_TYPE_DELETE;



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
