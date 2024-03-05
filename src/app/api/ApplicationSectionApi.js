const ApplicationsAndRisksUrl= "http://115.110.192.133:502/api/SentinalOne/v1/ApplicationsAndRisks"

export const fetchApplicationsAndRisksUrl = async (data) => {
    try {
      const response = await fetch(`${ApplicationsAndRisksUrl}`, {
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