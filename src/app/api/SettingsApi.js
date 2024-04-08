const SitesUrl ="http://115.110.192.133:502/api/SentinalOne/v1/Sites"

export const fetchSitesUrl = async (data) => {
    try {
      const response = await fetch(`${SitesUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      const result = responseData.data;
      return result;
    } catch (error) {
      console.log(error);
    }
  };