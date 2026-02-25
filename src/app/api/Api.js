import axios from 'axios'
import FetchWithToken from '../modules/auth/FetchWithToken'
import { API } from '../../config/apiConfig'
const masterDataUrl = API.MASTER_DATA
const organizationsUrl = API.ORGANIZATIONS
const authenticateUrl = API.AUTHENTICATE
const refreshToken = API.REFRESH_TOKEN
const updateAlertUrl = API.UPDATE_ALERT
const setAlertIrrelevantStatusUrl = API.SET_ALERT_IRRELEVANT
const toolTypeActionDeleteUrl = API.TOOL_TYPE_ACTION_DELETE
const organizationDeleteUrl = API.ORGANIZATION_DELETE
const ldpToolsDeleteUrl = API.LDP_TOOLS_DELETE
const organizationToolsDeleteUrl = API.ORGANIZATION_TOOLS_DELETE
const userDeleteUrl = API.USER_DELETE
const toolActionDeleteUrl = API.TOOL_ACTION_DELETE
const rulesDeleteUrl = API.RULES_DELETE
const ruleActionDeleteUrl = API.RULE_ACTION_DELETE
const ldpToolsUrl = API.LDP_TOOLS
const rolesUrl = API.ROLES
const organizationDetailsUrl = API.ORGANIZATION_DETAILS
const ldpToolDetailsUrl = API.LDP_TOOL_DETAILS
const forgatePasswordUrl = API.PASSWORD_RESET_ADD
const accountsStructureUrl = API.ACCOUNTS_STRUCTURE
const LogoutAddUrl = API.LOGOUT_ADD
const APITokenExpireUrl = API.API_TOKEN_EXPIRE
const FeaturesAuthorizedUrl = API.FEATURES_AUTHORIZED
const FeaturesActionsAuthorizedUrl = API.FEATURES_ACTION_AUTHORIZED
const AgentActionUrl = API.AGENT_ACTION
const AuthUserVerifyOTPUrl = API.USER_VERIFY_OTP
const AuthUserResendOTPUrl = API.USER_RESEND_OTP
const TicketManagementToolUrl = API.ORGANIZATION_TOOLS_BY_TYPE
const ExportDataAddUrl = API.EXPORT_DATA_ADD

export const fetchMasterData = async (data) => {
  try {
    const response = await FetchWithToken(`${masterDataUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()
    return responseData.masterData.map((obj) => obj)
  } catch (error) {
    console.log(error)
  }
}

export const fetchAuthenticate = async (userName, password, orgName) => {
  try {
    const response = await fetch(`${authenticateUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: userName,
        password: password,
        orgName: orgName,
      }),
    })

    const responseData = await response.json()
    console.log('responseData', responseData)
    return responseData
  } catch (error) {
    console.log(error)
  }
}

