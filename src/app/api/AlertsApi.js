import { API } from "../../config/apiConfig"
import FetchWithToken from "../modules/auth/FetchWithToken"

const alertsUrl = API.ALERTS
const setAlertEscalationStatusUrl = API.SET_ALERT_ESCALATION
const usersUrl = API.USERS
const getAlertNotesByAlertIDUrl = API.ALERT_NOTES
const GetalertHistoryUrl = API.ALERT_HISTORY
const getSentinalOneUrl = API.THREAT_DETAILS
const AnalystVerdictUpdateUrl = API.ANALYST_VERDICT_UPDATE
const MitigateActionUrl = API.MITIGATE_ACTION
const ThreatNotesUrl = API.THREAT_NOTES_ADD
const AddToblockListUrl = API.ADD_TO_BLOCKLIST
const AddToExclusionListUrl = API.ADD_TO_EXCLUSION_LIST
const ConnectToNetworkUrl = API.CONNECT_TO_NETWORK
const DisConnectFromNetworkUrl = API.DISCONNECT_FROM_NETWORK
const ThreatsActionUrl = API.THREATS_ACTION
const AlertsStatusUpdateUrl = API.ALERT_STATUS_UPDATE
const MitigateActionValidationUrl = API.MITIGATE_ACTION_VALIDATION
const ThreatFileDownloadUrl = API.THREAT_FILE_DOWNLOAD
const CustomAlertsUrl = API.CUSTOM_ALERTS
const CustomAlertsAnalystVerdictUpdateUrl = API.CUSTOM_ALERTS_ANALYST_UPDATE
const CustomAlertsIncidentStatusUpdateUrl = API.CUSTOM_ALERTS_STATUS_UPDATE

export const fetchAlertData = async (data) => {
  try {
    const response = await FetchWithToken(`${alertsUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchUsers = async (id, userID) => {
  try {
    const response = await FetchWithToken(`${usersUrl}?OrgId=${id}&userid=${userID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        userID:userID,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchSetAlertEscalationStatus = async (data) => {
  try {
    const response = await FetchWithToken(`${setAlertEscalationStatusUrl}`, {
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

export const fetchSetOfAlerts = async (currentPage, orgId, userID, limit, accountId, siteId, groupId) => {
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
    orgAccountStructureLevel: [
      {
        levelName: 'AccountId',
        levelValue: accountId || '',
      },
      {
        levelName: 'SiteId',
        levelValue: siteId || '',
      },
      {
        levelName: 'GroupId',
        levelValue: groupId || '',
      },
    ],
  }
  const response = await fetchAlertData(data2)
  return response.alertsList
}
export const fetchGetAlertNotesByAlertID = async (data) => {
  try {
    const response = await FetchWithToken(`${getAlertNotesByAlertIDUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()
    const alertNotesList = responseData.alertNotesList
    return alertNotesList
  } catch (error) {
    console.log(error)
  }
}
export const fetchGetalertHistory = async (data) => {
  try {
    const response = await FetchWithToken(`${GetalertHistoryUrl}`, {
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
export const fetchSentinelOneAlert = async (id) => {
  try {
    const response = await FetchWithToken(`${getSentinalOneUrl}?alertId=${id}`, {
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
export const fetchAnalystVerdictUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${AnalystVerdictUpdateUrl}`, {
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
export const fetchMitigateActionUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MitigateActionUrl}`, {
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
export const fetchThreatNotesUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ThreatNotesUrl}`, {
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
export const fetchAddToblockListUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${AddToblockListUrl}`, {
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
export const fetchAddToExclusionListUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${AddToExclusionListUrl}`, {
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
export const fetchConnectToNetworkUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ConnectToNetworkUrl}`, {
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
export const fetchDisConnectFromNetworkUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${DisConnectFromNetworkUrl}`, {
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
export const fetchThreatsActionUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ThreatsActionUrl}`, {
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
export const fetchAlertsStatusUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${AlertsStatusUpdateUrl}`, {
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
export const fetchMitigateActionValidationUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MitigateActionValidationUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchThreatFileDownloadUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ThreatFileDownloadUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const fetchCustomAlertsUrl= async (data) => {
  try {
    const response = await FetchWithToken(`${CustomAlertsUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchCustomAlertsAnalystVerdictUpdateUrl= async (data) => {
  try {
    const response = await FetchWithToken(`${CustomAlertsAnalystVerdictUpdateUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchCustomAlertsIncidentStatusUpdateUrl= async (data) => {
  try {
    const response = await FetchWithToken(`${CustomAlertsIncidentStatusUpdateUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}

