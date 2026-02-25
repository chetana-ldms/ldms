import {API} from '../../config/apiConfig'
import FetchWithToken from '../modules/auth/FetchWithToken'

const FeaturesUrl = API.FEATURES
const OrganizationToolsUrl = API.ORGANIZATION_TOOLS_SECURITY
const OrganizationRolesUrl = API.ORGANIZATION_ROLES
const FeaturesActionsAuthorizedAccessUrl = API.FEATURES_ACTIONS_AUTHORIZED
const FeaturesActionsAuthorizationConfigurationUrl = API.FEATURES_ACTIONS_AUTH_CONFIG
const FeaturesListUrl = API.FEATURES_LIST
const ActionsUrl = API.ACTIONS
const FeaturesAddUrl = API.FEATURES_ADD
const FeaturesDeleteUrl = API.FEATURES_DELETE
const FeaturesUpdateUrl = API.FEATURES_UPDATE
const FeatureDetailsUrl = API.FEATURE_DETAILS
const ActionsAddUrl = API.ACTIONS_ADD
const ActionsDeleteUrl = API.ACTIONS_DELETE
const ActionsUpdateUrl = API.ACTIONS_UPDATE
const ActionTypesUrl = API.ACTION_TYPES
const AuthUserlockedUrl = API.AUTH_USER_LOCKED
const AuthUserUnlockUrl = API.AUTH_USER_UNLOCK

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
