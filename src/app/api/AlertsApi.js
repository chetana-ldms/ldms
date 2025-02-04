import FetchWithToken from "../modules/auth/FetchWithToken"

const alertsUrl = process.env.REACT_APP_ALERTS_URL
const setAlertEscalationStatusUrl = process.env.REACT_APP_SET_ALERT_ESCALATION_URL
const usersUrl = process.env.REACT_APP_LDP_SECURIY_USER_URL
const getAlertNotesByAlertIDUrl = process.env.REACT_APP_ALERTS_NOTES_URL
const GetalertHistoryUrl = process.env.REACT_APP_GET_ALERT_HISTORY_URL
const getSentinalOneUrl = process.env.REACT_APP_THREAT_DETAILS_URL
const AnalystVerdictUpdateUrl = process.env.REACT_APP_ANALYSTVERDICT_UPDATE_URL
const MitigateActionUrl = process.env.REACT_APP_MITIGATEACTION_URL
const ThreatNotesUrl = process.env.REACT_APP_NOTES_ADD_URL
const AddToblockListUrl = process.env.REACT_APP_ADDTOBLOCKLIST_THREAT_URL
const AddToExclusionListUrl = process.env.REACT_APP_ADDTOEXCLUSIONLIST_URL
const ConnectToNetworkUrl = process.env.REACT_APP_CONNECTTONETWORK_URL
const DisConnectFromNetworkUrl = process.env.REACT_APP_DISCONNECTFROMNETWORK_URL
const ThreatsActionUrl = process.env.REACT_APP_ACTION_URL
const AlertsStatusUpdateUrl = process.env.REACT_APP_ALERTS_STATUS_UPDATE_URL
const MitigateActionValidationUrl = process.env.REACT_APP_MITIGATE_ACTION_VALIDATION_URL
const ThreatFileDownloadUrl=process.env.REACT_APP_THREAT_FILEDOWNLOAD_URL
const CustomAlertsUrl = "http://10.41.3.232:501/api/Alerts/v1/CustomAlerts"

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