export const fetchrefreshToken = async (refreshtoken, userName) => {
  try {
    const response = await FetchWithToken(
      `${refreshToken}?refreshtoken=${refreshtoken}&username=${userName}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshtoken,
          userName,
        }),
      }
    )
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}

export const fetchOrganizations = async () => {
  try {
    const response = await FetchWithToken(`${organizationsUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    return responseData.organizationList
  } catch (error) {
    console.log(error)
  }
}
export const fetchUpdateAlert = async (data) => {
  try {
    const response = await FetchWithToken(`${updateAlertUrl}`, {
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
export const fetchUpdatSetAlertIrrelavantStatuseAlert = async (data) => {
  try {
    const response = await FetchWithToken(`${setAlertIrrelevantStatusUrl}`, {
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
export const fetchToolTypeActionDelete = async (data) => {
  try {
    const response = await FetchWithToken(`${toolTypeActionDeleteUrl}`, {
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
export const fetchOrganizationDelete = async (data) => {
  try {
    const response = await FetchWithToken(`${organizationDeleteUrl}`, {
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
export const fetchLDPToolsDelete = async (data) => {
  try {
    const response = await FetchWithToken(`${ldpToolsDeleteUrl}`, {
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
export const fetchOrganizationToolsDelete = async (data) => {
  try {
    const response = await FetchWithToken(`${organizationToolsDeleteUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    console.log(responseData, 'responseData111')
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchUserDelete = async (data) => {
  try {
    const response = await FetchWithToken(`${userDeleteUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    console.log(responseData, 'responseData111')
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchToolActionDelete = async (data) => {
  try {
    const response = await FetchWithToken(`${toolActionDeleteUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    console.log(responseData, 'responseData111')
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchRulesDelete = async (data) => {
  try {
    const response = await FetchWithToken(`${rulesDeleteUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    console.log(responseData, 'responseData111')
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchRuleActionDelete = async (data) => {
  try {
    const response = await FetchWithToken(`${ruleActionDeleteUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    console.log(responseData, 'responseData111')
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchLDPTools = async () => {
  try {
    const response = await FetchWithToken(`${ldpToolsUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const result = responseData.ldpToolsList
    return result
  } catch (error) {
    console.log(error)
  }
}
export const fetchOrganizationDetails = async (
  id,
  orgNameRef,
  addressRef,
  mobileNoRef,
  emailRef
) => {
  try {
    const response = await FetchWithToken(`${organizationDetailsUrl}?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const organizationData = responseData.organizationData
    orgNameRef.current.value = organizationData.orgName
    addressRef.current.value = organizationData.address
    mobileNoRef.current.value = organizationData.mobileNo
    emailRef.current.value = organizationData.email
    return organizationData
  } catch (error) {
    console.log(error)
  }
}
export const fetchLDPToolDetails = async (id, toolNameRef) => {
  try {
    const response = await FetchWithToken(`${ldpToolDetailsUrl}?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const ldpTool = responseData.ldpTool
    console.log(ldpTool, 'ldpTool') // Output the fetched data to the console
    // Populate the form fields with the retrieved data
    toolNameRef.current.value = ldpTool.toolName
    // toolTypeRef.current.value = ldpTool.toolType;
    return ldpTool
  } catch (error) {
    console.log(error)
  }
}

export const fetchRoles = async (orgId) => {
  try {
    const response = await FetchWithToken(`${rolesUrl}?orgId=${orgId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orgId,
      }),
    })
    const responseData = await response.json()
    const rolesList = responseData.rolesList
    console.log(rolesList, 'rolesList')
    return rolesList
  } catch (error) {
    console.log(error)
  }
}
export const fetchForgatePassword = async (userName, orgName, createdDate) => {
  try {
    const response = await fetch(`${forgatePasswordUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: userName,
        orgName: orgName,
        createdDate: createdDate,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}

export const fetchAccountsStructureUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${accountsStructureUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    const result = responseData.accounts
    return result
  } catch (error) {
    console.log(error)
  }
}

export const fetchLogoutAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${LogoutAddUrl}`, {
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

export const fetchAPITokenExpireUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${APITokenExpireUrl}`, {
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
export const fetchExportDataAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ExportDataAddUrl}`, {
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
export const fetchFeaturesAuthorizedUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${FeaturesAuthorizedUrl}`, {
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
export const fetchFeaturesActionsAuthorizedUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${FeaturesActionsAuthorizedUrl}`, {
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
export const fetchAgentActionUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${AgentActionUrl}`, {
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
export const fetchAuthUserVerifyOTPUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${AuthUserVerifyOTPUrl}`, {
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
export const fetchAuthUserResendOTPUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${AuthUserResendOTPUrl}`, {
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
export const fetchTicketManagementToolUrl = async (orgId) => {
  try {
    const response = await FetchWithToken(
      `${TicketManagementToolUrl}?orgId=${orgId}&toolType=TicketManagement`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const responseData = await response.json()
    const organizationToolList = responseData?.organizationToolList
    return organizationToolList
  } catch (error) {
    console.log(error)
  }
}
