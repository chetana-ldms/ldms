const CreateIncident = "http://115.110.192.133:502/api/IncidentManagement/v1/CreateIncident"
const Incidents = "http://115.110.192.133:502/api/IncidentManagement/v1/Incidents"
const GetIncidentSearchResult = "http://115.110.192.133:502/api/IncidentManagement/v1/GetIncidentSearchResult"
const IncidentDetails = "http://115.110.192.133:502/api/IncidentManagement/v1/IncidentDetails"
const UpdateIncident = "http://115.110.192.133:502/api/IncidentManagement/v1/UpdateIncident"
const GetIncidentHistory = "http://115.110.192.133:502/api/AlertHistory/v1/GetIncidentHistory"
const AlertsByAlertIds = "http://115.110.192.133:502/api/Alerts/v1/AlertsByAlertIds"

export const fetchCreateIncident = async (data) => {
    try {
        const response = await fetch(`${CreateIncident}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data
            }),
        });

        const responseData = await response.json();
        return responseData
    } catch (error) {
        console.log(error)
    }
}
export const fetchIncidents = async (data) => {
    try {
        const response = await fetch(`${Incidents}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data
            }),
        });

        const responseData = await response.json();
        const incidentList = responseData.incidentList
        return incidentList
    } catch (error) {
        console.log(error)
    }
}
export const fetchSetOfIncidents = async (currentPage, orgId, userID, limit) => {
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
    const response = await fetchIncidents(data2);
    return response;
  };
export const fetchGetIncidentSearchResult = async (data) => {
    try {
        const response = await fetch(`${GetIncidentSearchResult}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data
            }),
        });

        const responseData = await response.json();
        const incidentList = responseData.incidentList
        return incidentList
    } catch (error) {
        console.log(error)
    }
}
export const fetchIncidentDetails = async (incidentID) => {
    try {
        const response = await fetch(`${IncidentDetails}?incidentId=${incidentID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseData = await response.json();
        const incidentData = responseData.incidentData;
        return incidentData;
    } catch (error) {
        console.log(error);
    }
};
export const fetchUpdateIncident = async (data) => {
    try {
        const response = await fetch(`${UpdateIncident}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data
            }),
        });

        const responseData = await response.json();
        return responseData
    } catch (error) {
        console.log(error)
    }
}
export const fetchGetIncidentHistory = async (data) => {
    try {
        const response = await fetch(`${GetIncidentHistory}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data
            }),
        });

        const responseData = await response.json();
        const alertHistoryData = responseData.alertHistoryData
        return alertHistoryData
    } catch (error) {
        console.log(error)
    }
}
export const fetchAlertsByAlertIds = async (data) => {
    try {
        const response = await fetch(`${AlertsByAlertIds}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        const alertsList = responseData.alertsList[0]
        return alertsList
    } catch (error) {
        console.log(error)
    }
}