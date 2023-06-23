import axios from "axios";
const MasterData = "http://182.71.241.246:502/api/LDPlattform/v1/MasterData";
const Organizations = "http://182.71.241.246:502/api/LDPlattform/v1/Organizations";
const Authenticate = "http://182.71.241.246:502/api/LDPSecurity/v1/User/Authenticate";
const UpdateAlert = "http://182.71.241.246:502/api/Alerts/v1/UpdateAlert";
const SetAlertIrrelavantStatus = "http://182.71.241.246:502/api/Alerts/v1/SetAlertIrrelavantStatus";
const ToolTypeActionDelete = "http://182.71.241.246:502/api/LDPlattform/v1/ToolTypeAction/Delete";
const OrganizationDelete= "http://182.71.241.246:502/api/LDPlattform/v1/Organization/Delete";
const LDPToolsDelete= "http://182.71.241.246:502/api/LDPlattform/v1/LDPTools/Delete";
const OrganizationToolsDelete ="http://182.71.241.246:502/api/LDPlattform/v1/OrganizationTools/Delete";
const UserDelete= "http://182.71.241.246:502/api/LDPSecurity/v1/User/Delete";
const ToolActionDelete= "http://182.71.241.246:502/api/LDPlattform/v1/ToolAction/Delete";
const  RulesDelete= "http://182.71.241.246:8011/api/RulesConfiguraton/v1/Rules/Delete";
const RuleActionDelete="http://182.71.241.246:8011/api/RuleAction/v1/RuleAction/Delete";
const LDPTools="http://182.71.241.246:502/api/LDPlattform/v1/LDPTools";
const Roles="http://182.71.241.246:502/api/LDPSecurity/v1/Roles"
const OrganizationDetails= "http://182.71.241.246:502/api/LDPlattform/v1/OrganizationDetails";
const LDPToolDetails="http://182.71.241.246:502/api/LDPlattform/v1/LDPToolDetails"


export const fetchMasterData = async (maserDataType) => {
  try {
    const response = await fetch(`${MasterData}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        maserDataType: maserDataType
      }),
    });
  
    const responseData = await response.json();
    return responseData.masterData.map(obj => obj);
  } catch (error) {
    console.log(error)
  }
}
export const fetchAuthenticate = async (userName, password, orgId) => {
  try {
    const response = await fetch(`${Authenticate}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: userName,
        password: password,
        orgId : orgId
      }),
    });
  
    const responseData = await response.json();
    console.log("responseData123",responseData);
    return responseData;
  } catch (error) {
    console.log(error)
  }
}
export const fetchOrganizations = async () => {
  try {
    const response = await fetch(`${Organizations}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const responseData = await response.json();
    return responseData.organizationList

  } catch (error) {
    console.log(error)
  }
}
export const fetchUpdateAlert = async (data) => {
  try {
    const response = await fetch(`${UpdateAlert}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // orgID: orgID,
        // alertID: alertID,
        ...data
      }),
    });
  
    const responseData = await response.json();
    return responseData
  } catch (error) {
    console.log(error)
  }
}

export const fetchUpdatSetAlertIrrelavantStatuseAlert = async (data) => {
  try {
    const response = await fetch(`${SetAlertIrrelavantStatus}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data
      }),
    });
  
    const responseData = await response.json();
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchToolTypeActionDelete = async (data) => {
  try {
    const response = await fetch(`${ToolTypeActionDelete}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data
      }),
    });
  
    const responseData = await response.json();
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchOrganizationDelete = async (data) => {
  try {
    const response = await fetch(`${OrganizationDelete}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data
      }),
    });
  
    const responseData = await response.json();
    return responseData
  } catch (error) {
    console.log(error)
  }
}

export const fetchLDPToolsDelete = async (data) => {
  try {
    const response = await fetch(`${LDPToolsDelete}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data
      }),
    });
  
    const responseData = await response.json();
    return responseData
  } catch (error) {
    console.log(error)
  }
}

export const fetchOrganizationToolsDelete = async (data) => {
  try {
    const response = await fetch(`${OrganizationToolsDelete}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data
      }),
    });
  
    const responseData = await response.json();
    console.log(responseData, "responseData111")
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchUserDelete = async (data) => {
  try {
    const response = await fetch(`${UserDelete}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data
      }),
    });
  
    const responseData = await response.json();
    console.log(responseData, "responseData111")
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchToolActionDelete = async (data) => {
  try {
    const response = await fetch(`${ToolActionDelete}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data
      }),
    });
  
    const responseData = await response.json();
    console.log(responseData, "responseData111")
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchRulesDelete = async (data) => {
  try {
    const response = await fetch(`${RulesDelete}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data
      }),
    });
  
    const responseData = await response.json();
    console.log(responseData, "responseData111")
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchRuleActionDelete = async (data) => {
  try {
    const response = await fetch(`${RuleActionDelete}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data
      }),
    });
  
    const responseData = await response.json();
    console.log(responseData, "responseData111")
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchLDPTools = async () => {
  try {
    const response = await fetch(`${LDPTools}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseData = await response.json();
    const result = responseData.ldpToolsList
    return result
  } catch (error) {
    console.log(error)
  }
}
export const fetchOrganizationDetails = async (id, orgNameRef, addressRef, mobileNoRef, emailRef) => {
  try {
    const response = await fetch(`${OrganizationDetails}?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
    const response = await fetch(`${LDPToolDetails}?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
    const response = await fetch(`${Roles}?orgId=${orgId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orgId
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

