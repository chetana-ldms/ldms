import {API} from '../../config/apiConfig'
import FetchWithToken from '../modules/auth/FetchWithToken'

const ldptoolsByToolTypeUrl = API.LDPTOOLS_BY_TOOLTYPE
const toolTypeActionDetailsUrl = API.TOOLTYPEACTION_DETAILS
const userDetailsUrl = API.USER_DETAILS
const toolActionDetailsUrl = API.TOOL_ACTION_DETAILS
const organizationToolDetailsUrl = API.ORGANIZATION_TOOL_DETAILS
const rulesUrl = API.RULES
const ruleDetailsUrl = API.RULE_DETAILS
const ruleActionsUrl = API.RULE_ACTIONS
const ruleActionDetailsUrl = API.RULE_ACTION_DETAILS
const toolActionsUrl = API.TOOL_ACTIONS
const ToolTypeActionsUrl = API.TOOL_TYPE_ACTIONS
const GetToolActionsByToolURL = API.GET_TOOL_ACTIONS_BY_TOOL
const ToolTypeActionUpdateUrl = API.TOOL_TYPE_ACTION_UPDATE
const ToolTypeActionAddUrl = API.TOOL_TYPE_ACTION_ADD
const OrganizationsUrl = API.ORGANIZATIONS
const OrganizationAddUrl = API.ORGANIZATION_ADD
const OrganizationUpdateUrl = API.ORGANIZATION_UPDATE
const UsersUrl = API.USERS
const UserAddUrl = API.USER_ADD
const UserUpdateUrl = API.USER_UPDATE
const RolesUrl = API.ROLES
const RolesAddUrl = API.ROLES_ADD
const RolesUpdateUrl = API.ROLES_UPDATE
const RolesDeleteUrl = API.ROLES_DELETE
const RolesDetailUrl = API.ROLE_DETAILS
const LDPToolsUrl = API.LDPTOOLS
const LDPToolsAddUrl = API.LDPTOOLS_ADD
const LDPToolsUpdateUrl = API.LDPTOOLS_UPDATE
const ToolActionsUrl = API.TOOL_ACTIONS
const ToolActionAddUrl = API.TOOL_ACTION_ADD
const ToolActionUpdateUrl = API.TOOL_ACTION_UPDATE
const OrganizationToolsUrl = API.ORGANIZATION_TOOLS
const OrganizationToolsAddUrl = API.ORGANIZATION_TOOLS_ADD
const OrganizationToolsUpdateUrl = API.ORGANIZATION_TOOLS_UPDATE
const RuleCatagoriesUrl = API.RULE_ENGINE_MASTERDATA
const RulesAddUrl = API.RULE_ADD
const RulesUpdateUrl = API.RULE_UPDATE
const RuleActionUrl = API.RULE_ACTION_ADD
const RuleActionUpdateUrl = API.RULE_ACTION_UPDATE
const AllMasterDataUrl = API.ALL_MASTER_DATA
const AllMasterDataManageUrl = API.MASTERDATA_MANAGE
const AllMasterDataDeleteUrl = API.MASTERDATA_DELETE
const ConfigurationDataUrl = API.CONFIGURATION_DATA
const ConfigurationDataDeleteUrl = API.CONFIGURATION_DATA_DELETE
const ConfigurationDataManageUrl = API.CONFIGURATION_DATA_MANAGE
const APIAuthDataDetailsUrl = API.APIAUTH_DETAILS
const APIAuthDataAddUrl = API.APIAUTH_ADD
const APIAuthDataDeleteUrl = API.APIAUTH_DELETE
const APIAuthDataUpdateUrl = API.APIAUTH_UPDATE
const ToolMasterDataUrl = API.TOOL_MASTER_DATA
const AllUsersUrl = API.ALL_USERS
const IncidentClientsUrl = API.INCIDENT_CLIENTS
const ManageSignatureUrl = API.USER_MANAGE_SIGNATURE
const SignatureUrl = API.USER_SIGNATURE

