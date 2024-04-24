const SitesUrl =process.env.REACT_APP_SITES_URL

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