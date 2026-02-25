import { API } from '../../config/apiConfig'
import FetchWithToken from '../modules/auth/FetchWithToken'
const ExclusionListUrl = API.EXCLUSION_LIST
const BlokckedListUrl = API.BLOCKED_LIST
const AccountDetailsUrl = API.ACCOUNT_DETAILS
const PolicyDetailsUrl = API.POLICY_DETAILS
const blockedListItemDeleteUrl = API.BLOCKEDLIST_DELETE
const AddToblockListUrl = API.BLOCKEDLIST_ADD
const blockedListItemUpdateUrl = API.BLOCKEDLIST_UPDATE
const AddToExclusionListUrl = API.EXCLUSION_ADD
const ExcludedListItemDeleteUrl = API.EXCLUSION_DELETE
const ExcludedListItemUpdateUrl = API.EXCLUSION_UPDATE
const GroupActionUrl = API.AGENT_GROUP_ACTION
const SoftwarePackagesUpdateUrl = API.SOFTWARE_PACKAGES_UPDATE
const BlockedListImportUrl = API.BLOCKEDLIST_IMPORT
const BlockedListImportReportUrl = API.BLOCKEDLIST_IMPORT_REPORT
const ExclusionItemsImportUrl = API.EXCLUSION_IMPORT
const ExclusionItemsImportReportUrl = API.EXCLUSION_IMPORT_REPORT
const GroupsUrl = API.GROUPS
const GroupsCreateUrl = API.GROUPS_CREATE
const UpgradePoliciesUrl = API.UPGRADE_POLICIES
const AvailablePackagesUrl = API.UPGRADE_POLICY_AVAILABLE_PACKAGES
const UpgradePolicyUrl = API.UPGRADE_POLICY
const ParentUpgradePoliciesUrl = API.PARENT_UPGRADE_POLICIES
const UpgradePolicyActionsUrl = API.UPGRADE_POLICY_ACTIONS
const UpgradePoliciesSetInheritingUrl = API.UPGRADE_POLICIES_SET_INHERITING
const UpgradePoliciesDeActivateUrl = API.UPGRADE_POLICIES_DEACTIVATE
const TagsUrl = API.SENTINEL_TAGS
const TagAddUrl = API.SENTINEL_TAG_ADD
const TagUpdateUrl = API.SENTINEL_TAG_UPDATE
const TagsDeleteUrl = API.SENTINEL_TAG_DELETE
const TagsActionsUrl = API.SENTINEL_TAG_ACTIONS
const UpgradeMaintenanceDetailsUrl = API.UPGRADE_MAINTENANCE_DETAILS
const UpgradeMaintenanceDetailsUpdateUrl = API.UPGRADE_MAINTENANCE_DETAILS_UPDATE
const SentinalOnePolicyUpdateUrl = API.POLICY_UPDATE
const PolicyDeepVisiblityConfigurtionRefreshUrl = API.POLICY_DEEP_VISIBILITY_REFRESH

export const fetchExclusionListUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ExclusionListUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    // const exclusionList = responseData.exclusionList;
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchBlokckedListUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${BlokckedListUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    // const blockedItemList = responseData.blockedItemList;
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchAccountDetailsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${AccountDetailsUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    const accounts = responseData.accounts
    return accounts
  } catch (error) {
    console.log(error)
  }
}
export const fetchPolicyDetailsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${PolicyDetailsUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    const result = responseData.data
    return result
  } catch (error) {
    console.log(error)
  }
}
export const fetchblockedListItemDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${blockedListItemDeleteUrl}`, {
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
export const fetchAddToblockListUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${AddToblockListUrl}`, {
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
export const fetchblockedListItemUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${blockedListItemUpdateUrl}`, {
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
export const fetchAddToExclusionListUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${AddToExclusionListUrl}`, {
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
export const fetchExcludedListItemDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ExcludedListItemDeleteUrl}`, {
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
export const fetchExcludedListItemUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ExcludedListItemUpdateUrl}`, {
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
export const fetchGroupActionUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${GroupActionUrl}`, {
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
export const fetchGroupsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${GroupsUrl}`, {
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
export const fetchSoftwarePackagesUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${SoftwarePackagesUpdateUrl}`, {
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
export const fetchBlockedListImportUrl = async (formData) => {
  try {
    const response = await FetchWithToken(`${BlockedListImportUrl}`, {
      method: 'POST',
      body: formData,
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchBlockedListImportReportUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${BlockedListImportReportUrl}`, {
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
export const fetchExclusionItemsImportUrl = async (formData) => {
  try {
    const response = await FetchWithToken(`${ExclusionItemsImportUrl}`, {
      method: 'POST',
      body: formData,
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchExclusionItemsImportReportUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ExclusionItemsImportReportUrl}`, {
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
export const fetchGroupsCreateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${GroupsCreateUrl}`, {
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
export const fetchUpgradePoliciesUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${UpgradePoliciesUrl}`, {
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
export const fetchAvailablePackagesUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${AvailablePackagesUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    const result = responseData.data.packages
    return result
  } catch (error) {
    console.log(error)
  }
}
export const fetchUpgradePolicyUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${UpgradePolicyUrl}`, {
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
export const fetchParentUpgradePoliciesUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ParentUpgradePoliciesUrl}`, {
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
export const fetchUpgradePolicyActionsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${UpgradePolicyActionsUrl}`, {
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
export const fetchUpgradePoliciesSetInheritingUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${UpgradePoliciesSetInheritingUrl}`, {
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
export const fetchUpgradePoliciesDeActivateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${UpgradePoliciesDeActivateUrl}`, {
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
export const fetchTagsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${TagsUrl}`, {
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
export const fetchTagAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${TagAddUrl}`, {
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
export const fetchTagUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${TagUpdateUrl}`, {
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
export const fetchTagsDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${TagsDeleteUrl}`, {
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
export const fetchTagsActionsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${TagsActionsUrl}`, {
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
export const fetchUpgradeMaintenanceDetailsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${UpgradeMaintenanceDetailsUrl}`, {
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
export const fetchUpgradeMaintenanceDetailsUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${UpgradeMaintenanceDetailsUpdateUrl}`, {
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
export const fetchSentinalOnePolicyUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${SentinalOnePolicyUpdateUrl}`, {
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
export const fetchPolicyDeepVisiblityConfigurtionRefreshUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${PolicyDeepVisiblityConfigurtionRefreshUrl}`, {
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
