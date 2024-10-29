import FetchWithToken from "../modules/auth/FetchWithToken"

const ApplicationsAndRisksUrl= process.env.REACT_APP_RISKS_APPLICATIONS_URL
const ApplicationInventoryUrl=process.env.REACT_APP_INVENTORY_APPLICATIONS_URL
const ApplicationEndPointsUrl=process.env.REACT_APP_RISKS_APPLICATIONS_ENDPOINTS_URL
const ApplicationCVSUrl=process.env.REACT_APP_RISKS_APPLICATION_CVES_URL
const EndPointDetailsUrl =process.env.REACT_APP_ENDPONT_DETAILS_URL
const EndPointApplicationsUrl = process.env.REACT_APP_ENDPOINT_APPLICATIONS_URL
const InventoryApplicationsEndpointsUrl= process.env.REACT_APP_INVENTORY_APPLICATIONS_ENDPOINTS_URL
const EndPointUpdatesUrl= process.env.REACT_APP_ENDPOINT_UPDATES_URL
const ApplicationManagementSettingsUrl=process.env.REACT_APP_APPLICATION_MANAGEMENT_SETTINGS_URL

export const fetchApplicationsAndRisksUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${ApplicationsAndRisksUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      // const applicationList = responseData.applicationList;
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchApplicationInventoryUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${ApplicationInventoryUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      const applicationList = responseData.applicationList;
      return applicationList;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchApplicationEndPointsUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${ApplicationEndPointsUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      const endPoints = responseData.endPoints;
      return endPoints;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchApplicationCVSUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${ApplicationCVSUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      const cvsList = responseData.cvsList;
      return cvsList;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchAEndPointDetailsUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${EndPointDetailsUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      const endPoints = responseData.endPoints;
      return endPoints;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchEndPointApplicationsUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${EndPointApplicationsUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      // const data = responseData.data;
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchInventoryApplicationsEndpointsUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${InventoryApplicationsEndpointsUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      const endPoints = responseData.endPoints;
      return endPoints;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchEndPointUpdatesUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${EndPointUpdatesUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      const endPointUpdateList = responseData.endPointUpdateList;
      return endPointUpdateList;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchApplicationManagementSettingsUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${ApplicationManagementSettingsUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      // const appSettings = responseData.appSettings;
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };