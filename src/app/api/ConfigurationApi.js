const LDPToolsByToolType="http://115.110.192.133:502/api/LDPlattform/v1/LDPToolsByToolType"
const ToolTypeActionDetails="http://115.110.192.133:502/api/LDPlattform/v1/ToolTypeActionDetails"
const UserDetails= "http://115.110.192.133:502/api/LDPSecurity/v1/UserDetails"
const ToolActionDetails='http://115.110.192.133:502/api/LDPlattform/v1/ToolActionDetails'
const OrganizationToolDetails="http://115.110.192.133:502/api/LDPlattform/v1/OrganizationToolDetails"
const Rules="http://115.110.192.133:8011/api/RulesConfiguraton/v1/Rules"
const RuleDetails="http://115.110.192.133:8011/api/RulesConfiguraton/v1/Rules/RuleDetails"
const RuleActions="http://115.110.192.133:8011/api/RuleAction/v1/RuleActions"
const ToolActions="http://115.110.192.133:502/api/LDPlattform/v1/ToolActions"
const RuleActionDetails="http://115.110.192.133:8011/api/RuleAction/v1/RuleActionDetails"

export const fetchLDPToolsByToolType = async (data) => {
    try {
      const response = await fetch(`${LDPToolsByToolType}`, {
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
  export const fetchToolTypeActionDetails = async (id, toolNameRef) => {
    try {
      const response = await fetch(`${ToolTypeActionDetails}?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await fetch(`${UserDetails}?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await fetch(`${ToolActionDetails}?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await fetch(`${OrganizationToolDetails}?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await fetch(`${Rules}?orgId=${orgId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await fetch(`${RuleDetails}?ruleID=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await fetch(`${RuleActions}?orgId=${orgId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await fetch(`${ToolActions}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseData = await response.json();
      const toolAcationsList = responseData.toolAcationsList
      return toolAcationsList
    } catch (error) {
      console.log(error)
    }
  }
  export const fetchRuleActionDetails = async (id) => {
    try {
      const response = await fetch(`${RuleActionDetails}?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
  
  