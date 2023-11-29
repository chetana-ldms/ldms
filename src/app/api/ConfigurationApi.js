const ldptoolsByToolTypeUrl = process.env.REACT_APP_LDPTOOLS_BY_TOOLTYPE_URL;
const toolTypeActionDetailsUrl = process.env.REACT_APP_TOOLTYPEACTION_DETAILS_URL;
const userDetailsUrl = process.env.REACT_APP_USER_DETAILS_URL;
const toolActionDetailsUrl = process.env.REACT_APP_TOOL_ACTION_DETAILS_URL;
const organizationToolDetailsUrl = process.env.REACT_APP_ORGANIZATION_TOOL_DETAILS_URL;
const rulesUrl = process.env.REACT_APP_RULES_URL;
const ruleDetailsUrl = process.env.REACT_APP_RULE_DETAILS_URL;
const ruleActionsUrl = process.env.REACT_APP_RULE_ACTIONS_URL;
const toolActionsUrl = process.env.REACT_APP_TOOL_ACTIONS_URL;
const ruleActionDetailsUrl = process.env.REACT_APP_RULE_ACTION_DETAILS_URL;

const ToolTypeActionsUrl = process.env.REACT_APP_TOOL_TYPE_ACTIONS_URL;
const GetToolActionsByToolURL = process.env.REACT_APP_GET_TOOL_ACTIONS_BY_TOOL_URL;

const ToolTypeActionUpdateUrl = process.env.REACT_APP_TOOL_TYPE_ACTION_UPDATE_URL;
const ToolTypeActionAddUrl= process.env.REACT_APP_TOOL_TYPE_ACTION_ADD_URL
const OrganizationsUrl= process.env.REACT_APP_ORGANIZATIONS_URL
const OrganizationAddUrl=  process.env.REACT_APP_ORGANIZATIONS_ADD_URL
const OrganizationUpdateUrl=  process.env.REACT_APP_ORGANIZATIONS_UPDATE_URL
const UsersUrl= process.env.REACT_APP_USERS_URL
const RolesUrl= process.env.REACT_APP_ROLES_URL
const RolesAddUrl = "http://115.110.192.133:502/api/LDPSecurity/v1/Roles/Add"
const RolesUpdateUrl = "http://115.110.192.133:502/api/LDPSecurity/v1/Roles/Update"
const RolesDeleteUrl ="http://115.110.192.133:502/api/LDPSecurity/v1/Roles/Delete"
const RolesDetailUrl ="http://115.110.192.133:502/api/LDPSecurity/v1/RoleDetails"
const UserAddUrl= process.env.REACT_APP_USER_ADD_URL
const UserUpdateUrl= process.env.REACT_APP_USER_UPDATE_URL
const LDPToolsUrl= process.env.REACT_APP_LDPTOOLS_URL
const LDPToolsAddUrl= process.env.REACT_APP_LDPTOOLS_ADD_URL
const LDPToolsUpdateUrl= process.env.REACT_APP_LDPTOOLS_UPDATE_URL
const ToolActionsUrl= process.env.REACT_APP_TOOLACTIONS_URL
const ToolActionAddUrl= process.env.REACT_APP_TOOLACTIONS_ADD_URL
const ToolActionUpdateUrl= process.env.REACT_APP_TOOLACTIONS_UPDATE_URL
const OrganizationToolsUrl= process.env.REACT_APP_ORGANIZATION_TOOLS_URL
const OrganizationToolsAddUrl= process.env.REACT_APP_ORGANIZATION_TOOLS_ADD_URL
const OrganizationToolsUpdateUrl= process.env.REACT_APP_ORGANIZATION_TOOLS_UPDATE_URL
const RuleCatagoriesUrl= process.env.REACT_APP_RULE_RULEENGINE_MASTERDATA_URL
const RulesAddUrl = process.env.REACT_APP_RULE_RULE_ADD_URL
const RulesUpdateUrl= process.env.REACT_APP_RULE_RULES_UPDATE_URL
const RuleActionUrl= process.env.REACT_APP_RULE_ACTION_ADD_URL
const RuleActionUpdateUrl= process.env.REACT_APP_RULE_ACTION_UPDATE_URL

