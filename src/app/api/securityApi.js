const FeaturesUrl= "http://115.110.192.133:502/api/LDPSecurity/v1/Features"
const OrganizationToolsUrl= "http://115.110.192.133:502/api/LDPlattform/v1/Organization/Tools"
const OrganizationRolesUrl= "http://115.110.192.133:502/api/LDPSecurity/v1/Organization/Roles"
const FeaturesActionsAuthorizedAccessUrl= "http://115.110.192.133:502/api/LDPSecurity/v1/Features/Actions/Authorized"
const FeaturesActionsAuthorizationConfigurationUrl= "http://115.110.192.133:502/api/LDPSecurity/v1/Features/Actions/Authorization/Configuration"

export const fetchFeaturesUrl = async (data) => {
    try {
      const response = await fetch(`${FeaturesUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      const features = responseData.features;
      return features;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchOrganizationToolsSecurityUrl = async (OrgId) => {
    try {
      const response = await fetch(`${OrganizationToolsUrl}?OrgId=${OrgId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      const tools = responseData.tools;
      return tools;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchOrganizationRolesUrl = async (OrgId) => {
    try {
      const response = await fetch(`${OrganizationRolesUrl}?OrgId=${OrgId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      const rolesList = responseData.rolesList;
      return rolesList;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchFeaturesActionsAuthorizedAccessUrl = async (data) => {
    try {
      const response = await fetch(`${FeaturesActionsAuthorizedAccessUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      const featureActions = responseData.featureActions;
      return featureActions;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchFeaturesActionsAuthorizationConfigurationUrl = async (data) => {
    try {
      const response = await fetch(`${FeaturesActionsAuthorizationConfigurationUrl}`, {
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