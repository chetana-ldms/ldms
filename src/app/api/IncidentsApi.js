import FetchWithToken from '../modules/auth/FetchWithToken'

const createIncidentUrl = process.env.REACT_APP_CREATE_INCIDENT_URL
const incidentsUrl = process.env.REACT_APP_INCIDENTS_URL
const getIncidentSearchResultUrl = process.env.REACT_APP_GET_INCIDENT_SEARCH_RESULT_URL
const incidentDetailsUrl = process.env.REACT_APP_INCIDENT_DETAILS_URL
const updateIncidentUrl = process.env.REACT_APP_UPDATE_INCIDENT_URL
const getIncidentHistoryUrl = process.env.REACT_APP_GET_INCIDENT_HISTORY_URL
const alertsByAlertIdsUrl = process.env.REACT_APP_ALERTS_BY_ALERT_IDS_URL
const getChatHistoryUrl = process.env.REACT_APP_GET_CHAT_HISTORY_URL
const addChatMessageUrl = process.env.REACT_APP_SEND_CHAT_MESSAGE_URL
const DownloadAttachmentUrl = process.env.REACT_APP_DOWNLOAD_ATTACHMENT_URL
const masterDataUrl = process.env.REACT_APP_MASTER_DATA_URL
const UsersByOrgToolUrl = process.env.REACT_APP_USERS_BY_ORG_TOOL_URL
const IncidentNotesListUrl = process.env.REACT_APP_INCIDENT_NOTES_LIST_URL
const IncidentNotesAddUrl = process.env.REACT_APP_INCIDENT_NOTES_ADD_URL
const IncidentNotesUpdateUrl = process.env.REACT_APP_INCIDENT_NOTES_UPDATE_URL
const OrganizationToolsDetailsUrl = process.env.REACT_APP_ORG_TOOLS_DETAILS_URL
const IncidentReportTypesUrl = process.env.REACT_APP_INCIDENT_REPORT_TYPES_URL
const IncidentReportDataUrl = process.env.REACT_APP_INCIDENT_REPORT_DATA_URL
const IncidentsHasChangesUrl = process.env.REACT_APP_HAS_CHANGES_URL
const DeleteIncidentsUrl = process.env.REACT_APP_DELETE_INCIDENTS_URL
const MergeIncidentsUrl = process.env.REACT_APP_MERGE_INCIDENTS_URL
const GroupUsersUrl = process.env.REACT_APP_GROUP_USERS_URL
const UsersForIncidentCreatorRoleUrl = process.env.REACT_APP_USERS_FOR_INCIDENT_CREATER_ROLE_URL
const ReplyIncidentUrl = process.env.REACT_APP_REPLY_INCIDENT_URL
const IncidentGroupsUrl = process.env.REACT_APP_INCIDENT_GROUPS_URL
const IncidentProductsUrl = process.env.REACT_APP_INCIDENT_PRODUCTS_URL
const SearchIncidentTagsUrl = process.env.REACT_APP_SEARCH_INCIDENT_TAGS_UR
const ForwardIncidentUrl = process.env.REACT_APP_FORWARD_INCIDENT_URL
const EmailSearchUrl = process.env.REACT_APP_EMAIL_SEARCH_URL
const SendMailUrl = process.env.REACT_APP_SEND_MAIL_URL
const IncidentConversationUrl = process.env.REACT_APP_INCIDENT_CONVERSATION_URL
const ReplyIncidentWithHtmlContentUrl =
  'http://10.41.3.232:501/api/IncidentManagement/v1/ReplyIncidentWithHtmlContent'
const IncidentConversationDeleteUrl =
  'http://10.41.3.232:501/api/IncidentManagement/v1/IncidentConversation/Delete'
const ForwardIncidentWithHtmlContentUrl =
  'http://10.41.3.232:501/api/IncidentManagement/v1/ForwardIncidentWithHtmlContent'
const IncidentConversationForwardUrl =
  'http://10.41.3.232:501/api/IncidentManagement/v1/IncidentConversation/Forward'
