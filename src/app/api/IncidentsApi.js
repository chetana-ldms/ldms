const createIncidentUrl = process.env.REACT_APP_CREATE_INCIDENT_URL;
const incidentsUrl = process.env.REACT_APP_INCIDENTS_URL;
const getIncidentSearchResultUrl =
  process.env.REACT_APP_GET_INCIDENT_SEARCH_RESULT_URL;
const incidentDetailsUrl = process.env.REACT_APP_INCIDENT_DETAILS_URL;
const updateIncidentUrl = process.env.REACT_APP_UPDATE_INCIDENT_URL;
const getIncidentHistoryUrl = process.env.REACT_APP_GET_INCIDENT_HISTORY_URL;
const alertsByAlertIdsUrl = process.env.REACT_APP_ALERTS_BY_ALERT_IDS_URL;
const getChatHistoryUrl = process.env.REACT_APP_GET_CHAT_HISTORY_URL;
const addChatMessageUrl = process.env.REACT_APP_SEND_CHAT_MESSAGE_URL;

export const fetchCreateIncident = async (data) => {
  try {
    const response = await fetch(`${createIncidentUrl}`, {
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
export const fetchIncidents = async (data) => {
  try {
    const response = await fetch(`${incidentsUrl}`, {
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
export const fetchSetOfIncidents = async (
  currentPage,
  orgId,
  userID,
  limit
) => {
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
  const response = await fetchIncidents(data2);
  return response;
};
export const fetchGetIncidentSearchResult = async (data) => {
  try {
    const response = await fetch(`${getIncidentSearchResultUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    const incidentList = responseData.incidentList;
    return incidentList;
  } catch (error) {
    console.log(error);
  }
};
export const fetchIncidentDetails = async (incidentID) => {
  try {
    const response = await fetch(
      `${incidentDetailsUrl}?incidentId=${incidentID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseData = await response.json();
    const incidentData = responseData.incidentData;
    return incidentData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchUpdateIncident = async (data) => {
  try {
    const response = await fetch(`${updateIncidentUrl}`, {
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
export const fetchGetIncidentHistory = async (data) => {
  try {
    const response = await fetch(`${getIncidentHistoryUrl}`, {
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
export const fetchAlertsByAlertIds = async (data) => {
  try {
    const response = await fetch(`${alertsByAlertIdsUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    const alertsList = responseData.alertsList[0];
    return alertsList;
  } catch (error) {
    console.log(error);
  }
};
export const fetchGetChatHistory = async (data) => {
  try {
    const response = await fetch(`${getChatHistoryUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    const chatHistory = responseData.chatHistory;
    return chatHistory;
  } catch (error) {
    console.log(error);
  }
};
export const fetchAddChatMessage = async (formData) => {
  try {
    const response = await fetch(`${addChatMessageUrl}`, {
      method: "POST",
      body: formData,
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