export const fetchLDPToolsByToolType = async (data) => {
  try {
    const response = await fetch(`${ldptoolsByToolTypeUrl}`, {
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
export const fetchToolTypeActionDetails = async (id, toolNameRef) => {
  try {
    const response = await fetch(`${toolTypeActionDetailsUrl}?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const toolTypeAction = responseData.toolTypeAction;
    console.log(toolTypeAction, "toolTypeAction");
    // Populate the form fields with the retrieved data
    toolNameRef.current.value = toolTypeAction.toolAction;
    // toolTypeRef.current.value = ldpTool.toolType;
    return toolTypeAction;
  } catch (error) {
    console.log(error);
  }
};

export const fetchUserDetails = async (id, toolNameRef) => {
  try {
    const response = await fetch(`${userDetailsUrl}?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const userdata = responseData.userdata;
    console.log(userdata, "userdata");
    // Populate the form fields with the retrieved data
    toolNameRef.current.value = userdata.name;
    //   passwordRef.current.value = userdata.password;
    return userdata;
  } catch (error) {
    console.log(error);
  }
};
export const fetchToolActionDetails = async (id) => {
  try {
    const response = await fetch(`${toolActionDetailsUrl}?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const toolAcation = responseData.toolAcation;
    return toolAcation;
  } catch (error) {
    console.log(error);
  }
};

export const fetchOrganizationToolDetails = async (id) => {
  try {
    const response = await fetch(`${organizationToolDetailsUrl}?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const organizationToolData = responseData.organizationToolData;
    return organizationToolData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchRules = async (orgId) => {
  try {
    const response = await fetch(`${rulesUrl}?orgId=${orgId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const rulesList = responseData.rulesList;
    console.log(rulesList, "rulesList");
    return rulesList;
  } catch (error) {
    console.log(error);
  }
};
export const fetchRuleDetails = async (id, toolNameRef) => {
  try {
    const response = await fetch(`${ruleDetailsUrl}?ruleID=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const ruleData = responseData.ruleData;
    console.log(ruleData, "ruleData");
    // Populate the form fields with the retrieved data
    toolNameRef.current.value = ruleData.ruleName;
    //   passwordRef.current.value = userdata.password;
    return ruleData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchRuleActions = async (orgId) => {
  try {
    const response = await fetch(`${ruleActionsUrl}?orgId=${orgId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const ruleActionList = responseData.ruleActionList;
    console.log(ruleActionList, "ruleActionList");
    return ruleActionList;
  } catch (error) {
    console.log(error);
  }
};
export const fetchToolActions = async () => {
  try {
    const response = await fetch(`${toolActionsUrl}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const toolAcationsList = responseData.toolAcationsList;
    return toolAcationsList;
  } catch (error) {
    console.log(error);
  }
};
export const fetchRuleActionDetails = async (id) => {
  try {
    const response = await fetch(`${ruleActionDetailsUrl}?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const ruleActionData = responseData.ruleActionData;
    // Populate the form fields with the retrieved data
    //   toolNameRef.current.value = toolTypeAction.toolAction;
    // toolTypeRef.current.value = ldpTool.toolType;
    return ruleActionData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchGetToolActionsByToolURL = async (data) => {
  try {
    const response = await fetch(`${GetToolActionsByToolURL}`, {
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

export const fetchToolTypeActions = async () => {
  try {
    const response = await fetch(`${ToolTypeActionsUrl}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const toolTypeActionsList = responseData.toolTypeActionsList;
    return toolTypeActionsList;
  } catch (error) {
    console.log(error);
  }
};
export const fetchToolTypeActionUpdate = async (data) => {
  try {
    const response = await fetch(`${ToolTypeActionUpdateUrl}`, {
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
export const fetchToolTypeActionAddUrl = async (data) => {
  try {
    const response = await fetch(`${ToolTypeActionAddUrl}`, {
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
export const fetchOrganizationsUrl = async () => {
  try {
    const response = await fetch(`${OrganizationsUrl}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const organizationList = responseData.organizationList;
    return organizationList;
  } catch (error) {
    console.log(error);
  }
};
export const fetchOrganizationAddUrl = async (data) => {
  try {
    const response = await fetch(`${OrganizationAddUrl}`, {
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
export const fetchOrganizationUpdateUrl = async (data) => {
  try {
    const response = await fetch(`${OrganizationUpdateUrl}`, {
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
export const fetchUsersUrl = async (orgId) => {
  try {
    const response = await fetch(`${UsersUrl}?orgId=${orgId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orgId,
      }),
    });
    const responseData = await response.json();
    const usersList = responseData.usersList;
    return usersList;
  } catch (error) {
    console.log(error);
  }
};

export const fetchRolesUrl = async (orgId) => {
  try {
    const response = await fetch(`${RolesUrl}?orgId=${orgId}`, {
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
    return rolesList;
  } catch (error) {
    console.log(error);
  }
};
export const fetchRolesAddUrl = async (data) => {
  try {
    const response = await fetch(`${RolesAddUrl}`, {
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
export const fetchRolesUpdateUrl = async (data) => {
  try {
    const response = await fetch(`${RolesUpdateUrl}`, {
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
export const fetchRolesDeleteUrl = async (data) => {
  try {
    const response = await fetch(`${RolesDeleteUrl}`, {
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


export const fetchUserAddUrl = async (data) => {
  try {
    const response = await fetch(`${UserAddUrl}`, {
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
export const fetchUserUpdateUrl = async (data) => {
  try {
    const response = await fetch(`${UserUpdateUrl}`, {
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
export const fetchLDPToolsUrl = async () => {
  try {
    const response = await fetch(`${LDPToolsUrl}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const ldpToolsList = responseData.ldpToolsList;
    return ldpToolsList;
  } catch (error) {
    console.log(error);
  }
};
export const fetchLDPToolsAddUrl = async (data) => {
  try {
    const response = await fetch(`${LDPToolsAddUrl}`, {
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
export const fetchLDPToolsUpdateUrl = async (data) => {
  try {
    const response = await fetch(`${LDPToolsUpdateUrl}`, {
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
export const fetchToolActionsUrl = async () => {
  try {
    const response = await fetch(`${ToolActionsUrl}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const toolAcationsList = responseData.toolAcationsList;
    return toolAcationsList;
  } catch (error) {
    console.log(error);
  }
};
export const fetchToolActionAddUrl = async (data) => {
  try {
    const response = await fetch(`${ToolActionAddUrl}`, {
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
export const fetchToolActionUpdateUrl = async (data) => {
  try {
    const response = await fetch(`${ToolActionUpdateUrl}`, {
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
export const fetchOrganizationToolsUrl = async () => {
  try {
    const response = await fetch(`${OrganizationToolsUrl}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const organizationToolList = responseData.organizationToolList;
    return organizationToolList;
  } catch (error) {
    console.log(error);
  }
};
export const fetchOrganizationToolsAddUrl = async (data) => {
  try {
    const response = await fetch(`${OrganizationToolsAddUrl}`, {
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
export const fetchOrganizationToolsUpdateUrl = async (data) => {
  try {
    const response = await fetch(`${OrganizationToolsUpdateUrl}`, {
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
export const fetchRuleCatagoriesUrl = async (MasterDataType) => {
  try {
    const url = `${RuleCatagoriesUrl}?MasterDataType=${encodeURIComponent(MasterDataType)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseData = await response.json();
    const masterDataList = responseData.masterDataList;
    return masterDataList;
  } catch (error) {
    console.log(error);
  }
};
export const fetchRulesAddUrl = async (data) => {
  try {
    const response = await fetch(`${RulesAddUrl}`, {
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
export const fetchRulesUpdateUrl = async (data) => {
  try {
    const response = await fetch(`${RulesUpdateUrl}`, {
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
export const fetchRuleActionUrl = async (data) => {
  try {
    const response = await fetch(`${RuleActionUrl}`, {
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
export const fetchRuleActionUpdateUrl = async (data) => {
  try {
    const response = await fetch(`${RuleActionUpdateUrl}`, {
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
export const fetchRolesDetailUrl = async (id) => {
  try {
    const response = await fetch(`${RolesDetailUrl}?id=${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });
    const responseData = await response.json();
    const roleData = responseData.roleData;
    return roleData;
  } catch (error) {
    console.log(error);
  }
};
