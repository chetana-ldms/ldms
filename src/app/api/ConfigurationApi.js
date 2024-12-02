import FetchWithToken from "../modules/auth/FetchWithToken";

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
const RolesAddUrl = process.env.REACT_APP_ROLES_ADD_URL
const RolesUpdateUrl = process.env.REACT_APP_ROLES_UPDATE_URL
const RolesDeleteUrl = process.env.REACT_APP_ROLES_DELETE_URL
const RolesDetailUrl =process.env.REACT_APP_ROLE_DETAILS_URL
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
const AllMasterDataUrl= "http://10.41.3.232:502/api/PlattformMasterData/v1/AllMasterData"

export const fetchLDPToolsByToolType = async (data) => {
  try {
    const response = await FetchWithToken(`${ldptoolsByToolTypeUrl}`, {
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
    const response = await FetchWithToken(`${toolTypeActionDetailsUrl}?id=${id}`, {
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

export const fetchUserDetails = async (id, userName, emailId ) => {
  try {
    const response = await FetchWithToken(`${userDetailsUrl}?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const userdata = responseData.userdata;
    console.log(userdata, "userdata");
    userName.current.value = userdata.name;
    emailId.current.value = userdata.emailId;
    return userdata;
  } catch (error) {
    console.log(error);
  }
};
export const fetchToolActionDetails = async (id) => {
  try {
    const response = await FetchWithToken(`${toolActionDetailsUrl}?id=${id}`, {
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
    const response = await FetchWithToken(`${organizationToolDetailsUrl}?id=${id}`, {
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
    const response = await FetchWithToken(`${rulesUrl}?orgId=${orgId}`, {
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
    const response = await FetchWithToken(`${ruleDetailsUrl}?ruleID=${id}`, {
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
    const response = await FetchWithToken(`${ruleActionsUrl}?orgId=${orgId}`, {
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
    const response = await FetchWithToken(`${toolActionsUrl}`, {
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
    const response = await FetchWithToken(`${ruleActionDetailsUrl}?id=${id}`, {
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
    const response = await FetchWithToken(`${GetToolActionsByToolURL}`, {
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
    const response = await FetchWithToken(`${ToolTypeActionsUrl}`, {
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
    const response = await FetchWithToken(`${ToolTypeActionUpdateUrl}`, {
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
    const response = await FetchWithToken(`${ToolTypeActionAddUrl}`, {
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
    const response = await FetchWithToken(`${OrganizationsUrl}`, {
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
    const response = await FetchWithToken(`${OrganizationAddUrl}`, {
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
    const response = await FetchWithToken(`${OrganizationUpdateUrl}`, {
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
export const fetchUsersUrl = async (orgId, userID) => {
  try {
    const response = await FetchWithToken(`${UsersUrl}?orgId=${orgId}&userid=${userID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orgId,
        userID,
      }),
    });
    const responseData = await response.json();
    const usersList = responseData?.usersList;
    return usersList;
  } catch (error) {
    console.log(error);
  }
};

export const fetchRolesUrl = async (orgId, userID) => {
  try {
    const response = await FetchWithToken(`${RolesUrl}?orgId=${orgId}&userid=${userID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orgId,
        userID,
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
    const response = await FetchWithToken(`${RolesAddUrl}`, {
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
    const response = await FetchWithToken(`${RolesUpdateUrl}`, {
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
    const response = await FetchWithToken(`${RolesDeleteUrl}`, {
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
    const response = await FetchWithToken(`${UserAddUrl}`, {
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
    const response = await FetchWithToken(`${UserUpdateUrl}`, {
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
    const response = await FetchWithToken(`${LDPToolsUrl}`, {
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
    const response = await FetchWithToken(`${LDPToolsAddUrl}`, {
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
    const response = await FetchWithToken(`${LDPToolsUpdateUrl}`, {
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
    const response = await FetchWithToken(`${ToolActionsUrl}`, {
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
    const response = await FetchWithToken(`${ToolActionAddUrl}`, {
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
    const response = await FetchWithToken(`${ToolActionUpdateUrl}`, {
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
    const response = await FetchWithToken(`${OrganizationToolsUrl}`, {
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
    const response = await FetchWithToken(`${OrganizationToolsAddUrl}`, {
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
    const response = await FetchWithToken(`${OrganizationToolsUpdateUrl}`, {
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
    const response = await FetchWithToken(url, {
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
    const response = await FetchWithToken(`${RulesAddUrl}`, {
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
    const response = await FetchWithToken(`${RulesUpdateUrl}`, {
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
    const response = await FetchWithToken(`${RuleActionUrl}`, {
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
    const response = await FetchWithToken(`${RuleActionUpdateUrl}`, {
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
    const response = await FetchWithToken(`${RolesDetailUrl}?id=${id}`, {
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
export const fetchAllMasterDataUrl = async () => {
  try {
    const response = await FetchWithToken(`${AllMasterDataUrl}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