const ReplyToForwardUrl = 'http://10.41.3.232:501/api/IncidentManagement/v1/ReplyToForward'
const SendIncidentMailWithHtmlContentUrl =
  'http://10.41.3.232:501/api/IncidentManagement/v1/SendIncidentMailWithHtmlContent'
const MessageTemplatesUrl = 'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Templates'
const TemplatesTemplateTypesUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Template/Types'
const TemplatesGroupsUrl = 'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Template/Groups'
const MessageTemplatesProcessUrl =
  'http://10.41.3.232:501/api/GenerelFunctions/v1/Message/Template/Process'
const IncidentPreviousConversationUrl =
  'http://10.41.3.232:501/api/IncidentManagement/v1/IncidentPreviousConversation'
const UpdateDescriptionAndAttachmentUrl =
  'http://10.41.3.232:501/api/IncidentManagement/v1/UpdateDescriptionAndAttachment'

export const fetchUsersByOrgTool = async (id, toolId, userID) => {
  try {
    const response = await FetchWithToken(
      `${UsersByOrgToolUrl}?OrgId=${id}&ToolId=${toolId}&userid=${userID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          userID: userID,
        }),
      }
    )

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchMasterData = async (data) => {
  try {
    const response = await FetchWithToken(`${masterDataUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()
    return responseData.masterData.map((obj) => obj)
  } catch (error) {
    console.log(error)
  }
}
export const fetchCreateIncident = async (data) => {
  try {
    const response = await FetchWithToken(`${createIncidentUrl}`, {
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
export const fetchIncidents = async (data) => {
  try {
    const response = await FetchWithToken(`${incidentsUrl}`, {
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
export const fetchSetOfIncidents = async (currentPage, orgId, userID, limit) => {
  const rangeStart = (currentPage - 1) * limit + 1
  const rangeEnd = currentPage * limit
  let data2 = {
    orgID: orgId,
    toolID: '1',
    toolTypeID: '1',
    paging: {
      rangeStart: rangeStart,
      rangeEnd: rangeEnd,
    },
    loggedInUserId: userID,
  }
  const response = await fetchGetIncidentSearchResult(data2)
  return response
}
export const fetchGetIncidentSearchResult = async (data) => {
  try {
    const response = await FetchWithToken(`${getIncidentSearchResultUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    // const incidentList = responseData.incidentList;
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchIncidentDetails = async (incidentID) => {
  try {
    const response = await FetchWithToken(`${incidentDetailsUrl}?incidentId=${incidentID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const incidentData = responseData.incidentData
    return incidentData
  } catch (error) {
    console.log(error)
  }
}
export const fetchUpdateIncident = async (data) => {
  try {
    const response = await FetchWithToken(`${updateIncidentUrl}`, {
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
export const fetchGetIncidentHistory = async (data) => {
  try {
    const response = await FetchWithToken(`${getIncidentHistoryUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    const alertHistoryData = responseData.alertHistoryData
    return alertHistoryData
  } catch (error) {
    console.log(error)
  }
}
export const fetchAlertsByAlertIds = async (data) => {
  try {
    const response = await FetchWithToken(`${alertsByAlertIdsUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()
    const alertsList = responseData.alertsList
    return alertsList
  } catch (error) {
    console.log(error)
  }
}
export const fetchGetChatHistory = async (data) => {
  try {
    const response = await FetchWithToken(`${getChatHistoryUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    const chatHistory = responseData.chatHistory
    return chatHistory
  } catch (error) {
    console.log(error)
  }
}
export const fetchAddChatMessage = async (formData) => {
  try {
    const response = await fetch(`${addChatMessageUrl}`, {
      method: 'POST',
      body: formData,
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}

export const fetchDownloadAttachmentUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${DownloadAttachmentUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      window.open(url)
    } else {
      throw new Error('Failed to download attachment')
    }
  } catch (error) {
    console.error('Error downloading attachment:', error)
  }
}
export const fetchIncidentNotesListUrl = async (incidentID) => {
  try {
    const response = await FetchWithToken(`${IncidentNotesListUrl}?incidentid=${incidentID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const incidentNotes = responseData.incidentNotes
    return incidentNotes
  } catch (error) {
    console.log(error)
  }
}
export const fetchIncidentNotesAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${IncidentNotesAddUrl}`, {
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
export const fetchIncidentNotesUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${IncidentNotesUpdateUrl}`, {
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
export const fetchOrganizationToolsDetailsUrl = async (orgid) => {
  try {
    const response = await FetchWithToken(`${OrganizationToolsDetailsUrl}?orgid=${orgid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const incidentData = responseData.organizationToolList
    return incidentData
  } catch (error) {
    console.log(error)
  }
}
export const fetchIncidentReportTypesUrl = async () => {
  try {
    const response = await FetchWithToken(`${IncidentReportTypesUrl}?reporttypeid=0`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const responseData = await response.json()
    const data = responseData.data
    return data
  } catch (error) {
    console.log('Error fetching incident report types:', error)
    return null
  }
}
export const fetchIncidentReportDataUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${IncidentReportDataUrl}`, {
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
export const fetchIncidentsHasChangesUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${IncidentsHasChangesUrl}`, {
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
export const fetchDeleteIncidentsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${DeleteIncidentsUrl}`, {
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

export const fetchMergeIncidentsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MergeIncidentsUrl}`, {
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
export const fetchGroupUsersUrl = async (orgId, toolId, groupid) => {
  try {
    const response = await FetchWithToken(
      `${GroupUsersUrl}?orgId=${orgId}&toolId=${toolId}&groupid=${groupid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchUsersForIncidentCreatorRoleUrl = async (orgId, toolId) => {
  try {
    const response = await FetchWithToken(
      `${UsersForIncidentCreatorRoleUrl}?orgId=${orgId}&toolId=${toolId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchReplyIncidentUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ReplyIncidentUrl}`, {
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
export const fetchIncidentGroupsUrl = async (orgId, ToolId, groupId) => {
  try {
    const response = await FetchWithToken(
      `${IncidentGroupsUrl}?orgId=${orgId}&ToolId=${ToolId}&groupId=${groupId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const responseData = await response.json()
    const data = responseData?.data
    return data
  } catch (error) {
    console.log(error)
  }
}
export const fetchIncidentProductsUrl = async (orgId, ToolId, productid) => {
  try {
    const response = await FetchWithToken(
      `${IncidentProductsUrl}?orgId=${orgId}&ToolId=${ToolId}&productid=${productid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const responseData = await response.json()
    const data = responseData?.data
    return data
  } catch (error) {
    console.log(error)
  }
}
export const fetchSearchIncidentTagsUrl = async (orgId, ToolId, keyword) => {
  try {
    const response = await FetchWithToken(
      `${SearchIncidentTagsUrl}?orgId=${orgId}&ToolId=${ToolId}&keyword=${keyword}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const responseData = await response.json()
    const data = responseData?.data
    return data
  } catch (error) {
    console.log(error)
  }
}
export const fetchForwardIncidentUrl = async (data) => {
   try {
    const formData = new FormData()
    formData.append('ForwardDateTime', data.replyDateTime)
    formData.append('UserId', data.userId)
    formData.append('IncidentId', data.incidentId)
    formData.append('ToolId', data.toolId)
    formData.append('OrgId', data.orgId)
    formData.append('PreviousConversations', data.PreviousConversations)
    formData.append('Email', data.Email)

    // ✅ Handle Previous Conversation Attachments properly
    if (data.PreviousConversations_Attachments?.length) {
      data.PreviousConversations_Attachments.forEach((item) => {
        // Check if it’s nested
        const innerFileObj = item.file
        const fileToSend = innerFileObj?.file instanceof File ? innerFileObj.file : null
        const contentId = innerFileObj?.ContentId || item.ContentId

        if (fileToSend) {
          // Use file.name as filename
          formData.append('PreviousConversations_Attachments', fileToSend, fileToSend.name)
        }

        if (contentId) {
          formData.append('ContentIds', contentId)
        }
      })
    }

    // ✅ CC
    data.ccEmails?.forEach((email) => formData.append('CcEmails', email))

    // ✅ BCC
    data.bccEmails?.forEach((email) => formData.append('BccEmails', email))

    // ✅ Attachments (inline + normal)
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

    formData.append('BodyHtml', data.notes)

    const response = await fetch(ForwardIncidentUrl, {
      method: 'POST',
      body: formData,
    })

    return await response.json()
  } catch (err) {
    console.error('API call failed:', err)
  }
}


export const fetchEmailSearchUrl = async (orgid, toolid, emailpartialstring) => {
  try {
    const response = await FetchWithToken(
      `${EmailSearchUrl}?orgid=${orgid}&emailpartialstring=${encodeURIComponent(
        emailpartialstring
      )}&toolid=${toolid}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const responseData = await response.json()
    return responseData?.data
  } catch (error) {
    console.log(error)
  }
}
export const fetchSendMailUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${SendMailUrl}`, {
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
export const fetchIncidentConversationUrl = async (orgId, ToolId, incidentid) => {
  try {
    const response = await FetchWithToken(
      `${IncidentConversationUrl}?orgid=${orgId}&toolid=${ToolId}&incidentid=${incidentid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchReplyIncidentWithHtmlContentUrl = async (data) => {
  try {
    const formData = new FormData()
    formData.append('ReplyDateTime', data.replyDateTime)
    formData.append('UserId', data.userId)
    formData.append('IncidentId', data.incidentId)
    formData.append('ToolId', data.toolId)
    formData.append('OrgId', data.orgId)
    formData.append('PreviousConversations', data.PreviousConversations)
    formData.append('FromEmails', data.FromEmails)

    // ✅ Handle Previous Conversation Attachments properly
    if (data.PreviousConversations_Attachments?.length) {
      data.PreviousConversations_Attachments.forEach((item) => {
        // Check if it’s nested
        const innerFileObj = item.file
        const fileToSend = innerFileObj?.file instanceof File ? innerFileObj.file : null
        const contentId = innerFileObj?.ContentId || item.ContentId

        if (fileToSend) {
          // Use file.name as filename
          formData.append('PreviousConversations_Attachments', fileToSend, fileToSend.name)
        }

        if (contentId) {
          formData.append('ContentIds', contentId)
        }
      })
    }

    // ✅ CC
    data.ccEmails?.forEach((email) => formData.append('CcEmails', email))

    // ✅ BCC
    data.bccEmails?.forEach((email) => formData.append('BccEmails', email))

    // ✅ Attachments (inline + normal)
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

    formData.append('BodyHtml', data.notes)

    const response = await fetch(ReplyIncidentWithHtmlContentUrl, {
      method: 'POST',
      body: formData,
    })

    return await response.json()
  } catch (err) {
    console.error('API call failed:', err)
  }
}

export const fetchIncidentConversationDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${IncidentConversationDeleteUrl}`, {
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
export const fetchForwardIncidentWithHtmlContentUrl = async (data) => {
  try {
    const formData = new FormData()

    formData.append('ForwardDateTime', data.forwardDateTime || '')
    formData.append('OrgId', data.orgId ?? '')
    formData.append('ToolId', data.toolId ?? '')
    formData.append('IncidentId', data.incidentId ?? '')
    formData.append('UserId', data.userId ?? '')

    // Email (to)
    if (data.email?.length) {
      data.email.forEach((email) => formData.append('Email', email))
    } else {
      formData.append('Email', '') // empty
    }

    // CC
    if (data.ccEmails?.length) {
      data.ccEmails.forEach((email) => formData.append('CcEmails', email))
    } else {
      formData.append('CcEmails', '')
    }

    // BCC
    if (data.bccEmails?.length) {
      data.bccEmails.forEach((email) => formData.append('BccEmails', email))
    } else {
      formData.append('BccEmails', '')
    }

    // Attachments
    if (data.attachments?.length) {
      data.attachments.forEach((att) => {
        if (att.file) {
          formData.append('Attachments', att.file, att.file.name)
        } else {
          formData.append('Attachments', att)
        }
      })
    } else {
      formData.append('Attachments', '')
    }

    formData.append('BodyHtml', data.body || '')

    const response = await fetch(ForwardIncidentWithHtmlContentUrl, {
      method: 'POST',
      body: formData,
    })

    return await response.json()
  } catch (err) {
    console.error('API call failed:', err)
  }
}
export const fetchIncidentConversationForwardUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${IncidentConversationForwardUrl}`, {
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
export const fetchReplyToForwardUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ReplyToForwardUrl}`, {
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
export const fetchSendIncidentMailWithHtmlContentUrl = async (data) => {
  try {
    const formData = new FormData()
    formData.append('SendMailDateTime', data.sendMailDateTime || '')
    formData.append('OrgId', data.orgId ?? '')
    formData.append('ToolId', data.toolId ?? '')
    formData.append('IncidentId', data.incidentId ?? 0)
    formData.append('Email', data.email || '')
    formData.append('BodyHtml', data.body || '')
    formData.append('Subject', data.subject || '')
    formData.append('UserId', data.userId ?? '')
    if (data.ccEmails?.length) {
      data.ccEmails.forEach((email) => formData.append('CcEmails', email))
    } else {
      formData.append('CcEmails', '') // send empty value
    }
    if (data.bccEmails?.length) {
      data.bccEmails.forEach((email) => formData.append('BccEmails', email))
    } else {
      formData.append('BccEmails', '')
    }
    if (data.attachments?.length) {
      data.attachments.forEach((att) => {
        if (att.contentId) {
          formData.append('Attachments', att.file, att.file.name)
          formData.append('ContentIds', att.contentId)
        } else {
          formData.append('Attachments', att.file || att)
        }
      })
    } else {
      formData.append('Attachments', '') // send empty value
    }
    const response = await fetch(SendIncidentMailWithHtmlContentUrl, {
      method: 'POST',
      body: formData,
    })
    return await response.json()
  } catch (err) {
    console.error('API call failed:', err)
  }
}
export const fetchMessageTemplatesUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MessageTemplatesUrl}`, {
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
export const fetchTemplatesTemplateTypesUrl = async () => {
  try {
    const response = await FetchWithToken(`${TemplatesTemplateTypesUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Error fetching template types:', error)
    return {isSuccess: false, data: []}
  }
}

export const fetchTemplatesGroupsUrl = async () => {
  try {
    const response = await FetchWithToken(`${TemplatesGroupsUrl}`, {
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
export const fetchMessageTemplatesProcessUrl = async (templateId, transactionId) => {
  try {
    const response = await FetchWithToken(
      `${MessageTemplatesProcessUrl}?templateId=${templateId}&transactionId=${transactionId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchIncidentPreviousConversationUrl = async (orgId, ToolId, incidentid) => {
  try {
    const response = await FetchWithToken(
      `${IncidentPreviousConversationUrl}?orgid=${orgId}&toolid=${ToolId}&incidentid=${incidentid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchUpdateDescriptionAndAttachmentUrl = async (data) => {
  try {
    const formData = new FormData();

    formData.append("ModifiedDate", data.ModifiedDate);
    formData.append("ModifiedUserId", data.ModifiedUserId);
    formData.append("IncidentId", data.IncidentId);
    formData.append("Description", data.Description);

    if (data.Attachments?.length) {
      data.Attachments.forEach((att) => {
        formData.append("Attachments", att.file, att.file.name);        // <-- BINARY FILE
        formData.append("ContentIds", att.contentId);    // <-- CID
      });
    }

    const response = await fetch(UpdateDescriptionAndAttachmentUrl, {
      method: "POST",
      body: formData,
    });

    return await response.json();
  } catch (err) {
    console.error("API call failed:", err);
  }
};

