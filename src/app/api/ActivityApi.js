const ActivitiesUrl ="http://115.110.192.133:502/api/Activity/v1/activities"

export const fetchSitesUrl = async (data) => {
    try {
      const response = await fetch(`${ActivitiesUrl}`, {
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