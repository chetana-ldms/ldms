import axios from "axios";
const masterDataUrl = process.env.REACT_APP_MASTER_DATA_URL;
const organizationsUrl = process.env.REACT_APP_ORGANIZATIONS_URL;
const authenticateUrl = process.env.REACT_APP_AUTHENTICATE_URL;
const updateAlertUrl = process.env.REACT_APP_UPDATE_ALERT_URL;
const setAlertIrrelevantStatusUrl = process.env.REACT_APP_SET_ALERT_IRRELEVANT_STATUS_URL;
const toolTypeActionDeleteUrl = process.env.REACT_APP_TOOL_TYPE_ACTION_DELETE_URL;
const organizationDeleteUrl = process.env.REACT_APP_ORGANIZATION_DELETE_URL;
const ldpToolsDeleteUrl = process.env.REACT_APP_LDP_TOOLS_DELETE_URL;
const organizationToolsDeleteUrl = process.env.REACT_APP_ORGANIZATION_TOOLS_DELETE_URL;
const userDeleteUrl = process.env.REACT_APP_USER_DELETE_URL;
const toolActionDeleteUrl = process.env.REACT_APP_TOOL_ACTION_DELETE_URL;
const rulesDeleteUrl = process.env.REACT_APP_RULES_DELETE_URL;
const ruleActionDeleteUrl = process.env.REACT_APP_RULE_ACTION_DELETE_URL;
const ldpToolsUrl = process.env.REACT_APP_LDP_TOOLS_URL;
const rolesUrl = process.env.REACT_APP_ROLES_URL;
const organizationDetailsUrl = process.env.REACT_APP_ORGANIZATION_DETAILS_URL;
const ldpToolDetailsUrl = process.env.REACT_APP_LDP_TOOL_DETAILS_URL;
const forgatePasswordUrl = process.env.REACT_APP_PASSWORD_RESET_ADD_URL
const accountsStructureUrl= process.env.REACT_APP_ACCOUNTS_STRUCTURE_URL
const LogoutAddUrl= process.env.REACT_APP_LOGOUT_ADD_URL
const APITokenExpireUrl= process.env.REACT_APP_API_TOKEN_EXPIRE_URL

export const fetchMasterData = async (maserDataType) => {
  try {
    const response = await fetch(`${masterDataUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        maserDataType: maserDataType,
      }),
    });

    const responseData = await response.json();
    return responseData.masterData.map((obj) => obj);
  } catch (error) {
    console.log(error);
  }
};
export const fetchAuthenticate = async (userName, password, orgId) => {
  try {
    const response = await fetch(`${authenticateUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        password: password,
        orgId: orgId,
      }),
    });

    const responseData = await response.json();
    console.log("responseData123", responseData);
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchOrganizations = async () => {
  try {
    const response = await fetch(`${organizationsUrl}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    return responseData.organizationList;
  } catch (error) {
    console.log(error);
  }
};
export const fetchUpdateAlert = async (data) => {
  try {
    const response = await fetch(`${updateAlertUrl}`, {
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
export const fetchUpdatSetAlertIrrelavantStatuseAlert = async (data) => {
  try {
    const response = await fetch(`${setAlertIrrelevantStatusUrl}`, {
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
export const fetchToolTypeActionDelete = async (data) => {
  try {
    const response = await fetch(`${toolTypeActionDeleteUrl}`, {
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
export const fetchOrganizationDelete = async (data) => {
  try {
    const response = await fetch(`${organizationDeleteUrl}`, {
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
export const fetchLDPToolsDelete = async (data) => {
  try {
    const response = await fetch(`${ldpToolsDeleteUrl}`, {
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
export const fetchOrganizationToolsDelete = async (data) => {
  try {
    const response = await fetch(`${organizationToolsDeleteUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    console.log(responseData, "responseData111");
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchUserDelete = async (data) => {
  try {
    const response = await fetch(`${userDeleteUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    console.log(responseData, "responseData111");
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchToolActionDelete = async (data) => {
  try {
    const response = await fetch(`${toolActionDeleteUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    console.log(responseData, "responseData111");
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchRulesDelete = async (data) => {
  try {
    const response = await fetch(`${rulesDeleteUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    console.log(responseData, "responseData111");
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchRuleActionDelete = async (data) => {
  try {
    const response = await fetch(`${ruleActionDeleteUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    console.log(responseData, "responseData111");
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchLDPTools = async () => {
  try {
    const response = await fetch(`${ldpToolsUrl}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const result = responseData.ldpToolsList;
    return result;
  } catch (error) {
    console.log(error);
  }
};
export const fetchOrganizationDetails = async (
  id,
  orgNameRef,
  addressRef,
  mobileNoRef,
  emailRef
) => {
  try {
    const response = await fetch(`${organizationDetailsUrl}?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const organizationData = responseData.organizationData;
    orgNameRef.current.value = organizationData.orgName;
    addressRef.current.value = organizationData.address;
    mobileNoRef.current.value = organizationData.mobileNo;
    emailRef.current.value = organizationData.email;
    return organizationData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchLDPToolDetails = async (id, toolNameRef) => {
  try {
    const response = await fetch(`${ldpToolDetailsUrl}?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const ldpTool = responseData.ldpTool;
    console.log(ldpTool, "ldpTool"); // Output the fetched data to the console
    // Populate the form fields with the retrieved data
    toolNameRef.current.value = ldpTool.toolName;
    // toolTypeRef.current.value = ldpTool.toolType;
    return ldpTool;
  } catch (error) {
    console.log(error);
  }
};

export const fetchRoles = async (orgId) => {
  try {
    const response = await fetch(`${rolesUrl}?orgId=${orgId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orgId,
      }),
    });
    const responseData = await response.json();
    const rolesList = responseData.rolesList;
    console.log(rolesList, "rolesList");
    return rolesList;
  } catch (error) {
    console.log(error);
  }
};
export const fetchForgatePassword = async (userName, orgId,  createdDate) => {
  try {
    const response = await fetch(`${forgatePasswordUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        orgId: orgId,
        createdDate:createdDate,
      }),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};

export const fetchAccountsStructureUrl = async (data) => {
  try {
    const response = await fetch(`${accountsStructureUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    const result = responseData.accounts;
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const fetchLogoutAddUrl = async (data) => {
  try {
    const response = await fetch(`${LogoutAddUrl}`, {
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


export const fetchAPITokenExpireUrl = async (data) => {
  try {
    const response = await fetch(`${APITokenExpireUrl}`, {
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
