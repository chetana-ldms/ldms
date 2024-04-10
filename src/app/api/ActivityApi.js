const ActivitiesUrl ="http://115.110.192.133:502/api/Activity/v1/activities"
const ActivityTypesUrl= "http://115.110.192.133:502/api/Activity/v1/ActivityTypes"

export const fetchActivitiesUrl = async (data) => {
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
  export const fetchSetOfActivity = async (currentPage, orgId, userID, selectedFromDate, selectedToDate, limit) => {
    const rangeStart = (currentPage - 1) * limit + 1;
    const rangeEnd = currentPage * limit;
    let data2 = {
        orgId: orgId,
        userId: userID,
        activityTypeIds: [],
        fromDateTime: selectedFromDate ? selectedFromDate.toISOString() : null,
        toDateTime: selectedToDate ? selectedToDate.toISOString() : null,
        paging: {
            rangeStart: rangeStart,
            rangeEnd: rangeEnd,
        },
    }
    const response = await fetchActivitiesUrl(data2);
    return response.activitiesList;
};

  export const fetchActivityTypesUrl = async () => {
    try {
      const response = await fetch(`${ActivityTypesUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...null,
        }),
      });
  
      const responseData = await response.json();
      const activityTypes = responseData.activityTypes;
      return activityTypes;
    } catch (error) {
      console.log(error);
    }
  };