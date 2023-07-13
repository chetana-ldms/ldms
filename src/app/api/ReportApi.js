const AlertsSummeryUrl ='http://115.110.192.133:502/api/Reports/v1/AlertsSummery'
const SLAMeasurementSummeryUrl="http://115.110.192.133:502/api/Reports/v1/SLAMeasurementSummery"


export const fetchAlertsSummeryUrl = async (data) => {
    try {
      const response = await fetch(AlertsSummeryUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Network response was not ok: ${response.status} - ${errorData.message}`
        );
      }
  
      return response; 
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchSLAMeasurementSummeryUrl = async (data) => {
    try {
      const response = await fetch(SLAMeasurementSummeryUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Network response was not ok: ${response.status} - ${errorData.message}`
        );
      }
  
      return response; 
    } catch (error) {
      console.log(error);
    }
  };
  