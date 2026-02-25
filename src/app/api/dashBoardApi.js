import { API } from "../../config/apiConfig";
import FetchWithToken from "../modules/auth/FetchWithToken"
const OrganizationsUrl = API.DASHBOARD_ORGANIZATIONS;
const GetAlertsMostUsedTagesUrl = API.DASHBOARD_ALERTS_MOST_USED_TAGS;
const UserActionsByUserUrl = API.DASHBOARD_USER_ACTIONS_BY_USER;
const GetMyInternalIncidentsUrl = API.DASHBOARD_MY_INTERNAL_INCIDENTS;
const GetUnAttendedIncidentsCountUrl = API.DASHBOARD_UNATTENDED_INCIDENTS_COUNT;
const GetUnAttendedAletsCountUrl = API.DASHBOARD_UNATTENDED_ALERTS_COUNT;
const GetFalsePositiveAlertsCountUrl = API.DASHBOARD_FALSE_POSITIVE_ALERTS_COUNT;
const GetAlertsResolvedMeanTimeUrl = API.DASHBOARD_ALERTS_RESOLVED_MEAN_TIME;
const AllIncidentsSummeryUrl = API.DASHBOARD_ALL_INCIDENTS_SUMMARY;
const GetAlertsTrendDataUrl = API.DASHBOARD_ALERTS_TREND_DATA;
const GetIncidentCountByPriorityAndStatusUrl = API.DASHBOARD_INCIDENT_COUNT_BY_PRIORITY_STATUS;
const masterDataUrl = API.MASTER_DATA;
const masterDataByOrganization = API.MASTER_DATA_BY_ORGANIZATION;

export const fetchOrganizations = async () => {
    try {
      const response = await FetchWithToken(`${OrganizationsUrl}`, {
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
      const response = await FetchWithToken(`${GetAlertsMostUsedTagesUrl}`, {
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
      const response = await FetchWithToken(`${UserActionsByUserUrl}`, {
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
      const response = await FetchWithToken(`${GetMyInternalIncidentsUrl}`, {
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
      const response = await FetchWithToken(`${GetUnAttendedIncidentsCountUrl}`, {
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
      const response = await FetchWithToken(`${GetUnAttendedAletsCountUrl}`, {
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
      const response = await FetchWithToken(`${GetFalsePositiveAlertsCountUrl}`, {
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
      const response = await FetchWithToken(`${GetAlertsResolvedMeanTimeUrl}`, {
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
      const response = await FetchWithToken(`${masterDataUrl}`, {
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
      const response = await FetchWithToken(`${AllIncidentsSummeryUrl}`, {
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
      const response = await FetchWithToken( `${GetAlertsTrendDataUrl}`, {
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
      const response = await FetchWithToken(`${GetIncidentCountByPriorityAndStatusUrl}`, {
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
 export const fetchMasterDataByOrganization = async (data) => {
    try {
      const response = await FetchWithToken(`${masterDataByOrganization}`, {
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
  
  