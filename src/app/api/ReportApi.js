const AlertsSummeryUrl = process.env.REACT_APP_ALERTS_SUMMERY_URL
// const AlertsRuleUrl = process.env.REACT_APP_ALERTS_SUMMERY_URL
const SLAMeasurementSummeryUrl = process.env.REACT_APP_SLA_MEASURMENT_SUMMERY_URL
const AllIncidentsSummeryUrl = process.env.REACT_APP_ALL_INCIDENTS_SUMMERY_URL
const ClosedIncidentsSummeryUrl=process.env.REACT_APP_CLOSED_INCIDENTS_SUMMERY_URL
const OpenIncidentsSummeryUrl=process.env.REACT_APP_OPEN_INCIDENTS_SUMMERY_URL
const SignificantsIncidentsSummeryUrl= process.env.REACT_APP_SIGNIFICANTS_INCIDENTS_SUMMERY_URL


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

const AlertsRuleUrl = "http://115.110.192.133:502/api/Reports/v1/AlertsRuleSummery"
export const fetchAlertsRuleUrl = async (data) => {
  try {
    const response = await fetch(AlertsRuleUrl, {
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
export const fetchAllIncidentsSummeryUrl = async (data) => {
  try {
    const response = await fetch(AllIncidentsSummeryUrl, {
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
export const fetchClosedIncidentsSummeryUrl = async (data) => {
  try {
    const response = await fetch(ClosedIncidentsSummeryUrl, {
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
export const fetchOpenIncidentsSummeryUrl = async (data) => {
  try {
    const response = await fetch(OpenIncidentsSummeryUrl, {
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
export const fetchSignificantsIncidentsSummeryUrl = async (data) => {
  try {
    const response = await fetch(SignificantsIncidentsSummeryUrl, {
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
