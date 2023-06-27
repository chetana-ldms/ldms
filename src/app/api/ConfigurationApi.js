const ldptoolsByToolTypeUrl = process.env.REACT_APP_LDPTOOLS_BY_TOOLTYPE_URL;
const toolTypeActionDetailsUrl =
  process.env.REACT_APP_TOOLTYPEACTION_DETAILS_URL;
const userDetailsUrl = process.env.REACT_APP_USER_DETAILS_URL;
const toolActionDetailsUrl = process.env.REACT_APP_TOOL_ACTION_DETAILS_URL;
const organizationToolDetailsUrl =
  process.env.REACT_APP_ORGANIZATION_TOOL_DETAILS_URL;
const rulesUrl = process.env.REACT_APP_RULES_URL;
const ruleDetailsUrl = process.env.REACT_APP_RULE_DETAILS_URL;
const ruleActionsUrl = process.env.REACT_APP_RULE_ACTIONS_URL;
const toolActionsUrl = process.env.REACT_APP_TOOL_ACTIONS_URL;
const ruleActionDetailsUrl = process.env.REACT_APP_RULE_ACTION_DETAILS_URL;

export const fetchLDPToolsByToolType = async (data) => {
  try {
    const response = await fetch(`${ldptoolsByToolTypeUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // orgID: orgID,
        // alertID: alertID,
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
    console.log(toolAcation, "toolAcation");
    // Populate the form fields with the retrieved data
    //   toolNameRef.current.value = toolTypeAction.toolAction;
    // toolTypeRef.current.value = ldpTool.toolType;
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
    // Populate the form fields with the retrieved data
    //   toolNameRef.current.value = toolTypeAction.toolAction;
    // toolTypeRef.current.value = ldpTool.toolType;
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
