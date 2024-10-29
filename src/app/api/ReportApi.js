import FetchWithToken from "../modules/auth/FetchWithToken"

const AlertsSummeryUrl = process.env.REACT_APP_ALERTS_SUMMERY_URL
const AlertsRuleUrl = process.env.REACT_APP_ALERTS_RULE_SUMMERY_URL
const SLAMeasurementSummeryUrl = process.env.REACT_APP_SLA_MEASURMENT_SUMMERY_URL
const AllIncidentsSummeryUrl = process.env.REACT_APP_ALL_INCIDENTS_SUMMERY_URL
const ClosedIncidentsSummeryUrl=process.env.REACT_APP_CLOSED_INCIDENTS_SUMMERY_URL
const OpenIncidentsSummeryUrl=process.env.REACT_APP_OPEN_INCIDENTS_SUMMERY_URL
const SignificantsIncidentsSummeryUrl= process.env.REACT_APP_SIGNIFICANTS_INCIDENTS_SUMMERY_URL


export const fetchAlertsSummeryUrl = async (data) => {
  try {
    const response = await FetchWithToken(AlertsSummeryUrl, {
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
export const fetchAlertsRuleUrl = async (data) => {
  try {
    const response = await FetchWithToken(AlertsRuleUrl, {
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
    const response = await FetchWithToken(SLAMeasurementSummeryUrl, {
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
    const response = await FetchWithToken(AllIncidentsSummeryUrl, {
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
    const response = await FetchWithToken(ClosedIncidentsSummeryUrl, {
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
    const response = await FetchWithToken(OpenIncidentsSummeryUrl, {
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
    const response = await FetchWithToken(SignificantsIncidentsSummeryUrl, {
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
