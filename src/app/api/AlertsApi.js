const Alerts = "http://115.110.192.133:502/api/Alerts/v1/Alerts"
const SetAlertEscalationStatus = "http://115.110.192.133:502/api/Alerts/v1/SetAlertEscalationStatus"
const Users = "http://115.110.192.133:502/api/LDPSecurity/v1/Users"
const GetAlertNotesByAlertID ="http://115.110.192.133:502/api/Alerts/v1/GetAlertNotesByAlertID"

export const fetchAlertData = async (data) => {
  try {
    const response = await fetch(`${Alerts}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error)
  }
}
export const fetchUsers = async (id) => {
  try {
    const response = await fetch(`${Users}?OrgId=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id
      })
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error)
  }
}
export const fetchSetAlertEscalationStatus = async (data) => {
  try {
    const response = await fetch(`${SetAlertEscalationStatus}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data
      }),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error)
  }
}

export const fetchSetOfAlerts = async (currentPage, orgId, userID, limit) => {
  const rangeStart = (currentPage - 1) * limit + 1;
  const rangeEnd = currentPage * limit;
  let data2 = {
    orgID: orgId,
    toolID: '1',
    toolTypeID: '1',
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
    const response = await fetch(`${GetAlertNotesByAlertID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    const alertNotesList = responseData.alertNotesList
    return alertNotesList;
  } catch (error) {
    console.log(error)
  }
}