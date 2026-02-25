import { API } from '../../config/apiConfig'
import FetchWithToken from '../modules/auth/FetchWithToken'

const createIncidentUrl = API.CREATE_INCIDENT
const incidentsUrl = API.INCIDENTS
const getIncidentSearchResultUrl = API.GET_INCIDENT_SEARCH_RESULT
const incidentDetailsUrl = API.INCIDENT_DETAILS
const updateIncidentUrl = API.UPDATE_INCIDENT
const getIncidentHistoryUrl = API.GET_INCIDENT_HISTORY
const alertsByAlertIdsUrl = API.ALERTS_BY_ALERT_IDS
const getChatHistoryUrl = API.GET_CHAT_HISTORY
const addChatMessageUrl = API.SEND_CHAT_MESSAGE
const DownloadAttachmentUrl = API.DOWNLOAD_ATTACHMENT
const masterDataUrl = API.MASTER_DATA
const UsersByOrgToolUrl = API.USERS_BY_ORG_TOOL
const IncidentNotesListUrl = API.INCIDENT_NOTES_LIST
const IncidentNotesAddUrl = API.INCIDENT_NOTES_ADD
const IncidentNotesUpdateUrl = API.INCIDENT_NOTES_UPDATE
const OrganizationToolsDetailsUrl = API.ORG_TOOLS_DETAILS
const IncidentReportTypesUrl = API.INCIDENT_REPORT_TYPES
const IncidentReportDataUrl = API.INCIDENT_REPORT_DATA
const IncidentsHasChangesUrl = API.HAS_CHANGES
const DeleteIncidentsUrl = API.DELETE_INCIDENTS
const MergeIncidentsUrl = API.MERGE_INCIDENTS
const GroupUsersUrl = API.GROUP_USERS
const UsersForIncidentCreatorRoleUrl = API.USERS_FOR_INCIDENT_CREATOR_ROLE
const ReplyIncidentUrl = API.REPLY_INCIDENT
const IncidentGroupsUrl = API.INCIDENT_GROUPS
const IncidentProductsUrl = API.INCIDENT_PRODUCTS
const SearchIncidentTagsUrl = API.SEARCH_INCIDENT_TAGS
const ForwardIncidentUrl = API.FORWARD_INCIDENT
const EmailSearchUrl = API.EMAIL_SEARCH
const SendMailUrl = API.SEND_MAIL
const IncidentConversationUrl = API.INCIDENT_CONVERSATION
const ReplyIncidentWithHtmlContentUrl = API.REPLY_INCIDENT_HTML
const IncidentConversationDeleteUrl = API.INCIDENT_CONVERSATION_DELETE
const ForwardIncidentWithHtmlContentUrl = API.FORWARD_INCIDENT_HTML
const IncidentConversationForwardUrl = API.INCIDENT_CONVERSATION_FORWARD
const ReplyToForwardUrl = API.REPLY_TO_FORWARD
const SendIncidentMailWithHtmlContentUrl = API.SEND_INCIDENT_HTML_MAIL
const MessageTemplatesUrl = API.MESSAGE_TEMPLATES
const TemplatesTemplateTypesUrl = API.MESSAGE_TEMPLATE_TYPES
const TemplatesGroupsUrl = API.MESSAGE_TEMPLATE_GROUPS
const MessageTemplatesProcessUrl = API.MESSAGE_TEMPLATE_PROCESS
const IncidentPreviousConversationUrl = API.INCIDENT_PREVIOUS_CONVERSATION
const UpdateDescriptionAndAttachmentUrl = API.UPDATE_DESCRIPTION_ATTACHMENT
const IncidentDescriptionAndAttachmentsUrl = API.INCIDENT_DESCRIPTION_ATTACHMENTS
const IncidentConversationWithoutAttachmentsUrl = API.INCIDENT_CONVERSATION_NO_ATTACH
const NotesDetailsUrl = API.NOTES_DETAILS
const NotesDeleteUrl = API.NOTES_DELETE
const IncidenttNotesByIncidentByConversationIdUrl = API.INCIDENT_NOTES_BY_CONVERSATION


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
    const formData = new FormData()
    formData.append('IncidentId', data.IncidentId)
    formData.append('IsPriviate', data.IsPriviate)
    formData.append('CreateUserId', data.CreateUserId)
    formData.append('CreatedDate', data.CreatedDate)
    data.NotifyEmails?.forEach((email) => formData.append('NotifyEmails', email))
    if (data.attachments?.length) {
      data.attachments.forEach((att) => {
        if (att.contentId) {
          formData.append('Attachments', att.file, att.file.name)
          formData.append('ContentIds', att.contentId)
        } else {
          formData.append('Attachments', att.file || att)
        }
      })
    }

    formData.append('NotesHtmlContent', data.NotesHtmlContent)

    const response = await fetch(IncidentNotesAddUrl, {
      method: 'POST',
      body: formData,
    })

    return await response.json()
  } catch (err) {
    console.error('API call failed:', err)
  }
}
export const fetchIncidentNotesUpdateUrl = async (data) => {
  try {
    const formData = new FormData()

    formData.append('IncidentId', data.IncidentId)
    formData.append('IncidentNotesId', data.IncidentNotesId)
    formData.append('ModifiedUserId', data.ModifiedUserId)
    formData.append('ModifiedDate', data.ModifiedDate)
    formData.append('NotesHtmlContent', data.NotesHtmlContent)

    /* ==== new attachments ==== */
    if (data.NewAttachments?.length) {
      data.NewAttachments.forEach((att) => {
        if (!att?.file) return

        if (att.contentId) {
          formData.append('NewAttachments', att.file, att.file.name)
          formData.append('ContentIds', att.contentId)
        } else {
          formData.append('NewAttachments', att.file)
        }
      })
    }

    /* ==== existing attachments ==== */
    const existingJson =
      data.ExistingAttachments?.length > 0
        ? data.ExistingAttachments.map((a) => ({
            attachmentId: a.attachmentId,
            url: a.filePath,
          }))
        : []

    formData.append('ExistingAttachmentUrlsJson', JSON.stringify(existingJson))

    const response = await fetch(IncidentNotesUpdateUrl, {
      method: 'POST',
      body: formData,
    })

    return await response.json()
  } catch (err) {
    console.error('API call failed:', err)
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
    formData.append('ForwardDateTime', data.forwardDateTime)
    formData.append('UserId', data.userId)
    formData.append('IncidentId', data.incidentId)
    formData.append('ToolId', data.toolId)
    formData.append('OrgId', data.orgId)
    formData.append('PreviousConversations', data.PreviousConversations)
    formData.append('FromEmails', data.FromEmails)
    formData.append('ToEmails', data.email)
    formData.append('Subject', data.Subject)
    formData.append('IncludeOriginalAttachments', data.includeOriginalAttachments)
    formData.append('IncludePreviousConversations', data.includePreviousConversations)

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

    formData.append('BodyHtml', data.body)

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
    const formData = new FormData()

    formData.append('ToolId', data.ToolId)
    formData.append('OrgId', data.OrgId)
    formData.append('IncidentId', data.IncidentId)
    formData.append('Description', data.Description)
    formData.append('ModifiedDate', data.ModifiedDate)
    formData.append('ModifiedUserId', data.ModifiedUserId)

    /* =========================
       ✅ NEW ATTACHMENTS
       ========================= */

    if (data.NewAttachments?.length) {
      data.NewAttachments.forEach((att) => {
        if (!att?.file) return // prevent null upload

        // inline image
        if (att.contentId) {
          formData.append('NewAttachments', att.file, att.file.name)
          formData.append('ContentIds', att.contentId)
        }
        // normal file
        else {
          formData.append('NewAttachments', att.file)
        }
      })
    }

    /* =========================
       ✅ EXISTING ATTACHMENTS
       ========================= */

    const existingJson =
      data.ExistingAttachments?.length > 0
        ? data.ExistingAttachments.map((a) => ({
            attachmentId: a.attachmentId,
            url: a.filePath,
          }))
        : []

    formData.append(
      'ExistingAttachmentUrlsJson',
      JSON.stringify(existingJson) // always [] if empty
    )

    /* =========================
       ✅ API CALL
       ========================= */

    const response = await fetch(UpdateDescriptionAndAttachmentUrl, {
      method: 'POST',
      body: formData,
    })

    return await response.json()
  } catch (err) {
    console.error('API failed:', err)
  }
}

export const fetchIncidentDescriptionAndAttachmentsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${IncidentDescriptionAndAttachmentsUrl}`, {
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
export const fetchIncidentConversationWithoutAttachmentsUrl = async (orgId, ToolId, incidentid) => {
  try {
    const response = await FetchWithToken(
      `${IncidentConversationWithoutAttachmentsUrl}?orgid=${orgId}&toolid=${ToolId}&incidentid=${incidentid}`,
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
export const fetchNotesDetailsUrl = async (incidentNotesId) => {
  try {
    const response = await FetchWithToken(`${NotesDetailsUrl}?incidentnoteid=${incidentNotesId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}

export const fetchNotesDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${NotesDeleteUrl}`, {
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

export const fetchIncidenttNotesByIncidentByConversationIdUrl = async (ConversationId) => {
  try {
    const response = await FetchWithToken(
      `${IncidenttNotesByIncidentByConversationIdUrl}?ConversationId=${ConversationId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const responseData = await response.json()
    const incidentNotes = responseData.incidentNotes
    return incidentNotes
  } catch (error) {
    console.log(error)
  }
}
