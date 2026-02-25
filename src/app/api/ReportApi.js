import { API } from "../../config/apiConfig";
import FetchWithToken from "../modules/auth/FetchWithToken"

const AlertsSummeryUrl = API.ALERTS_SUMMARY;
const AlertsRuleUrl = API.ALERTS_RULE_SUMMARY;
const SLAMeasurementSummeryUrl = API.SLA_MEASUREMENT_SUMMARY;
const AllIncidentsSummeryUrl = API.ALL_INCIDENTS_SUMMARY;
const ClosedIncidentsSummeryUrl = API.CLOSED_INCIDENTS_SUMMARY;
const OpenIncidentsSummeryUrl = API.OPEN_INCIDENTS_SUMMARY;
const SignificantsIncidentsSummeryUrl = API.SIGNIFICANT_INCIDENTS_SUMMARY;
const IncidentsSLAMeasurementSummeryUrl = API.INCIDENTS_SLA_REPORT_DATA;



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
export const fetchIncidentsSLAMeasurementSummeryUrl = async (data) => {
  try {
    const response = await FetchWithToken(IncidentsSLAMeasurementSummeryUrl, {
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
