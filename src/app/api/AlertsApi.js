const alertsUrl = process.env.REACT_APP_ALERTS_URL;
const setAlertEscalationStatusUrl =
  process.env.REACT_APP_SET_ALERT_ESCALATION_URL;
const usersUrl = process.env.REACT_APP_LDP_SECURIY_USER_URL;
const getAlertNotesByAlertIDUrl = process.env.REACT_APP_ALERTS_NOTES_URL;
const GetalertHistoryUrl=process.env.REACT_APP_GET_ALERT_HISTORY_URL
const getSentinalOneUrl = "http://115.110.192.133:502/api/SentinalOne/v1/Threat/Details"
const AnalystVerdictUpdateUrl ="http://115.110.192.133:502/api/Alerts/v1/Alert/AnalystVerdict/Update"
const MitigateActionUrl="http://115.110.192.133:502/api/SentinalOne/v1/Threats/MitigateAction"
const ThreatNotesUrl= "http://115.110.192.133:502/api/SentinalOne/v1/Threats/Notes/Add"
const AddToblockListUrl="http://115.110.192.133:502/api/SentinalOne/v1/Threats/AddToblockList"
const AddToExclusionListUrl="http://115.110.192.133:502/api/SentinalOne/v1/Threats/AddToExclusionList"
const ConnectToNetworkUrl="http://115.110.192.133:502/api/SentinalOne/v1/Agent/ConnectToNetwork"
const DisConnectFromNetworkUrl="http://115.110.192.133:502/api/SentinalOne/v1/Agent/DisConnectFromNetwork"
const ThreatsActionUrl="http://115.110.192.133:502/api/SentinalOne/v1/Threats/Action"
const AlertsStatusUpdateUrl="http://115.110.192.133:502/api/Alerts/v1/Alerts/Status/Update"

export const fetchAlertData = async (data) => {
  try {
    const response = await fetch(`${alertsUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchUsers = async (id) => {
  try {
    const response = await fetch(`${usersUrl}?OrgId=${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchSetAlertEscalationStatus = async (data) => {
  try {
    const response = await fetch(`${setAlertEscalationStatusUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};

export const fetchSetOfAlerts = async (currentPage, orgId, userID, limit) => {
  const rangeStart = (currentPage - 1) * limit + 1;
  const rangeEnd = currentPage * limit;
  let data2 = {
    orgID: orgId,
    toolID: "1",
    toolTypeID: "1",
    paging: {
      rangeStart: rangeStart,
      rangeEnd: rangeEnd,
    },
    loggedInUserId: userID,
  };
  const response = await fetchAlertData(data2);
  return response.alertsList;
};
export const fetchGetAlertNotesByAlertID = async (data) => {
  try {
    const response = await fetch(`${getAlertNotesByAlertIDUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    const alertNotesList = responseData.alertNotesList;
    return alertNotesList;
  } catch (error) {
    console.log(error);
  }
};
export const fetchGetalertHistory = async (data) => {
  try {
    const response = await fetch(`${GetalertHistoryUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    const alertHistoryData = responseData.alertHistoryData;
    return alertHistoryData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchSentinelOneAlert = async (id) => {
  try {
    const response = await fetch(`${getSentinalOneUrl}?alertId=${id}`, {
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchAnalystVerdictUpdateUrl = async (data) => {
  try {
    const response = await fetch(`${AnalystVerdictUpdateUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchMitigateActionUrl = async (data) => {
  try {
    const response = await fetch(`${MitigateActionUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchThreatNotesUrl = async (data) => {
  try {
    const response = await fetch(`${ThreatNotesUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchAddToblockListUrl = async (data) => {
  try {
    const response = await fetch(`${AddToblockListUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchAddToExclusionListUrl = async (data) => {
  try {
    const response = await fetch(`${AddToExclusionListUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchConnectToNetworkUrl = async (data) => {
  try {
    const response = await fetch(`${ConnectToNetworkUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchDisConnectFromNetworkUrl = async (data) => {
  try {
    const response = await fetch(`${DisConnectFromNetworkUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchThreatsActionUrl = async (data) => {
  try {
    const response = await fetch(`${ThreatsActionUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchAlertsStatusUpdateUrl = async (data) => {
  try {
    const response = await fetch(`${AlertsStatusUpdateUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
