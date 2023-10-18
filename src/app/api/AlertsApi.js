const alertsUrl = process.env.REACT_APP_ALERTS_URL;
const setAlertEscalationStatusUrl =
  process.env.REACT_APP_SET_ALERT_ESCALATION_URL;
const usersUrl = process.env.REACT_APP_LDP_SECURIY_USER_URL;
const getAlertNotesByAlertIDUrl = process.env.REACT_APP_ALERTS_NOTES_URL;
const GetalertHistoryUrl=process.env.REACT_APP_GET_ALERT_HISTORY_URL

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
