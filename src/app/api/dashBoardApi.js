const OrganizationsUrl = process.env.REACT_APP_DASHBOARD_ORGANIZATION_URL
const GetAlertsMostUsedTagesUrl=process.env.REACT_APP_DASHBOARD_GETALERTSMOSTUSEDTAGES_URL
const UserActionsByUserUrl=process.env.REACT_APP_DASHBOARD_USERACTIONSBYUSER_URL
const GetMyInternalIncidentsUrl =process.env.REACT_APP_DASHBOARD_GETMYINTERNALINCIDENTS_URL
const GetUnAttendedIncidentsCountUrl =process.env.REACT_APP_DASHBOARD_GETUNATTNDEDINCIDENTSCOUNT_URL
const GetUnAttendedAletsCountUrl =process.env.REACT_APP_DASHBOARD_GETUNATTENDEDALERTSCOUNT_URL
const GetFalsePositiveAlertsCountUrl =process.env.REACT_APP_DASHBOARD_GETFALSEPOSITIVEALERTSCOUNT_URL
const GetAlertsResolvedMeanTimeUrl =process.env.REACT_APP_DASHBOARD_GETALERTSRESOLVEDMEANTIME_URL
const MasterDataUrl = process.env.REACT_APP_DASHBOARD_MASTERDATA_URL
const AllIncidentsSummeryUrl =process.env.REACT_APP_DASHBOARD_ALLINCIDENTSSUMMERY_URL
const GetAlertsTrendDataUrl =process.env.REACT_APP_DASHBOARD_GETALERTSTRENDDATA_URL
const GetIncidentCountByPriorityAndStatusUrl= process.env.REACT_APP_DASHBOARD_GET_INCIDENT_COUNTBY_PRIORITY_AND_STATUS_URL


export const fetchOrganizations = async () => {
    try {
      const response = await fetch(`${OrganizationsUrl}`, {
        method: 'GET',
        headers: {
          Accept: 'text/plain',
        },
      });
      const responseData = await response.json();
      const organizationList = responseData.organizationList
      return organizationList
    } catch (error) {
      console.log(error);
    }
  };
  
  export const fetchGetAlertsMostUsedTags = async (data) => {
    try {
      const response = await fetch(`${GetAlertsMostUsedTagesUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const fetchUserActionsByUser = async (data) => {
    try {
      const response = await fetch(`${UserActionsByUserUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      const userActionsData = responseData.userActionsData
      return userActionsData;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const fetchGetMyInternalIncidents = async (data) => {
    try {
      const response = await fetch(`${GetMyInternalIncidentsUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      const incidentList = responseData.incidentList
      return incidentList;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const fetchGetUnAttendedIncidentsCount = async (data) => {
    try {
      const response = await fetch(`${GetUnAttendedIncidentsCountUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/plain',
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const fetchGetUnAttendedAletsCount = async (data) => {
    try {
      const response = await fetch(`${GetUnAttendedAletsCountUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/plain',
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const fetchGetFalsePositiveAlertsCount = async (data) => {
    try {
      const response = await fetch(`${GetFalsePositiveAlertsCountUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/plain',
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const fetchGetAlertsResolvedMeanTime = async (data) => {
    try {
      const response = await fetch(`${GetAlertsResolvedMeanTimeUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/plain',
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const fetchMasterData = async (data) => {
    try {
      const response = await fetch(`${MasterDataUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/plain',
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };

  export const fetchAllIncidentsSummery = async (data) => {
    try {
      const response = await fetch(`${AllIncidentsSummeryUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/plain',
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };

  export const fetchGetAlertsTrendData = async (data) => {
    try {
      const response = await fetch( `${GetAlertsTrendDataUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/plain',
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };

  export const fetchGetIncidentCountByPriorityAndStatusUrl = async (data) => {
    try {
      const response = await fetch(`${GetIncidentCountByPriorityAndStatusUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };
  
  