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
const IncidentReportTypesUrl = 'http://10.41.3.232:501/api/Reports/v1/IncidentReportTypes'
const IncidentReportDataUrl = 'http://10.41.3.232:501/api/Reports/v1/IncidentReportData'
const IncidentsHasChangesUrl =
  'http://10.41.3.232:501/api/IncidentManagement/v1/Incidents/HasChanges'
const DeleteIncidentsUrl = 'http://10.41.3.232:501/api/IncidentManagement/v1/DeleteIncidents'
const MergeIncidentsUrl = 'http://10.41.3.232:501/api/IncidentManagement/v1/MergeIncidents'
const GroupUsersUrl = 'http://10.41.3.232:501/api/LDPSecurity/v1/GroupUsers'
const UsersForIncidentCreatorRoleUrl =
  'http://10.41.3.232:501/api/LDPSecurity/v1/UsersForIncidentCreatorRole'
const ReplyIncidentUrl = 'http://10.41.3.232:501/api/IncidentManagement/v1/ReplyIncident'
const IncidentGroupsUrl = 'http://10.41.3.232:501/api/IncidentManagement/v1/IncidentGroups'
const IncidentProductsUrl = 'http://10.41.3.232:501/api/IncidentManagement/v1/IncidentProducts'
const SearchIncidentTagsUrl = 'http://10.41.3.232:501/api/IncidentManagement/v1/SearchIncidentTags'
const ForwardIncidentUrl = 'http://10.41.3.232:501/api/IncidentManagement/v1/ForwardIncident'
const EmailSearchUrl = 'http://10.41.3.232:501/api/LDPSecurity/v1/EmailSearch'
const SendMailUrl = 'http://10.41.3.232:501/api/IncidentManagement/v1/SendMail'

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
    const response = await FetchWithToken(`${ForwardIncidentUrl}`, {
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
