import FetchWithToken from "../modules/auth/FetchWithToken"

const FeaturesUrl = process.env.REACT_APP_FEATURES_URL
const OrganizationToolsUrl = process.env.REACT_APP_ORGANIZATION_TOOLS_SECURITY_URL
const OrganizationRolesUrl = process.env.REACT_APP_ORGANIZATION_ROLES_URL
const FeaturesActionsAuthorizedAccessUrl = process.env.REACT_APP_FEATURES_ACTIONS_AUTHORIZED_URL
const FeaturesActionsAuthorizationConfigurationUrl =
  process.env.REACT_APP_FEATURES_ACTIONS_AUTHORIZATION_CONFIGURATION_URL
const FeaturesListUrl = process.env.REACT_APP_FEATURES_LIST_URL
const ActionsUrl = process.env.REACT_APP_ACTIONS_URL
const FeaturesAddUrl = process.env.REACT_APP_FEATURES_ADD_URL
const FeaturesDeleteUrl = process.env.REACT_APP_FEATURES_DELETE_URL
const FeaturesUpdateUrl = process.env.REACT_APP_FEATURES_UPDATE_URL
const FeatureDetailsUrl = process.env.REACT_APP_FEATURES_DETAILS_URL
const ActionsAddUrl = process.env.REACT_APP_ACTIONS_ADD_URL
const ActionsDeleteUrl = process.env.REACT_APP_ACTIONS_DELETE_URL
const ActionsUpdateUrl = process.env.REACT_APP_ACTIONS_UPDATE_URL
const ActionTypesUrl = process.env.REACT_APP_ACTIONSTYPES_URL
const AuthUserlockedUrl="http://10.41.3.232:501/api/Auth/User/locked"
const AuthUserUnlockUrl = "http://10.41.3.232:501/api/Auth/User/Unlock"

export const fetchFeaturesUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${FeaturesUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    const features = responseData.features
    return features
  } catch (error) {
    console.log(error)
  }
}
export const fetchOrganizationToolsSecurityUrl = async (OrgId) => {
  try {
    const response = await FetchWithToken(`${OrganizationToolsUrl}?OrgId=${OrgId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const tools = responseData.tools
    return tools
  } catch (error) {
    console.log(error)
  }
}
export const fetchOrganizationRolesUrl = async (OrgId) => {
  try {
    const response = await FetchWithToken(`${OrganizationRolesUrl}?OrgId=${OrgId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const rolesList = responseData.rolesList
    return rolesList
  } catch (error) {
    console.log(error)
  }
}
export const fetchFeaturesActionsAuthorizedAccessUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${FeaturesActionsAuthorizedAccessUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    const featureActions = responseData.featureActions
    return featureActions
  } catch (error) {
    console.log(error)
  }
}
export const fetchFeaturesActionsAuthorizationConfigurationUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${FeaturesActionsAuthorizationConfigurationUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchFeaturesListUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${FeaturesListUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchActionsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ActionsUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    const featureActions = responseData.featureActions
    return featureActions
  } catch (error) {
    console.log(error)
  }
}
export const fetchFeaturesAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${FeaturesAddUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchFeaturesDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${FeaturesDeleteUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchFeaturesUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${FeaturesUpdateUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchFeatureDetailsUrl = async (id) => {
  try {
    const response = await FetchWithToken(`${FeatureDetailsUrl}?featureid=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const feature = responseData.feature
    return feature
  } catch (error) {
    console.log(error)
  }
}
export const fetchActionsAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ActionsAddUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchActionsDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ActionsDeleteUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchActionsUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ActionsUpdateUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchActionTypesUrl = async (OrgId) => {
  try {
    const response = await FetchWithToken(`${ActionTypesUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchAuthUserlockedUrl = async (OrgId) => {
  try {
    const response = await FetchWithToken(`${AuthUserlockedUrl}?OrgId=${OrgId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const tools = responseData.usersList
    return tools
  } catch (error) {
    console.log(error)
  }
}
export const fetchAuthUserUnlockUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${AuthUserUnlockUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}