export const fetchLDPToolsByToolType = async (data) => {
  try {
    const response = await FetchWithToken(`${ldptoolsByToolTypeUrl}`, {
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
export const fetchToolTypeActionDetails = async (id, toolNameRef) => {
  try {
    const response = await FetchWithToken(`${toolTypeActionDetailsUrl}?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const toolTypeAction = responseData.toolTypeAction
    console.log(toolTypeAction, 'toolTypeAction')
    // Populate the form fields with the retrieved data
    toolNameRef.current.value = toolTypeAction.toolAction
    // toolTypeRef.current.value = ldpTool.toolType;
    return toolTypeAction
  } catch (error) {
    console.log(error)
  }
}

export const fetchUserDetails = async (
  id,
  userName,
  emailId,
  mapUserName,
  mapuserId,
  empId,
  jobTitle,
  mobileNumber
) => {
  try {
    const response = await FetchWithToken(`${userDetailsUrl}?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const userdata = responseData.userdata
    console.log(userdata, 'userdata')
    userName.current.value = userdata.name
    emailId.current.value = userdata.emailId
    mapUserName.current.value = userdata.mapUserName
    mapuserId.current.value = userdata.mapUserId
    empId.current.value = userdata.empId
    jobTitle.current.value = userdata.jobTitle
    mobileNumber.current.value = userdata.mobileNumber
    return userdata
  } catch (error) {
    console.log(error)
  }
}
export const fetchToolActionDetails = async (id) => {
  try {
    const response = await FetchWithToken(`${toolActionDetailsUrl}?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const toolAcation = responseData.toolAcation
    return toolAcation
  } catch (error) {
    console.log(error)
  }
}

export const fetchOrganizationToolDetails = async (id) => {
  try {
    const response = await FetchWithToken(`${organizationToolDetailsUrl}?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const organizationToolData = responseData.organizationToolData
    return organizationToolData
  } catch (error) {
    console.log(error)
  }
}
export const fetchRules = async (data) => {
  try {
    const response = await FetchWithToken(`${rulesUrl}`, {
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

export const fetchRuleDetails = async (data) => {
  try {
    const response = await FetchWithToken(ruleDetailsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ruleId: data.ruleID,
      }),
    })

    const responseData = await response.json()
    return responseData?.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const fetchRuleActions = async (orgId) => {
  try {
    const response = await FetchWithToken(`${ruleActionsUrl}?orgId=${orgId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const ruleActionList = responseData.ruleActionList
    console.log(ruleActionList, 'ruleActionList')
    return ruleActionList
  } catch (error) {
    console.log(error)
  }
}
export const fetchToolActions = async () => {
  try {
    const response = await FetchWithToken(`${toolActionsUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const toolAcationsList = responseData.toolAcationsList
    return toolAcationsList
  } catch (error) {
    console.log(error)
  }
}
export const fetchRuleActionDetails = async (id) => {
  try {
    const response = await FetchWithToken(`${ruleActionDetailsUrl}?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const ruleActionData = responseData.ruleActionData
    // Populate the form fields with the retrieved data
    //   toolNameRef.current.value = toolTypeAction.toolAction;
    // toolTypeRef.current.value = ldpTool.toolType;
    return ruleActionData
  } catch (error) {
    console.log(error)
  }
}
export const fetchGetToolActionsByToolURL = async (data) => {
  try {
    const response = await FetchWithToken(`${GetToolActionsByToolURL}`, {
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

export const fetchToolTypeActions = async () => {
  try {
    const response = await FetchWithToken(`${ToolTypeActionsUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const toolTypeActionsList = responseData.toolTypeActionsList
    return toolTypeActionsList
  } catch (error) {
    console.log(error)
  }
}
export const fetchToolTypeActionUpdate = async (data) => {
  try {
    const response = await FetchWithToken(`${ToolTypeActionUpdateUrl}`, {
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
export const fetchToolTypeActionAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ToolTypeActionAddUrl}`, {
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
export const fetchOrganizationsUrl = async () => {
  try {
    const response = await FetchWithToken(`${OrganizationsUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const organizationList = responseData.organizationList
    return organizationList
  } catch (error) {
    console.log(error)
  }
}
export const fetchOrganizationAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${OrganizationAddUrl}`, {
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
export const fetchOrganizationUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${OrganizationUpdateUrl}`, {
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
export const fetchUsersUrl = async (orgId, userID) => {
  try {
    const response = await FetchWithToken(`${UsersUrl}?orgId=${orgId}&userid=${userID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orgId,
        userID,
      }),
    })
    const responseData = await response.json()
    const usersList = responseData?.usersList
    return usersList
  } catch (error) {
    console.log(error)
  }
}

export const fetchRolesUrl = async (orgId, userID) => {
  try {
    const response = await FetchWithToken(`${RolesUrl}?orgId=${orgId}&userid=${userID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orgId,
        userID,
      }),
    })
    const responseData = await response.json()
    const rolesList = responseData.rolesList
    return rolesList
  } catch (error) {
    console.log(error)
  }
}
export const fetchRolesAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${RolesAddUrl}`, {
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
export const fetchRolesUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${RolesUpdateUrl}`, {
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
export const fetchRolesDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${RolesDeleteUrl}`, {
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

export const fetchUserAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${UserAddUrl}`, {
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
export const fetchUserUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${UserUpdateUrl}`, {
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
export const fetchLDPToolsUrl = async () => {
  try {
    const response = await FetchWithToken(`${LDPToolsUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const ldpToolsList = responseData.ldpToolsList
    return ldpToolsList
  } catch (error) {
    console.log(error)
  }
}
export const fetchLDPToolsAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${LDPToolsAddUrl}`, {
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
export const fetchLDPToolsUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${LDPToolsUpdateUrl}`, {
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
export const fetchToolActionsUrl = async () => {
  try {
    const response = await FetchWithToken(`${ToolActionsUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const toolAcationsList = responseData.toolAcationsList
    return toolAcationsList
  } catch (error) {
    console.log(error)
  }
}
export const fetchToolActionAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ToolActionAddUrl}`, {
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
export const fetchToolActionUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ToolActionUpdateUrl}`, {
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
export const fetchOrganizationToolsUrl = async () => {
  try {
    const response = await FetchWithToken(`${OrganizationToolsUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const organizationToolList = responseData.organizationToolList
    return organizationToolList
  } catch (error) {
    console.log(error)
  }
}
export const fetchOrganizationToolsAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${OrganizationToolsAddUrl}`, {
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
export const fetchOrganizationToolsUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${OrganizationToolsUpdateUrl}`, {
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
export const fetchRuleCatagoriesUrl = async (MasterDataType) => {
  try {
    const url = `${RuleCatagoriesUrl}?MasterDataType=${encodeURIComponent(MasterDataType)}`
    const response = await FetchWithToken(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const masterDataList = responseData.masterDataList
    return masterDataList
  } catch (error) {
    console.log(error)
  }
}
export const fetchRulesAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${RulesAddUrl}`, {
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
export const fetchRulesUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${RulesUpdateUrl}`, {
      method: 'PUT',
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
export const fetchRuleActionUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${RuleActionUrl}`, {
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
export const fetchRuleActionUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${RuleActionUpdateUrl}`, {
      method: 'PUT',
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
export const fetchRolesDetailUrl = async (id) => {
  try {
    const response = await FetchWithToken(`${RolesDetailUrl}?id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
      }),
    })
    const responseData = await response.json()
    const roleData = responseData.roleData
    return roleData
  } catch (error) {
    console.log(error)
  }
}
export const fetchAllMasterDataUrl = async () => {
  try {
    const response = await FetchWithToken(`${AllMasterDataUrl}`, {
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
export const fetchAllMasterDataDetailUrl = async (masterdataid) => {
  try {
    const response = await FetchWithToken(`${AllMasterDataUrl}?masterdataid=${masterdataid}`, {
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
export const fetchAllMasterDataManageUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${AllMasterDataManageUrl}`, {
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
export const fetchAAllMasterDataDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${AllMasterDataDeleteUrl}`, {
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
export const fetchConfigurationDataUrl = async () => {
  try {
    const response = await FetchWithToken(`${ConfigurationDataUrl}`, {
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
export const fetchAllConfigurationDataDetailUrl = async (configurationId) => {
  try {
    const response = await FetchWithToken(
      `${ConfigurationDataUrl}?configurationId=${configurationId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchConfigurationDataDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ConfigurationDataDeleteUrl}`, {
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
export const fetchConfigurationDataManageUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ConfigurationDataManageUrl}`, {
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
export const fetchAPIAuthDataDetailsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${APIAuthDataDetailsUrl}`, {
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
export const fetchAPIAuthDataAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${APIAuthDataAddUrl}`, {
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
export const fetchAPIAuthDataDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${APIAuthDataDeleteUrl}`, {
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
export const fetchAPIAuthDataUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${APIAuthDataUpdateUrl}`, {
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
export const fetchToolMasterDataUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ToolMasterDataUrl}`, {
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
export const fetchAllUsersUrl = async (orgId, ToolId, userID) => {
  try {
    const response = await FetchWithToken(
      `${AllUsersUrl}?orgId=${orgId}&ToolId=${ToolId}&userid=${userID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orgId,
          ToolId,
          userID,
        }),
      }
    )
    const responseData = await response.json()
    const usersList = responseData?.usersList
    return usersList
  } catch (error) {
    console.log(error)
  }
}
export const fetchIncidentClientsUrl = async (orgId, ToolId, clientid) => {
  try {
    const response = await FetchWithToken(
      `${IncidentClientsUrl}?orgId=${orgId}&ToolId=${ToolId}&clientid=${clientid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const responseData = await response.json()
    const data = responseData?.data
    return data
  } catch (error) {
    console.log(error)
  }
}
export const fetchManageSignatureUrl = async (data) => {
  try {
    const response = await fetch(`${ManageSignatureUrl}`, {
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
export const fetchSignatureUrl = async (id) => {
  try {
    const response = await FetchWithToken(`${SignatureUrl}?userId=${id}`, {
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
