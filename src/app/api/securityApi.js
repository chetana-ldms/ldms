const FeaturesUrl= "http://115.110.192.133:502/api/LDPSecurity/v1/Features"
const OrganizationToolsUrl= "http://115.110.192.133:502/api/LDPlattform/v1/Organization/Tools"
const OrganizationRolesUrl= "http://115.110.192.133:502/api/LDPSecurity/v1/Organization/Roles"
const FeaturesActionsAuthorizedAccessUrl= "http://115.110.192.133:502/api/LDPSecurity/v1/Features/Actions/Authorized"
const FeaturesActionsAuthorizationConfigurationUrl= "http://115.110.192.133:502/api/LDPSecurity/v1/Features/Actions/Authorization/Configuration"
const FeaturesListUrl="http://115.110.192.133:502/api/LDPSecurity/v1/Features/List"
const ActionsUrl="http://115.110.192.133:502/api/LDPSecurity/v1/Actions"
const FeaturesAddUrl="http://115.110.192.133:502/api/LDPSecurity/v1/Features/Add"
const FeaturesDeleteUrl="http://115.110.192.133:502/api/LDPSecurity/v1/Features/Delete"
const FeaturesUpdateUrl= "http://115.110.192.133:502/api/LDPSecurity/v1/Features/Update"
const FeatureDetailsUrl= "http://115.110.192.133:502/api/LDPSecurity/v1/Feature/Details"
const ActionsAddUrl="http://115.110.192.133:502/api/LDPSecurity/v1/Actions/Add"
const ActionsDeleteUrl="http://115.110.192.133:502/api/LDPSecurity/v1/Actions/Delete"
const ActionsUpdateUrl="http://115.110.192.133:502/api/LDPSecurity/v1/Actions/Update"
const ActionTypesUrl= "http://115.110.192.133:502/api/LDPSecurity/v1/ActionTypes"

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
  export const fetchFeaturesListUrl = async (data) => {
    try {
      const response = await fetch(`${FeaturesListUrl}`, {
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
  export const fetchActionsUrl = async (data) => {
    try {
      const response = await fetch(`${ActionsUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      const featureActions = responseData.featureActions
      return featureActions;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchFeaturesAddUrl = async (data) => {
    try {
      const response = await fetch(`${FeaturesAddUrl}`, {
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
  export const fetchFeaturesDeleteUrl = async (data) => {
    try {
      const response = await fetch(`${FeaturesDeleteUrl}`, {
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
  export const fetchFeaturesUpdateUrl = async (data) => {
    try {
      const response = await fetch(`${FeaturesUpdateUrl}`, {
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
  export const fetchFeatureDetailsUrl = async (id) => {
    try {
      const response = await fetch(`${FeatureDetailsUrl}?featureid=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      const feature = responseData.feature;
      return feature;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchActionsAddUrl = async (data) => {
    try {
      const response = await fetch(`${ActionsAddUrl}`, {
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
  export const fetchActionsDeleteUrl = async (data) => {
    try {
      const response = await fetch(`${ActionsDeleteUrl}`, {
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
  export const fetchActionsUpdateUrl = async (data) => {
    try {
      const response = await fetch(`${ActionsUpdateUrl}`, {
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
  export const fetchActionTypesUrl = async (OrgId) => {
    try {
      const response = await fetch(`${ActionTypesUrl}`, {
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
  // export const fetchFeaturesUrl = async (data) => {
  //   try {
  //     const response = await fetch(`${FeaturesUrl}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         ...data,
  //       }),
  //     });
  
  //     const responseData = await response.json();
  //     const features = responseData.features;
  //     return features;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  