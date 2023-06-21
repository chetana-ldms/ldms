const CreateIncident="http://115.110.192.133:502/api/IncidentManagement/v1/CreateIncident"
const Incidents="http://115.110.192.133:502/api/IncidentManagement/v1/Incidents"
const GetIncidentSearchResult="http://115.110.192.133:502/api/IncidentManagement/v1/GetIncidentSearchResult"
const IncidentDetails="http://115.110.192.133:502/api/IncidentManagement/v1/IncidentDetails"
const UpdateIncident="http://115.110.192.133:502/api/IncidentManagement/v1/UpdateIncident"

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